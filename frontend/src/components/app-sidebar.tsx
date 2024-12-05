import * as React from "react"
import { useState, useEffect } from "react"
import { Headset } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import avatar from '../sections/assets/av3.jpg'

interface UserData {
  u_fullname: string;
  u_role: string;
  u_department: string;
  u_year: string;
  u_email: string;
  u_contact: string;
  u_address: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const data = {
    user: {
      name: userData?.u_fullname || 'Loading...',
      email: userData?.u_email || 'Loading...',
      avatar,
    },
    calendars: [
      {
        name: "Contents",
        items: [
          { label: "To-do List", url: "/todolist" },
          { label: "Dashboard", url: "/" },
          { label: "View Events", url: "/allevents" },
          { label: "Leaderboards", url: "/leaderboard" },
          { label: "Announcements", url: "/announce" },
        ],
      },
    ],
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border bg-customBlue text-white">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex justify-center items-center text-center">
              <Headset />
              <span>Contact Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}