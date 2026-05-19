# Admin Credentials

## Django Admin

- **URL**: http://localhost:8000/admin/
- **Username**: admin
- **Password**: admin123

## Quick Access

Just visit http://localhost:8000/admin/ and login with:
- Username: `admin`
- Password: `admin123`

## Quick Start

1. Activate virtual environment:
   ```bash
   .\venv\Scripts\activate
   ```

2. Set admin password:
   ```bash
   python manage.py changepassword admin
   ```

3. Start the server:
   ```bash
   python manage.py runserver
   ```
   
   Or simply run:
   ```bash
   start.bat
   ```

## API Endpoints

- API Base: http://localhost:8000/api/
- Properties List: http://localhost:8000/api/properties/
- Featured Properties: http://localhost:8000/api/properties/featured/
- For Sale: http://localhost:8000/api/properties/for_sale/
- For Rent: http://localhost:8000/api/properties/for_rent/

## Sample Data

The database has been seeded with 8 sample properties including:
- Luxury Modern Villa (Miami, FL) - $2,500,000
- Downtown Luxury Apartment (New York, NY) - $3,500/month
- Charming Suburban Home (Austin, TX) - $650,000
- Modern Condo with City Views (Seattle, WA) - $450,000
- Cozy Studio Apartment (Boston, MA) - $1,200/month
- Spacious Townhouse (San Francisco, CA) - $725,000
- Prime Commercial Space (Chicago, IL) - $8,500/month
- Waterfront Estate (Lake Tahoe, CA) - $4,200,000
