import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowRightLeft,
  Bell,
  ChevronsUpDown,
  LogOut,
  Tags,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SwitchModal } from '@/sections/componentStyles/SwitchModal'
import { toast } from 'sonner'

interface UserData {
  u_fullname: string;
  u_role: string;
  u_department: string;
  u_year: string;
  u_email: string;
  u_contact: string;
  u_address: string;
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const fetchUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/introduction');
        return;
      }

      const response = await axios.get('http://localhost:3000/auth/home', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 201) {
        setUserData(response.data.user);
      } else {
        navigate('/introduction');
      }
    } catch (err) {
      navigate('/introduction');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleSwitchAccount = async (accountId: string) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const selectedAccount = accounts.find((acc: any) => acc.id === accountId);
      
      if (selectedAccount) {
        localStorage.setItem('token', selectedAccount.token);
        setIsSwitchModalOpen(false);
        toast.success('Account switched successfully');
        
        switch (selectedAccount.type) {
          case 'student':
            navigate('/');
            break;
          case 'teacher':
            navigate('/teacher');
            break;
          case 'parent':
            navigate('/parent');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching account:', error);
      toast.error('Failed to switch account');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-customBlue data-[state=open]:text-white"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={userData.u_fullname} />
                  <AvatarFallback className="rounded-lg">
                    {userData.u_fullname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userData.u_fullname}</span>
                  <span className="truncate text-xs">{userData.u_email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg hover:cursor-pointer bg-customBlue text-white"
              side={isMobile ? "bottom" : "right"}
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={userData.u_fullname} />
                    <AvatarFallback className="rounded-lg">
                      {userData.u_fullname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userData.u_fullname}</span>
                    <span className="truncate text-xs">{userData.u_email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setIsSwitchModalOpen(true)}
                >
                  <ArrowRightLeft />
                  Switch Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <UserRound />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Tags />
                  Sessions
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SwitchModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onSwitch={handleSwitchAccount}
      />
    </>
  )
}