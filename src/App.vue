<script setup>
import { ref, computed } from "vue";
import HeroCanvas from "./components/HeroCanvas.vue";
import LogoIUC from "./components/LogoIUC.vue";
import Icon from "./components/Icons.vue";
import LangSwitch from "./components/LangSwitch.vue";
import GraduatesMarquee from "./components/GraduatesMarquee.vue";
import { locale, t, currentIntakeLabel } from "./i18n";

const currentIntake = computed(() => { void locale.value; return currentIntakeLabel(); });

const WA_NUMBER = "60115981 6620".replace(/\s/g, "");
const waLink = (msg) =>
  `https://wa.me/${WA_NUMBER.replace(/^0/, "60")}?text=${encodeURIComponent(msg)}`;

// Quiz state
const step = ref(0); // 0 = intro, 1-3 = questions, 4 = capture, 5 = result
const answers = ref({ spm: null, age: null, status: null });
const lead = ref({ name: "", phone: "" });

const progress = computed(() => Math.min((step.value / 4) * 100, 100));
const qualified = computed(
  () => answers.value.spm === "yes" && answers.value.age === "yes"
);

function pick(key, value) {
  answers.value[key] = value;
  setTimeout(() => {
    step.value = Math.min(step.value + 1, 4);
  }, 180);
}

