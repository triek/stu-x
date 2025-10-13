<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="home">
    <!-- Banner -->
    <div class="hero">
      <p class="eyebrow">Built on Insight · Exchange · Community</p>
      <h1>Experience-powered learning, unlocked by the StuX network.</h1>
      <p class="subtitle">Earn Stunix by helping others, spend them to get help.</p>
      <div class="hero-actions">
        <RouterLink to="/insight" class="cta-primary">Explore Opportunities</RouterLink>
        <RouterLink to="/profile" class="cta-secondary">Check Your Wallet</RouterLink>
      </div>
    </div>

    <!-- 3 pillars -->
    <div class="pillars-grid">
      <RouterLink to="/insight" class="pillar-card insight">
        <span class="icon">💡</span>
        <h2>Insight</h2>
        <p>Share or join surveys &amp; feedback.</p>
        <span class="reward">Fresh prompts daily · +20 Stunix avg</span>
      </RouterLink>
      <RouterLink to="/exchange" class="pillar-card exchange">
        <span class="icon">🤝</span>
        <h2>Exchange</h2>
        <p>Find mentors or trade study help.</p>
        <span class="reward">Swap skills · +35 Stunix avg</span>
      </RouterLink>
      <RouterLink to="/community" class="pillar-card community">
        <span class="icon">💬</span>
        <h2>Community</h2>
        <p>Discuss, review, and reflect.</p>
        <span class="reward">Thoughtful threads · +15 Stunix avg</span>
      </RouterLink>
    </div>

    <!-- How it works -->
    <div class="how-it-works">
      <div class="step">
        <h3>1. Offer your insight</h3>
        <p>Answer a survey, review a draft, or host a mini-mentoring session.</p>
      </div>
      <div class="step">
        <h3>2. Earn Stunix stunix</h3>
        <p>Each contribution rewards verified stunix you can trust across the network.</p>
      </div>
      <div class="step">
        <h3>3. Redeem trusted help</h3>
        <p>Spend stunix on feedback, study buddies, or community reflections when you need them.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.hero {
  background: white;
  padding: 3.5rem;
  border-radius: 28px;
  box-shadow: 0 25px 55px rgba(79, 70, 229, 0.12);
  display: grid;
  gap: 1.5rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-weight: 600;
  color: #4338ca;
  font-size: 0.85rem;
}

.hero h1 {
  font-size: clamp(2.4rem, 5vw, 3.25rem);
  line-height: 1.1;
  font-weight: 700;
  color: #111827;
  max-width: 18ch;
}

.subtitle {
  font-size: 1.2rem;
  color: #4b5563;
  max-width: 38ch;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-primary,
.cta-secondary {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.85rem 1.8rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.cta-primary {
  background: #4338ca;
  color: white;
  box-shadow: 0 15px 35px rgba(67, 56, 202, 0.25);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(67, 56, 202, 0.3);
}

.cta-secondary {
  background: rgba(67, 56, 202, 0.08);
  color: #4338ca;
}

.cta-secondary:hover {
  transform: translateY(-2px);
  background: rgba(67, 56, 202, 0.12);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.pillar-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.1);
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pillar-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.14);
}

.icon {
  font-size: 2.4rem;
}

.pillar-card h2 {
  font-size: 1.6rem;
  margin: 0;
  color: #111827;
}

.pillar-card p {
  margin: 0;
  color: #4b5563;
  font-size: 1.05rem;
}

.reward {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4338ca;
}

.pillar-card.exchange .reward {
  color: #0f766e;
}

.pillar-card.community .reward {
  color: #db2777;
}

.how-it-works {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.step {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 18px 45px rgba(79, 70, 229, 0.1);
  display: grid;
  gap: 0.5rem;
}

.step h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1f2937;
}

.step p {
  margin: 0;
  color: #4b5563;
}

@media (max-width: 960px) {
  .pillars-grid,
  .how-it-works {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .hero {
    padding: 2.5rem;
  }

  .pillars-grid,
  .how-it-works {
    grid-template-columns: 1fr;
  }
}
</style>
