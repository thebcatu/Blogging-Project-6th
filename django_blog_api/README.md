# NepalBlog API - Advanced Django REST Blog Platform

A full-featured blogging platform API built with Django REST Framework, featuring comprehensive role-based authentication, authorization, and a rich set of blog management features with Nepal-focused content.

## Created By

**Mahendra Mahara**
- GitHub: [github.com/mahendramahara](https://github.com/mahendramahara)
- Repository: [github.com/thebcatu](https://github.com/thebcatu)

## Features

- 🔐 JWT-based Authentication System
- 👤 Role-based Authorization (Visitor, Writer, Admin)
- 📝 Comprehensive Blog Management
- 🏷️ Categories and Tags
- 💬 Nested Comment System
- ❤️ Reactions and Ratings
- 🔖 Bookmark System
- 📊 User Analytics and Dashboards
- 🧠 Blog Recommendation Engine

## Setup Instructions

### Prerequisites
- Python 3.8+
- MySQL Server
- pip (Python package manager)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebcatu/Blogging-Project-6th.git
   cd Blogging-Project-6th/django_blog_api
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure MySQL Database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE django_blog_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   
   Update the database configuration in `blog_project/settings.py` if needed:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',     
           'NAME': 'django_blog_api',         
           'USER': 'your_mysql_username',        
           'PASSWORD': 'your_mysql_password',    
           'HOST': '127.0.0.1',                  
           'PORT': '3306',                        
           'OPTIONS': {
               'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
           }
       }
   }
   ```

5. **Configure Email Settings**
   
   Update the email configuration in `blog_project/settings.py`:
   ```python
   EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
   EMAIL_HOST = 'your_smtp_server'
   EMAIL_PORT = 587
   EMAIL_USE_TLS = True
   EMAIL_HOST_USER = 'your_email@example.com'
   EMAIL_HOST_PASSWORD = 'your_email_password'
   DEFAULT_FROM_EMAIL = 'NepalBlog <noreply@nepalblog.com>'
   ```

6. **Apply database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```
   Example inputs:
   ```
   Username: mahendra_mahara
   Email: mahendra.mahara@example.com
   Password: (your secure password)
   ```

8. **Create media and static directories**
   ```bash
   mkdir -p media/blog_images media/profile_pictures
   mkdir -p static/css static/js
   ```

9. **Run the development server**
   ```bash
   python manage.py runserver
   ```

10. **Access the API**
   - API Root: http://127.0.0.1:8000/api/
   - API Documentation: http://127.0.0.1:8000/swagger/
   - Admin interface: http://127.0.0.1:8000/admin/

## API Documentation

### Authentication Endpoints

#### Register a User
**Endpoint:** `POST /api/auth/register/`

**Request:**
```json
{
  "username": "pramod_joshi",
  "email": "pramod.joshi@example.com",
  "password": "SecurePass123!",
  "confirm_password": "SecurePass123!",
  "first_name": "Pramod",
  "middle_name": "Kumar",
  "last_name": "Joshi",
  "role": "visitor"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully. Check your email to activate your account.",
  "user_id": 12
}
```

#### Login
**Endpoint:** `POST /api/auth/token/`

**Request:**
```json
{
  "username": "pramod_joshi",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 12,
  "username": "pramod_joshi"
}
```

#### Verify Email
**Endpoint:** `GET /api/auth/verify-email/{uidb64}/{token}/`

#### Request Password Reset
**Endpoint:** `POST /api/auth/password-reset/`

**Request:**
```json
{
  "email": "pramod.joshi@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset instructions sent to your email"
}
```

#### Confirm Password Reset
**Endpoint:** `POST /api/auth/password-reset/confirm/`

**Request:**
```json
{
  "uidb64": "MTA",
  "token": "bmw3n4-8a9c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
  "password": "NewSecurePass456!",
  "confirm_password": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

### User Endpoints

#### Get Current User Profile
**Endpoint:** `GET /api/users/me/`

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "mahendra_mahara",
  "email": "mahendra.mahara@example.com",
  "first_name": "Mahendra",
  "middle_name": "",
  "last_name": "Mahara",
  "profile_picture": "https://api.example.com/media/profile_pictures/mahendra_profile.jpg",
  "bio": "Full Stack Developer and Blogger from Kathmandu, Nepal. Passionate about technology and Nepali culture.",
  "is_writer": true,
  "is_admin_user": true
}
```

