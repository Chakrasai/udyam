# Udyam Registration Portal

A comprehensive MSME (Micro, Small and Medium Enterprises) registration management system built with React, Node.js, Express, and PostgreSQL. This application provides a digital solution for Udyam registration process with form scraping capabilities, data validation, and registration management.

## 🚀 Features

### Core Functionality
- **Multi-step Registration Form**: Intuitive two-step form for Udyam registration
- **Real-time Validation**: Client-side and server-side validation with pattern matching
- **Form Schema Generation**: Dynamic form generation based on scraped data
- **Data Management**: Complete CRUD operations for registration records
- **Search & Filter**: Advanced filtering by business activity, search by multiple fields
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **Web Scraping**: Automated scraping of Udyam registration form structure
- **Database Integration**: PostgreSQL with Prisma ORM
- **API Documentation**: RESTful API with proper status codes
- **Error Handling**: Comprehensive error handling and user feedback
- **Form State Management**: Multi-step form with validation and progress tracking

## 🛠 Technology Stack

### Frontend
- **React 19.1.1** - User interface framework
- **Vite** - Build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **Prisma 6.14.0** - Database ORM
- **PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing

### Web Scraping
- **Puppeteer** - Headless browser automation
- **Node.js** - Server-side scraping

## 📁 Project Structure

```
udyam/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── index.js                   # Express server
│   ├── package.json               # Backend dependencies
│   └── .env                       # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UdyamRegistrationForm.jsx
│   │   │   └── RegistrationsList.jsx
│   │   ├── App.jsx                # Main application component
│   │   └── App.css                # Styles
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
└── scrapper/
    ├── index.js                   # Web scraping script
    ├── schema.json                # Generated form schema
    └── package.json               # Scraper dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd udyam
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup Database**
```bash
npm run db:generate
npm run db:push
```

4. **Setup Frontend**
```bash
cd ../frontend
npm install
```

5. **Setup Scraper**
```bash
cd ../scrapper
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:5173
```

3. **Run Form Scraper (Optional)**
```bash
cd scrapper
npm start
# Generates updated schema.json
```

## 📊 Database Schema

### UdyamRegistration Model
```prisma
model UdyamRegistration {
  id                 Int      @id @default(autoincrement())
  aadhaarNumber      String   @db.VarChar(12)
  entrepreneurName   String   @db.VarChar(100)
  panNumber          String   @db.VarChar(10)
  enterpriseName     String   @db.VarChar(100)
  constitution       String   @db.VarChar(50)
  majorActivity      String   @db.VarChar(50)
  businessAddress    String
  state              String
  district           String
  pincode            String   @db.VarChar(6)
  investment         Float
  turnover           Float
  createdAt          DateTime @default(now())
}
```

## 🌐 API Endpoints

### Registration Management
- `GET /health` - Health check
- `GET /api/form-schema` - Get form schema
- `POST /api/register` - Submit new registration
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/:id` - Get specific registration

### Request/Response Examples

**POST /api/register**
```json
{
  "aadhaarNumber": "123456789012",
  "entrepreneurName": "John Doe",
  "panNumber": "ABCDE1234F",
  "enterpriseName": "Tech Solutions Pvt Ltd",
  "constitution": "Private Limited",
  "majorActivity": "Service",
  "businessAddress": "123 Tech Park, Bangalore",
  "state": "Karnataka",
  "district": "Bangalore Urban",
  "pincode": "560001",
  "investment": 5000000,
  "turnover": 10000000
}
```

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/udyam_db"
PORT=5000
NODE_ENV=development
```

### Frontend Configuration
- Backend API URL is configured in components (http://localhost:5000)
- Tailwind CSS configuration in `tailwind.config.js`
- Vite configuration in `vite.config.js`

## 🧪 Validation Rules

### Aadhaar Number
- Required field
- Exactly 12 digits
- Pattern: `[0-9]{12}`

### PAN Number
- Required field
- Exactly 10 characters
- Pattern: `[A-Z]{5}[0-9]{4}[A-Z]{1}`

### PIN Code
- Required field
- Exactly 6 digits
- Pattern: `[0-9]{6}`

### Financial Fields
- Investment and Turnover must be positive numbers
- Stored as Float in database

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue-based professional theme
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable form components with validation states

### User Experience
- **Progressive Disclosure**: Two-step form with clear progress indicators
- **Real-time Feedback**: Instant validation with helpful error messages
- **Loading States**: Proper loading indicators for async operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🔍 Form Scraping

The scraper extracts form structure from the official Udyam registration website:

### Features
- **Headless Browser**: Uses Puppeteer for reliable scraping
- **Field Detection**: Automatically identifies form fields and their properties
- **Validation Extraction**: Captures validation rules and patterns
- **Schema Generation**: Creates JSON schema for frontend consumption

### Generated Schema
```json
{
  "step1": [
    {
      "name": "aadhaarNumber",
      "label": "Aadhaar Number",
      "type": "text",
      "required": true,
      "maxLength": 12,
      "pattern": "[0-9]{12}"
    }
  ],
  "step2": [...]
}
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Setup
- Configure production database URL
- Set NODE_ENV=production
- Configure CORS for production domain
- Set up proper logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🔗 Additional Information

### Browser Support
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### Performance Considerations
- Form validation is debounced for better UX
- API responses are cached where appropriate
- Images and assets are optimized

### Security Features
- Input sanitization
- SQL injection prevention via Prisma
- CORS configuration
- Environment variable security

---

**Built with ❤️ for efficient MSME registration management**
