import React from 'react';
import { Sparkles, ShoppingBag, Calendar, BookOpen, BarChart3, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  activeTab: 'planner' | 'cart' | 'recipes' | 'waste';
  setActiveTab: (tab: 'planner' | 'cart' | 'recipes' | 'waste') => void;
  cartItemCount: number;
  onOpenProfile: () => void;
  onAutoGenerate: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  onOpenProfile,
  onAutoGenerate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('planner')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                Mise
              </span>
              <span className="ml-2 text-xs font-medium text-neutral-600 hidden sm:inline">
                Weekly Meal Planner
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekly Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Grocery Cart</span>
              {cartItemCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-md font-semibold">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'recipes'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Recipe Box</span>
            </button>

            <button
              onClick={() => setActiveTab('waste')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'waste'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Budget & Waste</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenProfile}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Preferences (Pax, Days, Budget, Cuisines)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={onAutoGenerate}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Generate Week</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
