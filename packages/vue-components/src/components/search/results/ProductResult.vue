<template>
  <div class="mx-product-result">
    <div class="mx-product-result__content">
      <div class="mx-product-result__name" v-highlight="query">
        {{ result.name }}
      </div>
      <div class="mx-product-result__details">
        <div class="mx-product-result__price">
          {{ formatCurrency(result.price) }}
        </div>
        <div class="mx-product-result__sku" v-highlight="query">
          SKU: {{ result.sku }}
        </div>
        <div class="mx-product-result__category">
          {{ result.category }}
        </div>
      </div>
      <div v-if="result.description" class="mx-product-result__description" v-highlight="query">
        {{ truncateDescription(result.description) }}
      </div>
      <div class="mx-product-result__inventory">
        <span class="mx-product-result__stock-label">
          Stock:
        </span>
        <span 
          class="mx-product-result__stock-level"
          :class="stockLevelClass"
        >
          {{ result.stockLevel }}
        </span>
      </div>
    </div>
    <div class="mx-product-result__badge">
      Product
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ProductSearchResult } from '../../../composables/useMegaSearch';
import { highlightDirective } from '../../../directives/highlight';

export default defineComponent({
  name: 'ProductResult',
  directives: {
    highlight: highlightDirective
  },
  props: {
    result: {
      type: Object as PropType<ProductSearchResult>,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };
    
    const truncateDescription = (description: string): string => {
      if (description.length <= 100) return description;
      return description.substring(0, 100) + '...';
    };
    
    const stockLevelClass = computed(() => {
      const stockLevel = props.result.stockLevel;
      
      if (stockLevel <= 0) {
        return 'mx-product-result__stock-level--out';
      } else if (stockLevel < 10) {
        return 'mx-product-result__stock-level--low';
      } else {
        return 'mx-product-result__stock-level--in';
      }
    });
    
    return {
      formatCurrency,
      truncateDescription,
      stockLevelClass
    };
  }
});
</script>

<style>
.mx-product-result {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.mx-product-result__content {
  flex: 1;
  min-width: 0;
}

.mx-product-result__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.mx-product-result__details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 4px;
}

.mx-product-result__price {
  font-weight: 600;
  color: #2e7d32;
  font-size: 14px;
}

.mx-product-result__sku {
  color: #666;
  font-size: 14px;
}

.mx-product-result__category {
  font-size: 13px;
  color: #757575;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

.mx-product-result__description {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.4;
}

.mx-product-result__inventory {
  font-size: 13px;
  color: #666;
}

.mx-product-result__stock-label {
  font-weight: 500;
  margin-right: 4px;
}

.mx-product-result__stock-level {
  font-weight: 600;
}

.mx-product-result__stock-level--in {
  color: #2e7d32;
}

.mx-product-result__stock-level--low {
  color: #ff9800;
}

.mx-product-result__stock-level--out {
  color: #f44336;
}

.mx-product-result__badge {
  background-color: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  margin-left: 12px;
}
</style>