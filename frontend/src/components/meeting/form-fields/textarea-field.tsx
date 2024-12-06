import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

export const TextareaField = ({ label, name, value, onChange, required }: TextareaFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1"
        required={required}
      />
    </div>
  );
};