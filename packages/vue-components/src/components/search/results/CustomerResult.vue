<template>
  <div class="mx-customer-result">
    <div class="mx-customer-result__content">
      <div class="mx-customer-result__name" v-highlight="query">
        {{ result.name }}
      </div>
      <div class="mx-customer-result__details">
        <div class="mx-customer-result__email" v-highlight="query">
          {{ result.email }}
        </div>
        <div v-if="result.phone" class="mx-customer-result__phone" v-highlight="query">
          {{ result.phone }}
        </div>
      </div>
      <div v-if="result.address" class="mx-customer-result__address">
        {{ formatAddress(result.address) }}
      </div>
    </div>
    <div class="mx-customer-result__badge">
      Customer
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CustomerSearchResult } from '../../../composables/useMegaSearch';
import { highlightDirective } from '../../../directives/highlight';

export default defineComponent({
  name: 'CustomerResult',
  directives: {
    highlight: highlightDirective
  },
  props: {
    result: {
      type: Object as PropType<CustomerSearchResult>,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  setup() {
    const formatAddress = (address: any) => {
      if (!address) return '';
      
      const parts = [];
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.zip) parts.push(address.zip);
      
      return parts.join(', ');
    };
    
    return {
      formatAddress
    };
  }
});
</script>

<style>
.mx-customer-result {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.mx-customer-result__content {
  flex: 1;
  min-width: 0;
}

.mx-customer-result__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.mx-customer-result__details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 4px;
}

.mx-customer-result__email {
  color: #666;
  font-size: 14px;
}

.mx-customer-result__phone {
  color: #666;
  font-size: 14px;
}

.mx-customer-result__address {
  font-size: 13px;
  color: #999;
}

.mx-customer-result__badge {
  background-color: #e3f2fd;
  color: #2196f3;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  margin-left: 12px;
}
</style>