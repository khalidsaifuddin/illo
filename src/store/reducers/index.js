import {combineReducers} from 'redux';
import App from './App.reducers';
import Pertanyaan from './Pertanyaan.reducers';
import Notifikasi from './Notifikasi.reducers';
import Ruang from './Ruang.reducers';
import Kuis from './Kuis.reducers';
import Ref from './Ref.reducers';
import Aktivitas from './Aktivitas.reducers';
import Sekolah from './Sekolah.reducers';
import Guru from './Guru.reducers';
import Tugas from './Tugas.reducers';
import Poin from './Poin.reducers';
import Pesan from './Pesan.reducers';

const rootReducer = combineReducers({
    App,
    Pertanyaan,
    Notifikasi,
    Ruang,
    Kuis,
    Ref,
    Aktivitas,
    Sekolah,
    Guru,
    Tugas,
    Poin,
    Pesan
});

export default rootReducer;
