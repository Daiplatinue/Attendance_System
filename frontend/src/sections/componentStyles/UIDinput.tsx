import { Input } from "@/components/ui/input";

interface UIDinputProps {
    id: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UIDinput({ id, name, type, value, onChange }: UIDinputProps) {
    return (
        <div className="space-y-2">
            <Input 
                id={id} 
                name={name}
                type={type} 
                value={value} 
                onChange={onChange}
                className="mt-2 h-11 block w-full px-3 py-2 bg-[#141B2D] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="SCC-00-000000" 
            />
        </div>
    );
}