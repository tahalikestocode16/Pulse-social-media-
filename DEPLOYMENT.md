# Free Backend Deployment Guide for Pulse

Your backend is now **100% production-ready** for free cloud deployment on **Render** (Node.js + WebSockets support) with **MongoDB Atlas** (Free Database).

---

## Step 1: Create a Free MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Click **Create a Cluster** and choose the **M0 Free Tier** (512MB free forever).
3. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Under **Database Access**, create a Database User (e.g. username: `pulse_user`, password: `your_password`).
5. Click **Connect** -> **Drivers** and copy your MongoDB connection string:
   `mongodb+srv://pulse_user:your_password@cluster0.xxx.mongodb.net/pulse?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render (100% Free)
1. Push your latest code to your **GitHub** repository.
2. Go to [Render.com](https://render.com/) and sign in with GitHub.
3. Click **New +** -> **Web Service**.
4. Connect your `Pulse-social-media` GitHub repository.
5. Fill in the following settings:
   - **Name**: `pulse-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/app.js`
   - **Instance Type**: **Free**
6. Scroll down to **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `MONGO_URL` = `mongodb+srv://pulse_user:your_password@cluster0.xxx.mongodb.net/pulse?retryWrites=true&w=majority`
   - `SESSION_SECRET` = `your_random_secret_key`
   - `CLIENT_URL` = `https://your-frontend-domain.vercel.app` (or your frontend URL)
   - `CLOUD_NAME` = `your_cloudinary_cloud_name`
   - `CLOUD_API_KEY` = `your_cloudinary_api_key`
   - `CLOUD_API_SECRET` = `your_cloudinary_api_secret`
7. Click **Create Web Service**. Render will deploy your backend live with SSL (`https://pulse-backend.onrender.com`).

---

## Step 3: Connect Frontend to Deployed Backend
Update your frontend API requests and Socket.io connection URL to point to your live Render URL:
`https://pulse-backend.onrender.com`
