    // Fungsi untuk menentukan kategori tekanan darah
    function getKategoriTensi(sistolik, diastolik) {
      if (sistolik < 120 && diastolik < 80) {
        return { kategori: 'Normal', deskripsi: 'Tekanan darah normal. Pertahankan gaya hidup sehat!', warna: 'text-green-600' };
      } else if (sistolik <= 129 && diastolik <= 84) {
        return { kategori: 'Elevated', deskripsi: 'Tekanan darah sedikit tinggi. Pantau rutin.', warna: 'text-yellow-600' };
      } else if (sistolik <= 139 || diastolik <= 89) {
        return { kategori: 'Hipertensi Tahap 1', deskripsi: 'Tekanan darah tinggi tahap 1. Konsultasi dokter.', warna: 'text-yellow-600' };
      } else if (sistolik >= 140 || diastolik >= 90) {
        return { kategori: 'Hipertensi Tahap 2', deskripsi: 'Tekanan darah tinggi tahap 2. Segera konsultasi dokter.', warna: 'text-red-600' };
      } else if (sistolik > 180 || diastolik > 120) {
        return { kategori: 'Krisis Hipertensi', deskripsi: 'Tekanan darah sangat tinggi! Cari perawatan medis.', warna: 'text-red-600' };
      }
    }

    // Fungsi untuk menyimpan data
    function simpanData() {
      const sistolik = parseInt(document.getElementById('sistolik').value);
      const diastolik = parseInt(document.getElementById('diastolik').value);
      const hasilDiv = document.getElementById('hasil');
      const kategoriP = document.getElementById('kategori');
      const deskripsiP = document.getElementById('deskripsi');

      if (isNaN(sistolik) || isNaN(diastolik)) {
        hasilDiv.classList.remove('hidden');
        kategoriP.textContent = 'Error';
        kategoriP.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
        kategoriP.classList.add('text-red-600');
        deskripsiP.textContent = 'Harap masukkan nilai sistolik dan diastolik yang valid.';
        return;
      }

      const kategoriTensi = getKategoriTensi(sistolik, diastolik);
      hasilDiv.classList.remove('hidden');
      kategoriP.textContent = kategoriTensi.kategori;
      kategoriP.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
      kategoriP.classList.add(kategoriTensi.warna);
      deskripsiP.textContent = kategoriTensi.deskripsi;

      // Simpan ke localStorage
      const data = {
        sistolik,
        diastolik,
        kategori: kategoriTensi.kategori,
        timestamp: new Date().toLocaleString('id-ID')
      };
      let riwayat = JSON.parse(localStorage.getItem('bloodPressureHistory')) || [];
      riwayat.unshift(data);
      localStorage.setItem('bloodPressureHistory', JSON.stringify(riwayat));

      // Reset input
      document.getElementById('sistolik').value = '';
      document.getElementById('diastolik').value = '';

      // Update riwayat
      tampilkanRiwayat();
    }

    // Fungsi untuk menampilkan riwayat
    function tampilkanRiwayat() {
      const riwayatDiv = document.getElementById('riwayat');
      let riwayat = JSON.parse(localStorage.getItem('bloodPressureHistory')) || [];
      riwayatDiv.innerHTML = '';

      if (riwayat.length === 0) {
        riwayatDiv.innerHTML = '<p class="text-sm text-gray-500 text-center">Belum ada riwayat pengukuran.</p>';
        return;
      }

      riwayat.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = `history-card p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center`;
        card.innerHTML = `
          <div>
            <p class="text-sm font-medium text-gray-800">${item.sistolik}/${item.diastolik} mmHg - ${item.kategori}</p>
            <p class="text-xs text-gray-500">${item.timestamp}</p>
          </div>
          <button onclick="hapusItem(${index})" class="text-red-500 hover:text-red-700 text-sm">Hapus</button>
        `;
        riwayatDiv.appendChild(card);
      });
    }

    // Fungsi untuk menghapus item riwayat
    function hapusItem(index) {
      let riwayat = JSON.parse(localStorage.getItem('bloodPressureHistory')) || [];
      riwayat.splice(index, 1);
      localStorage.setItem('bloodPressureHistory', JSON.stringify(riwayat));
      tampilkanRiwayat();
    }

    // Fungsi untuk menghapus semua riwayat
    function hapusRiwayat() {
      localStorage.removeItem('bloodPressureHistory');
      tampilkanRiwayat();
    }

    // Tampilkan riwayat saat halaman dimuat
    window.onload = tampilkanRiwayat;
