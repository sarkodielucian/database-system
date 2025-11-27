# UI Components Integration Guide

This document provides a comprehensive guide to the UI component system in the Mt. Olivet Church Management System.

## Overview

The UI components are located in `client/src/components/ui/` and provide a consistent, responsive layout for the entire application.

## Component Structure

### 1. Layout Component (`Layout.jsx`)

The main wrapper component that combines the Header and Sidebar.

**Usage:**
```jsx
import { Layout } from './components/ui/Layout';

<Layout>
  {/* Page content via React Router Outlet */}
</Layout>
```

**Features:**
- Manages sidebar open/close state
- Responsive design (mobile & desktop)
- Beautiful gradient background
- Max-width container for content

**Props:** None (uses React Router Outlet)

---

### 2. Header Component (`Header.jsx`)

Top navigation bar with search, notifications, and profile menu.

**Usage:**
```jsx
import { Header } from './components/ui/Header';

<Header 
  onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
  sidebarOpen={sidebarOpen}
/>
```

**Props:**
- `onMenuClick` (function): Callback for mobile menu toggle
- `sidebarOpen` (boolean): Current sidebar state

**Features:**
- **Search Bar**: Desktop only (hidden on mobile)
- **Notifications**: Bell icon with red dot indicator
- **Profile Menu**: Dropdown with Profile and Logout options
- **Mobile Menu**: Hamburger icon for sidebar toggle

**Styling:**
- Height: 64px (h-16)
- Background: White
- Border: Bottom gray border
- Shadow: Subtle shadow

---

### 3. Sidebar Component (`Sidebar.jsx`)

Side navigation menu with all application routes.

**Usage:**
```jsx
import { Sidebar } from './components/ui/Sidebar';

<Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)} 
/>
```

**Props:**
- `isOpen` (boolean): Controls sidebar visibility
- `onClose` (function): Callback to close sidebar

**Features:**
- **Church Branding**: Logo and ministry name at top
- **Navigation Menu**: 11 menu items with icons
- **Active State**: White background for current route
- **Version Footer**: System version display
- **Mobile Overlay**: Dark overlay when open on mobile
- **Auto-close**: Closes after navigation on mobile

**Navigation Items:**
1. Dashboard
2. Members
3. Visitors
4. Teachers
5. Attendance
6. Finance
7. Bulk SMS
8. Equipment
9. Reports
10. Cluster Follow-up
11. Settings

**Styling:**
- Width: 288px (w-72)
- Background: Gradient from slate-900 to blue-900
- Position: Fixed on mobile, static on desktop
- Transition: Smooth 300ms slide animation

---

## Responsive Behavior

### Desktop (lg and above - 1024px+)
- Sidebar: Always visible, static position
- Header: Full search bar visible
- Layout: Sidebar + content side by side

### Mobile (below 1024px)
- Sidebar: Hidden by default, slides in when toggled
- Header: Search bar hidden, menu icon visible
- Layout: Full-width content
- Overlay: Dark overlay when sidebar open

---

## Global Styles (globals.css)

The `globals.css` file provides comprehensive styling for the entire application.

### Key Classes

#### Layout Classes
- `.sidebar` - Sidebar container with gradient and scrollbar
- `.sidebar-nav-item` - Navigation item with hover effects
- `.sidebar-nav-item.active` - Active route styling
- `.main-content` - Main content area with margin

#### Component Classes
- `.card` - White card with shadow and border
- `.gradient-blue` - Blue gradient background
- `.gradient-dark` - Dark gradient (sidebar)
- `.fade-in` - Fade-in animation

#### Button Classes
- `.btn-primary` - Primary blue gradient button
- `.btn-secondary` - White outlined button
- `.btn-danger` - Red button
- `.btn-success` - Green button

#### Badge Classes
- `.badge-success` - Green badge
- `.badge-warning` - Orange badge
- `.badge-error` - Red badge
- `.badge-info` - Blue badge

#### Utility Classes
- `.glass` - Glassmorphism effect
- `.text-gradient` - Gradient text
- `.shadow-glow-blue` - Blue glow shadow
- `.custom-scrollbar` - Styled scrollbar

---

## Integration Steps

### 1. Import Styles
Make sure `index.css` imports `globals.css`:

```css
/* client/src/index.css */
@import './globals.css';
```

### 2. Update App.jsx
Use the Layout component from the ui folder:

```jsx
import { Layout } from './components/ui/Layout';

<Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      {/* Other routes */}
    </Route>
  </Routes>
</Router>
```

### 3. Use in Pages
Page components automatically receive the Layout via Outlet:

```jsx
// Any page component
export function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      {/* Page content */}
    </div>
  );
}
```

---

## Customization

### Changing Colors

Edit `globals.css`:

```css
/* Primary gradient */
.gradient-blue {
  @apply bg-gradient-to-r from-blue-600 to-blue-700;
}

/* Sidebar gradient */
.sidebar {
  @apply bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900;
}
```

### Adding Menu Items

Edit `Sidebar.jsx`:

```jsx
const menuItems = [
  // Add new item
  { path: '/new-page', icon: IconName, label: 'New Page' },
];
```

### Modifying Header

Edit `Header.jsx` to add/remove features:
- Search bar
- Notification system
- Profile menu items

---

## Best Practices

### 1. Component Organization
- Keep UI components in `components/ui/`
- Keep page components in `components/pages/`
- Use named exports for better tree-shaking

### 2. Responsive Design
- Always test on mobile, tablet, and desktop
- Use Tailwind breakpoints: sm, md, lg, xl
- Hide/show elements appropriately

### 3. Performance
- Keep sidebar state in Layout (single source of truth)
- Use React Router's NavLink for active states
- Avoid unnecessary re-renders

### 4. Accessibility
- Include aria-labels on icon buttons
- Maintain keyboard navigation
- Ensure proper contrast ratios
- Focus states included in globals.css

---

## Troubleshooting

### Sidebar not showing on mobile
- Check `isOpen` prop
- Verify z-index values
- Ensure overlay is rendering

### Search bar not visible
- Check screen size (hidden below md breakpoint)
- Verify responsive classes

### Active route not highlighting
- Use React Router's `NavLink` component
- Check route paths match exactly

### Styles not applying
- Verify `globals.css` is imported in `index.css`
- Check Tailwind configuration
- Rebuild if necessary

---

## File Locations

```
client/src/
├── components/
│   ├── ui/
│   │   ├── Header.jsx       # Top navigation
│   │   ├── Sidebar.jsx      # Side navigation
│   │   ├── Layout.jsx       # Main wrapper
│   │   └── index.js         # Exports
│   └── pages/               # All page components
├── globals.css              # Global styles
├── index.css                # Imports globals.css
└── App.jsx                  # Router setup
```

---

## Example Usage

```jsx
// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
```

---

**Version:** 1.0.0  
**Last Updated:** November 2024  
**For:** Mt. Olivet Church Management System
