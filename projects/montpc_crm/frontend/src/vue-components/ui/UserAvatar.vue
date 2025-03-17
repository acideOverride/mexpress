<template>
  <div 
    class="user-avatar" 
    :class="[
      `size-${size}`, 
      `shape-${shape}`,
      color ? `color-${color}` : '',
      clickable ? 'clickable' : ''
    ]"
    :style="customStyle"
    @click="handleClick"
  >
    <!-- Use image if available, otherwise show initials -->
    <img 
      v-if="imageUrl" 
      :src="imageUrl" 
      :alt="`${name}'s avatar`" 
      class="avatar-image" 
      @error="handleImageError"
    />
    <span v-else class="avatar-initials">{{ userInitials }}</span>
    
    <!-- Status indicator if enabled -->
    <span 
      v-if="showStatus" 
      class="status-indicator" 
      :class="[
        `status-${status}`,
        pulseStatus ? 'pulse' : ''
      ]"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Types
type AvatarShape = 'circle' | 'rounded' | 'square';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StatusType = 'online' | 'away' | 'busy' | 'offline' | 'pulse';
type AvatarColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

// Props
const props = withDefaults(defineProps<{
  // Content
  name: string;
  imageUrl?: string;
  
  // Style
  size?: AvatarSize;
  shape?: AvatarShape;
  color?: AvatarColor;
  customBgColor?: string;
  customTextColor?: string;
  
  // Status
  status?: StatusType;
  showStatus?: boolean;
  pulseStatus?: boolean;
  
  // Behavior
  clickable?: boolean;
}>(), {
  size: 'md',
  shape: 'circle',
  status: 'offline',
  showStatus: false,
  pulseStatus: false,
  clickable: false
});

// Emits
const emit = defineEmits<{
  (e: 'click', value: MouseEvent): void;
}>();

// State
const hasImageError = ref(false);

// Computed
const userInitials = computed(() => {
  const nameParts = props.name.split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '?';
  
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  // Get first and last name initials
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

const customStyle = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.customBgColor) {
    styles.backgroundColor = props.customBgColor;
  }
  
  if (props.customTextColor) {
    styles.color = props.customTextColor;
  }
  
  return styles;
});

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event);
  }
};

const handleImageError = () => {
  hasImageError.value = true;
};
</script>

<style scoped>
/* Base Avatar Styles */
.user-avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent-color, #2563eb);
  color: white;
  font-weight: 600;
  overflow: hidden;
  user-select: none;
}

/* Size Variants */
.size-xs {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.625rem;
}

.size-sm {
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
}

.size-md {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.875rem;
}

.size-lg {
  width: 3rem;
  height: 3rem;
  font-size: 1rem;
}

.size-xl {
  width: 4rem;
  height: 4rem;
  font-size: 1.25rem;
}

/* Shape Variants */
.shape-circle {
  border-radius: 50%;
}

.shape-rounded {
  border-radius: 0.5rem;
}

.shape-square {
  border-radius: 0;
}

/* Color Variants */
.color-primary {
  background-color: var(--accent-color, #2563eb);
}

.color-success {
  background-color: var(--success-color, #10b981);
}

.color-warning {
  background-color: var(--warning-color, #f59e0b);
}

.color-error {
  background-color: var(--error-color, #ef4444);
}

.color-info {
  background-color: var(--info-color, #0ea5e9);
}

.color-neutral {
  background-color: var(--neutral-color, #6b7280);
}

/* Avatar Image */
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Status Indicator */
.status-indicator {
  position: absolute;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  border: 2px solid var(--sidebar-bg, white);
}

.status-online {
  background-color: var(--indicator-online, #10b981);
}

.status-away {
  background-color: var(--indicator-away, #f59e0b);
}

.status-busy {
  background-color: var(--indicator-busy, #ef4444);
}

.status-offline {
  background-color: var(--indicator-offline, #6b7280);
}

.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Responsive size adjustments */
.size-xs .status-indicator {
  width: 0.375rem;
  height: 0.375rem;
}

.size-xl .status-indicator {
  width: 0.75rem;
  height: 0.75rem;
}

/* Clickable style */
.clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable:hover {
  transform: scale(1.05);
}

.clickable:active {
  transform: scale(0.95);
}
</style>