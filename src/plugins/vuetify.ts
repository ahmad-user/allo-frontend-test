/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const aerospaceDark = {
  dark: true,
  colors: {
    background: '#070b14',
    surface: '#0d1527',
    'surface-bright': '#131f38',
    'surface-light': '#182747',
    'surface-variant': '#101b33',
    'on-surface-variant': '#94a3b8',
    primary: '#38bdf8',
    'primary-darken-1': '#0284c7',
    secondary: '#818cf8',
    accent: '#06b6d4',
    error: '#f87171',
    info: '#38bdf8',
    success: '#34d399',
    warning: '#fbbf24',
    'on-background': '#f1f5f9',
    'on-surface': '#f1f5f9',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'aerospaceDark',
    themes: {
      aerospaceDark,
    },
  },
})
