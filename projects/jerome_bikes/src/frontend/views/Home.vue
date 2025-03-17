<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Explore the City on Two Wheels</h1>
          <p>Rent a bike and discover the joy of cycling with Jerome Bikes. Easy booking, convenient pickup, and affordable rates.</p>
          <div class="hero-buttons">
            <router-link to="/bikes" class="btn btn-primary">Browse Bikes</router-link>
            <router-link to="/about" class="btn btn-outline">Learn More</router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Bikes Section -->
    <section class="featured-bikes">
      <div class="container">
        <div class="section-header">
          <h2>Featured Bikes</h2>
          <p>Check out our most popular bikes for your next adventure</p>
        </div>
        
        <div v-if="loading" class="loading-indicator">Loading featured bikes...</div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else class="bike-grid">
          <div v-for="bike in featuredBikes" :key="bike.id" class="bike-card">
            <img :src="bike.imageUrl" :alt="bike.model" />
            <div class="bike-card-content">
              <h3 class="bike-card-title">{{ bike.model }}</h3>
              <p class="bike-card-type">{{ bike.type }} | {{ bike.size }}</p>
              <div class="bike-card-price">
                ${{ bike.pricePerHour }}/hour | ${{ bike.pricePerDay }}/day
              </div>
              <router-link :to="`/bikes/${bike.id}`" class="btn btn-primary">
                View Details
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="view-all">
          <router-link to="/bikes" class="btn btn-outline">View All Bikes</router-link>
        </div>
      </div>
    </section>
    
    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <h2>How It Works</h2>
          <p>Renting a bike with Jerome Bikes is quick and easy</p>
        </div>
        
        <div class="steps-container">
          <div class="step">
            <div class="step-icon">1</div>
            <h3>Choose Your Bike</h3>
            <p>Browse our selection of bikes and choose the perfect ride for your adventure.</p>
          </div>
          
          <div class="step">
            <div class="step-icon">2</div>
            <h3>Make a Reservation</h3>
            <p>Select your pickup and drop-off locations and schedule your rental period.</p>
          </div>
          
          <div class="step">
            <div class="step-icon">3</div>
            <h3>Enjoy Your Ride</h3>
            <p>Pick up your bike at the station and explore the city at your own pace.</p>
          </div>
          
          <div class="step">
            <div class="step-icon">4</div>
            <h3>Return the Bike</h3>
            <p>Return your bike to any of our stations when your rental period is over.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2>What Our Customers Say</h2>
          <p>Join thousands of satisfied cyclists who have explored with Jerome Bikes</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial">
            <div class="testimonial-content">
              <p>"Jerome Bikes made my city tour amazing! The bikes were in perfect condition and the booking process was super easy."</p>
            </div>
            <div class="testimonial-author">
              <p><strong>Sarah Johnson</strong></p>
              <p>Casual Explorer</p>
            </div>
          </div>
          
          <div class="testimonial">
            <div class="testimonial-content">
              <p>"As a cycling enthusiast, I appreciate the quality of bikes Jerome offers. Their mountain bikes handled the trails perfectly!"</p>
            </div>
            <div class="testimonial-author">
              <p><strong>Michael Chen</strong></p>
              <p>Mountain Biker</p>
            </div>
          </div>
          
          <div class="testimonial">
            <div class="testimonial-content">
              <p>"Renting e-bikes for our family vacation was the best decision. The kids loved it and we could cover so much more ground!"</p>
            </div>
            <div class="testimonial-author">
              <p><strong>The Rodriguez Family</strong></p>
              <p>Family Adventurers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your Adventure?</h2>
          <p>Join Jerome Bikes today and discover a new way to explore.</p>
          <router-link to="/register" class="btn btn-primary btn-large">
            Create an Account
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BikeService from '@/frontend/services/bike.service';
import { Bike } from '@/frontend/types/models';

// State
const featuredBikes = ref<Bike[]>([]);
const loading = ref(true);
const error = ref('');

