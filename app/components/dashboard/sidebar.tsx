'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Building2,
  FileText,
  LayoutDashboard,
  AlertCircle,
  DollarSign,
  Settings,
  Users,
  Shield,
  Wallet,
  CreditCard,
} from 'lucide-react'
import { ProjectSwitcher } from './project-switcher'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: Building2,
  },
  {
    name: 'Cash Flow',
    href: '/dashboard/cash-flow',
    icon: Wallet,
    badge: 'AI',
  },
  {
    name: 'Cost Guard',
    href: '/dashboard/cost-guard',
    icon: DollarSign,
    badge: 'AI',
  },
  {
    name: 'RERA Compliance',
    href: '/dashboard/rera',
    icon: Shield,
    badge: 'AI',
  },
  {
    name: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
    badge: 'AI',
  },
  {
    name: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertCircle,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

interface DashboardSidebarProps {
  userProfile: any
}

export function DashboardSidebar({ userProfile }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">BuilderOS</span>
        </Link>
      </div>

      {/* Project Switcher */}
      <div className="px-3 py-4 border-b border-slate-200">
        <ProjectSwitcher />
      </div>

      {/* Organization Name */}
      {userProfile?.organizations && (
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-medium text-slate-500">ORGANIZATION</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {userProfile.organizations.name}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs opacity-90">
            Get advanced features and priority support
          </p>
          <button className="mt-3 w-full rounded-md bg-white/20 px-3 py-2 text-sm font-medium backdrop-blur-sm hover:bg-white/30">
            Learn More
          </button>
        </div>
      </div>
    </aside>
  )
}

