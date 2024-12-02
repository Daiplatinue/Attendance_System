"use client";

import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
import { useRef , ChangeEvent } from "react";

interface NameInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function NameInput({ name, value, onChange }: NameInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearInput = () => {
    onChange({ target: { value: "", name } } as ChangeEvent<HTMLInputElement>);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="input-24"
          ref={inputRef}
          className="mt-1 block w-full px-3 py-2 bg-[#141B2D] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter full name"
          type="text"
          name={name}
          value={value}
          onChange={onChange}
        />
        {value && (
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 ring-offset-background transition-shadow animate-in fade-in zoom-in-75 hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear input"
            onClick={handleClearInput}
          >
            <CircleX size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}




// import { Input } from "@/components/ui/input";
// import { CircleX } from "lucide-react";
// import { useRef, useState, ChangeEvent } from "react";

// interface NameInputProps {
//   name: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// export default function NameInput({ name, value, onChange }: NameInputProps) {
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleClearInput = () => {
//     onChange({ target: { value: "", name } } as ChangeEvent<HTMLInputElement>);
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <div className="relative">
//         <Input
//           id="input-24"
//           ref={inputRef}
//           className="mt-1 block w-full px-3 py-2 bg-[#141B2D] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           placeholder="Enter full name"
//           type="text"
//           name={name}
//           value={value}
//           onChange={onChange}
//         />
//         {value && (
//           <button
//             className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 ring-offset-background transition-shadow animate-in fade-in zoom-in-75 hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
//             aria-label="Clear input"
//             onClick={handleClearInput}
//           >
//             <CircleX size={16} strokeWidth={2} aria-hidden="true" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
