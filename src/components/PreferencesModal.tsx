import React, { useState } from 'react';
import { X, Settings, Check, DollarSign, Users, Calendar, ChefHat, Sparkles } from 'lucide-react';
import { UserPreferences, GroceryPartner } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (updated: UserPreferences) => void;
  partners: GroceryPartner[];
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
  partners
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);

  if (!isOpen) return null;

  const availableCuisines = [
    'Asian Comfort',
    'Mediterranean',
    'Quick 20-min',
    'Japanese & Korean',
    'Italian & Pasta',
    'Plant-Based',
    'Southeast Asian Curry',
    'Mexican & Bowls'
  ];

  const availableDietary = [
    'High Protein',
    'Gluten-Free',
    'Dairy-Free',
    'Low Carb',
    'Fuss-Free Cook',
    'Nut-Free',
    'Pescatarian',
    'Vegetarian'
  ];

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter(c => c !== cuisine)
        : [...prev.cuisines, cuisine]
    }));
  };

  const toggleDietary = (item: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(item)
        ? prev.dietary.filter(d => d !== item)
        : [...prev.dietary, item]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Settings className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Customer Profile & Household Settings
              </h3>
              <p className="text-xs text-neutral-500">
                Slide 2: Set your number of pax, days, budget, and dietary preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Pax & Days & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Number of Pax
              </label>
              <select
                value={formData.pax}
                onChange={(e) => setFormData({ ...formData, pax: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={1}>1 Pax (Solo)</option>
                <option value={2}>2 Pax (Couple)</option>
                <option value={3}>3 Pax (Family of 3)</option>
                <option value={4}>4 Pax (Family of 4)</option>
                <option value={6}>6+ Pax (Large)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Days Planned
              </label>
              <select
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value={1}>1 Day (Ad-hoc dinner)</option>
                <option value={3}>3 Days (Mid-week)</option>
                <option value={5}>5 Days (Mon-Fri)</option>
                <option value={7}>7 Days (Full week)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Grocery Budget (${formData.currency})
              </label>
              <input
                type="number"
                min={20}
                max={500}
                step={5}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Preferred Grocer Partner */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
              Default Delivery Partner (Slide 1)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {partners.map(p => {
                const isSelected = formData.preferredPartner === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredPartner: p.id })}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 text-neutral-900 font-semibold'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <span className="block font-semibold">{p.name}</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      {p.type === 'instant' ? '⚡ Instant' : '🗓 Scheduled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
              Favorite Cuisines
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableCuisines.map(c => {
                const isSelected = formData.cuisines.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCuisine(c)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary & Lifestyle Presets */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
              Dietary Goals & Restrictions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableDietary.map(d => {
                const isSelected = formData.dietary.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDietary(d)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 font-medium'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
