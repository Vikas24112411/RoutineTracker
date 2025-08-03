# Routine Tracker

A mobile-first web application for tracking daily routines and habits. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Add Custom Routines**: Create personalized routines like Gym, Drink Water, Study, etc.
- **Calendar View**: Monthly grid calendar for each routine with completion tracking
- **Multiple Routines**: Track multiple routines simultaneously
- **Persistent Storage**: Data persists using localStorage
- **Mobile-First Design**: Optimized for mobile and tablet use
- **Clean UI**: Modern, minimal interface with intuitive touch interactions
- **Edit & Delete**: Full CRUD operations for routines

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TaskManager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

### Creating a Routine
1. Tap the "Add Routine" button on the home screen
2. Enter a name for your routine (required)
3. Add an optional description
4. Choose a color for your routine
5. Tap "Create Routine"

### Tracking Completion
1. Tap on any routine card to open its calendar view
2. Tap on any day in the calendar to mark it as completed
3. Tap again to unmark it
4. Use the arrow buttons to navigate between months
5. Tap "Today" to quickly jump to the current month

### Managing Routines
- **Edit**: Tap the edit icon on any routine card
- **Delete**: Tap the delete icon and confirm the action
- **View Stats**: See completion count and today's status on each card

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **localStorage** for data persistence
- **Custom Hooks** for state management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── RoutineCard.tsx
│   ├── CalendarView.tsx
│   ├── DayCell.tsx
│   └── AddRoutineModal.tsx
├── pages/              # Main application views
│   ├── Home.tsx
│   └── RoutineDetail.tsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── utils/              # Utility functions
│   └── dateUtils.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── styles/             # Custom styles
```

## 🎨 Design Features

- **Mobile-First**: Optimized for touch interactions
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Modern UI**: Clean, minimal design with smooth animations
- **Color Coding**: Each routine has its own color for easy identification

## 🔮 Future Enhancements

- [ ] Cloud sync with Firebase/Supabase
- [ ] Push notifications for reminders
- [ ] Streak tracking and statistics
- [ ] Dark mode support
- [ ] PWA capabilities for app installation
- [ ] Data export/import functionality
- [ ] Advanced analytics and charts

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
