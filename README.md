# ![Quotestzy](https://pomf2.lain.la/f/bgsbisct.png)

# 🚀 Quotestzy - Web Keren Buat Quotes!

> **Demo Website:** [Klik Disini Bro!](https://quotestzy.netlify.app/)

## 🎤 Thanks To

- **Yosh Casaster** - [GitHub](https://github.com/YoshCasaster)

## ⚙️ Konfigurasi GitHub API

Biar website ini jalan lancar jaya, lo harus setup GitHub API dulu! Gas ke file:

📌 **src/context/QuoteContext.tsx**

Terus edit bagian ini sesuai akun & repo lo:

```ts
// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com/repos/USERNAME-GITHUB/NAMA-REPO/contents/NAMADB.json';
const GITHUB_TOKEN = 'TOKEN GITHUB KALIAN';
const RAW_JSON_URL = 'https://raw.githubusercontent.com/USERNAME-GITHUB/NAMA-REPO/refs/heads/master/NAMADB.json';
```

Ganti **USERNAME-GITHUB**, **NAMA-REPO**, **NAMADB.json**, dan **TOKEN GITHUB KALIAN** sesuai akun & repo lo!

## 🛠️ Cara Run Project Ini

Yuk mulai project ini dengan langkah simpel:

### 1️⃣ Clone Repo Dulu
```bash
git clone https://github.com/USERNAME-GITHUB/NAMA-REPO.git
cd NAMA-REPO
```

### 2️⃣ Install Semua Package
```bash
npm install
```

### 3️⃣ Jalankan Server Lokal
```bash
npm run dev
```

🔥 **Website lo bakal nyala di:** `http://localhost:5173/`

---

## 📦 Package yang Dipake

Ini dia dependencies kece yang bikin project ini jalan:

```json
{
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.3",
    "date-fns": "^3.3.1",
    "react-hook-form": "^7.51.0",
    "axios": "^1.6.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

---

Sekian README dari gua, semoga web lo makin mantap! 🚀🔥

