# 📦 Node Verse Object Storage Project

A modern, secure, and scalable **Object Storage System** built with Node.js. This project allows users to upload, manage, and retrieve files with authentication, encryption, and comprehensive API endpoints.

---

## 🎯 Project Overview

This is a **REST API-based file storage system** that provides secure file management capabilities. Users can register, authenticate, upload files, and retrieve them with temporary access tokens. The system uses local blob storage for files and MongoDB for metadata management.

**In Simple Terms**: Think of it as your own Google Drive or Dropbox, where users can safely upload and download their files with complete security! 🔐

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure registration and login with JWT tokens |
| 📧 **Email Verification** | OTP-based email verification for account security |
| 🗝️ **Token Management** | Access and refresh tokens with automatic rotation |
| 📁 **File Upload** | Secure file upload with presigned URLs |
| 🎫 **Presigned URLs** | Time-limited access tokens for file operations |
| 📊 **File Metadata** | Store and retrieve file information |
| 🔒 **Security** | Bcrypt password hashing, JWT encryption, rate limiting |
| 🚀 **Rate Limiting** | OTP request rate limiting to prevent abuse |
| 📝 **Logging** | Comprehensive logging with Pino logger |
| 🗄️ **Database** | MongoDB for persistent data storage |
| ⚡ **Caching** | Redis for token and OTP storage |
| 📧 **Email Service** | Nodemailer for sending OTP emails |

---

## 📁 Project File Structure

```
object-storage-project/
│
├── 📄 server.js              # Main server entry point
├── 📄 api.js                 # API router configuration
├── 📄 package.json           # Project dependencies
├── 📄 README.md              # This file
│
├── 📂 src/
│   ├── 📂 config/
│   │   ├── constants.js      # Application constants
│   │   ├── mail.js           # Email configuration
│   │   └── redis.js          # Redis connection setup
│   │
│   ├── 📂 controllers/
│   │   ├── object.controller.js    # File upload/download logic
│   │   └── userController.js       # User authentication logic
│   │
│   ├── 📂 models/
│   │   ├── index.js               # Database connection
│   │   ├── user/
│   │   │   └── user.js            # User database schema
│   │   └── object/
│   │       └── object.model.js     # File metadata schema
│   │
│   ├── 📂 services/
│   │   ├── logging/
│   │   │   └── pinoService.js             # Logger setup
│   │   ├── security/
│   │   │   └── signer.service.js          # Token signing/verification
│   │   ├── storage/
│   │   │   ├── blobStore.service.js       # Local file storage
│   │   │   └── storage.service.js         # File upload orchestration
│   │   └── user/
│   │       └── userService.js             # User business logic
│   │
│   ├── 📂 routes/
│   │   ├── userRoutes.js      # User authentication routes
│   │   └── storageRoutes.js    # File storage routes
│   │
│   ├── 📂 middlewares/
│   │   ├── authMiddleware.js        # JWT authentication check
│   │   ├── otpRateLimit.js          # OTP rate limiting
│   │   └── validateMiddleware.js    # Input validation
│   │
│   ├── 📂 helpers/
│   │   ├── authHelper.js       # Token creation utilities
│   │   ├── commonHelper.js     # Common utility functions
│   │   ├── customErrors.js     # Custom error classes
│   │   ├── dateHelper.js       # Date manipulation
│   │   ├── loggingHelper.js    # Logging utilities
│   │   ├── mathHelper.js       # Math utilities
│   │   ├── response.js         # Response templates
│   │   ├── responseCode.js     # HTTP status codes
│   │   ├── responseHandle.js   # Response handler
│   │   └── responseMessage.js  # Response messages
│   │
│   ├── 📂 validations/
│   │   └── object.validation.js     # Zod validation schemas
│   │
│   └── 📂 views/              # EJS templates for frontend
│
├── 📂 blob-store/              # Local file storage directory
│   └── [Files organized by hash]
│
└── 📂 public/                  # Static files (CSS, JS, images)
```

---

## 🛠️ Modules & Dependencies

### Core Framework
- **express** (v5.2.1) - Web framework for REST API
- **mongoose** (v8.20.4) - MongoDB object modeling

### Authentication & Security
- **jsonwebtoken** (v9.0.3) - JWT token creation and verification
- **bcrypt** (v6.0.0) - Password hashing and comparison
- **helmet** (v8.1.0) - Security headers middleware

### Data Storage
- **redis** (v5.10.0) - In-memory cache for tokens and OTP
- **mongodb** - NoSQL database for data persistence

### Validation & Rate Limiting
- **zod** (v4.3.5) - Schema validation
- **express-rate-limit** (v8.2.1) - API rate limiting

### Email & Communication
- **nodemailer** (v7.0.12) - Email sending
- **multer** (v2.0.2) - File upload handling

### Utilities
- **pino** (v10.1.0) - Fast JSON logging
- **dotenv** (v17.2.3) - Environment variable management
- **moment** (v2.30.1) - Date/time manipulation
- **lodash** (v4.17.21) - Utility functions
- **cookie-parser** (v1.4.7) - Cookie parsing
- **cors** (v2.8.5) - Cross-origin resource sharing

