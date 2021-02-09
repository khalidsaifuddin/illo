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
  Popover
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';
import { getSPMKabupatenPerKecamatan, getGtkJenisPie } from '../store/actions';

import io from 'socket.io-client';

import moment from 'moment';
import ruang from './Ruang/ruang';

class BerandaGuru extends Component {

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
    aktivitas_kuis: {
      rows: [],
      total: 0
    },
    statistik: [{
      label: ''
    },{
      label: ''
    },{
      label: ''
    },{
      label: ''
    },{
      label: ''
    },{
      label: ''
    }],
    sekolah_pengguna: {
      rows:[],
      total: 0
    },
    pengaturan_pengguna: {},
    sekolah: {
      rows: [],
      total: 0
    }
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
    // console.log('beranda');
    if(parseInt(localStorage.getItem('sudah_login')) !== 1){
      this.$f7router.navigate('/login/');
    }

    // if(localStorage.getItem('current_url') !== ''){
    //   this.$f7route.navigate(localStorage.getItem('current_url'))
    // }
    
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

    let socket = io(localStorage.getItem('socket_url'));

    socket.on('updateUserList', (users) => {
        this.setState({
            users
        },()=>{
            console.log(this.state.users);
        });
    });

    if(parseInt(localStorage.getItem('sudah_login')) === 1){
      
      this.setState({
        routeParamsNotifikasi: {
          pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
          dibaca: "1"
        }
      },()=>{
        this.props.getNotifikasiRedisBelumDibaca(this.state.routeParamsNotifikasi).then((result)=>{
          // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
              // pertanyaan: this.props.pertanyaan,
              notifikasi: this.props.notifikasi_belum_dibaca,
              // loadingPertanyaan: false,
            });
          // });
  
        });

        this.props.getKuisDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  

        this.props.getRuangDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  

        this.props.getLeaderboardPengguna({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          
        });  

        this.props.aktivitasKuis(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            aktivitas_kuis: this.props.aktivitas_kuis
          });
        });  

        this.props.getStatistik(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            statistik: this.props.statistik
          });
        }); 

        this.props.getSekolahPengguna(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            ...this.state,
            sekolah_pengguna: this.props.sekolah_pengguna
          })
        }); 
        
        this.props.getPengaturanPengguna(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            ...this.state,
            pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
          },()=>{

            if(parseInt(localStorage.getItem('baru_login')) === 1){
              
              if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.jenis_dasbor_id) === 1){
                localStorage.setItem('baru_login','0')
                this.gantiDasborPlayer()
              }

              if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.jenis_dasbor_id) === 3){
                localStorage.setItem('baru_login','0')
                // this.gantiDasborGameMaster()
                this.$f7router.navigate('/BerandaSekolah/')
              }
              // else{
              //   localStorage.setItem('baru_login','0')
              // }

            }

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

    }

  }

  gantiDasborPlayer = () => {
    // localStorage.setItem('google_api','582957663393-mq35tdi3g211gsrfgggqp38pkhntm6gi.apps.googleusercontent.com');
    // localStorage.setItem('google_api','582957663393-qn8160pfr7fcgedsa00u56vc9mjl01lc.apps.googleusercontent.com');
    localStorage.setItem('judul_aplikasi','Diskuis (Beta)');
    localStorage.setItem('sub_judul_aplikasi','Belajar, Bermain, Bersosial');
    localStorage.setItem('kode_aplikasi','MEJA');
    localStorage.setItem('tema_warna_aplikasi','biru-1');
    localStorage.setItem('wilayah_aplikasi','');
    localStorage.setItem('kode_wilayah_aplikasi','026100');
    localStorage.setItem('id_level_wilayah_aplikasi','2');
    localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('versi_aplikasi','2020.02.01');
    localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
    // localStorage.setItem('socket_url',"http://socket.diskuis.id:5000");
    // localStorage.setItem('socket_url',"http://117.53.47.43:5000");

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="BerandaGuru" hideBarsOnScroll>
            {/* Top Navbar */}
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Navbar 
              sliding={false} 
              // large
              className="backgroundGame"
            >
                <NavLeft>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle>
                  <img src={localStorage.getItem('api_base')+'/assets/berkas/diskuis_white.png'}  style={{height:'30px', margin:'auto', marginTop:'10px'}} />
                </NavTitle>
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                    <Button raised fill href="#" style={{marginLeft:'0px', marginRight:'8px'}}>
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>bolt_fill</i> 
                      Dasbor Game Master
                    </Button>
                    }
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.state.notifikasi.total > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.state.notifikasi.total > 0 ? "f7:bell_fill" : "f7:bell"} md={this.state.notifikasi.total > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.state.notifikasi.total > 0 && <Badge color="red">{this.state.notifikasi.total}</Badge>}
                      </Icon>
                    </Link>
                    <Link iconOnly href="/Pesan" style={{marginLeft:'0px'}}> 
                      <Icon style={{fontSize:'32px', marginLeft:'-4px'}} ios={this.props.daftar_pesan.belum_dibaca > 0 ? "f7:chat_bubble_2_fill" : "f7:chat_bubble_2"} aurora={this.props.daftar_pesan.belum_dibaca > 0 ? "f7:chat_bubble_2_fill" : "f7:chat_bubble_2"} md={this.props.daftar_pesan.belum_dibaca > 0 ? "material:chat_bubble_2_fill" : "material:chat_bubble_2"} tooltip="Pesan">
                        {this.props.daftar_pesan.belum_dibaca > 0 && <Badge color="red">{this.props.daftar_pesan.belum_dibaca}</Badge>}
                      </Icon>
                    </Link>
                    <Link iconOnly href="/Cari" style={{marginLeft:'0px'}}> 
                      <Icon ios="f7:search" tooltip="Pencarian">
                      </Icon>
                    </Link>
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            <div style={{marginTop:'-20px'}}>&nbsp;</div>
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <div className="merahAtas">
              <Row noGap>
                <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                <Col width="100" tabletWidth="100" desktopWidth="80">

                  <Row noGap>
                    <Col width="100" tabletWidth="50">
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
                              Kuis Diikuti:<br/>
                              <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">{this.state.rata_kuis ? this.state.rata_kuis.total : "0"}</b>
                              <div style={{fontSize:'10px'}}>Kuis</div>
                            </Col>
                            <Col width="40">
                            <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Skor Rata-rata<br/>
                              <i className="icon f7-icons" style={{fontSize:'20px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;
                              <b style={{fontSize:'20px', fontWeight:'bold'}}>{this.state.rata_kuis ? parseFloat(this.state.rata_kuis.rata).toFixed(2) : '0'}</b>
                              {this.state.rata_kuis &&
                              <div style={{fontSize:'10px'}}>dari total {this.state.rata_kuis.total} kuis</div>
                              }
                            </Col>
                          </Row>
                        </Col>
                        <Col width="100">
                          <h1 className="judulDasbor">Dasbor Game Player (Guru)</h1>
                        </Col>
                      </Row>
                      <Popover className="popover-menu-rata">
                        <div style={{margin:'8px'}}>Skor rata-rata adalah skor rata-rata dari total kuis yang telah Kamu ikuti</div>
                      </Popover>
                      <Popover className="popover-menu-poin">
                        <div style={{margin:'8px'}}>Poin adalah poin yang Kamu dapat dari aktivitas kamu di diskuis seperti mengerjakan kuis, membuat kuis, dll</div>
                      </Popover>
                    </Col>
                    <Col width="0" tabletWidth="50" className="hilangDiMobile" style={{marginTop:'0px', marginBottom:'50px'}}>
                      {this.state.sekolah_pengguna.total > 0 &&
                      <>
                        <Card style={{margin:'0px', marginLeft:'16px'}}>
                          <CardContent className={"color-theme-deeporange"} style={{color:'black'}}>
                            <div style={{width:'100%', maxWidth:'600px', margin:'auto'}}>
                                <Row>
                                  <Col width="70" tabletWidth="70" style={{display:'inline-flex'}}>
                                    <div style={{width:'45px',border:'0px solid #ccc'}}>
                                      <img src={"https://be.diskuis.id"+this.state.sekolah_pengguna.rows[0].gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/>
                                    </div>
                                    <div style={{width:'100%',border:'0px solid #ccc', marginLeft:'8px', minHeight:'55px'}}>
                                      <b>{this.state.sekolah_pengguna.rows[0].jabatan_sekolah}</b> di <b>{this.state.sekolah_pengguna.rows[0].nama_sekolah}</b>
                                      <br/>
                                      <Button raised fill small style={{fontSize:'9px', height:'15px', padding:'4px', display:'inline-flex', marginTop:'0px', marginRight:'4px'}} className={(parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? 'color-theme-teal' : 'color-theme-orange')}>
                                          {parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? <><i className="icons f7-icons" style={{fontSize:'10px'}}>checkmark_seal_fill</i>&nbsp;Terverifikasi</> : 'Belum Terverifikasi'}
                                      </Button>
                                      <span style={{fontSize:'10px'}}>
                                        Sejak {moment(this.state.sekolah_pengguna.rows[0].create_date).format('D') + ' ' + this.bulan[(moment(this.state.sekolah_pengguna.rows[0].create_date).format('M')-1)] + ' ' + moment(this.state.sekolah_pengguna.rows[0].create_date).format('YYYY')}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col width="30" tabletWidth="30" style={{display:'inline-grid'}}>
                                    {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/'+(parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                      <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                      Menu
                                    </Button> */}
                                    <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/sekolah/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                      <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                      Laman
                                    </Button>
                                  </Col>
                                  {parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                                  <Col width="100" tabletWidth="100" style={{display:'inline-grid'}}>
                                    <Row>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'30px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>person_crop_rectangle</i>
                                            <br/>Profil
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>checkmark_rectangle</i>
                                            <br/>Kehadiran
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>calendar</i>
                                            <br/>Rekap
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                    </Row>
                                  </Col>
                                  }
                                </Row>
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
                      </>
                      }
                      {this.state.sekolah_pengguna.total < 1 &&
                      <Card style={{margin:'0px', marginLeft:'16px'}}>
                        <CardContent style={{textAlign:'center'}}>
                          <img src="./static/icons/tidur.png" style={{maxHeight:'80px'}} />
                          <div style={{width:'100%', textAlign:'center', marginBottom:'8px', color:'black'}}>
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
                      <Card style={{margin:'0px', marginTop:'16px', marginLeft:'16px'}}>
                        <CardContent style={{padding:'0px'}}>
                          <Button 
                            raised 
                            fill 
                            large 
                            href="#" 
                            className="color-theme-deeporange bawahCiri"
                            style={{fontSize:'12px'}} 
                            onClick={this.gantiDasborPlayer}
                          >
                            <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                            Masuk Dasbor Umum
                          </Button>
                        </CardContent>  
                      </Card>
                    </Col>
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

                  {/* <Card className="cardAtas">
                    <CardContent className={"color-theme-deeporange"}>
                      <Button 
                        raised 
                        fill 
                        large 
                        href="#" 
                        style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                        // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                        onClick={this.gantiDasborPlayer}
                        className="bawahCiri cardBorder-20"
                      >
                        <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                        Dasbor Player (Siswa)
                      </Button>
                    </CardContent>
                  </Card> */}
                  <Card className="hilangDiDesktop">
                    <CardContent style={{padding:'0px'}}>
                      <Button 
                        raised 
                        fill 
                        large 
                        href="#" 
                        style={{fontSize:'12px'}} 
                        // style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'500px', marginTop:'16px', fontSize:'12px'}} 
                        // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                        onClick={this.gantiDasborPlayer}
                        className="color-theme-deeporange bawahCiri cardBorder-20"
                      >
                        <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                        {/* Masuk Dasbor Player (Siswa) */}
                        Masuk Dasbor Umum
                      </Button>
                    </CardContent> 
                  </Card>
                  {this.state.sekolah_pengguna.total > 0 &&
                  <Card className="hilangDiDesktop">
                    <CardContent className={"color-theme-deeporange"}>
                      {/* <List> */}
                      {/* {this.state.sekolah_pengguna.rows.map((optionSekolahPengguna)=>{
                        return (
                            <ListItem>
                              tes
                            </ListItem>    
                          )
                      })} */}
                      {/* </List> */}
                      <div style={{width:'100%', maxWidth:'600px', margin:'auto'}}>
                        <Card style={{margin:'0px'}}>
                          <CardContent style={{padding:'8px'}}>
                              <Row>
                                <Col width="70" tabletWidth="80" style={{display:'inline-flex'}}>
                                  <div style={{width:'45px',border:'0px solid #ccc'}}>
                                    <img src={"https://be.diskuis.id"+this.state.sekolah_pengguna.rows[0].gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/>
                                    {/* <img src={localStorage.getItem('api_base')+this.state.sekolah_pengguna.rows[0].gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/> */}
                                  </div>
                                  <div style={{width:'100%',border:'0px solid #ccc', marginLeft:'8px'}}>
                                    <b>{this.state.sekolah_pengguna.rows[0].jabatan_sekolah}</b> di <b>{this.state.sekolah_pengguna.rows[0].nama_sekolah}</b>
                                    <br/>
                                    {/* Sejak {this.state.sekolah_pengguna.rows[0].create_date} */}
                                    <Button raised fill small style={{fontSize:'9px', height:'15px', padding:'4px', display:'inline-flex', marginTop:'0px', marginRight:'4px'}} className={(parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? 'color-theme-teal' : 'color-theme-orange')}>
                                        {parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? <><i className="icons f7-icons" style={{fontSize:'10px'}}>checkmark_seal_fill</i>&nbsp;Terverifikasi</> : 'Belum Terverifikasi'}
                                    </Button>
                                    <span style={{fontSize:'10px'}}>
                                      Sejak {moment(this.state.sekolah_pengguna.rows[0].create_date).format('D') + ' ' + this.bulan[(moment(this.state.sekolah_pengguna.rows[0].create_date).format('M')-1)] + ' ' + moment(this.state.sekolah_pengguna.rows[0].create_date).format('YYYY')}
                                    </span>
                                    {/* <br/> */}
                                    {/* <br/> */}
                                  </div>
                                </Col>
                                <Col width="30" tabletWidth="20" style={{display:'inline-grid'}}>
                                  {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/'+(parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                    Menu
                                  </Button> */}
                                  <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/sekolah/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                    Laman
                                  </Button>
                                </Col>
                                <Col width="100" tabletWidth="100" style={{display:'inline-grid'}}>
                                  <Row>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'0px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'50px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>person_crop_rectangle</i>
                                          <br/>Profil
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'0px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'50px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>checkmark_rectangle</i>
                                          <br/>Kehadiran
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'0px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'50px'}}>
                                        <i className="icons f7-icons" style={{fontSize:'30px'}}>calendar</i>
                                          <br/>Rekap
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* <Col width="20">
                                  <Button raised fill className="bawahCiriHijau color-theme-green">
                                    Profil
                                  </Button>
                                </Col> */}
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
                  {/* {this.state.sekolah_pengguna.total < 1 &&
                  <Card>
                    <CardContent>
                      <div style={{width:'100%', textAlign:'center', marginBottom:'8px'}}>
                        Punya kode undangan sekolah?
                      </div>
                      <Button onClick={()=>this.$f7router.navigate('/gabungSekolah/')} raised fill className="bawahCiriHijau color-theme-teal" style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} >
                        <i className="icons f7-icons" style={{fontSize:'15px'}}>person_badge_plus_fill</i>&nbsp;
                        Gabung ke Sekolah
                      </Button>
                    </CardContent>
                  </Card>
                  } */}

                  {/* menu mikroservice */}
                  <Col width="100">
                    <Card> 
                      <CardContent style={{padding:'0px'}}>
                        
                        <Row style={{justifyContent:'end', paddingLeft:'8px', paddingRight:'8px'}}>
                          
                          {this.state.sekolah_pengguna.total > 0 &&
                          <>
                          {(this.state.sekolah_pengguna.rows[0].kode_wilayah ? this.state.sekolah_pengguna.rows[0].kode_wilayah.substring(0,4) : '0') ===  '0521' && parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                          <Col width="25" tabletWidth="15" desktopWidth="10">
                            <Link href={"/PPDB-Lumajang/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id} style={{width:'100%'}}>
                              <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', marginLeft:'4px', marginRight:'4px'}}>
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
                          
                          <Col width="25" tabletWidth="15" desktopWidth="10">
                            <Link href="/Kategori/" style={{width:'100%'}}>
                              <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', marginLeft:'4px', marginRight:'4px'}}>
                                <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                  <img src="./static/icons/book.png" style={{height:'40px'}} />&nbsp;
                                  <br/>
                                  Kategori
                                </CardContent>    
                              </Card>
                            </Link>
                          </Col>
                          <Col width="25" tabletWidth="15" desktopWidth="10">
                            <Link href="/KuisAnda/" style={{width:'100%'}}>
                              <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', marginLeft:'4px', marginRight:'4px'}}>
                                <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                  <img src="./static/icons/gc.png" style={{height:'40px'}} />&nbsp;
                                  <br/>
                                  Kuis
                                </CardContent>    
                              </Card>
                            </Link>
                          </Col>
                          <Col width="25" tabletWidth="15" desktopWidth="10">
                            <Link href="/RuangAnda/" style={{width:'100%'}}>
                              <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343', marginLeft:'4px', marginRight:'4px'}}>
                                <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                  <img src="./static/icons/room2.png" style={{height:'40px'}} />&nbsp;
                                  <br/>
                                  Ruang
                                </CardContent>    
                              </Card>
                            </Link>
                          </Col>
                        </Row>

                      
                      </CardContent>
                    </Card>
                  </Col>

                  <Card className="kuisPage">
                    <CardContent className="cari_kuis">
                      <h2 style={{marginBottom:'8px', color:'#434343'}}>Dasbor Game Master (Guru)</h2>
                      <h3 style={{marginBottom:'8px', color:'#aaaaaa'}}>Apa yang akan Anda lakukan hari ini?</h3>
                      {/* <br/> */}
                      <Row>
                        <Col width="0" tabletWidth="10"></Col>
                        <Col width="100" tabletWidth="80">
                          {/* <Card>
                              <CardContent> */}
                                <Row noGap>
                                  <Col width="50" tabletWidth="25">
                                    <a href={'/tambahKuis/'}>
                                    {/* <a href={'/tambahKuis/'+JSON.parse(localStorage.getItem('user')).pengguna_id}> */}
                                      <Card style={{border:'1px solid #eeeeee'}}>
                                      {/* <Card className="bawahCiriBiru" style={{border:'1px solid #eeeeee'}}> */}
                                        <CardContent>
                                          {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>gamecontroller_alt_fill</i> */}
                                          <img src="./static/icons/gc.png" style={{height:'50px'}} />
                                          <br/>
                                          <br/>
                                          <div style={{fontStyle:'50px', fontWeight:'bold'}}>Buat Kuis</div>
                                        </CardContent>
                                      </Card>
                                    </a>
                                  </Col>
                                  <Col width="50" tabletWidth="25">
                                    <a href="/tambahRuang">
                                    <Card style={{border:'1px solid #eeeeee'}}>
                                    {/* <Card className="bawahCiriBiru" style={{border:'1px solid #eeeeee'}}> */}
                                      <CardContent>
                                          {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>circle_grid_hex_fill</i> */}
                                          <img src="./static/icons/room2.png" style={{height:'50px'}} />
                                          <br/>
                                          <br/>
                                          <div style={{fontStyle:'50px', fontWeight:'bold'}}>Buat Ruang</div>
                                      </CardContent>
                                    </Card>
                                    </a>
                                  </Col>
                                  <Col width="50" tabletWidth="25">
                                    <a href="/tambahPertanyaan">
                                    <Card style={{border:'1px solid #eeeeee'}}>
                                    {/* <Card className="bawahCiriBiru" style={{border:'1px solid #eeeeee'}}> */}
                                      <CardContent>
                                          {/* <i className="icon f7-icons" style={{fontSize:'80px', color:'#5BC1AC'}}>person_2_square_stack</i> */}
                                          <img src="./static/icons/disc.png" style={{height:'50px'}} />
                                          <br/>
                                          <br/>
                                          <div style={{fontStyle:'50px', fontWeight:'bold'}}>Buat Diskusi</div>
                                      </CardContent>
                                    </Card>
                                    </a>
                                  </Col>
                                  <Col width="50" tabletWidth="25">
                                    <a href="/BerandaSekolah/">
                                    <Card style={{border:'1px solid #eeeeee'}}>
                                    {/* <Card className="bawahCiriBiru" style={{border:'1px solid #eeeeee'}}> */}
                                      <CardContent>
                                          {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>building_2_fill</i> */}
                                          <img src="./static/icons/sekolah2.png" style={{height:'50px'}} />
                                          <br/>
                                          <br/>
                                          <div style={{fontStyle:'50px', fontWeight:'bold'}}>Sekolah</div>
                                      </CardContent>
                                    </Card>
                                    </a>
                                  </Col>
                                </Row>
                              {/* </CardContent>
                            </Card> */}
                        </Col>
                        <Col width="0" tabletWidth="10"></Col>
                      </Row>
                    </CardContent>
                  </Card>
                  <Row noGap>
                    <Col width="100" tabletWidth="50" desktopWidth="50">
                      <Card>
                        <CardHeader>
                          Statistik
                        </CardHeader>
                        <CardContent>
                          <Row noGap>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#D83F87'}} className="bawahCiriBiru">
                                <CardContent style={{color:'white'}}>
                                <div style={{fontSize:'30px', fontWeight:'bold',color:'white'}}>{this.state.statistik[0].jumlah}</div>
                                  Kuis Dibuat
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#2A1B3D'}} className="bawahCiriBiru">
                                <CardContent style={{color:'white'}}>
                                  <div style={{fontSize:'30px', fontWeight:'bold', color:'white'}}>{this.state.statistik[1].jumlah}</div>
                                  Ruang Dibuat
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#44318D'}} className="bawahCiriBiru">
                                <CardContent style={{color:'white'}}>
                                  Kuis Anda telah diikuti oleh 
                                  <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>{this.state.statistik[2].jumlah}</div> orang<br/>
                                  <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+{this.state.statistik[4].jumlah} hari ini)</div>
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#E98074'}} className="bawahCiriBiru">
                                <CardContent style={{color:'white'}}>
                                  Ruang Anda telah diikuti oleh 
                                  <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>{this.state.statistik[3].jumlah}</div> orang<br/>
                                  <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+{this.state.statistik[5].jumlah} hari ini)</div>
                                  
                                </CardContent>
                              </Card>
                            </Col>
                          </Row>
                        </CardContent>
                      </Card>

                      <Card className={"cardBorder-20"}>
                        <CardContent>
                          <Row noGap>
                            <Col width="70">
                              <h1 className="h1-beranda">Peringkat Poin</h1>
                            </Col>
                            <Col width="30">
                              <Button className="color-theme-deeporange" raised fill href={"/Leaderboard/"} style={{marginTop:'8px'}}>
                                Semua
                              </Button>
                            </Col>
                          </Row>
                          <div className="overflowCardVert">
                            
                            {this.props.leaderboard_pengguna.rows.map((option)=>{
                                return (
                                    <Card style={{border:(option.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #FF6B22' : 'none')}}>
                                        <CardContent style={{padding:'8px'}}>
                                            {/* {option.nama} */}
                                            <Row>
                                                <Col width="10" tabletWidth="10" desktopWidth="10" style={{fontSize:'15px', fontWeight:'bold', paddingTop:'14px'}}>
                                                    #{(this.props.leaderboard_pengguna.rows.indexOf(option)+1)}
                                                </Col>
                                                <Col width="20" tabletWidth="20" desktopWidth="15">
                                                    <img src={option.gambar} style={{width:'50px', height:'50px', borderRadius:'50%'}} />
                                                </Col>
                                                <Col width="45" tabletWidth="45" desktopWidth="60">
                                                    <Link href={"/TampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                    <br/><span style={{fontSize:'10px'}}>{option.username}</span>
                                                </Col>
                                                <Col width="25" tabletWidth="25" desktopWidth="15" style={{textAlign:'right', display:(parseInt(this.props.leaderboard_pengguna.rows.indexOf(option)) === 0 ? 'inline-table' : 'block')}}>
                                                    <b style={{fontSize:'15px', color:'#558b2f'}}>{this.formatAngka(option.poin)}</b>
                                                    {parseInt(this.props.leaderboard_pengguna.rows.indexOf(option)) === 0 &&
                                                    <img src="./static/icons/piala.png" style={{height:'15px', marginLeft:'4px'}} />
                                                    }
                                                </Col>
                                            </Row>
                                        </CardContent>
                                    </Card>
                                )
                            })}

                          </div>
                        </CardContent>
                      </Card>
                    </Col>
                    <Col width="100" tabletWidth="50" desktopWidth="50">
                      <Card>
                        <CardHeader>
                          Aktivitas Terkini Kuis Anda
                        </CardHeader>
                        <CardContent>
                          
                          <div className="timeline" style={{marginTop:'0px', paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            {this.state.aktivitas_kuis.rows.map((option)=>{

                              // let tanggal = '';
                              let tgl = new Date(option.create_date);
                              let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                              let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                              return (
                                <div className="timeline-item">
                                  <div className="timeline-item-date" style={{fontSize:'10px'}}>
                                    {tanggal}
                                    <br/>
                                    {waktu}
                                  </div>
                                  <div className="timeline-item-divider"></div>
                                  <div className="timeline-item-content card">
                                    {/* <div className="card-header">Card header</div> */}
                                    <div className="card-content card-content-padding" style={{padding:'8px', paddingTop:'0px'}}>
                                      <Row>
                                        <Col width="20" tabletWidth="10" desktopWidth="15">
                                          <Link href={"tampilPengguna/"+option.pengguna_id}>
                                            <img src={option.gambar_peserta} style={{height:'40px', width:'40px',borderRadius:'50%', marginTop:'4px'}} />
                                            {/* <img src={option.gambar_peserta} style={{width:'30px', borderRadius:'50%'}} /> */}
                                          </Link>
                                        </Col>
                                        <Col width="80" tabletwidth="90" desktopWidth="85">
                                          <Link href={"tampilPengguna/"+option.pengguna_id}>
                                            <div style={{fontWeight:'bold', color:'#039be5'}}>{option.peserta}</div>
                                          </Link>
                                          &nbsp;mengikuti kuis <b>{option.nama_kuis}</b> dengan skor <b>{option.skor ? parseFloat(option.skor).toFixed(2) : '0'}</b>
                                        </Col>
                                      </Row>
                                    </div>
                                    {/* <div className="card-footer" style={{padding:'4px', justifyContent:'flex-end'}}>
                                        {parseInt(option.jenis_linimasa_id) === 1 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Kunjungi Ruang</Button>}
                                        {parseInt(option.jenis_linimasa_id) === 2 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Kunjungi Ruang</Button>}
                                        {parseInt(option.jenis_linimasa_id) === 3 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Lihat Peringkat</Button>}
                                    </div> */}
                                  </div>
                                </div>
                              )
                            })}
                            {/* <Button fill onClick={()=>console.log('lagi')} style={{background:'#cccccc', marginTop:'8px'}}>Tampilkan aktivitas lebih lama</Button>                     */}
                          </div>

                        </CardContent>
                      </Card>
                    </Col>
                    {/* <Col width="100" tabletWidth="50" desktopWidth="50">
                      <Card>
                        <CardHeader>
                          Statistik
                        </CardHeader>
                        <CardContent>
                          <Row noGap>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#D83F87'}}>
                                <CardContent style={{color:'white'}}>
                                <div style={{fontSize:'30px', fontWeight:'bold',color:'white'}}>{this.state.statistik[0].jumlah}</div>
                                  Kuis Dibuat
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#2A1B3D'}}>
                                <CardContent style={{color:'white'}}>
                                  <div style={{fontSize:'30px', fontWeight:'bold', color:'white'}}>{this.state.statistik[1].jumlah}</div>
                                  Ruang Dibuat
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#44318D'}}>
                                <CardContent style={{color:'white'}}>
                                  Kuis Anda telah diikuti oleh 
                                  <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>{this.state.statistik[2].jumlah}</div> orang<br/>
                                  <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+{this.state.statistik[4].jumlah} hari ini)</div>
                                </CardContent>
                              </Card>
                            </Col>
                            <Col width="50" tabletWidth="50" desktopWidth="50">
                              <Card style={{background:'#E98074'}}>
                                <CardContent style={{color:'white'}}>
                                  Ruang Anda telah diikuti oleh 
                                  <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>{this.state.statistik[3].jumlah}</div> orang<br/>
                                  <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+{this.state.statistik[5].jumlah} hari ini)</div>
                                  
                                </CardContent>
                              </Card>
                            </Col>
                          </Row>
                        </CardContent>
                      </Card>
                    </Col>
                  </Row> */}
                  {/* <Card>
                    <CardHeader>
                      Kuis Trending
                    </CardHeader>
                    <CardContent>
                      
                    </CardContent>
                  </Card> */}
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
    getNotifikasiRedisBelumDibaca: Actions.getNotifikasiRedisBelumDibaca,
    simpanPantauan: Actions.simpanPantauan,
    getKuisDiikuti: Actions.getKuisDiikuti,
    getRuangDiikuti: Actions.getRuangDiikuti,
    aktivitasKuis: Actions.aktivitasKuis,
    getStatistik: Actions.getStatistik,
    getSekolahPengguna: Actions.getSekolahPengguna,
    getPengaturanPengguna: Actions.getPengaturanPengguna,
    getSekolah: Actions.getSekolah,
    getLeaderboardPengguna: Actions.getLeaderboardPengguna
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang, Sekolah, Poin, Pesan }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      pertanyaan: Pertanyaan.pertanyaan,
      dummy_rows: App.dummy_rows,
      notifikasi: Notifikasi.notifikasi,
      notifikasi_belum_dibaca: Notifikasi.notifikasi_belum_dibaca,
      kuis_diikuti: Kuis.kuis_diikuti,
      ruang_diikuti: Ruang.ruang_diikuti,
      aktivitas_kuis: Kuis.aktivitas_kuis,
      statistik: App.statistik,
      sekolah_pengguna: Sekolah.sekolah_pengguna,
      pengaturan_pengguna: App.pengaturan_pengguna,
      sekolah: Sekolah.sekolah,
      leaderboard_pengguna: Poin.leaderboard_pengguna,
      daftar_pesan: Pesan.daftar_pesan
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BerandaGuru);