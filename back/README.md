# Real Estate Backend API

Django REST API for a real estate application.

## Features

- Property listing with full CRUD operations
- Property filtering by type, status, location, bedrooms, bathrooms
- Search functionality across title, description, and location
- Image upload support for properties
- Featured properties endpoint
- Separate endpoints for properties for sale and rent
- Django admin interface for easy management

## Tech Stack

- Django 6.0.5
- Django REST Framework 3.17.1
- Django CORS Headers (for frontend integration)
- Django Filter (for advanced filtering)
- Pillow (for image handling)
- SQLite (default database)

## Setup Instructions

### 1. Create and activate virtual environment

```bash
python -m venv venv

# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 4. Run migrations

```bash
python manage.py migrate
```

### 5. Create a superuser (for admin access)

```bash
python manage.py createsuperuser
```

### 6. Run the development server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Properties

- `GET /api/properties/` - List all properties (with pagination)
- `GET /api/properties/{id}/` - Get property details
- `POST /api/properties/` - Create a new property
- `PUT /api/properties/{id}/` - Update a property
- `PATCH /api/properties/{id}/` - Partial update
- `DELETE /api/properties/{id}/` - Delete a property

### Special Endpoints

- `GET /api/properties/featured/` - Get featured properties
- `GET /api/properties/for_sale/` - Get properties for sale
- `GET /api/properties/for_rent/` - Get properties for rent

### Filtering

You can filter properties using query parameters:

```
/api/properties/?property_type=house
/api/properties/?status=sale
/api/properties/?city=New York
/api/properties/?bedrooms=3
/api/properties/?bathrooms=2
```

### Search

```
/api/properties/?search=luxury apartment
```

### Ordering

```
/api/properties/?ordering=price
/api/properties/?ordering=-price (descending)
/api/properties/?ordering=created_at
```

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/`

Use the superuser credentials you created to log in.

## Project Structure

```
back/
├── config/              # Project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── properties/          # Properties app
│   ├── models.py       # Property and PropertyImage models
│   ├── serializers.py  # DRF serializers
│   ├── views.py        # API views
│   ├── urls.py         # App URLs
│   └── admin.py        # Admin configuration
├── media/              # Uploaded images
├── manage.py
├── requirements.txt
└── .env
```

## Models

### Property

- Basic info: title, description, property_type, status, price
- Location: address, city, state, zip_code, country
- Details: bedrooms, bathrooms, square_feet, lot_size, year_built
- Features: parking_spaces, has_garage, has_pool, has_garden
- Metadata: featured, created_at, updated_at

### PropertyImage

- Links to Property
- Image file
- Caption
- is_primary flag
- created_at timestamp

## Development

To add sample data, you can use the Django admin interface or create a management command.

## Next Steps

- Add user authentication
- Add property favorites/bookmarks
- Add contact/inquiry system
- Add property comparison feature
- Add map integration
- Add advanced search filters (price range, etc.)
