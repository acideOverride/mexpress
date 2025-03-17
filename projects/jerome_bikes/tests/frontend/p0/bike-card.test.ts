/**
 * Bike Card Component Tests
 * 
 * These tests verify the functionality of the bike card component used
 * in the bike browsing view.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BikeCard from '@/frontend/components/bikes/BikeCard.vue';

const mockBike = {
  id: '1',
  model: 'Mountain Explorer',
  type: 'Mountain',
  description: 'A robust mountain bike for all terrains',
  imageUrl: 'mountain.jpg',
  pricePerHour: 10,
  pricePerDay: 50,
  status: 'available',
  stationId: 'station1',
  features: ['front suspension', '21 speed', 'disc brakes'],
  size: 'M',
  rating: 4.5,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

describe('BikeCard Component', () => {
  it('should render bike card with the correct bike information', () => {
    const wrapper = mount(BikeCard, {
      props: {
        bike: mockBike
      }
    });
    
    // Basic structure
    expect(wrapper.find('.bike-card').exists()).toBe(true);
    
    // Check bike details are displayed
    expect(wrapper.find('.bike-model').text()).toBe(mockBike.model);
    expect(wrapper.find('.bike-type').text()).toBe(mockBike.type);
    expect(wrapper.find('[data-test="bike-price"]').text()).toContain(mockBike.pricePerDay.toString());
    
    // Check image is displayed with the correct src
    const img = wrapper.find('.bike-image img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(mockBike.imageUrl);
    expect(img.attributes('alt')).toContain(mockBike.model);
  });
  
  it('should display bike rating correctly', () => {
    const wrapper = mount(BikeCard, {
      props: {
        bike: mockBike
      }
    });
    
    expect(wrapper.find('.bike-rating').exists()).toBe(true);
    expect(wrapper.find('.bike-rating').text()).toContain(mockBike.rating.toString());
  });
  
  it('should show different status indicators based on bike status', async () => {
    // Test for available bikes
    const availableWrapper = mount(BikeCard, {
      props: {
        bike: { ...mockBike, status: 'available' }
      }
    });
    
    expect(availableWrapper.find('.status-indicator.available').exists()).toBe(true);
    expect(availableWrapper.find('.status-text').text()).toBe('Available');
    
    // Test for reserved bikes
    const reservedWrapper = mount(BikeCard, {
      props: {
        bike: { ...mockBike, status: 'reserved' }
      }
    });
    
    expect(reservedWrapper.find('.status-indicator.reserved').exists()).toBe(true);
    expect(reservedWrapper.find('.status-text').text()).toBe('Reserved');
    
    // Test for maintenance bikes
    const maintenanceWrapper = mount(BikeCard, {
      props: {
        bike: { ...mockBike, status: 'maintenance' }
      }
    });
    
    expect(maintenanceWrapper.find('.status-indicator.maintenance').exists()).toBe(true);
    expect(maintenanceWrapper.find('.status-text').text()).toBe('In Maintenance');
  });
  
  it('should emit view-details event with bike id when details button is clicked', async () => {
    const wrapper = mount(BikeCard, {
      props: {
        bike: mockBike
      }
    });
    
    await wrapper.find('[data-test="view-details-button"]').trigger('click');
    
    // Check that the event was emitted with the correct payload
    expect(wrapper.emitted('view-details')).toBeTruthy();
    expect(wrapper.emitted('view-details')![0]).toEqual([mockBike.id]);
  });
  
  it('should emit reserve event with bike id when reserve button is clicked', async () => {
    const wrapper = mount(BikeCard, {
      props: {
        bike: mockBike
      }
    });
    
    await wrapper.find('[data-test="reserve-button"]').trigger('click');
    
    // Check that the event was emitted with the correct payload
    expect(wrapper.emitted('reserve')).toBeTruthy();
    expect(wrapper.emitted('reserve')![0]).toEqual([mockBike.id]);
  });
  
  it('should disable reserve button when bike is not available', async () => {
    // Test with reserved bike
    const reservedWrapper = mount(BikeCard, {
      props: {
        bike: { ...mockBike, status: 'reserved' }
      }
    });
    
    const reservedButton = reservedWrapper.find('[data-test="reserve-button"]');
    expect(reservedButton.attributes('disabled')).toBeDefined();
    
    // Test with maintenance bike
    const maintenanceWrapper = mount(BikeCard, {
      props: {
        bike: { ...mockBike, status: 'maintenance' }
      }
    });
    
    const maintenanceButton = maintenanceWrapper.find('[data-test="reserve-button"]');
    expect(maintenanceButton.attributes('disabled')).toBeDefined();
  });
  
  it('should lazy-load bike images for better performance', async () => {
    const wrapper = mount(BikeCard, {
      props: {
        bike: mockBike
      }
    });
    
    const img = wrapper.find('.bike-image img');
    expect(img.attributes('loading')).toBe('lazy');
  });
});