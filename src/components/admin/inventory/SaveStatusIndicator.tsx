
interface SaveStatusIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
}

const SaveStatusIndicator = ({ isSaving, lastSaved, saveError }: SaveStatusIndicatorProps) => {
  return (
    <>
      {isSaving && <span className="text-blue-600"> • Saving...</span>}
      {lastSaved && !isSaving && (
        <span className="text-green-600"> • Last saved: {lastSaved.toLocaleTimeString()}</span>
      )}
      {saveError && (
        <span className="text-red-600"> • Error: {saveError}</span>
      )}
    </>
  );
};

export default SaveStatusIndicator;
