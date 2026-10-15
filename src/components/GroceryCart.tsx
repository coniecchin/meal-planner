import React from 'react';
import { GroceryCategory, GroceryItemConsolidated, UserPreferences } from '../types';
import { GROCER_PARTNERS } from '../data/recipes';
import { 
  Check, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Archive, 
  Share2, 
  ExternalLink,
  DollarSign,
  ChevronRight,
  Info
} from 'lucide-react';

interface GroceryCartProps {
  groceryList: GroceryItemConsolidated[];
  preferences: UserPreferences;
  onToggleCheck: (itemId: string) => void;
  onTogglePantry: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddItem: (item: { name: string; amount: number; unit: string; category: GroceryCategory; price: number }) => void;
  onGrocerSelect: (grocerName: UserPreferences['preferredGrocer']) => void;
}

export const GroceryCart: React.FC<GroceryCartProps> = ({
  groceryList,
  preferences,
  onToggleCheck,
  onTogglePantry,
  onDeleteItem,
  onAddItem,
  onGrocerSelect,
}) => {
  const [activePartnerId, setActivePartnerId] = React.useState<UserPreferences['preferredGrocer']>(
    preferences.preferredGrocer
  );
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = React.useState(false);
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemAmount, setNewItemAmount] = React.useState(1);
  const [newItemUnit, setNewItemUnit] = React.useState('pc');
  const [newItemCategory, setNewItemCategory] = React.useState<GroceryCategory>('Produce & Herbs');
  const [newItemPrice, setNewItemPrice] = React.useState(2.50);

  const selectedPartner = GROCER_PARTNERS.find(p => p.id === activePartnerId) || GROCER_PARTNERS[0];

  // Separate items into "To Buy" vs "Already in Pantry"
  const itemsToBuy = groceryList.filter(item => !item.isInPantry);
  const pantryItems = groceryList.filter(item => item.isInPantry);

  const subtotal = itemsToBuy.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const isFreeDelivery = subtotal >= selectedPartner.minSpendForFreeDelivery;
  const deliveryFee = isFreeDelivery ? 0 : selectedPartner.deliveryFee;
  const finalTotal = subtotal + deliveryFee;

  const categories: GroceryCategory[] = [
    'Produce & Herbs',
    'Meat & Seafood',
    'Dairy & Refrigerated',
    'Pantry & Grains',
    'Spices & Condiments',
  ];

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem({
      name: newItemName.trim(),
      amount: newItemAmount,
      unit: newItemUnit,
      category: newItemCategory,
      price: newItemPrice,
    });
    setNewItemName('');
    setShowAddModal(false);
  };

  const copyCartToClipboard = () => {
    const text = itemsToBuy
      .map(i => `• ${i.name} - ${i.totalAmount} ${i.unit} (Est: $${i.estimatedPrice.toFixed(2)})`)
      .join('\n');
    navigator.clipboard.writeText(
      `Weekly Grocery Order (${selectedPartner.name})\n\n${text}\n\nEstimated Subtotal: $${subtotal.toFixed(2)}`
    );
    alert('Grocery list copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Delivery Partner Selector */}
      <div className="bg-white p-5 rounded-xl border border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              Smart Consolidated Grocery Cart
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Quantities aggregated with units across all planned meals. Pantry items deducted automatically.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Item</span>
            </button>

            <button
              onClick={copyCartToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
              title="Copy list formatted with units"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Text</span>
            </button>
          </div>
        </div>

        {/* Partner Selection Strip */}
        <div className="pt-4">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-2">
            Choose Delivery Partner (Instant or Scheduled)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {GROCER_PARTNERS.map(partner => (
              <button
                key={partner.id}
                onClick={() => {
                  setActivePartnerId(partner.id as any);
                  onGrocerSelect(partner.id as any);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  activePartnerId === partner.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{partner.id}</span>
                  <span className="text-[10px] text-neutral-500">{partner.type.split(' ')[0]}</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{partner.badge}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Categorized Ingredient Aisle List */}
        <div className="lg:col-span-2 space-y-6">
          {categories.map(category => {
            const catItems = itemsToBuy.filter(i => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">{category}</span>
                  <span className="text-xs font-mono text-neutral-500 tabular-nums">
                    {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="divide-y divide-neutral-100">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 flex items-center justify-between transition-colors ${
                        item.checked ? 'bg-neutral-50/70 text-neutral-400' : 'hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleCheck(item.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            item.checked
                              ? 'bg-neutral-900 border-neutral-900 text-white'
                              : 'border-neutral-300 hover:border-neutral-400 bg-white'
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-medium ${
                                item.checked ? 'line-through text-neutral-400' : 'text-neutral-900'
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs font-mono font-semibold text-neutral-700 tabular-nums bg-neutral-100 px-1.5 py-0.5 rounded">
                              {item.totalAmount} {item.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                            <span>Used in: {item.recipesUsedIn.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-semibold text-neutral-800 tabular-nums">
                          ${item.estimatedPrice.toFixed(2)}
                        </span>

                        <button
                          onClick={() => onTogglePantry(item.id)}
                          className="px-2 py-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Mark as already in pantry (deducts from cart)"
                        >
                          In Pantry
                        </button>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
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
          })}

          {/* Items Already In Pantry Section */}
          {pantryItems.length > 0 && (
            <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-neutral-100/70 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-bold text-neutral-800">
                    Already in Home Pantry ({pantryItems.length})
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Deducted to eliminate duplicate purchases
                </span>
              </div>

              <div className="divide-y divide-neutral-200/60 p-1">
                {pantryItems.map(item => (
                  <div key={item.id} className="p-2.5 px-3 flex items-center justify-between text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-neutral-700">{item.name}</span>
                      <span className="font-mono text-neutral-500 tabular-nums">
                        ({item.totalAmount} {item.unit})
                      </span>
                    </div>

                    <button
                      onClick={() => onTogglePantry(item.id)}
                      className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout Summary & Grocer Automation */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-900">Partner Order Summary</h2>
              <span className="text-xs font-semibold text-emerald-700">
                {selectedPartner.type}
              </span>
            </div>

            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Grocer Partner</span>
                <span className="font-bold text-neutral-900">{selectedPartner.name}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Items to Purchase</span>
                <span className="font-mono tabular-nums">{itemsToBuy.length} items</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Cart Subtotal</span>
                <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Delivery</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {!isFreeDelivery && (
                <div className="p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    Add ${(selectedPartner.minSpendForFreeDelivery - subtotal).toFixed(2)} more to qualify for Free Delivery on {selectedPartner.id}.
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-neutral-900">Total Order</span>
                <span className="text-lg font-bold font-mono text-neutral-900 tabular-nums">
                  ${finalTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* One-Click Automation Action */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Automate Add to Cart ({selectedPartner.id})</span>
              </button>

              <p className="text-[10px] text-neutral-400 text-center">
                Syncs exact measured ingredients directly with {selectedPartner.name} delivery cart.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">Add Item to Grocery Cart</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greek Yogurt, Eggs, Sourdough Bread"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={newItemAmount}
                    onChange={e => setNewItemAmount(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Aisle Category</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newItemPrice}
                    onChange={e => setNewItemPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Automated Grocer Add to Cart Flow Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-neutral-900">
                  Cart Synced with {selectedPartner.name}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">
                    {itemsToBuy.length} Weekly Meal Ingredients Matched
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    {selectedPartner.leadTime}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 border border-neutral-200 rounded-lg p-3 max-h-48 overflow-y-auto bg-neutral-50 font-mono">
                {itemsToBuy.slice(0, 8).map(item => (
                  <div key={item.id} className="flex justify-between text-neutral-700 text-[11px]">
                    <span className="truncate pr-2">✓ {item.name} ({item.totalAmount} {item.unit})</span>
                    <span className="tabular-nums">${item.estimatedPrice.toFixed(2)}</span>
                  </div>
                ))}
                {itemsToBuy.length > 8 && (
                  <p className="text-[10px] text-neutral-400 pt-1 text-center font-sans">
                    + {itemsToBuy.length - 8} more items consolidated
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between font-mono pt-2">
                <span className="font-sans font-semibold text-neutral-700">Estimated Total:</span>
                <span className="font-bold text-neutral-900 text-sm tabular-nums">
                  ${finalTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  copyCartToClipboard();
                  setShowCheckoutModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                <span>Proceed to {selectedPartner.id} App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