#### List All Writers
**Endpoint:** `GET /api/users/writers/`

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "mahendra_mahara",
      "first_name": "Mahendra",
      "last_name": "Mahara",
      "profile_picture": "https://api.example.com/media/profile_pictures/mahendra_profile.jpg",
      "bio": "Full Stack Developer and Blogger from Kathmandu, Nepal."
    },
    {
      "id": 5,
      "username": "aarati_sharma",
      "first_name": "Aarati",
      "last_name": "Sharma",
      "profile_picture": "https://api.example.com/media/profile_pictures/aarati_profile.jpg", 
      "bio": "Travel writer exploring the hidden gems of Nepal."
    }
  ]
}
```

### Blog Endpoints

#### List All Blogs
**Endpoint:** `GET /api/blogs/`

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "https://api.example.com/api/blogs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 42,
      "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
      "slug": "ancient-city-bhaktapur-nepals-living-heritage-a7b3e9f4",
      "content": "Bhaktapur, also known as Bhadgaon, stands as one of the best-preserved ancient cities in Nepal...",
      "image": "https://api.example.com/media/blog_images/bhaktapur_durbar_square.jpg",
      "tags": "heritage, nepal, bhaktapur, newari, architecture",
      "author": 1,
      "author_details": {
        "id": 1,
        "username": "mahendra_mahara",
        "first_name": "Mahendra",
        "last_name": "Mahara"
      },
      "category": 2,
      "created_at": "2025-04-05T08:24:12Z",
      "view_count": 1245,
      "reaction_count": 87,
      "comment_count": 23,
      "average_rating": 4.7,
      "rating_count": 34
    },
    {
      "id": 41,
      "title": "Momo Recipes: Nepal's Beloved Dumplings",
      "slug": "momo-recipes-nepals-beloved-dumplings-b8c7d6e5",
      "content": "Momos are undoubtedly Nepal's most famous culinary export...",
      "image": "https://api.example.com/media/blog_images/nepali_momo.jpg",
      "tags": "food, recipe, nepal, momo, dumplings",
      "author": 5,
      "author_details": {
        "id": 5,
        "username": "aarati_sharma",
        "first_name": "Aarati",
        "last_name": "Sharma"
      },
      "category": 4,
      "created_at": "2025-04-03T14:39:27Z",
      "view_count": 956,
      "reaction_count": 64,
      "comment_count": 19,
      "average_rating": 4.5,
      "rating_count": 28
    }
  ]
}
```

#### Get Blog Detail
**Endpoint:** `GET /api/blogs/42/`

**Response (200 OK):**
```json
{
  "id": 42,
  "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
  "slug": "ancient-city-bhaktapur-nepals-living-heritage-a7b3e9f4",
  "content": "Bhaktapur, also known as Bhadgaon, stands as one of the best-preserved ancient cities in Nepal. Founded in the 12th century by King Ananda Malla, this UNESCO World Heritage site showcases some of the finest medieval art and architecture in the Kathmandu Valley...",
  "content_html": "<p>Bhaktapur, also known as Bhadgaon, stands as one of the best-preserved ancient cities in Nepal. Founded in the 12th century by King Ananda Malla, this UNESCO World Heritage site showcases some of the finest medieval art and architecture in the Kathmandu Valley...</p>",
  "image": "https://api.example.com/media/blog_images/bhaktapur_durbar_square.jpg",
  "file": "https://api.example.com/media/blog_files/bhaktapur_visitor_guide.pdf",
  "tags": "heritage, nepal, bhaktapur, newari, architecture",
  "author": 1,
  "author_details": {
    "id": 1,
    "username": "mahendra_mahara",
    "first_name": "Mahendra",
    "last_name": "Mahara",
    "profile_picture": "https://api.example.com/media/profile_pictures/mahendra_profile.jpg"
  },
  "category": 2,
  "created_at": "2025-04-05T08:24:12Z",
  "updated_at": "2025-04-07T10:15:23Z",
  "published": true,
  "view_count": 1246,
  "reaction_count": 87,
  "comment_count": 23,
  "average_rating": 4.7,
  "rating_count": 34,
  "comments": [
    {
      "id": 105,
      "user": 12,
      "user_details": {
        "id": 12,
        "username": "pramod_joshi",
        "first_name": "Pramod"
      },
      "content": "I visited Bhaktapur last month and was amazed by the wood carvings on the temples. The pottery square was also fascinating!",
      "created_at": "2025-04-06T15:42:18Z",
      "replies": [
        {
          "id": 108,
          "user": 1,
          "user_details": {
            "id": 1,
            "username": "mahendra_mahara",
            "first_name": "Mahendra"
          },
          "content": "Glad you enjoyed it! Did you try the local specialty, Ju Ju Dhau (King Yogurt)?",
          "created_at": "2025-04-06T16:12:33Z"
        }
      ]
    }
  ],
  "reactions": [
    {
      "id": 284,
      "user": 12,
      "user_details": {
        "id": 12,
        "username": "pramod_joshi"
      },
      "reaction_type": "love"
    }
  ]
}
```

