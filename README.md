# NepalBlog API Documentation 

A comprehensive guide to all API endpoints available in the NepalBlog platform, complete with request and response examples.

## 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/api/auth/register/` | Register a new user |
| `POST` | `/api/auth/token/` | Obtain access and refresh tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh token |
| `POST` | `/api/auth/token/verify/` | Verify token |
| `GET` | `/api/auth/verify-email/{uidb64}/{token}/` | Verify email |
| `POST` | `/api/auth/resend-verification/` | Resend verification email |
| `POST` | `/api/auth/login-after-verification/` | Login after email verification |
| `POST` | `/api/auth/password-reset/` | Request password reset |
| `POST` | `/api/auth/password-reset/confirm/` | Confirm password reset |

### Examples

#### Register a User

**Request:**
```http
POST /api/auth/register/
Content-Type: application/json

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

#### Login (Get Token)

**Request:**
```http
POST /api/auth/token/
Content-Type: application/json

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

## 👤 User Management Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/users/` | List all users |
| `POST` | `/api/users/` | Create a new user (admin only) |
| `GET` | `/api/users/me/` | Get current user profile |
| `GET` | `/api/users/writers/` | List all content writers |
| `GET` | `/api/users/{id}/` | Get user details by ID |
| `PUT` | `/api/users/{id}/` | Update user (owner or admin) |
| `PATCH` | `/api/users/{id}/` | Partially update user |
| `DELETE` | `/api/users/{id}/` | Delete user (admin only) |

### Examples

#### Get Current User Profile

**Request:**
```http
GET /api/users/me/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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

## 📝 Blog Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/blogs/` | List all blogs |
| `POST` | `/api/blogs/` | Create new blog |
| `GET` | `/api/blogs/recommended/` | Get recommended blogs |
| `GET` | `/api/blogs/trending/` | Get trending blogs |
| `GET` | `/api/blogs/tags/` | Get popular tags |
| `GET` | `/api/blogs/my_blogs/` | Get blogs authored by current user |
| `GET` | `/api/blogs/rated/` | Get blogs rated by current user |
| `GET` | `/api/blogs/{id}/` | Get blog by ID |
| `PUT` | `/api/blogs/{id}/` | Update blog |
| `PATCH` | `/api/blogs/{id}/` | Partially update blog |
| `DELETE` | `/api/blogs/{id}/` | Delete blog |
| `POST` | `/api/blogs/{id}/rate/` | Rate a blog |

### Examples

#### List All Blogs

**Request:**
```http
GET /api/blogs/?category=2&tag=heritage&page=1
```

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "https://api.example.com/api/blogs/?category=2&tag=heritage&page=2",
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
      "created_at": "2023-04-05T08:24:12Z",
      "view_count": 1245,
      "reaction_count": 87,
      "comment_count": 23,
      "average_rating": 4.7,
      "rating_count": 34
    }
  ]
}
```

#### Create a New Blog

**Request:**
```http
POST /api/blogs/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "The Sacred Peaks of Khumbu: Everest Region Guide",
  "content": "The Khumbu region, home to Mount Everest (Sagarmatha), is a sacred landscape for the Sherpa people and a dream destination for mountaineers and trekkers worldwide...",
  "tags": "mountains, everest, nepal, trekking, sherpa, khumbu",
  "category": 5,
  "published": true
}
```

**Response (201 Created):**
```json
{
  "id": 43,
  "title": "The Sacred Peaks of Khumbu: Everest Region Guide",
  "slug": "sacred-peaks-khumbu-everest-region-guide-f9e8d7c6",
  "content": "The Khumbu region, home to Mount Everest (Sagarmatha), is a sacred landscape for the Sherpa people and a dream destination for mountaineers and trekkers worldwide...",
  "image": null,
  "tags": "mountains, everest, nepal, trekking, sherpa, khumbu",
  "author": 1,
  "author_details": {
    "id": 1,
    "username": "mahendra_mahara",
    "first_name": "Mahendra",
    "last_name": "Mahara"
  },
  "category": 5,
  "created_at": "2023-04-07T13:28:16Z",
  "view_count": 0,
  "reaction_count": 0,
  "comment_count": 0,
  "average_rating": 0,
  "rating_count": 0
}
```

#### Get Popular Tags

**Request:**
```http
GET /api/blogs/tags/
```

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
  }
]
```

## 🏷️ Category Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/categories/` | List all categories |
| `POST` | `/api/categories/` | Create category (admin only) |
| `GET` | `/api/categories/{id}/` | Get category by ID |
| `PUT` | `/api/categories/{id}/` | Update category (admin only) |
| `PATCH` | `/api/categories/{id}/` | Partially update category |
| `DELETE` | `/api/categories/{id}/` | Delete category (admin only) |

### Examples

#### List Categories

