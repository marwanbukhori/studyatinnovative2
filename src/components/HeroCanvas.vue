<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as THREE from "three";

const canvas = ref(null);
let cleanup = null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);

// Extra cautious guard — very low-end devices
const isWeakDevice = () =>
  typeof navigator !== "undefined" &&
  ((navigator.deviceMemory && navigator.deviceMemory < 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));

onMounted(() => {
  if (!canvas.value) return;
  if (prefersReducedMotion() || isWeakDevice()) return; // keep static fallback

  const mobile = isMobile();

  // Tunables per-profile
  const TUNE = mobile
    ? { particles: 180, caps: 3, capScale: 0.55, dpr: 1.25, size: 0.12, autoRotate: true, mouseFollow: false, fpsCap: 30 }
    : { particles: 600, caps: 8, capScale: 1.0, dpr: 2.0, size: 0.08, autoRotate: false, mouseFollow: true, fpsCap: 60 };

  const el = canvas.value;
  const getSize = () => ({ w: el.clientWidth || window.innerWidth, h: el.clientHeight || 600 });

  const scene = new THREE.Scene();
  let { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({
    canvas: el,
    alpha: true,
    antialias: !mobile, // turn off AA on mobile
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, TUNE.dpr));
  renderer.setSize(w, h, false);

  // ---- Particles ----
  const count = TUNE.particles;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const blue = new THREE.Color(0x3b82f6);
  const blueLight = new THREE.Color(0x60a5fa);
  const gold = new THREE.Color(0xf5c842);
  const white = new THREE.Color(0xffffff);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 28;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
    const mix = Math.random();
    const c = mix < 0.45 ? blue : mix < 0.7 ? blueLight : mix < 0.88 ? white : gold;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({
    size: TUNE.size,
    transparent: true,
    opacity: 0.85,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ---- Graduation caps (mortar boards) — disabled for now ----
  /*
  const caps = new THREE.Group();
  // Pre-build shared geometries/materials for mobile (cheaper)
  const shared = mobile
    ? {
        baseGeo: new THREE.BoxGeometry(1.2, 0.25, 1.2),
        topGeo: new THREE.BoxGeometry(1.6, 0.08, 1.6),
        tasselGeo: new THREE.SphereGeometry(0.08, 8, 8),
        baseMat: new THREE.MeshBasicMaterial({ color: 0x2563eb }),
        topMat: new THREE.MeshBasicMaterial({ color: 0x0a1e3f }),
        tasselMat: new THREE.MeshBasicMaterial({ color: 0xf5c842 }),
      }
    : null;

  for (let i = 0; i < TUNE.caps; i++) {
    const g = new THREE.Group();
    const base = mobile
      ? new THREE.Mesh(shared.baseGeo, shared.baseMat)
      : new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.25, 1.2),
          new THREE.MeshStandardMaterial({
            color: 0x12316c, roughness: 0.4, metalness: 0.3,
            emissive: 0x2563eb, emissiveIntensity: 0.3,
          })
        );
    const top = mobile
      ? new THREE.Mesh(shared.topGeo, shared.topMat)
      : new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.08, 1.6),
          new THREE.MeshStandardMaterial({ color: 0x0a1e3f, roughness: 0.3, metalness: 0.5 })
        );
    top.position.y = 0.2;
    const tassel = mobile
      ? new THREE.Mesh(shared.tasselGeo, shared.tasselMat)
      : new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: 0xf5c842 }));
    tassel.position.set(0.5, 0.24, 0.5);
    g.add(base); g.add(top); g.add(tassel);
    g.position.set(
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6 - 2
    );
    g.rotation.set(Math.random(), Math.random(), Math.random());
    g.userData.floatSeed = Math.random() * Math.PI * 2;
    g.userData.spinSpeed = 0.2 + Math.random() * 0.4;
    g.scale.setScalar((0.5 + Math.random() * 0.6) * TUNE.capScale);
    caps.add(g);
  }
  scene.add(caps);
  */

  // ---- Lighting (skip on mobile since we used MeshBasicMaterial) ----
  if (!mobile) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pl1 = new THREE.PointLight(0x3b82f6, 2, 30);
    pl1.position.set(-10, 5, 8); scene.add(pl1);
    const pl2 = new THREE.PointLight(0xf5c842, 1.4, 30);
    pl2.position.set(10, -4, 8); scene.add(pl2);
  }

  // ---- Interaction ----
  let mouseX = 0, mouseY = 0;
  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  if (TUNE.mouseFollow) window.addEventListener("pointermove", onMove, { passive: true });

  const onResize = () => {
    const s = getSize();
    w = s.w; h = s.h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);

  // ---- Visibility: pause when offscreen / tab hidden ----
  let running = true;
  const io = new IntersectionObserver(
    (entries) => { running = entries[0].isIntersecting; },
    { threshold: 0 }
  );
  io.observe(el);
  const onVis = () => { if (document.hidden) running = false; else running = true; };
  document.addEventListener("visibilitychange", onVis);

  // ---- Animate (with FPS cap) ----
  const clock = new THREE.Clock();
  const frameInterval = 1 / TUNE.fpsCap;
  let accumulator = 0;
  let raf;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    if (!running) return;

    const dt = clock.getDelta();
    accumulator += dt;
    if (accumulator < frameInterval) return;
    accumulator = 0;

    const t = clock.elapsedTime;
    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    // caps.children.forEach((c) => {
    //   const s = c.userData.floatSeed;
    //   c.position.y += Math.sin(t * 0.6 + s) * 0.003;
    //   c.rotation.y += c.userData.spinSpeed * 0.008;
    //   c.rotation.x += 0.003;
    // });

    if (TUNE.mouseFollow) {
      camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
    } else if (TUNE.autoRotate) {
      camera.position.x = Math.sin(t * 0.12) * 1.2;
      camera.position.y = Math.cos(t * 0.09) * 0.6;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  animate();

  cleanup = () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (TUNE.mouseFollow) window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVis);
    renderer.dispose();
    pGeo.dispose();
    pMat.dispose();
    // if (shared) {
    //   shared.baseGeo.dispose(); shared.topGeo.dispose(); shared.tasselGeo.dispose();
    //   shared.baseMat.dispose(); shared.topMat.dispose(); shared.tasselMat.dispose();
    // }
  };
});

onBeforeUnmount(() => { cleanup?.(); });
</script>

<template>
  <div class="hero-canvas-wrap">
    <canvas ref="canvas" class="hero-canvas" />
    <div class="hero-canvas-fallback" aria-hidden="true" />
  </div>
</template>

<style scoped>
.hero-canvas-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.hero-canvas-fallback {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(96, 165, 250, 0.4), transparent 55%),
    radial-gradient(ellipse at 30% 70%, rgba(245, 200, 66, 0.2), transparent 55%);
  z-index: -1;
}
</style>
