# PrepCart AI 🛒 🍳

**Intelligent Weekly Meal Planner & Grocer Cart Automation Engine**

Built based on the Business Model Canvas specification for busy working adults who cook at home. PrepCart AI solves dinner decision fatigue by converting weekly meal planning into an exact, pantry-deduplicated grocery basket automatically formatted for instant and scheduled delivery grocers.

---

## ✨ Features

- **Weekly Meal Planning**: Customizable profile configuration by Pax (1–6+), Days (1-day ad hoc to 7-day workweek), and weekly grocery budget.
- **AI Recipe Generator**: Powered by Gemini 3.8 Flash to synthesize balanced recipes with unified ingredient quantities, standard units, and macro nutritional breakdowns (calories, protein, carbs, fats).
- **Custom Recipe Uploader**: Paste unstructured recipe text, blog links, or ingredient lists to auto-extract ingredients and units into your weekly cart.
- **Pantry Inventory & Waste Reduction**: Deducts ingredients you already have at home from your cart, preventing duplicate purchases and tracking dollar savings.
- **Smart Consolidated Cart**: Automatically combines ingredients across all recipes into single aisle-categorized items with exact unit totals.
- **Grocer Partner Dispatch**:
  - **Instant Delivery**: GrabMart & Foodpanda (pandamart) with 25–45 min delivery calculations.
  - **Scheduled Delivery**: RedMart (Lazada), FairPrice Online, and Amazon Fresh with 2-hour delivery slot options and free-delivery threshold tracking.
  - **1-Click Add to Cart Manifest**: Generates formatted checkout payloads, direct store links, copyable itemized manifests, and printable shopping checklists.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend**: Node.js, Express, TSX
- **AI**: Google GenAI SDK (`@google/genai`, `gemini-3.8-flash`)
- **Bundler**: Vite

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/coniecchin/meal-planner.git
cd meal-planner

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY in .env

# Run development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 📄 License

Apache-2.0
