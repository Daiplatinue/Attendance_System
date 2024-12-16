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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SwitchModal } from '@/sections/componentStyles/SwitchModal'
import { toast } from 'sonner'

import { AccountInfo } from "@/sections/MyAccountInfo"

interface UserData {
  u_fullname: string;
  u_role: string;
  u_department: string;
  u_year: string;
  u_email: string;
  u_contact: string;
  u_address: string;
}

interface Notification {
  u_fn: string;
  nt_description: string;
  ts_date: string;
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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userData, setUserData] = useState<UserData>({
    u_fullname: '',
    u_role: '',
    u_department: '',
    u_year: '',
    u_email: '',
    u_contact: '',
    u_address: ''
  });

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

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/notifications', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
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

  const handleNotificationClick = () => {
    fetchNotifications();
    setIsNotificationModalOpen(true);
  };

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsAccountModalOpen(true)}
                >
                  <UserRound />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Tags />
                  Sessions
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleNotificationClick}
                >
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

      <AccountInfo
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userData={userData}
      />

      <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{notification.u_fn}</p>
                  <p className="text-sm text-gray-600">{notification.nt_description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.ts_date).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}