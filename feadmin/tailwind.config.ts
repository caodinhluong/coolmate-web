import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      backgroundImage: {
        'banner': 'url(/bgr.jpg)'
      },
      colors: {
        'test-color': '#ff0000', 
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;