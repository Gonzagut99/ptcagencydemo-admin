# Implementation Plan

- [x] 1. Setup base infrastructure and configuration






  - [x] 1.1 Install required dependencies

    - Run `pnpm add @tanstack/svelte-table` for table functionality
    - Run `pnpm add @tanstack/svelte-query @tanstack/svelte-query-devtools` (already installed)
    - Run `pnpm add openapi-fetch` (already installed)
    - _Requirements: 1.1_
  - [x] 1.2 Install shadcn-svelte components


    - Run `pnpm dlx shadcn@latest add button input select dialog dropdown-menu badge card separator label textarea checkbox radio-group switch tabs tooltip sonner`
    - Run `pnpm dlx shadcn@latest add data-table` for TanStack Table integration
    - _Requirements: 1.1, 14.1, 14.2, 14.3_


  - [x] 1.3 Install jsrepo components


    - Run `pnpm dlx jsrepo add sidebar breadcrumb` from @ieedan/shadcn-svelte-extras
    - _Requirements: 2.1, 2.3_


  - [ ] 1.4 Configure TanStack Query
    - Create queryClient.ts with QueryClient configuration
    - Set up default options for queries (staleTime, retry, refetchOnWindowFocus)
    - _Requirements: 1.1_


  - [ ] 1.5 Setup API client with openapi-fetch
    - Create client.ts with configured openapi-fetch client
    - Add base URL configuration


    - Implement request interceptor for auth token injection
    - Implement response interceptor for 401 error handling
    - _Requirements: 1.1, 1.3, 14.4, 14.5_
  - [ ] 1.6 Create utility functions
    - Create formatters.ts with currency formatter (PEN/USD) and date formatter (es-PE locale)
    - Create validators.ts with email, date, and document number validators
    - Create constants.ts with enums for status, roles, currencies, etc.
    - _Requirements: 15.1, 15.2, 15.5_
  - [ ] 1.7 Create status badge helpers
    - Create badge-helpers.ts with getStatusVariant and getStatusLabel functions
    - Add functions for liquidation status, payment status, service status, incidency status
    - Map status values to badge variants (default, secondary, success, warning, destructive)
    - _Requirements: 10.1, 10.5_

- [ ] 2. Implement authentication system
  - [ ] 2.1 Create auth store with Svelte 5 runes for user state management
    - Implement login, logout, and initialize methods
    - Add localStorage persistence for token and user data
    - _Requirements: 1.1, 1.4, 1.5_
  - [ ] 2.2 Create API client with authentication interceptor
    - Configure openapi-fetch client with base URL
    - Add request interceptor to inject auth token
    - Add response interceptor to handle 401 errors
    - _Requirements: 1.1, 1.3, 14.4_
  - [ ] 2.3 Build login page with form validation
    - Create login form with email and password fields
    - Implement client-side validation
    - Add error handling and loading states
    - _Requirements: 1.1, 1.2, 14.1, 14.2, 15.1, 15.2, 15.3_
  - [ ] 2.4 Create auth guard for protected routes
    - Implement +layout.ts in (app) group to check authentication
    - Redirect to login if not authenticated
    - _Requirements: 1.3_

- [x] 3. Build main layout with sidebar and navigation




  - [x] 3.1 Create sidebar store for collapse state

    - Implement toggle and state management with Svelte 5 runes
    - Add localStorage persistence for user preference
    - _Requirements: 2.2_
  - [x] 3.2 Build AppSidebar component


    - Create collapsible sidebar with navigation items
    - Add icons from lucide-svelte
    - Implement active state highlighting
    - Add tooltips for collapsed state
    - _Requirements: 2.1, 2.2, 2.5_

  - [-] 3.3 Build AppBreadcrumbs component

    - Parse current route to generate breadcrumb trail

    - Make breadcrumb items clickable for navigation

    - _Requirements: 2.3, 2.4_


  - [ ] 3.4 Create AppHeader component
    - Add user menu with logout option
    - Add notification bell icon with unread count
    - _Requirements: 1.4, 12.2, 12.6_
  - [ ] 3.5 Implement main app layout
    - Combine sidebar, header, breadcrumbs, and content area
    - Add responsive behavior for mobile devices
    - _Requirements: 2.1, 2.2, 2.3, 13.1, 13.2_