function startQuiz() {
  step.value = 1;
  document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function submitLead() {
  if (!lead.value.name.trim() || !lead.value.phone.trim()) return;
  const spmLabel = locale.value === "en"
    ? (answers.value.spm === "yes" ? "3 credits+" : "Other")
    : (answers.value.spm === "yes" ? "3 kredit+" : "Lain-lain");
  const ageLabel = answers.value.age === "yes" ? "18+" : "<18";
  const vars = {
    name: lead.value.name,
    phone: lead.value.phone,
    spm: spmLabel,
    age: ageLabel,
    status: answers.value.status || "-",
  };
  const msg = qualified.value ? t("wa.msg.qualified", vars) : t("wa.msg.unqualified", vars);
  window.open(waLink(msg), "_blank");
  step.value = 5;
}

const journey = computed(() => {
  void locale.value;
  return [1,2,3,4,5,6].map((n) => ({ n: String(n), title: t(`jr.${n}.t`), desc: t(`jr.${n}.d`) }));
});

const testimonials = computed(() => {
  void locale.value;
  return [
    { q: t("ts.1.q"), n: "Aina Farhana", r: t("ts.1.r") },
    { q: t("ts.2.q"), n: "Hafiz Rahman", r: t("ts.2.r") },
    { q: t("ts.3.q"), n: "Nurul Izzah", r: t("ts.3.r") },
  ];
});

const openFaqs = ref({ 1: true, 2: false, 3: false, 4: false, 5: false, 6: false });
const faqs = computed(() => {
  void locale.value;
  return [1,2,3,4,5,6].map((i) => ({ i, q: t(`faq.${i}.q`), a: t(`faq.${i}.a`), open: openFaqs.value[i] }));
});
function toggleFaq(i) { openFaqs.value[i] = !openFaqs.value[i]; }
</script>

<template>
  <div class="app">
    <a href="#quiz" class="skip-link">{{ t('skip') }}</a>

    <main>
    <!-- ========== HERO ========== -->
    <section class="hero" :aria-label="t('nav.aria')">
      <HeroCanvas />
      <div class="hero-inner container">
        <nav class="nav">
          <LogoIUC :height="40" />
          <LangSwitch />
        </nav>

        <div class="hero-grid">
          <div class="hero-left">
            <div class="pill">
              <Icon name="clock" :size="14" />
              {{ t('hero.pill') }} {{ currentIntake }}
            </div>

            <h1 class="h1 hero-title">
              {{ t('hero.title.1') }}<br />
              <span class="grad-text">{{ t('hero.title.2') }}</span>
            </h1>

            <p class="lead hero-lead">
              {{ t('hero.lead.pre') }} <strong>{{ t('hero.lead.amount') }}</strong> {{ t('hero.lead.post') }}
            </p>

            <div class="cta-row">
              <button class="btn btn-primary" @click="startQuiz">
                {{ t('cta.primary') }} <Icon name="arrow" :size="18" />
              </button>
              <a :href="waLink(t('wa.msg.hero'))" target="_blank" class="btn btn-ghost">
                <Icon name="whatsapp" :size="18" /> {{ t('cta.wa') }}
              </a>
            </div>

            <div class="trust">
              <span><Icon name="shield" :size="14" /> {{ t('trust.mqa') }}</span>
              <span><Icon name="check" :size="14" /> {{ t('trust.jpt') }}</span>
              <span><Icon name="check" :size="14" /> {{ t('trust.spm') }}</span>
              <span><Icon name="sparkle" :size="14" /> {{ t('trust.online') }}</span>
            </div>
          </div>

          <div class="hero-right">
            <div class="savings-card card">
              <div class="savings-label">{{ t('savings.label') }}</div>
              <div class="savings-row">
                <span class="savings-orig">RM24,000</span>
                <span class="savings-arrow">→</span>
                <span class="savings-now">RM5,000</span>
              </div>
              <div class="savings-note">{{ t('savings.note') }}</div>
              <div class="savings-bar">
                <div class="savings-bar-fill" style="width: 79%"></div>
              </div>
              <div class="savings-bar-labels">
                <span>{{ t('savings.bar.left') }}</span>
                <span>{{ t('savings.bar.right') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== QUIZ ========== -->
    <section id="quiz" class="section quiz-section">
      <div class="container quiz-grid">
        <div class="quiz-left">
          <div class="eyebrow">{{ t('quiz.eyebrow') }}</div>
          <h2 class="h2" style="white-space: pre-line">{{ t('quiz.head') }}</h2>
          <p class="lead">{{ t('quiz.lead') }}</p>
          <ul class="quiz-benefits">
            <li><Icon name="check" :size="16" /> {{ t('quiz.benefit.1') }}</li>
            <li><Icon name="check" :size="16" /> {{ t('quiz.benefit.2') }}</li>
            <li><Icon name="check" :size="16" /> {{ t('quiz.benefit.3') }}</li>
          </ul>
        </div>

        <div class="quiz-card card">
          <div class="progress"><div class="progress-fill" :style="{ width: progress + '%' }"></div></div>

          <!-- Step 0 — intro -->
          <div v-if="step === 0">
            <div class="step-label">{{ t('quiz.intro.label') }}</div>
            <h3 class="h3">{{ t('quiz.intro.h') }}</h3>
            <p class="lead">{{ t('quiz.intro.p') }}</p>
            <button class="btn btn-primary w-full" @click="step = 1">{{ t('quiz.intro.cta') }} <Icon name="arrow" :size="18" /></button>
          </div>

          <!-- Step 1 — SPM -->
          <div v-else-if="step === 1">
            <div class="step-label">{{ t('quiz.q1.label') }}</div>
            <h3 class="h3">{{ t('quiz.q1.h') }}</h3>
            <div class="options">
              <button class="option" :class="{ active: answers.spm === 'yes' }" @click="pick('spm', 'yes')">
                <span class="radio"></span> {{ t('quiz.q1.o1') }}
              </button>
              <button class="option" :class="{ active: answers.spm === 'no' }" @click="pick('spm', 'no')">
                <span class="radio"></span> {{ t('quiz.q1.o2') }}
              </button>
              <button class="option" :class="{ active: answers.spm === 'other' }" @click="pick('spm', 'other')">
                <span class="radio"></span> {{ t('quiz.q1.o3') }}
              </button>
            </div>
          </div>

          <!-- Step 2 — Age -->
          <div v-else-if="step === 2">
            <div class="step-label">{{ t('quiz.q2.label') }}</div>
            <h3 class="h3">{{ t('quiz.q2.h') }}</h3>
            <div class="options">
              <button class="option" :class="{ active: answers.age === 'yes' }" @click="pick('age', 'yes')">
                <span class="radio"></span> {{ t('quiz.q2.o1') }}
              </button>
              <button class="option" :class="{ active: answers.age === 'no' }" @click="pick('age', 'no')">
                <span class="radio"></span> {{ t('quiz.q2.o2') }}
              </button>
            </div>
          </div>

          <!-- Step 3 — Status -->
          <div v-else-if="step === 3">
            <div class="step-label">{{ t('quiz.q3.label') }}</div>
            <h3 class="h3">{{ t('quiz.q3.h') }}</h3>
            <div class="options">
              <button class="option" :class="{ active: answers.status === 'working' }" @click="pick('status', 'working')">
                <span class="radio"></span> {{ t('quiz.q3.o1') }}
              </button>
              <button class="option" :class="{ active: answers.status === 'looking' }" @click="pick('status', 'looking')">
                <span class="radio"></span> {{ t('quiz.q3.o2') }}
              </button>
              <button class="option" :class="{ active: answers.status === 'student' }" @click="pick('status', 'student')">
                <span class="radio"></span> {{ t('quiz.q3.o3') }}
              </button>
            </div>
          </div>

          <!-- Step 4 — Capture -->
          <div v-else-if="step === 4">
            <div class="step-label" :class="{ 'text-gold': qualified }">
              {{ qualified ? t('quiz.capture.label.ok') : t('quiz.capture.label.no') }}
            </div>
            <h3 class="h3">{{ qualified ? t('quiz.capture.h.ok') : t('quiz.capture.h.no') }}</h3>
            <p class="lead">{{ qualified ? t('quiz.capture.p.ok') : t('quiz.capture.p.no') }}</p>

            <div class="field">
              <label>{{ t('quiz.capture.name') }}</label>
              <input v-model="lead.name" type="text" :placeholder="t('quiz.capture.name.ph')" />
            </div>
            <div class="field">
              <label>{{ t('quiz.capture.phone') }}</label>
              <input v-model="lead.phone" type="tel" :placeholder="t('quiz.capture.phone.ph')" />
            </div>

            <button class="btn btn-wa w-full" @click="submitLead" :disabled="!lead.name.trim() || !lead.phone.trim()">
              <Icon name="whatsapp" :size="18" /> {{ t('quiz.capture.cta') }} <Icon name="arrow" :size="18" />
            </button>
            <p class="fine">{{ t('quiz.capture.fine') }}</p>
          </div>

          <!-- Step 5 — Done -->
          <div v-else-if="step === 5">
            <div class="check-big"><Icon name="check" :size="48" /></div>
            <h3 class="h3">{{ t('quiz.done.h') }}, {{ lead.name }}!</h3>
            <p class="lead">{{ t('quiz.done.p.pre') }} <a :href="waLink(t('wa.msg.done'))" target="_blank" class="link">{{ t('quiz.done.p.link') }}</a>.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== SAVINGS BREAKDOWN ========== -->
    <section class="section savings-section">
      <div class="container text-center">
        <div class="eyebrow">{{ t('sav.eyebrow') }}</div>
        <h2 class="h2 mt-3">{{ t('sav.head') }}</h2>
        <p class="lead mt-3 center-narrow">{{ t('sav.lead') }}</p>

        <div class="savings-grid mt-6">
          <div class="breakdown-card">
            <div class="bd-label">{{ t('sav.orig.label') }}</div>
            <div class="bd-value strike dim">RM24,000</div>
            <div class="bd-note">{{ t('sav.orig.note') }}</div>
          </div>
          <div class="breakdown-card accent">
            <div class="bd-label accent-label">{{ t('sav.bursary.label') }}</div>
            <div class="bd-value accent-value">− RM19,000</div>
            <div class="bd-note">{{ t('sav.bursary.note') }}</div>
          </div>
          <div class="breakdown-card gold">
            <div class="bd-label gold-label">{{ t('sav.you.label') }}</div>
            <div class="bd-value gold-value">RM5,000</div>
            <div class="bd-note">{{ t('sav.you.note') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== JOURNEY ========== -->
    <section class="section journey-section">
      <div class="container text-center">
        <div class="eyebrow">{{ t('jr.eyebrow') }}</div>
        <h2 class="h2 mt-3">{{ t('jr.head') }}</h2>
        <p class="lead mt-3 center-narrow">{{ t('jr.lead') }}</p>

        <div class="journey-grid mt-6">
          <div v-for="s in journey" :key="s.n" class="journey-card">
            <div class="journey-num">{{ s.n }}</div>
            <div class="journey-title">{{ s.title }}</div>
            <div class="journey-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== TESTIMONIALS ========== -->
    <section class="section testi-section">
      <div class="container text-center">
        <div class="eyebrow">{{ t('ts.eyebrow') }}</div>
        <h2 class="h2 mt-3">{{ t('ts.head') }}</h2>
      </div>

      <!-- Convocation photo marquee -->
      <div class="gallery-wrap mt-5">
        <GraduatesMarquee />
        <div class="gallery-caption">{{ t('ts.gallery') }}</div>
      </div>

      <div class="container text-center">

        <div class="testi-grid mt-6">
          <div v-for="t in testimonials" :key="t.n" class="testi-card">
            <div class="stars">
              <Icon v-for="i in 5" :key="i" name="star" :size="16" />
            </div>
            <div class="testi-quote">"{{ t.q }}"</div>
            <div class="testi-author">
              <div class="avatar">
                <Icon name="person" :size="28" />
              </div>
              <div>
                <div class="testi-name">{{ t.n }}</div>
                <div class="testi-role">{{ t.r }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== FAQ ========== -->
    <section class="section faq-section">
      <div class="container text-center">
        <div class="eyebrow">{{ t('faq.eyebrow') }}</div>
        <h2 class="h2 mt-3">{{ t('faq.head') }}</h2>

        <div class="faq-list mt-6">
          <div
            v-for="f in faqs"
            :key="f.i"
            class="faq-item"
            :class="{ open: f.open }"
            @click="toggleFaq(f.i)"
          >
            <div class="faq-q">
              <span>{{ f.q }}</span>
              <span class="faq-toggle">
                <Icon :name="f.open ? 'minus' : 'plus'" :size="20" />
              </span>
            </div>
            <div v-if="f.open" class="faq-a">{{ f.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========== FINAL CTA ========== -->
    <section class="section final-cta">
      <div class="container text-center">
        <div class="eyebrow final-eye">{{ t('final.eyebrow') }} {{ currentIntake }} {{ t('final.eyebrow.post') }}</div>
        <h2 class="h2 mt-3">{{ t('final.head') }}</h2>
        <p class="lead mt-3 center-narrow">{{ t('final.lead') }}</p>
        <div class="cta-row center mt-5">
          <button class="btn btn-primary" @click="startQuiz">{{ t('cta.primary') }} <Icon name="arrow" :size="18" /></button>
          <a :href="waLink(t('wa.msg.generic'))" target="_blank" class="btn btn-wa">
            <Icon name="whatsapp" :size="18" /> {{ t('cta.wa') }}
          </a>
        </div>
      </div>
    </section>

    </main>

    <!-- ========== FOOTER ========== -->
    <footer class="footer">
      <div class="container">
        <div class="foot-top">
          <div>
            <LogoIUC :height="40" />
            <p class="foot-desc">{{ t('footer.desc') }}</p>
          </div>
          <div class="foot-right">
            <a href="https://www.innovative.edu.my" target="_blank" rel="noopener">www.innovative.edu.my</a>
          </div>
        </div>
        <div class="foot-bot">
          <span>MQA/PA 15580</span>
          <span>N/0414/4/0006</span>
          <span>KPT/JPS (DK)054(O)</span>
          <span>© 2026 IUC</span>
        </div>
      </div>
    </footer>

    <!-- Sticky WhatsApp -->
    <a
      :href="waLink(t('wa.msg.sticky'))"
      target="_blank"
      class="sticky-wa"
      aria-label="Chat WhatsApp"
    >
      <Icon name="whatsapp" :size="22" />
      <span class="sticky-wa-text">{{ t('sticky.wa') }}</span>
    </a>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  background: #020617;
}
.skip-link {
  position: absolute;
  left: -9999px;
  top: 8px;
  background: var(--gold);
  color: #060f24;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  z-index: 1000;
}
.skip-link:focus { left: 16px; }

/* ========== HERO ========== */
.hero {
  position: relative;
  min-height: 820px;
  padding: 32px 0 80px;
  overflow: hidden;
  background: linear-gradient(180deg, #0a1e3f 0%, #12316c 100%);
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(10, 30, 63, 0.85) 0%, rgba(10, 30, 63, 0.55) 45%, rgba(10, 30, 63, 0.25) 70%, rgba(10, 30, 63, 0.65) 100%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.4) 0%, transparent 25%, transparent 75%, rgba(2, 6, 23, 0.85) 100%);
}
.hero::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -1px;
  height: 120px;
  background: linear-gradient(180deg, transparent, #020617);
  z-index: 1;
  pointer-events: none;
}
.hero-inner { position: relative; z-index: 2; }
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 40px;
  gap: 16px;
}
.brand { display: inline-flex; gap: 12px; align-items: center; }
.brand-badge {
  width: 44px; height: 44px; border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: grid; place-items: center;
  font-weight: 800; font-size: 14px; color: white;
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.4);
}
.nav-wa {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600;
  color: var(--white);
  padding: 10px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.15s;
}
.nav-wa:hover { border-color: var(--green); color: var(--green); }

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 64px;
  align-items: center;
  padding: 0 24px;
  max-width: var(--max-w);
  margin: 0 auto;
}

.hero-left { display: flex; flex-direction: column; gap: 28px; }
.hero-title { color: var(--white); }
.grad-text {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-hot) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-lead { max-width: 560px; }
.hero-lead strong { color: var(--gold); font-weight: 700; }

.cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
.cta-row.center { justify-content: center; }

.wa-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--green); }
.wa-dot-white { background: white; }

.trust {
  display: flex; gap: 20px; flex-wrap: wrap;
  font-size: 13px; color: rgba(207, 224, 255, 0.75);
}
.trust span { display: inline-flex; align-items: center; gap: 6px; }
.trust svg { color: var(--gold); }

.hero-right { display: flex; justify-content: flex-end; }
.savings-card {
  padding: 32px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.savings-label { font-size: 12px; letter-spacing: 0.12em; color: var(--muted-dim); font-weight: 600; }
.savings-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.savings-orig {
  font-size: 28px; font-weight: 600;
  color: rgba(207, 224, 255, 0.55);
  text-decoration: line-through;
}
.savings-arrow { color: var(--gold); font-size: 24px; font-weight: 800; }
.savings-now {
  font-size: 48px; font-weight: 800;
  background: linear-gradient(135deg, var(--gold), var(--gold-hot));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.savings-note { font-size: 14px; color: rgba(255, 255, 255, 0.85); }
.savings-bar {
  height: 8px; border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden; margin-top: 8px;
}
.savings-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--blue-bright), var(--gold));
  border-radius: 4px;
}
.savings-bar-labels {
  display: flex; justify-content: space-between;
  font-size: 11px; color: var(--muted-dim);
}

