# File-Sharing WebApp - Backend

A Node.js backend application for secure file sharing with email notifications. Users can upload files, generate shareable links, and send files via email to recipients.

## Features

- **File Upload**: Upload files up to 100MB securely
- **Shareable Links**: Generate unique, shareable links for uploaded files
- **Email Notifications**: Send files via email with custom messages
- **File Download**: Recipients can download files using unique links
- **File Display**: View file information before downloading
- **Database Integration**: MongoDB for file metadata storage
- **CORS Support**: Configured for multiple client origins
- **Email Service**: Brevo SMTP for email delivery

## Tech Stack

- **Runtime**: Node.js 24.12.0
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.1.1
- **File Upload**: Multer 2.0.2
- **Email**: Nodemailer 7.0.12
- **View Engine**: EJS 3.1.10
- **CORS**: 2.8.5
- **UUID**: 13.0.0

## Project Structure

```
backend/
├── app.js                      # Main application entry point
├── package.json                # Project dependencies
├── .env                        # Environment variables
├── script.js                   # Utility scripts
├── config/
│   └── db.js                  # MongoDB connection configuration
├── models/
│   └── files.model.js         # File schema and model
├── routes/
│   ├── files.routes.js        # File upload and send routes
│   ├── show.routes.js         # Display file information
│   └── download.routes.js     # File download routes
├── services/
│   ├── email.services.js      # Email sending functionality
│   └── emailTemplate.services.js # Email template formatting
├── views/
│   └── download.ejs           # Download page template
├── public/
│   ├── css/
│   │   └── style.css          # Styling
│   ├── javascripts/           # Client-side scripts
│   └── images/                # Static images
└── uploads/                   # Directory for uploaded files
```

## Installation

### Prerequisites

- Node.js 24.12.0 or higher
- npm or yarn
- MongoDB database (Atlas or local)
- SMTP email service credentials

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   HOST=localhost
   PORT=3000
   APP_BASE_URL=http://localhost:3000

   # MongoDB Connection
   MONGO_CONNECTION_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

   # SMTP Email Configuration
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   MAIL_USER=your-smtp-user@example.com
   MAIL_PASSWORD=your-smtp-password
   MAIL_FROM_NAME=Your App Name
   MAIL_FROM_EMAIL=sender@example.com

   # CORS Configuration (comma-separated)
   ALLOWED_CLIENTS=http://localhost:3000,http://localhost:3300,http://localhost:5000
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

## Running the Application

### Development Mode
Run with automatic restart on file changes:
```bash
npm run dev
```

### Production Mode
Run normally:
```bash
npm start
```

The server will start and listen on the configured HOST and PORT (default: `http://localhost:3000`)

## API Endpoints

### 1. Upload File
- **Endpoint**: `POST /api/files`
- **Description**: Upload a file to generate a shareable link
- **Content-Type**: `multipart/form-data`
- **Form Data**: 
  - `myfile` (File): The file to upload
- **Response**:
  ```json
  {
    "file": "http://localhost:3000/files/unique-uuid"
  }
  ```

### 2. Send File via Email
- **Endpoint**: `POST /api/files/send`
- **Description**: Upload and send file via email to recipient
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `myfile` (File): The file to upload
  - `emailTo` (String): Recipient email address
  - `emailFrom` (String): Sender email address (optional)
  - `customMessage` (String): Custom message for recipient (optional)
- **Response**: File information with shareable link

### 3. Display File Information
- **Endpoint**: `GET /files/:uuid`
- **Description**: Display file metadata and information
- **Parameters**:
  - `uuid` (String): Unique file identifier
- **Response**: EJS rendered page with file details

### 4. Download File
- **Endpoint**: `GET /files/download/:uuid`
- **Description**: Download the uploaded file
- **Parameters**:
  - `uuid` (String): Unique file identifier
- **Response**: File download

## Database Schema

