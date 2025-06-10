
interface SaveStatusIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

const SaveStatusIndicator = ({ isSaving, lastSaved, saveError }: SaveStatusIndicatorProps) => {
  return (
    <div className="mt-2">
      {isSaving && (
        <span className="text-blue-600 flex items-center gap-1 text-sm">
          <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
          Saving to database...
        </span>
      )}
      {lastSaved && !isSaving && !saveError && (
        <span className="text-green-600 flex items-center gap-1 text-sm">
          <span className="text-green-600">✓</span>
          Saved successfully at {lastSaved.toLocaleTimeString()}
        </span>
      )}
      {saveError && !isSaving && (
        <span className="text-red-600 flex items-center gap-1 text-sm">
          <span className="text-red-600">✗</span>
          Save failed: {saveError}
        </span>
      )}
    </div>
  );
};

export default SaveStatusIndicator;
