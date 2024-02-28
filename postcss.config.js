import { templateClasses } from './build/template-classes.cjs'
const normalizedClasses = Array.from(templateClasses).map(className => `.${className}`)

console.log({ f: Array.from(templateClasses).sort() })
export default {
  plugins: {
    'postcss-import': { },
    'tailwindcss/nesting': {},
    tailwindcss: {},
    './build/postcss/class-prefixer/prefixer.cjs': {
      prefix: 'custom-',
      ignore: [...normalizedClasses, '.game_comments_widget']
    },
    autoprefixer: {},
    cssnano: { preset: 'default' }
  }
}
