import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select as UISelect } from "@/components/ui/select";
import { User } from "@/sections/componentStyles/types/meeting";

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: User[];
  placeholder: string;
}

export const SelectField = ({ label, name, value, onChange, options, placeholder }: SelectFieldProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <UISelect value={value} onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="mt-1 w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.u_id} value={option.u_id.toString()}>
              {option.u_fullname}
            </SelectItem>
          ))}
        </SelectContent>
      </UISelect>
    </div>
  );
};