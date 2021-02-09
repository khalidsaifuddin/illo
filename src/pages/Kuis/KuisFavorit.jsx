import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardHeader, Row, Col, CardContent, List, ListItem, Searchbar, Subnavbar, Link, Popover, Segmented, CardFooter, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import localForage from 'localforage';

import moment from 'moment';

class daftarKuis extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        routeParamsKuis: {
            foo: 'bar'
        },
        kuis: {
            rows: [],
            total: 0
        }
    }

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

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    componentDidMount = () => {
        // this.props.getMapel(this.state.routeParams).then(()=>{
        //     this.setState({
        //         routeParamsKuis: {
        //             mata_pelajaran_id: this.$f7route.params['mata_pelajaran_id'] ? (parseInt(this.$f7route.params['mata_pelajaran_id']) !== 98 ? this.$f7route.params['mata_pelajaran_id'] : null) : null,
        //             jenjang_id: (parseInt(this.$f7route.params['mata_pelajaran_id']) === 98 ? this.$f7route.params['mata_pelajaran_id'] : null),
        //             status_privasi: 1,
        //             limit: 20,
        //             start: 0,
        //             tampilkan_pertanyaan: 'N',
        //             publikasi: 1
        //         }
        //     },()=>{
        //         this.props.getKuis(this.state.routeParamsKuis).then(()=>{
        //             this.setState({
        //                 loading: false,
        //                 kuis: this.props.kuis
        //             });
        //         });
        //     });
        // });

        localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ).then((value)=>{
            this.setState({
                kuis: {
                    rows: value,
                    total: value.length
                }
            },()=>{
                console.log(this.state.kuis)
            })
        })
    }

    setParamValue = (b) => {
        this.setState({
            ...this.state,
            loading: true,
            routeParamsKuis: {
                ...this.state.routeParams,
                start: 0,
                [b.target.getAttribute('name')]: (parseInt(b.target.value) !== 99 ? b.target.value : null)
            },
            activePage: 1
        },()=>{
            this.props.getKuis(this.state.routeParamsKuis).then(()=>{
                this.setState({
                    loading: false,
                    kuis: this.props.kuis
                });
            });
        });
    }

    cariKuis = () => {
        
        this.setState({
            loading: true,
            routeParamsKuis: {
                ...this.state.routeParams,
                keyword: event.target[0].value,
                status_privasi: 1,
                sesi: 'umum',
                pengguna_id: null
            }
        },()=>{

            this.props.getKuis(this.state.routeParamsKuis).then(()=>{
                this.setState({
                    loading: false,
                    kuis: this.props.kuis
                });
            });
            
        })
    }

    ketikCari = (e) => {
        // console.log(e.currentTarget.value);
        this.setState({
            routeParamsKuis: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    hapusKuisTersimpan = (kuis_id, sesi_kuis_id) => {

        let arrKuis = []

        this.state.kuis.rows.map((option)=>{
            if(option.sesi_kuis_id !== sesi_kuis_id){
                arrKuis.push(option)
            }
        })

        this.setState({
            kuis: {
                rows: arrKuis,
                total: arrKuis.length
            },
            tmp_hapus_kuis: {
                kuis_id: kuis_id,
                sesi_kuis_id: sesi_kuis_id
            }
        },()=>{
            localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, this.state.kuis.rows )
            localStorage.removeItem( 'getKuis:'+JSON.parse( localStorage.getItem('user') ).pengguna_id+':'+this.state.tmp_hapus_kuis.kuis_id+':'+this.state.tmp_hapus_kuis.sesi_kuis_id )
        })
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
              },()=>{
    
                localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.props.kuis).then((valueId)=>{
                  localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.kode_sesi, this.props.kuis).then((valueKode)=>{
                    // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))
                    console.log(valueKode)
                    
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

    render()
    {
        return (
            // <Page name="daftarKuis" hideBarsOnScroll style={{paddingBottom:'40px'}} className="halamanBeranda">
            <Page name="daftarKuis" hideBarsOnScroll style={{paddingBottom:'40px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kuis Tersimpan</NavTitle>
                    {/* <NavTitleLarge>
                        Kuis Tersimpan
                    </NavTitleLarge> */}
                    <Subnavbar>
                    <Row noGap style={{width:'100%'}}>
                        <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                        <Col width="100" tabletWidth="80" desktopWidth="80">
                            <Segmented raised>
                                <Button style={{color:'#434343', fontWeight:'bold'}} className="color-theme-deeporange" onClick={()=>this.$f7router.navigate('/Kuis/'+JSON.parse(localStorage.getItem('user')).pengguna_id)}>Kuis yang Anda Ikuti</Button>
                                <Button style={{color:'#434343', fontWeight:'bold'}} className="color-theme-deeporange" tabLinkActive>Kuis Tersimpan</Button>
                            </Segmented>
                        </Col>
                        <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    </Row>
                    </Subnavbar>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        <BlockTitle style={{fontWeight:'bold'}}>Kuis Tersimpan ({this.state.kuis.total ? this.state.kuis.total : '0'})</BlockTitle>
                        {this.state.kuis.total > 0 &&
                        <>
                        <Row noGap style={{marginTop:'16px', justifyContent: 'start'}}>
                        {this.state.kuis.rows.map((option)=>{
                            return (
                                <Col width="100" tabletWidth="33">
                                    <Card className={"cardBorder-20"} style={{margin:'8px'}}>
                                        <CardContent 
                                        className="cardBorder-20"
                                        style={{
                                            background:'#37474F',
                                            backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                            backgroundSize:'cover',
                                            height:'50px'
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
                                                <Col width={50}>
                                                    <b>{option.jenjang}
                                                    <br/>{option.tingkat_pendidikan} {parseInt(option.tingkat_pendidikan_id) === 99 ? 'Semua Tingkat Kelas' : ''}</b>
                                                    <b>{option.mata_pelajaran ? <> - {option.mata_pelajaran}</> : ''}</b><br/>
                                                </Col>
                                                <Col width={50}>
                                                    <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                                        <i className="icons f7-icons" style={{fontSize:'20px', color:'#F44336'}}>heart_fill</i>&nbsp;
                                                        <span>Kuis Tersimpan</span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="bawahCiriBiru cardBorder-20" raised fill onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi+'/'+option.kuis_id)}>
                                                <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                Ikuti kuis
                                            </Button>
                                            <Button onClick={()=>this.hapusKuisTersimpan(option.kuis_id, option.sesi_kuis_id)}>
                                                Hapus
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )
                        })}
                        </Row>
                        </>
                        }
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                </Row>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getKuisDiikuti: Actions.getKuisDiikuti,
      getMapel: Actions.getMapel
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        kuis_diikuti: Kuis.kuis_diikuti,
        mapel: App.mapel
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarKuis));
  