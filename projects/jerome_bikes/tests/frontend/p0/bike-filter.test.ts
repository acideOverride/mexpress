/**
 * Bike Filter Component Tests
 * 
 * These tests verify the functionality of the bike filter component
 * used for filtering the bike list.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BikeFilter from '@/frontend/components/bikes/BikeFilter.vue';

describe('BikeFilter Component', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = mount(BikeFilter);
  });
  
  it('should render filter component with all filter options', () => {
    // Check basic structure
    expect(wrapper.find('.filter-container').exists()).toBe(true);
    
    // Check filter sections
    expect(wrapper.find('[data-test="type-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="price-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="size-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="station-filter"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="availability-filter"]').exists()).toBe(true);
    
    // Check action buttons
    expect(wrapper.find('[data-test="apply-filters"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="reset-filters"]').exists()).toBe(true);
  });
  
  it('should update filter values when inputs change', async () => {
    // Set bike type filter
    await wrapper.find('[data-test="type-filter"] select').setValue('Mountain');
    
    // Set price range filter
    await wrapper.find('[data-test="min-price"]').setValue(10);
    await wrapper.find('[data-test="max-price"]').setValue(50);
    
    // Set size filter
    await wrapper.find('[data-test="size-filter"] input[value="M"]').setValue(true);
    
    // Set availability filter
    await wrapper.find('[data-test="availability-filter"] input[value="available"]').setValue(true);
    
    // Get internal component state
    const typeFilter = wrapper.vm.filters.type;
    const minPrice = wrapper.vm.filters.minPrice;
    const maxPrice = wrapper.vm.filters.maxPrice;
    const sizeFilter = wrapper.vm.filters.size;
    const availabilityFilter = wrapper.vm.filters.status;
    
    // Verify values were updated
    expect(typeFilter).toBe('Mountain');
    expect(minPrice).toBe(10);
    expect(maxPrice).toBe(50);
    expect(sizeFilter).toBe('M');
    expect(availabilityFilter).toBe('available');
  });
  
  it('should emit filter-changed event with filter values when apply button is clicked', async () => {
    // Set various filters
    await wrapper.find('[data-test="type-filter"] select').setValue('Mountain');
    await wrapper.find('[data-test="min-price"]').setValue(10);
    await wrapper.find('[data-test="max-price"]').setValue(50);
    await wrapper.find('[data-test="size-filter"] input[value="M"]').setValue(true);
    
    // Click apply button
    await wrapper.find('[data-test="apply-filters"]').trigger('click');
    
    // Check event was emitted with correct filter values
    expect(wrapper.emitted('filter-changed')).toBeTruthy();
    expect(wrapper.emitted('filter-changed')![0][0]).toEqual({
      type: 'Mountain',
      minPrice: 10,
      maxPrice: 50,
      size: 'M'
    });
  });
  
  it('should reset all filter values when reset button is clicked', async () => {
    // Set various filters
    await wrapper.find('[data-test="type-filter"] select').setValue('Mountain');
    await wrapper.find('[data-test="min-price"]').setValue(10);
    await wrapper.find('[data-test="max-price"]').setValue(50);
    await wrapper.find('[data-test="size-filter"] input[value="M"]').setValue(true);
    
    // Click reset button
    await wrapper.find('[data-test="reset-filters"]').trigger('click');
    
    // Check that all filter values are reset
    expect(wrapper.vm.filters).toEqual({
      type: '',
      minPrice: null,
      maxPrice: null,
      size: '',
      stationId: '',
      status: ''
    });
    
    // Check that filter-changed event is emitted with empty values
    expect(wrapper.emitted('filter-changed')).toBeTruthy();
    expect(wrapper.emitted('filter-changed')![0][0]).toEqual({});
  });
  
  it('should validate price range inputs', async () => {
    // Set min price higher than max price
    await wrapper.find('[data-test="min-price"]').setValue(50);
    await wrapper.find('[data-test="max-price"]').setValue(20);
    
    // Click apply button
    await wrapper.find('[data-test="apply-filters"]').trigger('click');
    
    // Check validation error is displayed
    expect(wrapper.find('.validation-error').exists()).toBe(true);
    expect(wrapper.find('.validation-error').text()).toContain('Min price cannot be greater than max price');
    
    // Check that event was not emitted
    expect(wrapper.emitted('filter-changed')).toBeFalsy();
  });
  
  it('should have mobile-friendly compact mode for small screens', async () => {
    // Mount with compact mode prop
    const compactWrapper = mount(BikeFilter, {
      props: {
        compact: true
      }
    });
    
    // Check compact class is applied
    expect(compactWrapper.find('.filter-container.compact').exists()).toBe(true);
    
    // Check that filter toggle button is shown for compact mode
    expect(compactWrapper.find('[data-test="filter-toggle"]').exists()).toBe(true);
  });
  
  it('should toggle filter visibility in compact mode', async () => {
    // Mount with compact mode prop
    const compactWrapper = mount(BikeFilter, {
      props: {
        compact: true
      }
    });
    
    // Filters should be hidden by default in compact mode
    expect(compactWrapper.find('.filter-fields').classes()).toContain('hidden');
    
    // Click toggle button
    await compactWrapper.find('[data-test="filter-toggle"]').trigger('click');
    
    // Filters should now be visible
    expect(compactWrapper.find('.filter-fields').classes()).not.toContain('hidden');
    
    // Click toggle button again
    await compactWrapper.find('[data-test="filter-toggle"]').trigger('click');
    
    // Filters should be hidden again
    expect(compactWrapper.find('.filter-fields').classes()).toContain('hidden');
  });
  
  it('should show active filter summary in compact mode', async () => {
    // Mount with compact mode prop
    const compactWrapper = mount(BikeFilter, {
      props: {
        compact: true
      }
    });
    
    // Set a filter
    await compactWrapper.find('[data-test="type-filter"] select').setValue('Mountain');
    await compactWrapper.find('[data-test="apply-filters"]').trigger('click');
    
    // Check that active filter summary is shown
    expect(compactWrapper.find('.active-filters').exists()).toBe(true);
    expect(compactWrapper.find('.active-filters').text()).toContain('Type: Mountain');
  });
});