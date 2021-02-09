import React, {Component} from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavRight,
  Link,
  Card,
  Row,
  Col,
  CardContent,
  Segmented,
  Button,
  Tabs,
  Tab} from 'framework7-react';

  import { Bar } from 'react-chartjs-2';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

import io from 'socket.io-client';

class BerandaEmpu extends Component {

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
    routeParams: {
      foo:'bar'
    },
    arrlabel: [],
    arrPenggunaBaru: [],
    arrKuisBaru: [],
    arrRuangBaru: [],
    arrPesertaKuis: [],
    KumulatifArrPenggunaBaru: [],
    KumulatifArrKuisBaru: [],
    KumulatifArrRuangBaru: [],
    KumulatifArrPesertaKuis: []
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
      this.props.getStatEmpu(this.state.routeParams).then((result)=>{
        let arrlabel = [];
        let arrPenggunaBaru = [];
        let arrKuisBaru = [];
        let arrRuangBaru = [];
        let arrPesertaKuis = [];
        let KumulatifArrPenggunaBaru = [];
        let KumulatifArrKuisBaru = [];
        let KumulatifArrRuangBaru = [];
        let KumulatifArrPesertaKuis = [];

        this.props.stat_empu.diskrit.map((option)=>{
          arrlabel.push(option.tanggal.substring(5,10));
          arrPenggunaBaru.push(option.total_pengguna_baru);
          arrKuisBaru.push(option.kuis_baru_total);
          arrRuangBaru.push(option.ruang_baru_total);
          arrPesertaKuis.push(option.peserta_kuis_total);
        });

        this.props.stat_empu.kumulatif.map((option)=>{
          KumulatifArrPenggunaBaru.push(option.total_pengguna);
          KumulatifArrKuisBaru.push(option.total_kuis);
          KumulatifArrRuangBaru.push(option.total_ruang);
          KumulatifArrPesertaKuis.push(option.total_peserta_kuis);
        });

        this.setState({
          arrlabel: arrlabel,
          arrPenggunaBaru: arrPenggunaBaru,
          arrKuisBaru: arrKuisBaru,
          arrRuangBaru: arrRuangBaru,
          arrPesertaKuis: arrPesertaKuis,
          KumulatifArrPenggunaBaru: KumulatifArrPenggunaBaru,
          KumulatifArrKuisBaru: KumulatifArrKuisBaru,
          KumulatifArrRuangBaru: KumulatifArrRuangBaru,
          KumulatifArrPesertaKuis: KumulatifArrPesertaKuis
        });

      });
    }

  }

  // data = {
  //   labels: this.state.arrlabel,
  //   datasets: [
  //     {
  //       label: 'My First dataset',
  //       backgroundColor: 'rgba(255,99,132,0.2)',
  //       borderColor: 'rgba(255,99,132,1)',
  //       borderWidth: 1,
  //       hoverBackgroundColor: 'rgba(255,99,132,0.4)',
  //       hoverBorderColor: 'rgba(255,99,132,1)',
  //       data: [65, 59, 80, 81, 56, 55, 40]
  //     }
  //   ]
  // };

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        
        return (
          <Page name="BerandaEmpu" hideBarsOnScroll className="halamanBeranda">
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
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    <Link href="/ProfilPengguna">
                      <img style={{height:'30px', borderRadius:'50%', marginLeft:'0px'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                    </Link>
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            <Card className="kuisPage">
              <CardContent className="cari_kuis">
                <h1 style={{marginBottom:'8px', color:'#434343'}}>Dasbor Empu Diskuis</h1>
                <Row>
                  {/* <Col width="0" tabletWidth="15"></Col> */}
                  <Col width="100" tabletWidth="50" style={{border:'1px solid #ccc', padding:'8px', marginBottom:'8px'}}>
                    <h2 style={{marginBottom:'8px', color:'#434343'}}>Pengguna Baru</h2>
                    <Segmented raised style={{marginLeft:'10px'}}>
                        <Button tabLink="#tab-1-1" tabLinkActive>Diskrit</Button>
                        <Button tabLink="#tab-1-2" >Kumulatif</Button>
                    </Segmented>
                    <Tabs animated>
                      <Tab id="tab-1-1" tabActive>
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Pengguna Baru',
                                  backgroundColor: 'rgba(255,99,132,1)',
                                  borderColor: 'rgba(255,99,132,1)',
                                  borderWidth: 1,
                                  hoverBackgroundColor: 'rgba(255,99,132,1)',
                                  hoverBorderColor: 'rgba(255,99,132,1)',
                                  data: this.state.arrPenggunaBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Pengguna Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.diskrit.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total_pengguna_baru}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                      <Tab id="tab-1-2">
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Pengguna Baru Kumulatif',
                                  backgroundColor: 'rgba(255,99,132,1)',
                                  borderColor: 'rgba(255,99,132,1)',
                                  borderWidth: 1,
                                  hoverBackgroundColor: 'rgba(255,99,132,1)',
                                  hoverBorderColor: 'rgba(255,99,132,1)',
                                  data: this.state.KumulatifArrPenggunaBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Pengguna Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.kumulatif.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total_pengguna}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col width="100" tabletWidth="50" style={{border:'1px solid #ccc', padding:'8px', marginBottom:'8px'}}>
                    <h2 style={{marginBottom:'8px', color:'#434343'}}>Kuis Baru</h2>
                    <Segmented raised style={{marginLeft:'10px'}}>
                        <Button tabLink="#tab-2-1" tabLinkActive>Diskrit</Button>
                        <Button tabLink="#tab-2-2" >Kumulatif</Button>
                    </Segmented>
                    <Tabs animated>
                      <Tab id="tab-2-1" tabActive>
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Kuis Baru',
                                  backgroundColor: '#f57c00',
                                  borderColor: '#f57c00',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#f57c00',
                                  hoverBorderColor: '#f57c00',
                                  data: this.state.arrKuisBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Kuis Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.diskrit.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.kuis_baru_total}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                      <Tab id="tab-2-2" >
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Kuis Baru Kumulatif',
                                  backgroundColor: '#f57c00',
                                  borderColor: '#f57c00',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#f57c00',
                                  hoverBorderColor: '#f57c00',
                                  data: this.state.KumulatifArrKuisBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Kuis Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.kumulatif.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total_kuis}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col width="100" tabletWidth="50" style={{border:'1px solid #ccc', padding:'8px', marginBottom:'8px'}}>
                    <h2 style={{marginBottom:'8px', color:'#434343'}}>Ruang Baru</h2>
                    <Segmented raised style={{marginLeft:'10px'}}>
                        <Button tabLink="#tab-3-1" tabLinkActive>Diskrit</Button>
                        <Button tabLink="#tab-3-2" >Kumulatif</Button>
                    </Segmented>
                    <Tabs animated>
                      <Tab id="tab-3-1" tabActive>
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Ruang Baru',
                                  backgroundColor: '#4caf50',
                                  borderColor: '#4caf50',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#4caf50',
                                  hoverBorderColor: '#4caf50',
                                  data: this.state.arrRuangBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Ruang Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.diskrit.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.ruang_baru_total}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                      <Tab id="tab-3-2" >
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Ruang Baru Kumulatif',
                                  backgroundColor: '#4caf50',
                                  borderColor: '#4caf50',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#4caf50',
                                  hoverBorderColor: '#4caf50',
                                  data: this.state.KumulatifArrRuangBaru
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Ruang Baru</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.kumulatif.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total_ruang}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col width="100" tabletWidth="50" style={{border:'1px solid #ccc', padding:'8px', marginBottom:'8px'}}>
                    <h2 style={{marginBottom:'8px', color:'#434343'}}>Peserta Kuis</h2>
                    <Segmented raised style={{marginLeft:'10px'}}>
                        <Button tabLink="#tab-4-1" tabLinkActive>Diskrit</Button>
                        <Button tabLink="#tab-4-2" >Kumulatif</Button>
                    </Segmented>
                    <Tabs animated>
                      <Tab id="tab-4-1" tabActive>
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Peserta Kuis',
                                  backgroundColor: '#2196f3',
                                  borderColor: '#2196f3',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#2196f3',
                                  hoverBorderColor: '#2196f3',
                                  data: this.state.arrPesertaKuis
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Peserta Kuis</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.diskrit.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.peserta_kuis_total}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                      <Tab id="tab-4-2" >
                        <div>
                          <Bar
                            data={{
                              labels: this.state.arrlabel,
                              datasets: [
                                {
                                  label: 'Peserta Kuis Kumulatif',
                                  backgroundColor: '#2196f3',
                                  borderColor: '#2196f3',
                                  borderWidth: 1,
                                  hoverBackgroundColor: '#2196f3',
                                  hoverBorderColor: '#2196f3',
                                  data: this.state.KumulatifArrPesertaKuis
                                }
                              ]
                            }}
                            width={100}
                            height={300}
                            options={{ maintainAspectRatio: false }}
                          />
                        </div>
                        <br/>
                        <div>
                          <div className="data-table" style={{overflowY:'hidden'}}>
                            <table>
                              <thead style={{background:'#eeeeee'}}>
                                  <tr>
                                      <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                      <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>Peserta Kuis</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {this.props.stat_empu.kumulatif.map((option)=>{
                                  return (
                                    <tr>
                                      <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                      <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total_peserta_kuis}</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </Col>
                  {/* <Col width="0" tabletWidth="15"></Col> */}
                </Row>
              </CardContent>
            </Card>
            <br/>
            {/* <Card className="kuisPage">
              <CardContent className="cari_kuis">
                <h2 style={{marginBottom:'8px', color:'#434343'}}>Dasbor Empu</h2>
                <Row>
                  <Col width="0" tabletWidth="15"></Col>
                  <Col width="100" tabletWidth="70">
                    <Bar
                      data={{
                        labels: this.state.arrlabel,
                        datasets: [
                          {
                            label: 'Kuis Baru',
                            backgroundColor: 'rgba(255,99,132,1)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1,
                            hoverBackgroundColor: 'rgba(255,99,132,1)',
                            hoverBorderColor: 'rgba(255,99,132,1)',
                            data: this.state.arrKuisBaru
                          }
                        ]
                      }}
                      width={100}
                      height={300}
                      options={{ maintainAspectRatio: false }}
                    />
                  </Col>
                  <Col width="0" tabletWidth="15"></Col>
                </Row>
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
    getStatEmpu: Actions.getStatEmpu
  }, dispatch);
}

function mapStateToProps({ App }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      stat_empu: App.stat_empu
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BerandaEmpu);