### Task Scheduling
- **bullmq** (v5.66.4) - Job queue processing
- **node-cron** (v4.2.1) - Cron job scheduling

---

## 🗄️ Database Design

### User Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  emailVerified: Boolean (default: false),
  deleteAt: Date (null by default),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Purpose**: Stores user account information and authentication details.

### Object Collection (File Metadata)
```
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  bucket: String (folder/bucket name),
  key: String (file name),
  blobId: String (unique identifier for file storage),
  size: Number (file size in bytes),
  mimeType: String (file type, e.g., "image/png"),
  metadata: Mixed (custom metadata object),
  status: Number (0=pending, 1=active, 2=deleted),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Indexes**:
- `userId` - Fast user lookup
- `bucket` - Fast bucket lookup
- `key` - Fast file lookup
- `blobId` - Unique identifier
- `{bucket, key, userId}` - Unique composite key

**Purpose**: Stores metadata about uploaded files without the actual file content.

### Database Diagram

```
┌─────────────────────────────┐
│        USER TABLE           │
├─────────────────────────────┤
│ • _id (PK)                  │
│ • name                      │
│ • email (UNIQUE)            │
│ • password (hashed)         │
│ • emailVerified             │
│ • createdAt                 │
└──────────────┬──────────────┘
               │
               │ One to Many
               │
┌──────────────▼──────────────┐
│      OBJECT TABLE           │
├─────────────────────────────┤
│ • _id (PK)                  │
│ • userId (FK)               │
│ • bucket                    │
│ • key                       │
│ • blobId (UNIQUE)           │
│ • size                      │
│ • mimeType                  │
│ • status (0/1/2)            │
│ • createdAt                 │
└─────────────────────────────┘
```

---

## 🔌 API Design & Routes

### Base URL
```
http://localhost:3000/api
```

### Authentication Flow Diagram

```
┌──────────────┐
│   Register   │
└──────┬───────┘
       │ POST /users/register
       ▼
┌──────────────────────┐
│ Create User Account  │
│ Hash Password        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Send OTP via Email  │
└──────┬───────────────┘
       │ POST /users/getOtp
       ▼
┌──────────────────────┐
│  Verify OTP          │
│  Set emailVerified   │
└──────┬───────────────┘
       │ POST /users/verify
       ▼
┌──────────────────────┐
│      Login           │
└──────┬───────────────┘
       │ POST /users/login
       ▼
┌──────────────────────────────┐
│ Generate Access Token        │
│ Generate Refresh Token       │
│ Store in Redis & Cookie      │
└──────────────────────────────┘
```

---

## 📡 API Endpoints

### 👤 User Routes (`/users`)

#### 1️⃣ Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201 Created)**:
```json
{
  "status": 201,
  "data": {
    "id": "507f1f77bcf86cd799439011"
  },
  "message": "User created successfully"
}
```

---

#### 2️⃣ Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Cookie Set**:
```
refreshToken=<refresh_token_value>; HttpOnly; Secure; SameSite=Strict
```

---

#### 3️⃣ Send OTP to Email
```http
POST /api/users/getOtp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "message": "Otp Sent Successfully"
}
```

**Email Sent**:
- Contains 6-digit OTP
- Valid for 10 minutes
- Rate limited to 5 attempts per 10 minutes

---

#### 4️⃣ Verify OTP
```http
POST /api/users/verify
Content-Type: application/json

{
  "otp": "123456",
  "email": "john@example.com"
}
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "message": "Otp verified successfully"
}
```

---

#### 5️⃣ Rotate Token (Refresh Access Token)
```http
GET /api/users/refresh
Cookie: refreshToken=<refresh_token_value>
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token rotated successfully"
}
```

---

#### 6️⃣ Get Current User
```http
GET /api/users
Authorization: Bearer <accessToken>
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "emailVerified": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z"
  },
  "message": "User fetched successfully"
}
```

---

#### 7️⃣ Logout User
```http
DELETE /api/users/logout
Authorization: Bearer <accessToken>
Cookie: refreshToken=<refresh_token_value>
```

**Response (200 OK)**:
```json
{
  "status": 200,
  "message": "Logout successful"
}
```

---

### 📦 Storage Routes (`/storage`)

#### 1️⃣ Initialize Upload
```http
POST /api/storage/init-upload
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "bucket": "my-documents",
  "key": "resume.pdf",
  "mimeType": "application/pdf",
  "metadata": {
    "version": "1.0",
    "department": "Engineering"
  }
}
```

**Validation Rules** (Zod Schema):
- `bucket`: Required, string
- `key`: Required, string (file name)
- `mimeType`: Required, string
- `metadata`: Optional, object

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "presignedUrl": "/api/storage/upload/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Upload initialized"
}
```

**What happens**:
1. System creates a blob ID for the file
2. Creates database record with status = "pending"
3. Generates signed token valid for 5 minutes
4. Returns presigned URL for upload

---

#### 2️⃣ Upload File
```http
PUT /api/storage/upload/:token
Content-Type: multipart/form-data

[Binary file data]
```

