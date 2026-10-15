import React, { useState } from 'react';
import { Archive, Plus, Check, X, ShieldAlert, Sparkles, Trash2, Leaf, CheckCircle2 } from 'lucide-react';
import { PantryItem } from '../types';

interface PantryManagerProps {
  pantryItems: PantryItem[];
  onToggleInStock: (id: string) => void;
  onAddPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  onRemovePantryItem: (id: string) => void;
  pantrySavings: number;
}

export const PantryManager: React.FC<PantryManagerProps> = ({
  pantryItems,
  onToggleInStock,
  onAddPantryItem,
  onRemovePantryItem,
  pantrySavings
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Pantry & Condiments');
  const [newItemQty, setNewItemQty] = useState('');

  const categories = [
    'All Items',
    'Oils & Vinegars',
    'Spices & Seasoning',
    'Fresh Aromatics',
    'Asian Condiments',
    'Grains & Rice',
    'Herbs & Spices',
    'Dairy & Eggs',
    'Pantry & Condiments'
  ];
  const [selectedCategory, setSelectedCategory] = useState('All Items');

  const filteredItems = selectedCategory === 'All Items'
    ? pantryItems
    : pantryItems.filter(item => item.category === selectedCategory);

  const inStockCount = pantryItems.filter(i => i.inStock).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddPantryItem({
      name: newItemName.trim(),
      category: newItemCategory,
      inStock: true,
      quantityRemaining: newItemQty.trim() || 'Available'
    });

    setNewItemName('');
    setNewItemQty('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Waste Reduction Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Leaf className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-neutral-900">
                Pantry & Zero-Waste Engine
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-2xl leading-relaxed">
              Slide 3 & 9 Specification: Check what ingredients or staples you already have at home.
              PrepCart automatically deducts these from your grocery order so you only purchase what you actually need.
            </p>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 text-right sm:text-right shrink-0">
            <span className="text-[11px] font-medium text-neutral-500 block">Deduction Savings</span>
            <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
              ${pantrySavings.toFixed(2)}
            </span>
            <span className="text-[11px] text-neutral-400 block mt-0.5">
              {inStockCount} items on hand
            </span>
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-xs">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-600" />
          Add Item to Home Pantry
        </h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="e.g. Extra Virgin Olive Oil, Soy Sauce, Garlic"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50 focus:bg-white transition-all"
            />
          </div>
          <div>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-neutral-50 text-neutral-700"
            >
              <option value="Oils & Vinegars">Oils & Vinegars</option>
              <option value="Spices & Seasoning">Spices & Seasoning</option>
              <option value="Fresh Aromatics">Fresh Aromatics</option>
              <option value="Asian Condiments">Asian Condiments</option>
              <option value="Grains & Rice">Grains & Rice</option>
              <option value="Herbs & Spices">Herbs & Spices</option>
              <option value="Dairy & Eggs">Dairy & Eggs</option>
              <option value="Pantry & Condiments">Pantry & Condiments</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        </form>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pantry Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleInStock(item.id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
              item.inStock
                ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                : 'bg-white border-neutral-200 hover:border-neutral-300 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  item.inStock ? 'bg-emerald-600 text-white' : 'border border-neutral-300 bg-white'
                }`}
              >
                {item.inStock && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <div>
                <span className={`text-xs font-semibold block ${item.inStock ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  {item.name}
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  {item.category} {item.quantityRemaining ? `· ${item.quantityRemaining}` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  item.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {item.inStock ? 'In Stock (Deduct)' : 'Need to Buy'}
              </span>
              <button
                onClick={() => onRemovePantryItem(item.id)}
                className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
