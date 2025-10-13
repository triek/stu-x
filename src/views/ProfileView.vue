<script setup>
const recentActions = [
  {
    id: 1,
    delta: '+20 Stunix',
    description: 'Completed survey — Inclusive onboarding research',
  },
  {
    id: 2,
    delta: '+35 Stunix',
    description: 'Hosted mentor session — Portfolio storytelling clinic',
  },
  {
    id: 3,
    delta: '–50 Stunix',
    description: 'Posted feedback request — Systems design prototype',
  },
]
</script>

<template>
  <section class="profile">
    <div class="identity-card">
      <div class="avatar">JR</div>
      <div class="identity-text">
        <h1>Jordan Rivers</h1>
        <p>Explorer of peer wisdom, blending design research with community care.</p>
      </div>
      <div class="credit-total">
        <span class="label">Total credits</span>
        <span class="value">100 🪙</span>
      </div>
    </div>

    <div class="activity-card">
      <h2>Recent actions</h2>
      <ul>
        <li v-for="item in recentActions" :key="item.id">
          <span class="delta">{{ item.delta }}</span>
          <p>{{ item.description }}</p>
        </li>
      </ul>
    </div>

    <button type="button" class="earn-btn">Earn More Credits</button>
  </section>
</template>

<style scoped>
.profile {
  max-width: 860px;
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
}

.identity-card {
  background: white;
  border-radius: 30px;
  padding: 2.5rem;
  box-shadow: 0 26px 50px rgba(67, 56, 202, 0.16);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(67, 56, 202, 0.8), rgba(99, 102, 241, 0.65));
  display: grid;
  place-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.08em;
}

.identity-text h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.6rem);
  color: #111827;
}

.identity-text p {
  margin: 0.75rem 0 0;
  color: #4b5563;
  font-size: 1.05rem;
  line-height: 1.5;
}

.credit-total {
  display: grid;
  gap: 0.4rem;
  text-align: right;
}

.credit-total .label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
}

.credit-total .value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #4338ca;
}

.activity-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 26px;
  padding: 2.25rem;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 1.5rem;
}

.activity-card h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.activity-card ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.activity-card li {
  background: rgba(67, 56, 202, 0.06);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  display: grid;
  gap: 0.35rem;
}

.delta {
  font-weight: 700;
  color: #4338ca;
}

.activity-card p {
  margin: 0;
  color: #4b5563;
}

.earn-btn {
  justify-self: end;
  border: none;
  background: #4338ca;
  color: white;
  font-weight: 600;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 18px 38px rgba(67, 56, 202, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.earn-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 46px rgba(67, 56, 202, 0.3);
}

@media (max-width: 760px) {
  .identity-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .credit-total {
    text-align: center;
  }

  .earn-btn {
    justify-self: center;
  }
}
</style> 
