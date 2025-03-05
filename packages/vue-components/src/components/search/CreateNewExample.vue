<template>
  <div class="mx-create-new-example">
    <h2 class="mx-create-new-example__title">
      MegaSearch "Create New" Functionality
    </h2>
    
    <div class="mx-create-new-example__description">
      <p>
        This example demonstrates the "Create New" functionality that appears when a search returns
        no results. It allows users to quickly create new entities without leaving their workflow.
      </p>
    </div>
    
    <div class="mx-create-new-example__demo">
      <div class="mx-create-new-example__search">
        <h3>1. Search for something that doesn't exist</h3>
        <LiveSearch
          placeholder="Try searching for a non-existent entry..."
          :min-chars="2"
          :entity-types="['customer', 'product', 'user']"
          @create="handleCreate"
        />
      </div>
      
      <div class="mx-create-new-example__direct">
        <h3>2. Or open create forms directly</h3>
        <div class="mx-create-new-example__buttons">
          <button
            class="mx-create-new-example__btn"
            @click="openCreateCustomer"
          >
            Create Customer
          </button>
          <button
            class="mx-create-new-example__btn"
            @click="openCreateProduct"
          >
            Create Product
          </button>
          <button
            class="mx-create-new-example__btn"
            @click="openCreateUser"
          >
            Create User
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="lastCreated" class="mx-create-new-example__result">
      <h3>Last Created Entity</h3>
      <div class="mx-create-new-example__entity-type">
        {{ formatEntityType(lastCreated.type) }}
      </div>
      <pre class="mx-create-new-example__entity-data">{{ formatData(lastCreated.data) }}</pre>
    </div>
    
    <!-- Create New Modal -->
    <CreateNewModal
      v-model="isModalOpen"
      :suggestion="createSuggestion"
      @create="handleDirectCreate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LiveSearch from './LiveSearch.vue';
import CreateNewModal from './CreateNewModal.vue';
import { CreateNewSuggestion } from '../../composables/useMegaSearch';

export default defineComponent({
  name: 'CreateNewExample',
  components: {
    LiveSearch,
    CreateNewModal
  },
  setup() {
    // Modal state
    const isModalOpen = ref(false);
    const createSuggestion = ref<CreateNewSuggestion | null>(null);
    
    // Track last created entity
    const lastCreated = ref<{
      type: string;
      data: any;
    } | null>(null);
    
    // Handle create event from LiveSearch
    const handleCreate = (data: any) => {
      lastCreated.value = {
        type: data.type,
        data: data.data
      };
    };
    
    // Handle create event from direct modal
    const handleDirectCreate = (data: any) => {
      lastCreated.value = {
        type: createSuggestion.value?.type || 'unknown',
        data
      };
    };
    
    // Open create modals directly
    const openCreateCustomer = () => {
      createSuggestion.value = {
        type: 'customer',
        prefilledData: {
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: ''
          }
        }
      };
      isModalOpen.value = true;
    };
    
    const openCreateProduct = () => {
      createSuggestion.value = {
        type: 'product',
        prefilledData: {
          name: '',
          sku: '',
          price: '',
          category: 'electronics',
          description: '',
          tags: [],
          stockLevel: 0,
          status: 'active'
        }
      };
      isModalOpen.value = true;
    };
    
    const openCreateUser = () => {
      createSuggestion.value = {
        type: 'user',
        prefilledData: {
          firstName: '',
          lastName: '',
          email: '',
          role: 'user'
        }
      };
      isModalOpen.value = true;
    };
    
    // Format entity type for display
    const formatEntityType = (type: string): string => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };
    
    // Format data for display
    const formatData = (data: any): string => {
      return JSON.stringify(data, null, 2);
    };
    
    return {
      isModalOpen,
      createSuggestion,
      lastCreated,
      handleCreate,
      handleDirectCreate,
      openCreateCustomer,
      openCreateProduct,
      openCreateUser,
      formatEntityType,
      formatData
    };
  }
});
</script>

<style>
.mx-create-new-example {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.mx-create-new-example__title {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.mx-create-new-example__description {
  color: #666;
  margin-bottom: 24px;
  text-align: center;
}

.mx-create-new-example__demo {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.mx-create-new-example h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
}

.mx-create-new-example__search {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.mx-create-new-example__direct {
  padding: 20px;
  background-color: #f0f7ff;
  border-radius: 8px;
}

.mx-create-new-example__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mx-create-new-example__btn {
  padding: 10px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.mx-create-new-example__btn:hover {
  background-color: #3a80d2;
}

.mx-create-new-example__result {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.mx-create-new-example__entity-type {
  font-weight: 600;
  font-size: 16px;
  color: #4a90e2;
  margin-bottom: 8px;
}

.mx-create-new-example__entity-data {
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  margin: 0;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .mx-create-new-example__buttons {
    flex-direction: column;
  }
  
  .mx-create-new-example__btn {
    width: 100%;
  }
}
</style>