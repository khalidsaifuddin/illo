// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';

// Init F7 Vue Plugin
Framework7.use(Framework7React)

//localStorage config
// localStorage.setItem('api_base','http://118.98.166.82:8881');
localStorage.setItem('api_base','http://117.53.47.43:8085');
// localStorage.setItem('api_base','http://117.53.47.43:8090');
// localStorage.setItem('google_api','188472097829-4h5peopg70ndp9g1p9seg1abgkg64ot4.apps.googleusercontent.com');

// // 026100
if(localStorage.getItem('kode_aplikasi') === 'MEJA'){
  
  // localStorage.setItem('google_api','582957663393-j04718ubtpq1ink0gicc5811jm6int7a.apps.googleusercontent.com');
  // localStorage.setItem('google_api','582957663393-qn8160pfr7fcgedsa00u56vc9mjl01lc.apps.googleusercontent.com');
  // localStorage.setItem('google_api','582957663393-mq35tdi3g211gsrfgggqp38pkhntm6gi.apps.googleusercontent.com');
  
  localStorage.setItem('google_api','582957663393-9iopgg1630qddhvpaa2lecjiol3cl2ce.apps.googleusercontent.com');

  localStorage.setItem('judul_aplikasi','IRIS');
  localStorage.setItem('sub_judul_aplikasi','IRIS (Illo Retail Integrated System)');
  localStorage.setItem('kode_aplikasi','MEJA');
  localStorage.setItem('tema_warna_aplikasi','biru-1');
  localStorage.setItem('wilayah_aplikasi','');
  localStorage.setItem('kode_wilayah_aplikasi','026100');
  localStorage.setItem('id_level_wilayah_aplikasi','2');
  localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
  localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
  localStorage.setItem('versi_aplikasi','2020.02.01');
  localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
  localStorage.setItem('socket_url',"https://socket.diskuis.id");
  localStorage.setItem('device','web');
  localStorage.setItem('versi','1.0.0');
}

localStorage.setItem('google_api','908643350959-ml0o4a08iqa99cqqd4vjj1qoojhmnfsq.apps.googleusercontent.com');
localStorage.setItem('api_base','http://illobackend:8888');
// localStorage.setItem('socket_url',"http://localhost:5000");
// localStorage.setItem('google_api', '582957663393-hlr6l0a2oendcq6ul13n9pasi88mb7bc.apps.googleusercontent.com');

// localStorage.setItem('device','android');
localStorage.setItem('device','web');

document.title = localStorage.getItem('judul_aplikasi') + " - " + localStorage.getItem('sub_judul_aplikasi');

if(localStorage.getItem('sudah_login') === null ||localStorage.getItem('sudah_login') === ''){
  localStorage.setItem('sudah_login', '0');
}

if(localStorage.getItem('riwayat_kata_kunci') === null){
  localStorage.setItem('riwayat_kata_kunci', '');
}

// Mount React App
ReactDOM.render(
  <Provider store={store}>
    {React.createElement(App)}
  </Provider>,
  document.getElementById('app'),
);