# TOR2025 Race Statistics - Product Requirements

## Quick Start

Simply open `index.html` in any modern web browser - no server needed!

```bash
open index.html
```

All race data is embedded directly in the app for offline use.

---

## Core Purpose & Success
- **Mission Statement**: Visualize and compare TOR2025 race timing breakdowns across all participants at each checkpoint.
- **Success Indicators**: 
    - Successfully loads participant and results data embedded in the application.
    - Displays a comprehensive visualization showing timing differences per checkpoint for all participants.
    - Users can easily identify patterns, outliers, and compare performance across checkpoints.
    - Filters work correctly to narrow down participant analysis by category, sex, and country.
    - Interactive checkpoint comparison highlights matching segments across all participants.
- **Experience Qualities**: Analytical, Clear, Insightful, Responsive.

## Project Classification & Approach
- **Complexity Level**: Light Application (data fetching, processing, and visualization).
- **Primary User Activity**: Consuming (analyzing visual data).

## Thought Process for Feature Selection
- **Core Problem Analysis**: Race organizers and analysts need to understand where participants gained or lost time during the race by examining checkpoint-to-checkpoint timing differences.
- **User Context**: Users want to quickly see timing patterns across the entire field at each checkpoint to identify where the race was decided.
- **Critical Path**: 1. App loads and fetches data. 2. Data is processed to calculate timing splits. 3. Visualization displays all participants' checkpoint times as lines for comparison.
- **Key Moments**: The initial data load and the moment the visualization reveals timing patterns across all participants.

## Essential Features
- **Data Management**:
    - What it does: Loads participant registration, race results, and checkpoint definitions from embedded JavaScript data (data.js - 8.6MB).
    - Why it matters: Ensures data availability regardless of network; improves loading performance; preserves historical race data; eliminates CORS issues; enables offline use.
    - How we'll validate it: Console logs confirm successful data loading; app opens directly in browser without server.
    - Data sources (downloaded Sept 30, 2025):
        * 1,235 participants from https://beebeeassets.beebeeboard.com/rankings/statics/iscritti_1034.json
        * Race results from https://beebeeassets.beebeeboard.com/rankings/classifiche/1034.json
        * Checkpoint definitions from https://beebeeassets.beebeeboard.com/rankings/statics/avanzati_1034.json

- **Data Filtering**:
    - What it does: Provides dropdown filters for Category, Sex, and Country to narrow down participant display.
    - Why it matters: Allows users to focus analysis on specific demographic groups or race categories.
    - How we'll validate it: Filters correctly reduce the displayed participants; "no results" message appears when appropriate.

- **Timing Breakdown Visualization**:
    - What it does: Creates a stacked horizontal bar chart where each participant is a bar showing split times between checkpoints.
    - Why it matters: Allows visual comparison of where time was gained or lost across all participants.
    - How we'll validate it: All participants appear as horizontal bars with colored segments; checkpoint highlighting works on click.

- **Interactive Checkpoint Comparison**:
    - What it does: Clicking on a checkpoint segment highlights that same checkpoint across all participants.
    - Why it matters: Enables quick comparison of performance at specific points in the race.
    - How we'll validate it: Click highlights matching segments; click again to deselect.

- **Loading State**:
    - What it does: Shows a loading indicator while data is being fetched.
    - Why it matters: Provides feedback during async operations.
    - How we'll validate it: Loading state appears and disappears appropriately.

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Professional, data-driven, analytical yet accessible.
- **Design Personality**: Clean, technical, modern - like a professional sports analytics dashboard.
- **Visual Metaphors**: Racing, speed, progression through checkpoints.
- **Simplicity Spectrum**: Minimal UI chrome, maximum focus on the data visualization.

