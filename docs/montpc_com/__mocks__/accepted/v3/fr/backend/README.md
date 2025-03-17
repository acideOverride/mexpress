# MontPC Contact Form API

This is the backend API for the MontPC.com contact form. It provides a simple API endpoint that validates form submissions and will eventually send notification emails using the shared mExpress Email Service.

## Port Allocation

This service runs on port **9701** as defined in the mExpress API standards for MontPC.com website services.

## Features

- Form validation with detailed error messages
- CORS configuration for security
- Integration with the shared Email Service (pending)
- Health check endpoint
- Comprehensive test coverage

## Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

## Running the API

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Testing

```bash
# Run tests
npm test
```

## API Endpoints

### POST /api/contact

Submit a contact form.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890", // Optional
  "device": "iPhone", // Optional
  "message": "I'm interested in your services..."
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Votre message a été reçu. Nous vous contacterons bientôt.",
  "reference": "MONT-12ABC34"
}
```

**Error Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erreur de validation du formulaire",
    "details": [
      {
        "field": "email",
        "message": "Veuillez fournir un email valide"
      }
    ]
  }
}
```

### GET /health

Check API health.

**Success Response:**

```json
{
  "status": "ok",
  "message": "Contact form API is running"
}
```

## Integration with Shared Email Service

This API is designed to integrate with the mExpress Email Service (port 9002) which uses Resend.com. This integration is pending until the shared Email Service is implemented.

The integration will be done by making API calls to the Email Service endpoint.