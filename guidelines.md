# Mt. Olivet Church Management System - Development Guidelines

## General Principles

### Code Quality
* **Keep it clean**: Refactor code as you go to maintain readability
* **Single responsibility**: Each function/component should have one clear purpose
* **DRY principle**: Don't repeat yourself - extract reusable logic into helper functions
* **File sizes**: Keep files under 300 lines; split larger components into smaller ones

### Architecture
* **MVC pattern**: Maintain separation between models, controllers, and views
* **RESTful API**: Follow REST conventions for all API endpoints
* **Component-based**: Use modular, reusable React components
* **Absolute paths**: Always use absolute file paths in imports and API calls

---

## Frontend Guidelines (React + Tailwind CSS)

### Component Structure
* **Functional components only**: Use hooks (useState, useEffect) instead of class components
* **Component organization**:
  ```
  client/src/components/
  ├── ui/                  # Reusable UI components
  │   ├── Header.jsx      # Top navigation bar
  │   ├── Sidebar.jsx     # Side navigation menu
  │   ├── Layout.jsx      # Main layout wrapper
  │   └── index.js        # Component exports
  └── pages/              # Page components
      ├── Dashboard.jsx
      ├── Members.jsx
      └── ...
  ```

### UI Component Guidelines

#### Layout Components
* **Header**: Use for top navigation, search, and user menu
  - Fixed height: `h-16`
  - White background with bottom border
  - Mobile responsive (hides search on small screens)
  
* **Sidebar**: Use for main navigation menu
  - Gradient background: `from-slate-900 via-slate-800 to-blue-900`
  - Fixed width: `w-72`
  - Mobile: Slides in/out with overlay
  - Active route gets white background

* **Layout**: Main wrapper combining Header + Sidebar
  - Manages sidebar state
  - Responsive design
  - Provides Outlet for page content

### Styling with Tailwind CSS
* **Utility-first**: Use Tailwind classes directly in JSX
* **Custom classes**: Only create custom CSS for complex animations or specific needs
* **Responsive design**: Mobile-first approach using Tailwind breakpoints (sm, md, lg, xl)
* **Global styles**: Defined in `globals.css` with Tailwind layers
* **Color palette**:
  - Primary: Blue gradient (`gradient-blue` class)
  - Dark gradient: Slate to blue (`from-slate-900 to-blue-900`)
  - Success: Green (`text-green-600`, `bg-green-100`)
  - Warning: Orange/Yellow
  - Error: Red
  - Neutral: Gray scales

### UI Components

#### Cards
* Base class: `card` (defined in index.css)
* Add padding: `p-6`
* Hover effects: `hover:shadow-lg transition-shadow`
* Example: `<div className="card p-6 hover:shadow-lg">`

#### Buttons
* **Primary Button** (main action):
  ```jsx
  <button className="gradient-blue text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
    Action
  </button>
  ```
* **Secondary Button** (alternative action):
  ```jsx
  <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
    Cancel
  </button>
  ```

#### Status Badges
* Use color-coded badges for status fields
* Format: `px-3 py-1 rounded-full text-xs`
* Examples:
  - Active: `bg-green-100 text-green-800`
  - Pending: `bg-orange-100 text-orange-800`
  - Inactive: `bg-red-100 text-red-800`

#### Icons
* Use Lucide React icons consistently
* Size: `w-4 h-4` (small), `w-6 h-6` (medium), `w-8 h-8` (large)
* Always include descriptive `className` for styling

#### Tables
* Responsive wrapper: `<div className="card overflow-hidden"><div className="overflow-x-auto">`
* Header: `bg-gray-50 border-b border-gray-200`
* Row hover: `hover:bg-gray-50 transition-colors`
* Text styles: `text-xs text-gray-500 uppercase tracking-wider` for headers

### Data Fetching
* **Always use try-catch**: Wrap fetch calls in try-catch blocks
* **Loading states**: Show "Loading..." while fetching data
* **Empty states**: Display helpful messages when no data exists
* **Error handling**: Log errors to console and show user-friendly messages
* **API base URL**: `http://localhost:5000/api`

