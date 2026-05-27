// extension/sidepanel/tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'tab-in': 'slideTabIn 0.28s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'shimmer-slide': 'shimmer-slide 1.8s ease-in-out infinite',
        'glow-ping': 'glow-ping 1.5s ease-out infinite',
        'glow-ping-green': 'glow-ping-green 2s ease-out infinite',
        'orb-drift-1': 'orb-drift-1 8s ease-in-out infinite',
        'orb-drift-2': 'orb-drift-2 10s ease-in-out infinite',
        'orb-drift-3': 'orb-drift-3 7s ease-in-out infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(108, 142, 239, 0.2)',
        'glow-md': '0 0 28px rgba(108, 142, 239, 0.3), 0 0 60px rgba(108, 142, 239, 0.1)',
        'glow-green': '0 0 12px rgba(61, 214, 140, 0.25)',
        'glow-amber': '0 0 12px rgba(240, 180, 41, 0.3)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #6C8EEF, #9F7AEA)',
        'gradient-surface': 'linear-gradient(180deg, #131517 0%, #1A1C1F 100%)',
      },
    },
  },
  plugins: [],
};