#### Create Blog
**Endpoint:** `POST /api/blogs/`

**Request:**
```json
{
  "title": "The Sacred Peaks of Khumbu: Everest Region Guide",
  "content": "The Khumbu region, home to Mount Everest (Sagarmatha), is a sacred landscape for the Sherpa people and a dream destination for mountaineers and trekkers worldwide...",
  "image": [file upload],
  "tags": "mountains, everest, nepal, trekking, sherpa, khumbu",
  "category": 5
}
```

**Response (201 Created):**
```json
{
  "id": 43,
  "title": "The Sacred Peaks of Khumbu: Everest Region Guide",
  "slug": "sacred-peaks-khumbu-everest-region-guide-f9e8d7c6",
  "content": "The Khumbu region, home to Mount Everest (Sagarmatha), is a sacred landscape for the Sherpa people and a dream destination for mountaineers and trekkers worldwide...",
  "image": "https://api.example.com/media/blog_images/everest_region.jpg",
  "tags": "mountains, everest, nepal, trekking, sherpa, khumbu",
  "author": 1,
  "author_details": {
    "id": 1,
    "username": "mahendra_mahara",
    "first_name": "Mahendra",
    "last_name": "Mahara"
  },
  "category": 5,
  "created_at": "2025-04-07T13:28:16Z",
  "view_count": 0,
  "reaction_count": 0,
  "comment_count": 0,
  "average_rating": 0,
  "rating_count": 0
}
```

#### Rate Blog
**Endpoint:** `POST /api/blogs/42/rate/`

**Request:**
```json
{
  "score": 5
}
```

**Response (200 OK):**
```json
{
  "rating": 5
}
```

### Category Endpoints

#### List All Categories
**Endpoint:** `GET /api/categories/`

**Response (200 OK):**
```json
{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Technology in Nepal",
      "image": "https://api.example.com/media/category_images/tech_nepal.jpg",
      "blog_count": 15
    },
    {
      "id": 2,
      "name": "Culture & Heritage",
      "image": "https://api.example.com/media/category_images/culture.jpg",
      "blog_count": 28
    },
    {
      "id": 3,
      "name": "Travel Nepal",
      "image": "https://api.example.com/media/category_images/travel.jpg",
      "blog_count": 42
    },
    {
      "id": 4,
      "name": "Nepali Cuisine",
      "image": "https://api.example.com/media/category_images/food.jpg",
      "blog_count": 19
    },
    {
      "id": 5,
      "name": "Mountain Expeditions",
      "image": "https://api.example.com/media/category_images/mountains.jpg",
      "blog_count": 24
    },
    {
      "id": 6,
      "name": "Nepal Politics",
      "image": "https://api.example.com/media/category_images/politics.jpg",
      "blog_count": 17
    }
  ]
}
```

### Comment Endpoints

#### Create Comment
**Endpoint:** `POST /api/comments/`

**Request:**
```json
{
  "blog": 42,
  "content": "The woodwork in Bhaktapur's temples is extraordinary. I especially loved the Nyatapola Temple with its five-story pagoda.",
  "parent": null
}
```

