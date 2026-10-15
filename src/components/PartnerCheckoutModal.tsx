import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, Copy, Check, Store, Clock, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { ConsolidatedCartItem, GroceryPartner } from '../types';

interface PartnerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ConsolidatedCartItem[];
  partner: GroceryPartner;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

export const PartnerCheckoutModal: React.FC<PartnerCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  partner,
  subtotal,
  deliveryFee,
  grandTotal
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  if (!isOpen) return null;

  const itemsToBuy = cartItems.filter(i => !i.coveredByPantry);

  const manifestText = `PrepCart Groceries Order Manifest for ${partner.name}\nDelivery: ${partner.deliveryTime}\nTotal Items: ${itemsToBuy.length}\nEstimated Cost: $${grandTotal.toFixed(2)}\n\nItems to Purchase:\n${itemsToBuy.map(i => `- ${i.name}: ${i.totalQuantity} ${i.unit} ($${i.estimatedPrice.toFixed(2)}) [${i.aisle}]`).join('\n')}`;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
    }, 1200);
  };

  // Partner store links
  const partnerLinks: Record<string, string> = {
    redmart: 'https://www.lazada.sg/redmart',
    grabmart: 'https://food.grab.com/sg/en/mart',
    fairprice: 'https://www.fairprice.com.sg',
    amazon_fresh: 'https://www.amazon.sg/alm/storefront',
    foodpanda: 'https://www.foodpanda.sg/pandamart'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Automated Cart Dispatch to {partner.name}
              </h3>
              <p className="text-xs text-neutral-500">
                Slide 1 & 3: Instant & Scheduled Grocer Partner Integration
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

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Dispatch Status Box */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-600">Partner Channel</span>
              <span className="font-semibold text-neutral-900">{partner.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-600">Fulfillment Model</span>
              <span className="font-semibold text-neutral-900">
                {partner.type === 'instant' ? 'Instant Courier (30-45m)' : 'Scheduled Cold-Chain (2-hr window)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-600">Delivery Window</span>
              <span className="font-semibold text-emerald-700">{partner.deliveryTime}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-sm font-bold text-neutral-900">
              <span>Total Payable</span>
              <span className="font-mono tabular-nums text-emerald-800">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Cart Injection Action */}
          {!isSynced ? (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">1-Click Automated Cart Sync</strong>
                  <p className="text-emerald-800/90 mt-0.5">
                    Click below to inject all {itemsToBuy.length} ingredients with corresponding quantities into {partner.name}.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulateSync}
                disabled={isSyncing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isSyncing ? (
                  <span>Syncing {itemsToBuy.length} Items to Grocer Cart...</span>
                ) : (
                  <>
                    <span>Dispatch Items to {partner.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-3 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div>
                <strong className="text-sm font-bold block text-emerald-950">Cart Injected Successfully!</strong>
                <p className="text-emerald-800 mt-1">
                  All {itemsToBuy.length} items have been added to your {partner.name} basket ready for checkout.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                <a
                  href={partnerLinks[partner.id] || 'https://www.lazada.sg/redmart'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open {partner.name} & Checkout</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Itemized Order Manifest */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-neutral-800">
                Itemized Grocery Manifest ({itemsToBuy.length} items)
              </h4>
              <button
                onClick={handleCopyManifest}
                className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy Manifest'}
              </button>
            </div>

            <div className="border border-neutral-200 rounded-xl max-h-44 overflow-y-auto divide-y divide-neutral-100 text-xs">
              {itemsToBuy.map(item => (
                <div key={item.id} className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-800">{item.name}</span>
                    <span className="text-neutral-400 text-[10px] block font-mono">{item.aisle}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-medium text-neutral-700">{item.totalQuantity} {item.unit}</span>
                    <span className="font-mono text-neutral-400 text-[10px] block">${item.estimatedPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 bg-neutral-50">
          <span>Official Grocer Affiliate API Integration</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
