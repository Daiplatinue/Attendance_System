import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function UrlInput({ url, onUrlChange, onSave, onCancel }: UrlInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="attendanceUrl" className="text-sm text-gray-400 mb-2 block">
          Enter Google Apps Script Web App URL
        </label>
        <Input
          id="attendanceUrl"
          placeholder="https://script.google.com/macros/s/.../exec"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button className="bg-white-500/10 text-gray-300 rounded-lg hover:bg-blue-500/20 border border-gray-700 transition-all duration-200" onClick={onCancel}>Cancel</Button>
        <Button className="bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-500/20 transition-all duration-200" onClick={onSave}>Save URL</Button>
      </div>
    </div>
  );
}