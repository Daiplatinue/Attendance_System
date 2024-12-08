import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField = ({ label, name, type, value, onChange, required }: InputFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
      </label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 bg-gray-800 border-gray-700 text-white"
        required={required}
      />
    </div>
  );
};