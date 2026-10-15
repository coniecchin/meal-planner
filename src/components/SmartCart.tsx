import React, { useState } from 'react';
import { ShoppingCart, Check, Trash2, ExternalLink, Printer, Store, Clock, AlertCircle, ArrowRight, ShieldCheck, Tag, Info } from 'lucide-react';
import { ConsolidatedCartItem, GroceryPartner } from '../types';

interface SmartCartProps {
  cartItems: ConsolidatedCartItem[];
  partners: GroceryPartner[];
  selectedPartnerId: string;
  onSelectPartner: (id: any) => void;
  onToggleItemPurchased: (id: string) => void;
  onTogglePantryOverride: (id: string) => void;
  onRemoveCartItem: (id: string) => void;
  onOpenCheckoutModal: () => void;
  pantrySavings: number;
}

export const SmartCart: React.FC<SmartCartProps> = ({
  cartItems,
  partners,
  selectedPartnerId,
  onSelectPartner,
  onToggleItemPurchased,
  onTogglePantryOverride,
  onRemoveCartItem,
  onOpenCheckoutModal,
  pantrySavings
}) => {
  const [filterAisle, setFilterAisle] = useState<string>('All');
  const activePartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  // Items to buy (excluding covered by pantry)
  const itemsToBuy = cartItems.filter(item => !item.coveredByPantry);
  const itemsCoveredByPantry = cartItems.filter(item => item.coveredByPantry);

  // Totals
  const subtotal = itemsToBuy.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const qualifiesForFreeDelivery = subtotal >= activePartner.freeDeliveryThreshold;
  const deliveryFee = qualifiesForFreeDelivery ? 0 : activePartner.deliveryFee;
  const grandTotal = subtotal + deliveryFee;
  const amountToFreeDelivery = Math.max(0, activePartner.freeDeliveryThreshold - subtotal);

  const aisles = ['All', ...Array.from(new Set(cartItems.map(i => i.aisle)))];
  const displayedItems = filterAisle === 'All' ? cartItems : cartItems.filter(i => i.aisle === filterAisle);

  return (
    <div className="space-y-6">
      {/* Top Banner & Partner Comparison */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                <ShoppingCart className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-neutral-900">
                Consolidated Grocery Cart ({itemsToBuy.length} items to order)
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-2xl leading-relaxed">
              Ingredient units have been automatically combined across all recipes.
              Select your grocer partner to synchronize cart items and calculate delivery windows.
            </p>
          </div>

          {/* Quick Partner Cards */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {partners.map((partner) => {
              const isSelected = partner.id === selectedPartnerId;
              return (
                <button
                  key={partner.id}
                  onClick={() => onSelectPartner(partner.id)}
                  className={`p-3 rounded-xl border text-left min-w-[150px] transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{partner.name}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {partner.type === 'instant' ? '⚡ Instant' : '🗓 Scheduled'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                    {subtotal >= partner.freeDeliveryThreshold ? 'Free delivery' : `+$${partner.deliveryFee.toFixed(2)} delivery`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Aisle filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {aisles.map(aisle => (
              <button
                key={aisle}
                onClick={() => setFilterAisle(aisle)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  filterAisle === aisle
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {aisle}
              </button>
            ))}
          </div>

          {/* Cart Items Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-neutral-100">
              {displayedItems.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  No ingredients found in this category.
                </div>
              ) : (
                displayedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                      item.coveredByPantry ? 'bg-neutral-50/70 text-neutral-400' : 'hover:bg-neutral-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onToggleItemPurchased(item.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          item.isPurchased
                            ? 'bg-emerald-600 text-white'
                            : 'border border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        {item.isPurchased && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold truncate ${
                            item.coveredByPantry ? 'line-through text-neutral-400' : 'text-neutral-900'
                          }`}>
                            {item.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {item.aisle}
                          </span>
                        </div>

                        {/* Used in recipes */}
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5 truncate">
                          <span>Used in: {item.usedInRecipes.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity & Units */}
                      <span className="font-mono text-xs font-semibold text-neutral-800 tabular-nums">
                        {item.totalQuantity} {item.unit}
                      </span>

                      {/* Estimated Price */}
                      <span className="font-mono text-xs text-neutral-600 tabular-nums w-14 text-right">
                        ${item.estimatedPrice.toFixed(2)}
                      </span>

                      {/* Pantry Check Toggle */}
                      <button
                        onClick={() => onTogglePantryOverride(item.id)}
                        title={item.coveredByPantry ? 'Remove pantry mark' : 'Mark as in pantry'}
                        className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
                          item.coveredByPantry
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {item.coveredByPantry ? 'In Pantry (Deducted)' : 'Have in pantry?'}
                      </button>

                      <button
                        onClick={() => onRemoveCartItem(item.id)}
                        className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Grocer Dispatch Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Store className="w-4 h-4 text-emerald-600" />
              Grocer Dispatch Manifest
            </h3>

            {/* Selected Partner Highlight */}
            <div className="mt-3.5 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">{activePartner.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-neutral-200 text-neutral-800">
                  {activePartner.type === 'instant' ? 'Instant Delivery' : 'Scheduled Delivery'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{activePartner.deliveryTime}</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Grocery Items ({itemsToBuy.length})</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {pantrySavings > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Pantry Savings Deducted</span>
                  <span className="font-mono tabular-nums">-${pantrySavings.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-neutral-600">
                <span>Estimated Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {qualifiesForFreeDelivery ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {!qualifiesForFreeDelivery && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-md">
                  Add <strong>${amountToFreeDelivery.toFixed(2)}</strong> more to get free delivery on {activePartner.name}.
                </p>
              )}

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-sm font-bold text-neutral-900">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Dispatch Action */}
            <div className="mt-5 space-y-2">
              <button
                onClick={onOpenCheckoutModal}
                disabled={itemsToBuy.length === 0}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Automate Add to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save Shopping Slip
              </button>
            </div>
          </div>

          {/* Guarantee / Value Card */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-600 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-900 block font-semibold">Zero Double-Buying Protection</strong>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Items you have flagged in your pantry remain deducted across every recalculation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
