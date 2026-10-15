[![README English](https://img.shields.io/badge/README_(English)-blue?logo=readme&logoColor=fff)](README.md)
![README Indonesia](https://img.shields.io/badge/README_(Bahasa_Indonesia)-black?logo=readme&logoColor=fff)

# Sembunyikan Watermark dan Subtitle Bilibili.tv

Ini adalah userscript untuk hide watermark and subtitle (takarir) di bilibili.tv (karena bilibili tidak bisa tutup subtitle) pakai shortcut. Bisa juga ganti bahasa subtitle pakai shortcut.

## Fitur (sejauh ini)

* Sembuyiin watermark
* Sembunyiin/tunjukin subtitles (takarir)
    * entah kenapa fitur sebasic ini ga ada 🙂
* Ganti antara bahasa subtitles dengan cepat
* Ganti waktu seek/lompat video waktu pas tekan tanda panah kiri/kanan (aslinya 10 detik)

## Shortcut

Shortcut dan kondisi watermark (disembuyiin atau tidak) bisa diubah dari bagian atas kode, tapi ini settingan default-nya:
* `c`: sembunyikan/tunjukkan subtitle
* `v`: ganti ke subtitle bahasa selanjutnya di list subtitle (kembali ke pilihan pertama kalau dari subtitle terakhir)
* `shift+v`: ganti ke subtitle bahasa sebelumnya di list subtitle (kembali ke pilihan terakhir kalau dari subtitle pertama)

## Install

NB: karena ini userscript, jadi hanya bisa dipakai di versi web bilibili (bilibili.tv). Tidak bisa di mobile app.

1. Install Tampermonkey
2. Install userscript dari salah satu link di bawah ini:
    * GitHub: https://raw.githubusercontent.com/RealNath/bilibili-bstation-tweaks/refs/heads/main/bilibili-settings.user.js
    * Greasy Fork: https://greasyfork.org/id/scripts/600322?locale_override=1
