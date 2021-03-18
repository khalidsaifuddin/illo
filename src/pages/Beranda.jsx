import React, {Component} from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  Card,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Icon,
  SkeletonText,
  CardHeader,
  CardContent,
  CardFooter,
  Subnavbar,
  ListItemContent,
  Badge,
  ListInput,
  Popover, Progressbar
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';
import { getSPMKabupatenPerKecamatan, getGtkJenisPie, daftar } from '../store/actions';

import io from 'socket.io-client';

import moment from 'moment';
import ruang from './Ruang/ruang';
import AktivitasReducer from '../store/reducers/Aktivitas.reducers';

import localForage from 'localforage';

import { Offline, Online } from "react-detect-offline";
import AktivitasSosial from './AktivitasSosial';

class Beranda extends Component {

  state = {
    error: null,
    loading: true,
    data: {
      r_kelas: [],
      perpustakaan: []
    },
    pertanyaan: {
      rows: [],
      total: 0
    },
    users: [],
    loadingPertanyaan: true,
    notifikasi: {
      rows: [],
      total: 0
    },
    linimasa: {
      rows: [],
      total: 0
    },
    startLinimasa: 0,
    aktivitas: (localStorage.getItem('user') ? (localStorage.getItem('getAktivitas:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getAktivitas:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    startAktivitas: 0,
    mapel: (localStorage.getItem('user') ? (localStorage.getItem('getMapel:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getMapel:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : []) : [] ),
    rata_kuis: (localStorage.getItem('user') ? (localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id) && localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id) !== 'undefined' ? JSON.parse(localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {}) : {} ),
    pengaturan_pengguna: {},
    sekolah_pengguna: (localStorage.getItem('user') ? (localStorage.getItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    kuis_trending: (localStorage.getItem('user') ? (localStorage.getItem('getKuisTrending:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getKuisTrending:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    sekolah: {
      rows: [],
      total: 0
    },
    loading_kuis: {},
    unduh_kuis: {},
    kuis_tersimpan: {
      rows: [],
      total: 0
    },
    tab_aktif: 'guru',
    produk: {
      rows: [],
      total: 0
    },
    alamat_pengguna: {},
    mitra_terdekat: []
  };


  bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  gradients = [
    'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
    'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
    'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)'
  ]

  formatAngka = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  backClick = () => {

    let properti = 'beranda';
    // alert('tes');
    // console.log(this.props.f7router.url.replace("/","").replace("/",""));
    // console.log(this.props.tabBar);
    for (var property in this.props.tabBar) {
        // console.log(this.state.tabBar[property]);
        this.props.tabBar[property] = false;
    }
    if(this.props.f7router.url.replace("/","").replace("/","") !== ""){
        properti = this.props.f7router.url.replace("/","").replace("/","");
    }
    this.props.tabBar[properti] = true;

    this.props.setTabActive(this.props.tabBar);
    // console.log(this.props.tabBar.beranda);
  }   

  componentDidMount = () => {

    if(parseInt(localStorage.getItem('sudah_login')) !== 1){
      this.$f7router.navigate('/login/');
    }

    let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});

    // console.log(this.$f7route.url.split("#"));

    let arrUrl_1 = this.$f7route.url.split("#");

    if(arrUrl_1.length > 1){
      // ada url masuk
      let arrUrl_2 = arrUrl_1[1].split("/");

      // console.log(arrUrl_2);

      if(arrUrl_2[0] === 'gabungKuis'){
        // this.$f7.dialog.preloader();
        this.$f7router.navigate('/praTampilKuis/'+arrUrl_2[1]);
      }

      if(arrUrl_2[0] === 'gabungRuang'){
        // this.$f7.dialog.preloader();
        this.$f7router.navigate('/praTampilRuang/'+arrUrl_2[1]);
      }
    }else{
      // nggak ada
    }

    if(parseInt(localStorage.getItem('sudah_login')) === 1){
      
      this.setState({
        routeParamsNotifikasi: {
          pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
          start: this.state.startLinimasa,
          dibaca: "1"
        }
      },()=>{

        this.props.getKategoriProduk({...this.state.routeParams, hitung_produk: 'Y'})
        
        this.props.getNotifikasiRedisBelumDibaca({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, tipe: 'belum_dibaca'}).then((result)=>{
            
          // document.title = '(' + result.payload.total + ') Diskuis - Pendidikan Digital'
          
          this.setState({
            notifikasi: result.payload,
            routeParamsMapel: {
              limit: 5,
              trending: 'Y'
            }
          },()=>{
            
          });
  
        });

        this.props.getPengaturanPengguna(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            ...this.state,
            pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
          },()=>{

            //start of konfig sesuai pengaturan pengguna
            // console.log(this.state.pengaturan_pengguna.jenis_dasbor_id)

            if(parseInt(localStorage.getItem('baru_login')) === 1){
              
              if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.jenis_dasbor_id) === 2){
                localStorage.setItem('baru_login','0')
                this.gantiDasborGameMaster()
              }

              if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.jenis_dasbor_id) === 3){
                localStorage.setItem('baru_login','0')
                // this.gantiDasborGameMaster()
                this.$f7router.navigate('/BerandaSekolah/')
              }
              
            }
            //end of konfig sesuai pengaturan pengguna

            //cek sekolah aktifnya
            if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.tampilkan_beranda_sekolah) === 1){
              //berarti langsung nampilin beranda sekolah
              this.setState({
                routeParamsSekolah: {
                  ...this.state.routeParamsSekolah,
                  pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                  aktif: 1
                }
              },()=>{
                
                this.props.getSekolah(this.state.routeParamsSekolah).then((result)=>{
                  this.setState({
                    sekolah: this.props.sekolah
                  },()=>{
                    //dapat sekolahnya nggak?
                    if(this.state.sekolah.total > 0){

                      localStorage.setItem('sekolah_id_beranda',this.props.sekolah.rows[0].sekolah_id);
  
                      if(parseInt(this.state.pengaturan_pengguna.custom_logo_sekolah) === 1){
  
                        localStorage.setItem('custom_logo_sekolah', this.props.sekolah.rows[0].gambar_logo);
                        localStorage.setItem('custom_logo_sekolah_nama', this.props.sekolah.rows[0].nama);
  
                      }
  
                      if(localStorage.getItem('device') === 'android'){
                          window.location.reload(true);
                      }else{
                          window.location.href="/";
                      }
                      
                    }
                  });
                });
              });
            }
          });
        });

        

      });