// Fetch featured bikes
const fetchFeaturedBikes = async () => {
  try {
    loading.value = true;
    error.value = '';
    featuredBikes.value = await BikeService.getFeaturedBikes(4);
  } catch (err: any) {
    console.error('Error fetching featured bikes:', err);
    error.value = 'Failed to load featured bikes. Please try again later.';
    
    // In development/demo mode, use placeholder bikes
    if (process.env.NODE_ENV === 'development') {
      featuredBikes.value = [
        {
          id: '1',
          model: 'City Cruiser',
          type: 'City',
          description: 'Comfortable city bike for casual rides.',
          imageUrl: 'https://placehold.co/600x400/4169E1/FFFFFF?text=City+Cruiser',
          pricePerHour: 8,
          pricePerDay: 30,
          status: 'available',
          stationId: '1',
          features: ['Basket', 'Lights', 'Fenders'],
          size: 'Medium',
          rating: 4.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          model: 'Mountain Explorer',
          type: 'Mountain',
          description: 'Rugged mountain bike for off-road adventures.',
          imageUrl: 'https://placehold.co/600x400/228B22/FFFFFF?text=Mountain+Explorer',
          pricePerHour: 12,
          pricePerDay: 45,
          status: 'available',
          stationId: '2',
          features: ['Suspension', 'Disc Brakes', 'Wide Tires'],
          size: 'Large',
          rating: 4.7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          model: 'Road Racer',
          type: 'Road',
          description: 'Lightweight road bike for speed and efficiency.',
          imageUrl: 'https://placehold.co/600x400/FFA500/FFFFFF?text=Road+Racer',
          pricePerHour: 10,
          pricePerDay: 40,
          status: 'available',
          stationId: '1',
          features: ['Drop Handlebars', 'Carbon Frame', 'Thin Tires'],
          size: 'Medium',
          rating: 4.3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          model: 'Electric Glide',
          type: 'Electric',
          description: 'Powerful e-bike for effortless riding.',
          imageUrl: 'https://placehold.co/600x400/9370DB/FFFFFF?text=Electric+Glide',
          pricePerHour: 15,
          pricePerDay: 60,
          status: 'available',
          stationId: '3',
          features: ['Electric Motor', 'LCD Display', 'Pedal Assist'],
          size: 'Medium',
          rating: 4.9,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  } finally {
    loading.value = false;
  }
};

// Fetch bikes on component mount
onMounted(() => {
  fetchFeaturedBikes();
});
</script>

<style scoped>
/* Hero Section */
.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://placehold.co/1200x600/4169E1/FFFFFF?text=Jerome+Bikes');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 0;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 600px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero .btn-outline {
  border-color: white;
  color: white;
}

.hero .btn-outline:hover {
  background-color: white;
  color: var(--primary-color);
}

/* Section Styling */
section {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.section-header p {
  font-size: 1.25rem;
  color: #666;
}

/* Featured Bikes */
.featured-bikes {
  background-color: white;
}

.bike-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.bike-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease;
}

.bike-card:hover {
  transform: translateY(-5px);
}

.bike-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.bike-card-content {
  padding: 1.5rem;
}

.bike-card-title {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.bike-card-type {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.bike-card-price {
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.bike-card .btn {
  width: 100%;
}

.view-all {
  text-align: center;
  margin-top: 2rem;
}

/* How It Works */
.how-it-works {
  background-color: var(--background-color);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
}

.step h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

/* Testimonials */
.testimonials {
  background-color: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  padding: 2rem;
  height: 100%;
}

.testimonial-content {
  font-style: italic;
  margin-bottom: 1.5rem;
}

.testimonial-content p {
  font-size: 1.1rem;
}

.testimonial-author {
  font-size: 0.9rem;
}

/* CTA Section */
.cta {
  background-color: var(--primary-color);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
}

/* Loading and error states */
.loading-indicator {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  section {
    padding: 3rem 0;
  }
  
  .bike-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>