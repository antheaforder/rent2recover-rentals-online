
interface SaveStatusIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

const SaveStatusIndicator = ({ isSaving, lastSaved, saveError }: SaveStatusIndicatorProps) => {
  return (
    <>
      {isSaving && (
        <span className="text-blue-600 flex items-center gap-1">
          <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
          Saving...
        </span>
      )}
      {lastSaved && !isSaving && !saveError && (
        <span className="text-green-600 flex items-center gap-1">
          <span className="text-green-600">✓</span>
          Last saved: {lastSaved.toLocaleTimeString()}
        </span>
      )}
      {saveError && !isSaving && (
        <span className="text-red-600 flex items-center gap-1">
          <span className="text-red-600">✗</span>
          Error: {saveError}
        </span>
      )}
    </>
  );
};

export default SaveStatusIndicator;