**Response (201 Created):**
```json
{
  "id": 112,
  "blog": 42,
  "user": 12,
  "user_details": {
    "id": 12,
    "username": "pramod_joshi",
    "first_name": "Pramod",
    "last_name": "Joshi"
  },
  "parent": null,
  "content": "The woodwork in Bhaktapur's temples is extraordinary. I especially loved the Nyatapola Temple with its five-story pagoda.",
  "created_at": "2025-04-07T14:23:45Z",
  "replies": []
}
```

### Reaction Endpoints

#### Create Reaction
**Endpoint:** `POST /api/reactions/`

**Request:**
```json
{
  "blog": 42,
  "reaction_type": "love"
}
```

**Response (201 Created):**
```json
{
  "id": 295,
  "blog": 42,
  "user": 12,
  "user_details": {
    "id": 12,
    "username": "pramod_joshi",
    "first_name": "Pramod",
    "last_name": "Joshi"
  },
  "reaction_type": "love"
}
```

### Bookmark Endpoints

#### Toggle Bookmark
**Endpoint:** `POST /api/bookmarks/`

**Request:**
```json
{
  "blog_id": 42,
  "notes": "Must visit Bhaktapur on my next trip to Kathmandu"
}
```

**Response (201 Created):**
```json
{
  "id": 67,
  "user": 12,
  "blog": 42,
  "blog_details": {
    "id": 42,
    "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
    "author_details": {
      "id": 1,
      "username": "mahendra_mahara",
      "first_name": "Mahendra",
      "last_name": "Mahara"
    },
    "image": "https://api.example.com/media/blog_images/bhaktapur_durbar_square.jpg"
  },
  "created_at": "2025-04-07T14:42:38Z",
  "notes": "Must visit Bhaktapur on my next trip to Kathmandu"
}
```

### Dashboard Endpoints

#### Writer Dashboard
**Endpoint:** `GET /api/dashboard/writer/`

**Response (200 OK):**
```json{
  "total_blogs": 12,
  "total_views": 15863,
  "total_reactions": 743,
  "total_comments": 283,
  "recent_activity": [
    {
      "action_type": "comment",
      "timestamp": "2025-04-07T13:42:18Z",
      "user": "pramod_joshi",
      "details": {
        "comment_id": 112
      }
    },
    {
      "action_type": "reaction",
      "timestamp": "2025-04-07T12:37:45Z",
      "user": "sita_karki",
      "details": {
        "reaction_type": "like"
      }
    }
  ]
}
```

#### Admin Dashboard
**Endpoint:** `GET /api/dashboard/admin/`

**Response (200 OK):**
```json
{
  "total_users": 845,
  "active_users": 312,
  "total_blogs": 247,
  "total_comments": 3741,
  "total_reactions": 8645,
  "recent_blogs": [
    {
      "id": 43,
      "title": "The Sacred Peaks of Khumbu: Everest Region Guide",
      "author": "mahendra_mahara",
      "created_at": "2025-04-07T13:28:16Z",
      "view_count": 87
    },
    {
      "id": 42,
      "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
      "author": "mahendra_mahara",
      "created_at": "2025-04-05T08:24:12Z",
      "view_count": 1246
    }
  ],
  "top_authors": [
    {
      "id": 1,
      "username": "mahendra_mahara",
      "blog_count": 35,
      "total_views": 58746
    },
    {
      "id": 5,
      "username": "aarati_sharma",
      "blog_count": 28,
      "total_views": 42187
    },
    {
      "id": 15,
      "username": "rajesh_hamal",
      "blog_count": 21,
      "total_views": 37421
    }
  ]
}
```

### Blog Recommendations and Tags

