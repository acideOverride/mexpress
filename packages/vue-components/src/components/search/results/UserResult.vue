<template>
  <div class="mx-user-result">
    <div class="mx-user-result__content">
      <div class="mx-user-result__name">
        <span v-highlight="query">{{ result.firstName }}</span> 
        <span v-highlight="query">{{ result.lastName }}</span>
      </div>
      <div class="mx-user-result__email" v-highlight="query">
        {{ result.email }}
      </div>
      <div class="mx-user-result__details">
        <div class="mx-user-result__role">
          {{ formatRole(result.role) }}
        </div>
        <div 
          v-if="result.lastLogin" 
          class="mx-user-result__login"
        >
          Last login: {{ formatDate(result.lastLogin) }}
        </div>
      </div>
    </div>
    <div
      class="mx-user-result__badge"
      :class="{
        'mx-user-result__badge--admin': result.role === 'admin',
        'mx-user-result__badge--inactive': result.isActive === false
      }"
    >
      {{ getBadgeText() }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserSearchResult } from '../../../composables/useMegaSearch';
import { highlightDirective } from '../../../directives/highlight';

export default defineComponent({
  name: 'UserResult',
  directives: {
    highlight: highlightDirective
  },
  props: {
    result: {
      type: Object as PropType<UserSearchResult>,
      required: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const formatRole = (role: string) => {
      return role.charAt(0).toUpperCase() + role.slice(1);
    };
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      
      // Format: Jun 15, 2025
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    const getBadgeText = () => {
      if (props.result.isActive === false) {
        return 'Inactive';
      }
      
      if (props.result.role === 'admin') {
        return 'Admin';
      }
      
      return 'User';
    };
    
    return {
      formatRole,
      formatDate,
      getBadgeText
    };
  }
});
</script>

<style>
.mx-user-result {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.mx-user-result__content {
  flex: 1;
  min-width: 0;
}

.mx-user-result__name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.mx-user-result__email {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.mx-user-result__details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.mx-user-result__role {
  color: #757575;
  font-size: 13px;
}

.mx-user-result__login {
  font-size: 13px;
  color: #999;
}

.mx-user-result__badge {
  background-color: #f5f5f5;
  color: #757575;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  margin-left: 12px;
}

.mx-user-result__badge--admin {
  background-color: #ede7f6;
  color: #673ab7;
}

.mx-user-result__badge--inactive {
  background-color: #ffebee;
  color: #f44336;
}
</style>