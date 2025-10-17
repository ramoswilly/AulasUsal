'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BookCopy,
  BookMarked,
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Settings,
  Users,
} from 'lucide-react'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import placeholderImages from '@/lib/placeholder-images.json'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-9 shrink-0 lg:hidden" asChild>
              <SidebarTrigger>
                <PanelLeft className="size-5" />
              </SidebarTrigger>
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2 font-headline font-semibold text-lg">
              <Icons.logo className="size-6" />
              <span className="group-data-[collapsible=icon]:hidden">AulaSync</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip={{ children: 'Dashboard' }}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/campuses')} tooltip={{ children: 'Infraestructura' }}>
                <Link href="/campuses">
                  <Building2 />
                  <span>Infraestructura</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/academics/programs')} tooltip={{ children: 'Carreras' }}>
                    <Link href="/academics/programs">
                        <BookMarked />
                        <span>Carreras</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/academics/courses')} tooltip={{ children: 'Materias' }}>
                    <Link href="/academics/courses">
                        <BookCopy />
                        <span>Materias</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/academics/sections')} tooltip={{ children: 'Comisiones' }}>
                    <Link href="/academics/sections">
                        <Users />
                        <span>Comisiones</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-auto justify-start items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-10"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    src={placeholderImages.user_avatar.src}
                    alt="User avatar"
                    data-ai-hint={placeholderImages.user_avatar.hint}
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="font-medium text-sm leading-tight">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@aulasync.com</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
