import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Package,
  Users,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from './ui';
import logo from '../assets/logo.jpg';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'kanban', label: 'Ações (Kanban)', icon: CheckSquare },
  { id: 'finance', label: 'Financeiro', icon: DollarSign },
  { id: 'inventory', label: 'Estoque', icon: Package },
  { id: 'employees', label: 'Funcionários', icon: Users },
];

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className={cn(
        'bg-slate-900 text-white transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}>
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src={logo} alt="BaseControl Logo" className="w-10 h-10 rounded-lg object-cover" />
              <span className="font-bold text-xl tracking-tight">BaseControl</span>
            </div>
          )}
          {isCollapsed && (
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover mx-auto" />
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-slate-800 rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <tab.icon size={20} />
              {!isCollapsed && <span className="font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-400">
            <LayoutDashboard size={20} />
            {!isCollapsed && <span className="text-sm">Dashboard v1.0</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
