# Affiliate Portal Backend

A **Node.js** (v23.7.0) and **Express** backend that powers the Affiliate Portal — handling **user registration**, **login**, **affiliate creation**, and **dashboard data** (commissions, payouts, referrals, and more) via APIs.  
The backend also connects to a **MongoDB** database for storing and managing all user and affiliate data.

## Features

- **User Authentication**
  - Register new affiliates
  - Secure login with token-based authentication (e.g., JWT if you’re using it)

- **Affiliate Management**
  - Automatically create and manage affiliate profiles
  - Fetch and update affiliate data via APIs

- **Dashboard APIs**
  - **Visitor Count API** – track visitors linked to affiliates
  - **Lead Count API** – track leads generated
  - **Conversion Count API** – track successful conversions
  - **Commission API** – show total commissions earned
  - **Payout API** – manage payout history
  - **Referral API** – display referred users and statuses

- **Frontend Integration**
  - Provides all APIs used by the **Vue 3** frontend

## Tech Stack

- **Backend:** Node.js v23.7.0, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **API Style:** RESTful

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/varindervaid/propertyprosmarketing_backend.git
   ```

2. Navigate to the project folder:
   ```bash
   cd propertyprosmarketing_backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root and add the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. Start the server:
   ```bash
   npm start
   ```

   (or for production)
   ```bash
   npm start
   ```