- [ ] 4. Implement notifications system
  - [ ] 4.1 Create notifications store with SSE connection
    - Implement SSE connection to backend
    - Handle incoming notifications and update state
    - Add connect and disconnect methods
    - _Requirements: 12.1_
  - [ ] 4.2 Create notification queries with TanStack Query
    - Implement query for paginated notifications with server-side pagination
    - Implement mutation for marking notifications as read
    - _Requirements: 12.3, 12.5_
  - [ ] 4.3 Build NotificationPanel component
    - Create dropdown panel with recent notifications
    - Show unread notifications with visual differentiation
    - Add mark as read functionality
    - _Requirements: 12.3, 12.4, 12.5_
  - [ ] 4.4 Create notifications DataTable columns definition
    - Define columns for message, date, read status
    - Add badge for unread notifications
    - Create row actions for mark as read
    - Add sorting by date
    - _Requirements: 12.7_
  - [ ] 4.5 Create notifications page with DataTable
    - Build DataTable with notifications columns
    - Add filter for read/unread status
    - Add server-side pagination
    - _Requirements: 12.7_
  - [ ] 4.6 Integrate SSE connection in app layout
    - Connect to SSE when user logs in
    - Disconnect when user logs out
    - _Requirements: 12.1_

- [ ] 5. Build dashboard with metrics and overview
  - [ ] 5.1 Create dashboard queries for metrics
    - Implement queries for liquidations, payments, customers
    - Calculate metrics from API data
    - _Requirements: 3.1, 3.5_
  - [ ] 5.2 Build metric cards component
    - Create reusable card component for displaying metrics
    - Add icons and formatting for currency and numbers
    - _Requirements: 3.1_
  - [ ] 5.3 Create recent liquidations list component
    - Display recent liquidations with status badges
    - Make items clickable to navigate to detail
    - _Requirements: 3.2, 3.4_
  - [ ] 5.4 Build overdue liquidations alert component
    - Filter liquidations by payment deadline
    - Show warning for liquidations due in next 7 days
    - _Requirements: 3.3_
  - [ ] 5.5 Assemble dashboard page
    - Combine all dashboard components
    - Add loading and error states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Implement customer management with DataTable





  - [x] 6.1 Create customer queries and mutations


    - Implement query for paginated customers with server-side pagination
    - Implement query for customer by ID
    - Implement mutation for creating customer
    - _Requirements: 4.1, 4.3_


  - [ ] 6.2 Create customer DataTable columns definition
    - Define columns for name, email, phone, document type, document number
    - Add sorting capabilities for name and email columns


    - Create row actions component with view and edit actions
    - _Requirements: 4.1, 4.4_
  - [x] 6.3 Build customer search and filters


    - Add search input with debouncing for name/email
    - Add filter for document type
    - Integrate filters with TanStack Table


    - _Requirements: 4.1_
  - [x] 6.4 Build CustomerForm component


    - Create form with all customer fields
    - Implement validation for email, date, document number
    - Add document type selector
    - _Requirements: 4.2, 4.5, 15.1, 15.2, 15.3, 15.5_
  - [ ] 6.5 Create customer detail page
    - Display customer information
    - Show associated liquidations in DataTable
    - _Requirements: 4.4_
  - [ ] 6.6 Build customers list page with DataTable
    - Integrate DataTable with columns and data
    - Add server-side pagination controls
    - Add "New Customer" button with modal form
    - Wire up search and filters
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7. Implement staff management with DataTable
  - [ ] 7.1 Create staff queries and mutations
    - Implement query for paginated staff with server-side pagination
    - Implement query for staff by role
    - Implement mutation for creating user with staff
    - _Requirements: 5.2, 5.4_
  - [ ] 7.2 Create staff DataTable columns definition
    - Define columns for username, email, role, salary, currency, hire date
    - Add sorting for username, role, and hire date
    - Create row actions component with view and edit actions
    - Add role badge with color coding
    - _Requirements: 5.2, 5.4_
  - [ ] 7.3 Build staff filters
    - Add role filter dropdown with multi-select
    - Integrate with TanStack Table filtering
    - _Requirements: 5.4_
  - [ ] 7.4 Build StaffForm component
    - Create form for user and staff data
    - Add role selector and currency selector
    - Implement validation for email uniqueness and salary
    - _Requirements: 5.3, 5.5, 15.1, 15.2, 15.5_
  - [ ] 7.5 Build staff page with DataTable and role-based access
    - Show staff section only for SUPERADMIN role
    - Integrate DataTable with columns, filters, and pagination
    - Add "New Staff" button with modal form
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Create liquidation listing and filtering with DataTable
  - [ ] 8.1 Create liquidation queries with server-side pagination
    - Implement query for paginated liquidations with filters
    - Implement query for liquidations by status
    - Implement query for liquidations by customer
    - Support multiple filter parameters in query
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [ ] 8.2 Create liquidation DataTable columns definition
    - Define columns for ID, customer name, staff name, total amount, status, payment status, deadline
    - Add currency formatting for amount column
    - Add status badges with color variants
    - Add conditional styling for overdue liquidations (red text)
    - Create row actions component with view, edit, and delete actions
    - Add sorting for ID, amount, and deadline columns
    - _Requirements: 10.1, 10.5, 10.6_
  - [ ] 8.3 Build liquidation filters component
    - Create multi-select filter for liquidation status (IN_QUOTE, PENDING, ON_COURSE, COMPLETED)
    - Create multi-select filter for payment status (PENDING, ON_COURSE, COMPLETED)
    - Add customer search input with debouncing
    - Add date range filter for payment deadline
    - Integrate all filters with TanStack Table
    - _Requirements: 10.2, 10.3, 10.4_
  - [ ] 8.4 Build liquidations list page with DataTable
    - Integrate DataTable with columns and server-side data
    - Add filters component above table
    - Add "New Liquidation" button in header
    - Wire up pagination with backend
    - Show loading skeleton while fetching data
    - Handle empty state when no liquidations found
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 9. Implement liquidation creation
  - [ ] 9.1 Create liquidation creation mutation
    - Implement mutation for creating liquidation
    - Handle success and error states
    - _Requirements: 6.4_
  - [ ] 9.2 Build liquidation creation form
    - Add customer selector with search
    - Add staff selector filtered by appropriate roles
    - Add currency rate, payment deadline, and companions fields
    - Implement form validation
    - _Requirements: 6.1, 6.2, 6.3, 15.1, 15.2, 15.5_
  - [ ] 9.3 Create new liquidation page
    - Integrate creation form
    - Redirect to detail page on success
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Build liquidation detail page structure
  - [ ] 10.1 Create liquidation detail query
    - Implement query for liquidation by ID with all details
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  - [ ] 10.2 Build liquidation header component
    - Display customer and staff information
    - Show liquidation status with ability to change
    - Display currency rate and companions
    - _Requirements: 11.1, 11.6, 11.7_
  - [ ] 10.3 Build financial summary component
    - Calculate and display total amount
    - Show total paid and remaining amount
    - Display payment status
    - _Requirements: 11.5_
  - [ ] 10.4 Create liquidation detail page layout
    - Combine header, services sections, payments, incidencies, and summary
    - Add loading and error states
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

