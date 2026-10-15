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
