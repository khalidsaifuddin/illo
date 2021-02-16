
// import HomePage from '../pages/home.jsx';
// import loadable from '@loadable/component'

import Beranda from '../pages/Beranda';
import ProfilPengguna from '../pages/ProfilPengguna';
import login from '../pages/login';

import LeftPage1 from '../pages/left-page-1.jsx';
import LeftPage2 from '../pages/left-page-2.jsx';
import NotFoundPage from '../pages/404.jsx';

import tampilPertanyaan from '../pages/Pertanyaan/tampilPertanyaan';
import pantauan from '../pages/Pertanyaan/pantauan';
import jawabPertanyaan from '../pages/Pertanyaan/jawabPertanyaan';
import notifikasi from '../pages/Notifikasi/notifikasi';
import BerandaGuru from '../pages/BerandaGuru';
import tampilPengguna from '../pages/Pengguna/tampilPengguna';
import BerandaEmpu from '../pages/BerandaEmpu';
import Pricing from '../pages/Pricing';
import daftar from '../pages/daftar';
import BerandaSekolah from '../pages/Sekolah/BerandaSekolah';
import kodeSekolah from '../pages/Sekolah/kodeSekolah';
import daftarGuru from '../pages/Sekolah/daftarGuru';
import buatKodeSekolah from '../pages/Sekolah/buatKodeSekolah';
import gabungSekolah from '../pages/Sekolah/gabungSekolah';
import pengaturanSekolah from '../pages/Sekolah/pengaturanSekolah';
import pengaturanPengguna from '../pages/Pengguna/pengaturanPengguna';
import gantiGambar from '../pages/Pengguna/gantiGambar';
import Leaderboard from '../pages/Poin/Leaderboard';
import LeaderboardGlobal from '../pages/Poin/LeaderboardGlobal';
import ppdbLumajang from '../pages/PPDB/ppdbLumajang';
import DepositSiswa from '../pages/Keuangan/DepositSiswa';
import TopUpDeposit from '../pages/Keuangan/TopUpDeposit';
import RiwayatDeposit from '../pages/Keuangan/RiwayatDeposit';
import UnitUsaha from '../pages/UnitUsaha/UnitUsaha';
import Pesan from '../pages/Pesan/Pesan';
import TampilPesan from '../pages/Pesan/TampilPesan';
import JenisTiket from '../pages/DataMaster/JenisTiket';
import DataMaster from '../pages/DataMaster/DataMaster';
import FormJenisTiket from '../pages/DataMaster/FormJenisTiket';
import Unit from '../pages/DataMaster/Unit';
import FormUnit from '../pages/DataMaster/FormUnit';
import DaftarTiket from '../pages/Tiket/DaftarTiket';
import FormTiket from '../pages/Tiket/FormTiket';
import TampilTiket from '../pages/Tiket/TampilTiket';
import KelolaTiket from '../pages/Tiket/KelolaTiket';
import AnggotaUnit from '../pages/DataMaster/AnggotaUnit';
import FormAnggotaUnit from '../pages/DataMaster/FormAnggotaUnit';
import KategoriProduk from '../pages/DataMaster/KategoriProduk';
import FormKategoriProduk from '../pages/DataMaster/FormKategoriProduk';

// console.log(localStorage.getItem('kode_aplikasi'));