/* ========== QUIZ ========== */
.quiz-section {
  position: relative;
  background:
    radial-gradient(ellipse 50% 60% at 80% 50%, rgba(37, 99, 235, 0.35), transparent 70%),
    #020617;
}
.quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
.quiz-left { display: flex; flex-direction: column; gap: 20px; }
.quiz-benefits { list-style: none; display: flex; flex-direction: column; gap: 10px; color: var(--muted); font-size: 14px; font-weight: 500; }
.quiz-benefits li { display: inline-flex; align-items: center; gap: 10px; }
.quiz-benefits svg { color: var(--green); }

.quiz-card { padding: 40px; display: flex; flex-direction: column; gap: 20px; }
.progress {
  height: 6px; border-radius: 4px;
  background: rgba(255, 255, 255, 0.1); overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-hot));
  transition: width 0.3s ease;
}
.step-label { font-size: 13px; color: var(--muted-dim); font-weight: 500; }
.text-gold { color: var(--gold); font-weight: 600; }

.options { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.option {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px; border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: left; color: rgba(255, 255, 255, 0.9);
  font-size: 15px; font-weight: 500;
  transition: all 0.15s ease;
}
.option:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.3); }
.option.active {
  background: rgba(245, 200, 66, 0.12);
  border-color: var(--gold);
  color: var(--white);
}
.radio {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}
.option.active .radio { background: var(--gold); border-color: var(--gold); }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; color: var(--muted); font-weight: 500; }
.field input {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  color: var(--white);
  font-size: 15px;
  outline: none;
  transition: border 0.15s;
  font-family: inherit;
}
.field input::placeholder { color: rgba(255, 255, 255, 0.35); }
.field input:focus { border-color: var(--gold); }

