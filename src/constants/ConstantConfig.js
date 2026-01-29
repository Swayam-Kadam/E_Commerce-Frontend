import routesConstants from "@/routes/routesConstants";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  ArrowUpNarrowWide,
  Cable,
} from "lucide-react";

export const profileMenuItems = [
  {
    id: 2,
    text: "Profile",
    link: routesConstants?.PROFILE,
  },
  {
    id: 3,
    text: "Logout",
    link: "#",
  },
];

export const sidebarMenuItems = [
  { text: "Dashboard", link: routesConstants.DASHBOARD, icon: LayoutDashboard },
  { text: "Issues", link: routesConstants.ISSUES, icon: Users },
  { text: "Deleted Issues", link: routesConstants.DELETED_ISSUES, icon: Users },
  {
    text: "Escalation",
    link: routesConstants.ESCALATION,
    icon: ArrowUpNarrowWide,
  },
  { text: "Settings", link: routesConstants.SETTING, icon: Settings },
  { text: "Sync to ACC", link: routesConstants.CONNECT, icon: Cable },
];
