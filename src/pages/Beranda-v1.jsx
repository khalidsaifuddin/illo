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
          dibaca: "1"
        }
      },()=>{
        this.props.getNotifikasi(this.state.routeParamsNotifikasi).then((result)=>{
          // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
              // pertanyaan: this.props.pertanyaan,
              notifikasi: this.props.notifikasi,
              // loadingPertanyaan: false,
            });
          // });
  
        });

        this.props.getKuisDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  
        this.props.getRuangDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
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

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="Beranda" hideBarsOnScroll>
            {/* Top Navbar */}
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Navbar 
              sliding={false} 
              large
            >
                <NavLeft >
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle sliding>{localStorage.getItem('judul_aplikasi')}</NavTitle>
                {/* <NavTitleLarge style={{color:(localStorage.getItem('tema_warna_aplikasi') === 'biru-1' ? '#369CF4' : '#FA5F0C')}}>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge> */}
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    <Button raised fill href="#" style={{marginLeft:'0px', marginRight:'8px'}}>
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>bolt_fill</i> 
                      Dasbor Game Master
                    </Button>
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} md={this.state.notifikasi.result > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.state.notifikasi.result > 0 && <Badge color="red">{this.state.notifikasi.result}</Badge>}
                      </Icon>
                    </Link>
                    {/* <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Pertanyaan Baru" href="/tambahPertanyaan"></Link> */}
                    <Link href="/ProfilPengguna">
                      <img style={{height:'30px', borderRadius:'50%', marginLeft:'0px'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                    </Link>
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            <Card style={{backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/bg1.jpg)', backgroundSize:'cover', marginTop:'0px', marginLeft:'0px', marginRight:'0px'}}>
              <CardContent style={{padding:'0px', background:'rgba(0, 0, 0, 0.8)'}}>
                <Row noGap style={{alignItems:'flex-end', marginTop:'-50px'}}>
                  <Col width="100" style={{textAlign:'center'}}>
                    <h1>{localStorage.getItem('judul_aplikasi')}</h1>
                  </Col>
                  <Col width="33" style={{textAlign:'center'}}>
                    <Link href="/tambahPertanyaan/" style={{display:'inline'}}>
                      <Card style={{background:'#ede7f6'}}>
                        <CardContent style={{color:'#7e57c2'}}>
                          <Icon style={{color:'#7e57c2', fontSize:'50px'}} ios={"f7:question_circle_fill"} aurora={"f7:question_circle_fill"} md={"material:question_circle_fill"} tooltip="Buat Pertanyaan Baru"/>
                          <br/>Bertanya  
                        </CardContent>
                      </Card>
                    </Link>
                  </Col>
                  <Col width="33" style={{textAlign:'center'}}>
                    <Link href="/gabungKuis/" style={{display:'inline'}}>
                      <Card style={{background:'#ede7f6'}}>
                        <CardContent style={{color:'#4A2884'}}>
                          <Icon style={{color:'#4A2884', fontSize:'70px'}} ios={"f7:pencil_circle_fill"} aurora={"f7:pencil_circle_fill"} md={"material:pencil_circle_fill"} tooltip="Buat Pertanyaan Baru"/>
                          <br/>Ikuti Kuis
                        </CardContent>
                      </Card>
                    </Link>
                  </Col>
                  <Col width="33" style={{textAlign:'center'}}>
                    <Link href="/gabungRuang/" style={{display:'inline'}}>
                      <Card style={{background:'#ede7f6'}}>
                        <CardContent style={{color:'#ab47bc'}}>
                          <Icon style={{color:'#ab47bc', fontSize:'50px'}} ios={"f7:circle_grid_hex_fill"} aurora={"f7:circle_grid_hex_fill"} md={"material:circle_grid_hex_fill"} tooltip="Ikuti Ruang"/>
                          <br/>Ikuti Ruang
                        </CardContent>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </CardContent>
            </Card>
            <BlockTitle style={{marginTop:'0px'}}>Kuis Anda</BlockTitle>
            <Block strong style={{padding:16, paddingRight: 0, paddingLeft:0}}>
              <div className="divtes" style={{paddingLeft: 0, whiteSpace: 'nowrap', overflowX: 'scroll', overflowY: 'hidden', width: '100%'}}>
                {this.props.kuis_diikuti.rows.map((option)=>{
                  let waktu_mengerjakan = '';
                  let tgl_waktu_mengerjakan = new Date(option.waktu_mengerjakan);
                  waktu_mengerjakan = moment(option.waktu_mengerjakan).format('D') + ' ' + this.bulan[(moment(option.waktu_mengerjakan).format('M')-1)] + ' ' + moment(option.waktu_mengerjakan).format('YYYY') + ', pukul ' + moment(option.waktu_mengerjakan).format('H') + ':' + moment(option.waktu_mengerjakan).format('mm');

                  return (
                    <Card className="cardPopuler" style={{marginLeft:(this.props.kuis_diikuti.rows.indexOf(option) === 0 ? 16 : 0), backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+')', backgroundSize:'cover'}}>
                    {/* <Card style={{background:'#37474F'}} className="cardPopuler" style={{marginLeft:(this.props.kuis_diikuti.rows.indexOf(option) === 0 ? 16 : 0), marginRight:(this.props.kuis_diikuti.rows.indexOf(option) === (this.props.kuis_diikuti.rows.length-1) ? 16 : 8)}}> */}
                      <CardContent style={{background:'rgba(0, 0, 0, 0.6)'}}>
                          <Row>
                              <Col width={75} style={{whiteSpace:'pre-wrap'}}>
                                  <h2 style={{marginTop:'0px'}}>
                                      {option.judul}
                                  </h2>
                                  {/* <p> */}
                                      {/* {option.keterangan}<br/> */}
                                      Tanggal {waktu_mengerjakan}
                                  {/* </p> */}
                              </Col>
                              <Col width={25} style={{textAlign:'right'}}>
                                  <div style={{fontSize:'10px'}}>
                                      Skor
                                  </div>
                                  <div style={{fontSize:'30px', fontWeight:'bold', color:'#64FFDA'}}>{option.skor ? parseFloat(option.skor).toFixed(1)  : "0"}</div>
                                  <div style={{fontSize:'10px'}}>
                                      Peringkat {option.peringkat} 
                                      <br/>dari 
                                      <br/>{option.total_peserta} peserta
                                  </div>
                              </Col>
                          </Row>
                      </CardContent>
                      <CardFooter style={{background:'rgba(0, 0, 0, 0.8)'}}>
                          <Button raised fill>
                              Rincian
                          </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
                <Card className="cardPopuler" style={{marginLeft:(this.props.kuis_diikuti.total === 0 ? 16 : 8),marginRight:16, background:'#37474F',width:'240px'}} >
                    <CardContent style={{textAlign:'center', paddingBottom:'10px'}}>
                      <Icon style={{fontSize:'100px',color:'#cccccc'}} ios="f7:plus_app" aurora="f7:plus_app" md="material:plus_app" tooltip="Kuis"/>
                    </CardContent>
                    <CardFooter>
                          <Button raised fill onClick={()=>this.$f7router.navigate('/Kuis/')}>
                              Ikuti Kuis atau Buat Kuis Baru
                          </Button>
                      </CardFooter>
                  </Card>
                {/* <Card className="cardPopuler" style={{marginLeft:16}}>
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler" style={{marginRight:16}}>
                  &nbsp;
                </Card> */}
              </div>
            </Block>
            <BlockTitle style={{marginTop:'0px'}}>Ruang Anda</BlockTitle>
            <Block strong style={{padding:16, paddingRight: 0, paddingLeft:0}}>
              {/* <div className="divtes" style={{paddingLeft: 0, whiteSpace: 'nowrap', overflowX: 'scroll', overflowY: 'hidden', height: 250, width: '100%'}}>
                <Card className="cardPopuler" style={{marginLeft:16}}>
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler">
                  &nbsp;
                </Card>
                <Card className="cardPopuler" style={{marginRight:16}}>
                  &nbsp;
                </Card>
              </div> */}
              <div className="divtes" style={{paddingLeft: 0, whiteSpace: 'nowrap', overflowX: 'scroll', overflowY: 'hidden', width: '100%'}}>
                {this.props.ruang_diikuti.rows.map((option)=>{
                  let create_date = '';
                  let tgl_create_date = new Date(option.create_date);
                  create_date = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                  
                  return (
                    <Card className="cardPopuler" style={{marginLeft:(this.props.ruang_diikuti.rows.indexOf(option) === 0 ? 16 : 0), backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+')', backgroundSize:'cover'}}>
                    {/* <Card style={{background:'#37474F'}} className="cardPopuler" style={{marginLeft:(this.props.kuis_diikuti.rows.indexOf(option) === 0 ? 16 : 0), marginRight:(this.props.kuis_diikuti.rows.indexOf(option) === (this.props.kuis_diikuti.rows.length-1) ? 16 : 8)}}> */}
                      <CardContent style={{background:'rgba(0, 0, 0, 0.6)'}}>
                          <Row>
                              <Col width={75} style={{whiteSpace:'pre-wrap'}}>
                                  <h2 style={{marginTop:'0px'}}>
                                      {option.nama}
                                  </h2>
                                  Mengikuti sejak {create_date}<br/>
                                  {option.pertanyaan.result ? option.pertanyaan.result : '0'} Pertanyaan <br/>{option.ruang.total ? option.ruang.total : '0'} Pengikut
                              </Col>
                              <Col width={25} style={{textAlign:'right'}}>
                                  
                              </Col>
                          </Row>
                      </CardContent>
                      <CardFooter style={{background:'rgba(0, 0, 0, 0.8)'}}>
                          <Button raised fill onClick={()=>this.$f7router.navigate('/tampilRuang/'+option.ruang_id)}>
                              Rincian
                          </Button>
                      </CardFooter>
                    </Card>
                  )
                })}

                <Card className="cardPopuler" style={{marginLeft:(this.props.kuis_diikuti.total === 0 ? 16 : 16),marginRight:16, background:'#37474F',width:'240px'}} >
                  <CardContent style={{textAlign:'center', paddingBottom:'10px'}}>
                    <Icon style={{fontSize:'100px',color:'#cccccc'}} ios="f7:plus_app" aurora="f7:plus_app" md="material:plus_app" tooltip="Ruang"/>
                  </CardContent>
                  <CardFooter>
                        <Button raised fill onClick={()=>this.$f7router.navigate('/Ruang/')}>
                            Ikuti Ruang
                        </Button>
                    </CardFooter>
                </Card>
              </div>
            </Block>
            {/* <Card>
              <CardContent style={{textAlign:'center'}}>
                <h3>Ikut Kuis Sekarang!</h3>
                <h4>Masukkan kode kuis:</h4>
                <List>
                  <ListInput
                    // label={"Kode Kuis"}
                    outline
                    floatingLabel
                    clearButton
                    type="text"
                    // resizable
                    placeholder={"Kode Kuis"}
                    style={{width:'100%'}}
                    // onChange={this.setStateValuePilihan(key, 'teks')}
                    // defaultValue={element.teks}
                    >
                  </ListInput>
                </List>
                <br/>
                <Button raised large fill>
                  Ikuti Kuis Sekarang
                </Button>
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardContent style={{textAlign:'center'}}>
                <h3>Gabung ke dalam Ruang Sekarang!</h3>
                <h4>Masukkan kode ruang:</h4>
                <List>
                  <ListInput
                    // label={"Kode Kuis"}
                    outline
                    floatingLabel
                    clearButton
                    type="text"
                    // resizable
                    placeholder={"Kode Ruang"}
                    style={{width:'100%'}}
                    // onChange={this.setStateValuePilihan(key, 'teks')}
                    // defaultValue={element.teks}
                    >
                  </ListInput>
                </List>
                <br/>
                <Button raised large fill>
                  Gabung Ruang
                </Button>
              </CardContent>
            </Card> */}
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
    getRuangDiikuti: Actions.getRuangDiikuti
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      pertanyaan: Pertanyaan.pertanyaan,
      dummy_rows: App.dummy_rows,
      notifikasi: Notifikasi.notifikasi,
      kuis_diikuti: Kuis.kuis_diikuti,
      ruang_diikuti: Ruang.ruang_diikuti
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Beranda);