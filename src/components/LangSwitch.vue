<script setup>
import { locale } from "../i18n";
const set = (v) => { locale.value = v; };
</script>

<template>
  <div class="lang-switch" role="group" aria-label="Language">
    <button :class="{ active: locale === 'ms' }" @click="set('ms')" type="button">BM</button>
    <button :class="{ active: locale === 'en' }" @click="set('en')" type="button">EN</button>
  </div>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  padding: 4px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  gap: 2px;
}
.lang-switch button {
  padding: 7px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.15s ease;
  cursor: pointer;
}
.lang-switch button:hover { color: #fff; }
.lang-switch button.active {
  background: linear-gradient(135deg, #f5c842, #fbbf24);
  color: #0a1e3f;
  box-shadow: 0 4px 12px rgba(245, 200, 66, 0.3);
}
</style>
