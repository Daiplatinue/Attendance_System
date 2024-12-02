// consistent

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BadgeConsistent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-[1px] border-sky-500 text-sky-500 w-15 h-7 text-xs">Consistent</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col aligns-center justify-center text-center">
        <DropdownMenuLabel>Never Absent!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>This student is assigned at faculty indigo building</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BadgeConsistent