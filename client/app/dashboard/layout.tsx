'use client'
import { BarChart3, FileText, Megaphone, Target, Palette, Settings, CreditCard, Pen } from "lucide-react"
import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bot, Plus, ChevronDown, User, LogOut } from "lucide-react"
import Link from "next/link"

const navigationItems = [
    {
        title: "Overview",
        icon: BarChart3,
        url: "/dashboard",
    },
    {
        title: "Reporting",
        icon: FileText,
        url: "/dashboard/reporting",
    },
    {
        title: "Ads",
        icon: Megaphone,
        url: "/dashboard/ads",
    },
    {
        title: "Campaigns",
        icon: Target,
        url: "/dashboard/campaigns",
    },
    {
        title: "Create Designs & Banners",
        icon: Palette,
        url: "/dashboard/designs",
    },
    {
        title: "Create Ads Content",
        icon: Pen,
        url: "/dashboard/ads-text",
    },
    {
        title: "Settings",
        icon: Settings,
        url: "/dashboard/settings",
    },
    {
        title: "Billing & Info",
        icon: CreditCard,
        url: "/dashboard/billing",
    },
]

const organizations = [
    { id: 1, name: "Acme Marketing", type: "Agency", avatar: "AM" },
    { id: 2, name: "TechStart Inc", type: "Startup", avatar: "TI" },
    { id: 3, name: "Local Bakery", type: "Small Business", avatar: "LB" },
]

export default function RootLayout({ children }: { children: ReactNode }) {
    const [selectedOrg, setSelectedOrg] = useState(organizations[0])
    const [selectedItem, setSelectedItem] = useState(navigationItems[0])


    return (
        <SidebarProvider>
            <div className="min-h-screen bg-white flex w-full">
                <Sidebar className="border-r border-black bg-white">
                    <SidebarHeader className="border-b border-black p-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-black">
                                DiMark AI
                            </span>
                        </div>

                        {/* Organization Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between bg-white hover:bg-gray-100 border-black text-black"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-6 h-6">
                                            <AvatarFallback className="text-xs bg-black text-white">
                                                {selectedOrg.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-black">{selectedOrg.name}</p>
                                            <p className="text-xs text-gray-500">{selectedOrg.type}</p>
                                        </div>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-black" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 bg-white border-black" align="start">
                                <DropdownMenuLabel className="text-black">Switch Organization</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-black" />
                                {organizations.map((org) => (
                                    <DropdownMenuItem
                                        key={org.id}
                                        onClick={() => setSelectedOrg(org)}
                                        className="flex items-center space-x-3 p-3 text-black hover:bg-gray-100"
                                    >
                                        <Avatar className="w-6 h-6">
                                            <AvatarFallback className="text-xs bg-black text-white">
                                                {org.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-black">{org.name}</p>
                                            <p className="text-xs text-gray-500">{org.type}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator className="bg-black" />
                                <DropdownMenuItem className="flex items-center space-x-2 text-black hover:bg-gray-100">
                                    <Plus className="w-4 h-4" />
                                    <span>Add Organization</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-black uppercase tracking-wider px-3 py-2">
                                Navigation
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navigationItems.map((item, index) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={navigationItems[index].title === selectedItem.title}
                                                className="w-full justify-start px-3 py-2 text-black hover:bg-gray-100 hover:text-black data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:border-r-2 data-[active=true]:border-black"
                                                onClick={() => setSelectedItem(item)}
                                            >
                                                <Link href={item.url} className="flex items-center space-x-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-black p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start px-0 text-black">
                                    <Avatar className="w-8 h-8 mr-3">
                                        <AvatarFallback className="bg-black text-white">
                                            JD
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left flex-1">
                                        <p className="text-sm font-medium text-black">John Doe</p>
                                        <p className="text-xs text-gray-500">john@example.com</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-black" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white border-black" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal text-black">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-black">John Doe</p>
                                        <p className="text-xs leading-none text-gray-500">john@example.com</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-black" />
                                <DropdownMenuItem className="text-black hover:bg-gray-100">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-black hover:bg-gray-100">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-black" />
                                <DropdownMenuItem className="text-black hover:bg-gray-100">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <SidebarInset className="flex-1 bg-white">{children}</SidebarInset>
            </div>
        </SidebarProvider>
    );
}