**Token**: Obtained from init-upload response

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "_id": "507f2f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "bucket": "my-documents",
    "key": "resume.pdf",
    "blobId": "21870afdd13ae5f079a1ce2459acd2e7",
    "size": 1024000,
    "mimeType": "application/pdf",
    "status": 1,
    "createdAt": "2026-01-15T10:35:00Z",
    "updatedAt": "2026-01-15T10:35:10Z"
  },
  "message": "File uploaded successfully"
}
```

**What happens**:
1. Verifies the signed token
2. Retrieves file metadata from database
3. Writes file to local blob storage
4. Updates file status from "pending" to "active"
5. Returns updated file metadata

---

#### 3️⃣ Get File Download URL
```http
GET /api/storage/objects?bucket=my-documents&key=resume.pdf
Authorization: Bearer <accessToken>
```

**Query Parameters**:
- `bucket`: Storage bucket name (required)
- `key`: File key/path in bucket (required)

**Response (200 OK)**:
```json
{
  "status": 200,
  "data": {
    "downloadUrl": "http://localhost:3000/api/storage/downloads/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Success"
}
```

**What happens**:
1. Verifies access token from Authorization header
2. Finds file by bucket, key, and userId
3. Checks if file status is "active" (ready for download)
4. Generates HMAC-SHA256 signed token valid for 5 minutes
5. Encodes blob ID and MIME type in the token
6. Returns presigned download URL
7. Token can be used anonymously (no auth required on download endpoint)

**Error Cases**:
- 401: Unauthorized (invalid or missing access token)
- 400: File not found or access denied
- 400: File status is not active

---

#### 4️⃣ Download File
```http
GET /api/storage/downloads/:token
```

**Token**: Obtained from get file download URL endpoint

**Response (200 OK)**: File stream with appropriate headers
```
Content-Type: <mimeType>
Content-Length: <fileSize>
[Binary file data]
```

**Example Response Headers**:
```
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 1024000
Connection: keep-alive
```

**What happens**:
1. Extracts token from URL parameter
2. Verifies HMAC-SHA256 signature on token
3. Checks if token has expired (5 minutes)
4. Decodes blob ID and MIME type from token
5. Finds file in blob storage by blob ID
6. Sets appropriate Content-Type header
7. Streams file directly to client
8. Connection closes automatically after transfer

**Error Cases**:
- 400: Invalid or tampered token
- 400: Token has expired
- 404: File not found in blob storage

**Security Note**:
- Download token is signed and tamper-proof
- Cannot be forged without the secret key
- Expires in 5 minutes for security
- No authentication required on download endpoint (token is the credential)

---

## 🔄 Complete File Upload & Download Flow Diagram

```
User                    API                  Database              Blob Store
│                       │                        │                     │
├──── POST register ────────>                    │                     │
│                       │                        │                     │
│                       ├─── Create User ───────>│                     │
│                       │                        │                     │
│<─ User Created ───────┤                        │                     │
│                       │                        │                     │
├──── POST login ───────────>                    │                     │
│                       │                        │                     │
│                       ├─── Verify Password ───>│                     │
│                       │                        │                     │
│<─ Access Token ───────┤                        │                     │
│                       │                        │                     │
├─ POST init-upload ────────> (with token)       │                     │
│                       │                        │                     │
│                       ├─ Create Blob ID ─────>│                     │
│                       │                        │                     │
│                       ├─ Create Object Record→│ {status: pending}   │
│                       │                        │                     │
│<─ Presigned URL ──────┤                        │                     │
│                       │                        │                     │
├─ PUT /upload/:token ──────────> (file data)   │                     │
│                       │                        │                     │
│                       ├─ Verify Token ────────────────────────────>│
│                       │                        │                     │
│                       ├─ Get Object Record ───>│                     │
│                       │                        │                     │
│                       ├─────────────────────────────> Write Blob ──>│
│                       │                        │    blobId: xxxxx    │
│                       │                        │                     │
│                       ├─ Update Status ──────>│ {status: active}    │
│                       │                        │                     │
│<─ Success Response ───┤                        │                     │
│                       │                        │                     │
├─ GET /objects ───────────────> (with token)   │                     │
│  (request download)   │                        │                     │
│                       ├─ Verify Access Token ─>│                     │
│                       │                        │                     │
│                       ├─ Check File Status ───>│ {status: active}?   │
│                       │                        │                     │
│                       ├─ Sign Download Token ──┐                     │
│                       │  (5 min expiry)        │                     │
│                       │                        │                     │
│<─ Download URL ───────┤                        │                     │
│                       │                        │                     │
├─ GET /downloads/:token ───────────────────────────────────────────>│
│  (no auth needed)     │                        │                     │
│                       │                        │                     │
│                       ├─ Verify Token Signature ─────────────────────┤
│                       │                        │                     │
│                       ├─ Check Token Expiry ──────────────────────────┤
│                       │                        │                     │
│                       ├─────────────────────────────────> Read Blob ─┤
│                       │                        │         (blobId)    │
│                       │                        │                     │
│<─ File Stream ────────┤<────────────────────────────────────────────│
│  (with MIME type)     │                        │                     │
│                       │                        │                     │
```

---

## 🔐 File Download Security Flow

```
Client requests download URL
│
├─ GET /api/storage/objects?bucket=X&key=Y
│  ├─ Auth header validated (JWT access token)
│  ├─ User ID extracted from token
│  ├─ File found in MongoDB
│  ├─ Status verified (must be "active")
│  └─ Download token generated with HMAC-SHA256
│
├─ Token payload contains:
│  ├─ blobId (file identifier)
│  ├─ mimeType (content type)
│  └─ expiry (5 minutes from now)
│
├─ Token is base64-encoded for URL safety
│
└─ Returns presigned URL:
   /api/storage/downloads/<base64_token>


Client uses presigned URL for download
│
├─ GET /api/storage/downloads/:token
│  ├─ Token decoded from base64
│  ├─ HMAC signature verified
│  │  └─ Prevents tampering/forgery
│  ├─ Expiry timestamp checked
│  │  └─ Token must not be older than 5 minutes
│  ├─ BlobId and MIME type extracted
│  ├─ File read from disk using blobId
│  ├─ Content-Type header set
│  └─ File streamed to client
│
└─ No authentication needed
   (Token itself is the credential)
```

---

## 🔄 File Upload Flow Diagram

```
User                    API                  Database              Blob Store
│                       │                        │                     │
├──── POST register ────────>                    │                     │
│                       │                        │                     │
│                       ├─── Create User ───────>│                     │
│                       │                        │                     │
│<─ User Created ───────┤                        │                     │
│                       │                        │                     │
├──── POST login ───────────>                    │                     │
│                       │                        │                     │
│                       ├─── Verify Password ───>│                     │
│                       │                        │                     │
│<─ Access Token ───────┤                        │                     │
│                       │                        │                     │
├─ POST init-upload ────────> (with token)       │                     │
│                       │                        │                     │
│                       ├─ Create Blob ID ─────>│                     │
│                       │                        │                     │
│                       ├─ Create Object Record→│ {status: pending}   │
│                       │                        │                     │
│<─ Presigned URL ──────┤                        │                     │
│                       │                        │                     │
├─ PUT /upload/:token ──────────> (file data)   │                     │
│                       │                        │                     │
│                       ├─ Verify Token ────────────────────────────>│
│                       │                        │                     │
│                       ├─ Get Object Record ───>│                     │
│                       │                        │                     │
│                       ├─────────────────────────────> Write Blob ──>│
│                       │                        │    blobId: xxxxx    │
│                       │                        │                     │
│                       ├─ Update Status ──────>│ {status: active}    │
│                       │                        │                     │
│<─ Success Response ───┤                        │                     │
│                       │                        │                     │
```

---

## 🔐 Security Architecture

### Authentication Flow

```
Browser/Client
│
├─ POST /register
│  └─ User + Password
│     └─ Password Hashed with Bcrypt
│        └─ User Saved to MongoDB
│
├─ POST /login
│  └─ Email + Password
│     └─ Bcrypt Verify Password
│        └─ Generate JWT Access Token (expires in 15 min)
│        └─ Generate JWT Refresh Token (expires in 7 days)
│           └─ Refresh Token stored in Redis
│           └─ Refresh Token sent as HttpOnly Cookie
│
├─ API Request with Access Token
│  └─ Authorization: Bearer <accessToken>
│     └─ Middleware verifies JWT signature
│        └─ Middleware extracts userId
│           └─ Request proceeds
│
└─ POST /refresh (when access token expires)
   └─ Uses Refresh Token from Cookie
      └─ Verify Refresh Token in Redis
         └─ Generate New Access Token
            └─ Return new Access Token
```

### Password Security
- Passwords hashed with **Bcrypt** (10 salt rounds)
- Never stored in plaintext
- Compared during login for verification

### Token Security
- **JWT tokens** signed with secret key
- **Refresh tokens** stored in Redis (server-side)
- **Access tokens** are short-lived (15 minutes)
- **HttpOnly cookies** prevent JavaScript access
- **SameSite=Strict** prevents CSRF attacks

### File Upload Security
- Upload token signed for specific `blobId`
- Token expires in 5 minutes
- Token verified before file write
- Prevents unauthorized file uploads

---

## 📝 Code Explanation by Module

### 1️⃣ User Registration Process

**File**: `src/services/user/userService.js`

```javascript
const createUser = async (data) => {
  // Step 1: Extract user data
  const { name, email, password } = data;
  
  // Step 2: Hash password with bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Step 3: Check if user already exists
  const existingUser = await User.findOne({ email }, { _id: 1 });
  if (existingUser) {
    throw new Error('User already Exists!!!');
  }
  
  // Step 4: Create new user in MongoDB
  const user = await User.create({ 
    name, 
    email, 
    password: hashedPassword 
  });
  
  // Step 5: Return user ID
  return { id: user._id };
};
```

**What it does**:
1. Takes user registration data
2. Hashes password securely
3. Checks for duplicate email
4. Saves user to MongoDB
5. Returns user ID

**Security**: Password is hashed, never stored plain text

---

### 2️⃣ Login & Token Generation

**File**: `src/helpers/authHelper.js`

```javascript
const createAccessToken = (userId) => {
  // Creates JWT token valid for 15 minutes
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

const createRefreshToken = (userId) => {
  // Creates JWT token valid for 7 days
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};
```

**Access Token**: Short-lived, used for API requests
**Refresh Token**: Long-lived, used to get new access tokens

---

### 3️⃣ File Upload Initialization

**File**: `src/services/storage/storage.service.js`

```javascript
const initUpload = async (userId, data) => {
  // Step 1: Create blob ID and path
  const { blobId, path } = createBlob();
  
  // Step 2: Create object record in database
  await ObjectModel.create({
    userId,                    // User who's uploading
    bucket: data.bucket,       // Bucket/folder name
    key: data.key,             // File name
    blobId,                    // Unique file ID
    mimeType: data.mimeType,   // File type
    metadata: data.metadata,   // Custom metadata
    status: 0                  // Status: pending
  });
  
  // Step 3: Generate signed token (expires in 5 minutes)
  const token = singer.signToken({ blobId }, 300);
  
  // Step 4: Return presigned URL for upload
  return { presignedUrl: `/api/storage/upload/${token}` };
};
```

**What it does**:
1. Creates unique blob ID for the file
2. Creates database record (status = pending)
3. Generates time-limited token
4. Returns URL for client to upload file to

---

### 4️⃣ Actual File Upload

**File**: `src/services/storage/storage.service.js`

```javascript
const upload = async (token, stream) => {
  // Step 1: Verify and decode token
  const { blobId } = singer.verifyToken(token);
  
  // Step 2: Find object record by blobId
  const obj = await ObjectModel.findOne({ blobId });
  if (!obj) {
    throw new Error('Object not found!!');
  }
  
  // Step 3: Get file path for blob storage
  const filePath = createBlob(blobId).path;
  
  // Step 4: Write file to local blob store
  await writeBlob(filePath, stream);
  
  // Step 5: Update status to active
  obj.status = 1;  // 1 = active
  
  // Step 6: Save and return updated object
  return obj.save();
};
```

**What it does**:
1. Verifies token (ensures request is authorized)
2. Finds file metadata in database
3. Writes file to local file system
4. Updates file status from pending to active
5. Returns updated file information

---

### 5️⃣ Authentication Middleware

**File**: `src/middlewares/authMiddleware.js`

```javascript
const authMiddleware = (req, res, next) => {
  // Step 1: Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  // Step 2: Check if token exists
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  // Step 3: Verify JWT signature
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  // Step 4: Extract userId from token
  req.userId = decoded.userId;
  
  // Step 5: Pass to next middleware/route handler
  next();
};
```

**What it does**:
1. Extracts token from request header
2. Verifies token signature
3. Extracts user ID from token
4. Allows request to proceed if valid
5. Blocks request if token is invalid/expired

---

### 6️⃣ Validation Middleware

**File**: `src/middlewares/validateMiddleware.js`

```javascript
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    // Step 1: Parse request body with Zod schema
    const result = schema.safeParse(req.body);
    
    // Step 2: Check if validation passed
    if (!result.success) {
      // Return validation errors
      return responseHandle.handleError(res, {
        message: result.error.errors
      });
    }
    
    // Step 3: If valid, continue to route handler
    next();
  };
};
```

**What it does**:
1. Uses Zod schema to validate input
2. Checks all required fields are present
3. Checks data types are correct
4. Blocks request if validation fails
5. Allows request if all checks pass

---

### 7️⃣ Response Handler

**File**: `src/helpers/responseHandle.js`

```javascript
const handleData = (res, data) => {
  // Returns successful response with data
  return res.status(200).json({
    status: 200,
    data: data,
    message: 'Success'
  });
};