- [ ] 11. Implement tour services management
  - [ ] 11.1 Create tour service mutation
    - Implement mutation for adding tour service to liquidation
    - _Requirements: 7.2_
  - [ ] 11.2 Build TourServiceForm component
    - Create form for tariff rate, taxed checkbox, currency
    - Add dynamic list of tours with fields for dates, title, price, place, status
    - Implement add/remove tour functionality
    - _Requirements: 7.2, 7.7, 15.1, 15.2, 15.5_
  - [ ] 11.3 Build tour service display component
    - Show list of tours with all details
    - Display status badges
    - _Requirements: 7.2, 7.7_
  - [ ] 11.4 Integrate tour services in liquidation detail
    - Add "Add Tour Service" button
    - Display existing tour services
    - Update total amount when services change
    - _Requirements: 7.2, 7.6_

- [ ] 12. Implement hotel services management
  - [ ] 12.1 Create hotel service mutation
    - Implement mutation for adding hotel service to liquidation
    - _Requirements: 7.3_
  - [ ] 12.2 Build HotelServiceForm component
    - Create form for tariff rate, taxed checkbox, currency
    - Add dynamic list of hotel bookings with check-in, check-out, hotel, room, description, price per night
    - Implement add/remove booking functionality
    - _Requirements: 7.3, 7.7, 15.1, 15.2, 15.5_
  - [ ] 12.3 Build hotel service display component
    - Show list of hotel bookings with all details
    - Calculate total nights and total cost
    - Display status badges
    - _Requirements: 7.3, 7.7_
  - [ ] 12.4 Integrate hotel services in liquidation detail
    - Add "Add Hotel Service" button
    - Display existing hotel services
    - Update total amount when services change
    - _Requirements: 7.3, 7.6_

