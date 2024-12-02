import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BadgeWorking() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-[1px] border-green-500 text-green-500 w-15 h-7 text-xs">Working</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col aligns-center justify-center text-center">
        <DropdownMenuLabel>Go lang ng go!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>This student is assigned at faculty indigo building</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BadgeWorking