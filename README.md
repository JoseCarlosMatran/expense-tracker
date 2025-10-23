# ExpenseTracker - Personal Finance Management

A modern, professional NextJS expense tracking application that helps users manage their personal finances with an intuitive and clean interface.

## Features

### Core Functionality
- ✅ **Add Expenses**: Simple form to add expenses with date, amount, category, and description
- ✅ **View Expenses**: Clean, organized list with pagination and sorting
- ✅ **Filter & Search**: Filter by date range, category, and search by description
- ✅ **Edit & Delete**: Inline editing and deletion with confirmation
- ✅ **Categories**: Predefined categories (Food, Transportation, Entertainment, Shopping, Bills, Other)
- ✅ **Data Persistence**: Uses localStorage for demo purposes

### Dashboard & Analytics
- ✅ **Summary Cards**: Total expenses, monthly spending, daily averages
- ✅ **Recent Expenses**: Quick view of latest transactions
- ✅ **Top Categories**: Visual breakdown of spending by category
- ✅ **Charts**: Interactive bar and pie charts for spending visualization
- ✅ **Export**: CSV export functionality with proper formatting

### Design & User Experience
- ✅ **Modern UI**: Clean, professional design with Tailwind CSS
- ✅ **Responsive**: Works seamlessly on desktop and mobile devices
- ✅ **Navigation**: Intuitive sidebar navigation with active states
- ✅ **Loading States**: Visual feedback during operations
- ✅ **Error Handling**: Proper error messages and retry mechanisms
- ✅ **Form Validation**: Comprehensive client-side validation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for robust date operations
- **State Management**: React hooks for local state
- **Storage**: localStorage (easily replaceable with database)

## Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── add/               # Add expense page
│   ├── analytics/         # Analytics and charts page
│   ├── expenses/          # Expense list page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/
│   ├── charts/            # Chart components
│   ├── dashboard/         # Dashboard-specific components
│   ├── expenses/          # Expense management components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components (sidebar, header)
│   ├── modals/            # Modal components
│   └── ui/                # Reusable UI components
├── constants/             # Application constants
├── lib/                   # Utility functions and services
├── types/                 # TypeScript type definitions
└── ...
```

## Usage Guide

### Adding Your First Expense
1. Click "Add Expense" in the sidebar or dashboard
2. Fill in the expense details:
   - **Date**: When the expense occurred
   - **Amount**: Cost in dollars (e.g., 25.99)
   - **Category**: Select from predefined categories
   - **Description**: Brief description of the expense
3. Click "Add Expense" to save

### Managing Expenses
- **View All**: Navigate to "Expenses" to see all transactions
- **Filter**: Use the filter panel to narrow down results by date range or category
- **Search**: Type keywords to find specific expenses
- **Edit**: Click the edit icon on any expense to modify it
- **Delete**: Click the delete icon and confirm to remove an expense
- **Export**: Click "Export CSV" to download your data

### Understanding Analytics
- **Dashboard**: Overview of your spending with summary cards
- **Analytics Page**: Detailed charts and category breakdowns
- **Chart Types**: Toggle between bar and pie chart views
- **Categories**: See which categories you spend most on

### Data Management
- All data is stored locally in your browser
- Data persists between sessions
- Export to CSV to backup your data
- Clear browser data will reset the app

## Features in Detail

### Form Validation
- Required field validation
- Amount must be positive number
- Date validation
- Minimum description length
- Real-time error feedback

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons and forms
- Optimized chart viewing on small screens

### Error Handling
- Network error recovery
- Form submission error handling
- Data loading error states
- User-friendly error messages

### Performance
- Optimized bundle size
- Lazy loading where appropriate
- Efficient re-renders with React hooks
- Static generation for better performance

## Testing the Application

### Manual Testing Checklist

#### Dashboard (/)
- [ ] Dashboard loads without errors
- [ ] Summary cards display correctly
- [ ] Recent expenses show (when data exists)
- [ ] "Add Expense" button works
- [ ] Navigation sidebar works on mobile

#### Add Expense (/add)
- [ ] Form loads correctly
- [ ] Date field defaults to today
- [ ] Amount validation works (positive numbers only)
- [ ] Category dropdown populated
- [ ] Description validation (required, min length)
- [ ] Form submission creates expense
- [ ] Redirects to dashboard after success
- [ ] Error handling works

#### Expenses List (/expenses)
- [ ] Expenses display in reverse chronological order
- [ ] Filters work (date range, category, search)
- [ ] Edit modal opens and works
- [ ] Delete confirmation works
- [ ] CSV export downloads file
- [ ] Pagination/loading works with many expenses

#### Analytics (/analytics)
- [ ] Charts render correctly
- [ ] Bar/pie chart toggle works
- [ ] Summary cards show accurate data
- [ ] Category breakdown is correct
- [ ] Charts are responsive

#### Mobile Testing
- [ ] Sidebar collapses on mobile
- [ ] Forms work on touch devices
- [ ] Charts are readable on small screens
- [ ] All buttons are touch-friendly

## Customization

### Adding New Categories
Edit `src/constants/categories.ts` to add new expense categories:

```typescript
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
  'Your New Category' // Add here
];
```

### Changing Colors
Category colors can be customized in `src/constants/categories.ts`:

```typescript
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10B981',
  Transportation: '#3B82F6',
  // ... modify colors here
};
```

### Database Integration
To replace localStorage with a database:

1. Modify `src/lib/storage.ts`
2. Replace localStorage calls with API calls
3. Add loading states and error handling
4. Consider adding user authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
