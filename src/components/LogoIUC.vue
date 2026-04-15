<script setup>
defineProps({
  height: { type: [String, Number], default: 36 },
  tone: { type: String, default: "light" }, // "light" on dark bg (inverts to white), "brand" on light bg (original purple)
});
</script>

<template>
  <img
    src="/assets/innovative.png"
    alt="Innovative University College"
    class="logo-img"
    :class="tone === 'light' ? 'tone-light' : 'tone-brand'"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  />
</template>

<style scoped>
.logo-img {
  width: auto;
  display: block;
}
.tone-light {
  filter: brightness(0) invert(1);
}
</style>
