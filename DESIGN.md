# The Design System Specification

## 1. Overview & Creative North Star: "The Living Ledger"

This design system is built upon the Creative North Star of **"The Living Ledger."** It rejects the static, boxy nature of traditional e-commerce in favor of a UI that feels alive, organic, and editorial. We move away from "standard" grids by using intentional white space and tonal depth to guide the eye.

The goal is to provide a sense of "Precision Vitality." We combine the professional authority of a financial tool (Deep Navy) with the vibrant energy of a fresh marketplace (Fresh Green). By utilizing asymmetrical layouts—where high-density data is balanced by expansive, breathable headers—we create a premium experience that feels curated rather than automated.

---

## 2. Color & Surface Philosophy

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section should sit directly on a `surface` background to define its territory without the "cheapening" effect of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper or frosted glass.
- **Base Layer:** `surface` (#F8F9FA) for the primary application background.
- **Secondary Areas:** `surface-container-low` (#F3F4F5) for grouping related content blocks.
- **Interactive Cards:** `surface-container-lowest` (#FFFFFF) to provide a soft, natural lift.
- **Elevated Overlays:** `surface-container-high` or `highest` for drawers and modals.

### The "Glass & Gradient" Rule
To move beyond "out-of-the-box" Material looks, use **Glassmorphism** for floating elements (like the Bottom Navigation or sticky headers). Use semi-transparent surface colors with a `backdrop-blur` (12px–20px).
*   **Signature Texture:** Primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#006D37) to `primary-container` (#2ECC71) at a 135° angle to give the UI "soul" and a tactile, premium depth.

---

## 3. Typography Scale: Editorial Authority

We pair the geometric precision of **Manrope** for high-impact display moments with the utilitarian clarity of **Inter** for data-heavy shopping tasks.

| Role | Font Family | Size | Case/Weight | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | Manrope | 3.5rem | Bold | Hero savings numbers / Value props |
| **Headline-MD** | Manrope | 1.75rem | Semi-Bold | Section titles & Category headers |
| **Title-LG** | Inter | 1.375rem | Medium | Product names in focus |
| **Body-LG** | Inter | 1rem | Regular | Descriptions & primary content |
| **Label-MD** | Inter | 0.75rem | Bold (All Caps) | Store branding / Micro-labels |

**Note on Hierarchy:** Use `on-surface-variant` (#3D4A3E) for secondary metadata to ensure the `primary` green and `secondary` navy text pop with maximum intent.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often a crutch for poor layout. In this system, depth is achieved primarily through **Tonal Layering.**

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The delta in luminance creates a "soft lift" that is easier on the eyes than a drop shadow.
*   **Ambient Shadows:** When an element must float (e.g., a "Quick Add" FAB), use a shadow with a large blur (24px+) and low opacity (4%-8%). The shadow color must be a tinted version of `on-surface` (#191C1D) rather than pure black to mimic natural light.
*   **The Ghost Border:** If a border is required for accessibility in high-density data tables, use the `outline-variant` (#BBCBBB) at **15% opacity**. Never use 100% opaque strokes.
*   **Glassmorphism:** Use semi-transparent surface tokens (e.g., `surface/80%`) to allow background colors to bleed through, integrating the component into the environment.

---

## 5. Components

### Product Cards
Forbid divider lines. Use `vertical-spacing: 4 (1rem)` to separate product imagery from pricing metadata. 
- **Shape:** `rounded-lg` (16px) for the container; `rounded-md` (12px) for the internal image.
- **Interaction:** On tap, the card should scale slightly (0.98x) rather than changing color, maintaining the "physical" feel of the system.

### Store Branding Badges
- **Tokens:** Use `secondary-container` (#CFE2F9) with `on-secondary-container` (#526478).
- **Style:** Pill-shaped (`rounded-full`) to contrast against the softer `8px-12px` radius of product cards. This makes the retailer brand immediately identifiable as a functional tag.

### Bottom Navigation
- **Architecture:** Use a glassmorphic background (`surface-bright` at 85% opacity with 20px blur).
- **Active State:** The active icon uses `primary` (#006D37) with a small 4px dot below, rather than a bulky background highlight. This preserves the "clean and alive" personality.

### Buttons & Inputs
- **Primary Button:** Gradient (`primary` to `primary-container`) with `on-primary` (#FFFFFF) text.
- **Ghost Input:** Instead of a boxed field, use a `surface-container-low` fill with a `ghost border` that transitions to a `primary` 2px bottom-only stroke on focus.

---

## 6. Do's and Don'ts

### Do
*   **DO** use white space as a structural element. If two sections feel too close, increase the spacing token rather than adding a line.
*   **DO** use `tertiary-container` (#F8A018) sparingly for "Flash Sales" to create a sense of urgency without breaking the trustworthy navy/green harmony.
*   **DO** utilize asymmetrical padding in hero sections (e.g., more left padding than right) to create an editorial, magazine-like flow.

### Don't
*   **DON'T** use 100% black (#000000) for text. Always use `on-surface` (#191C1D) or `secondary` (#4E6073) to maintain visual softness.
*   **DON'T** use the standard `8px` corner radius for everything. Mix `rounded-md` (12px) for large containers and `rounded-sm` (4px) for tiny indicators to create visual hierarchy.
*   **DON'T** allow components to feel "pasted on." Use the tonal nesting rules to ensure every element has a defined home within the surface layers.