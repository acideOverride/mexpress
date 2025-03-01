Roo: ARCHITECT
PROJECT: mExpress
TASK: Dashboard Implementation - BRQ-2025-040
STATUS: APPROVED FOR IMPLEMENTATION
PRIORITY: High

IMPLEMENTATION APPROVAL:
  Decision: APPROVED
  QC Status: VERIFIED
  Standards: COMPLIANT
  Chain: PRESERVED

IMPLEMENTATION GUIDE:

1. Component Structure:
   ```typescript
   // Dashboard Container
   interface DashboardProps {
     onSearch: (query: string) => void;
     onActionSelect: (action: string) => void;
   }

   const Dashboard: React.FC<DashboardProps> = ({ onSearch, onActionSelect }) => {
     return (
       <div className="grid grid-cols-12 gap-4 p-4">
         <Header className="col-span-12" />
         <MainContent className="col-span-8" />
         <Sidebar className="col-span-4" />
       </div>
     );
   };

   // Header Component
   const Header: React.FC<{ className?: string }> = ({ className }) => {
     return (
       <div className={className}>
         <QuickSearch />
         <ActionShortcuts />
       </div>
     );
   };

   // Main Content
   const MainContent: React.FC<{ className?: string }> = ({ className }) => {
     return (
       <div className={className}>
         <RecentCalls />
         <ActivityFeed />
       </div>
     );
   };

   // Sidebar
   const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
     return (
       <div className={className}>
         <MetricsDisplay />
       </div>
     );
   };
   ```

2. Implementation Steps:
   a. Base Structure:
      - Create component files
      - Set up routing
      - Add basic layout
      - Implement styling

   b. Core Components:
      - Implement QuickSearch
      - Add RecentCalls widget
      - Create ActivityFeed
      - Build MetricsDisplay
      - Add ActionShortcuts

   c. Data Integration:
      - Connect to Ringover service
      - Connect to Hiboutik service
      - Implement sync service
      - Add error handling

   d. State Management:
      - Set up local state
      - Implement context if needed
      - Add data fetching
      - Handle updates

3. Testing Strategy:
   ```typescript
   // Dashboard Tests
   describe('Dashboard', () => {
     it('should render all components', () => {
       render(<Dashboard />);
       expect(screen.getByTestId('quick-search')).toBeInTheDocument();
       expect(screen.getByTestId('recent-calls')).toBeInTheDocument();
       expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
       expect(screen.getByTestId('metrics-display')).toBeInTheDocument();
     });

     it('should handle search', async () => {
       const onSearch = jest.fn();
       render(<Dashboard onSearch={onSearch} />);
       const input = screen.getByRole('searchbox');
       await userEvent.type(input, 'test');
       expect(onSearch).toHaveBeenCalledWith('test');
     });

     it('should handle action selection', async () => {
       const onActionSelect = jest.fn();
       render(<Dashboard onActionSelect={onActionSelect} />);
       const action = screen.getByRole('button', { name: 'New Call' });
       await userEvent.click(action);
       expect(onActionSelect).toHaveBeenCalledWith('new-call');
     });
   });
   ```

4. Quality Requirements:
   - Type safety enforced
   - Tests comprehensive
   - Performance optimized
   - Accessibility complete
   - Documentation thorough

5. Performance Optimization:
   - Implement lazy loading
   - Add virtualization
   - Optimize re-renders
   - Cache API responses
   - Debounce search

VALIDATION CHAIN:
Previous: ARCHITECT -> QC
Current: Implementation Approval
Next: CODE Implementation

EVIDENCE CHAIN:
- Architecture Decision: docs/projects/mexpress/architecture/decisions/BRQ-2025-040-dashboard-design.md
- QC Verification: docs/projects/mexpress/architecture/qc-verification/BRQ-2025-040-dashboard-design-qc.md
- Implementation Guide: Current Document

Forward to CODE for implementation with complete guidance and requirements.