const handleError = (res, error) => {
  // Returns error response
  return res.status(error.status || 400).json({
    status: error.status || 400,
    message: error.message || 'Something went wrong'
  });
};
```

**What it does**:
1. Standardizes all API responses
2. Includes status code, data, and message
3. Handles errors consistently
4. Makes API predictable for clients

---

### 8️⃣ Token Signing & Verification (Presigned URLs)

**File**: `src/services/security/signer.service.js`

```javascript
/**
 * Sign token with HMAC signature
 * Creates a tamper-proof token with JSON payload, expiry, and HMAC-SHA256 signature
 * Encodes result in base64 for safe transmission
 * 
 * @param {Object} payload - Data to encode in token (e.g., { blobId, mimeType })
 * @param {number} ttlSec - Time-to-live in seconds
 * @returns {string} Base64-encoded signed token
 */
const signToken = (payload, ttlSec) => {
  // Step 1: Calculate expiration time
  const expiry = Date.now() + ttlSec * 1000;
  
  // Step 2: Create payload object with expiry
  const data = JSON.stringify({ payload, expiry });
  
  // Step 3: Generate HMAC-SHA256 signature
  const sig = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
  
  // Step 4: Combine data and signature
  const token = `${data}.${sig}`;
  
  // Step 5: Encode in base64 for URL safety
  return Buffer.from(token).toString('base64');
};

