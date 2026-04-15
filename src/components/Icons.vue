<script setup>
defineProps({ name: { type: String, required: true }, size: { type: [String, Number], default: 20 } });
</script>

<template>
  <!-- WhatsApp -->
  <svg v-if="name === 'whatsapp'" :width="size" :height="size" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16.002 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.59 4.47 1.72 6.42L3.2 28.8l6.56-1.72a12.73 12.73 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.73 12.73 0 0 0 16.002 3.2Zm0 23.34h-.01a10.64 10.64 0 0 1-5.43-1.49l-.39-.23-4.03 1.06 1.08-3.93-.25-.4a10.57 10.57 0 0 1-1.63-5.65c0-5.86 4.78-10.64 10.65-10.64 2.85 0 5.52 1.11 7.53 3.12 2.01 2.01 3.12 4.68 3.12 7.54 0 5.86-4.78 10.62-10.64 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.1-.5-.16-.72.16s-.82 1.04-1 1.25c-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.67 9.67 0 0 1-1.78-2.22c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.39-.26-.63-.53-.54-.72-.55l-.61-.01c-.21 0-.56.08-.86.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.11 1.31 3.32c.16.21 2.27 3.47 5.49 4.87.77.33 1.37.53 1.83.68.77.25 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" fill="currentColor"/>
  </svg>

  <!-- Arrow right -->
  <svg v-else-if="name === 'arrow'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Check -->
  <svg v-else-if="name === 'check'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12.5 10 17l9-10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Clock (urgency) -->
  <svg v-else-if="name === 'clock'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>

  <!-- Star -->
  <svg v-else-if="name === 'star'" :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5 14.9 9l7 .6-5.3 4.6L18 21l-6-3.5L6 21l1.4-6.8L2.1 9.6 9.1 9z"/>
  </svg>

  <!-- Shield (trust) -->
  <svg v-else-if="name === 'shield'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z" stroke="currentColor" stroke-width="1.8"/>
    <path d="m9 12 2.2 2.2L15 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>

  <!-- Sparkle -->
  <svg v-else-if="name === 'sparkle'" :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 13.5 8.5 20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/>
  </svg>

  <!-- Plus / Minus (FAQ) -->
  <svg v-else-if="name === 'plus'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="name === 'minus'" :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </svg>

  <!-- Apple-style person (filled bust silhouette) -->
  <svg v-else-if="name === 'person'" :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-3.9 3.6-7 8-7s8 3.1 8 7v.5c0 .28-.22.5-.5.5H4.5a.5.5 0 0 1-.5-.5V20Z"/>
  </svg>
</template>