.w-full { width: 100%; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.fine { font-size: 11px; color: var(--muted-dim); text-align: center; }

.check-big {
  color: var(--green);
  background: rgba(37, 211, 102, 0.15);
  border: 2px solid rgba(37, 211, 102, 0.35);
  border-radius: 50%;
  width: 96px; height: 96px;
  display: grid; place-items: center;
  margin: 0 auto;
}
.link { color: var(--gold); text-decoration: underline; }

/* ========== SAVINGS ========== */
.savings-section {
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(245, 200, 66, 0.08), transparent 60%),
    linear-gradient(180deg, #020617 0%, #060f24 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.savings-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
.breakdown-card {
  padding: 32px;
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  text-align: left;
  display: flex; flex-direction: column; gap: 12px;
}
.breakdown-card.gold { border-color: var(--gold); background: rgba(245, 200, 66, 0.08); box-shadow: 0 20px 50px rgba(245, 200, 66, 0.15); }
.bd-label { font-size: 12px; letter-spacing: 0.1em; font-weight: 600; color: var(--muted); }
.accent-label { color: var(--blue-light); }
.gold-label { color: var(--gold); }
.bd-value { font-size: 48px; font-weight: 800; line-height: 1; }
.bd-value.strike { text-decoration: line-through; }
.bd-value.dim { color: rgba(207, 224, 255, 0.45); }
.accent-value { color: var(--blue-light); }
.gold-value {
  font-size: 56px;
  background: linear-gradient(135deg, var(--gold), var(--gold-hot));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.bd-note { font-size: 13px; color: rgba(255, 255, 255, 0.7); line-height: 1.5; }

/* ========== JOURNEY ========== */
.journey-section {
  background: #020617;
}
.journey-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  text-align: left;
}
.journey-card {
  padding: 28px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; flex-direction: column; gap: 14px;
  transition: all 0.2s ease;
}
.journey-card:hover { transform: translateY(-4px); border-color: rgba(245, 200, 66, 0.3); }
.journey-num {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-bright), var(--blue));
  display: grid; place-items: center;
  font-weight: 800; font-size: 20px;
  box-shadow: 0 8px 24px rgba(96, 165, 250, 0.35);
}
.journey-title { font-size: 20px; font-weight: 700; }
.journey-desc { font-size: 14px; color: var(--muted); line-height: 1.5; }

