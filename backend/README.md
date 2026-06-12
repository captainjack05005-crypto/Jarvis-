# JARVIS FastAPI Backend

Production-ready AI assistant backend built with FastAPI, PostgreSQL, and OpenAI API.

## Features

✅ **User Authentication** - JWT-based authentication with secure password hashing
✅ **Chat API** - Real-time chat endpoint with message history
✅ **Memory Storage** - PostgreSQL database for persistent data storage
✅ **OpenAI Integration** - GPT-4 integration with token tracking
✅ **Async Support** - Full async/await support for high performance
✅ **Database Migrations** - Alembic for schema management
✅ **Error Handling** - Comprehensive error handling and logging
✅ **Testing** - Unit and integration tests
✅ **Docker Support** - Production-ready Docker setup

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache**: Redis for session storage
- **Auth**: JWT with python-jose
- **AI**: OpenAI API (GPT-4)
- **Testing**: Pytest with async support
- **Server**: Uvicorn with Gunicorn

## Setup

### Prerequisites

- Python 3.10+
- PostgreSQL 12+
- Redis 6+
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations
```bash
alembic upgrade head
```

6. Start the server
```bash
uvicorn app.main:app --reload
```

## Docker Setup

```bash
docker-compose up -d
```

The API will be available at `http://localhost:8000`

## API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/me` - Get current user

### Chat

- `POST /api/v1/chat/message` - Send message and get AI response
- `GET /api/v1/chat/conversations` - List user conversations
- `GET /api/v1/chat/conversations/{id}` - Get conversation details
- `PUT /api/v1/chat/conversations/{id}` - Update conversation
- `DELETE /api/v1/chat/conversations/{id}` - Delete conversation

### Health

- `GET /health` - Health check
- `GET /ready` - Readiness check

## Running Tests

```bash
pytest
pytest --cov=app --cov-report=html  # With coverage
```

## Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   ├── core/             # Configuration and core utilities
│   ├── models/           # SQLAlchemy ORM models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── services/         # Business logic services
│   └── main.py           # FastAPI application factory
├── alembic/              # Database migrations
├── tests/                # Test suite
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Docker compose configuration
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(120),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    title VARCHAR(200),
    description TEXT,
    is_archived INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
    id VARCHAR PRIMARY KEY,
    conversation_id VARCHAR NOT NULL REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    processing_time FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Configuration

All configuration is managed through environment variables in `.env`:

```env
# Application
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@host:5432/jarvis_db

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2048

# Redis
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

## Security

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- SQL injection protection via ORM
- CORS configuration for frontend
- Environment variable management
- HTTPS support ready

## Performance

- Async/await for non-blocking I/O
- Connection pooling for database
- Redis caching layer
- Pagination for list endpoints
- Request/response validation

## Monitoring

- Structured logging with Loguru
- Health check endpoints
- Error tracking
- Performance metrics

## Deployment

### Using Gunicorn

```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --port 8000
```

### Using Docker

```bash
docker build -t jarvis-api .
docker run -p 8000:8000 --env-file .env jarvis-api
```

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open pull request

## License

MIT License - see LICENSE file for details
