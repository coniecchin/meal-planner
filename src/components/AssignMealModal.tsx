import React from 'react';
import { PlannedMeal, Recipe } from '../types';
import { X, Calendar, Check } from 'lucide-react';

interface AssignMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  plannedMeals: PlannedMeal[];
  onAssign: (dayIndex: number, recipe: Recipe) => void;
}

export const AssignMealModal: React.FC<AssignMealModalProps> = ({
  isOpen,
  onClose,
  recipe,
  plannedMeals,
  onAssign,
}) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-neutral-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Add to Weekly Plan</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select which day to cook <span className="font-semibold text-neutral-800">{recipe.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2">
          {plannedMeals.map((meal, index) => (
            <button
              key={meal.id}
              onClick={() => {
                onAssign(meal.dayIndex, recipe);
                onClose();
              }}
              className="w-full p-3 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-left flex items-center justify-between group cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold text-neutral-900">
                  Day {index + 1} ({meal.dayName})
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Currently: {meal.isSkipped ? 'Off / Leftovers' : meal.recipe.title}
                </p>
              </div>

              <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900">
                Replace →
              </span>
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
