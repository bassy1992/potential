# Real Estate Platform 🏠

A full-stack real estate property management platform with Django REST API backend and React frontend.

## 🌟 Features

### Backend (Django)
- ✅ RESTful API with Django REST Framework
- ✅ Property management with full CRUD operations
- ✅ Image upload support for properties
- ✅ Google Maps integration with GPS coordinates
- ✅ Advanced filtering and search
- ✅ Pagination support
- ✅ Beautiful Jazzmin admin interface
- ✅ CORS enabled for frontend integration

### Frontend (React + Vite)
- ✅ Modern React with TypeScript
- ✅ Responsive design with Tailwind CSS
- ✅ Property listing with filters
- ✅ Featured properties section
- ✅ Google Maps integration
- ✅ React Query for data fetching
- ✅ Beautiful UI with shadcn/ui components

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or pnpm

### Backend Setup

```bash
cd back

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed sample data
python manage.py seed_properties

# Run server
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### Frontend Setup

```bash
cd front

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:8080

## 📚 API Endpoints

### Properties
- `GET /api/properties/` - List all properties
- `GET /api/properties/{id}/` - Get property details
- `POST /api/properties/` - Create property
- `PUT /api/properties/{id}/` - Update property
- `DELETE /api/properties/{id}/` - Delete property

### Special Endpoints
- `GET /api/properties/featured/` - Get featured properties
- `GET /api/properties/for_sale/` - Get properties for sale
- `GET /api/properties/for_rent/` - Get properties for rent

### Filtering
```
/api/properties/?property_type=house
/api/properties/?status=sale
/api/properties/?city=Miami
/api/properties/?bedrooms=3
/api/properties/?search=luxury
/api/properties/?ordering=price
```

## 🗺️ Google Maps Integration

Each property can have GPS coordinates:
- Add latitude and longitude in Django admin
- "View on Map" button appears on frontend
- Click to open location in Google Maps

## 🎨 Admin Interface

Access the beautiful Jazzmin admin at: http://localhost:8000/admin/

Default credentials:
- Username: `admin`
- Password: `admin123`

Features:
- Modern, responsive design
- Property management with inline images
- Google Maps integration
- Bulk actions
- Advanced filtering

## 🏗️ Tech Stack

### Backend
- Django 6.0.5
- Django REST Framework 3.17.1
- Django CORS Headers
- Django Filter
- Django Jazzmin (Admin UI)
- Pillow (Image processing)
- Python Decouple (Environment variables)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query (TanStack Query)
- React Router
- shadcn/ui components
- Lucide React (Icons)

## 📁 Project Structure

```
potential-real-estate/
├── back/                    # Django backend
│   ├── config/             # Django settings
│   ├── properties/         # Properties app
│   │   ├── models.py      # Property & PropertyImage models
│   │   ├── serializers.py # DRF serializers
│   │   ├── views.py       # API views
│   │   └── admin.py       # Admin configuration
│   ├── manage.py
│   ├── requirements.txt
│   └── .env
│
├── front/                   # React frontend
│   ├── client/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & API
│   │   └── hooks/         # Custom hooks
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 📊 Sample Data

The project includes 8 sample properties:
- Luxury Modern Villa (Miami, FL)
- Downtown Luxury Apartment (New York, NY)
- Charming Suburban Home (Austin, TX)
- Modern Condo (Seattle, WA)
- Cozy Studio Apartment (Boston, MA)
- Spacious Townhouse (San Francisco, CA)
- Prime Commercial Space (Chicago, IL)
- Waterfront Estate (Lake Tahoe, CA)

## 🎯 Features in Detail

### Property Management
- Multiple property types (house, apartment, condo, townhouse, land, commercial)
- Status tracking (for sale, for rent, sold, rented)
- Detailed property information (bedrooms, bathrooms, square feet, etc.)
- Multiple images per property
- Featured properties
- GPS coordinates for map integration

### Filtering & Search
- Filter by property type
- Filter by status
- Filter by location
- Search by title, description, address
- Sort by price, date, size

### API Features
- Pagination
- CORS enabled
- RESTful design
- Comprehensive documentation
- Error handling

## 🚀 Deployment

### Backend (Django)
1. Set `DEBUG=False`
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure ALLOWED_HOSTS
5. Use gunicorn or uwsgi
6. Set up SSL certificate

### Frontend (React)
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or any static host
3. Update API URL in environment variables

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🎉 Acknowledgments

- Django REST Framework
- React
- Tailwind CSS
- shadcn/ui
- Jazzmin
- All open source contributors

---

Built with ❤️ for real estate professionals
