<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <router-link to="/" class="home-button">Go to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

.not-found h1 {
  font-size: 6rem;
}

.not-found p {
  font-size: 1.5rem;
}

.home-button {
  margin-top: 2rem;
  padding: 10px 20px;
  text-decoration: none;
  background-color: #7c5cff;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #4f29e5;
}

@media (max-width: 600px) {
  .not-found h1 {
    font-size: 4rem;
    /* Smaller font size for the heading on smaller screens */
  }

  .not-found p {
    font-size: 1rem;
    /* Adjust the paragraph font size for readability */
  }

  .home-button {
    padding: 12px 24px;
    /* Larger padding for easier interaction */
    font-size: 1rem;
    /* Adjust the font size if necessary */
  }
}
</style>
