import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Table from '../Table.vue';
import { TableColumn, TableFilter } from '@/types';

// Define test user type to improve type safety
interface TestUser {
  id: number;
  name: string;
  email: string;
  age?: number;
  status?: string;
  role?: string;
}

describe('Table Component', () => {
  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }
  ];

  const data: TestUser[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  it('renders correctly with basic props', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data
      }
    });
    
    // Check if table renders
    expect(wrapper.find('table').exists()).toBe(true);
    
    // Check if headers render correctly
    const headers = wrapper.findAll('th');
    expect(headers.length).toBe(columns.length);
    expect(headers[0].text()).toBe('ID');
    expect(headers[1].text()).toBe('Name');
    expect(headers[2].text()).toBe('Email');
    
    // Check if data renders correctly
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(data.length);
    
    // Check first row data
    const firstRowCells = rows[0].findAll('td');
    expect(firstRowCells[0].text()).toBe('1');
    expect(firstRowCells[1].text()).toBe('John Doe');
    expect(firstRowCells[2].text()).toBe('john@example.com');
  });

  it('displays loading state', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        loading: true
      }
    });
    
    expect(wrapper.find('.table-loading').exists()).toBe(true);
  });

  it('shows empty state message', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data: [],
        emptyText: 'No data available'
      }
    });
    
    expect(wrapper.find('.empty-message').text()).toBe('No data available');
  });

  it('applies style variants correctly', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        striped: true,
        bordered: true,
        hoverable: true,
        dense: true
      }
    });
    
    const table = wrapper.find('table');
    expect(table.classes()).toContain('table-striped');
    expect(table.classes()).toContain('table-bordered');
    expect(table.classes()).toContain('table-hover');
    expect(table.classes()).toContain('table-dense');
  });

  it('handles sortable columns', async () => {
    const sortableColumns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email' }
    ];
    
    const wrapper = mount(Table, {
      props: {
        columns: sortableColumns,
        data,
        sortBy: '',
        sortDesc: false
      }
    });
    
    // Find sortable headers
    const sortableHeaders = wrapper.findAll('.sortable-column');
    expect(sortableHeaders.length).toBe(2);
    
    // Click on a sortable header
    await sortableHeaders[0].trigger('click');
    
    // Check emit events
    expect(wrapper.emitted('update:sortBy')).toBeTruthy();
    expect(wrapper.emitted('update:sortBy')![0]).toEqual(['id']);
    expect(wrapper.emitted('update:sortDesc')).toBeTruthy();
    expect(wrapper.emitted('update:sortDesc')![0]).toEqual([false]);
    expect(wrapper.emitted('sort')).toBeTruthy();
  });

  it('handles row selection', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        selectable: true,
        selectedRows: []
      }
    });
    
    // Check if selection column exists
    expect(wrapper.find('.table-selection-column').exists()).toBe(true);
    
    // Select a row
    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);
    
    // Check emit events
    expect(wrapper.emitted('update:selectedRows')).toBeTruthy();
    expect(wrapper.emitted('selection-change')).toBeTruthy();
  });

  it('handles pagination', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data,
        pageSize: 10,
        currentPage: 1,
        totalRows: 20
      }
    });
    
    // Check if pagination exists
    expect(wrapper.find('.table-pagination').exists()).toBe(true);
    
    // Click next page button
    const nextButton = wrapper.findAll('.pagination-btn')[1];
    await nextButton.trigger('click');
    
    // Check emit events
    expect(wrapper.emitted('update:currentPage')).toBeTruthy();
    expect(wrapper.emitted('update:currentPage')![0]).toEqual([2]);
    expect(wrapper.emitted('page-change')).toBeTruthy();
  });

  it('applies cell formatters correctly', () => {
    const formattedColumns = [
      { key: 'id', label: 'ID' },
      { 
        key: 'name', 
        label: 'Name',
        formatter: (value: string) => `Mr. ${value}`
      }
    ];
    
    const wrapper = mount(Table, {
      props: {
        columns: formattedColumns,
        data
      }
    });
    
    const nameCell = wrapper.findAll('tbody tr')[0].findAll('td')[1];
    expect(nameCell.text()).toBe('Mr. John Doe');
  });

  it('renders custom cell content with slots', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data
      },
      slots: {
        'cell(name)': ({ value }: { value: string }) => {
          return `<span class="custom-cell">${value.toUpperCase()}</span>`;
        }
      }
    });
    
    // Verify the content of the cell reflects our intended customization
    const nameCell = wrapper.findAll('tbody tr')[0].findAll('td')[1];
    expect(nameCell.html()).toContain('JOHN DOE');
  });

  it('handles row click events', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        data
      }
    });
    
    // Click on a row
    await wrapper.findAll('tbody tr')[0].trigger('click');
    
    // Check emit events
    expect(wrapper.emitted('row-click')).toBeTruthy();
    expect(wrapper.emitted('row-click')![0][0]).toEqual(data[0]);
  });
});