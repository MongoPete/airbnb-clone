# 🏠 Airbnb Clone - Next.js & MongoDB

A modern, full-stack Airbnb clone built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. Features a beautiful, responsive UI with complete booking functionality.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality

- **Property Listings** - Browse and search accommodations
- **Advanced Search** - Filter by location, price, type, and amenities
- **Property Details** - Detailed view with image gallery and amenities
- **Booking System** - Complete reservation flow with date selection
- **Favorites** - Save and manage wishlist properties
- **User Profiles** - User account management and booking history

### 🎨 UI/UX

- **Responsive Design** - Mobile-first approach with perfect desktop experience
- **Modern Interface** - Clean, intuitive design inspired by Airbnb
- **Interactive Components** - Smooth animations and transitions
- **Dark Mode Ready** - CSS variables configured for theme switching
- **Accessibility** - ARIA labels and keyboard navigation support

### 🛠 Technical Features

- **Server-Side Rendering** - Next.js App Router for optimal performance
- **API Routes** - RESTful endpoints for all operations
- **Type Safety** - Full TypeScript implementation
- **Database Integration** - MongoDB with Mongoose ODM
- **Error Handling** - Comprehensive error boundaries and fallbacks
- **Performance Optimized** - Image optimization and code splitting

## 🚀 Tech Stack

### Frontend

- **[Next.js 15.5.4](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend

- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **Next.js API Routes** - Serverless API endpoints

### Development

- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/airbnb-clone.git
cd airbnb-clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your MongoDB credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb-app
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗 Project Structure

```
airbnb-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── properties/    # Property endpoints
│   │   │   ├── bookings/      # Booking endpoints
│   │   │   └── favorites/     # Favorites endpoints
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── PropertyCard.tsx  # Property display
│   │   ├── SearchHeader.tsx  # Search functionality
│   │   ├── BookingModal.tsx  # Booking interface
│   │   └── ...
│   ├── lib/                  # Utilities and config
│   │   ├── mongodb.ts        # Database connection
│   │   ├── models/          # Database models
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
├── _documents/             # Project documentation
└── ...
```

## 🔌 API Endpoints

### Properties

- `GET /api/properties` - Get all properties with filtering
- `POST /api/properties` - Create new property

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

### Favorites

- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Toggle property favorite

## 📱 Components

### Core Components

- **PropertyCard** - Property listing display
- **PropertyDetails** - Detailed property view
- **SearchHeader** - Search and filter interface
- **BookingModal** - Reservation interface
- **BottomNavigation** - Mobile navigation
- **FilterSheet** - Advanced filtering

### UI Components

Complete set of reusable UI components built with Radix UI:

- Buttons, Inputs, Modals, Dropdowns
- Cards, Badges, Tooltips, Sheets
- Navigation, Tabs, Accordions
- And many more...

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables for Production

```bash
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

For detailed deployment instructions, see [\_documents/02-vercel-deployment.md](./_documents/02-vercel-deployment.md)

## 📚 Documentation

Comprehensive documentation available in the `_documents/` folder:

- **[Localhost Setup](./_documents/01-localhost-setup.md)** - Complete development setup
- **[Vercel Deployment](./_documents/02-vercel-deployment.md)** - Production deployment guide
- **[Project Structure](./_documents/03-project-structure.md)** - Architecture overview
- **[Testing Guide](./_documents/04-testing-guide.md)** - Testing procedures
- **[Validation Report](./_documents/05-validation-report.md)** - Feature validation

## 🧪 Testing

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement your changes
3. Test thoroughly
4. Submit pull request

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for the accessible component primitives
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Vercel](https://vercel.com/) for seamless deployment platform

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**
