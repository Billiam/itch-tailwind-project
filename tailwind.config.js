// const colors from 'tailwindcss/colors')
import { scopedPreflightStyles } from './build/scoped-preflight'
import typography from '@tailwindcss/typography'
import { templateClasses } from './build/template-classes'
import { addDynamicIconSelectors } from '@iconify/tailwind'


export default {
  // HTML and ejs files will be scanned for tailwind classes.
  content: ['./src/**/*.{html,ejs}'],
  theme: {
    extend: {},
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    screens: {
      lg: '1100px',
      md: '800px',
      sm: '600px'
    }
  },
  plugins: [
    // Prefix tailwind's preflight reset with user_formatted class, so that itch.io UI isn't affected
    scopedPreflightStyles({ cssSelector: '.user_formatted' }),
    addDynamicIconSelectors(),
    // Enable .prose class. Remove to reduce CSS if not needed
    // typography({ target: 'legacy' })
  ],
  // whitelist all class names from template file so that they can be targeted if needed
  // add your own classes here if they're part of the itch.io UI you're targeting
  // but don't appear in your base template
  safelist: [...Array.from(templateClasses), 'token', 'game_comments_widget'],
  corePlugins: {
    preflight: false
  },
  important: true,
  experimental: {
    optimizeUniversalDefaults: true
  }
}