### Search & Filtering
* **Case-insensitive search**: `.toLowerCase()` for all search comparisons
* **Multiple field search**: Search across name, email, phone, etc.
* **Real-time filtering**: Filter on every keystroke (no debounce needed for small datasets)

---

## Backend Guidelines (Node.js + Express + Sequelize)

### Project Structure
```
server/
├── models/              # Sequelize models
├── controllers/         # Business logic
├── routes/             # API routes
├── config/             # Configuration files
└── index.js            # Server entry point
```

### Models (Sequelize)
* **Naming**: Singular, PascalCase (e.g., `Member`, not `members`)
* **Required fields**: Use `allowNull: false` for mandatory fields
* **Enums**: Use for predefined status values
* **Timestamps**: Sequelize adds `createdAt` and `updatedAt` automatically
* **Associations**: Define in `models/index.js`

### Controllers
* **One controller per resource**: `memberController.js`, `attendanceController.js`
* **Standard CRUD operations**:
  - `getAll` - List all records
  - `getById` - Get single record
  - `create` - Create new record
  - `update` - Update existing record
  - `delete` - Delete record
* **Error handling**: Always use try-catch blocks
* **Response format**:
  - Success: `res.json(data)`
  - Error: `res.status(500).json({ message: 'Server error' })`
  - Not found: `res.status(404).json({ message: 'Resource not found' })`

### API Routes
* **RESTful conventions**:
  - `GET /api/resource` - List all
  - `GET /api/resource/:id` - Get single
  - `POST /api/resource` - Create
  - `PUT /api/resource/:id` - Update
  - `DELETE /api/resource/:id` - Delete
* **Stats endpoints**: Use `/stats` suffix (e.g., `/api/members/stats`)
* **Route registration**: Register in `server/index.js` with consistent pattern

### Database Queries
* **Avoid N+1 queries**: Use `include` for related data
* **Pagination**: Limit large result sets (50 records max)
* **Date filtering**: Use Sequelize `Op.between` for date ranges
* **Aggregations**: Use Sequelize `sum()`, `count()` for analytics
* **Ordering**: Always specify `order` for consistent results

---

## Data Formats & Conventions

### Dates
* **Database**: Store as `DATEONLY` or `DATE`
* **Display**: Format as `YYYY-MM-DD` or locale string
* **Input**: Use HTML5 `<input type="date">`

### Phone Numbers
* **Format**: `024-555-1234` (with dashes)
* **Storage**: Store as string, no validation (international flexibility)

### Money/Currency
* **Storage**: DECIMAL(10, 2) for precise amounts
* **Display**: `GHS ${amount.toFixed(2)}` or `₵${amount}`
* **Calculations**: Use `parseFloat()` before math operations

### IDs
* **Auto-increment integers**: Primary keys
* **Display format**: `ID: ${id}` or `#${String(id).padStart(4, '0')}`

---

## Church-Specific Guidelines

### Member Management
* **Status values**: Active, Inactive, Transferred
* **Classes**: J1, J2, J3, J4, J5, J6 (Junior 1-6)
* **Required fields**: firstName, lastName, class

### Attendance
* **Status values**: Present, Absent, In School, Excused
* **Check-in time**: Always record when present
* **Daily records**: One attendance record per member per day

### Financial Records
* **Donation types**: Offering, Tithe, Donation, Pledge Payment, Online, Other
* **Receipt numbers**: Auto-generate with prefix `DON-${timestamp}`
* **Approval workflow**: Expenses require approval before payment

### SMS Messaging
* **Character limit**: Show character count (160 chars per SMS)
* **Recipient groups**: All Members, Teachers, Specific Class
* **Templates**: Reusable messages for common scenarios

---

## Security Best Practices

### Input Validation
* **Sanitize all inputs**: Prevent XSS attacks
* **Validate email format**: Use regex or validator library
* **Check required fields**: Before database operations

