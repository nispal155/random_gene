# 💳 Account Number Generator

A modern, full-stack web application for generating unique 12-digit fictional account numbers, random 4-digit PINs, and formatted output records with MongoDB Atlas persistence.

Deployable anywhere: **Render** (Node.js Web Service) and **Vercel** (Vite + Serverless Functions).

> ⚠️ **Fictional Data Notice**: All generated account numbers, PINs, and monetary details are simulated test data created strictly for development, QA testing, and software integration purposes. They do not represent real bank accounts, balances, or payment credentials.

---

## 🌟 Key Features

1. **12-Digit Account Numbers**:
   - Always begins with the prefix `8190`.
   - Remaining 8 digits are randomly generated using Node's cryptographic random engine.
   - Guaranteed unique in MongoDB Atlas with unique index (`unique: true`) and retry logic.

2. **Automatic 4-Digit PIN Generator**:
   - Random 4-digit PIN (preserves leading zeros, e.g., `0042`, `3493`).
   - Securely hashed in MongoDB using `bcryptjs` (salt rounds: 10).
   - Displayed once during generation for copying; masked (`****`) in public lists.

3. **Numeric Amount to Words Engine**:
   - Automatically converts positive numerical amounts into lowercase English words followed by `dollars`.
   - Example: `7500000` ➔ `seven million five hundred thousand dollars`.
   - Example: `35000` ➔ `thirty five thousand dollars`.

4. **Two Distinct Output Formats (User Selectable)**:
   - **Format 1 – Claims Message**:
     ```
     AccountNumber,PIN,AccountHolderName,MainAmountInWords,ClaimsMessage
     ```
     Fixed fifth field: `unknown so please get in contact with your claims agent for further details in regards to spending rights of your funds`

   - **Format 2 – Additional Amount**:
     ```
     AccountNumber,PIN,AccountHolderName,MainAmountInWords,AdditionalAmountInWords
     ```

5. **One-Click Clean Copy**:
   - Copies the exact comma-separated output string to the clipboard without labels, prefix tags, or whitespace distortion.

6. **Records Management Dashboard**:
   - Paginated history table of saved records.
   - Real-time search by Account Number or Account Holder Name.
   - Filter records by Output Format (Format 1 vs Format 2).
   - Individual record and full page one-click copy.
   - Single-record deletion with confirmation modal.
   - Instant CSV export download.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend API**: Node.js (ES Modules), Express.js, Mongoose, Bcryptjs, Morgan.
- **Database**: MongoDB Atlas (Database: `Generator`).
- **Deployment Platforms**: Render, Vercel, Railway, Docker, Localhost.

---

## 🚀 Deployment Instructions

### Option A: Deploy on Render (Recommended for full-stack Node)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New > Web Service**.
2. Connect your repository: `https://github.com/nispal155/random_gene`.
3. Configure the settings:
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://nispalbhattarai28_db_user:ZonerBen%40%2412@cluster0.bhwlq4g.mongodb.net/Generator?retryWrites=true&w=majority`
5. Click **Deploy Web Service**. Render will build the Vite frontend into `dist/` and start Express serving both API and UI.

---

### Option B: Deploy on Vercel
1. Import repository `https://github.com/nispal155/random_gene` on Vercel.
2. In Project Settings > Environment Variables, add:
   - `MONGODB_URI` = `mongodb+srv://nispalbhattarai28_db_user:ZonerBen%40%2412@cluster0.bhwlq4g.mongodb.net/Generator?retryWrites=true&w=majority`
3. Click **Deploy**.

> ℹ️ **MongoDB Atlas Network Access**: Ensure your MongoDB Atlas cluster has `0.0.0.0/0` (Allow Access from Anywhere) enabled under **Network Access** on [cloud.mongodb.com](https://cloud.mongodb.com).

---

## 💻 Local Development Setup

### 1. Clone & Configure Environment
```bash
git clone https://github.com/nispal155/random_gene.git
cd random_gene
```

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://nispalbhattarai28_db_user:ZonerBen%40%2412@cluster0.bhwlq4g.mongodb.net/Generator?retryWrites=true&w=majority
```

### 2. Run Local Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Tests

Run the test suite:
```bash
npm test
```
