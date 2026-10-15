import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, Store, Users, HeartHandshake, ShieldCheck, Sparkles, Database } from 'lucide-react';

interface CanvasInsightsModalProps {
  onSwitchToPlanner: () => void;
}

export const CanvasInsightsModal: React.FC<CanvasInsightsModalProps> = ({
  onSwitchToPlanner
}) => {
  const canvasSections = [
    {
      slide: 'Slide 1',
      title: 'Key Partners',
      icon: Store,
      description: 'Instant & Scheduled grocery fulfillment channels.',
      pdfItems: [
        'Instant delivery: GrabMart / Foodpanda',
        'Scheduled delivery: RedMart / Amazon Fresh / FairPrice (FoodPrice)'
      ],
      implementation: 'Built into Smart Cart with live partner comparison, minimum spend logic, delivery fees, and automated cart dispatch routing.'
    },
    {
      slide: 'Slide 2',
      title: 'Key Activities',
      icon: Users,
      description: 'Core onboarding and weekly interaction flows.',
      pdfItems: [
        'Customer to input meal preference (cuisine, dietary)',
        'Customer to input budget constraint',
        'Profile setting includes number of pax, days, budget'
      ],
      implementation: 'Interactive preferences control bar & modal with pax sizing (1-6+), planning horizon (1-7 days), budget gauge, and cuisine filters.'
    },
    {
      slide: 'Slide 3',
      title: 'Key Propositions',
      icon: Sparkles,
      description: 'Core value delivered to customers.',
      pdfItems: [
        'Take mental load off busy working adults on what to cook',
        'Time saving: upload recipes and AI lists needed items with units',
        'Automate "add to cart" to order directly from preferred grocer',
        'Reduce food wastage: purchase based on needed amount'
      ],
      implementation: 'Full Gemini AI weekly generator, multimodal recipe parser, unified ingredient consolidator with units, and automated grocer checkout payload.'
    },
    {
      slide: 'Slide 4',
      title: 'Customer Relationships',
      icon: HeartHandshake,
      description: 'Customer touchpoints and cadence.',
      pdfItems: [
        'Weekly planning cadence',
        'Ad hoc single-meal top-ups and impromptu dinners'
      ],
      implementation: 'Supports both recurring 5-day / 7-day weekly prep cycles and 1-day ad-hoc quick dinner runs.'
    },
    {
      slide: 'Slide 5',
      title: 'Channels',
      icon: Layers,
      description: 'Distribution and acquisition avenues.',
      pdfItems: [
        'Social media marketing',
        'Tie-up partnerships with grocery chains'
      ],
      implementation: 'Affiliate co-branded grocer selection strips, printable shopping slips, and exportable recipe cards ready for social sharing.'
    },
    {
      slide: 'Slide 6',
      title: 'Customer Segments',
      icon: Users,
      description: 'Target audience profiles.',
      pdfItems: [
        'Customers who cook at home',
        'Time-starved customers looking for fuss-free recipes',
        'Comfortable with digital tools',
        'Health-conscious individuals cooking over takeout',
        'Working adults avoiding decision fatigue'
      ],
      implementation: 'Target preset filters: Fuss-Free 20-min recipes, Macro & calorie balances, pantry deduplication, and single-click checkout.'
    },
    {
      slide: 'Slide 7 & 8',
      title: 'Cost Structure & Revenue Streams',
      icon: DollarSign,
      description: 'Financial and unit economics architecture.',
      pdfItems: [
        'Cost: Cloud/AI inference, recipe database, platform development',
        'Revenue: Subscription based (Free vs Pro) or commission based from partner grocers'
      ],
      implementation: 'Dual monetization model supported: commission attribution tags on partner dispatch + simulated subscription tier perks.'
    },
    {
      slide: 'Slide 9',
      title: 'Key Resources',
      icon: Database,
      description: 'Essential proprietary and external infrastructure.',
      pdfItems: [
        '1. Nutritional database (calories, macros, allergens)',
        '2. Recipe licensing / smart recipe parser',
        '3. User preference data system',
        '4. Inventory tracking system (pantry check)',
        '5. Grocery partners',
        '6. Delivery service partners'
      ],
      implementation: 'Full nutritional macro calculations per serving, AI recipe parser, persistent preference state, and zero-waste pantry stock engine.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Canvas PDF Blueprint Verified
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Business Model Canvas & Architecture
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Every slide from your attached 9-page specification is implemented in the live application.
              Review the implementation mapping and the checklist of items needed for full commercial production below.
            </p>
          </div>

          <button
            onClick={onSwitchToPlanner}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <span>Return to Meal Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Missing Info / Production Deployment Checklist */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-neutral-900">
              Missing Info & Commercial Inputs Needed for Production Launch
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              To move this application from high-fidelity prototype to live consumer production, here are the 4 items that can be configured:
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <span className="font-bold text-neutral-900 block mb-1">
                  1. Grocer Merchant Partner API Keys
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  Direct API credentials for GrabMart Open Platform and Lazada RedMart Seller API to inject items into authenticated customer carts directly rather than via deep-links.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <span className="font-bold text-neutral-900 block mb-1">
                  2. Localized SKU & Live Inventory Catalog
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  Regional barcode / SKU mapping feeds for specific stores (e.g. FairPrice Finest vs Xtra, pandamart dark store radius) for exact aisle price synchronization.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <span className="font-bold text-neutral-900 block mb-1">
                  3. Commercial Affiliate Agreements
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  Affiliate tracking IDs (e.g. Involve Asia, CJ Affiliate, or direct grocer agreements) to earn the 3%–8% checkout basket commission noted in Slide 8.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80">
                <span className="font-bold text-neutral-900 block mb-1">
                  4. Persistent Cloud Auth & Multi-Device Sync
                </span>
                <p className="text-neutral-600 leading-relaxed">
                  User sign-in (e.g. Google Auth / Firebase) so household members can share and update the same home pantry inventory in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9-Slide Canvas Matrix */}
      <div>
        <h3 className="text-base font-bold text-neutral-900 mb-4">
          Specification Matrix (Slides 1–9)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {canvasSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-neutral-400 font-semibold">{sec.slide}</span>
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900">{sec.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{sec.description}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">
                      PDF Canvas Sticky Notes:
                    </span>
                    <ul className="space-y-1 text-xs text-neutral-700">
                      {sec.pdfItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold leading-none mt-1">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-emerald-800 bg-emerald-50/50 p-2.5 rounded-lg">
                  <span className="font-semibold block text-emerald-950 text-[11px]">Implemented in App:</span>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-900/90">{sec.implementation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