var routes = [
  {
    path: '/',
    component:  (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) ? 
                  (localStorage.getItem('kode_aplikasi') === 'MEJA'  ? 
                    Beranda : 
                    (localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' ? 
                      BerandaGuru : 
                      BerandaEmpu
                    )
                  ) : 
                  BerandaSekolah,
  },
  {
    path: '/PPDB-Lumajang/:pengguna_id/:sekolah_id',
    component: ppdbLumajang 
  },
  {
    path: '/PPDB-Lumajang/:pengguna_id/:sekolah_id/:override',
    component: ppdbLumajang 
  },
  {
    path: '/SakuSiswa/:sekolah_id',
    component: DepositSiswa 
  },
  {
    path: '/UnitUsaha/:sekolah_id',
    component: UnitUsaha 
  },
  {
    path: '/TopUp/:pengguna_id/:sekolah_id',
    component: TopUpDeposit 
  },
  {
    path: '/RiwayatTransaksi/:pengguna_id/:sekolah_id',
    component: RiwayatDeposit
  },
  {
    path: '/Leaderboard',
    component: Leaderboard
  },
  {
    path: '/Pesan',
    component: Pesan
  },
  {
    path: '/TampilPesan/:kelompok_pesan_id',
    component: TampilPesan
  },
  {
    path: '/LeaderboardGlobal',
    component: LeaderboardGlobal
  },
  {
    path: '/Pricing',
    component: Pricing,
    keepAlive: true
  },
  {
    path: '/pantauan/:pengguna_id',
    component: pantauan
  },
  {
    path: '/tampilPertanyaan/:pertanyaan_id',
    component: tampilPertanyaan
  },
  {
    path: '/jawabPertanyaan/:pertanyaan_id',
    component: jawabPertanyaan
  },
  {
    path: '/buatKodeSekolah/:sekolah_id',
    component: buatKodeSekolah
  },
  {
    path: '/notifikasi',
    component: notifikasi
  },
  {
    path: '/login',
    component: login,
  },
  {
    path: '/login/:param_1/:param_2',
    component: login,
  },
  {
    path: '/daftar/',
    component: daftar,
  },
  {
    path: '/daftar/:param_1/:param_2',
    component: daftar,
  },
  {
    path: '/ProfilPengguna',
    component: ProfilPengguna,
    // keepAlive: true,
  },
  {
    path: '/BerandaSekolah/',
    component: BerandaSekolah
  },
  {
    path: '/BerandaSekolah/:sekolah_id',
    component: BerandaSekolah
  },
  {
    path: '/gabungSekolah/',
    component: gabungSekolah
  },
  {
    path: '/kodeSekolah/:sekolah_id/:undangan_sekolah_id',
    component: kodeSekolah
  },
  {
    path: '/daftarGuru/:sekolah_id',
    component: daftarGuru
  },
  {
    path: '/pengaturanSekolah/:sekolah_id',
    component: pengaturanSekolah
  },
  {
    path: '/tampilPengguna/:pengguna_id',
    component: tampilPengguna,
    // keepAlive: true,
  },
  {
    path: '/ProfilPengguna/:pengguna_id',
    component: ProfilPengguna,
    // keepAlive: true,
  },
  {
    path: '/gantiGambar/:pengguna_id',
    component: gantiGambar
  },
  {
    path: '/pengaturanPengguna/:pengguna_id/:sekolah_id',
    component: pengaturanPengguna,
  },
  {
    path: '/KategoriProduk/',
    component: KategoriProduk,
  },
  {
    path: '/FormKategoriProduk/',
    component: FormKategoriProduk,
  },
  {
    path: '/FormKategoriProduk/:kategori_produk_id',
    component: FormKategoriProduk,
  },
  {
    path: '/JenisTiket/',
    component: JenisTiket,
  },
  {
    path: '/FormJenisTiket/',
    component: FormJenisTiket,
  },
  {
    path: '/FormJenisTiket/:jenis_tiket_id',
    component: FormJenisTiket,
  },
  {
    path: '/FormJenisTiket/:jenis_tiket_id/:induk_jenis_tiket_id',
    component: FormJenisTiket,
  },
  {
    path: '/Unit/',
    component: Unit,
  },
  {
    path: '/FormUnit/',
    component: FormUnit,
  },
  {
    path: '/FormUnit/:unit_id',
    component: FormUnit,
  },
  {
    path: '/AnggotaUnit/:unit_id',
    component: AnggotaUnit,
  },
  {
    path: '/FormAnggotaUnit/:unit_id',
    component: FormAnggotaUnit,
  },
  {
    path: '/FormUnit/:unit_id/:induk_unit_id',
    component: FormUnit,
  },
  {
    path: '/DataMaster/',
    component: DataMaster,
  },
  {
    path: '/DaftarTiket/',
    component: DaftarTiket,
  },
  {
    path: '/DaftarTiket/:pengguna_id',
    component: DaftarTiket,
  },
  {
    path: '/KelolaTiket/',
    component: KelolaTiket,
  },
  {
    path: '/FormTiket/',
    component: FormTiket,
  },
  {
    path: '/TampilTiket/:tiket_id',
    component: TampilTiket,
  },
  {
    path: '/left-page-1/',
    component: LeftPage1,
  },
  {
    path: '/left-page-2/',
    component: LeftPage2,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
