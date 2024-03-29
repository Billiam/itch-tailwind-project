import path from 'path'
import fs from 'fs'

import yaml from 'yaml'
import { defineConfig } from 'vite'

import posthtml from '@vituum/vite-plugin-posthtml'
import include from 'posthtml-include'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import highlight from 'posthtml-prism'

import { injectCss } from './build/inject-css'
import watchExtraFiles from './build/watch-extra-files'
import htmlCssPrefix from './build/html-css-prefix'
import filterInnerTree from './build/filter-inner-tree'
import stripLimitedAttributes from './build/strip-limited-attributes'
import replaceCodeTags from './build/replace-code-tags.js'

const src = path.resolve(__dirname, './src')
const outDir = path.resolve(__dirname, './dist')

const loadLocals = (path) => {
  if (!path) {
    return {}
  }

  const fileData = fs.readFileSync(path, 'utf-8')

  if (path.endsWith('.yml')) {
    return yaml.parse(fileData)
  } else if (path.endsWith('.json')) {
    return JSON.parse(fileData)
  }
  return {}
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  const dataFilePath = ['data.yml', 'data.json']
    .map((filename) => path.resolve(__dirname, 'src', filename))
    .find((pathName) => fs.existsSync(pathName))

  let locals = loadLocals(dataFilePath)

  const plugins = [
    highlight(),
    htmlCssPrefix({ prefix: 'custom-' }),
    replaceCodeTags,
    stripLimitedAttributes({ pageUrl: isBuild ? 'https://billiam.itch.io/itch-tailwind' : 'http://localhost:5173' })
  ]

  const config = {
    alias: {
      '@': src
    },
    assetsDir: '.',
    build: {
      minify: false,
      cssCodeSplit: false,
      emptyOutDir: true,
      outDir,
      rollupOptions: {
        output: {
          assetFileNames: `[name].[ext]`
        }
      }
    },

    plugins: [
      injectCss({ build: isBuild }),
      posthtml({
        root: src,
        include: false,
        plugins: [
          include({ root: src, posthtmlExpressionsOptions: { locals, missingLocal: '' } }),
          ...filterInnerTree({
            classFilter: isBuild ? null : 'user_formatted',
            plugins
          })
        ]
      }),
      isBuild && ViteMinifyPlugin(),
      watchExtraFiles([dataFilePath].filter(Boolean), (file, server) => {
        server.restart()
      })
    ].filter(Boolean)
  }

  if (isBuild) {
    config.root = src
  }

  return config
})