/**
 * Verify token signature and expiry
 * Decodes base64 token, validates HMAC signature, and checks expiration
 * 
 * @param {string} token - Base64-encoded signed token
 * @returns {Object} Decoded payload if token is valid
 * @throws {Error} If signature invalid or token expired
 */
const verifyToken = (token) => {
  // Step 1: Decode from base64
  const decoded = Buffer.from(token, 'base64').toString();
  
  // Step 2: Split data and signature
  const [data, sig] = decoded.split('.');
  
  // Step 3: Recalculate expected signature
  const expected = crypto
    .createHmac('sha256', secretKey)
    .update(data)
    .digest('hex');
  
  // Step 4: Compare signatures (prevent tampering)
  if (sig !== expected) {
    throw new Error('Invalid Signature');
  }
  
  // Step 5: Parse payload
  const parsed = JSON.parse(data);
  
  // Step 6: Check expiration
  if (Date.now() > parsed.expiry) {
    throw new Error('Token Expired!');
  }
  
  // Step 7: Return payload if valid
  return parsed.payload;
};
```

**What it does**:
1. Creates HMAC-SHA256 signed tokens for presigned URLs
2. Encodes payload, expiry, and signature together
3. Base64 encodes for safe URL transmission
4. Verifies signature to prevent tampering
5. Checks expiration time
6. Returns decoded payload if valid
7. Used for both upload and download tokens

**Security Features**:
- **HMAC-SHA256**: Cannot forge tokens without secret key
- **Expiration**: Tokens expire after specified time
- **Tamper-proof**: Any modification invalidates signature
- **Compact**: Encoded in base64 for URLs

**Usage Examples**:
```javascript
// For upload: token expires in 5 minutes
const uploadToken = signToken({ blobId: '123abc' }, 300);

