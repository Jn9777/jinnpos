module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 100%, 40%)',
          foreground: 'hsl(0, 0%, 100%)',
          hover: 'hsl(210, 100%, 35%)',
          active: 'hsl(210, 100%, 30%)',
        },
        secondary: {
          DEFAULT: 'hsl(210, 100%, 50%)',
          foreground: 'hsl(0, 0%, 100%)',
          hover: 'hsl(210, 100%, 45%)',
          active: 'hsl(210, 100%, 35%)',
        },
        tertiary: {
          DEFAULT: 'hsl(0, 0%, 98%)',
          foreground: 'hsl(210, 15%, 15%)',
        },
        accent: {
          DEFAULT: 'hsl(29, 100%, 52%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        success: {
          DEFAULT: 'hsl(157, 100%, 35%)',
          foreground: 'hsl(0, 0%, 100%)',
          light: '#E8F5E9',
        },
        warning: {
          DEFAULT: 'hsl(29, 100%, 52%)',
          foreground: 'hsl(0, 0%, 100%)',
          light: '#FFF3E0',
        },
        error: {
          DEFAULT: 'hsl(4, 80%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        info: {
          DEFAULT: 'hsl(210, 100%, 40%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        neutral: {
          50: 'hsl(0, 0%, 98%)',
          100: 'hsl(0, 0%, 95%)',
          200: 'hsl(0, 0%, 90%)',
          300: 'hsl(0, 0%, 80%)',
          400: 'hsl(0, 0%, 70%)',
          500: 'hsl(0, 0%, 58%)',
          600: 'hsl(0, 0%, 45%)',
          700: 'hsl(0, 0%, 32%)',
          800: 'hsl(0, 0%, 18%)',
          900: 'hsl(0, 0%, 10%)',
        },
        background: 'hsl(0, 0%, 96%)',
        foreground: 'hsl(0, 0%, 10%)',
        border: 'hsl(0, 0%, 80%)',
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(210, 15%, 15%)',
        },
        muted: {
          DEFAULT: 'hsl(0, 0%, 95%)',
          foreground: 'hsl(0, 0%, 45%)',
        },
        popover: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(210, 15%, 15%)',
        },
        input: 'hsl(0, 0%, 80%)',
        ring: 'hsl(210, 100%, 70%)',
        destructive: {
          DEFAULT: 'hsl(4, 80%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
        xl: '24px',
        '2xl': '28px',
        '3xl': '32px',
        full: '9999px',
      },
      fontSize: {
        'display': ['96px', { lineHeight: '1.2', fontWeight: '900' }],
        'h2': ['48px', { lineHeight: '1.3', fontWeight: '800' }],
        'h3': ['36px', { lineHeight: '1.4', fontWeight: '700' }],
        'h4': ['28px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['24px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'checkmark-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'pulse-green': {
          '0%, 100%': { backgroundColor: 'hsl(157, 100%, 35%)' },
          '50%': { backgroundColor: 'hsl(157, 100%, 45%)' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'slide-out-right': 'slide-out-right 500ms ease-out',
        'slide-in-left': 'slide-in-left 300ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'checkmark-pop': 'checkmark-pop 400ms ease-out',
        'fade-out': 'fade-out 500ms ease-out forwards',
        'pulse-green': 'pulse-green 1s ease-in-out infinite',
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};