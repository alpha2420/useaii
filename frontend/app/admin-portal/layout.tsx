"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Users, Shield, ClipboardList,
    Heart, Flag, MessageSquare, CreditCard,
    AlertTriangle, BarChart3, ChevronRight, LogOut
} from "lucide-react";

const navItems = [
    { href: "/admin-portal",           label: "Overview",         icon: LayoutDashboard },
    { href: "/admin-portal/analytics", label: "Analytics",        icon: BarChart3 },
    { href: "/admin-portal/users",     label: "User Management",  icon: Users },
    { href: "/admin-portal/roles",     label: "Roles & Permissions", icon: Shield },
    { href: "/admin-portal/logs",      label: "Audit Logs",       icon: ClipboardList },
    { href: "/admin-portal/health",    label: "System Health",    icon: Heart },
    { href: "/admin-portal/flags",     label: "Feature Flags",    icon: Flag },
    { href: "/admin-portal/respond",   label: "Respond to Users", icon: MessageSquare },
    { href: "/admin-portal/billing",   label: "Billing & Plans",  icon: CreditCard },
    { href: "/admin-portal/danger",    label: "Danger Zone",      icon: AlertTriangle, danger: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-30 shadow-sm">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 leading-none">Super Admin</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 leading-none">Converra Platform</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                                    ${item.danger
                                        ? isActive
                                            ? "bg-red-50 text-red-600"
                                            : "text-red-500 hover:bg-red-50"
                                        : isActive
                                            ? "bg-violet-50 text-violet-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.danger ? "text-red-500" : isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-slate-200">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                    >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        Back to Dashboard
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