### File Model
```javascript
{
  filename: String,        // Original filename
  path: String,           // File path on server
  size: String,           // File size in bytes
  uuid: String,           // Unique identifier
  sender: String,         // Sender email (optional)
  receiver: String,       // Receiver email (optional)
  timestamps: true        // createdAt, updatedAt
}
```

## Configuration Details

### MongoDB Connection
- Uses MongoDB Atlas or local MongoDB instance
- Connection string specified in `MONGO_CONNECTION_URL`

### Email Service
- **Provider**: Brevo (formerly Sendinblue)
- Configure SMTP credentials in `.env`
- Supports custom email templates via `emailTemplate.services.js`

### CORS
- Configured to allow requests from specified client URLs
- Multiple origins can be added (comma-separated) in `ALLOWED_CLIENTS`

### File Upload
- **Max file size**: 100MB
- **Storage**: Local `uploads/` directory
- **Filename**: Unique name based on timestamp and random number

## Usage Examples

### Using cURL

**Upload a file:**
```bash
curl -X POST \
  -F "myfile=@/path/to/file.pdf" \
  http://localhost:3000/api/files
```

**Send file via email:**
```bash
curl -X POST \
  -F "myfile=@/path/to/file.pdf" \
  -F "emailTo=recipient@example.com" \
  -F "emailFrom=sender@example.com" \
  -F "customMessage=Please review this document" \
  http://localhost:3000/api/files/send
```

### Using JavaScript/Fetch

**Upload a file:**
```javascript
const formData = new FormData();
formData.append('myfile', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/files', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log('File link:', data.file);
```

**Send file via email:**
```javascript
const formData = new FormData();
formData.append('myfile', fileInput.files[0]);
formData.append('emailTo', 'recipient@example.com');
formData.append('emailFrom', 'sender@example.com');
formData.append('customMessage', 'Check this out!');

const response = await fetch('http://localhost:3000/api/files/send', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log('File link:', data.file);
```

## Troubleshooting

### Port Already in Use
Change the PORT in `.env` file to an available port.

### MongoDB Connection Error
- Verify `MONGO_CONNECTION_URL` is correct
- Check MongoDB Atlas IP whitelist if using Atlas
- Ensure MongoDB service is running if using local instance

### Email Not Sending
- Verify SMTP credentials in `.env`
- Check if sender email is verified with email service
- Ensure `MAIL_FROM_EMAIL` is authorized
- Check firewall/antivirus blocking SMTP port

### File Upload Failing
- Check if `uploads/` directory exists and is writable
- Verify file size is under 100MB limit
- Ensure proper form data with `myfile` field name

### CORS Issues
- Add client URL to `ALLOWED_CLIENTS` in `.env`
- Verify client domain matches exactly (include protocol and port)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `HOST` | Server hostname | `localhost` |
| `PORT` | Server port | `3000` |
| `APP_BASE_URL` | Base URL for file links | `http://localhost:3000` |
| `MONGO_CONNECTION_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| `SMTP_HOST` | SMTP server host | `smtp-relay.brevo.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `MAIL_USER` | SMTP authentication user | `user@example.com` |
| `MAIL_PASSWORD` | SMTP authentication password | `password123` |
| `MAIL_FROM_NAME` | Sender name in emails | `inShare` |
| `MAIL_FROM_EMAIL` | Sender email address | `sender@example.com` |
| `ALLOWED_CLIENTS` | CORS allowed origins | `http://localhost:3000,http://localhost:5000` |

## Security Considerations

- Store sensitive information (DB credentials, SMTP passwords) in `.env` file
- Never commit `.env` file to version control
- Validate and sanitize user input
- Implement rate limiting for production
- Use HTTPS in production environment
- Implement file virus scanning for production
- Add authentication/authorization for sensitive operations

## Future Enhancements

- User authentication system
- File expiration/deletion scheduling
- Download tracking and analytics
- Password protection for files
- File compression
- Bulk file uploads
- Admin dashboard

## Support

For issues or questions, please create an issue in the repository or contact the development team.

## License

ISC

---

**Created**: 2026
**Version**: 1.0.0