### Color Strategy
- **Color Scheme Type**: Distinct categorical colors for checkpoint differentiation.
- **Primary Color**: Deep blue (#1e40af) - represents data, trust, and professionalism.
- **Secondary Colors**: Grays for UI elements and backgrounds.
- **Checkpoint Colors**: 20 highly distinct categorical colors (Kelly's maximum contrast set) cycling for checkpoints - ensures visual distinction between adjacent segments.
- **Accent Color**: Vibrant orange (#f97316) for highlighting key data points and interactions.
- **Color Psychology**: Blue conveys analytical rigor, distinct checkpoint colors enable quick pattern recognition.
- **Color Accessibility**: High contrast between background and text, checkpoint colors chosen for maximum perceptual difference.
- **Foreground/Background Pairings**:
    - Background (oklch(0.98 0.01 220)): Dark text (oklch(0.15 0.02 220)) - Contrast: 13.5:1 ✓
    - Card (oklch(1 0 0)): Dark text (oklch(0.15 0.02 220)) - Contrast: 15.8:1 ✓
    - Primary (oklch(0.45 0.15 250)): White text (oklch(0.98 0.01 220)) - Contrast: 8.2:1 ✓
    - Accent (oklch(0.65 0.18 35)): Dark text (oklch(0.15 0.02 220)) - Contrast: 6.8:1 ✓

### Typography System
- **Font Pairing Strategy**: Single modern sans-serif for all text - Inter for clean data presentation.
- **Typographic Hierarchy**: 
    - Large heading (32px, bold) for title
    - Medium text (16px, regular) for labels and axis
    - Small text (12px) for detailed information
- **Font Personality**: Technical, modern, highly legible at all sizes.
- **Readability Focus**: Clear number and label display is critical for data interpretation.
- **Typography Consistency**: Consistent sizing and weights throughout.
- **Which fonts**: Inter (Google Fonts) - designed for screen readability.
- **Legibility Check**: Inter is specifically designed for data-heavy interfaces and excels at number differentiation.

### Visual Hierarchy & Layout
- **Attention Direction**: Title → Visualization → Details. The chart dominates the viewport.
- **White Space Philosophy**: Generous padding around the visualization to let it breathe, minimal chrome elsewhere.
- **Grid System**: Simple full-width layout with the chart as the primary element.
- **Responsive Approach**: Chart scales to fill available space, maintaining readability.
- **Content Density**: Focus on the visualization with minimal UI clutter.

### Animations
- **Purposeful Meaning**: Smooth transitions when data loads, subtle hover effects on interactive elements.
- **Hierarchy of Movement**: Data appearance is most important, UI elements are secondary.
- **Contextual Appropriateness**: Minimal animation - data should appear quickly and smoothly without distraction.

### UI Elements & Component Selection
- **Component Usage**: 
    - Card for containing the visualization
    - Loading spinner for data fetch states
    - Minimal buttons if interaction is needed
- **Component Customization**: Clean, minimal styling that doesn't compete with the data.
- **Component States**: Clear loading, loaded, and error states.
- **Icon Selection**: Phosphor icons for any UI controls (play, refresh, etc.).
- **Component Hierarchy**: Visualization is primary, controls are secondary.
- **Spacing System**: Consistent 16px/24px/32px spacing using Tailwind scale.
- **Mobile Adaptation**: Chart scales down gracefully, may need horizontal scrolling for many participants.

### Visual Consistency Framework
- **Design System Approach**: Data-first design - UI serves the visualization.
- **Style Guide Elements**: Consistent colors for participants, clear axis labels, legend if needed.
- **Visual Rhythm**: Regular spacing between elements, clear visual grouping.
- **Brand Alignment**: Professional sports analytics aesthetic.

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance for all text elements. Chart lines have sufficient contrast and differentiation through color and pattern if needed.

## Edge Cases & Problem Scenarios
- **Potential Obstacles**: 
    - Data embedded in large JS file (8.6MB) might take time to parse on slower devices
    - Too many participants might make visualization cluttered
    - Filter combinations that return zero results
    - Checkpoint timing anomalies (e.g., participants passing back through checkpoints post-race)
- **Edge Case Handling**: 
    - Loading state during initial data parsing
    - "No results" message when filters return empty set
    - Timestamp-based sorting with anomaly filtering to handle out-of-order checkpoints
    - DNF (Did Not Finish) participants labeled and sorted to end
- **Technical Constraints**: Browser SVG performance with many participants; mitigated by using D3.js efficiently.

## Implementation Considerations
- **Scalability Needs**: Handles 1,235 participants with variable checkpoint counts; dynamic chart height based on filtered results.
- **Testing Focus**: Validate data parsing from embedded JS; ensure visualization renders correctly; verify filter logic produces correct results; test interactive checkpoint highlighting.
- **Performance Optimizations**: 
  - Data embedded in JS loads synchronously (no network latency)
  - 150ms debounce on filter changes to batch updates while user is selecting
  - Tooltip element reused across renders instead of recreated
  - Visual feedback (opacity fade) during filter updates
  - D3.js handles SVG rendering efficiently with minimal DOM manipulation
- **Rendering**: Chart re-renders on filter change; split calculations happen per render but are fast enough for smooth UX.

## Project Structure

```
TOR2025-stats/
├── index.html          # Main HTML file - just open this!
├── app.js             # Application logic and D3.js visualization (20KB)
├── style.css          # Styling with CSS custom properties
├── data.js            # Embedded race data (8.6MB)
├── data/              # Original JSON files (backup/reference)
│   ├── iscritti_1034.json      # Participant registration data
│   ├── classifiche_1034.json   # Race results and timing data
│   ├── avanzati_1034.json      # Checkpoint definitions
│   └── README.md               # Data source documentation
└── src/
    └── prd.md         # This file - Product requirements document
```

## Technologies Stack
- **D3.js v7** - Data visualization library (loaded from CDN)
- **Vanilla JavaScript** - No build system, bundler, or framework required
- **CSS Custom Properties** - Theme variables using oklch color space
- **Phosphor Icons** - Icon library (loaded from CDN)
- **Embedded Data** - 8.6MB JavaScript file with all race data

## Browser Compatibility
Works in all modern browsers supporting:
- ES6 JavaScript
- CSS Custom Properties (CSS Variables)
- SVG rendering
- oklch color space

Tested on: Chrome, Firefox, Safari, Edge

## Current Status
✅ All features implemented and working
✅ Data embedded for offline use
✅ No server or build process required
✅ Interactive filtering and checkpoint comparison functional
✅ Handles edge cases (DNF, timing anomalies, zero results)
- **Critical Questions**: 
    - How many timing points (cronos) are there per participant?
    - What's the best way to differentiate many lines visually?
    - Should we show cumulative times or split times?

## Reflection
- This visualization directly addresses the need to compare performance across all participants at each checkpoint, making it easy to spot where races were won or lost.
- The line chart format is ideal for showing progression and allows quick visual comparison across the entire field.
- D3.js is perfect for this data visualization need, providing the flexibility to create a clear, interactive chart.
