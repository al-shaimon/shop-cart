# Modern E-commerce Project

A responsive e-commerce project built with Vanilla JavaScript and TailwindCSS.

## Features

- Responsive navigation with mobile menu
- Product grid with dynamic loading
- Shopping cart with sliding sidebar
- Cart functionality:
  - Add/remove items
  - Update quantities
  - Calculate subtotal, shipping, and total
  - Apply coupon codes
- Modern UI with animations
- Fully responsive design

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

## Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the project for production
- `npm run preview` - Preview the production build

## Project Structure

```
├── src/
│   ├── js/
│   │   └── main.js         # Main JavaScript file
│   ├── styles/
│   │   └── main.css        # Main CSS file with Tailwind imports
│   └── data/
│       └── products.json   # Sample product data
├── index.html              # Main HTML file
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── package.json           # Project dependencies and scripts
```

## Technologies Used

- Vanilla JavaScript
- TailwindCSS
- Vite (Build tool)
- PostCSS
- Font Awesome Icons
