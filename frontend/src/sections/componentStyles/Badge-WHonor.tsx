import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function BadgeWHonor() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="animate-border bg-transparent animate-gradient bg-[length:400%_400%] bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text w-15 h-7 text-xs rounded-md hover:shadow-lg transition-shadow">
          With Honors
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 flex flex-col aligns-center justify-center text-center">
        <DropdownMenuLabel>Top graduate of the class!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          This student is assigned at faculty indigo building
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BadgeWHonor