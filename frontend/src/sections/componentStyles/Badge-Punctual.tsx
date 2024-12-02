import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BadgePunctual() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent border-[1px] border-orange-500 text-orange-500 w-15 h-7 text-xs">Punctual</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col aligns-center justify-center text-center">
        <DropdownMenuLabel>Always on Time!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>This student is assigned at faculty indigo building</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BadgePunctual