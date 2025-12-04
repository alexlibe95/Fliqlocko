# Fliqlocko Application - Complete Specification Document

**Version:** 1.0  
**Last Updated:** 2024  
**Status:** Framework-Agnostic Design Specification

---

## Table of Contents

1. [Application Overview](#application-overview)
2. [Complete Feature Specification](#complete-feature-specification)
3. [Flip Clock Display with Animation Details](#flip-clock-display-with-animation-details)
4. [Digit Flip Animation Mechanics (4-Layer System)](#digit-flip-animation-mechanics-4-layer-system)
5. [Timer Implementation (Hybrid RAF/setInterval Approach)](#timer-implementation-hybrid-rafsetinterval-approach)
6. [Settings Panel with All Controls](#settings-panel-with-all-controls)
7. [Keyboard Shortcuts](#keyboard-shortcuts)
8. [Persistence Requirements](#persistence-requirements)
9. [Technical Details](#technical-details)
10. [Exact CSS Specifications](#exact-css-specifications)
11. [Platform-Specific Considerations](#platform-specific-considerations)
12. [Performance Optimizations](#performance-optimizations)
13. [Critical Timer Logic (Prevents Freezing)](#critical-timer-logic-prevents-freezing)
14. [Implementation Guidance](#implementation-guidance)
15. [Known Issues to Avoid](#known-issues-to-avoid)
16. [Testing Checklist](#testing-checklist)
17. [Success Criteria](#success-criteria)
18. [Visual Specifications](#visual-specifications)

---

## Application Overview

This specification defines a **digital flip clock desktop application** inspired by classic mechanical flip clocks. The application displays time using animated flip-card digits that rotate to reveal new numbers when values change. The design emphasizes accuracy, smooth animations, and reliability across different platforms and window states.

**Core Principles:**
- **Accuracy First**: Time must always be correct, even after extended periods of inactivity
- **Smooth Animations**: 60fps flip animations with no visual glitches
- **Responsive Design**: Adapts to various screen sizes and aspect ratios
- **Platform Agnostic**: Specification can be implemented in any technology stack

---

## Complete Feature Specification

### Main Flip Clock Screen

#### Layout Options
- **Full-Screen Mode**: Clock fills entire viewport (100vw × 100vh)
- **Centered Mode**: Clock centered in viewport with optional padding
- **Windowed Mode**: For desktop applications, supports resizable windows

#### Time Display Format

**24-Hour Mode:**
- Format: `HH:MM` or `HH:MM:SS`
- Hours: 00-23 (always two digits with leading zero)
- Minutes: 00-59 (always two digits with leading zero)
- Seconds: 00-59 (optional, always two digits with leading zero)

**12-Hour Mode:**
- Format: `HH:MM` or `HH:MM:SS` with optional AM/PM indicator
- Hours: 01-12 (no leading zero for single digits, or always two digits - configurable)
- Minutes: 00-59 (always two digits with leading zero)
- Seconds: 00-59 (optional, always two digits with leading zero)
- AM/PM indicator: Small text label below or beside clock (optional)

#### Leading Zeros Behavior
- **Hours (24h)**: Always show leading zero (00-23)
- **Hours (12h)**: Configurable - either "1-12" or "01-12"
- **Minutes**: Always show leading zero (00-59)
- **Seconds**: Always show leading zero (00-59)

#### Dark/Light Mode Considerations

**Dark Mode (Default):**
- Background: Pure black (#000000)
- Digit containers: Dark gray (#333333)
- Digit cards: Very dark gray (#1a1a1a)
- Text: Light gray (#cccccc)
- Separators: Light gray (#cccccc)

**Light Mode:**
- Background: Off-white (#f5f5f5) or pure white (#ffffff)
- Digit containers: Light gray (#e0e0e0)
- Digit cards: White (#ffffff)
- Text: Dark gray (#333333)
- Separators: Dark gray (#333333)
- Shadows: Subtle dark shadows for depth

**Auto Mode:**
- Detect system preference (prefers-color-scheme media query)
- Switch automatically between light and dark
- Allow manual override

### Responsive Behavior

#### Window Resizing
- Clock scales proportionally using viewport-relative units (vmin)
- Maintains aspect ratio of digits
- Minimum size constraints prevent digits from becoming unreadable
- Maximum size constraints prevent digits from becoming too large on ultra-wide displays

#### Ultra-Wide Monitors
- Clock remains centered horizontally
- Uses maximum of 50% viewport width to prevent excessive stretching
- Maintains readable digit proportions
- Optional: Add date display or additional information in sidebars

#### Small Laptop Screens
- Minimum digit size: 40px height (or equivalent in vmin)
- Clock scales down proportionally
- Settings panel adapts to smaller screens (stacked layout on mobile)
- Touch-friendly controls on touchscreen devices

#### Mobile Browsers
- Full-screen support
- Landscape orientation optimization
- Touch gestures for settings (swipe from edge)
- Responsive font sizes

---

## Flip Clock Display with Animation Details

### Visual Layout Structure

Each digit consists of a **container** that holds four distinct layers:

```
┌─────────────────┐
│  Container      │ ← Outer container with shadow and border-radius
│  ┌───────────┐  │
│  │ Top Half  │  │ ← Static background top (z-index: 1)
│  ├───────────┤  │ ← Split line (z-index: 5)
│  │Bottom Half│  │ ← Static background bottom (z-index: 0)
│  └───────────┘  │
│  ┌───────────┐  │
│  │Front Leaf │  │ ← Animated top flap (z-index: 2)
│  └───────────┘  │
│  ┌───────────┐  │
│  │Back Leaf  │  │ ← Animated bottom flap (z-index: 2)
│  └───────────┘  │
└─────────────────┘
```

### Layering and Z-Index Relationships

**Z-Index Hierarchy (from bottom to top):**
1. **Bottom Background** (z-index: 0) - Shows old value, always visible
2. **Top Background** (z-index: 1) - Shows new value, revealed when front leaf flips
3. **Flip Leaves** (z-index: 2) - Both front and back leaves at same level
4. **Split Line** (z-index: 5) - Horizontal divider line, always on top

**Critical Layering Rules:**
- Split line must always be visible above all other elements
- Flip leaves must be above background halves during animation
- Background halves must be properly ordered (top above bottom)
- No element should overlap incorrectly during flip animation

### Digit Container Specifications

**Container Dimensions:**
- Width: `15vmin` (or equivalent: 15% of smaller viewport dimension)
- Height: `22vmin` (or equivalent: 22% of smaller viewport dimension)
- Aspect ratio: Approximately 0.68:1 (width:height)

**Container Styling:**
- Background: `#333333` (dark mode) or `#e0e0e0` (light mode)
- Border radius: `1.5vmin` (rounded corners)
- Box shadow: `0 0.5vmin 1.5vmin rgba(0,0,0,0.5)` (depth effect)
- Perspective: `1000px` (for 3D flip effect)
- Margin: `0 1vmin` (horizontal spacing between digits)

### Time Segment Layout

**Clock Structure:**
```
[HH] : [MM] : [SS]
 ↑     ↑     ↑
 │     │     └─ Optional seconds group
 │     └─────── Minutes group
 └───────────── Hours group
```

**Group Spacing:**
- Digits within a group: `0 1vmin` margin
- Groups separated by colon separators
- Separator size: `10vmin` font size (smaller than digits)
- Separator color: Same as digit text color
- Separator alignment: Vertically centered with digits, slight bottom padding (`2vmin`) for visual alignment

---

## Digit Flip Animation Mechanics (4-Layer System)

### Layer 1: Static Top Half (Background Top)

**Purpose:** Displays the **new value** that will be revealed when the flip completes.

**Visual Properties:**
- Position: Top 50% of container
- Background: `#1a1a1a` (dark mode) or `#ffffff` (light mode)
- Border radius: Top corners only (`1.5vmin`)
- Z-index: 1
- Overflow: Hidden

**Content Positioning:**
- Text content positioned at top of card
- Height: `var(--digit-content-height, 200%)` (200% for web, 240% for desktop apps)
- Content shows the **target value** (next number)

**Behavior:**
- Always visible
- Shows new value immediately when flip starts
- Revealed as front leaf rotates away

### Layer 2: Static Bottom Half (Background Bottom)

**Purpose:** Displays the **old value** that is being covered by the back leaf.

**Visual Properties:**
- Position: Bottom 50% of container
- Background: `#1a1a1a` (dark mode) or `#ffffff` (light mode)
- Border radius: Bottom corners only (`1.5vmin`)
- Z-index: 0 (below top half)
- Overflow: Hidden

**Content Positioning:**
- Text content shifted up by 100% (`top: -100%`)
- Height: `var(--digit-content-height, 200%)`
- Content shows the **current displayed value** (old number)

**Behavior:**
- Always visible until covered by back leaf
- Shows old value until flip completes
- Replaced by new value when animation finishes

### Layer 3: Animated Top Flap (Front Leaf)

**Purpose:** The top half that flips down to reveal the new value underneath.

**Visual Properties:**
- Position: Top 50% of container (same as background top)
- Background: `#1a1a1a` (dark mode) or `#ffffff` (light mode)
- Border radius: Top corners only (`1.5vmin`)
- Z-index: 2 (above backgrounds)
- Transform origin: `bottom` (rotates from bottom edge)
- Transform style: `preserve-3d`

**Content Positioning:**
- Text content positioned at top (`top: 0`)
- Height: `var(--digit-content-height, 200%)`
- Content shows the **old value** (current displayed number)

**Animation:**
- **Initial State**: `rotateX(0deg)` - flat, showing old value
- **Final State**: `rotateX(-180deg)` - flipped down, revealing new value
- **Duration**: 600ms (configurable: 300ms fast, 600ms normal, 900ms slow)
- **Easing**: `ease-in-out` (smooth acceleration and deceleration)
- **Trigger**: When digit value changes from old to new

**Behavior:**
- Starts flat, showing old value
- Rotates down around bottom edge
- At 90° rotation, becomes invisible (backface-visibility)
- Completes rotation to -180°, revealing background top with new value

### Layer 4: Animated Bottom Flap (Back Leaf)

**Purpose:** The bottom half that flips down to cover the old value and show the new value.

**Visual Properties:**
- Position: Bottom 50% of container (starts at 50% from top)
- Background: `#1a1a1a` (dark mode) or `#ffffff` (light mode)
- Border radius: Bottom corners only (`1.5vmin`)
- Z-index: 2 (same as front leaf)
- Transform origin: `top` (rotates from top edge)
- Transform style: `preserve-3d`
- Initial transform: `rotateX(180deg)` (pre-rotated, hidden)

**Content Positioning:**
- Text content shifted up by 100% (`top: -100%`)
- Height: `var(--digit-content-height, 200%)`
- Content shows the **new value** (target number)

**Animation:**
- **Initial State**: `rotateX(180deg)` - pre-rotated, showing new value from behind
- **Final State**: `rotateX(0deg)` - flat, covering old value
- **Duration**: 600ms (same as front leaf, synchronized)
- **Easing**: `ease-in-out` (synchronized with front leaf)
- **Trigger**: When digit value changes from old to new

**Behavior:**
- Starts rotated 180° (invisible, showing new value from behind)
- Rotates down around top edge
- At 90° rotation, becomes visible
- Completes rotation to 0°, covering background bottom with old value

### Split Line

**Purpose:** Visual divider that simulates the physical split between top and bottom halves.

**Visual Properties:**
- Position: Absolute, centered vertically (`top: 50%`)
- Width: 100% of container
- Height: `2px`
- Background: `rgba(0,0,0,0.4)` (dark mode) or `rgba(0,0,0,0.2)` (light mode)
- Z-index: 5 (always on top)
- Transform: `translateY(-50%)` (perfect vertical centering)

**Behavior:**
- Always visible
- Does not animate
- Provides visual reference for flip axis

### Animation Synchronization

**Critical Timing Rules:**
1. Front leaf and back leaf **must** animate simultaneously
2. Both animations use identical duration and easing
3. Animation starts immediately when value changes
4. After animation completes (600ms), displayed value updates
5. No animation should trigger if value hasn't changed

**Visual Flow:**
```
Time: 0ms    → Value changes detected
Time: 0ms    → Front leaf starts rotating down (0° → -180°)
Time: 0ms    → Back leaf starts rotating down (180° → 0°)
Time: 300ms  → Both leaves at 90° (midpoint, invisible)
Time: 600ms  → Front leaf at -180° (reveals new top)
Time: 600ms  → Back leaf at 0° (covers old bottom)
Time: 600ms  → Displayed value updates to new value
```

### Perspective and 3D Effects

**Container Perspective:**
- `perspective: 1000px` on container
- Creates realistic 3D rotation effect
- Higher values = less dramatic effect
- Lower values = more dramatic effect

**Transform Origin:**
- Front leaf: `bottom` (rotates from bottom edge)
- Back leaf: `top` (rotates from top edge)
- Critical for correct flip direction

**Backface Visibility:**
- `backface-visibility: hidden` on all card elements
- Prevents seeing "back" of cards during rotation
- Essential for clean flip animation

### Avoiding Visual Tearing and Overlaps

**Prevention Strategies:**
1. **Z-index Management**: Strict layering prevents overlaps
2. **Overflow Hidden**: Cards clip content at edges
3. **Backface Visibility**: Hides reverse side during rotation
4. **Synchronized Timing**: Both leaves animate together
5. **State Management**: Only one animation per digit at a time

**Edge Cases:**
- Rapid value changes: Queue animations, don't stack
- Window resize during animation: Maintain aspect ratio
- System sleep/wake: Skip to correct time, don't replay animations

---

## Timer Implementation (Hybrid RAF/setInterval Approach)

### Problem Statement

Traditional timer implementations fail in desktop/web applications when:
1. Window loses focus → `requestAnimationFrame` pauses
2. Tab becomes inactive → Timers throttled by browser
3. System sleeps → All timers stop
4. Extended inactivity → Timers drift or freeze

### Solution: Hybrid Timer Architecture

The timer system uses **two complementary mechanisms**:

#### Mechanism 1: High-Level Time Scheduler

**Purpose:** Maintain accurate time reference regardless of window state.

**Implementation:**
- Use `setInterval` with 1000ms interval as **primary timekeeper**
- Calculate target time from `Date.now()` or system clock
- Update time reference every second
- Continue running even when window is unfocused

**Key Properties:**
- **Reliability**: Works in background, not throttled by focus state
- **Accuracy**: Uses system clock, not frame-based timing
- **Persistence**: Continues running during sleep/wake cycles

#### Mechanism 2: Visual Animation Driver

**Purpose:** Smooth visual updates using `requestAnimationFrame`.

**Implementation:**
- Use `requestAnimationFrame` for **visual rendering only**
- Check time reference from Mechanism 1
- Update display when time changes
- Pause when window is hidden (acceptable, Mechanism 1 continues)

**Key Properties:**
- **Smoothness**: 60fps updates when window is focused
- **Efficiency**: Only runs when visible
- **Responsiveness**: Immediate updates when window regains focus

### Hybrid Timer Algorithm

```
┌─────────────────────────────────────┐
│  High-Level Scheduler (setInterval) │
│  - Runs every 1000ms                │
│  - Updates time reference           │
│  - Works in background              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Time Reference (Date.now())        │
│  - Single source of truth           │
│  - Always accurate                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Visual Driver (requestAnimationFrame)│
│  - Checks time reference            │
│  - Updates display when changed     │
│  - Pauses when window hidden        │
└─────────────────────────────────────┘
```

### Window State Detection

**Event Listeners Required:**
1. `visibilitychange` - Detects tab/window visibility
2. `focus` - Window gains focus
3. `blur` - Window loses focus

**State Machine:**
```
Window Visible + Focused
  → Use requestAnimationFrame (smooth updates)
  
Window Hidden OR Unfocused
  → Switch to setInterval (reliable updates)
  → Continue tracking time accurately
  
Window Regains Focus
  → Switch back to requestAnimationFrame
  → Immediately sync to current time
  → Skip animations if time jumped significantly
```

### Time Synchronization Logic

**Core Algorithm:**

```
1. Initialize:
   - Set time reference = Date.now()
   - Start setInterval scheduler (1000ms)
   - If window visible: Start requestAnimationFrame loop
   - If window hidden: Rely only on setInterval

2. Every Second (setInterval):
   - Update time reference = Date.now()
   - Calculate current time components (hours, minutes, seconds)
   - Compare with last displayed time
   - If changed: Trigger digit updates

3. Every Frame (requestAnimationFrame, if active):
   - Read time reference
   - Calculate current time components
   - Compare with last displayed time
   - If changed: Update display immediately
   - Continue loop

4. On Window Focus Change:
   - If becoming visible:
     * Stop setInterval (if it was primary)
     * Start requestAnimationFrame
     * Immediately sync to current time
     * Skip animations if time jumped > 2 seconds
   - If becoming hidden:
     * Stop requestAnimationFrame
     * Ensure setInterval is running
     * Continue time tracking
```

### Handling System Sleep/Wake

**Problem:** System sleeps, all timers stop, time jumps forward.

**Solution:**
1. Detect large time jump (> 5 seconds)
2. Immediately update all digits to current time
3. Skip flip animations (instant update)
4. Resume normal operation
5. Log time jump for debugging (optional)

**Implementation:**
```
On Timer Wake:
  - Previous time = last known time
  - Current time = Date.now()
  - Time delta = Current - Previous
  
  If time delta > 5000ms:
    - Set all digits to current time (no animation)
    - Reset animation state
    - Continue normal operation
  Else:
    - Process normally (may have missed some seconds)
```

### Animation Timing Integration

**Key Insight:** Flip animations are **visual only**, not time-critical.

**Strategy:**
- Time updates trigger animation start
- Animation duration (600ms) is independent of timer
- If multiple seconds pass during animation, queue next update
- Never stack animations (wait for current to complete)

**Flow:**
```
Time: 00:00:00 → Display "0"
Time: 00:00:01 → Start flip animation (0 → 1)
Time: 00:00:01.3 → Time updates to 00:00:02
                  → Queue update (animation still running)
Time: 00:00:01.6 → Animation completes
                  → Display "1"
                  → Immediately start next animation (1 → 2)
Time: 00:00:02.2 → Animation completes
                  → Display "2"
```

---

## Settings Panel with All Controls

### Panel Design

**Layout Type:** Modal overlay (centered) or slide-out drawer (side)

**Modal Overlay (Recommended):**
- Full-screen overlay with semi-transparent background
- Centered panel with rounded corners
- Click outside to close (optional)
- Escape key to close

**Slide-Out Drawer (Alternative):**
- Slides in from right or left edge
- Overlays content partially
- Backdrop dims main content
- Swipe to close on touch devices

### Control Specifications

#### 1. 12h / 24h Toggle

**Type:** Checkbox or Toggle Switch

**Label:** "12-Hour Mode" or "24-Hour Format"

**Behavior:**
- Checked = 12-hour mode (1-12 with AM/PM)
- Unchecked = 24-hour mode (00-23)
- Immediate update of display
- Persist preference

**Visual:**
- Toggle switch (iOS-style) preferred
- Or checkbox with clear label

#### 2. Show / Hide Seconds

**Type:** Checkbox or Toggle Switch

**Label:** "Show Seconds"

**Behavior:**
- Checked = Display seconds (HH:MM:SS)
- Unchecked = Hide seconds (HH:MM)
- Immediate update of display
- Persist preference

**Visual:**
- Same as 12h/24h toggle

#### 3. Date Display Toggle

**Type:** Checkbox or Toggle Switch

**Label:** "Show Date"

**Behavior:**
- Checked = Display date below clock
- Unchecked = Hide date
- Date format: "Monday, January 1" or "Mon, Jan 1" (configurable)
- Position: Below clock, smaller font
- Persist preference

**Visual:**
- Date appears centered below clock
- Font size: 1.5vmin or 14px
- Color: Same as separators (slightly dimmed)

#### 4. Theme Selection

**Type:** Radio buttons or Segmented Control

**Options:**
- Auto (follows system preference)
- Light
- Dark

**Behavior:**
- Immediate theme switch
- Persist preference
- Auto mode detects system `prefers-color-scheme`

**Visual:**
- Three-option control
- Preview theme change immediately

#### 5. Flip Animation Speed

**Type:** Radio buttons or Segmented Control

**Options:**
- Slow (900ms)
- Normal (600ms) - Default
- Fast (300ms)

**Behavior:**
- Changes animation duration
- Applies to all digits
- Immediate effect on next flip
- Persist preference

**Visual:**
- Three-option control
- Label shows current selection

#### 6. Randomize Flip Timings

**Type:** Checkbox or Toggle Switch

**Label:** "Organic Timing" or "Randomize Flips"

**Behavior:**
- Checked = Add small random delay (±50ms) to each digit flip
- Unchecked = All digits flip simultaneously
- Creates more organic, mechanical feel
- Persist preference

**Visual:**
- Toggle switch
- Tooltip explaining effect

### Additional Controls (Optional)

#### Brightness Control

**Type:** Range Slider

**Range:** 0.1 to 1.0 (10% to 100%)

**Step:** 0.05 (5% increments)

**Behavior:**
- Applies opacity to entire clock
- Real-time preview
- Persist value

**Visual:**
- Horizontal slider
- Label shows percentage: "Brightness (75%)"

#### Scale Control

**Type:** Range Slider

**Range:** 0.5 to 1.5 (50% to 150%)

**Step:** 0.05 (5% increments)

**Behavior:**
- Applies CSS transform scale to clock
- Real-time preview
- Persist value

**Visual:**
- Horizontal slider
- Label shows percentage: "Scale (100%)"

#### Always On Top (Desktop Only)

**Type:** Checkbox or Toggle Switch

**Label:** "Always On Top"

**Behavior:**
- Desktop apps only
- Keeps window above other windows
- Immediate effect
- Persist preference

**Visual:**
- Toggle switch
- Disabled/grayed out in web version

### Settings Panel Layout

**Panel Dimensions:**
- Width: 300px (desktop) or 90vw (mobile, max 400px)
- Height: Auto (based on content)
- Padding: 20px
- Border radius: 10px

**Panel Styling:**
- Background: `#222222` (dark mode) or `#ffffff` (light mode)
- Text color: `#ffffff` (dark mode) or `#000000` (light mode)
- Box shadow: `0 4px 20px rgba(0,0,0,0.5)`
- Border: Optional subtle border

**Header:**
- Title: "Settings" (1.2rem font size)
- Close button: "×" (1.5rem font size, top-right)
- Flex layout: Space between title and close button

**Setting Items:**
- Each setting in a row
- Label on left, control on right
- Margin bottom: 15px
- Font size: 0.9rem for labels

**Overlay:**
- Background: `rgba(0,0,0,0.5)` (semi-transparent black)
- Full screen, fixed position
- Z-index: 1000 (above clock)

### Opening Settings Panel

**Methods:**
1. **Keyboard Shortcut**: Press 'S' key
2. **Icon Button**: Small gear icon in corner (optional)
3. **Touch Gesture**: Swipe from edge (mobile, optional)
4. **Right-click Menu**: Context menu option (optional)

**Behavior:**
- Toggle open/close (pressing 'S' again closes)
- Escape key closes panel
- Click outside closes (if modal)
- Smooth slide/fade animation (300ms)

### Small Screen Adaptation

**Mobile Layout:**
- Panel width: 90vw (max 400px)
- Stacked layout for controls (label above control)
- Larger touch targets (44px minimum)
- Swipe down to close
- Full-screen on very small devices

---

## Keyboard Shortcuts

### Primary Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `S` | Toggle Settings | Open/close settings panel |
| `T` | Toggle Theme | Cycle through Auto → Light → Dark |
| `H` | Hide UI | Hide all UI elements, show only clock |
| `F` | Fullscreen | Toggle fullscreen mode (desktop only) |
| `Esc` | Close/Exit | Close settings panel or exit fullscreen |
| `+` / `=` | Increase Brightness | Increase brightness by 5% |
| `-` / `_` | Decrease Brightness | Decrease brightness by 5% |
| `0` | Reset Brightness | Reset brightness to 100% |
| `[` | Decrease Scale | Decrease scale by 5% |
| `]` | Increase Scale | Increase scale by 5% |
| `?` | Show Help | Display keyboard shortcut cheatsheet |

### Arrow Key Shortcuts

| Key | Action | Description |
|-----|--------|-------------|
| `↑` | Increase Brightness | Same as `+` |
| `↓` | Decrease Brightness | Same as `-` |
| `←` | Decrease Scale | Same as `[` |
| `→` | Increase Scale | Same as `]` |

### Shortcut Cheatsheet Overlay

**Design:**
- Semi-transparent overlay (same as settings panel)
- Centered panel with keyboard shortcuts listed
- Grouped by category
- Key names styled as keyboard keys (visual keycaps)
- Auto-dismiss after 5 seconds (optional)
- Click outside or Escape to close

**Layout:**
```
┌─────────────────────────────┐
│  Keyboard Shortcuts         │
│                             │
│  Navigation                 │
│  [S] Settings               │
│  [F] Fullscreen             │
│  [Esc] Close                │
│                             │
│  Display                    │
│  [T] Theme                  │
│  [+/-] Brightness           │
│  [[/]] Scale                │
│                             │
│  Press [?] to show this     │
└─────────────────────────────┘
```

**Trigger:**
- Press `?` key anywhere in app
- Or "Keyboard Shortcuts" link in settings panel

---

## Persistence Requirements

### Stored Preferences

**All Settings:**
- `is24Hour` (boolean) - 12-hour vs 24-hour format
- `showSeconds` (boolean) - Show/hide seconds
- `showDate` (boolean) - Show/hide date
- `theme` (string) - "auto" | "light" | "dark"
- `animationSpeed` (string) - "slow" | "normal" | "fast"
- `randomizeTiming` (boolean) - Organic flip timing
- `brightness` (number) - 0.1 to 1.0
- `scale` (number) - 0.5 to 1.5
- `alwaysOnTop` (boolean) - Desktop only

**Window State (Desktop Only):**
- `windowWidth` (number) - Last window width
- `windowHeight` (number) - Last window height
- `isFullscreen` (boolean) - Fullscreen state
- `windowX` (number) - Window X position
- `windowY` (number) - Window Y position

### Storage Mechanisms

#### Web Context (Browser)

**Primary:** `localStorage`
- Key: `flipclock-settings`
- Value: JSON string of settings object
- Limit: ~5-10MB per domain
- Persistence: Survives browser restart

**Alternative:** `IndexedDB` (if needed for larger data)
- Use for future features (history, analytics)
- More complex but more powerful

**Fallback:** `sessionStorage`
- If localStorage unavailable
- Data lost on tab close

#### Desktop Context (Electron/Tauri/Flutter)

**Electron:**
- `electron-store` package (recommended)
- Or `localStorage` in renderer process
- Or JSON file in user data directory

**Tauri:**
- `@tauri-apps/plugin-store` (recommended)
- Or `localStorage` in WebView
- Or Rust-side file storage

**Flutter:**
- `shared_preferences` package
- Or `path_provider` + JSON file
- Platform-specific storage

**Native Desktop:**
- Platform-specific APIs:
  - Windows: Registry or AppData folder
  - macOS: UserDefaults or ~/Library/Preferences
  - Linux: ~/.config/appname/settings.json

### Storage Format

**JSON Structure:**
```json
{
  "version": "1.0",
  "settings": {
    "is24Hour": false,
    "showSeconds": true,
    "showDate": false,
    "theme": "dark",
    "animationSpeed": "normal",
    "randomizeTiming": false,
    "brightness": 1.0,
    "scale": 1.0,
    "alwaysOnTop": false
  },
  "window": {
    "width": 800,
    "height": 600,
    "x": 100,
    "y": 100,
    "isFullscreen": false
  }
}
```

### Persistence Behavior

**On App Start:**
1. Load settings from storage
2. Apply all settings immediately
3. If no settings found, use defaults
4. If settings version mismatch, migrate or reset

**On Setting Change:**
1. Update in-memory settings
2. Immediately apply to UI
3. Save to storage (debounced, max 100ms delay)
4. Handle storage errors gracefully (log, continue)

**On Window Close (Desktop):**
1. Save current window state
2. Save all settings
3. Handle save errors (don't block close)

### Migration Strategy

**Version Handling:**
- Include version number in stored data
- On load, check version
- If version mismatch:
  - Migrate old format to new format
  - Or reset to defaults with warning
  - Or prompt user to reconfigure

**Example Migration:**
```
Version 1.0 → 1.1:
  - Add "showDate" setting (default: false)
  - Add "randomizeTiming" setting (default: false)
  - Migrate "theme" from boolean to string
```

---

## Technical Details

### Data Flow Architecture

**Single Source of Truth:**
```
System Clock (Date.now())
    ↓
Time Reference (updated every second)
    ↓
Time Components Calculator (hours, minutes, seconds)
    ↓
Digit State Manager (tracks current vs target values)
    ↓
Flip Animation Controller (triggers animations)
    ↓
Visual Display (renders digits)
```

### State Management

**Core State:**
- `currentTime` (Date object or timestamp) - Single source of truth
- `displayedTime` (Date object) - What's currently shown
- `digitStates` (array) - Current value for each digit position
- `animationStates` (array) - Animation state for each digit

**Derived State:**
- `hours`, `minutes`, `seconds` - Calculated from `currentTime`
- `digitValues` - Array of digit strings for each position
- `needsUpdate` - Boolean, true when time changed

### Time Component Calculation

**Algorithm:**
```
1. Get current time: now = Date.now() or new Date()
2. Extract components:
   - hours = now.getHours()
   - minutes = now.getMinutes()
   - seconds = now.getSeconds()
3. Apply 12-hour conversion if needed:
   - If 12-hour mode:
     hours = hours % 12 || 12
4. Format with leading zeros:
   - hoursStr = String(hours).padStart(2, '0')
   - minutesStr = String(minutes).padStart(2, '0')
   - secondsStr = String(seconds).padStart(2, '0')
5. Split into individual digits:
   - hoursDigits = [hoursStr[0], hoursStr[1]]
   - minutesDigits = [minutesStr[0], minutesStr[1]]
   - secondsDigits = [secondsStr[0], secondsStr[1]]
```

### Digit State Machine

**States:**
1. **Idle** - No animation, displaying current value
2. **Animating** - Flip animation in progress
3. **Updating** - Animation complete, updating displayed value

**Transitions:**
```
Idle → Animating:
  Trigger: Digit value changes
  Action: Start flip animation
  
Animating → Updating:
  Trigger: Animation completes (600ms)
  Action: Update displayed value
  
Updating → Idle:
  Trigger: Value updated
  Action: Reset animation state
```

**State Per Digit:**
- Each digit position (6 total: HH, MM, SS) has independent state
- Multiple digits can animate simultaneously
- State prevents animation stacking

### Handling Time Rollovers

**Second Rollover (59 → 00):**
- Normal flip animation
- No special handling needed

**Minute Rollover (59:59 → 00:00):**
- Seconds digit flips 9 → 0
- Minutes digits flip 59 → 00
- Both animations happen simultaneously
- No visual glitches

**Hour Rollover (23:59:59 → 00:00:00):**
- All digits change simultaneously
- All 6 digits animate together
- Ensure animations don't conflict
- May need to stagger slightly for visual clarity

**Date Change (Midnight):**
- If date display enabled, update date
- Clock continues normally
- No special animation needed

### Avoiding Visual Glitches

**Strategies:**
1. **State Locking**: Prevent new animations during current animation
2. **Value Queuing**: Queue value changes, process one at a time
3. **Animation Completion**: Wait for animation before updating value
4. **Synchronization**: Ensure all digits update atomically
5. **Error Recovery**: Handle animation failures gracefully

**Edge Cases:**
- Rapid time changes: Queue updates, don't stack
- System time adjustment: Detect and handle gracefully
- Animation interruption: Complete or cancel cleanly
- Multiple rollovers: Process in correct order

---

## Exact CSS Specifications

### CSS Custom Properties (Design Tokens)

```css
:root {
  /* Colors - Dark Mode */
  --color-bg-primary: #000000;
  --color-bg-secondary: #333333;
  --color-bg-card: #1a1a1a;
  --color-text-primary: #cccccc;
  --color-text-secondary: #888888;
  --color-separator: #cccccc;
  --color-shadow: rgba(0, 0, 0, 0.5);
  --color-split-line: rgba(0, 0, 0, 0.4);
  
  /* Colors - Light Mode */
  --color-bg-primary-light: #f5f5f5;
  --color-bg-secondary-light: #e0e0e0;
  --color-bg-card-light: #ffffff;
  --color-text-primary-light: #333333;
  --color-text-secondary-light: #666666;
  --color-separator-light: #333333;
  --color-shadow-light: rgba(0, 0, 0, 0.2);
  --color-split-line-light: rgba(0, 0, 0, 0.2);
  
  /* Dimensions */
  --digit-width: 15vmin;
  --digit-height: 22vmin;
  --digit-content-height: 200%; /* 240% for desktop apps */
  --digit-gap: 1vmin;
  --digit-border-radius: 1.5vmin;
  --digit-font-size: 18vmin;
  --digit-font-weight: bold;
  --digit-font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  /* Separator */
  --separator-font-size: 10vmin;
  --separator-gap: 1vmin;
  --separator-padding-bottom: 2vmin;
  
  /* Shadows */
  --shadow-digit: 0 0.5vmin 1.5vmin rgba(0, 0, 0, 0.5);
  --shadow-panel: 0 4px 20px rgba(0, 0, 0, 0.5);
  
  /* Animation */
  --animation-duration-fast: 300ms;
  --animation-duration-normal: 600ms;
  --animation-duration-slow: 900ms;
  --animation-easing: ease-in-out;
  
  /* Perspective */
  --perspective: 1000px;
  
  /* Settings Panel */
  --panel-width: 300px;
  --panel-padding: 20px;
  --panel-border-radius: 10px;
  --panel-bg: #222222;
  --panel-text: #ffffff;
  --overlay-bg: rgba(0, 0, 0, 0.5);
  
  /* Spacing */
  --spacing-xs: 5px;
  --spacing-sm: 10px;
  --spacing-md: 15px;
  --spacing-lg: 20px;
  --spacing-xl: 30px;
}
```

### Digit Container Styles

```css
.digit-container {
  position: relative;
  width: var(--digit-width);
  height: var(--digit-height);
  background-color: var(--color-bg-secondary);
  border-radius: var(--digit-border-radius);
  font-family: var(--digit-font-family);
  font-weight: var(--digit-font-weight);
  font-size: var(--digit-font-size);
  color: var(--color-text-primary);
  perspective: var(--perspective);
  margin: 0 var(--digit-gap);
  box-shadow: var(--shadow-digit);
}
```

### Digit Card Styles

```css
.digit-card {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  background-color: var(--color-bg-card);
  backface-visibility: hidden;
}

.digit-card.top {
  top: 0;
  border-top-left-radius: var(--digit-border-radius);
  border-top-right-radius: var(--digit-border-radius);
  z-index: 1;
}

.digit-card.bottom {
  bottom: 0;
  border-bottom-left-radius: var(--digit-border-radius);
  border-bottom-right-radius: var(--digit-border-radius);
  z-index: 0;
}
```

### Digit Content Styles

```css
.digit-content {
  position: absolute;
  left: 0;
  width: 100%;
  height: var(--digit-content-height);
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}

.digit-card.top .digit-content {
  top: 0;
}

.digit-card.bottom .digit-content {
  top: -100%;
}
```

### Flip Leaf Styles

```css
.flip-leaf {
  z-index: 2;
  transform-style: preserve-3d;
}

.flip-leaf.front {
  top: 0;
  border-top-left-radius: var(--digit-border-radius);
  border-top-right-radius: var(--digit-border-radius);
  transform-origin: bottom;
}

.flip-leaf.front .digit-content {
  top: 0;
}

.flip-leaf.back {
  top: 50%;
  border-bottom-left-radius: var(--digit-border-radius);
  border-bottom-right-radius: var(--digit-border-radius);
  transform-origin: top;
  transform: rotateX(180deg);
}

.flip-leaf.back .digit-content {
  top: -100%;
}
```

### Animation Keyframes

```css
@keyframes flipDownFront {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
}

@keyframes flipDownBack {
  0% {
    transform: rotateX(180deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}

.flip-leaf.front.flipping {
  animation: flipDownFront var(--animation-duration-normal) var(--animation-easing) forwards;
}

.flip-leaf.back.flipping {
  animation: flipDownBack var(--animation-duration-normal) var(--animation-easing) forwards;
}
```

### Split Line Styles

```css
.split-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-split-line);
  z-index: 5;
  transform: translateY(-50%);
}
```

### Clock Container Styles

```css
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-primary);
}

.clock-group {
  display: flex;
  margin: 0 var(--digit-gap);
}

.clock-separator {
  font-family: var(--digit-font-family);
  font-weight: var(--digit-font-weight);
  font-size: var(--separator-font-size);
  color: var(--color-separator);
  margin: 0 var(--separator-gap);
  padding-bottom: var(--separator-padding-bottom);
}
```

### App Container Styles

```css
.app-container {
  width: 100vw;
  height: 100vh;
  background-color: var(--color-bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}
```

### Settings Panel Styles

```css
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--overlay-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-panel {
  background-color: var(--panel-bg);
  padding: var(--panel-padding);
  border-radius: var(--panel-border-radius);
  width: var(--panel-width);
  color: var(--panel-text);
  box-shadow: var(--shadow-panel);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.settings-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--panel-text);
  font-size: 1.5rem;
  cursor: pointer;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.setting-item label {
  font-size: 0.9rem;
}

.setting-item input[type="range"] {
  width: 50%;
}
```

### Performance Optimizations (CSS)

```css
/* GPU Acceleration */
.digit-container,
.digit-card,
.flip-leaf {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}

/* Reduce repaints */
.digit-content {
  contain: layout style paint;
}

/* Smooth animations */
.flip-leaf {
  backface-visibility: hidden;
  perspective: var(--perspective);
}
```

---

## Platform-Specific Considerations

### CSS Variable for Digit Height

**Problem:** Different rendering engines may require different content heights for proper digit alignment.

**Solution:** Use CSS custom property that can be adjusted per platform.

**Web Browsers:**
```css
:root {
  --digit-content-height: 200%;
}
```

**Desktop Apps (Electron/Tauri/AppImage):**
```css
:root {
  --digit-content-height: 240%;
}
```

**Detection Logic:**
```javascript
// Detect platform and set CSS variable
if (isDesktopApp()) {
  document.documentElement.style.setProperty('--digit-content-height', '240%');
} else {
  document.documentElement.style.setProperty('--digit-content-height', '200%');
}
```

### Responsive Scaling

**Full-Screen Desktop:**
- Use `vmin` units (viewport minimum)
- Scales with window size
- Maintains aspect ratio
- Max width: 50vw (prevents stretching on ultra-wide)

**Windowed Desktop:**
- Same as full-screen
- Respects window size
- Scales proportionally

**Mobile Browsers:**
- Use `vmin` with minimum constraints
- Minimum digit height: 40px
- Landscape optimization
- Touch-friendly controls

**Ultra-Wide Monitors:**
- Max clock width: 50vw
- Center horizontally
- Optional: Add date/info in sidebars
- Maintain readability

### Typography Scaling

**Base Sizes:**
- Digit font: 18vmin
- Separator font: 10vmin
- Date font: 1.5vmin or 14px (whichever larger)

**Scaling Rules:**
- All sizes scale with viewport
- Minimum readable sizes enforced
- Maximum sizes prevent excessive scaling
- Maintains visual hierarchy

### Platform-Specific Adaptations

**Windows:**
- Native window controls
- System tray integration (optional)
- Windows 11 rounded corners support

**macOS:**
- Native window controls
- Menu bar integration (optional)
- macOS blur effects (optional)

**Linux:**
- AppImage/DEB/RPM support
- Desktop environment integration
- System tray support

**Web:**
- PWA support (optional)
- Service worker for offline (optional)
- Responsive design
- Touch gestures

---

## Performance Optimizations

### GPU Acceleration

**Techniques:**
1. **`will-change: transform`** - Hints browser to optimize
2. **`transform: translateZ(0)`** - Forces GPU layer
3. **`backface-visibility: hidden`** - Optimizes 3D transforms
4. **`transform-style: preserve-3d`** - Enables 3D context

**Implementation:**
```css
.digit-container,
.digit-card,
.flip-leaf {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### DOM Optimization

**Strategies:**
1. **Flat DOM Structure** - Minimize nesting
2. **Containment** - Use CSS `contain` property
3. **Avoid Layout Thrashing** - Precompute sizes
4. **Minimize Reflows** - Batch DOM updates

**Implementation:**
```css
.digit-content {
  contain: layout style paint;
}
```

### Animation Optimization

**Principles:**
1. **Animate Only Changed Digits** - Don't animate all digits
2. **Use CSS Animations** - More efficient than JavaScript
3. **Avoid JavaScript Animations** - Use `requestAnimationFrame` only for timing
4. **Batch Updates** - Update all digits in single frame

**Implementation:**
- Trigger CSS animations via class toggles
- Don't use JavaScript to animate transforms
- Let browser handle animation timing

### Rendering Optimization

**Techniques:**
1. **Layer Promotion** - Promote animated elements to own layer
2. **Composite Layers** - Minimize layer count
3. **Reduce Paint Areas** - Only repaint changed regions
4. **Use Opacity/Transform** - These properties are cheapest

**Best Practices:**
- Animate `transform` and `opacity` only
- Avoid animating `width`, `height`, `top`, `left`
- Use `transform: scale()` instead of changing size
- Use `opacity` for fade effects

### Memory Management

**Strategies:**
1. **Clean Up Timers** - Remove all timers on unmount
2. **Remove Event Listeners** - Clean up all listeners
3. **Limit State Updates** - Only update when necessary
4. **Avoid Memory Leaks** - Use weak references where possible

**Implementation:**
```javascript
// Cleanup example
useEffect(() => {
  const timer = setInterval(...);
  const raf = requestAnimationFrame(...);
  
  return () => {
    clearInterval(timer);
    cancelAnimationFrame(raf);
    // Remove all listeners
  };
}, []);
```

### Frame Rate Optimization

**Target:** 60fps (16.67ms per frame)

**Strategies:**
1. **Reduce Work Per Frame** - Minimize calculations
2. **Debounce Updates** - Don't update every frame
3. **Use Passive Listeners** - Improve scroll performance
4. **Profile Regularly** - Use browser dev tools

**Monitoring:**
- Use `requestAnimationFrame` timing
- Monitor frame times
- Alert if frame time > 16ms
- Optimize hot paths

---

## Critical Timer Logic (Prevents Freezing)

### Design Philosophy

**Core Principle:** Time accuracy is more important than animation smoothness.

**Key Insight:** The displayed time must always be correct, even if animations are skipped or delayed.

### Timer Architecture

**Three-Layer System:**

```
Layer 1: System Clock (Date.now())
  ↓ Always accurate, system-level
Layer 2: Time Reference (updated every second)
  ↓ Single source of truth for app
Layer 3: Visual Display (updated when time changes)
  ↓ What user sees
```

### Primary Timer: setInterval Scheduler

**Purpose:** Maintain accurate time reference regardless of window state.

**Implementation:**
```javascript
// Pseudo-code
function startTimeScheduler() {
  let lastTime = Date.now();
  
  setInterval(() => {
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    
    // Update time reference
    updateTimeReference(currentTime);
    
    // Check if time components changed
    if (timeComponentsChanged()) {
      triggerDisplayUpdate();
    }
    
    lastTime = currentTime;
  }, 1000);
}
```

**Properties:**
- Runs every 1000ms (1 second)
- Uses `Date.now()` for accuracy
- Continues running when window unfocused
- Not throttled by browser (unlike RAF)
- Handles system sleep/wake

### Secondary Timer: requestAnimationFrame Driver

**Purpose:** Smooth visual updates when window is focused.

**Implementation:**
```javascript
// Pseudo-code
function startVisualDriver() {
  let lastDisplayedSecond = -1;
  
  function updateFrame() {
    const currentTime = getTimeReference();
    const currentSecond = getSeconds(currentTime);
    
    // Only update if second changed
    if (currentSecond !== lastDisplayedSecond) {
      updateDisplay(currentTime);
      lastDisplayedSecond = currentSecond;
    }
    
    // Continue loop if window focused
    if (isWindowFocused()) {
      requestAnimationFrame(updateFrame);
    }
  }
  
  requestAnimationFrame(updateFrame);
}
```

**Properties:**
- Runs at display refresh rate (60fps typically)
- Checks time reference (doesn't calculate time)
- Only updates when time changes
- Pauses when window unfocused (acceptable)
- Resumes immediately when focused

### Window State Management

**State Detection:**
```javascript
// Pseudo-code
let isWindowFocused = true;
let isWindowVisible = true;

// Listen to visibility changes
document.addEventListener('visibilitychange', () => {
  isWindowVisible = !document.hidden;
  handleWindowStateChange();
});

// Listen to focus changes
window.addEventListener('focus', () => {
  isWindowFocused = true;
  handleWindowStateChange();
});

window.addEventListener('blur', () => {
  isWindowFocused = false;
  handleWindowStateChange();
});
```

**State Transitions:**
```
Window Focused + Visible
  → Use requestAnimationFrame (smooth)
  → Keep setInterval running (backup)
  
Window Unfocused OR Hidden
  → Stop requestAnimationFrame
  → Rely on setInterval only
  → Continue accurate time tracking
  
Window Regains Focus
  → Immediately sync to current time
  → Start requestAnimationFrame
  → Skip animations if time jumped significantly
```

### Time Synchronization Algorithm

**Core Algorithm:**
```javascript
// Pseudo-code
class TimeManager {
  constructor() {
    this.timeReference = Date.now();
    this.lastDisplayedTime = null;
    this.schedulerInterval = null;
    this.rafId = null;
    this.isFocused = true;
  }
  
  start() {
    // Always start scheduler (runs in background)
    this.startScheduler();
    
    // Start visual driver if focused
    if (this.isFocused) {
      this.startVisualDriver();
    }
  }
  
  startScheduler() {
    this.schedulerInterval = setInterval(() => {
      const now = Date.now();
      this.timeReference = now;
      
      // Check if time changed
      if (this.hasTimeChanged(now)) {
        this.updateDisplay(now);
      }
    }, 1000);
  }
  
  startVisualDriver() {
    const update = () => {
      const now = this.timeReference;
      
      if (this.hasTimeChanged(now)) {
        this.updateDisplay(now);
      }
      
      if (this.isFocused) {
        this.rafId = requestAnimationFrame(update);
      }
    };
    
    this.rafId = requestAnimationFrame(update);
  }
  
  handleFocusChange(focused) {
    this.isFocused = focused;
    
    if (focused) {
      // Window gained focus
      this.syncToCurrentTime();
      this.startVisualDriver();
    } else {
      // Window lost focus
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      // Scheduler continues running
    }
  }
  
  syncToCurrentTime() {
    const now = Date.now();
    const lastDisplayed = this.lastDisplayedTime;
    
    if (lastDisplayed) {
      const timeDelta = now - lastDisplayed;
      
      // If time jumped significantly, skip animations
      if (timeDelta > 2000) {
        this.updateDisplayInstant(now);
      } else {
        this.updateDisplay(now);
      }
    } else {
      this.updateDisplay(now);
    }
  }
  
  updateDisplay(time) {
    // Update all digits
    // Trigger animations if needed
    this.lastDisplayedTime = time;
  }
  
  updateDisplayInstant(time) {
    // Update all digits without animation
    // Skip flip animations
    this.lastDisplayedTime = time;
  }
  
  hasTimeChanged(time) {
    // Compare seconds (or minutes/hours if needed)
    const currentSecond = Math.floor(time / 1000);
    const lastSecond = this.lastDisplayedTime 
      ? Math.floor(this.lastDisplayedTime / 1000) 
      : -1;
    
    return currentSecond !== lastSecond;
  }
  
  cleanup() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
```

### Handling System Sleep/Wake

**Problem:** System sleeps, all timers stop, time jumps forward when system wakes.

**Solution:**
```javascript
// Pseudo-code
function handleSystemWake() {
  const previousTime = lastKnownTime;
  const currentTime = Date.now();
  const timeDelta = currentTime - previousTime;
  
  if (timeDelta > 5000) {
    // Significant time jump (likely sleep/wake)
    // Skip animations, update instantly
    updateDisplayInstant(currentTime);
    resetAnimationStates();
  } else if (timeDelta > 2000) {
    // Moderate time jump
    // Update instantly, skip animations
    updateDisplayInstant(currentTime);
  } else {
    // Normal operation
    // Process missed seconds if any
    processMissedSeconds(previousTime, currentTime);
  }
}
```

**Detection:**
- Compare time delta between updates
- If delta > 5 seconds, assume sleep/wake
- If delta > 2 seconds, skip animations
- Otherwise, process normally

### Animation Queue Management

**Problem:** Multiple time changes during animation.

**Solution:**
```javascript
// Pseudo-code
class AnimationQueue {
  constructor() {
    this.queue = [];
    this.isAnimating = false;
  }
  
  addUpdate(newValue) {
    this.queue.push(newValue);
    this.processQueue();
  }
  
  processQueue() {
    if (this.isAnimating || this.queue.length === 0) {
      return;
    }
    
    const nextValue = this.queue.shift();
    this.isAnimating = true;
    
    this.startAnimation(nextValue, () => {
      this.isAnimating = false;
      this.processQueue(); // Process next in queue
    });
  }
  
  startAnimation(value, callback) {
    // Start flip animation
    // Call callback when complete
    setTimeout(callback, 600); // Animation duration
  }
}
```

**Properties:**
- Queue time updates
- Process one at a time
- Don't stack animations
- Skip queue if time jumped significantly

### Accuracy Guarantees

**Requirements:**
1. Displayed time is always within 1 second of actual time
2. Time updates within 100ms of second boundary
3. No drift over extended periods (hours/days)
4. Handles system time changes gracefully

**Validation:**
- Compare displayed time with `Date.now()`
- Alert if discrepancy > 1 second
- Log time jumps for debugging
- Test over 24+ hour periods

---

## Implementation Guidance

### Component Architecture

**Recommended Structure:**

```
FlipClockApp (Root)
├── ClockEngine (Time Management)
│   ├── TimeScheduler (setInterval)
│   ├── VisualDriver (requestAnimationFrame)
│   └── TimeReference (Single Source of Truth)
├── FlipClock (Display)
│   ├── TimeGroup (Hours/Minutes/Seconds)
│   │   └── FlipDigit (Individual Digit)
│   │       ├── BackgroundTop
│   │       ├── BackgroundBottom
│   │       ├── FrontLeaf
│   │       └── BackLeaf
│   └── Separator (Colon)
├── SettingsPanel (Configuration)
│   ├── SettingItem (Individual Control)
│   └── SettingGroup (Grouped Controls)
└── StorageManager (Persistence)
    ├── LoadSettings
    └── SaveSettings
```

### Data Flow

**Time Flow:**
```
System Clock
  → ClockEngine.getCurrentTime()
  → ClockEngine.calculateComponents()
  → FlipClock.receiveTimeComponents()
  → FlipDigit.updateValue()
  → AnimationController.triggerFlip()
  → Visual Display Update
```

**Settings Flow:**
```
User Interaction
  → SettingsPanel.handleChange()
  → App.updateSetting()
  → StorageManager.save()
  → FlipClock.applySetting()
  → Visual Update
```

### Component Interfaces

**ClockEngine Interface:**
```typescript
// Pseudo-TypeScript (framework-agnostic)
interface ClockEngine {
  // Start/stop
  start(): void;
  stop(): void;
  
  // Time access
  getCurrentTime(): Date;
  getTimeComponents(): TimeComponents;
  
  // Events
  onTimeChange(callback: (time: Date) => void): void;
  
  // State
  isRunning(): boolean;
}

interface TimeComponents {
  hours: number;
  minutes: number;
  seconds: number;
  hours12: number; // For 12-hour mode
  ampm: 'AM' | 'PM';
}
```

**FlipDigit Interface:**
```typescript
interface FlipDigit {
  // Props
  value: string; // '0' to '9'
  animationSpeed: 'slow' | 'normal' | 'fast';
  randomizeTiming: boolean;
  
  // Events
  onAnimationStart(): void;
  onAnimationComplete(): void;
  
  // State
  isAnimating(): boolean;
  getDisplayedValue(): string;
}
```

**SettingsPanel Interface:**
```typescript
interface SettingsPanel {
  // Props
  settings: AppSettings;
  isOpen: boolean;
  
  // Events
  onSettingChange(setting: string, value: any): void;
  onClose(): void;
  
  // Methods
  open(): void;
  close(): void;
}

interface AppSettings {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  theme: 'auto' | 'light' | 'dark';
  animationSpeed: 'slow' | 'normal' | 'fast';
  randomizeTiming: boolean;
  brightness: number;
  scale: number;
  alwaysOnTop: boolean;
}
```

### State Management Pattern

**Recommended Pattern:** Single source of truth with derived state.

```javascript
// Pseudo-code
class AppState {
  constructor() {
    // Core state
    this.currentTime = null;
    this.settings = this.loadSettings();
    
    // Derived state
    this.timeComponents = null;
    this.digitValues = null;
    
    // UI state
    this.isSettingsOpen = false;
  }
  
  updateTime(time) {
    this.currentTime = time;
    this.timeComponents = this.calculateComponents(time);
    this.digitValues = this.splitIntoDigits(this.timeComponents);
    this.notifyListeners();
  }
  
  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.notifyListeners();
  }
  
  calculateComponents(time) {
    // Calculate hours, minutes, seconds
    // Apply 12-hour conversion if needed
    return components;
  }
  
  splitIntoDigits(components) {
    // Split each component into individual digits
    return {
      hours: [h1, h2],
      minutes: [m1, m2],
      seconds: [s1, s2]
    };
  }
}
```

### Event System

**Recommended Pattern:** Observer pattern or event emitter.

```javascript
// Pseudo-code
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

// Usage
const appEvents = new EventEmitter();

appEvents.on('timeChange', (time) => {
  // Update display
});

appEvents.on('settingChange', (setting, value) => {
  // Apply setting
});
```

### Framework-Specific Adaptations

**React:**
- Use `useState` for local state
- Use `useEffect` for timers and lifecycle
- Use `useRef` for persistent values
- Use `useCallback` for event handlers
- Use `useMemo` for derived state

**Angular:**
- Use `@Component` for components
- Use `@Input` / `@Output` for data flow
- Use `Observable` / `Subject` for events
- Use `OnInit` / `OnDestroy` for lifecycle
- Use `ChangeDetectorRef` for manual updates

**Vue:**
- Use `ref` / `reactive` for state
- Use `computed` for derived state
- Use `watch` for side effects
- Use `onMounted` / `onUnmounted` for lifecycle
- Use `provide` / `inject` for dependency injection

**Flutter:**
- Use `StatefulWidget` for stateful components
- Use `setState` for state updates
- Use `Timer` for scheduling
- Use `AnimationController` for animations
- Use `Provider` or `Riverpod` for state management

**Native (Electron/Tauri):**
- Use framework's state management (React/Vue/etc)
- Use native APIs for window management
- Use platform storage APIs
- Handle native events (focus, blur, etc)

---

## Known Issues to Avoid

### 1. Animation Freezing When Tab Inactive

**Problem:** `requestAnimationFrame` pauses when tab is inactive.

**Solution:** Use hybrid timer (setInterval + RAF).

**Avoid:**
- Relying solely on `requestAnimationFrame`
- Using `setTimeout` for time tracking
- Assuming animations will always run

### 2. Timer Drift Over Long Periods

**Problem:** `setInterval` can drift over hours/days.

**Solution:** Always calculate time from `Date.now()`, not from intervals.

**Avoid:**
- Accumulating time from intervals
- Using frame counts for time
- Assuming intervals are exact

### 3. Visual Tearing During Simultaneous Flips

**Problem:** Multiple digits flipping at once can cause visual glitches.

**Solution:** Proper z-index management and synchronized animations.

**Avoid:**
- Overlapping z-index values
- Unsynchronized animation timing
- Stacking animations

### 4. Bad Behavior When System Time Changes

**Problem:** Manual system time adjustment causes incorrect display.

**Solution:** Always use `Date.now()` and detect large time jumps.

**Avoid:**
- Caching time values
- Assuming time only moves forward
- Ignoring time jumps

### 5. Memory Leaks from Timers

**Problem:** Timers and event listeners not cleaned up.

**Solution:** Always clean up in component unmount/cleanup.

**Avoid:**
- Forgetting to clear intervals
- Not removing event listeners
- Creating timers without cleanup

### 6. Performance Issues from Excessive Updates

**Problem:** Updating display every frame causes performance issues.

**Solution:** Only update when time actually changes.

**Avoid:**
- Updating on every frame
- Recalculating unnecessarily
- Triggering animations when value unchanged

### 7. React StrictMode Double-Rendering

**Problem:** React StrictMode causes double renders in development.

**Solution:** Don't use StrictMode in production, handle double renders gracefully.

**Avoid:**
- Assuming effects run once
- Not checking if cleanup needed
- Creating timers in effects without cleanup

### 8. CSS Variable Platform Differences

**Problem:** Different platforms need different CSS values.

**Solution:** Detect platform and set CSS variables accordingly.

**Avoid:**
- Hardcoding platform-specific values
- Assuming one size fits all
- Not testing on different platforms

---

## Testing Checklist

### Time Accuracy Tests

- [ ] Clock displays correct time on startup
- [ ] Time updates every second accurately
- [ ] No drift over 1 hour period
- [ ] No drift over 24 hour period
- [ ] Handles midnight rollover correctly
- [ ] Handles hour rollover correctly (23→00)
- [ ] Handles minute rollover correctly (59→00)
- [ ] Handles second rollover correctly (59→00)
- [ ] Displays correct time after system sleep/wake
- [ ] Displays correct time after manual time adjustment

### Window State Tests

- [ ] Time continues updating when window loses focus
- [ ] Time continues updating when window is minimized
- [ ] Time continues updating when tab becomes inactive (web)
- [ ] Time syncs immediately when window regains focus
- [ ] No animation stacking when window regains focus
- [ ] Time is correct after extended background period
- [ ] Animations resume smoothly after focus regain

### Animation Tests

- [ ] Flip animations trigger when digits change
- [ ] Animations complete in correct duration (300/600/900ms)
- [ ] No visual tearing during flips
- [ ] Multiple digits can animate simultaneously
- [ ] Animations don't stack when rapid changes occur
- [ ] Animations skip correctly when time jumps significantly
- [ ] Split line remains visible during animation
- [ ] No flickering or glitches during animation

### Settings Tests

- [ ] 12-hour mode toggle works correctly
- [ ] 24-hour mode toggle works correctly
- [ ] Show/hide seconds works correctly
- [ ] Show/hide date works correctly
- [ ] Theme switching works (auto/light/dark)
- [ ] Animation speed changes apply correctly
- [ ] Randomize timing works correctly
- [ ] Brightness slider works correctly
- [ ] Scale slider works correctly
- [ ] Always on top works (desktop)
- [ ] All settings persist across app restarts

### Keyboard Shortcut Tests

- [ ] 'S' opens/closes settings
- [ ] 'T' cycles through themes
- [ ] 'H' hides/shows UI
- [ ] 'F' toggles fullscreen (desktop)
- [ ] 'Esc' closes settings/fullscreen
- [ ] '+/-' adjusts brightness
- [ ] '[/]' adjusts scale
- [ ] '?' shows keyboard shortcuts
- [ ] All shortcuts work in all contexts

### Responsive Design Tests

- [ ] Clock scales correctly on window resize
- [ ] Clock maintains aspect ratio
- [ ] Clock is readable on small screens (minimum size)
- [ ] Clock doesn't stretch excessively on ultra-wide
- [ ] Settings panel adapts to small screens
- [ ] Touch controls work on mobile
- [ ] Landscape orientation works correctly

### Performance Tests

- [ ] Animations run at 60fps
- [ ] No frame drops during flips
- [ ] Smooth performance on low-end devices
- [ ] No memory leaks over extended use
- [ ] CPU usage remains low (< 5% idle)
- [ ] GPU acceleration working correctly
- [ ] No layout thrashing

### Cross-Platform Tests

- [ ] Works correctly on Windows
- [ ] Works correctly on macOS
- [ ] Works correctly on Linux
- [ ] Works correctly in Chrome
- [ ] Works correctly in Firefox
- [ ] Works correctly in Safari
- [ ] Works correctly in Electron
- [ ] Works correctly in Tauri
- [ ] Works correctly as PWA (if applicable)

### Edge Case Tests

- [ ] Handles rapid time changes gracefully
- [ ] Handles system time going backwards
- [ ] Handles system time jumping forward significantly
- [ ] Handles multiple rollovers simultaneously
- [ ] Handles settings changes during animation
- [ ] Handles window resize during animation
- [ ] Handles theme change during animation
- [ ] Handles app backgrounding/foregrounding

---

## Success Criteria

### Functional Requirements

✅ **Time Accuracy:**
- Displayed time is always within 1 second of actual time
- Time updates correctly every second
- No drift over 24+ hour periods
- Handles all rollover cases correctly

✅ **Reliability:**
- Clock continues running when window unfocused
- Clock continues running when window minimized
- Clock syncs correctly after system sleep/wake
- No freezing or stuttering

✅ **Animations:**
- Smooth 60fps flip animations
- No visual glitches or tearing
- Animations complete in correct duration
- Multiple digits can animate simultaneously

✅ **Settings:**
- All settings work correctly
- Settings persist across sessions
- Settings apply immediately
- Settings work on all platforms

### Performance Requirements

✅ **Frame Rate:**
- Maintains 60fps during animations
- No frame drops below 30fps
- Smooth performance on low-end devices

✅ **Resource Usage:**
- CPU usage < 5% when idle
- Memory usage < 50MB
- No memory leaks
- Efficient battery usage (mobile)

### User Experience Requirements

✅ **Usability:**
- Intuitive keyboard shortcuts
- Clear settings panel
- Responsive to user input
- Works on all screen sizes

✅ **Visual Quality:**
- Clean, minimal design
- Smooth animations
- Proper contrast (accessibility)
- Consistent styling

### Platform Requirements

✅ **Compatibility:**
- Works on Windows, macOS, Linux
- Works in major browsers
- Works in Electron/Tauri
- Works on mobile browsers

✅ **Desktop Integration:**
- Native window controls
- System tray support (optional)
- Always on top works
- Fullscreen works

---

## Visual Specifications

### Color Palette

#### Dark Mode

| Token | Hex Code | Usage |
|-------|----------|-------|
| `--color-bg-primary` | `#000000` | Main background |
| `--color-bg-secondary` | `#333333` | Digit container |
| `--color-bg-card` | `#1a1a1a` | Digit card background |
| `--color-text-primary` | `#cccccc` | Digit text, separators |
| `--color-text-secondary` | `#888888` | Secondary text |
| `--color-shadow` | `rgba(0,0,0,0.5)` | Shadows |
| `--color-split-line` | `rgba(0,0,0,0.4)` | Split line |
| `--color-overlay` | `rgba(0,0,0,0.5)` | Settings overlay |
| `--color-panel-bg` | `#222222` | Settings panel |

#### Light Mode

| Token | Hex Code | Usage |
|-------|----------|-------|
| `--color-bg-primary` | `#f5f5f5` | Main background |
| `--color-bg-secondary` | `#e0e0e0` | Digit container |
| `--color-bg-card` | `#ffffff` | Digit card background |
| `--color-text-primary` | `#333333` | Digit text, separators |
| `--color-text-secondary` | `#666666` | Secondary text |
| `--color-shadow` | `rgba(0,0,0,0.2)` | Shadows |
| `--color-split-line` | `rgba(0,0,0,0.2)` | Split line |
| `--color-overlay` | `rgba(0,0,0,0.3)` | Settings overlay |
| `--color-panel-bg` | `#ffffff` | Settings panel |

### Typography

**Font Family:**
- Primary: `'Helvetica Neue', Helvetica, Arial, sans-serif`
- Fallback: System sans-serif

**Font Weights:**
- Digits: `bold` (700)
- Separators: `bold` (700)
- Labels: `normal` (400)
- Headings: `bold` (700)

**Font Sizes:**
- Digits: `18vmin` (scales with viewport)
- Separators: `10vmin` (scales with viewport)
- Date: `1.5vmin` or `14px` (whichever larger)
- Settings labels: `0.9rem`
- Settings headings: `1.2rem`
- Keyboard shortcuts: `0.8rem`

**Line Height:**
- Digits: `1` (tight, no extra spacing)
- Text: `1.5` (comfortable reading)

### Spacing Scale

**Base Unit:** `8px` (or `1rem` if using rem-based system)

| Scale | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | `5px` | Tight spacing |
| `--spacing-sm` | `10px` | Small spacing |
| `--spacing-md` | `15px` | Medium spacing |
| `--spacing-lg` | `20px` | Large spacing |
| `--spacing-xl` | `30px` | Extra large spacing |

**Viewport-Relative Spacing:**
- Digit gap: `1vmin`
- Separator gap: `1vmin`
- Group margin: `0 1vmin`

### Animation Specifications

**Durations:**
- Fast: `300ms`
- Normal: `600ms` (default)
- Slow: `900ms`

**Easing:**
- Default: `ease-in-out`
- Smooth acceleration and deceleration
- Natural feeling motion

**Properties:**
- Only animate `transform` (rotateX)
- Use `opacity` for fade effects (if needed)
- Avoid animating `width`, `height`, `top`, `left`

**Timing:**
- Animation starts immediately on value change
- No delay between value change and animation start
- Optional: Small random delay (±50ms) for organic feel

### Shadows and Depth

**Digit Container Shadow:**
- `0 0.5vmin 1.5vmin rgba(0,0,0,0.5)`
- Creates depth and separation
- Adjusts with viewport size

**Settings Panel Shadow:**
- `0 4px 20px rgba(0,0,0,0.5)`
- Creates modal appearance
- Fixed pixel values (not viewport-relative)

### Border Radius

**Digit Container:**
- `1.5vmin` (all corners)
- Scales with viewport
- Rounded but not too round

**Settings Panel:**
- `10px` (fixed)
- Consistent across platforms
- Modern, friendly appearance

### Visual Hierarchy

**Z-Index Scale:**
- Background elements: `0-1`
- Animated elements: `2`
- UI overlays: `5`
- Modals/panels: `1000`

**Opacity Scale:**
- Fully opaque: `1.0`
- Primary text: `1.0`
- Secondary text: `0.8`
- Hints: `0.3`
- Overlays: `0.5`

---

## Conclusion

This specification provides a complete, framework-agnostic design for a flip clock application. The document emphasizes:

1. **Accuracy**: Robust timer system that never freezes or drifts
2. **Smoothness**: 60fps animations with proper GPU acceleration
3. **Reliability**: Works correctly in all window states and platforms
4. **Flexibility**: Can be implemented in any technology stack
5. **Completeness**: All features, edge cases, and requirements specified

The specification is designed to be handed off to any developer or AI assistant to recreate the application in Angular, React, Electron, Flutter, native desktop, or any other technology stack.

**Key Takeaways:**
- Use hybrid timer (setInterval + requestAnimationFrame)
- Implement 4-layer flip animation system
- Handle all window state changes gracefully
- Optimize for performance and battery life
- Test thoroughly across platforms and edge cases

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Complete Specification

