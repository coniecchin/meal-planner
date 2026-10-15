import React from 'react';
import { CuisineType, DietaryRestriction, UserPreferences } from '../types';
import { GROCER_PARTNERS } from '../data/recipes';
import { X, Users, Calendar, DollarSign, Truck } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (updated: UserPreferences) => void;
}

const ALL_CUISINES: CuisineType[] = [
  'Asian',
  'Mediterranean',
  'Italian',
  'Mexican',
  'Japanese',
  'American',
  'Middle Eastern',
];

const ALL_DIETS: DietaryRestriction[] = [
  'High-Protein',
  'Low-Carb',
  'Gluten-Free',
  'Dairy-Free',
  'Vegetarian',
  'Pescatarian',
  'Quick Prep (<30 min)',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  const [form, setForm] = React.useState<UserPreferences>(preferences);

  if (!isOpen) return null;

  const toggleCuisine = (cuisine: CuisineType) => {
    setForm(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const toggleDiet = (diet: DietaryRestriction) => {
    setForm(prev => ({
      ...prev,
      dietary: prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-neutral-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Household & Meal Planning Profile</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Configure your household size, budget, and culinary preferences
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pax and Planning Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 mb-2">
                <Users className="w-4 h-4 text-neutral-500" />
                <span>Household Size (Pax)</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, pax: num }))}
                    className={`flex-1 py-2 text-xs font-mono font-medium rounded-lg border transition-colors cursor-pointer ${
                      form.pax === num
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {num} {num === 1 ? 'pax' : 'pax'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 mb-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span>Days to Plan</span>
              </label>
              <div className="flex items-center gap-2">
                {[
                  { days: 5, label: '5 Days (Mon-Fri)' },
                  { days: 7, label: '7 Days (Full Week)' },
                ].map(opt => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, plannedDays: opt.days }))}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      form.plannedDays === opt.days
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <DollarSign className="w-4 h-4 text-neutral-500" />
                <span>Weekly Grocery Budget Target</span>
              </label>
              <span className="text-sm font-mono font-bold text-neutral-900 tabular-nums">
                ${form.weeklyBudget} USD
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="250"
              step="5"
              value={form.weeklyBudget}
              onChange={e => setForm(prev => ({ ...prev, weeklyBudget: Number(e.target.value) }))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-1">
              <span>$40 min</span>
              <span>Approx ${(form.weeklyBudget / (form.plannedDays * form.pax)).toFixed(2)} / serving</span>
              <span>$250 max</span>
            </div>
          </div>

          {/* Preferred Grocer Partner */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 mb-2">
              <Truck className="w-4 h-4 text-neutral-500" />
              <span>Preferred Grocer & Delivery Method</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GROCER_PARTNERS.map(partner => (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      preferredGrocer: partner.id as any,
                      deliveryType: partner.type.toLowerCase().includes('instant') ? 'instant' : 'scheduled'
                    }))
                  }
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    form.preferredGrocer === partner.id
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{partner.name}</span>
                    <span className="text-[10px] text-neutral-500">{partner.badge}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">{partner.leadTime}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Cuisine Preferences (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_CUISINES.map(c => {
                const selected = form.cuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Dietary Goals & Restrictions
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DIETS.map(d => {
                const selected = form.dietary.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDiet(d)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Save Profile & Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