// For download: token expires in 5 minutes
const downloadToken = signToken(
  { blobId: '123abc', mimeType: 'application/pdf' }, 
  300
);

// Verify token (throws error if invalid)
const payload = verifyToken(uploadToken);
```

---

### 9️⃣ File Retrieval for Download

**File**: `src/services/storage/storage.service.js`

```javascript
const getObject = async (userId, bucket, key) => {
  // Step 1: Find file in database with filters
  const obj = await ObjectModel.findOne({
    userId,                                    // Ensure ownership
    bucket,                                    // Match bucket
    key,                                       // Match filename
    status: getKeyByValue(statusConst, 'active'), // Only active files
  }, { blobId: 1, mimeType: 1 });             // Fetch only needed fields
  
  // Step 2: Check if file exists
  if (!obj) {
    throw new Error('File does not exist!!');
  }
  
  // Step 3: Create download token (valid 5 minutes)
  const token = signer.signToken(
    { blobId: obj.blobId, mimeType: obj.mimeType },
    300
  );
  
  // Step 4: Return presigned download URL
  return {
    downloadUrl: `http://localhost:3000/api/storage/downloads/${token}`,
  };
};
```

**What it does**:
1. Finds file by userId, bucket, and key (prevents unauthorized access)
2. Checks file status is "active" (ready for download)
3. Generates HMAC-signed download token with 5-minute expiry
4. Embeds blobId and mimeType in token for download endpoint
5. Returns presigned download URL (safe to share publicly)

**Security Features**:
- **User verification**: Only file owner can get download URL
- **Status check**: Only "active" files can be downloaded
- **Time-limited**: Token expires in 5 minutes
- **Tamper-proof**: Token signature prevents forgery

---

### 🔟 File Streaming for Download

**File**: `src/services/storage/storage.service.js`

```javascript
const downloadFile = async (token) => {
  // Step 1: Verify and decode token
  const { blobId, mimeType } = signer.verifyToken(token);
  
  // Step 2: Get file path from blob ID
  const { filePath } = getBlobPath(blobId);
  
  // Step 3: Read file stream from disk
  const stream = readBlob(filePath);
  
  // Step 4: Check if file exists
  if (!stream) {
    throw new Error('File not found!!!');
  }
  
  // Step 5: Return stream with MIME type for controller
  return {
    stream,
    mimeType
  };
};
```

**Controller Integration**:
```javascript
const downloadFile = async (req, res) => {
  try {
    // Get stream and MIME type from service
    const { stream, mimeType } = await storageService.downloadFile(
      req.params.token
    );
    
    // Set appropriate content type
    res.setHeader('Content-Type', mimeType);
    
    // Stream file to client
    stream.pipe(res);
  } catch (error) {
    return responseHandle.handleError(res, error);
  }
};
```

**What it does**:
1. Verifies token signature and expiration
2. Extracts blobId and mimeType from token
3. Constructs file path using blobId
4. Opens readable stream to file
5. Returns stream and MIME type to controller
6. Controller pipes stream directly to HTTP response
7. Sets appropriate Content-Type header
8. Client receives file download

**Streaming Advantages**:
- **Memory efficient**: Doesn't load entire file in memory
- **Large files**: Can stream multi-GB files
- **Responsive**: Client receives data as it's read
- **Error handling**: Pipe handles stream errors automatically

---

### 🔵 Logging with Pino

**File**: `src/services/logging/pinoService.js`

```javascript
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',  // Human-readable format
    options: {
      colorize: true        // Colorized output
    }
  }
});

