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
  CardFooter
} from 'framework7-react';

import { Doughnut, Bar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class home extends Component {

  state = {
    error: null,
    data: {
      r_kelas: [],
      perpustakaan: []
    },
    dataTabel: {
      r_kelas: [],
      perpustakaan: []
    },
    routeParams: {
      kode_wilayah: localStorage.getItem('kode_wilayah_aplikasi'),
      id_level_wilayah: localStorage.getItem('id_level_wilayah_aplikasi'),
      tipe: 'chart',
      bentuk_pendidikan_id: localStorage.getItem('jenjang_aplikasi')
      // sekolah_id: "D25DF326-C2E2-4A12-B6C9-03FD6854252B"
    }
  };

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
    console.log(this.props.tabBar);

    // console.log(this.$f7router.navigate(localStorage.getItem('current_url')));
    localStorage.setItem('current_url', this.$f7route.url);

    // this.props.setLoading(false);
    // this.props.getRekapSekolahSarpras(this.state.routeParams);
    // this.props.getRekapSekolahSarprasWilayah(this.state.routeParams);
    this.setState({
      ...this.state,
      routeParams: {
        ...this.state.routeParams,
        jenis_prasarana: 'r_kelas'
      }
    },()=>{
      this.props.getSarprasKebutuhanRkbWilayah(this.state.routeParams).then((result)=>{
        //for now, nothing to do
      });
      
      this.props.getSarprasJenisWilayah(this.state.routeParams).then((result)=>{
        //for now, nothing to do
      });

      this.props.getSarprasKerusakanWilayah(this.state.routeParams).then((result)=>{
        this.setState({
          data: {
            ...this.state.data,
            r_kelas: this.props.sarpras_kerusakan_wilayah
          },
          routeParams: {
            ...this.state.routeParams,
            tipe: 'tabel'
          }
        },()=>{
          this.props.getSarprasKebutuhanRkbWilayahTabel(this.state.routeParams).then((result)=>{
            let sekolah_butuh_rkb = 0;
            let sekolah = 0;
            let kebutuhan_rkb = 0;

            for (let index = 0; index < this.props.sarpras_kebutuhan_rkb_wilayah_tabel.length; index++) {
              const element = this.props.sarpras_kebutuhan_rkb_wilayah_tabel[index];
              sekolah_butuh_rkb = sekolah_butuh_rkb+parseInt(element.sekolah_butuh_rkb);
              sekolah = sekolah+parseInt(element.sekolah);
              kebutuhan_rkb = kebutuhan_rkb+parseInt(element.kebutuhan_rkb);
            }

            // console.log(sekolah_butuh_rkb);
            // console.log(sekolah);

            this.setState({
              ...this.state,
              sekolah_butuh_rkb: sekolah_butuh_rkb,
              sekolah: sekolah,
              kebutuhan_rkb: kebutuhan_rkb
            })
          });

          this.props.getSarprasJenisWilayahTabel(this.state.routeParams).then((result)=>{
            //for now, nothing to do
          });

          this.props.getSarprasKerusakanWilayahTabel(this.state.routeParams).then((result)=>{

            //perpustakaan
            this.setState({
              ...this.state,
              dataTabel: {
                ...this.state.dataTabel,
                r_kelas: this.props.sarpras_kerusakan_wilayah_tabel
              },
              routeParams: {
                ...this.state.routeParams,
                tipe: 'chart',
                jenis_prasarana: 'perpustakaan'
              }
            },()=>{
              this.props.getSarprasKerusakanWilayah(this.state.routeParams).then((result)=>{
                this.setState({
                  data: {
                    ...this.state.data,
                    perpustakaan: this.props.sarpras_kerusakan_wilayah
                  },
                  routeParams: {
                    ...this.state.routeParams,
                    tipe: 'tabel'
                  }
                },()=>{

                  this.props.getSarprasKerusakanWilayahTabel(this.state.routeParams).then((result)=>{
                    this.setState({
                      dataTabel: {
                        ...this.state.dataTabel,
                        perpustakaan: this.props.sarpras_kerusakan_wilayah_tabel
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    // console.log(this.props);
  }

  render()
    {
        return (
          <Page name="home" hideBarsOnScroll>
            {/* Top Navbar */}
            <Navbar 
              sliding={false} 
              large 
              backLink="Kembali" 
              // onBackClick={this.backClick}
              // style={{background: '#0063D2'}}
            >
              <NavLeft >
                <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
              </NavLeft>
              <NavTitle sliding>Profil Pendidikan</NavTitle>
              <NavTitleLarge>Profil Pendidikan</NavTitleLarge>
              {/* <NavTitle sliding>{localStorage.getItem('judul_aplikasi')}</NavTitle>
              <NavTitleLarge>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge> */}
              <NavRight>
                <Link iconIos="f7:search" iconAurora="f7:search" iconMd="material:search" href="/DataPokokSekolah/" ></Link>
              </NavRight>
            </Navbar>

            <BlockTitle>Sarana & Prasarana</BlockTitle>
            <Row noGap>
              <Col width="100" tabletWidth="50">
                <Card style={{marginBottom:'0px', minHeight: '410px'}}>
                  <CardHeader>
                      Ruang Kelas Berdasarkan Kerusakan
                  </CardHeader>
                  <CardContent>
                      <Doughnut 
                        data={this.state.data.r_kelas}
                        height={150}
                        legend={{
                          display: true,
                          position: 'left'
                        }}
                      />
                      <br/>
                      <Row>
                        {this.state.dataTabel.r_kelas.map((option)=>{
                            return (
                                <>
                                    <Col width="50">
                                        {option.keterangan}
                                    </Col>
                                    <Col width="50" style={{textAlign:'right'}}>
                                        {option.jumlah}
                                    </Col>
                                    <Col width="100" style={{borderBottom: '1px solid #ccc', marginTop: '2px', marginBottom: '8px'}}>
                                    </Col>
                                </>
                            )
                        })}
                    </Row>
                  </CardContent>
                </Card>
                <Card style={{marginBottom:'0px', minHeight: '410px'}}>
                    <CardHeader>
                        Perpustakaan Berdasarkan Kerusakan
                    </CardHeader>
                    <CardContent>
                        <Doughnut 
                          data={this.state.data.perpustakaan}
                          height={160}
                        />
                        <br/>
                        <Row>
                          {this.state.dataTabel.perpustakaan.map((option)=>{
                              return (
                                  <>
                                      <Col width="50">
                                          {option.keterangan}
                                      </Col>
                                      <Col width="50" style={{textAlign:'right'}}>
                                          {option.jumlah}
                                      </Col>
                                      <Col width="100" style={{borderBottom: '1px solid #ccc', marginTop: '2px', marginBottom: '8px'}}>
                                      </Col>
                                  </>
                              )
                          })}
                        </Row>
                    </CardContent>
                </Card>
              </Col>
              <Col width="100" tabletWidth="50">
                <Card style={{marginBottom:'0px', minHeight: '410px'}}>
                  <CardHeader>
                      Jumlah Prasarana Berdasarkan Jenis
                  </CardHeader>
                  <CardContent>
                    <Bar
                        data={this.props.sarpras_jenis_wilayah}
                        width={100}
                        height={50}
                        options={{}}
                    />
                    <br/>
                    <Row>
                        {this.props.sarpras_jenis_wilayah_tabel.map((option)=>{
                            return (
                                <>
                                    <Col width="50">
                                        {option.keterangan}
                                    </Col>
                                    <Col width="50" style={{textAlign:'right'}}>
                                        {option.jumlah}
                                    </Col>
                                    <Col width="100" style={{borderBottom: '1px solid #ccc', marginTop: '2px', marginBottom: '8px'}}>
                                    </Col>
                                </>
                            )
                        })}
                      </Row>
                  </CardContent>
                </Card>
                <Row noGap>
                  <Col width="100" tabletWidth="50">
                    <Card style={{marginBottom:'0px', minHeight: '305px'}}>
                      <CardHeader style={{minHeight:'65px'}}>
                        Jumlah Sekolah Membutuhkan RKB
                      </CardHeader>
                      <CardContent>
                        <Row>
                            <Col width="100" style={{textAlign:'center'}}>
                              <span style={{fontSize:'50px'}}>{this.state.sekolah_butuh_rkb}</span>
                              <br/>
                              <span style={{fontSize:'18px'}}>dari {this.state.sekolah} sekolah</span>
                              <br/>
                              <span style={{fontSize:'18px'}}>di {localStorage.getItem('wilayah_aplikasi')}</span>
                            </Col>
                          </Row>
                      </CardContent>
                    </Card>
                  </Col>
                  <Col width="100" tabletWidth="50">
                    <Card style={{marginBottom:'0px', minHeight: '305px'}}>
                      <CardHeader style={{minHeight:'65px'}}>
                        Jumlah Kebutuhan RKB
                      </CardHeader>
                      <CardContent>
                        <Row>
                            <Col width="100" style={{textAlign:'center'}}>
                              <span style={{fontSize:'50px'}}>{this.state.kebutuhan_rkb}</span>
                              <br/>
                              <span style={{fontSize:'18px'}}>ruang kelas baru</span>
                            </Col>
                          </Row>
                      </CardContent>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col width="100" tabletWidth="100">
                <Card style={{marginBottom:'0px', minHeight: '410px'}}>
                  <CardHeader>
                      Jumlah Sekolah Membutuhkan RKB Per Wilayah
                  </CardHeader>
                  <CardContent>
                    <Bar
                        data={this.props.sarpras_kebutuhan_rkb_wilayah}
                        width={100}
                        height={50}
                        options={{}}
                    />
                  </CardContent>
                </Card>
              </Col>
            </Row>
            {/* <Row noGap>
              <Col width="100" tabletWidth="50">
                  
              </Col>
              <Col width="100" tabletWidth="50">
                  
              </Col>
              <Col width="100" tabletWidth="50">
                  
              </Col>
            </Row> */}
          </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getRekapSekolahSarpras: Actions.getRekapSekolahSarpras,
    getRekapSekolahSarprasWilayah: Actions.getRekapSekolahSarprasWilayah,
    getSarprasKerusakanWilayah: Actions.getSarprasKerusakanWilayah,
    getSarprasKerusakanWilayahTabel: Actions.getSarprasKerusakanWilayahTabel,
    getSarprasJenisWilayah: Actions.getSarprasJenisWilayah,
    getSarprasJenisWilayahTabel: Actions.getSarprasJenisWilayahTabel,
    getSarprasKebutuhanRkbWilayah: Actions.getSarprasKebutuhanRkbWilayah,
    getSarprasKebutuhanRkbWilayahTabel: Actions.getSarprasKebutuhanRkbWilayahTabel
  }, dispatch);
}

function mapStateToProps({ App, Sarpras }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      rekap_sekolah_sarpras: Sarpras.rekap_sekolah_sarpras,
      rekap_sekolah_sarpras_wilayah: Sarpras.rekap_sekolah_sarpras_wilayah,
      sarpras_kerusakan_wilayah: Sarpras.sarpras_kerusakan_wilayah,
      sarpras_kerusakan_wilayah_tabel: Sarpras.sarpras_kerusakan_wilayah_tabel,
      sarpras_jenis_wilayah: Sarpras.sarpras_jenis_wilayah,
      sarpras_jenis_wilayah_tabel: Sarpras.sarpras_jenis_wilayah_tabel,
      sarpras_kebutuhan_rkb_wilayah: Sarpras.sarpras_kebutuhan_rkb_wilayah,
      sarpras_kebutuhan_rkb_wilayah_tabel: Sarpras.sarpras_kebutuhan_rkb_wilayah_tabel
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(home);