      socket.emit('online', JSON.parse(localStorage.getItem('user')), (err) => {
        if (err) {
            //gagal
        }
      })
  
      window.addEventListener("beforeunload", (ev) => {  
          ev.preventDefault();
          // return ev.returnValue = 'Are you sure you want to close?';
          socket.emit('putus', JSON.parse(localStorage.getItem('user')), (err) => {
            if (err) {
                //gagal
            }
          })
      })

      socket.on('updateNotifikasi', (pengguna_id) => {
        
        if(JSON.parse(localStorage.getItem('user')).pengguna_id === pengguna_id){

          this.props.getNotifikasiRedisBelumDibaca({
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
            tipe: 'belum_dibaca'
          }).then((result)=>{

            // document.title = '(' + result.payload.total + ') Diskuis - Pendidikan Digital'
            
            this.setState({
              notifikasi: result.payload
            })
          })

        }

      })

      this.props.getProduk(this.state.routeParams)

      this.props.getAlamatPengguna({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, alamat_utama: 1}).then((result)=>{
        this.setState({
          alamat_pengguna: result.payload.total > 0 ? result.payload.rows[0] : {}
        },()=>{

          console.log(this.props.anggota_mitra.total)

          if(!localStorage.getItem('mitra_terdekat') || localStorage.getItem('mitra_terdekat') === ''){
            
            this.props.getMitraTerdekat({
              pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
              kode_wilayah_kecamatan: this.state.alamat_pengguna.kode_wilayah_kecamatan,
              kode_wilayah_kabupaten: this.state.alamat_pengguna.kode_wilayah_kabupaten,
              kode_wilayah_provinsi: this.state.alamat_pengguna.kode_wilayah_provinsi,
              lintang: this.state.alamat_pengguna.lintang,
              bujur: this.state.alamat_pengguna.bujur,
              jenis_mitra_id: (parseInt(this.props.anggota_mitra.total) < 1 ? 2 : (this.props.anggota_mitra.rows[0].jenis_mitra_id))
            }).then((result)=>{
              this.setState({
                mitra_terdekat: result.payload
              },()=>{
                localStorage.setItem('mitra_terdekat', JSON.stringify(result.payload))
              })
            })

          }else{
            this.setState({
              mitra_terdekat: JSON.parse(localStorage.getItem('mitra_terdekat'))
            })
          }

        })
      })

    }



  }

  // simpanPantauan = (pertanyaan_id) => {
  //   // alert(pertanyaan_id);
  //   this.setState({
  //     routeParamsPantauan: {
  //       pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
  //       pertanyaan_id: pertanyaan_id
  //     }
  //   },()=>{
  //     this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{

  //       this.props.getPertanyaan(this.state.routeParams).then((result)=>{
  //         this.setState({
  //           pertanyaan: this.props.pertanyaan,
  //           notifikasi: this.props.notifikasi,
  //           loadingPertanyaan: false,
  //         });
  //       });

  //     })
  //   });
  // }
  ikutiPengguna = (pengguna_id, aktivitas_id, index) => {
    this.setState({
        routeParamsPengikut: {
            pengguna_id: pengguna_id,
            pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
            soft_delete: 0
        },
        disabledButtonMengikuti: true
    },()=>{
        this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
          this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
            this.setState({
              aktivitas: this.props.aktivitas
            });
          });
        });
    });
  }

  stopIkutiPengguna = (pengguna_id, aktivitas_id) => {
    this.setState({
        routeParamsPengikut: {
            pengguna_id: pengguna_id,
            pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
            soft_delete: 1
        },
        disabledButtonMengikuti: true
    },()=>{
        this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
          this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
            this.setState({
              aktivitas: this.props.aktivitas
            });
          });
        });
    });
  }
  gantiDasborGameMaster = () => {
    // localStorage.setItem('google_api','582957663393-fg6kneevl669rco78u7cmgdholp3ccjp.apps.googleusercontent.com');
    localStorage.setItem('judul_aplikasi','Diskuis (Beta)');
    localStorage.setItem('sub_judul_aplikasi','Dasbor Game Master');
    localStorage.setItem('kode_aplikasi','MEJA-GURU');
    localStorage.setItem('tema_warna_aplikasi','biru-1');
    localStorage.setItem('wilayah_aplikasi','');
    localStorage.setItem('kode_wilayah_aplikasi','026100');
    localStorage.setItem('id_level_wilayah_aplikasi','2');
    localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('versi_aplikasi','2020.02.01');
    localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
    // localStorage.setItewm('socket_url',"http://socket.diskuis.id:5000");
    // localStorage.setItem('socket_url',"http://117.53.47.43:5000");

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  unduhKuis = (sesi_kuis_id, kuis_id, kode_sesi) => {
    this.setState({
      ...this.state,
      loading_kuis: {
        ...this.state.loading_kuis,
        [sesi_kuis_id]: true
      },
      unduh_kuis: {
        sesi_kuis_id: sesi_kuis_id,
        kuis_id: kuis_id,
        kode_sesi: kode_sesi
      }
    },()=>{

      this.props.getKuis(this.state.unduh_kuis).then((result)=>{
          this.setState({
            ...this.state
            // loading_kuis: {
            //   ...this.state.loading_kuis,
            //   [sesi_kuis_id]: false
            // }
          },()=>{
            // console.log(JSON.stringify(this.props.kuis).length)

            localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.props.kuis).then((valueId)=>{
              
              localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.kode_sesi, this.props.kuis).then((valueKode)=>{
                // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))
                // console.log(valueKode)
                
                let daftar_kuis_tersimpan = [];

                localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ).then((result)=>{
                  // console.log(result)
                  if(result){
                    //ada
                    daftar_kuis_tersimpan = [
                      ...result,
                      ...this.props.kuis.rows
                    ]
                  }else{
                    //tidak ada
                    daftar_kuis_tersimpan = [
                      ...this.props.kuis.rows
                    ]
                  }

                  localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, daftar_kuis_tersimpan )

                  localStorage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.state.unduh_kuis.sesi_kuis_id)

                })

                // if(typeof(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id )) !== 'undefined'){
                //   console.log('ada')
                // }else{
                //   console.log('nggak ada')
                // }


                // if(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id )){

                  // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))

                //   daftar_kuis_tersimpan = [
                //     ...localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ),
                //     ...this.props.kuis.rows
                //   ]
                // }else{
                //   daftar_kuis_tersimpan = [
                //     ...this.props.kuis.rows
                //   ]
                // } 
    
                // localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, daftar_kuis_tersimpan )
    
                // console.log(localForage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id))
                // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse(localStorage.getItem('user')).pengguna_id))
                
              })

            })



          })
      })

      setTimeout(() => {
        
        this.setState({
          ...this.state,
          loading_kuis: {
            ...this.state.loading_kuis,
            [sesi_kuis_id]: false
          }
        })

      }, 3000);

    })
  }

  gantiTabGuruSiswa = (tab_aktif) => {
    this.setState({
      tab_aktif: tab_aktif
    })
  }

  simpanKeranjang = (produk_id) => {

    this.$f7.dialog.preloader()

    this.props.simpanKeranjang({
      produk_id: produk_id,
      pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
      jumlah: 1,
      keterangan: ''
    }).then((result)=>{
      
      this.props.getKeranjang({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
        this.$f7.dialog.close()
        this.$f7.dialog.alert('Produk berhasil ditambahkan ke keranjang!', "Berhasil")
      }).catch(()=>{
        this.$f7.dialog.close()
        this.$f7.dialog.alert('Ada kesalahan di IRIS. Mohon coba kembali dalam beberapa saat!', 'Ada Kesalahan')
      })

    }).catch(()=>{
      
      this.$f7.dialog.close()
      this.$f7.dialog.alert('Ada kesalahan di IRIS. Mohon coba kembali dalam beberapa saat!', 'Ada Kesalahan')
    
    })
  }

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="Beranda" className="beranda" hideBarsOnScroll>
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Navbar 
              sliding={false} 
              // large
              className="backgroundGame navbarBeranda"
            >
                <NavLeft>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle>
                  {/* {localStorage.getItem('judul_aplikasi')} */}
                  <img src={"./static/icons/illo-logo-white.png"}  style={{height:'30px', margin:'auto', marginTop:'10px'}} />
                </NavTitle>
                {/* <NavTitleLarge style={{color:(localStorage.getItem('tema_warna_aplikasi') === 'biru-1' ? '#369CF4' : '#FA5F0C')}}>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge> */}
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.props.notifikasi_belum_dibaca.total > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.props.notifikasi_belum_dibaca.total > 0 ? "f7:bell_fill" : "f7:bell"} md={this.props.notifikasi_belum_dibaca.total > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.props.notifikasi_belum_dibaca.total > 0 && <Badge color="red">{this.props.notifikasi_belum_dibaca.total}</Badge>}
                      </Icon>
                    </Link>
                    <Link iconOnly href="/Pesan" style={{marginLeft:'0px'}}> 
                      <Icon style={{fontSize:'32px', marginLeft:'-4px'}} ios={this.props.daftar_pesan.belum_dibaca > 0 ? "f7:chat_bubble_2_fill" : "f7:chat_bubble_2"} aurora={this.props.daftar_pesan.belum_dibaca > 0 ? "f7:chat_bubble_2_fill" : "f7:chat_bubble_2"} md={this.props.daftar_pesan.belum_dibaca > 0 ? "material:chat_bubble_2_fill" : "material:chat_bubble_2"} tooltip="Pesan">
                        {this.props.daftar_pesan.belum_dibaca > 0 && <Badge color="red">{this.props.daftar_pesan.belum_dibaca}</Badge>}
                      </Icon> 
                    </Link>
                    {/* <Link iconOnly href="/Cari" style={{marginLeft:'0px'}}> 
                      <Icon ios="f7:search" tooltip="Pencarian">
                      </Icon>
                    </Link> */}
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <div className="merahAtas">

              <Row noGap>
                <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                <Col width="100" tabletWidth="100" desktopWidth="80">

                  <Offline>
                    <Card className="off_indi">
                      <CardContent>
                        Anda Sedang Offline! Anda masih dapat mengakses dan mengerjakan kuis yang telah tersimpan di aplikasi, namun beberapa fitur lain tidak akan berjalan dengan optimal sampai Anda kembali online
                      </CardContent>
                    </Card>
                  </Offline>
                  <Row noGap>
                    
                    {/* <Col width="100" tabletWidth="50" style={{paddingLeft:'8px'}}>
                      <Row>
                        <Col width="20" tabletwidth="15" desktopWidth="15">
                          <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                            <img style={{width:'50px', height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                          </Link>
                        </Col>
                        <Col width="80" tabletwidth="85" desktopWidth="85" style={{paddingLeft:'0px'}}>
                          <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                            <b style={{fontSize:'22px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                          </Link>
                          <br/>
                          <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                            <span style={{fontSize:'13px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                          </Link>
                          
                        </Col>
                        <Col width="100">
                          <br/>
                          <Row>
                            <Col width="30">
                              <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                              <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp;<b className="angkaPoin">0</b>
                              <div style={{fontSize:'10px'}}>Riwayat Poin</div>
                            </Col>
                            <Col width="30">
                              Produk Dibeli:<br/>
                              <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>cube_box</i>&nbsp;<b className="angkaPoin">0</b>
                              <div style={{fontSize:'10px'}}>Produk</div>
                            </Col>
                            <Col width="40">
                            <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Deposit Wallet<br/>
                              Rp <b style={{fontSize:'20px', fontWeight:'bold'}}>0</b>
                            </Col>
                          </Row>
                        </Col>
                        
                      </Row>
                      <Popover className="popover-menu-rata">
                        <div style={{margin:'8px'}}>Skor rata-rata adalah skor rata-rata dari total kuis yang telah Kamu ikuti</div>
                      </Popover>
                      <Popover className="popover-menu-poin">
                        <div style={{margin:'8px'}}>Poin adalah poin yang Kamu dapat dari aktivitas kamu di diskuis seperti mengerjakan kuis, membuat kuis, dll</div>
                      </Popover>
                    </Col> */}
                    

                    {/* <Col width="100">
                      <Card className="divLeaderboard" style={{marginLeft:'0px', marginRight:'0px'}}>
                        <div className="judulLeaderboard">Top 10 Leaderboard Poin</div>
                        <CardContent className="kontenLeaderboard overflowCard">
                          {this.props.leaderboard_pengguna.rows.map((optionBoard)=>{
                            return (
                              <div className="divDummy" style={{border:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #972d1e' : 'none')}}>
                                <Row noGap>
                                  <Col width="100" style={{paddingTop:'4px'}}>
                                    <div className="fotoLeaderboard" style={{backgroundImage:'url('+optionBoard.gambar+')', backgroundSize:'cover'}}>&nbsp;</div>
                                  </Col>
                                  
                                  <Col width="100" style={{paddingTop:'4px'}}>
                                    <div className="namaLeaderboard">
                                    <b style={{fontSize:'11px'}}>#{(this.props.leaderboard_pengguna.rows.indexOf(optionBoard)+1)}</b>&nbsp;
                                    <span style={{
                                      fontWeight:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'bold' : 'normal')                                      
                                    }}
                                    >{optionBoard.nama}</span>
                                    </div>
                                    <div className="poinLeaderboard">
                                      {this.formatAngka(optionBoard.poin)}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          })}
                          
                        </CardContent>
                        <CardContent style={{textAlign:'right'}}>
                          <Button onClick={()=>this.$f7router.navigate('/Leaderboard/')} className="color-theme-deeporange bawahCiri" raised fill style={{marginTop:'-8px', display:'inline-flex'}}>
                            Selengkapnya
                          </Button>
                        </CardContent>
                      </Card>
                    </Col> */}

                  </Row>

                </Col>
                <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
              </Row>


            </div>
            }
            <div className="cardAtas">
              <Row noGap>
                <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                <Col width="100" tabletWidth="100" desktopWidth="80">
              
                  <div>&nbsp;</div>
                  <Row noGap style={{marginBottom:'50px'}}>
                    
                    <Col width="100">
                        <Card>
                          <CardContent>
                            {/* <BlockTitle style={{marginLeft:'0px', marginTop:'0px', marginBottom:'8px'}}>
                              Rekomendasi Produk
                            </BlockTitle> */}
                            <Row noGap>
                              <Col width="70">
                                <h1 className="h1-beranda">Rekomendasi Produk</h1>
                              </Col>
                              <Col width="30">
                                <Button className="color-theme-teal" raised fill href="/daftarProduk/semua" style={{marginTop:'8px'}}>
                                  Semua
                                </Button>
                              </Col>
                            </Row>
                            <div className="overflowCard">
                              {this.props.produk.rows.map((option)=>{
                                return (
                                  <Card key={option.produk_id} style={{margin:'8px', minHeight:'300px', maxWidth:'200px'}}>
                                    <CardContent style={{padding:'8px'}}>
                                        <div className="gambarProduk" style={{
                                            backgroundImage:'url('+localStorage.getItem('api_base')+(option.gambar_produk.length > 0 ? option.gambar_produk[0].nama_file : '/assets/berkas/3577232-1.jpg')+')', 
                                            backgroundSize:'cover',
                                            backgroundPosition:'center'
                                        }}>&nbsp;</div>
                                        <Row noGap>
                                            <Col width="100">
                                                <div className="namaProduk">
                                                    <Link href={"/TampilProduk/"+option.produk_id}>
                                                      {option.nama}
                                                    </Link>
                                                </div>
                                                <div className="namaProduk" style={{fontSize:'10px', fontWeight:'normal', marginTop:'0px'}}>
                                                    {option.keterangan ? option.keterangan.replace(/(<([^>]+)>)/gi, "") : <>&nbsp;</>}
                                                </div>
                                                <div className="hargaProduk">
                                                    Rp {(option.harga_produk.length > 0 ? this.formatAngka(option.harga_produk[0].nominal) : '0')}
                                                </div>
                                                <div className="namaProduk" style={{fontSize:'10px', color:'#b3b3b3'}}>
                                                    {option.kategori_produk}
                                                </div>
                                            </Col>
                                            <Col width="100">
                                                <Button className="bawahCiriBiru" raised fill style={{marginTop:'8px'}} onClick={()=>this.simpanKeranjang(option.produk_id)}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>cart_badge_plus</i>&nbsp;
                                                    Beli
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                                )
                              })}
                              {/* <Card className={"cardBorder-20 overflowCard-inner"}>
                                <CardContent>
                                  &nbsp;tes
                                </CardContent>
                              </Card> */}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={"cardBorder-20 hilangDiDesktop"}>
                        <CardContent>
                          <Row noGap>
                            <Col width="70">
                              <h1 className="h1-beranda">Kategori Produk</h1>
                            </Col>
                            <Col width="30">
                              <Button className="color-theme-teal" raised fill href="/TampilKategoriProduk" style={{marginTop:'8px'}}>
                                Semua
                              </Button>
                            </Col>
                          </Row>
                          <div className="overflowCard">
                            {this.props.kategori_produk.rows.map((option)=>{
                              return (
                                <Card className={"cardBorder-20 overflowCard-inner"} style={{margin:'8px', width:'200px', background:(this.gradients[this.props.kategori_produk.rows.indexOf(option)]),minHeight:'60px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                  <CardContent className="cardBorder-20" style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                    <Link href={"/daftarProduk/"+option.kategori_produk_id} style={{display:'block'}}>
                                        <div style={{color:'white', fontSize:'20px', textShadow:'2px 2px #434343'}}>
                                            {option.nama}
                                        </div>
                                        <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                            ({option.jumlah_produk ? option.jumlah_produk : '0'} Produk)
                                        </div>
                                    </Link>
                                  </CardContent>
                                </Card>
                              )
                            })}
                            {/* <Card className={"cardBorder-20 overflowCard-inner"}>
                              <CardContent>
                                &nbsp;tes
                              </CardContent>
                            </Card> */}
                          </div>
                        </CardContent>
                      </Card>
                    </Col>
                    
                    {/* <Col width="100" tabletWidth="100">
                      <Card className="cardAtas">
                        <CardContent className={"color-theme-deeporange"}>
                          <Button 
                            raised 
                            fill 
                            large 
                            href="#" 
                            style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                            // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                            onClick={this.gantiDasborGameMaster}
                            className="bawahCiri cardBorder-20"
                          >
                            <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                            Dasbor Game Master (Guru)
                          </Button>
                        </CardContent>
                      </Card>
                    </Col> */}
                    {/* <Col width="100" className="hilangDiDesktop">
                      <Card>
                        <CardContent style={{padding:'0px'}}>
                          <Button 
                              raised 
                              fill 
                              large 
                              href="#" 
                              className="color-theme-deeporange bawahCiri"
                              style={{marginTop:'16px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'100%', fontSize:'12px'}} 
                              // style={{marginTop:'8px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                              // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                              onClick={this.gantiDasborGameMaster}
                              // className="bawahCiri cardBorder-20"
                            >
                              <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                              Masuk Dasbor Game Master (Guru)
                            </Button>
                        </CardContent>
                      </Card>
                    </Col> */}
                    
                    {/* <Col width="100" tabletWidth="100">
                      {this.state.sekolah_pengguna.total > 0 &&
                      <Card className="hilangDiDesktop">
                        <CardContent className={"color-theme-deeporange"}>
                          <div style={{width:'100%', maxWidth:'600px', margin:'auto'}}>
                            <Card style={{margin:'0px'}}>
                              <CardContent style={{padding:'8px'}}>
                                  <Row>
                                    <Col width="70" tabletWidth="80" style={{display:'inline-flex'}}>
                                      ...
                                    </Col>
                                    <Col width="30" tabletWidth="20" style={{display:'inline-grid'}}>
                                      
                                      ...
                                    </Col>
                                    
                                  </Row>
                              </CardContent>
                            </Card>
                          </div>
                          {this.state.sekolah_pengguna.total > 1 &&
                          <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                            <Link href={"/daftarSekolahGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>+{parseInt(this.state.sekolah_pengguna.total)-1} sekolah lainnya</Link>
                          </div>
                          }
                          {this.state.sekolah_pengguna.total === 1 &&
                          <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                            <Link href={"/gabungSekolah/"}>Gabung ke sekolah lain</Link>
                          </div>
                          }
                        </CardContent>
                      </Card>
                      }
                      {this.state.sekolah_pengguna.total < 1 &&
                      <Card className="hilangDiDesktop">
                        <CardContent style={{textAlign:'center'}}>
                          <img src="./static/icons/tidur.png" style={{maxHeight:'80px'}} />
                          <div style={{width:'100%', textAlign:'center', marginBottom:'8px'}}>
                            Kamu belum bergabung ke sekolah :(
                            <br/>
                            Punya kode undangan sekolah?
                          </div>
                          <Button onClick={()=>this.$f7router.navigate('/gabungSekolah/')} raised fill className="bawahCiriHijau color-theme-teal" style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} >
                            <i className="icons f7-icons" style={{fontSize:'15px'}}>person_badge_plus_fill</i>&nbsp;
                            Gabung ke Sekolah
                          </Button>
                        </CardContent>
                      </Card>
                      }
                    </Col> */}

                    <Col width="100" tabletWidth="60">
                      
                      {/* menu mikroservice */}
                      <Card className="hilangDiDesktop"> 
                        <CardContent style={{padding:'0px'}}>
                          
                          {/* <Row noGap style={{justifyContent:'center', paddingLeft:'8px', paddingRight:'8px'}}>
                            
                            {this.state.sekolah_pengguna.total > 0 &&
                            <>
                            {(this.state.sekolah_pengguna.rows[0].kode_wilayah ? this.state.sekolah_pengguna.rows[0].kode_wilayah.substring(0,4) : '0') ===  '0521' && parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href={"/PPDB-Lumajang/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id} style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px', fontSize:'10px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/lumajang_logo.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    PPDB
                                    <br/>
                                    Lumajang
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            }
                            </>
                            }
                            
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Kategori/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/book.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Kategori
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Kuis/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/gc.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Kuis
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Ruang/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/room2.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Ruang
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                          </Row> */}
                        
                        </CardContent>
                      </Card>

                      {parseInt(localStorage.getItem('sudah_login')) == 1 &&
                      <Card className="cardBorder-20 hilangDiDesktop">
                        <CardContent className="cari_kuis ikutiKuisBeranda">
                          <Row>
                            <Col width="100" tabletwidth="100" desktopWidth="100">
                              <div>
                                <img style={{width:'50px', height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                                <div>
                                  <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                    <b style={{fontSize:'14px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                                  </Link>
                                  <br/>
                                  <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                    <span style={{fontSize:'10px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                                  </Link>
                                </div>
                              </div>
                            </Col>
                            {/* <Col width="20" tabletwidth="15" desktopWidth="15">
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <img style={{width:'50px', height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                              </Link>
                            </Col>
                            <Col width="80" tabletwidth="85" desktopWidth="85" style={{paddingLeft:'0px'}}>
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <b style={{fontSize:'14px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                              </Link>
                              <br/>
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <span style={{fontSize:'10px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                              </Link>
                              
                            </Col> */}
                            <Col width="100">
                              <Row style={{marginTop:'8px'}}>
                                <Col width="33" style={{fontSize:'10px'}}>
                                  <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'13px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                                  <i className="icon f7-icons" style={{fontSize:'13px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp;<b className="angkaPoin">0</b>
                                  <div style={{fontSize:'10px'}}>Riwayat Poin</div>
                                </Col>
                                <Col width="33" style={{fontSize:'10px'}}>
                                  <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'13px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Produk Dibeli:<br/>
                                  {/* Produk Dibeli:<br/> */}
                                  <i className="icon f7-icons" style={{fontSize:'13px', color:'#FDDD02'}}>cube_box</i>&nbsp;<b className="angkaPoin">0</b>
                                  <div style={{fontSize:'10px'}}>Produk</div>
                                </Col>
                                <Col width="33" style={{fontSize:'10px'}}>
                                <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'13px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Deposit Wallet<br/>
                                  Rp <b style={{fontSize:'20px', fontWeight:'bold'}}>0</b>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Popover className="popover-menu-rata">
                            <div style={{margin:'8px'}}>Skor rata-rata adalah skor rata-rata dari total kuis yang telah Kamu ikuti</div>
                          </Popover>
                          <Popover className="popover-menu-poin">
                            <div style={{margin:'8px'}}>Poin adalah poin yang Kamu dapat dari aktivitas kamu di diskuis seperti mengerjakan kuis, membuat kuis, dll</div>
                          </Popover>
                          {/* <Row>
                            <Col width="0" tabletWidth="0"></Col>
                            <Col width="100" tabletWidth="100">
                              
                                    <List noHairlinesMd>
                                      <ListInput
                                        outline
                                        large
                                        // label="Cari Kuis"
                                        floatingLabel
                                        type="text"
                                        placeholder="Ikuti Kuis menggunakan kode ..."
                                        clearButton
                                        onFocus={()=>this.$f7router.navigate('/gabungKuis/')}
                                        // style={{width:'100%',maxWidth:'500px'}}
                                      ></ListInput>
                                      <ListItem>
                                        <Button className={"bawahCiriBiru cardBorder-20"} large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                          <i className="icons f7-icons">play_fill</i>&nbsp;
                                          Ikuti Kuis
                                        </Button>
                                      </ListItem>
                                    </List>
                                    <br/>
                            </Col>
                            <Col width="0" tabletWidth="0"></Col>
                          </Row> */}
                        </CardContent>
                      </Card>
                      }
                      <AktivitasSosial tipe="publik" />
                    </Col>
                    <Col width="100" tabletWidth="40">
                      
                      {/* menu mikroservice */}
                      <Card className="hilangDiMobile"> 
                        <CardContent style={{padding:'0px'}}>
                          
                          {/* <Row noGap style={{justifyContent:'center', paddingLeft:'8px', paddingRight:'8px'}}>
                            
                            {this.state.sekolah_pengguna.total > 0 &&
                            <>
                            {(this.state.sekolah_pengguna.rows[0].kode_wilayah ? this.state.sekolah_pengguna.rows[0].kode_wilayah.substring(0,4) : '0') ===  '0521' && parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href={"/PPDB-Lumajang/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id} style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px', fontSize:'10px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/lumajang_logo.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    PPDB
                                    <br/>
                                    Lumajang
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            }
                            </>
                            }
                            
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Kategori/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/book.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Kategori
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Kuis/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/gc.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Kuis
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                            <Col width="25" tabletWidth="25" desktopWidth="25">
                              <Link href="/Ruang/" style={{width:'100%'}}>
                                <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', borderRadius:'20px', marginLeft:'4px', marginRight:'4px'}}>
                                  <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                    <img src="./static/icons/room2.png" style={{height:'40px'}} />&nbsp;
                                    <br/>
                                    Ruang
                                  </CardContent>    
                                </Card>
                              </Link>
                            </Col>
                          </Row> */}

                        
                        </CardContent>
                      </Card>
                        
                      {parseInt(localStorage.getItem('sudah_login')) == 1 &&
                      <Card className="cardBorder-20 hilangDiMobile">
                        <CardContent className="cari_kuis ikutiKuisBeranda" style={{padding:'8px'}}>
                          <Row>
                            <Col width="100" tabletwidth="100" desktopWidth="100">
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <img style={{width:'50px', height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                              </Link>
                            </Col>
                            <Col width="100" tabletwidth="100" desktopWidth="100" style={{paddingLeft:'0px'}}>
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <b style={{fontSize:'15px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                              </Link>
                              <br/>
                              <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'#434343'}}>
                                <span style={{fontSize:'11px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                              </Link>
                              
                            </Col>
                            <Col width="100">
                              <br/>
                              <Row>
                                <Col width="30" style={{fontSize:'10px'}}>
                                  <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'12px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                                  {/* <i className="icon f7-icons" style={{fontSize:'13px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp; */}
                                  <b className="angkaPoin">0</b>
                                  <div style={{fontSize:'10px'}}>Riwayat</div>
                                </Col>
                                <Col width="35" style={{fontSize:'10px'}}>
                                  <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'12px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Produk Dibeli:<br/>
                                  {/* <i className="icon f7-icons" style={{fontSize:'13px', color:'#FDDD02'}}>cube_box</i>&nbsp; */}
                                  <b className="angkaPoin">0</b>
                                  <div style={{fontSize:'10px'}}>Produk</div>
                                </Col>
                                <Col width="35" style={{fontSize:'10px'}}>
                                <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'12px', color:'#434343'}}>question_circle_fill</i></Link>&nbsp;Deposit Wallet<br/>
                                  Rp <b style={{fontSize:'20px', fontWeight:'bold'}}>0</b>
                                </Col>
                              </Row>
                            </Col>
                          </Row>

                          <Popover className="popover-menu-rata">
                            <div style={{margin:'8px'}}>Skor rata-rata adalah skor rata-rata dari total kuis yang telah Kamu ikuti</div>
                          </Popover>
                          <Popover className="popover-menu-poin">
                            <div style={{margin:'8px'}}>Poin adalah poin yang Kamu dapat dari aktivitas kamu di diskuis seperti mengerjakan kuis, membuat kuis, dll</div>
                          </Popover>
                          {/* <Row>
                            <Col width="0" tabletWidth="0"></Col>
                            <Col width="100" tabletWidth="100">
                                    <List noHairlinesMd>
                                      <ListInput
                                        outline
                                        large
                                        // label="Cari Kuis"
                                        floatingLabel
                                        type="text"
                                        placeholder="Ikuti Kuis menggunakan kode ..."
                                        clearButton
                                        onFocus={()=>this.$f7router.navigate('/gabungKuis/')}
                                        // style={{width:'100%',maxWidth:'500px'}}
                                      ></ListInput>
                                      <ListItem>
                                        <Button className={"bawahCiriBiru cardBorder-20"} large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                          <i className="icons f7-icons">play_fill</i>&nbsp;
                                          Ikuti Kuis
                                        </Button>
                                      </ListItem>
                                    </List>
                                    <br/>
                            </Col>
                            <Col width="0" tabletWidth="0"></Col>
                          </Row> */}
                        </CardContent>
                      </Card>
                      }

                      {this.props.anggota_mitra.total > 0 &&
                      <Card className={"cardBorder-20"}>
                        <CardContent>
                          <BlockTitle style={{marginTop:'0px', marginBottom:'4px', fontSize:'15px', fontWeight:'bold', color:'#434343', marginLeft:'0px'}}>
                            {this.props.anggota_mitra.total > 0 ? this.props.anggota_mitra.rows[0].jenis_mitra : <></>}
                          </BlockTitle>
                          {parseInt(this.props.anggota_mitra.rows[0].jenis_mitra_id) === 5 &&
                          <span style={{fontSize:'10px'}}>
                            Wilayah {this.props.anggota_mitra.total > 0 ? this.props.anggota_mitra.rows[0].provinsi : <></>}
                          </span>
                          }
                          {parseInt(this.props.anggota_mitra.rows[0].jenis_mitra_id) === 4 &&
                          <span style={{fontSize:'10px'}}>
                            Wilayah {this.props.anggota_mitra.total > 0 ? this.props.anggota_mitra.rows[0].kabupaten : <></>}
                          </span>
                          }
                          {parseInt(this.props.anggota_mitra.rows[0].jenis_mitra_id) === 3 &&
                          <span style={{fontSize:'10px'}}>
                            Wilayah {this.props.anggota_mitra.total > 0 ? this.props.anggota_mitra.rows[0].kecamatan : <></>}
                          </span>
                          }
                        </CardContent>
                      </Card>
                      }
                      {this.props.anggota_mitra.total < 1 &&
                      <Card className={"cardBorder-20"}>
                        <CardContent>
                          <BlockTitle style={{marginTop:'0px', marginBottom:'4px', fontSize:'15px', fontWeight:'bold', color:'#434343', marginLeft:'0px'}}>
                            Privileged Customer
                          </BlockTitle>
                          <span  style={{fontSize:'10px'}}>
                            Alamat Utama:
                            <br/>
                            <b>{this.state.alamat_pengguna.nama_penerima}</b>
                            <br/>
                            {this.state.alamat_pengguna.alamat_jalan}, {this.state.alamat_pengguna.desa_kelurahan}, {this.state.alamat_pengguna.kode_pos}
                            <br/>
                            {this.state.alamat_pengguna.kecamatan}, {this.state.alamat_pengguna.kabupaten}, {this.state.alamat_pengguna.provinsi}
                            <br/>
                            <Link href={"/AlamatPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>Edit Alamat</Link>
                          </span>
                          <br/>
                          <br/>
                          <span  style={{fontSize:'10px'}}>
                            Mitra Terdekat:
                            <br/>
                            {this.state.mitra_terdekat.map((option)=>{
                              return (
                                <div style={{display:'inline-flex', marginTop:'8px'}}>
                                    <img src={option.gambar ? option.gambar : '/static/icons/illo-logo-icon.png'} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                    <div style={{marginLeft:'8px'}}>
                                        {this.state.mitra_terdekat.length > 0 &&
                                        <div>
                                            <b style={{fontSize:'14px'}}>{option.pengguna}</b>
                                            <br/>
                                            <span style={{fontSize:'12px'}}>
                                                {option.jenis_mitra} - {parseInt(option.jenis_mitra_id) === 5 ? <>{option.provinsi}</> : (parseInt(option.jenis_mitra_id) === 4 ? <>{option.kabupaten}</> : (parseInt(option.jenis_mitra_id) === 3 ? <>{option.kecamatan}</> : <></>))}
                                            </span>
                                        </div>
                                        }
                                    </div>
                                </div>
                                // <Card style={{marginLeft:'0px', marginRight:'0px', borderRadius:'10px'}}>
                                //   <CardContent style={{padding:'8px'}}>
                                // <div>
                                //   <b style={{fontSize:'14px'}}>{option.pengguna}</b>
                                //   <br/>
                                //   <span style={{fontSize:'12px'}}>
                                //     {option.jenis_mitra} - {parseInt(option.jenis_mitra_id) === 5 ? <>{option.provinsi}</> : (parseInt(option.jenis_mitra_id) === 4 ? <>{option.kabupaten}</> : (parseInt(option.jenis_mitra_id) === 3 ? <>{option.kecamatan}</> : <></>))}
                                //   </span>
                                // </div>
                                //   </CardContent>
                                // </Card>
                              )
                            })}
                            <br/>
                          </span>
                        </CardContent>
                      </Card>
                      }

                      {/* <Card className={"cardBorder-20"}>
                        <CardContent>
                          <Row noGap>
                            <Col width="70">
                              <h1 className="h1-beranda">Menu Card 1</h1>
                            </Col>
                            <Col width="30">
                              
                            </Col>
                          </Row>
                          <div className="overflowCardVert">
                            
                          </div>
                        </CardContent>
                      </Card> */}

                      <Card className={"cardBorder-20 hilangDiMobile"}>
                        <CardContent>
                          <Row noGap>
                            <Col width="70">
                              <h1 className="h1-beranda">Kategori Produk</h1>
                            </Col>
                            <Col width="30">
                              <Button className="color-theme-teal" raised fill href="/TampilKategoriProduk" style={{marginTop:'8px'}}>
                                Semua
                              </Button>
                            </Col>
                          </Row>
                          <div className="overflowCard">
                            {this.props.kategori_produk.rows.map((option)=>{
                              return (
                                <Card className={"cardBorder-20 overflowCard-inner"} style={{margin:'8px', width:'200px', background:(this.gradients[this.props.kategori_produk.rows.indexOf(option)]),minHeight:'60px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                  <CardContent className="cardBorder-20" style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                    <Link href={"/daftarProduk/"+option.kategori_produk_id} style={{display:'block'}}>
                                        <div style={{color:'white', fontSize:'20px', textShadow:'2px 2px #434343'}}>
                                            {option.nama}
                                        </div>
                                        <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                            ({option.jumlah_produk ? option.jumlah_produk : '0'} Produk)
                                        </div>
                                    </Link>
                                  </CardContent>
                                </Card>
                              )
                            })}
                            {/* <Card className={"cardBorder-20 overflowCard-inner"}>
                              <CardContent>
                                &nbsp;tes
                              </CardContent>
                            </Card> */}
                          </div>
                        </CardContent>
                      </Card>
                    </Col>
                  </Row>

                </Col> 
                <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
              </Row>
            </div>
          </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getPertanyaan: Actions.getPertanyaan,
    getNotifikasi: Actions.getNotifikasi,
    simpanPantauan: Actions.simpanPantauan,
    getKuisDiikuti: Actions.getKuisDiikuti,
    getRuangDiikuti: Actions.getRuangDiikuti,
    getKuisTrending: Actions.getKuisTrending,
    getLinimasa: Actions.getLinimasa,
    getAktivitas: Actions.getAktivitas,
    getMapel: Actions.getMapel,
    simpanPengikut: Actions.simpanPengikut,
    getRataKuis: Actions.getRataKuis,
    getPengaturanPengguna: Actions.getPengaturanPengguna,
    getSekolahPengguna: Actions.getSekolahPengguna,
    getSekolah: Actions.getSekolah,
    getKuis: Actions.getKuis,
    getNotifikasiRedis: Actions.getNotifikasiRedis,
    getNotifikasiRedisBelumDibaca: Actions.getNotifikasiRedisBelumDibaca,
    getLeaderboardPengguna: Actions.getLeaderboardPengguna,
    getKategoriProduk: Actions.getKategoriProduk,
    getProduk: Actions.getProduk,
    simpanKeranjang: Actions.simpanKeranjang,
    getKeranjang: Actions.getKeranjang,
    getAlamatPengguna: Actions.getAlamatPengguna,
    getMitraTerdekat: Actions.getMitraTerdekat
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang, Aktivitas, Sekolah, Poin, Pesan, Mitra, Produk }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      pertanyaan: Pertanyaan.pertanyaan,
      dummy_rows: App.dummy_rows,
      notifikasi: Notifikasi.notifikasi,
      kuis_diikuti: Kuis.kuis_diikuti,
      ruang_diikuti: Ruang.ruang_diikuti,
      kuis_trending: Kuis.kuis_trending,
      linimasa: Notifikasi.linimasa,
      aktivitas: Aktivitas.aktivitas,
      mapel: App.mapel,
      rata_kuis: App.rata_kuis,
      pengaturan_pengguna: App.pengaturan_pengguna,
      sekolah_pengguna: Sekolah.sekolah_pengguna,
      sekolah: Sekolah.sekolah,
      kuis: Kuis.kuis,
      leaderboard_pengguna: Poin.leaderboard_pengguna,
      notifikasi_belum_dibaca: Notifikasi.notifikasi_belum_dibaca,
      pesan_belum_dibaca: Pesan.pesan_belum_dibaca,
      daftar_pesan: Pesan.daftar_pesan,
      anggota_mitra: Mitra.anggota_mitra,
      kategori_produk: Produk.kategori_produk,
      produk: Produk.produk

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Beranda);