# Interactive Trend Chart Component

A comprehensive React component for visualizing search term trends with flexible date ranges and dynamic granularity.

## Features

### Multi-select Search Terms
- **Tesla**, **BMW**, and **Porsche** chips with individual selection
- Each term has its own color coding
- Visual feedback for selected/unselected state

### Dual Chart Modes

**Calendar Mode (Default)**
- All selected terms use the global date range
- X-axis shows real calendar dates
- Terms are aligned by actual dates

**Normalized Mode (Auto-activated)**
- Triggered when at least one chip has override enabled
- X-axis shows relative time buckets (Day 1, Day 2, etc.)
- All terms start at the same origin
- Different date ranges can be compared side-by-side

### Global Date Filter
- Quick presets: 7d, 30d, 90d, 1y
- Applies to all terms unless overridden

### Per-Term Date Override
- Each chip can override the global range independently
- Set custom date ranges per search term
- Automatically switches to normalized mode

### Dynamic Granularity
- Auto-adjusts available options based on date range:
  - **0-24h**: minute, hourly, daily
  - **2-7d**: hourly, daily
  - **8-30d**: daily, weekly
  - **31-90d**: daily, weekly, monthly
  - **>90d**: daily, weekly, monthly
- Default granularity selected intelligently

### Rich Tooltips
Shows for each data point:
- Search term name with color indicator
- Real calendar date for that bucket
- Relative bucket label (in normalized mode)
- Net mentions volume
- Percentage change from previous point

### Mock Data
- Realistic trend patterns with variance
- Seasonal/cyclical patterns
- Random volatility

## Installation

```bash
npm install
```

## Run

```bash
npm run dev
```

## Usage Example

1. **Compare same period**: Select all three terms, use global 30d filter (Calendar Mode)
2. **Compare different periods**: Enable override on BMW (7d) and Tesla (90d) while Porsche uses global (Normalized Mode)
3. **Adjust granularity**: Switch from daily to weekly to see broader patterns
4. **Hover over points**: See detailed metrics including real dates and percentage changes

## Component Structure

- `TrendChart.jsx` - Main component with all logic
- Self-contained with no external state management
- Uses Recharts for visualization
- Responsive design
