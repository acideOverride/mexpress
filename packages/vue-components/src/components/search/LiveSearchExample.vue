<template>
  <div class="mx-live-search-example">
    <h2 class="mx-live-search-example__title">
      MegaSearch Live Search Component
    </h2>
    
    <div class="mx-live-search-example__description">
      <p>
        This example demonstrates the MegaSearch live search component with interactive controls.
        It provides realtime search across multiple entity types with typeahead suggestions.
      </p>
    </div>
    
    <div class="mx-live-search-example__controls">
      <div class="mx-live-search-example__option">
        <label>Entity Types:</label>
        <div class="mx-live-search-example__checkboxes">
          <label v-for="type in availableTypes" :key="type">
            <input 
              type="checkbox" 
              :value="type" 
              v-model="selectedTypes"
            />
            {{ formatEntityType(type) }}
          </label>
        </div>
      </div>
      
      <div class="mx-live-search-example__option">
        <label>Min. Characters:</label>
        <select v-model="minChars">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      
      <div class="mx-live-search-example__option">
        <label>Results Limit:</label>
        <select v-model="limit">
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      
      <div class="mx-live-search-example__option">
        <label>
          <input type="checkbox" v-model="autofocus" />
          Autofocus
        </label>
      </div>
    </div>
    
    <div class="mx-live-search-example__component">
      <LiveSearch
        :placeholder="'Search customers, products, and users...'"
        :entity-types="selectedTypes"
        :min-chars="parseInt(minChars)"
        :limit="parseInt(limit)"
        :autofocus="autofocus"
        :result-components="{
          customer: CustomerResult,
          product: ProductResult,
          user: UserResult
        }"
        @select="handleSelect"
        @search="handleSearch"
        @create="handleCreate"
      />
    </div>
    
    <div class="mx-live-search-example__events">
      <h3>Events</h3>
      <div v-if="lastEvent" class="mx-live-search-example__event">
        <div class="mx-live-search-example__event-type">
          {{ lastEvent.type }}
        </div>
        <pre class="mx-live-search-example__event-data">{{ formatEventData(lastEvent.data) }}</pre>
      </div>
      <div v-else class="mx-live-search-example__no-events">
        No events yet. Try searching and selecting results.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LiveSearch from './LiveSearch.vue';
import CustomerResult from './results/CustomerResult.vue';
import ProductResult from './results/ProductResult.vue';
import UserResult from './results/UserResult.vue';

export default defineComponent({
  name: 'LiveSearchExample',
  components: {
    LiveSearch,
    CustomerResult,
    ProductResult,
    UserResult
  },
  setup() {
    // Available entity types
    const availableTypes = ['customer', 'product', 'user'];
    
    // Controls
    const selectedTypes = ref(['customer', 'product', 'user']);
    const minChars = ref('2');
    const limit = ref('5');
    const autofocus = ref(false);
    
    // Event tracking
    const lastEvent = ref<{ type: string; data: any } | null>(null);
    
    // Format entity type for display
    const formatEntityType = (type: string): string => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };
    
    // Event handlers
    const handleSelect = (result: any) => {
      lastEvent.value = {
        type: 'select',
        data: result
      };
    };
    
    const handleSearch = (data: any) => {
      lastEvent.value = {
        type: 'search',
        data
      };
    };
    
    const handleCreate = (suggestion: any) => {
      lastEvent.value = {
        type: 'create',
        data: suggestion
      };
    };
    
    // Format event data for display
    const formatEventData = (data: any): string => {
      return JSON.stringify(data, null, 2);
    };
    
    return {
      availableTypes,
      selectedTypes,
      minChars,
      limit,
      autofocus,
      lastEvent,
      formatEntityType,
      handleSelect,
      handleSearch,
      handleCreate,
      formatEventData
    };
  }
});
</script>

<style>
.mx-live-search-example {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.mx-live-search-example__title {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.mx-live-search-example__description {
  color: #666;
  margin-bottom: 24px;
}

.mx-live-search-example__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.mx-live-search-example__option {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mx-live-search-example__option label {
  font-weight: 500;
  color: #333;
}

.mx-live-search-example__checkboxes {
  display: flex;
  gap: 12px;
}

.mx-live-search-example__component {
  margin-bottom: 40px;
}

.mx-live-search-example__events {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.mx-live-search-example__events h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}

.mx-live-search-example__event {
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mx-live-search-example__event-type {
  font-weight: 600;
  margin-bottom: 8px;
  color: #4a90e2;
}

.mx-live-search-example__event-data {
  margin: 0;
  white-space: pre-wrap;
  font-size: 14px;
  overflow-x: auto;
  background-color: #f9f9f9;
  padding: 8px;
  border-radius: 4px;
}

.mx-live-search-example__no-events {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

select,
input[type="checkbox"] {
  cursor: pointer;
}

select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>