### API Security
* **CORS**: Enable only for trusted origins in production
* **Rate limiting**: Prevent abuse (100 requests per 15 minutes)
* **Authentication**: JWT tokens (when implemented)

### Database Security
* **No raw SQL**: Use Sequelize ORM exclusively
* **Parameterized queries**: Prevent SQL injection (ORM handles this)
* **Environment variables**: Store secrets in `.env` file

---

## Performance Optimization

### Frontend
* **Lazy loading**: Use React.lazy() for route-based code splitting
* **Memoization**: Use useMemo/useCallback for expensive computations
* **Image optimization**: Compress images, use appropriate formats
* **Bundle size**: Keep under 500KB gzipped

### Backend
* **Connection pooling**: Sequelize handles this automatically
* **Indexed queries**: Index frequently queried columns
* **Caching**: Consider Redis for frequently accessed data (future)
* **Async operations**: Use async/await for I/O operations

---

## Testing Guidelines (Future)

### Unit Tests
* **Test coverage**: Aim for 80% coverage
* **Test files**: `*.test.js` or `*.spec.js`
* **Frameworks**: Jest for backend, React Testing Library for frontend

### Integration Tests
* **API testing**: Use Supertest
* **Database**: In-memory SQLite for tests
* **Isolation**: Each test should be independent

---

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] Database migrated to PostgreSQL
- [ ] Remove console.log statements
- [ ] Update CORS settings for production
- [ ] Enable HTTPS/SSL
- [ ] Set up automated backups

### Production Environment
- [ ] Backend: Render, Heroku, or AWS
- [ ] Frontend: Vercel or Netlify
- [ ] Database: PostgreSQL on Heroku or AWS RDS
- [ ] File storage: Cloudinary for images

---

## Naming Conventions

### Files & Folders
* **Components**: PascalCase (e.g., `Dashboard.jsx`, `MemberList.jsx`)
* **Utilities**: camelCase (e.g., `formatDate.js`, `api.js`)
* **Models**: PascalCase, singular (e.g., `Member.js`, `Attendance.js`)
* **Routes**: camelCase, plural (e.g., `memberRoutes.js`)

### Variables & Functions
* **Variables**: camelCase (e.g., `totalMembers`, `isLoading`)
* **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRY`)
* **Functions**: camelCase, verb-noun (e.g., `getMemberById`, `calculateTotal`)
* **React components**: PascalCase (e.g., `MemberCard`, `AttendanceTable`)

### Database
* **Tables**: Plural (e.g., `Members`, `Attendances`)
* **Columns**: camelCase (e.g., `firstName`, `createdAt`)
* **Foreign keys**: `ModelId` (e.g., `MemberId`, `ClusterId`)

---

## Git Commit Messages

* **Format**: `<type>: <description>`
* **Types**:
  - `feat:` New feature
  - `fix:` Bug fix
  - `refactor:` Code refactoring
  - `style:` Formatting changes
  - `docs:` Documentation updates
  - `test:` Test additions
* **Examples**:
  - `feat: add visitor tracking module`
  - `fix: resolve attendance date filtering issue`
  - `refactor: extract member stats calculation`

---

## Documentation

### Code Comments
* **When to comment**:
  - Complex business logic
  - Non-obvious decisions
  - API endpoint descriptions
* **What NOT to comment**:
  - Self-explanatory code
  - Redundant information

### API Documentation
* **Document all endpoints**: Method, URL, parameters, response
* **Use JSDoc format**: For controller functions
* **Example responses**: Include sample JSON responses

---

## Resources

* **Tailwind CSS**: https://tailwindcss.com/docs
* **React**: https://react.dev
* **Sequelize**: https://sequelize.org/docs
* **Lucide Icons**: https://lucide.dev

---

**Remember**: These guidelines ensure consistency and maintainability across the Mt. Olivet Church Management System. Follow them for best results! 🙏