- [ ] 13. Implement flight services management
  - [ ] 13.1 Create flight service mutation
    - Implement mutation for adding flight service to liquidation
    - _Requirements: 7.4_
  - [ ] 13.2 Build FlightServiceForm component
    - Create form for tariff rate, taxed checkbox, currency
    - Add dynamic list of flight bookings with origin, destiny, dates, airline, booking codes, ticket numbers, price
    - Implement add/remove booking functionality
    - _Requirements: 7.4, 7.7, 15.1, 15.2, 15.5_
  - [ ] 13.3 Build flight service display component
    - Show list of flight bookings with all details
    - Display status badges
    - _Requirements: 7.4, 7.7_
  - [ ] 13.4 Integrate flight services in liquidation detail
    - Add "Add Flight Service" button
    - Display existing flight services
    - Update total amount when services change
    - _Requirements: 7.4, 7.6_

- [ ] 14. Implement additional services management
  - [ ] 14.1 Create additional service mutation
    - Implement mutation for adding additional service to liquidation
    - _Requirements: 7.5_
  - [ ] 14.2 Build AdditionalServiceForm component
    - Create form for tariff rate, taxed checkbox, currency, price, status
    - Implement validation
    - _Requirements: 7.5, 7.7, 15.1, 15.2, 15.5_
  - [ ] 14.3 Build additional service display component
    - Show service details with status badge
    - _Requirements: 7.5, 7.7_
  - [ ] 14.4 Integrate additional services in liquidation detail
    - Add "Add Additional Service" button
    - Display existing additional services
    - Update total amount when services change
    - _Requirements: 7.5, 7.6_

