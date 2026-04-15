<script setup>
const photos = [
  { src: "/assets/graduates/grad-1.jpg", caption: "Konvokesyen IUC" },
  { src: "/assets/graduates/grad-6.jpg", caption: "Graduan Diploma" },
  { src: "/assets/graduates/grad-2.jpg", caption: "Konvokesyen IUC" },
  { src: "/assets/graduates/grad-5.jpg", caption: "Sesi bergambar" },
  { src: "/assets/graduates/grad-3.jpg", caption: "Graduan Diploma" },
  { src: "/assets/graduates/grad-4.jpg", caption: "Konvokesyen IUC" },
];
// duplicated list for seamless infinite scroll
const loop = [...photos, ...photos];
</script>

<template>
  <div class="marquee-wrap" role="region" aria-label="Konvokesyen graduan">
    <div class="marquee">
      <div class="marquee-track">
        <figure v-for="(p, i) in loop" :key="i" class="slide">
          <img
            :src="p.src"
            :alt="p.caption"
            loading="lazy"
            decoding="async"
            width="480"
            height="320"
          />
        </figure>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  /* edge fade so slides don't get abruptly cut */
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%);
}
.marquee {
  display: flex;
  width: max-content;
}
.marquee-track {
  display: flex;
  gap: 20px;
  padding: 4px 10px;
  animation: slide 48s linear infinite;
  will-change: transform;
}
.marquee:hover .marquee-track {
  animation-play-state: paused;
}
.slide {
  flex: 0 0 auto;
  width: 360px;
  height: 240px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  background: #0a1e3f;
  margin: 0;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.slide:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.45);
  border-color: rgba(245, 200, 66, 0.5);
}
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@keyframes slide {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); } /* duplicated list, so -50% = one full set */
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track { animation: none; }
}

@media (max-width: 768px) {
  .slide { width: 260px; height: 180px; border-radius: 14px; }
  .marquee-track { gap: 14px; animation-duration: 36s; }
}
</style>
