# 💎 Diaspark Retail POS Software

A modern Point-of-Sale (POS) web application for retail jewelry stores, built with React + Vite frontend and Python Flask backend.

## 🌐 Live Demo

> 🔗 **[Click here to open the website](https://diaspark-retail-pos-softwear.vercel.app)**  
> *(Update this link with your actual Vercel URL)*

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Backend | Python Flask |
| Database | Microsoft SQL Server |
| Hosting | Vercel (Frontend) |

## ✨ Features

- 🛒 Sales & POS transactions
- 👤 Customer management
- 📦 Inventory & SKU lookup
- 💳 Payment processing (Cash, Card, Gift Certificate)
- 📊 Reports (Sales, Tax, Tender Summary, Salesperson)
- 🔧 Repair & Special Orders
- 🔐 Login with Email & Google OAuth

## 🚀 Local Development

### Frontend
```bash
cd diaspark-retail
npm install
npm run dev
```

### Backend
```bash
cd backend-python
pip install flask flask-cors pyodbc
python app.py
```

## 📁 Project Structure

```
DIASPARK UI/
├── diaspark-retail/        # React Frontend
│   ├── src/
│   │   ├── components/     # All UI components
│   │   ├── config.js       # API URL config
│   │   └── main.jsx
│   └── vercel.json
├── backend-python/         # Python Flask API
│   └── app.py
└── Database_MS_SQL.sql     # SQL Server schema
```

---
Made with ❤️ by Krish Parashar