- [ ] 15. Implement payment management
  - [ ] 15.1 Create payment mutation
    - Implement mutation for adding payment to liquidation
    - _Requirements: 8.2_
  - [ ] 15.2 Build payment form component
    - Create form with payment method selector and amount input
    - Implement validation to prevent overpayment
    - _Requirements: 8.2, 15.1, 15.2, 15.5_
  - [ ] 15.3 Build PaymentSection component
    - Display list of payments with method and validation status
    - Show total paid and remaining amount prominently
    - Add "Add Payment" button
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ] 15.4 Integrate payment section in liquidation detail
    - Update financial summary when payments change
    - Update payment status automatically
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 16. Implement incidency management
  - [ ] 16.1 Create incidency mutation
    - Implement mutation for adding incidency to liquidation
    - _Requirements: 9.2_
  - [ ] 16.2 Build incidency form component
    - Create form with reason, optional amount, and date fields
    - Implement validation
    - _Requirements: 9.2, 15.1, 15.2, 15.5_
  - [ ] 16.3 Build IncidencySection component
    - Display list of incidencies with status badges
    - Add filter for incidency status
    - Add "Add Incidency" button
    - _Requirements: 9.1, 9.2, 9.3, 9.5_
  - [ ] 16.4 Integrate incidency section in liquidation detail
    - Update total amount when approved incidencies change
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 17. Implement responsive design and mobile optimization
  - [ ] 17.1 Make sidebar responsive
    - Convert sidebar to hamburger menu on mobile
    - Add mobile-friendly navigation
    - _Requirements: 13.1, 13.2_
  - [ ] 17.2 Optimize tables for mobile
    - Make tables scrollable horizontally on small screens
    - Consider card layout for very small screens
    - _Requirements: 13.1_
  - [ ] 17.3 Optimize forms for mobile
    - Stack form fields vertically on small screens
    - Ensure touch targets are appropriately sized
    - _Requirements: 13.1_
  - [ ] 17.4 Test responsive behavior across breakpoints
    - Verify layout on mobile, tablet, and desktop sizes
    - _Requirements: 13.1, 13.2_

- [ ] 18. Implement accessibility features
  - [ ] 18.1 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add proper focus management in modals and dropdowns
    - _Requirements: 13.4_
  - [ ] 18.2 Add ARIA labels and roles
    - Add aria-label to icon buttons
    - Add proper roles to custom components
    - _Requirements: 13.5_
  - [ ] 18.3 Verify color contrast
    - Check all text meets WCAG AA contrast requirements
    - Adjust colors if necessary
    - _Requirements: 13.3_
  - [ ] 18.4 Test with screen reader
    - Verify all content is accessible to screen readers
    - Fix any issues found
    - _Requirements: 13.3, 13.4, 13.5_

- [ ] 19. Add error handling and loading states
  - [ ] 19.1 Create loading skeleton components
    - Build skeleton loaders for tables, cards, and forms
    - _Requirements: 14.1_
  - [ ] 19.2 Implement error boundary component
    - Create error boundary for catching component errors
    - Display user-friendly error messages
    - _Requirements: 14.2_
  - [ ] 19.3 Add toast notifications throughout app
    - Show success toasts for successful operations
    - Show error toasts for failed operations
    - _Requirements: 14.2, 14.3_
  - [ ] 19.4 Handle network errors gracefully
    - Show connection lost message
    - Provide retry functionality
    - _Requirements: 14.4_
  - [ ] 19.5 Implement 401 error handling
    - Auto-logout on authentication errors
    - Redirect to login page
    - _Requirements: 14.5_

- [ ] 20. Final integration and polish
  - [ ] 20.1 Connect all components and pages
    - Verify all navigation links work correctly
    - Ensure data flows properly between components
    - _Requirements: All_
  - [ ] 20.2 Add loading states to all async operations
    - Show spinners or skeletons during data fetching
    - Disable buttons during mutations
    - _Requirements: 14.1_
  - [ ] 20.3 Implement optimistic updates where appropriate
    - Update UI immediately for better UX
    - Rollback on error
    - _Requirements: 14.1_
  - [ ] 20.4 Add confirmation dialogs for destructive actions
    - Confirm before deleting or canceling
    - _Requirements: 14.2_
  - [ ] 20.5 Polish UI with consistent spacing and styling
    - Ensure consistent design language throughout
    - Fix any visual inconsistencies
    - _Requirements: 13.1, 13.3_
