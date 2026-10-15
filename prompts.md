# Development Prompts Log

This document records the prompts and instructions used during the development of the **Weekly Meal Planner & Smart Grocery Cart (Mise)** web application.

---

## Prompt 1: Initial Application Build

**User Request:**
> build a weekly meal plan web application that allows user to plan what to cook, refer to the jpg for details.
>
> build just the frontend for now, i will include the backend connection later .

**Context & Inputs:**
- Attachment: `vibe board.jpg` (Lean Canvas / Business Model Canvas)
- Key Canvas Specifications:
  - Mental load reduction for busy working adults
  - Number of pax, days, and weekly budget controls
  - Consolidated grocery list with units and aisle categorization
  - Instant and scheduled delivery partner options (GrabMart, FoodPanda, RedMart, Amazon Fresh, FairPrice)
  - Zero-waste optimization and shared perishable ingredient engine
  - Upload / paste weekly recipes and nutritional balance tracking

---

## Prompt 2: GitHub Repository Setup & Push

**User Request:**
> git push [REDACTED_GITHUB_PAT] @ https://github.com/kittokurrency/Weekly-Meal-Planner.git

**Actions Taken:**
- Initialized Git repository on `main` branch
- Configured user credentials
- Committed complete application codebase
- Pushed upstream to `https://github.com/kittokurrency/Weekly-Meal-Planner.git`
- Sanitized sensitive token credentials from Git configuration

---

## Prompt 3: Serverless TheMealDB & Health API Integration

**User Request:**
> add a serverless connection that pulls data from themealdb using the following endpoints:
>
> -store this in /api folder (project root level) not the src folder
> -include /heatlh.ts within that subfolder
> -not not hardcode any key, i will include them later
>
> GET https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
> # accept: application/json

**Actions Taken:**
- Created root-level `/api` directory
- Added `/api/meals.ts` proxy endpoint querying TheMealDB with dynamic `THEMEALDB_API_KEY` environment variable and `accept: application/json` headers
- Added `/api/health.ts` and `/api/heatlh.ts` endpoints
- Configured `server.ts` Express entry point mounting `/api` routes alongside Vite frontend
- Updated `RecipeBox.tsx` with a live TheMealDB browser and import mechanism
- Committed and pushed updates to GitHub repository

---

## Prompt 4: Prompts Documentation

**User Request:**
> gather all the prompts and store it in prompts.md file

**Actions Taken:**
- Created `prompts.md` documenting all chronological user prompts, parameters, and executed actions.

---

## Prompt 5: PDF Canvas Implementation & TheMealDB Serverless Integration

**User Request:**
> build me an application with attached pdf. let me know any missing info you need to build it.
> add a serverless connection that pulls data from this keyless API: https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast

**Actions Taken:**
- Built full PrepCart AI meal planning and automated grocer dispatch application implementing all 9 slides from the Business Model Canvas.
- Integrated serverless proxy endpoints for TheMealDB keyless API (`/api/meals/filter` and `/api/meals/detail/:id`) with automatic ingredient/unit parsing and aisle classification.
- Created `MealDbExplorerModal.tsx` for real-time browsing and 1-click importing of meals into weekly grocery carts.
- Pushed to `https://github.com/coniecchin/meal-planner.git`.

---

## Prompt 6: Image Loading Fix

**User Request:**
> images aren't showing, fix it.

**Actions Taken:**
- Resolved image path resolution for Vite production builds by creating centralized asset module `src/assets/images.ts` and `resolveImageUrl` resolver.
- Placed image assets into `public/images/` and mounted static Express handlers in `server.ts` for `/images` and `/src/assets/images`.
- Replaced fragile DOM-collapsing error handlers in `RecipeCard.tsx` with resilient styled fallbacks.

---

## Prompt 7: GitHub Push to coniec Branch

**User Request:**
> Git push [REDACTED_GITHUB_PAT] @ https://github.com/kittokurrency/Weekly-Meal-Planner.git.coniec

**Actions Taken:**
- Synced codebase with remote `coniec` branch on `https://github.com/kittokurrency/Weekly-Meal-Planner.git`.
- Pushed all application updates, assets, serverless connections, and documentation.

