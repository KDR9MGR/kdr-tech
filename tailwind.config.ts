import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'vice-sunset': 'linear-gradient(135deg, #FFC857 0%, #FF8A3D 45%, #F0328A 100%)',
        'vice-btn': 'linear-gradient(90deg, #E8307F 0%, #FF5A4E 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // GTA VI / Vice City theme. The `brand-*` keys are kept (existing
        // classes like `hover:border-brand-magenta` still resolve) but now
        // point at the sunset palette: pink replaces the old logo indigo,
        // teal replaces the old logo cyan.
        brand: {
          cyan: '#22D3C5',
          indigo: '#F0328A',
          'indigo-hover': '#D01F74',
          magenta: '#F0328A',
          'magenta-hover': '#D01F74',
        },
        vice: {
          pink: '#F0328A',
          'pink-hover': '#D01F74',
          orange: '#FF8A3D',
          sun: '#FFC857',
          teal: '#22D3C5',
          night: '#0D0620',
          deep: '#070314',
          card: '#1A0C3D',
          dusk: '#43226F',
          haze: '#C0B3DA',
          cream: '#FFF1E8',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
