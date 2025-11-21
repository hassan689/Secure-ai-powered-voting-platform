# Theme Colors

The frontend uses a modern blue and teal color scheme.

## Primary Color: #3b82f6 (Blue)
- **Hex**: `#3b82f6`
- **Description**: Bright Blue
- **Usage**: Main buttons, links, primary actions, navigation highlights

## Secondary Color: #2dd4bf (Teal)
- **Hex**: `#2dd4bf`
- **Description**: Bright Teal/Cyan
- **Usage**: Accent buttons, highlights, success states, verify buttons

## Color Palette

### Primary Colors (Blue)
- `primary-50`: Very light blue (#eff6ff)
- `primary-100`: Light blue (#dbeafe)
- `primary-200`: Lighter blue (#bfdbfe)
- `primary-300`: Light-medium blue (#93c5fd)
- `primary-400`: Medium blue (#60a5fa)
- `primary-500`: **Main Blue (#3b82f6)**
- `primary-600`: Medium-dark blue (#2563eb)
- `primary-700`: Dark blue (#1d4ed8)
- `primary-800`: Darker blue (#1e40af)
- `primary-900`: Darkest blue (#1e3a8a)

### Secondary Colors (Teal)
- `secondary-50`: Very light teal (#f0fdfa)
- `secondary-100`: Light teal (#ccfbf1)
- `secondary-200`: Lighter teal (#99f6e4)
- `secondary-300`: Light-medium teal (#5eead4)
- `secondary-400`: **Main Teal (#2dd4bf)**
- `secondary-500`: Medium teal (#14b8a6)
- `secondary-600`: Medium-dark teal (#0d9488)
- `secondary-700`: Dark teal (#0f766e)
- `secondary-800`: Darker teal (#115e59)
- `secondary-900`: Darkest teal (#134e4a)

## Usage Examples

### Tailwind Classes
```jsx
// Primary blue buttons
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click Me
</button>

// Secondary teal buttons
<button className="bg-secondary-500 hover:bg-secondary-600 text-white">
  Verify
</button>

// Text colors
<h1 className="text-primary-600">Heading</h1>

// Borders
<div className="border-primary-500">Content</div>
```

### CSS Variables
```css
--primary-color: #3b82f6;
--secondary-color: #2dd4bf;
--primary-dark: #2563eb;
--secondary-dark: #14b8a6;
```

## Where Colors Are Used

1. **AuthPage**: Blue to teal gradient overlay, blue buttons
2. **Navigation**: Blue logo, blue active links
3. **Buttons**: Blue background for primary actions
4. **Cards**: Blue and teal icons
5. **Loading Spinners**: Blue border
6. **Test Buttons**: Teal background
7. **Verify Buttons**: Teal background

## Design Philosophy

The blue and teal theme provides:
- **Professional** appearance
- **Modern** and fresh aesthetic
- **Trustworthy** blue conveys reliability
- **Energetic** teal adds vibrancy
- **Accessible** - meets WCAG contrast requirements

## Gradient

The auth page uses a gradient from blue to teal:
```css
background: linear-gradient(to right, #3b82f6, #2dd4bf);
```

This creates a smooth transition from blue to teal.
