# CustomRide - Premium Custom Cars & Parts

A React-based e-commerce platform for custom cars and performance parts.

## Features

- Individual car detail pages with full specifications
- Custom modifications list for each car
- Compatible parts section showing parts specifically for each car
- Direct purchase functionality for both cars and parts
- Detailed car descriptions
- Test drive request option

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── CarCard.jsx      # Car listing component
│   ├── CarDetail.jsx    # Car detail page component
│   └── Navigation.jsx   # Navigation bar component
├── lib/                 # Utility functions
└── App.jsx             # Main application component
```

## Components

### Car Detail Page (`CarDetail.jsx`)

The car detail page includes:

1. **Full Car Specifications** - Engine, power, torque, seating capacity, transmission, etc.
2. **Custom Modifications List** - All custom work displayed with pricing
3. **Compatible Parts Section** - Purchase parts specifically designed for that car
4. **Detailed Description** - Complete information about the car
5. **Test Drive Request** - Option to request test drives
6. **Add to Cart** - Functionality to add both the car and individual parts to cart

### UI Components

- `Button` - Reusable button component with variants
- `Card` - Flexible card component for content containers
- `Badge` - Tag-like component for labels and indicators
- `Separator` - Visual divider component

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Dependencies

- React & React DOM
- React Router DOM for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Radix UI for accessible UI primitives