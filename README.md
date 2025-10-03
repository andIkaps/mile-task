# README - Frontend (Vue.js)

## Apa yang Saya Bangun

Saya membuat frontend sederhana menggunakan **Vue 3 + Vue Router** untuk konsumsi mock API yang sudah dibuat dengan `json-server`.
Modul ini punya dua fitur utama:

1. **Authentication** → halaman login untuk simulasi masuk dengan username dan password.
2. **Task Management** → halaman CRUD (Create, Read, Update, Delete) untuk mengelola tasks.

Struktur dasarnya:

-   `/auth/login` → form login, validasi sederhana, simpan token mock ke localStorage.
-   `/tasks` → daftar semua tasks dengan pagination, filter, sorting, dan search.
-   `/tasks/new` → form tambah task baru.
-   `/tasks/:id/edit` → form edit task.

---

## Design Decisions

-   **Vue 3 dengan `<script setup>`** → lebih ringkas dan modern, sesuai best practice terbaru.
-   **Vue Router** → dipakai untuk navigasi antar halaman (login, task list, task form).
-   **Pinia (opsional)** → untuk manajemen state session user (simpan user login & token).
-   **Axios** → untuk komunikasi dengan mock API.
-   Struktur komponen dipisah jadi `Base` components (misalnya `BaseTable.vue`, `BaseInput.vue`) supaya gampang dipakai ulang.

---

## Strengths of the Module

-   **Mirip aplikasi nyata** → sudah ada login, proteksi route, dan integrasi CRUD ke API.
-   **Reusable components** → input, form, dan table bisa dipakai di modul lain.
-   **Integrasi mulus dengan API** → endpoint dari mock API langsung dipakai lewat Axios.
-   **Mudah di-deploy** → tinggal `npm run build`, hasil dist bisa langsung di-hosting di Netlify/Vercel.

---

## Database Indexes (Relevansi ke Frontend)

Frontend ini sangat terbantu dengan index di database:

-   Search text (`title`, `description`, `priority`) lebih cepat → hasil pencarian langsung muncul tanpa delay.
-   Sorting `createdAt` bikin daftar task tampil rapi sesuai kebutuhan user.
-   Filter `createdBy` efisien → tiap user hanya lihat task miliknya.
-   Unique index di `users.username` memastikan login tidak membingungkan karena gak ada user duplikat.

---

# Test Users (Credentials for manual testing)

Gunakan akun berikut untuk mencoba endpoint login (`POST /api/v1/login`):

1. **User 1**

-   username: `andIkaps`
-   password: `m1leTask#`

2. **User 2**

-   username: `kazuma`
-   password: `m1leTask#`

---

## Penutup

Dengan kombinasi Vue.js di frontend dan mock API berbasis json-server di backend, developer frontend bisa mengembangkan UI yang kaya fitur sekaligus siap dihubungkan ke backend nyata di masa depan.
