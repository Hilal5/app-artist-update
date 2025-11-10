# Portfolio Website untuk Digital Artist

<div align="center">
  <h3>Platform Portfolio Open-Source untuk Digital Artist & Freelancer</h3>
  <p>Website portfolio interaktif yang dibangun dengan Laravel framework untuk membantu digital artist menampilkan karya dan mengelola komisi</p>
</div>

---

## 📋 Tentang Project

Platform portfolio web ini dikembangkan sebagai solusi open-source untuk membantu digital artist dan freelancer dalam:
- Menampilkan portfolio karya digital mereka
- Mengelola sistem komisi dan pesanan
- Berinteraksi dengan klien melalui sistem chat terintegrasi
- Membangun reputasi melalui sistem review dan rating

Project ini dikembangkan menggunakan metodologi Research & Development dengan pendekatan ADDIE (Analysis, Design, Development, Implementation, Evaluation).

---

## 📸 Screenshot Aplikasi

### 1. Halaman Utama - Dashboard
![Dashboard](img-ss/1.png)

### 2. About
![interface about](img-ss/2.png)

### 3. Found artist link
![interfcae link artist](img-ss/3.png)

### 4. work project
![portifolio work project](img-ss/4.png)

### 5. Commsisions
![interface commsissions](img-ss/5.png)

### 6. Ratting adn review
![interface review](img-ss/6.png)

### 7. Admin manage review
![interface manage review](img-ss/7.png)

### 8. Chat fitur realtime
![realtime chat](img-ss/8.png)

### 9. faq
![interface faq](img-ss/9.png)

### 10. contact
![realtime chat](img-ss/10.png)


## ✨ Fitur Utama

### Untuk Artist
- 🎨 **Portfolio Management** - Upload dan kelola karya digital dengan galeri interaktif
- 💼 **Sistem Komisi** - Terima dan kelola pesanan komisi dari klien
- 💬 **Live Chat** - Komunikasi real-time dengan klien
- ⭐ **Review & Rating** - Sistem review untuk membangun kredibilitas
- 👤 **Profile Kustomisasi** - Personalisasi halaman profile artist
- 📊 **Dashboard Analytics** - Pantau performa dan statistik portfolio

### Untuk Klien/Pengunjung
- 🔍 **Browse Artists** - Temukan artist berdasarkan style dan spesialisasi
- 📝 **Request Komisi** - Buat permintaan komisi dengan detail lengkap
- 💳 **Sistem Pembayaran** - Proses transaksi yang aman
- ⭐ **Leave Reviews** - Berikan rating dan review untuk artist
- 🔔 **Notifikasi** - Update real-time untuk status komisi

### Untuk Admin
- 👥 **User Management** - Kelola user, artist, dan konten
- 📊 **Dashboard Admin** - Monitoring aktivitas platform
- 🚫 **Moderasi Konten** - Review dan moderasi karya yang diupload
- 📈 **Reports & Analytics** - Laporan lengkap aktivitas platform

---

## 🛠️ Teknologi yang Digunakan

- **Backend Framework:** Laravel 12.x
- **Frontend:** Blade Templates, CSS, JavaScript
- **Database:** MySQL
- **Authentication:** Laravel
- **File Storage:** Laravel Storage
- **Real-time Features:** Laravel Echo
- **Animation css**

---

## 📦 Instalasi

### Prasyarat
- PHP >= 8.4
- Composer
- MySQL >= 8.4
- Node.js & NPM
- Git

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/username/portfolio-artist-laravel.git
cd portfolio-artist-laravel
```

2. **Install Dependencies**
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

3. **Setup Environment**
```bash
# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate
```

4. **Konfigurasi Database**

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=username_database
DB_PASSWORD=password_database
```

5. **Migrasi Database**
```bash
# Jalankan migrasi
php artisan migrate

# (Optional) Jalankan seeder untuk data dummy
php artisan db:seed
```

6. **Setup Storage**
```bash
# Create symbolic link untuk storage
php artisan storage:link
```

7. **Compile Assets**
```bash
# Development
npm run dev

# Production
npm run build
```

8. **Jalankan Aplikasi**
```bash
# Start development server
php artisan serve
```

Aplikasi dapat diakses di `http://localhost:8000`

---

## 🚀 Deployment

### Persiapan Production

1. **Set Environment ke Production**
```env
APP_ENV=production
APP_DEBUG=false
```

2. **Optimize Application**
```bash
# Cache konfigurasi
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

3. **Compile Assets untuk Production**
```bash
npm run build
```

### Hosting Options
- VPS (Hostinger, DigitalOcean, dll)
- Shared Hosting dengan PHP support
- Platform-as-a-Service (Railway, Heroku, dll)

---

## 📁 Struktur Project

```
portfolio-artist-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Controllers
│   │   └── Middleware/       # Custom middleware
│   ├── Models/               # Eloquent models
│   └── Services/             # Business logic
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── public/
│   ├── css/                  # Compiled CSS
│   ├── js/                   # Compiled JavaScript
│   └── uploads/              # User uploads
├── resources/
│   ├── views/                # Blade templates
│   ├── css/                  # Source CSS
│   └── js/                   # Source JavaScript
├── routes/
│   ├── web.php               # Web routes
└── storage/
    └── app/
        └── public/           # Public storage
```

---

## 🎯 Roadmap & Future Development

- [ ] Implementasi sistem pembayaran still manual 
- [ ] Notifikasi real-time
- [ ] Mobile responsive optimization
- [ ] mobile app
- [ ] Social media integration
- [ ] Portfolio dashboard

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 Lisensi

Project ini dikembangkan untuk keperluan penelitian tugas akhir dan bersifat open-source. Anda bebas menggunakan, memodifikasi, dan mendistribusikan dengan tetap mencantumkan kredit kepada pengembang asli.

---

## 👨‍💻 Pengembang

Dikembangkan oleh **Hilal** sebagai bagian dari penelitian tugas akhir.

---

## 🙏 Acknowledgments

- Laravel Framework
- CSS
- Javascript
- Komunitas digital artist Indonesia

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk komunitas digital artist</p>
  <p>⭐ Star project ini jika bermanfaat!</p>
</div>
