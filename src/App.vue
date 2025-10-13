<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="top-bar">
      <!-- Logo -->
      <RouterLink to="/" class="brand">
        <span class="brand-icon">StuX</span>
        <span class="brand-subtitle">The Human Insight Network</span>
      </RouterLink>

      <!-- Nav items -->
      <nav class="main-nav">
        <RouterLink to="/insight">Insight</RouterLink>
        <RouterLink to="/exchange">Exchange</RouterLink>
        <RouterLink to="/community">Community</RouterLink>
        <RouterLink to="/profile" class="profile-link">Profile</RouterLink>
      </nav>

      <div class="right-actions">
        <div class="stunix-badge">Stunix: 100 🪙</div>
        <button class="auth-btn" type="button">Sign Up / Log In</button>
      </div>
    </header>

    <main class="page-content">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="footer-branding">
        <span class="footer-logo">StuX</span>
        <span class="footer-tagline">Built on Insight · Exchange · Community</span>
      </div>
      <p>
          <strong>StuX</strong> &copy; 2025 - The Human Insight Network.
      </p>
    </footer>
  </div>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f5f6ff;
  color: #1f2937;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.15);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4338ca;
}

.brand-subtitle {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.main-nav {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.main-nav a {
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  padding-bottom: 0.1rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #4338ca;
  border-color: rgba(67, 56, 202, 0.4);
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stunix-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.25));
  color: #3730a3;
  font-weight: 600;
  font-size: 0.95rem;
}

.auth-btn {
  border: none;
  background: #4338ca;
  color: white;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(67, 56, 202, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(67, 56, 202, 0.25);
}

.page-content {
  flex: 1;
  padding: 2.5rem 2rem 3.5rem;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  color: #4b5563;
}

.footer-branding {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.footer-logo {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4338ca;
}

@media (max-width: 880px) {
  .top-bar {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .right-actions {
    margin-left: auto;
  }

  .page-content {
    padding: 2rem 1.25rem 3rem;
  }
}
</style>
