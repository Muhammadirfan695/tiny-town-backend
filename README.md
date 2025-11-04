# 🎉 LocalBites API

**LocalBites API** is a backend service built with **Node.js**, **Express**, and **Sequelize (PostgreSQL)**.  
It powers the LocalBites platform — handling users, roles, categories, templates, subscriptions, and more.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** (JWT-based)
- 👤 **User Management** with Role & Category linking
- 💳 **Subscription System** integrated with Stripe & Odero
- 🖼️ **Template Management** for invitations and themes
- 📦 **Product & Shop Management**
- 🌍 **Localization Ready**
- 🧾 **Sequelize ORM** with migration & seeder support
- 🧰 **Swagger API Documentation**
- 🕒 **Scheduled Jobs** (node-cron)
- 🪶 **Environment-based Configuration**

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **ORM** | Sequelize |
| **Database** | PostgreSQL |
| **Authentication** | JWT (JSON Web Token) |
| **Payments** | Stripe / Odero |
| **API Docs** | Swagger |
| **Scheduler** | node-cron |
| **Environment Config** | dotenv |

---





## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone git@bitbucket.org:technodev_hamza/bdaybee-apis.git
cd localbites-apis


npm install

# ========================
# SERVER CONFIGURATION
# ========================
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# ========================
# DATABASE CONFIGURATION
# ========================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dbname
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SSL=false
DB_SYNC=false

# ========================
# CORS & SECURITY
# ========================
ALLOWED_ORIGINS=*
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# ========================
# FILE UPLOADS
# ========================
MAX_FILE_SIZE=50

# ========================
# RATE LIMITING
# ========================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ========================
# LOGGING
# ========================
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ========================
# EMAIL SERVICE (Optional)
# ========================
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
SMTP_FROM="LocalBites <no-reply@yourdomain.com>"

# ========================
# EXTERNAL APIS (Optional)
# ========================
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

API_KEY=your_external_api_key
API_SECRET=your_external_api_secret

GOOGLE_CLIENT_ID=your_google_client_id

# ========================
# URL CONFIGURATION
# ========================
BASE_URL=http://localhost:5000/
CLIENT_URL=http://localhost:3000/

# ========================
# API KEYS (Internal)
# ========================
X_API_KEY=localbitesuser
X_API_ADMIN_KEY=localbitesadmin

# Command for migrations
npx sequelize db:migrate

# Command for Seed Data

npx sequelize-cli db:seed:all

# Start Server
npm run dev
# or
nodemon app.js