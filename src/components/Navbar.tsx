import React from 'react';
import { ShoppingBag, Sparkles, ChefHat, Archive, FileText, Settings, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  activeTab: 'planner' | 'cart' | 'pantry' | 'canvas';
  setActiveTab: (tab: 'planner' | 'cart' | 'pantry' | 'canvas') => void;
  cartItemCount: number;
  onOpenUpload: () => void;
  onOpenPreferences: () => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartItemCount,
  onOpenUpload,
  onOpenPreferences,
  onGeneratePlan,
  isGenerating
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-emerald-700 transition-colors">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  PrepCart AI
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-neutral-500 font-normal">
                  Smart Meal & Grocer Dispatch
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean text, single line) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <button
              onClick={() => setActiveTab('planner')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'planner' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <ChefHat className="w-4 h-4" />
              Weekly Planner
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 relative ${
                activeTab === 'cart' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Smart Cart
              {cartItemCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pantry')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'pantry' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <Archive className="w-4 h-4" />
              Pantry & Zero-Waste
            </button>

            <button
              onClick={onOpenUpload}
              className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Upload Recipe
            </button>

            <button
              onClick={() => setActiveTab('canvas')}
              className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'canvas' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Canvas Specs
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPreferences}
              title="Profile & Grocery Preferences"
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onGeneratePlan}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGenerating ? 'Synthesizing...' : 'Generate Plan'}
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden items-center justify-between border-t border-neutral-100 py-2 text-xs font-medium text-neutral-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 whitespace-nowrap ${activeTab === 'planner' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Planner
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-3 py-1.5 whitespace-nowrap ${activeTab === 'cart' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Cart ({cartItemCount})
          </button>
          <button
            onClick={() => setActiveTab('pantry')}
            className={`px-3 py-1.5 whitespace-nowrap ${activeTab === 'pantry' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Pantry
          </button>
          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 whitespace-nowrap text-neutral-700"
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 whitespace-nowrap ${activeTab === 'canvas' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Canvas
          </button>
        </div>
      </div>
    </header>
  );
};
