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
  Badge
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';
import { getSPMKabupatenPerKecamatan, getGtkJenisPie } from '../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

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
          
  
          this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
              pertanyaan: this.props.pertanyaan,
              notifikasi: this.props.notifikasi,
              loadingPertanyaan: false,
            });
          });
  
        });  
      });

    }else{

      this.props.getPertanyaan(this.state.routeParams).then((result)=>{
        this.setState({
          pertanyaan: this.props.pertanyaan,
          loadingPertanyaan: false,
        });
      });

    }

  }

  simpanPantauan = (pertanyaan_id) => {
    // alert(pertanyaan_id);
    this.setState({
      routeParamsPantauan: {
        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
        pertanyaan_id: pertanyaan_id
      }
    },()=>{
      this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{

        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
          this.setState({
            pertanyaan: this.props.pertanyaan,
            notifikasi: this.props.notifikasi,
            loadingPertanyaan: false,
          });
        });

      })
    });
  }

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="Beranda" hideBarsOnScroll>
            {/* Top Navbar */}
            <Navbar 
              sliding={false} 
              large
            >
                <NavLeft >
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle sliding>{localStorage.getItem('judul_aplikasi')}</NavTitle>
                <NavTitleLarge style={{color:(localStorage.getItem('tema_warna_aplikasi') === 'biru-1' ? '#369CF4' : '#FA5F0C')}}>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge>
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.state.notifikasi.result > 0 ? "f7:bell_fill" : "f7:bell"} md={this.state.notifikasi.result > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.state.notifikasi.result > 0 && <Badge color="red">{this.state.notifikasi.result}</Badge>}
                      </Icon>
                    </Link>
                    <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Pertanyaan Baru" href="/tambahPertanyaan"></Link>
                    <Link href="/ProfilPengguna">
                      <img style={{height:'30px', borderRadius:'50%', marginLeft:'0px'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                    </Link>
                    </>
                    }
                </NavRight>
            </Navbar>
            {/* <Block strong style={{marginTop:'0px'}}> */}
            {this.state.loadingPertanyaan ? 
            <>
              {this.props.dummy_rows.rows.map((option)=>{
                return (
                  <Col width="100">
                      <Card>
                          <CardHeader>
                              <b style={{fontSize:'23px'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx</b>
                          </CardHeader>
                          <CardContent style={{paddingTop:'8px'}}>
                              <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}} className="skeleton-text skeleton-effect-blink">
                                  xxxxxxxxxxxxxxxxxxx<br/>
                                  xxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                                  xxxxxxxxxxxxxxxxxxxxxx<br/>
                                  xxxxxxxxxxxxxxx<br/>
                              </div>
                              <hr style={{borderTop:'1px solid #eeeeee'}}/>
                              <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span><br/>
                              <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span>
                          </CardContent>
                          <CardFooter>
                              <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                              <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                          </CardFooter>
                      </Card>
                  </Col>
                )
              })}
          </>
          :
          <Row noGap>
            {this.state.pertanyaan.rows.map((option)=>{
              let tanggal = '';
              // let tgl = Date.parseExact(option.create_date, "yyyy-MM-dd");;
              let tgl = new Date(option.create_date);

              tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
              // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

              // console.log(moment(option.create_date).format('D'));

              return (
                <Col width="100" tabletWidth="50">
                  <Card>
                      {/* {option.ruang &&
                      // <CardHeader style={{paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                          <Link href={"/tampilRuang/"+option.ruang_id}>
                            <span>{option.ruang}</span>
                          </Link>
                      </CardHeader>
                      } */}
                      <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                        {option.ruang.map((optionRuang)=>{
                          return (
                            <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                              <span>&nbsp;/ {optionRuang.nama}</span>
                            </Link>
                          )
                        })}
                      </CardHeader>
                      <CardHeader>
                        <Link href={"/tampilPertanyaan/"+option.pertanyaan_id}>
                            <b style={{fontSize:'23px'}}>{option.judul}</b>
                        </Link>
                      </CardHeader>
                      <CardContent style={{paddingTop:'8px'}}>
                          {/* {option.konten} */}
                          <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                          <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                          <hr style={{borderTop:'1px solid #eeeeee'}}/>
                          <div style={{marginTop:'-8px', maxHeight:'200px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                              <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                              <p className="read-more" style={{textAlign:'center'}}>
                              </p>
                          </div>
                          <Link style={{width:'100%', marginTop:'8px'}} href={"/tampilPertanyaan/"+option.pertanyaan_id}>Baca Selengkapnya</Link>
                      </CardContent>
                      <CardFooter>
                          <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right" href={"/tampilPertanyaan/"+option.pertanyaan_id}>&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                          {localStorage.getItem('sudah_login') === '1' &&
                          <>
                          <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle" onClick={()=>this.simpanPantauan(option.pertanyaan_id)}>&nbsp; {option.jumlah_pantauan} Pantauan</Link>
                          <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle" href={"/jawabPertanyaan/"+option.pertanyaan_id}>&nbsp; Jawab</Link>
                          </>
                          }
                          {localStorage.getItem('sudah_login') === '0' &&
                          <Link href="/login">Login untuk jawab</Link>
                          }
                          {/* <Link iconIos="f7:square_pencil" iconAurora="f7:square_pencil" iconMd="material:square_pencil">&nbsp; Ubah</Link> */}
                      </CardFooter>
                  </Card>
              </Col>
              )
            })}
          </Row>
          }
            {/* </Block> */}
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
    simpanPantauan: Actions.simpanPantauan
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      pertanyaan: Pertanyaan.pertanyaan,
      dummy_rows: App.dummy_rows,
      notifikasi: Notifikasi.notifikasi
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Beranda);