// Logs every request
app.use(require('pino-http')({ logger }));
```

**What it does**:
1. Logs all HTTP requests
2. Tracks request/response times
3. Helps debug issues
4. Shows errors and warnings

---

## 🚀 How the System Works (Complete Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                  COMPLETE SYSTEM FLOW                       │
└─────────────────────────────────────────────────────────────┘

STEP 1: USER REGISTRATION
├─ User submits: name, email, password
├─ Server: Hash password with bcrypt
├─ Server: Check if email already exists
├─ Server: Save user to MongoDB
└─ Response: User ID

STEP 2: EMAIL VERIFICATION (Optional)
├─ User requests OTP via email
├─ Server: Generate 6-digit OTP
├─ Server: Hash OTP with bcrypt
├─ Server: Store hashed OTP in Redis (expires 2 min)
├─ Server: Send OTP via email
├─ User: Receives OTP in email
├─ User: Submits OTP
├─ Server: Verify OTP
└─ Server: Mark email as verified

STEP 3: USER LOGIN
├─ User submits: email, password
├─ Server: Find user by email
├─ Server: Verify password with bcrypt
├─ Server: Generate Access Token (JWT, 15 min)
├─ Server: Generate Refresh Token (JWT, 7 days)
├─ Server: Store refresh token in Redis
├─ Server: Send refresh token as HttpOnly cookie
└─ Response: Access token + user ID

STEP 4: FILE UPLOAD INITIALIZATION
├─ User submits: bucket, key, mimeType (with access token)
├─ Server: Verify access token (JWT)
├─ Server: Create blob ID
├─ Server: Create object record (status = pending)
├─ Server: Generate signed upload token (5 min)
├─ Server: Store blob ID in token
└─ Response: Presigned upload URL

STEP 5: FILE UPLOAD
├─ User uploads file to presigned URL with token
├─ Server: Verify upload token
├─ Server: Get blob ID from token
├─ Server: Find object record
├─ Server: Write file to local blob store
├─ Server: Update object status (pending → active)
└─ Response: File metadata + success message

STEP 6: REQUEST FILE DOWNLOAD URL
├─ User submits: bucket, key (with access token)
├─ Server: Verify access token (JWT)
├─ Server: Find file in database
├─ Server: Check file status is "active"
├─ Server: Extract blob ID and MIME type
├─ Server: Generate signed download token (5 min)
├─ Server: Encode blob ID + MIME type in token
└─ Response: Presigned download URL

STEP 7: DOWNLOAD FILE
├─ User uses presigned download URL (no auth needed)
├─ Server: Verify token signature (HMAC-SHA256)
├─ Server: Check token expiry (not older than 5 min)
├─ Server: Extract blob ID from token
├─ Server: Find and open file in blob store
├─ Server: Set Content-Type header from token
├─ Server: Stream file to client
└─ Response: Binary file data

STEP 8: TOKEN REFRESH (when access token expires)
├─ User sends refresh token in cookie
├─ Server: Verify refresh token
├─ Server: Check refresh token in Redis
├─ Server: Generate new access token
├─ Server: Keep refresh token in Redis
└─ Response: New access token

STEP 9: USER LOGOUT
├─ User sends logout request with refresh token
├─ Server: Verify refresh token
├─ Server: Delete refresh token from Redis
├─ Server: Clear refresh token cookie
└─ Response: Success message
```

---

## 📊 Data Flow Diagram

```
              CLIENT (Browser/Mobile)
                       │
                       │ HTTP Request
                       ▼
        ┌──────────────────────────────┐
        │   Express Server (api.js)    │
        └──────────────┬───────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │ Logging │  │Validation│ │Auth Check│
    │ (Pino)  │  │(Zod)     │  │(JWT)     │
    └─────────┘  └──────────┘  └──────────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
         ┌─────────────▼─────────────┐
         │  Route Handlers           │
         │  (Controllers)            │
         └─────────────┬─────────────┘
                       │
         ┌─────────────▼──────────────┬──────────────┐
         │                            │              │
         ▼                            ▼              ▼
    ┌─────────────┐         ┌──────────────┐  ┌──────────┐
    │User Service │         │Storage Service  │  │Security  │
    │             │         │                 │  │(JWT)     │
    └──────┬──────┘         └────────┬────────┘  └──────────┘
           │                         │
       ┌───┴──────────┬──────────────┴───┐
       │              │                  │
       ▼              ▼                  ▼
   ┌────────┐   ┌─────────┐      ┌─────────────┐
   │MongoDB │   │ Redis   │      │ Blob Store  │
   │ (User) │   │(Tokens) │      │ (Files)     │
   └────────┘   └─────────┘      └─────────────┘
       │              │                  │
       └──────────────┼──────────────────┘
                      │
              ┌───────▼────────┐
              │ JSON Response  │
              └────────────────┘
                      │
                      ▼
              CLIENT (Updated)
```

---

