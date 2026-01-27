<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner'

type ToasterProps = {
  invert?: boolean
  theme?: 'light' | 'dark' | 'system'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  hotkey?: string[]
  richColors?: boolean
  expand?: boolean
  duration?: number
  visibleToasts?: number
  closeButton?: boolean
  toastOptions?: {
    className?: string
    descriptionClassName?: string
    actionButtonStyle?: Record<string, string>
    cancelButtonStyle?: Record<string, string>
  }
  offset?: string | number
  dir?: 'rtl' | 'ltr' | 'auto'
}

const props = withDefaults(defineProps<ToasterProps>(), {
  theme: 'dark',
  position: 'top-center',
  richColors: false,
  expand: false,
  duration: 3000,
  visibleToasts: 3,
  closeButton: false,
  dir: 'auto',
  offset: '80px',
})
</script>

<template>
  <Sonner 
    v-bind="props" 
    :toast-options="{
      className: 'backdrop-blur-md bg-[#2c3e50]/95 border border-light-blue/30 shadow-xl',
      descriptionClassName: 'text-light-blue/80',
      style: {
        background: 'rgba(44, 62, 80, 0.95)',
        color: '#00d4ff',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        backdropFilter: 'blur(12px)',
      }
    }"
    :style="{ position: 'fixed', zIndex: 9999 }"
  />
</template>