**Request:**
```http
GET /api/categories/
```

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
    }
  ]
}
```

## 💬 Comment Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/comments/` | List all comments |
| `POST` | `/api/comments/` | Create a new comment |
| `GET` | `/api/comments/{id}/` | Get comment by ID |
| `PUT` | `/api/comments/{id}/` | Update comment (owner only) |
| `PATCH` | `/api/comments/{id}/` | Partially update comment |
| `DELETE` | `/api/comments/{id}/` | Delete comment (owner or admin) |

### Examples

#### Create Comment

**Request:**
```http
POST /api/comments/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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
  "created_at": "2023-04-07T14:23:45Z",
  "replies": []
}
```

## ❤️ Reaction Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/reactions/` | List all reactions |
| `POST` | `/api/reactions/` | Create a reaction |
| `GET` | `/api/reactions/{id}/` | Get reaction by ID |
| `PUT` | `/api/reactions/{id}/` | Update reaction (owner only) |
| `DELETE` | `/api/reactions/{id}/` | Delete reaction (owner only) |

### Examples

#### Create Reaction

**Request:**
```http
POST /api/reactions/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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

## 🔖 Bookmark Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/bookmarks/` | List user's bookmarks |
| `POST` | `/api/bookmarks/` | Toggle bookmark for a blog |
| `GET` | `/api/bookmarks/{id}/` | Get bookmark details |
| `PUT` | `/api/bookmarks/{id}/` | Update bookmark (owner only) |
| `DELETE` | `/api/bookmarks/{id}/` | Delete bookmark (owner only) |

### Examples

#### Toggle Bookmark

**Request:**
```http
POST /api/bookmarks/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "blog_id": 42,
  "notes": "Must visit Bhaktapur on my next trip to Kathmandu"
}
```

**Response (201 Created - When bookmark is created):**
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
  "created_at": "2023-04-07T14:42:38Z",
  "notes": "Must visit Bhaktapur on my next trip to Kathmandu"
}
```

**Response (200 OK - When bookmark is removed):**
```json
{
  "message": "Bookmark removed"
}
```

## ⭐ Rating Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/ratings/` | List ratings |
| `POST` | `/api/ratings/` | Create rating |
| `GET` | `/api/ratings/{id}/` | Get rating details |
| `PUT` | `/api/ratings/{id}/` | Update rating (owner only) |
| `DELETE` | `/api/ratings/{id}/` | Delete rating (owner only) |

### Examples

#### Rate a Blog

**Request:**
```http
POST /api/blogs/42/rate/
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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

## 📊 Dashboard Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/dashboard/writer/` | Get writer dashboard statistics |
| `GET` | `/api/dashboard/admin/` | Get admin dashboard statistics (admin only) |

### Examples

#### Writer Dashboard

**Request:**
```http
GET /api/dashboard/writer/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "total_blogs": 12,
  "total_views": 15863,
  "total_reactions": 743,
  "total_comments": 283,
  "recent_activity": [
    {
      "action_type": "comment",
      "timestamp": "2023-04-07T13:42:18Z",
      "user": "pramod_joshi",
      "details": {
        "comment_id": 112
      }
    },
    {
      "action_type": "reaction",
      "timestamp": "2023-04-07T12:37:45Z",
      "user": "sita_karki",
      "details": {
        "reaction_type": "like"
      }
    }
  ]
}
```

#### Admin Dashboard

**Request:**
```http
GET /api/dashboard/admin/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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
      "created_at": "2023-04-07T13:28:16Z",
      "view_count": 87
    }
  ],
  "top_authors": [
    {
      "id": 1,
      "username": "mahendra_mahara",
      "blog_count": 35,
      "total_views": 58746
    }
  ]
}
```

## 📝 Activity Log Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET` | `/api/activity/` | List user's activity logs |
| `GET` | `/api/activity/{id}/` | Get activity details |

### Examples

#### List Activity Logs

**Request:**
```http
GET /api/activity/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 243,
      "user": 1,
      "action_type": "blog_view",
      "timestamp": "2023-04-07T16:28:43Z",
      "content_type": "blog",
      "object_id": 42,
      "details": {
        "blog_title": "The Ancient City of Bhaktapur: Nepal's Living Heritage"
      }
    },
    {
      "id": 242,
      "user": 1,
      "action_type": "comment_create",
      "timestamp": "2023-04-07T16:25:18Z",
      "content_type": "comment",
      "object_id": 112,
      "details": {
        "blog_id": 42,
        "comment_text": "Glad you enjoyed it! Did you try the local specialty, Ju Ju Dhau (King Yogurt)?"
      }
    }
  ]
}
```

## Error Responses

All endpoints follow standardized error response format:

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

Common error codes:
- `authentication_failed`: Invalid credentials
- `permission_denied`: User doesn't have access
- `validation_error`: Invalid input data
- `not_found`: Requested resource doesn't exist
- `server_error`: Unexpected server error
