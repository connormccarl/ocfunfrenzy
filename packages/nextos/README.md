# @connormccarl/nextos

Shared utilities and UI components for Next.js websites.

## TailwindCSS

This package includes Tailwind utility classes in its UI components. Import the package Tailwind source file from your Next.js global CSS so Tailwind can generate the classes used by the package:

```css
@import "tailwindcss";
@import "@connormccarl/nextos/tailwind.css";
```

For local workspace development, make sure your Next.js app transpiles this package:

```js
const nextConfig = {
  transpilePackages: ['@connormccarl/nextos'],
};

export default nextConfig;
```
