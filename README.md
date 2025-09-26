# 🏠 Airbnb Clone - Next.js & MongoDB Atlas

A modern, full-stack Airbnb clone built with Next.js 15, TypeScript, MongoDB Atlas, and Tailwind CSS. Features real Airbnb data from MongoDB's sample dataset with 5,555+ authentic property listings.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Sample_Data-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

## 🚀 Quick Start

**Live Demo**: [https://airbnb-clone-mongopete.vercel.app](https://airbnb-clone-mongopete.vercel.app)

```bash
# Clone and run locally
git clone https://github.com/MongoPete/airbnb-clone.git
cd airbnb-clone
npm install
cp .env.example .env.local
# Add your MongoDB Atlas URI to .env.local
npm run dev
```

## ✨ Features

### 🎯 Core Functionality

- **Real Property Data** - 5,555+ authentic Airbnb listings from MongoDB sample dataset
- **Property Listings** - Browse properties from around the world (Porto, Sydney, New York, etc.)
- **Advanced Search** - Filter by location, price, property type, and amenities
- **Property Details** - Detailed view with real reviews, amenities, and host information
- **Booking System** - Complete reservation flow with price calculations
- **Favorites** - Save and manage wishlist properties
- **CRUD Operations** - Full property management capabilities

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

- **[MongoDB Atlas](https://www.mongodb.com/atlas)** - Cloud-hosted MongoDB with sample_airbnb dataset
- **MongoDB Native Driver** - Direct MongoDB connection for optimal performance
- **Next.js API Routes** - Serverless API endpoints for properties, bookings, and favorites

### Development

- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- MongoDB Atlas account (using sample_airbnb database)

### 1. Clone the repository

```bash
git clone https://github.com/MongoPete/airbnb-clone.git
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

# Edit .env.local with your MongoDB Atlas credentials
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sample_airbnb
```

**Note**: This project uses MongoDB's `sample_airbnb` database which contains 5,555+ real Airbnb listings. Make sure your Atlas cluster has the sample datasets loaded.

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

- `GET /api/properties` - Get properties with search, filtering, and pagination
  - Query params: `search`, `location`, `priceMin`, `priceMax`, `type`, `limit`, `offset`
- `POST /api/properties` - Create new property
- `DELETE /api/properties?id=<propertyId>` - Delete property

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking

### Favorites

- `GET /api/favorites` - Get user favorites  
- `POST /api/favorites` - Toggle property favorite status

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
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sample_airbnb
```

**Live Demo**: [https://airbnb-clone-mongopete.vercel.app](https://airbnb-clone-mongopete.vercel.app)

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

## 📊 Data Source

This project uses MongoDB Atlas's `sample_airbnb` database, which contains:

- **5,555+ real Airbnb listings** from around the world
- **Authentic property data** including prices, reviews, amenities, and host information
- **Geographic diversity** with properties from Porto, Sydney, New York, Barcelona, and more
- **Rich metadata** including property types, room types, and detailed descriptions

## 🚀 Live Demo

**Production URL**: [https://airbnb-clone-mongopete.vercel.app](https://airbnb-clone-mongopete.vercel.app)

Try searching for:
- **Porto** - Historic Portuguese properties
- **Sydney** - Australian listings
- **New York** - Urban accommodations
- **Barcelona** - Mediterranean properties

## 📞 Support

For support, create an issue in this repository or reach out via GitHub.

---

**Built with ❤️ using Next.js 15, TypeScript, and MongoDB Atlas**
