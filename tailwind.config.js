/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#00FF7F',
          dim: '#00CC66',
          muted: '#00331A',
        },
        ai: {
          DEFAULT: '#00D4FF',
          dim: '#0099BB',
          muted: '#001A22',
        },
        surface: {
          DEFAULT: '#111111',
          elevated: '#1A1A1A',
          hover: '#222222',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'chat-slide': 'chatSlide 0.25s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'live-blink': 'liveBlink 1.5s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,255,127,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,127,0.6)' },
        },
        chatSlide: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        liveBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      boxShadow: {
        accent: '0 0 20px rgba(0,255,127,0.3)',
        'accent-sm': '0 0 10px rgba(0,255,127,0.2)',
        ai: '0 0 20px rgba(0,212,255,0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
