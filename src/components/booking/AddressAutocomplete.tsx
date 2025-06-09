
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

interface Prediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const AddressAutocomplete = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Start typing your address...",
  label = "Address",
  required = false,
  className = ""
}: AddressAutocompleteProps) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (value.length < 3) {
        setPredictions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('google-places-autocomplete', {
          body: { input: value }
        });

        if (error) throw error;

        setPredictions(data.predictions || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching address predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelectPrediction = async (prediction: Prediction) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('google-place-details', {
        body: { placeId: prediction.place_id }
      });

      if (error) throw error;

      onChange(data.address);
      
      if (onLocationSelect && data.latitude && data.longitude) {
        onLocationSelect({
          lat: data.latitude,
          lng: data.longitude
        });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      onChange(prediction.description);
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
      setPredictions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < predictions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : predictions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && predictions[selectedIndex]) {
          handleSelectPrediction(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor="address" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="pr-8"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {showSuggestions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              ref={el => suggestionRefs.current[index] = el}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                selectedIndex === index ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectPrediction(prediction)}
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
