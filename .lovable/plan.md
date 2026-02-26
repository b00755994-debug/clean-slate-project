

## Problem

`TabsContent` unmounts inactive tabs, so each time the auto-rotation switches to a new tab, the mockup component remounts from scratch, causing a visible loading flash.

## Solution

Replace `TabsContent` with a manual visibility approach: render all four tab panels simultaneously but hide inactive ones with CSS (`hidden`). This keeps all mockups mounted in the DOM at all times.

### File: `src/components/Features.tsx`

Replace the `TabsContent`-based rendering (lines 141-158) with a simple div-based approach:

- Remove `TabsContent` import (no longer needed for content panels)
- Render all tabs in parallel, using `className={activeTab === tab.id ? "space-y-6" : "hidden"}` instead of `TabsContent`
- Keep the `Tabs` and `TabsList`/`TabsTrigger` for the tab bar controls

This ensures all mockup components stay mounted and cached in the DOM, eliminating any loading flicker during auto-rotation.