## 🔧 Environment Configuration

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/nodeverse

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets
ACCESS_TOKEN_SECRET=your_secret_key_here_min_32_chars
REFRESH_TOKEN_SECRET=your_refresh_secret_key_here_32_chars

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# CORS
CORS_SERVER_ADDRESS=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=52428800    # 50MB in bytes
UPLOAD_TIMEOUT=600000     # 10 minutes
```

---

## ✅ API Response Format

### Success Response
```json
{
  "status": 200,
  "data": {
    /* Response data */
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Error description"
}
```

### Status Codes
- `200` - OK / Successful
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Initialize Upload
curl -X POST http://localhost:3000/api/storage/init-upload \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "documents",
    "key": "file.pdf",
    "mimeType": "application/pdf"
  }'

# Get Download URL (for file you just uploaded)
curl -X GET "http://localhost:3000/api/storage/objects?bucket=documents&key=file.pdf" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# Download File (using the download URL from previous response)
curl -X GET "http://localhost:3000/api/storage/downloads/<DOWNLOAD_TOKEN>" \
  -o "downloaded-file.pdf"

# Advanced: Save to file with headers
curl -X GET "http://localhost:3000/api/storage/downloads/<DOWNLOAD_TOKEN>" \
  -H "Accept: application/pdf" \
  -v \
  -o "downloaded-file.pdf"
```

### Complete Upload & Download Workflow

```bash
# Step 1: Register user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }')

# Step 2: Login to get access token
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }')

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')

# Step 3: Initialize upload
INIT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/storage/init-upload \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bucket": "my-documents",
    "key": "resume.pdf",
    "mimeType": "application/pdf",
    "metadata": {
      "version": "1.0"
    }
  }')

# Extract presigned upload URL
PRESIGNED_URL=$(echo $INIT_RESPONSE | jq -r '.data.presignedUrl')

# Step 4: Upload file using presigned URL
curl -X PUT "http://localhost:3000$PRESIGNED_URL" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@resume.pdf"

# Step 5: Get download URL
DOWNLOAD_RESPONSE=$(curl -s -X GET "http://localhost:3000/api/storage/objects?bucket=my-documents&key=resume.pdf" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

# Extract download token
DOWNLOAD_TOKEN=$(echo $DOWNLOAD_RESPONSE | jq -r '.data.downloadUrl' | sed 's/.*downloads\///')

# Step 6: Download file
curl -X GET "http://localhost:3000/api/storage/downloads/$DOWNLOAD_TOKEN" \
  -o "downloaded-resume.pdf"

echo "File downloaded successfully as downloaded-resume.pdf"
```

### Testing with Postman

**For GET /api/storage/objects endpoint:**
1. Create new GET request
2. URL: `http://localhost:3000/api/storage/objects?bucket=documents&key=file.pdf`
3. Headers:
   - `Authorization: Bearer <ACCESS_TOKEN>`
4. Click Send
5. Response will contain downloadUrl

**For GET /api/storage/downloads/:token endpoint:**
1. Create new GET request
2. URL: `http://localhost:3000/api/storage/downloads/<DOWNLOAD_TOKEN>`
3. No headers required (token is the credential)
4. Click Send
5. File will download automatically

**Using Postman's Save Response Feature:**
1. Get the download URL from /objects endpoint
2. Use that URL in a new GET request to /downloads/:token
3. Click "Send and Download"
4. Postman will automatically save the file

### Using Postman
1. Create new request
2. Set method to POST
3. Enter URL
4. Add headers: `Content-Type: application/json`
5. Add body (JSON format)
6. Send request

---

## 📦 Project Structure Summary

| Component | Purpose |
|-----------|---------|
| **Models** | Database schemas (User, Object) |
| **Controllers** | Handle HTTP requests |
| **Services** | Business logic implementation |
| **Routes** | API endpoint definitions |
| **Middlewares** | Request processing (auth, validation) |
| **Helpers** | Utility functions |
| **Config** | Environment & database setup |
| **Validations** | Input schema definitions |

---

## 🎓 Learning Path

1. **Start with**: `server.js` - Understand server setup
2. **Then**: `api.js` - Learn routing
3. **Then**: `src/routes/` - Check available endpoints
4. **Then**: `src/controllers/` - See request handlers
5. **Then**: `src/services/` - Understand business logic
6. **Finally**: `src/models/` - Learn database structure

---

## 🤝 Contributing

To add new features:
1. Create new route in `src/routes/`
2. Create corresponding controller in `src/controllers/`
3. Create service logic in `src/services/`
4. Add validation in `src/validations/`
5. Add comprehensive JSDoc comments
6. Test with provided cURL commands

---

## 📝 Key Concepts Explained

### JWT (JSON Web Token)
A secure way to transmit information between client and server. It contains:
- Header (algorithm type)
- Payload (user data)
- Signature (verification)

### Bcrypt
Password hashing algorithm that:
- Converts passwords to unreadable format
- Uses salt for additional security
- Nearly impossible to reverse

### Blob Storage
Local file storage system that:
- Stores files on server disk
- Organizes files by hash ID
- Separates files from metadata

### Redis
Fast in-memory database used for:
- Storing refresh tokens
- Storing OTP codes
- Caching frequently used data

### Mongoose
MongoDB object modeling tool that:
- Defines database schemas
- Enforces data validation
- Provides query methods

---

## 🔍 File Status Values

| Status | Value | Meaning |
|--------|-------|---------|
| Pending | 0 | File uploaded but not yet active |
| Active | 1 | File upload complete, ready to use |
| Deleted | 2 | File marked for deletion |

---

## 📞 Support

For issues or questions:
1. Check error messages in logs
2. Verify `.env` configuration
3. Check database connection
4. Review API request format

---

**Happy Coding! 🚀**

Built with ❤️ using Node.js, Express, and MongoDB

