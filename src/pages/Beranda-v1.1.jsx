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
  ListInput
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
import AktivitasReducer from '../store/reducers/Aktivitas.reducers';

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
    aktivitas: {
      rows: [],
      total: 0
    },
    startAktivitas: 0,
    mapel: []
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
          start: this.state.startLinimasa,
          dibaca: "1"
        }
      },()=>{
        this.props.getNotifikasi(this.state.routeParamsNotifikasi).then((result)=>{
          // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
              // pertanyaan: this.props.pertanyaan,
              notifikasi: this.props.notifikasi,
              // loadingPertanyaan: false,
              routeParamsMapel: {
                limit: 4,
                trending: 'Y'
              }
            },()=>{
              // this.props.getLinimasa(this.state.routeParamsNotifikasi).then((result)=>{
              //   this.setState({
              //     linimasa: {
              //       rows: [
              //         ...this.state.linimasa.rows,
              //         ...this.props.linimasa.rows
              //       ],
              //       total: (parseInt(this.state.linimasa.total)+parseInt(this.props.linimasa.total))
              //     }
              //   });
              // });
              
              this.props.getMapel(this.state.routeParamsMapel).then((result)=>{
                this.setState({
                  mapel: this.props.mapel
                })
              });

              this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
                this.setState({
                  aktivitas: {
                    rows: [
                      ...this.state.aktivitas.rows,
                      ...this.props.aktivitas.rows
                    ],
                    total: (parseInt(this.state.aktivitas.total)+parseInt(this.props.aktivitas.total))
                  }
                });
              });
            });
          // });
  
        });

        this.props.getKuisDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  
        
        this.props.getRuangDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  
        
        this.props.getKuisTrending(this.state.routeParams).then((result)=>{
          
        }); 
      });

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

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="Beranda" hideBarsOnScroll className="halamanBeranda">
            {/* Top Navbar */}
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Navbar 
              sliding={false} 
              large
            >
                <NavLeft>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle sliding>{localStorage.getItem('judul_aplikasi')}</NavTitle>
                {/* <NavTitleLarge style={{color:(localStorage.getItem('tema_warna_aplikasi') === 'biru-1' ? '#369CF4' : '#FA5F0C')}}>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge> */}
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    {/* {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                    <Button raised fill href="#" style={{marginLeft:'0px', marginRight:'8px'}} onClick={()=>window.open('https://app.diskuis.id/gamemaster/')}>
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>bolt_fill</i> 
                      Dasbor Game Master
                    </Button>
                    } */}
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} md={this.state.notifikasi.result > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.state.notifikasi.result > 0 && <Badge color="red">{this.state.notifikasi.result}</Badge>}
                      </Icon>
                    </Link>
                    <Link iconOnly href="/Cari" style={{marginLeft:'0px'}}> 
                      <Icon ios="f7:search" tooltip="Pencarian">
                      </Icon>
                    </Link>
                    {/* <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Pertanyaan Baru" href="/tambahPertanyaan"></Link> */}
                    <Link href="/ProfilPengguna">
                      <img style={{height:'30px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                    </Link>
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            <div style={{marginTop:'-70px'}}>&nbsp;</div>
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Card className="bawahCiri">
              <CardContent style={{padding:'8px'}}>
                <Row>
                  <Col width="60" tabletWidth="40" desktopWidth="40" style={{marginBottom:'16px', overflow:'hidden'}}>
                    <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>
                        <Row noGap>
                          <Col width="35">
                            <img style={{height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                          </Col>
                          <Col width="65">
                            <b style={{fontSize:'16px'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                            <span style={{fontSize:'12px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                          </Col>
                        </Row>
                    </Link>
                  </Col>
                  <Col width="40" tabletWidth="30" desktopWidth="30">
                    <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>question_circle_fill</i>&nbsp;Poin:<br/>
                    <i className="icon f7-icons" style={{fontSize:'25px', color:'#C79C01'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">0</b>
                  </Col>
                  <Col width="100" tabletWidth="30" desktopWidth="30" style={{textAlign:'center'}}>
                    {/* <img src={localStorage.getItem('api_base')+"/assets/img/free.png"} style={{width:'70px', marginTop:'0%', marginRight:'10px'}}/> */}
                    {/* <img src={localStorage.getItem('api_base')+"/assets/img/vip.png"} style={{width:'70px', marginTop:'2%', marginRight:'10px'}}/> */}
                    {/* <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>question_circle_fill</i>&nbsp;Poin Game Master:<br/>
                    <i className="icon f7-icons" style={{fontSize:'25px', color:'#C79C01'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">0</b> */}
                    {/* <br/>
                    <div style={{fontSize:'12px'}}>Daftar VIP sekarang dan dapatkan 3 bulan VIP gratis!</div>
                    <div style={{fontSize:'12px'}}><Link href="/Pricing/">Daftar Sekarang</Link></div> */}
                    {/* <div style={{marginBottom:'8px', marginRight:'8px', fontSize:'10px'}}>
                      Anda guru? Masuk Dasbor Game Master untuk mengelola ruang, kuis, dll!
                    </div> */}
                    <Button raised fill large href="#" style={{marginLeft:'0px', marginRight:'8px'}} onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'}>
                    {/* <Button raised fill large href="#" style={{marginLeft:'0px', marginRight:'8px'}} onClick={()=>window.open('https://app.diskuis.id/gamemaster/')}> */}
                      <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                      {/* <i className="icon f7-icons" style={{fontSize:'20px'}}>bolt_fill</i>  */}
                      Dasbor Game Master
                    </Button>
                    
                  </Col>
                </Row>
              </CardContent>
            </Card>
            }
            <Card className="bawahCiri kuisPage">
              <CardContent className="cari_kuis">
                {/* <h3 style={ {marginBottom:'8px'}}>Cari Kuis</h3> */}
                {/* <br/> */}
                <Row>
                  <Col width="0" tabletWidth="15"></Col>
                  <Col width="100" tabletWidth="70">
                    <Card>
                        <CardContent style={{background:'transparent'}}>
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
                              <Button large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                Ikuti Kuis
                              </Button>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                  </Col>
                  <Col width="0" tabletWidth="15"></Col>
                </Row>
              </CardContent>
            </Card>
            <Row noGap>
            {/* <Col width="100" tabletWidth="100">
              <Card className="bawahCiri kuisPage">
                <CardHeader>
                  Kategori
                </CardHeader>
                <CardContent className="cari_kuis">
                  <Row noGap>
                  {this.state.mapel.map((option)=>{
                    return (
                      <Col width="50" tabletWidth="25" desktopWidth="20">
                        <Card style={{background:'url('+option.gambar_latar+') no-repeat center center / cover',minHeight:'70px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                            <CardContent style={{minHeight:'70px'}}>
                                <Link href={"/daftarKuis/"+option.mata_pelajaran_id} style={{display:'block'}}>
                                    <div style={{color:'white', fontSize:'20px', textShadow:'2px 2px #434343'}}>
                                        {option.nama}
                                    </div>
                                    <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                        ({option.total ? option.total : '0'} kuis)
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    </Col>
                    )
                  })}
                  <Col width="100">
                    <Card>
                      <CardContent>
                        <Link href="/kategori/">
                          Lihat kategori lainnya
                        </Link>
                      </CardContent>
                    </Card>
                  </Col>
                  </Row>
                </CardContent>
              </Card>
            </Col> */}
            <Col width="100" tabletWidth="40">
                <Card className="bawahCiri kuisPage">
                  <CardHeader>
                    Kategori
                  </CardHeader>
                  <CardContent className="cari_kuis">
                    <Row noGap>
                    {this.state.mapel.map((option)=>{
                      return (
                        <Col width="50" tabletWidth="100" desktopWidth="50">
                          <Card style={{background:'url('+option.gambar_latar+') no-repeat center center / cover',minHeight:'70px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                              <CardContent style={{minHeight:'70px'}}>
                                  <Link href={"/daftarKuis/"+option.mata_pelajaran_id} style={{display:'block'}}>
                                      <div style={{color:'white', fontSize:'20px', textShadow:'2px 2px #434343'}}>
                                          {option.nama}
                                      </div>
                                      <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                          ({option.total ? option.total : '0'} kuis)
                                      </div>
                                  </Link>
                              </CardContent>
                          </Card>
                      </Col>
                      )
                    })}
                    <Col width="100">
                      <Card>
                        <CardContent>
                          <Link href="/kategori/">
                            Lihat kategori lainnya
                          </Link>
                        </CardContent>
                      </Card>
                    </Col>
                    </Row>
                  </CardContent>
                </Card>
                <Card className="bawahCiri">
                  <CardHeader>
                    Kuis Trending
                  </CardHeader>
                  <CardContent>
                    <Row noGap style={{justifyContent:'flex-start'}}>
                      {this.props.kuis_trending.rows.map((option)=>{
                        return (
                          <Col width="50" tabletWidth="100" desktopWidth="50">
                            <Card style={{margin:'8px'}}>
                              <CardContent 
                                  style={{
                                      background:'#37474F',
                                      backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                      backgroundSize:'cover',
                                      height:'100px'
                                  }}
                              >
                                  <h2 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize:'15px'
                                  }}>
                                      {option.judul}
                                  </h2>
                                  <h3 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize: '12px',
                                      fontWeight:'none'
                                  }}>
                                      Oleh {option.pengguna}
                                  </h3>
                                  {/* <div style={{fontSize:'10px', fontStyle:'italic'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div> */}
                              </CardContent>
                              <CardContent style={{
                                  background:'white', 
                                  // background:'rgba(0, 0, 0, 0.6)', 
                                  height:'50px',
                                  overflow: 'hidden'
                              }}>
                                  <Row noGap>
                                      <Col width={100} style={{marginBottom:'8px', borderBottom:'1px solid #cccccc'}}>
                                        <div style={{fontSize:'10px', fontStyle:'italic'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div>    
                                      </Col>
                                      <Col width={100}>
                                        <div style={{fontSize:'10px'}}>Terakhir diakses pada tanggal {option.akses_terakhir}</div>    
                                      </Col>
                                      <Col width={100}>
                                        <div style={{fontSize:'10px'}}>{option.jumlah_peserta} peserta total</div>    
                                      </Col>
                                  </Row>
                              </CardContent>
                              <CardFooter>
                                <Button raised fill style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi)}>
                                  <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                  Ikut kuis
                                </Button>
                              </CardFooter>
                          </Card>
                          </Col>
                        )
                      })}
                    </Row>
                  </CardContent>
                </Card>
              </Col>
              <Col width="100" tabletWidth="60">
              <Card className="bawahCiri">
                  <CardHeader>
                    Aktivitas
                  </CardHeader>
                  <CardContent style={{paddingTop:'0px'}}>
                    {this.state.aktivitas.total < 1 && 
                    <>
                    <div style={{marginTop:'16px', textAlign:'center', borderRadius:'10px', border:'3px dashed #cccccc', padding:'16px'}}>
                      <img src={localStorage.getItem('api_base')+'/assets/berkas/sad-face.png'} style={{width:'100px'}}/><br/>
                      <span style={{fontSize:'20px', color:'#cccccc'}}>Terasa hampa ya di sini...</span><br/>
                      <span style={{fontSize:'20px', color:'#cccccc'}}>Coba deh mulai mengerjakan kuis atau gabung ke dalam ruang, nanti juga di sini jadi ramai :)</span>
                    </div>
                    </>
                    }
                    {this.state.aktivitas.total > 0 && 
                    <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                      {this.state.aktivitas.rows.map((option)=>{

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
                              <div className="card-content card-content-padding" style={{padding:'8px'}}>
                                <Row>
                                  <Col width="15" tabletWidth="10" style={{textAlign:'center'}}>
                                    <Link href={"tampilPengguna/"+option.pengguna_id_pelaku}>
                                      <img src={option.gambar} style={{width:'75%', borderRadius:'50%'}} />
                                    </Link>
                                  </Col>
                                  <Col width="85" tabletWidth="90">
                                    <Link href={"tampilPengguna/"+option.pengguna_id}>
                                      <div style={{fontWeight:'normal', color:'#039be5'}}>{option.nama_pengguna}</div>
                                    </Link>
                                    <div dangerouslySetInnerHTML={{ __html: option.keterangan_teks }} />
                                    {option.keterangan === 'mengikuti-pengguna' &&
                                    <div style={{border:'1px solid #ccc', minHeight:'50px', borderRadius:'8px', background:'#e3f2fd'}}>
                                      <Row>
                                        <Col width="25" tabletWidth="15" style={{textAlign:'center', padding:'8px'}}>
                                          <img src={option.gambar_followed} style={{width:'80%', borderRadius:'50%'}} />
                                        </Col>
                                        <Col width="75" tabletWidth="85" style={{padding:'8px'}}>
                                          <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'/tampilPengguna/'+option.pengguna_id_pengikut}>{option.nama_followed}</Link><br/>
                                          {!option.flag_pengikut && option.pengguna_id_pengikut !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                          // <Button disabled={false} raised fill small>
                                          <Button style={{maxWidth:'150px'}} disabled={false} raised fill onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)}>
                                              <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                              Ikuti
                                          </Button>
                                          }
                                          {option.flag_pengikut &&
                                          <Button disabled={false} raised fill small onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)} style={{background:'#cccccc', border:'1px solid #cccccc', maxWidth:'150px'}}>
                                              <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_crop_circle_fill_badge_checkmark</i>&nbsp;
                                              <span style={{color:'#434343'}}>Mengikuti</span>
                                          </Button>
                                          }
                                        </Col>
                                      </Row>
                                    </div>
                                    }
                                    {option.keterangan === 'ikut-kuis' &&
                                    <div style={{border:'1px solid #cccccc', maxHeight:'70px', overflowY:'hidden', borderRadius:'8px', background:'#fffde7'}}>
                                      <Row>
                                        <Col width="30">
                                          <img src={localStorage.getItem('api_base')+"/assets/berkas/"+option.gambar_kuis_diikuti} style={{width:'90%', marginBottom:'-5px', borderRadius:'8px 0px 0px 8px'}}/>
                                        </Col>
                                        <Col width="70" style={{padding:'8px'}}>
                                          <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'#'}>{option.judul_kuis_diikuti}</Link><br/>
                                          oleh <b>{option.pembuat_kuis_diikuti}</b>
                                        </Col>
                                      </Row>
                                    </div>
                                    }
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <Button fill onClick={()=>console.log('lagi')} style={{background:'#cccccc', marginTop:'8px'}}>Tampilkan linimasa lebih lama</Button>                    
                    </div>
                    }
                  </CardContent>
                </Card>
              </Col>
            </Row>

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
    simpanPengikut: Actions.simpanPengikut
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang, Aktivitas }) {
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
      mapel: App.mapel
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Beranda);