<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you were looking for does not exist or has been moved.</p>
        <router-link to="/" class="btn btn-primary">Return Home</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  padding: 6rem 0;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

p {
  margin-bottom: 2rem;
  color: #666;
}
</style>