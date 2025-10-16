import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// 🔧 Ganti dengan konfigurasi Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyC1DYsawwaP8jJUdKh2TWhwxncXUSbWI-s",
  authDomain: "data-pelanggan-820cb.firebaseapp.com",
  databaseURL: "https://data-pelanggan-820cb-default-rtdb.firebaseio.com",
  projectId: "data-pelanggan-820cb",
  storageBucket: "data-pelanggan-820cb.firebasestorage.app",
  messagingSenderId: "422608867033",
  appId: "1:422608867033:web:e537721ea0b6dba7fef8c8"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔔 Fungsi Notifikasi Toast
function showToast(pesan, tipe = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = pesan;
  toast.className = `show ${tipe === "success" ? "toast-success" : "toast-error"}`;

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// 🔌 Tes Koneksi Firebase
document.getElementById("btnTes").addEventListener("click", async () => {
  try {
    await get(ref(db));
    showToast("✅ Koneksi ke Firebase berhasil!", "success");
  } catch (error) {
    showToast("❌ Gagal terhubung ke Firebase", "error");
  }
});

// 💾 Simpan Data ke Database
document.getElementById("pelangganForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const telepon = document.getElementById("telepon").value;
  const waktu = document.getElementById("waktu").value;

  try {
    const pelangganRef = ref(db, "pelanggan");
    const newData = push(pelangganRef);
    await set(newData, { nama, email, telepon, waktu });

    showToast("✅ Data berhasil disimpan!", "success");
    e.target.reset();
    muatData();
  } catch (error) {
    showToast("❌ Gagal menyimpan data", "error");
  }
});

// 📦 Muat Data ke Tabel
async function muatData() {
  const tabelData = document.getElementById("tabelData");
  tabelData.innerHTML = "";
  try {
    const snapshot = await get(ref(db, "pelanggan"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.values(data).forEach((p) => {
        tabelData.innerHTML += `
          <tr>
            <td>${p.nama}</td>
            <td>${p.email}</td>
            <td>${p.telepon}</td>
            <td>${p.waktu}</td>
          </tr>
        `;
      });
    } else {
      tabelData.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data</td></tr>`;
    }
  } catch {
    showToast("❌ Gagal memuat data dari Firebase", "error");
  }
}

muatData();
