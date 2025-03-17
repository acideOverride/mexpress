/**
 * Bike Browsing Components Tests
 * 
 * These tests verify the functionality of the bike browsing components, including
 * listing, filtering, pagination, and detail views.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import Bikes from '@/frontend/views/Bikes.vue';
import BikeCard from '@/frontend/components/bikes/BikeCard.vue';
import BikeFilter from '@/frontend/components/bikes/BikeFilter.vue';
import BikeDetail from '@/frontend/components/bikes/BikeDetail.vue';
import BikeService from '@/frontend/services/bike.service';
import { nextTick } from 'vue';

// Mock BikeService
vi.mock('@/frontend/services/bike.service', () => ({
  default: {
    getAllBikes: vi.fn(),
    getBikeById: vi.fn(),
    getBikesByStation: vi.fn(),
    getAvailableBikes: vi.fn(),
    searchBikes: vi.fn(),
    getFeaturedBikes: vi.fn()
  }
}));

// Sample data for tests
const mockBikes = [
  {
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
  },
  {
    id: '2',
    model: 'City Cruiser',
    type: 'Urban',
    description: 'Comfortable bike for city rides',
    imageUrl: 'urban.jpg',
    pricePerHour: 8,
    pricePerDay: 40,
    status: 'available',
    stationId: 'station1',
    features: ['basket', 'lights', 'comfortable seat'],
    size: 'L',
    rating: 4.2,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

const mockPaginatedResponse = {
  data: mockBikes,
  page: 1,
  limit: 10,
  totalCount: 2,
  totalPages: 1
};

describe('Bike Browsing Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup mock response for BikeService
    (BikeService.getAllBikes as any).mockResolvedValue(mockPaginatedResponse);
    (BikeService.getBikeById as any).mockImplementation((id) => 
      Promise.resolve(mockBikes.find(bike => bike.id === id))
    );
    (BikeService.searchBikes as any).mockResolvedValue(mockPaginatedResponse);
  });

  describe('Bikes View', () => {
    it('should render the bikes page with header', async () => {
      const wrapper = mount(Bikes);
      
      expect(wrapper.find('.bikes-page').exists()).toBe(true);
      expect(wrapper.find('h1').text()).toContain('Our Bike Collection');
    });

    it('should display bikes in a grid layout by default', async () => {
      const wrapper = mount(Bikes);
      await flushPromises();
      
      expect(wrapper.find('.bikes-grid').exists()).toBe(true);
    });

    it('should switch between grid and list view', async () => {
      const wrapper = mount(Bikes);
      
      // Default is grid view
      expect(wrapper.find('.bikes-grid').exists()).toBe(true);
      
      // Click on list view toggle
      await wrapper.find('[data-test="list-view-toggle"]').trigger('click');
      await nextTick();
      
      // Should switch to list view
      expect(wrapper.find('.bikes-list').exists()).toBe(true);
      expect(wrapper.find('.bikes-grid').exists()).toBe(false);
      
      // Click on grid view toggle
      await wrapper.find('[data-test="grid-view-toggle"]').trigger('click');
      await nextTick();
      
      // Should switch back to grid view
      expect(wrapper.find('.bikes-grid').exists()).toBe(true);
      expect(wrapper.find('.bikes-list').exists()).toBe(false);
    });

    it('should fetch bikes on mounted', async () => {
      mount(Bikes);
      await flushPromises();
      
      expect(BikeService.getAllBikes).toHaveBeenCalled();
    });

    it('should display loading state while fetching bikes', async () => {
      // Delay the mock response
      (BikeService.getAllBikes as any).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockPaginatedResponse), 100))
      );
      
      const wrapper = mount(Bikes);
      
      // Should show loading state
      expect(wrapper.find('[data-test="loading-state"]').exists()).toBe(true);
      
      // Wait for response
      await flushPromises();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Loading state should be gone
      expect(wrapper.find('[data-test="loading-state"]').exists()).toBe(false);
    });
  });

  describe('Bike Card Component', () => {
    it('should render bike information correctly', async () => {
      const bike = mockBikes[0];
      const wrapper = mount(BikeCard, {
        props: {
          bike
        }
      });
      
      expect(wrapper.find('.bike-card').exists()).toBe(true);
      expect(wrapper.find('.bike-model').text()).toContain(bike.model);
      expect(wrapper.find('.bike-type').text()).toContain(bike.type);
      expect(wrapper.find('.bike-price').text()).toContain(bike.pricePerDay.toString());
    });

    it('should emit view-details event when view details button is clicked', async () => {
      const bike = mockBikes[0];
      const wrapper = mount(BikeCard, {
        props: {
          bike
        }
      });
      
      await wrapper.find('[data-test="view-details-button"]').trigger('click');
      
      expect(wrapper.emitted('view-details')).toBeTruthy();
      expect(wrapper.emitted('view-details')?.[0]).toEqual([bike.id]);
    });

    it('should show availability status with correct styling', async () => {
      // Available bike
      let wrapper = mount(BikeCard, {
        props: {
          bike: { ...mockBikes[0], status: 'available' }
        }
      });
      
      expect(wrapper.find('.status-available').exists()).toBe(true);
      
      // Reserved bike
      wrapper = mount(BikeCard, {
        props: {
          bike: { ...mockBikes[0], status: 'reserved' }
        }
      });
      
      expect(wrapper.find('.status-reserved').exists()).toBe(true);
      
      // Maintenance bike
      wrapper = mount(BikeCard, {
        props: {
          bike: { ...mockBikes[0], status: 'maintenance' }
        }
      });
      
      expect(wrapper.find('.status-maintenance').exists()).toBe(true);
    });
  });

  describe('Bike Filtering', () => {
    it('should render filter sidebar with options', async () => {
      const wrapper = mount(BikeFilter);
      
      expect(wrapper.find('.filter-sidebar').exists()).toBe(true);
      expect(wrapper.find('[data-test="type-filter"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="price-filter"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="size-filter"]').exists()).toBe(true);
    });

    it('should emit filter-changed event when filters are applied', async () => {
      const wrapper = mount(BikeFilter);
      
      // Set type filter
      await wrapper.find('[data-test="type-filter"] select').setValue('Mountain');
      
      // Set price range
      await wrapper.find('[data-test="min-price"]').setValue(10);
      await wrapper.find('[data-test="max-price"]').setValue(50);
      
      // Apply filters
      await wrapper.find('[data-test="apply-filters"]').trigger('click');
      
      expect(wrapper.emitted('filter-changed')).toBeTruthy();
      expect(wrapper.emitted('filter-changed')?.[0]).toEqual([{
        type: 'Mountain',
        minPrice: 10,
        maxPrice: 50
      }]);
    });

    it('should reset filters when reset button is clicked', async () => {
      const wrapper = mount(BikeFilter);
      
      // Set filters
      await wrapper.find('[data-test="type-filter"] select').setValue('Mountain');
      await wrapper.find('[data-test="min-price"]').setValue(10);
      
      // Reset filters
      await wrapper.find('[data-test="reset-filters"]').trigger('click');
      
      expect(wrapper.emitted('filter-changed')).toBeTruthy();
      expect(wrapper.emitted('filter-changed')?.[0]).toEqual([{}]);
      
      // Inputs should be reset
      expect((wrapper.find('[data-test="type-filter"] select').element as HTMLSelectElement).value).toBe('');
      expect((wrapper.find('[data-test="min-price"]').element as HTMLInputElement).value).toBe('');
    });
  });

  describe('Bike Detail View', () => {
    it('should render bike details correctly', async () => {
      const bike = mockBikes[0];
      const wrapper = mount(BikeDetail, {
        props: {
          bikeId: bike.id,
          isOpen: true
        }
      });
      
      await flushPromises();
      
      expect(wrapper.find('.bike-detail').exists()).toBe(true);
      expect(wrapper.find('.bike-model').text()).toContain(bike.model);
      expect(wrapper.find('.bike-description').text()).toContain(bike.description);
      
      // Features should be displayed
      bike.features.forEach(feature => {
        expect(wrapper.text()).toContain(feature);
      });
    });

    it('should fetch bike data when opened', async () => {
      const bike = mockBikes[0];
      mount(BikeDetail, {
        props: {
          bikeId: bike.id,
          isOpen: true
        }
      });
      
      await flushPromises();
      
      expect(BikeService.getBikeById).toHaveBeenCalledWith(bike.id);
    });

    it('should emit close event when close button is clicked', async () => {
      const bike = mockBikes[0];
      const wrapper = mount(BikeDetail, {
        props: {
          bikeId: bike.id,
          isOpen: true
        }
      });
      
      await flushPromises();
      await wrapper.find('[data-test="close-detail"]').trigger('click');
      
      expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('should emit reserve event when reserve button is clicked', async () => {
      const bike = mockBikes[0];
      const wrapper = mount(BikeDetail, {
        props: {
          bikeId: bike.id,
          isOpen: true
        }
      });
      
      await flushPromises();
      await wrapper.find('[data-test="reserve-bike"]').trigger('click');
      
      expect(wrapper.emitted('reserve')).toBeTruthy();
      expect(wrapper.emitted('reserve')?.[0]).toEqual([bike.id]);
    });
  });
});