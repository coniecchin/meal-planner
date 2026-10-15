import React from 'react';
import { GroceryItemConsolidated, PlannedMeal, UserPreferences } from '../types';
import { calculatePlanStats } from '../utils/planner';
import { 
  Leaf, 
  DollarSign, 
  Flame, 
  Sparkles, 
  PieChart, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface WasteAndBudgetPanelProps {
  plannedMeals: PlannedMeal[];
  groceryList: GroceryItemConsolidated[];
  preferences: UserPreferences;
  onOpenProfile: () => void;
  onAutoOptimize: () => void;
}

export const WasteAndBudgetPanel: React.FC<WasteAndBudgetPanelProps> = ({
  plannedMeals,
  groceryList,
  preferences,
  onOpenProfile,
  onAutoOptimize,
}) => {
  const stats = calculatePlanStats(plannedMeals, groceryList);
  const activeMeals = plannedMeals.filter(m => !m.isSkipped);
  const totalPaxMeals = activeMeals.reduce((sum, m) => sum + m.servings, 0);

  // Group grocery spend by category
  const categorySpend: Record<string, number> = {};
  groceryList
    .filter(i => !i.isInPantry)
    .forEach(item => {
      categorySpend[item.category] = (categorySpend[item.category] || 0) + item.estimatedPrice;
    });

  // Identify shared ingredients
  const sharedItems = groceryList.filter(item => item.recipesUsedIn.length > 1);

  const budgetDelta = preferences.weeklyBudget - stats.estimatedGroceryTotal;
  const isUnderBudget = budgetDelta >= 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Waste Reduction Score */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Zero-Waste Index</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              {stats.wasteScorePercent}%
            </span>
            <span className="text-xs font-medium text-emerald-700">Optimal</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            {sharedItems.length} perishable ingredients utilized across multiple meals.
          </p>
        </div>

        {/* Waste Dollars Saved */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Perishable Savings</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              ${stats.wasteSavingsAmount.toFixed(2)}
            </span>
            <span className="text-xs text-neutral-500">saved/wk</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Avoided retail pack spoilage by bundling recipes.
          </p>
        </div>

        {/* Weekly Budget Status */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Budget Status</span>
            <DollarSign className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              ${stats.estimatedGroceryTotal.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-neutral-500 tabular-nums">
              / ${preferences.weeklyBudget}
            </span>
          </div>
          <p
            className={`text-[11px] font-medium mt-2 font-mono tabular-nums ${
              isUnderBudget ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {isUnderBudget
              ? `$${budgetDelta.toFixed(2)} within budget`
              : `$${Math.abs(budgetDelta).toFixed(2)} over planned limit`}
          </p>
        </div>

        {/* Average Cost per Plate */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cost / Serving</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-neutral-900 tabular-nums">
              ${totalPaxMeals > 0 ? (stats.estimatedGroceryTotal / totalPaxMeals).toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-neutral-500">per plate</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 font-mono tabular-nums">
            Total {totalPaxMeals} home-cooked portions planned.
          </p>
        </div>
      </div>

      {/* Shared Ingredients Breakdown */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Smart Perishable Consolidation Engine</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              These ingredients are distributed across multiple dinners, eliminating half-used containers left to spoil in the fridge.
            </p>
          </div>

          <button
            onClick={onAutoOptimize}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Maximize Overlap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sharedItems.map(item => (
            <div
              key={item.id}
              className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                  <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums">
                    {item.totalAmount} {item.unit}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 space-y-1 mt-2">
                  <span className="block font-semibold text-neutral-700">Used across {item.recipesUsedIn.length} meals:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
                    {item.recipesUsedIn.map(r => (
                      <li key={r} className="truncate">{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Pantry Status:</span>
                <span className="text-neutral-700 font-medium">
                  {item.isInPantry ? 'In Pantry' : 'On Grocery Cart'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spend Breakdown & Nutrition Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Category Distribution */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-neutral-900 mb-1">Weekly Spend by Grocery Category</h2>
          <p className="text-xs text-neutral-500 mb-4">
            Estimated shopping breakdown for {preferences.preferredGrocer}.
          </p>

          <div className="space-y-3">
            {Object.entries(categorySpend).map(([cat, amount]) => {
              const pct = stats.estimatedGroceryTotal > 0
                ? Math.round((amount / stats.estimatedGroceryTotal) * 100)
                : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700">{cat}</span>
                    <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                      ${amount.toFixed(2)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-neutral-800 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nutritional Goals Summary */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <h2 className="text-sm font-bold text-neutral-900 mb-1">Nutrition & Macro Balance</h2>
          <p className="text-xs text-neutral-500 mb-4">
            Daily averages per person based on active dinner recipes.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-neutral-50 rounded-lg text-center border border-neutral-100">
              <span className="text-xs text-neutral-500 block">Avg Calories</span>
              <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                {stats.avgCalories}
              </span>
              <span className="text-[10px] text-neutral-400">kcal/meal</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-center border border-neutral-100">
              <span className="text-xs text-neutral-500 block">Avg Protein</span>
              <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                {stats.avgProtein}g
              </span>
              <span className="text-[10px] text-neutral-400">per plate</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-center border border-neutral-100">
              <span className="text-xs text-neutral-500 block">Avg Carbs</span>
              <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                {stats.avgCarbs}g
              </span>
              <span className="text-[10px] text-neutral-400">complex carbs</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg text-center border border-neutral-100">
              <span className="text-xs text-neutral-500 block">Healthy Fats</span>
              <span className="text-base font-bold font-mono text-neutral-900 tabular-nums">
                {stats.avgFat}g
              </span>
              <span className="text-[10px] text-neutral-400">olive, avocado</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Balanced Working Adult Profile</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Your weekly plan delivers high satiety protein ({stats.avgProtein}g avg) and low ultra-processed ingredients, fitting the health-conscious home cook target.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
