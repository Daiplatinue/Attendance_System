import React, { ChangeEvent } from 'react';

interface UIDinputProps {
    id: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UIDinput: React.FC<UIDinputProps> = ({ id, name, type, value, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value.toUpperCase();
        
        inputValue = inputValue.replace(/[^0-9]/g, '');
        
        if (inputValue.length <= 6) {
            inputValue = `SCC-0-${inputValue.padStart(6, '0')}`;
        } else {
            inputValue = `SCC-0-${inputValue.slice(-6)}`;
        }
        
        const newEvent = {
            ...e,
            target: {
                ...e.target,
                name: e.target.name,
                value: inputValue
            }
        };
        
        onChange(newEvent);
    };

    return (
        <div className="mt-1">
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                placeholder="SCC-0-000000"
                className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-900 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
    );
};

export default UIDinput;