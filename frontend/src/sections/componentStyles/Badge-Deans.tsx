import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BadgeDeans() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="animate-border bg-transparent animate-gradient bg-[length:400%_400%] bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text w-15 h-7 text-xs rounded-md hover:shadow-lg transition-shadow">Dean's Lister</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col aligns-center justify-center text-center">
        <DropdownMenuLabel>top graduate of the class!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>This student is assigned at faculty indigo building</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BadgeDeans