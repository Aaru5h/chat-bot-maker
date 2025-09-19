# MongoDB Atlas Setup for Netlify Deployment

## Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new project (e.g., "ChatBot Maker")

## Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to your users)
4. Name your cluster (e.g., "chatbot-cluster")
5. Click "Create Cluster"

## Step 3: Create Database User
1. In the Security section, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access
1. In the Security section, click "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)

## Step 6: Configure Environment Variables

### For Local Development (.env.local)
Create a `.env.local` file in your project root:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=chatbot-maker
JWT_SECRET=your_super_secure_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### For Netlify Deployment
1. Go to your Netlify dashboard
2. Select your deployed site
3. Go to "Site Settings" → "Environment Variables"
4. Add these variables:
   - `MONGODB_URI`: Your connection string from Step 5
   - `MONGODB_DB`: `chatbot-maker`
   - `JWT_SECRET`: Generate a secure random string
   - `GEMINI_API_KEY`: Your Google Gemini API key

## Step 7: Test the Connection
After setting up the environment variables, your authentication should work on Netlify!

## Database Collections
The app will automatically create these collections:
- `users` - User accounts with hashed passwords
- `chatbots` - Chatbot configurations with context

## Security Notes
- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens are used for authentication
- ✅ MongoDB credentials are environment variables only
- ✅ Database access is restricted by user permissions

## Troubleshooting
- **Connection Issues**: Make sure IP is whitelisted (0.0.0.0/0)
- **Authentication Failed**: Double-check username/password in connection string
- **Environment Variables**: Ensure they're set in both local `.env.local` and Netlify settings