#### Get Recommended Blogs
**Endpoint:** `GET /api/blogs/recommended/`

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 35,
      "title": "Trekking to Annapurna Base Camp: A Complete Guide",
      "slug": "trekking-annapurna-base-camp-guide-f5e4d3c2",
      "content": "The Annapurna Base Camp trek offers one of the most spectacular mountain scenery views...",
      "image": "https://api.example.com/media/blog_images/annapurna_trek.jpg",
      "tags": "travel, trekking, nepal, annapurna, himalayas",
      "author": 5,
      "author_details": {
        "id": 5,
        "username": "aarati_sharma",
        "first_name": "Aarati",
        "last_name": "Sharma"
      },
      "category": 3,
      "created_at": "2025-03-15T09:17:43Z",
      "view_count": 2478,
      "reaction_count": 164,
      "comment_count": 57,
      "average_rating": 4.9,
      "rating_count": 83
    }
  ]
}
```

#### Get Popular Tags
**Endpoint:** `GET /api/blogs/tags/`

**Response (200 OK):**
```json
[
  {
    "tag": "nepal",
    "count": 247
  },
  {
    "tag": "kathmandu",
    "count": 126
  },
  {
    "tag": "travel",
    "count": 118
  },
  {
    "tag": "himalayas",
    "count": 94
  },
  {
    "tag": "trekking",
    "count": 87
  },
  {
    "tag": "food",
    "count": 76
  },
  {
    "tag": "culture",
    "count": 72
  },
  {
    "tag": "heritage",
    "count": 65
  }
]
```

### User's Blog Interactions

#### Get User's Bookmarks
**Endpoint:** `GET /api/bookmarks/`

**Response (200 OK):**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 67,
      "user": 12,
      "blog": 42,
      "blog_details": {
        "id": 42,
        "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
        "slug": "ancient-city-bhaktapur-nepals-living-heritage-a7b3e9f4",
        "image": "https://api.example.com/media/blog_images/bhaktapur_durbar_square.jpg",
        "author_details": {
          "id": 1,
          "username": "mahendra_mahara",
          "first_name": "Mahendra",
          "last_name": "Mahara"
        },
        "created_at": "2025-04-05T08:24:12Z"
      },
      "created_at": "2025-04-07T14:42:38Z",
      "notes": "Must visit Bhaktapur on my next trip to Kathmandu"
    },
    {
      "id": 58,
      "user": 12,
      "blog": 35,
      "blog_details": {
        "id": 35,
        "title": "Trekking to Annapurna Base Camp: A Complete Guide",
        "slug": "trekking-annapurna-base-camp-guide-f5e4d3c2",
        "image": "https://api.example.com/media/blog_images/annapurna_trek.jpg",
        "author_details": {
          "id": 5,
          "username": "aarati_sharma",
          "first_name": "Aarati",
          "last_name": "Sharma"
        },
        "created_at": "2025-03-15T09:17:43Z"
      },
      "created_at": "2025-04-01T11:23:15Z",
      "notes": "Need to read before planning my trek"
    }
  ]
}
```

#### Get User's Rated Blogs
**Endpoint:** `GET /api/blogs/rated/`

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 42,
      "title": "The Ancient City of Bhaktapur: Nepal's Living Heritage",
      "slug": "ancient-city-bhaktapur-nepals-living-heritage-a7b3e9f4",
      "image": "https://api.example.com/media/blog_images/bhaktapur_durbar_square.jpg",
      "author_details": {
        "id": 1,
        "username": "mahendra_mahara",
        "first_name": "Mahendra",
        "last_name": "Mahara"
      },
      "category": 2,
      "created_at": "2025-04-05T08:24:12Z",
      "average_rating": 4.7,
      "user_rating": 5
    },
    {
      "id": 35,
      "title": "Trekking to Annapurna Base Camp: A Complete Guide",
      "slug": "trekking-annapurna-base-camp-guide-f5e4d3c2",
      "image": "https://api.example.com/media/blog_images/annapurna_trek.jpg",
      "author_details": {
        "id": 5,
        "username": "aarati_sharma",
        "first_name": "Aarati",
        "last_name": "Sharma"
      },
      "category": 3,
      "created_at": "2025-03-15T09:17:43Z",
      "average_rating": 4.9,
      "user_rating": 5
    }
  ]
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "status": "error",
  "code": "validation_error",
  "message": "Validation error",
  "errors": {
    "title": "This field is required."
  }
}
```

Common error codes include:
- `authentication_failed`: Invalid credentials
- `permission_denied`: User doesn't have access
- `validation_error`: Invalid input data
- `not_found`: Requested resource doesn't exist
- `server_error`: Unexpected server error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Anonymous users: 100 requests per day
- Authenticated users: 1000 requests per day

When rate limit is exceeded, the API returns a 429 Too Many Requests response.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.