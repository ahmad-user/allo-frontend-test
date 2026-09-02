/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module 'vue-router/auto' {
  export * from 'vue-router'
  export * from 'unplugin-vue-router/runtime'
}