/* ========== TESTIMONIALS ========== */
.testi-section {
  background:
    radial-gradient(ellipse 60% 50% at 20% 50%, rgba(96, 165, 250, 0.12), transparent 60%),
    linear-gradient(180deg, #020617 0%, #060f24 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.gallery-wrap {
  margin-top: 48px;
  margin-bottom: 64px;
}
.gallery-caption {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-dim);
}
.testi-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
  text-align: left;
}
.testi-card {
  padding: 32px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex; flex-direction: column; gap: 20px;
}
.stars { color: var(--gold); display: inline-flex; gap: 2px; }
.testi-quote { font-size: 16px; line-height: 1.6; font-weight: 500; }
.testi-author { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-light), var(--gold));
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.92);
  overflow: hidden;
}
.avatar svg { margin-top: 6px; }
.testi-name { font-size: 14px; font-weight: 600; }
.testi-role { font-size: 12px; color: var(--muted); }

/* ========== FAQ ========== */
.faq-section {
  background: #020617;
}
.faq-list { max-width: 880px; margin-left: auto; margin-right: auto; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.faq-item {
  padding: 20px 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}
.faq-item:hover { border-color: rgba(255, 255, 255, 0.2); }
.faq-item.open { border-color: rgba(245, 200, 66, 0.3); background: rgba(255, 255, 255, 0.06); }
.faq-q { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 16px; }
.faq-toggle { font-size: 22px; font-weight: 700; color: var(--gold); }
.faq-a { margin-top: 12px; font-size: 14px; line-height: 1.6; color: var(--muted); }

/* ========== FINAL CTA ========== */
.final-cta {
  background:
    radial-gradient(ellipse at 30% 50%, rgba(96, 165, 250, 0.3), transparent 60%),
    linear-gradient(135deg, #12316c 0%, #1e3a8a 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.final-eye { color: var(--gold); }

/* ========== FOOTER ========== */
.footer {
  background: #06011c;
  padding: 48px 0 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.foot-top {
  display: flex; justify-content: space-between; gap: 32px; flex-wrap: wrap;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.foot-top .brand { margin-bottom: 12px; }
.foot-desc { font-size: 13px; color: var(--muted); max-width: 460px; line-height: 1.6; }
.foot-right { text-align: right; font-size: 14px; color: var(--muted); display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
.foot-right a { color: var(--muted); }
.foot-right a:hover { color: var(--gold); }
.foot-bot {
  display: flex; gap: 24px; flex-wrap: wrap;
  padding-top: 20px;
  font-size: 12px; color: rgba(255, 255, 255, 0.5);
}

/* ========== STICKY WA ========== */
.sticky-wa {
  position: fixed;
  bottom: 24px; right: 24px;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 20px;
  border-radius: 100px;
  background: var(--green);
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 12px 32px rgba(37, 211, 102, 0.5);
  z-index: 100;
  transition: transform 0.2s;
}
.sticky-wa:hover { transform: translateY(-2px); }
.sticky-wa svg { flex-shrink: 0; }

/* ========== UTILITIES ========== */
.text-center { text-align: center; }
.mt-3 { margin-top: 12px; }
.mt-5 { margin-top: 32px; }
.mt-6 { margin-top: 48px; }
.center-narrow { max-width: 640px; margin-left: auto; margin-right: auto; }

/* ========== RESPONSIVE ========== */
@media (max-width: 960px) {
  .hero { min-height: auto; padding-bottom: 48px; }
  .hero-grid { grid-template-columns: 1fr; gap: 40px; padding: 0; }
  .hero-left { gap: 20px; }
  .hero-right { justify-content: stretch; }
  .savings-card { max-width: 100%; }

  .quiz-grid { grid-template-columns: 1fr; gap: 32px; }
  .quiz-card { padding: 28px; }

  .savings-grid, .journey-grid, .testi-grid { grid-template-columns: 1fr; }

  .foot-top { flex-direction: column; }
  .foot-right { text-align: left; }

  .sticky-wa .sticky-wa-text { display: none; }
  .sticky-wa { padding: 14px; border-radius: 50%; width: 56px; height: 56px; justify-content: center; }
}

@media (max-width: 480px) {
  .nav { padding: 0 4px 24px; }
  .trust { gap: 12px; font-size: 12px; }
  .cta-row { flex-direction: column; align-items: stretch; }
  .btn { width: 100%; }
  .bd-value { font-size: 36px; }
  .gold-value { font-size: 44px; }
}
</style>
