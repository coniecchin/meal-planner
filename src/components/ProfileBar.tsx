import React from 'react';
import { UserPreferences } from '../types';
import { Users, Calendar, DollarSign, Leaf, ShoppingCart, SlidersHorizontal } from 'lucide-react';

interface ProfileBarProps {
  preferences: UserPreferences;
  onOpenProfile: () => void;
  estimatedGroceryTotal: number;
  wasteSavingsAmount: number;
  sharedIngredientsCount: number;
  onQuickPaxChange: (delta: number) => void;
}

export const ProfileBar: React.FC<ProfileBarProps> = ({
  preferences,
  onOpenProfile,
  estimatedGroceryTotal,
  wasteSavingsAmount,
  sharedIngredientsCount,
  onQuickPaxChange,
}) => {
  const isOverBudget = estimatedGroceryTotal > preferences.weeklyBudget;
  const budgetDiff = preferences.weeklyBudget - estimatedGroceryTotal;

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Summary Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-600">
            {/* Pax control */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-500" />
              <span>Household:</span>
              <div className="flex items-center border border-neutral-200 rounded-md overflow-hidden bg-neutral-50">
                <button
                  onClick={() => onQuickPaxChange(-1)}
                  disabled={preferences.pax <= 1}
                  className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 disabled:opacity-40 cursor-pointer"
                  title="Decrease Pax"
                >
                  -
                </button>
                <span className="px-2 py-0.5 font-mono font-semibold text-neutral-900 tabular-nums">
                  {preferences.pax} {preferences.pax === 1 ? 'pax' : 'pax'}
                </span>
                <button
                  onClick={() => onQuickPaxChange(1)}
                  disabled={preferences.pax >= 6}
                  className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 disabled:opacity-40 cursor-pointer"
                  title="Increase Pax"
                >
                  +
                </button>
              </div>
            </div>

            {/* Days */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>Cycle:</span>
              <span className="font-semibold text-neutral-900">
                {preferences.plannedDays} Days
              </span>
            </div>

            {/* Budget status */}
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-neutral-500" />
              <span>Budget:</span>
              <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                ${estimatedGroceryTotal.toFixed(2)}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="font-mono text-neutral-600 tabular-nums">
                ${preferences.weeklyBudget}
              </span>
              <span
                className={`text-[11px] font-mono tabular-nums font-medium ${
                  isOverBudget ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                ({isOverBudget ? `+$${Math.abs(budgetDiff).toFixed(2)} over` : `$${budgetDiff.toFixed(2)} remaining`})
              </span>
            </div>

            {/* Waste Reduction */}
            <div className="hidden md:flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Waste Saved:</span>
              <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                ${wasteSavingsAmount.toFixed(2)}
              </span>
              <span className="text-neutral-400 text-[11px]">
                ({sharedIngredientsCount} shared perishables)
              </span>
            </div>

            {/* Grocer Partner */}
            <div className="hidden lg:flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-neutral-500" />
              <span>Fulfillment:</span>
              <span className="font-medium text-neutral-800">
                {preferences.preferredGrocer}
              </span>
            </div>
          </div>

          {/* Right: Quick Settings action */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Setup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
