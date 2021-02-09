import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardHeader, Row, Col, CardContent, List, ListItem, Searchbar, Subnavbar, Link, Popover, Progressbar
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
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            mata_pelajaran_id: this.$f7route.params['mata_pelajaran_id']
        },
        routeParamsKuis: {
            foo: 'bar'
        },
        kuis: {
            rows: [],
            total: 0
        },
        loading_kuis: {},
        unduh_kuis: {}
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
        this.props.getMapel(this.state.routeParams).then(()=>{
            this.setState({
                routeParamsKuis: {
                    mata_pelajaran_id: this.$f7route.params['mata_pelajaran_id'] ? (parseInt(this.$f7route.params['mata_pelajaran_id']) !== 98 ? this.$f7route.params['mata_pelajaran_id'] : null) : null,
                    jenjang_id: (parseInt(this.$f7route.params['mata_pelajaran_id']) === 98 ? this.$f7route.params['mata_pelajaran_id'] : null),
                    status_privasi: 1,
                    limit: 20,
                    start: 0,
                    tampilkan_pertanyaan: 'N',
                    publikasi: 1
                }
            },()=>{
                this.props.getKuis(this.state.routeParamsKuis).then(()=>{
                    this.setState({
                        loading: false,
                        kuis: this.props.kuis
                    });
                });
            });
        });
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
            <Page name="daftarKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Kuis</NavTitle>
                    <NavTitleLarge>
                        Daftar Kuis
                    </NavTitleLarge>
                    <Subnavbar>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            backdrop={false}
                            customSearch={true}
                            placeholder="Cari kuis..."
                            searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariKuis}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParamsKuis.keyword}
                            // clickClear={this.clickClear}
                            style={{top:'0px'}}
                        ></Searchbar>
                    </Subnavbar>
                </Navbar>
                <Row noGap>
                    <Col width="100" tabletWidth="70" desktopWidth="70">
                        {this.state.loading &&
                        <Card style={{borderBottom:'3px solid #009efd'}} className={"skeleton-text skeleton-effect-blink"}>
                            <Row>
                                <Col width="20" style={{
                                    height:'80px', 
                                    background:'#cccccc', 
                                    marginTop:'0px', 
                                    marginBottom:'0px'
                                }}>
                                    &nbsp;
                                </Col>
                                <Col width="80" style={{paddingLeft:'8px'}}>
                                    <Row>
                                        <Col width="100" tabletWidth="70">
                                            <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                {"option.judul"}
                                            </h3>
                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                dibuat oleh <b>{"option.pengguna"}</b> tanggal <b>{"tanggalKuis"}</b>
                                            </div>
                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                {"option.keterangan"}
                                            </div>
                                        </Col>
                                        <Col width="100" tabletWidth="30" style={{padding:'8px'}}>
                                            <Row>
                                                <Col width="75">
                                                    <Button large raised fill onClick={()=>this.prosesGabungKuis("option.kode_sesi")} style={{background:'#cccccc'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                        Ikuti
                                                    </Button>
                                                </Col>
                                                <Col width="100" style={{fontSize:'10px'}}>
                                                    Ikuti sesi umum kuis ini
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        }
                        {!this.state.loading &&
                        <>
                        {this.state.kuis.rows.map((option)=>{
                            let d1 = moment();
                            let d2 = moment(option.waktu_mulai);
                            let d3 = moment(option.waktu_selesai);
                            // let disabled = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? false : true) : true);
                            // let disabled_label = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');
                            // moment(option.create_date)
                            let tanggalKuis = '';
                    
                            tanggalKuis = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');


                            return (
                                <Card style={{borderBottom:'3px solid #009efd'}}>
                                    <Row>
                                        <Col width="20" style={{
                                            // height:'18vh',
                                            height: '100%',
                                            position: 'absolute',
                                            borderRadius:'20px 0px 0px 20px', 
                                            background:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'") no-repeat center center / cover', 
                                            marginTop:'0px', 
                                            marginBottom:'0px'
                                            // backgroundPosition:'center', 
                                            // backgroundRepeat:'no-repeat',
                                            // backgroundSize:'cover', 
                                            // backgroundAttachment:'fixed',
                                            // marginRight: '8px'
                                        }}>
                                            &nbsp;
                                        </Col>
                                        <Col width="80" style={{paddingLeft:'8px', marginLeft:'20%', paddingBottom:'16px'}}>
                                            <Row>
                                                <Col width="100" tabletWidth="70">
                                                    <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                        <Link href={"/tampilKuis/"+option.kuis_id}>{option.judul}</Link>
                                                    </h3>
                                                    <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                        dibuat oleh <b>{option.pengguna}</b> tanggal <b>{tanggalKuis}</b>
                                                    </div>
                                                    <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                        {option.keterangan ? option.keterangan : '-'}
                                                    </div>
                                                    <div style={{marginRight:'8px'}}>
                                                            {this.state.loading_kuis[option.sesi_kuis_id] &&
                                                            <Progressbar infinite></Progressbar>
                                                            }
                                                            {!localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                                            <Button className="cardBorder-20" style={{marginTop:'8px', border:'1px solid #cccccc'}} onClick={()=>this.unduhKuis(option.sesi_kuis_id, option.kuis_id, option.kode_sesi)}>
                                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>heart</i>&nbsp;
                                                                <span style={{color:'#434343'}}>Simpan Kuis</span>
                                                            </Button>
                                                            }
                                                            {localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                                            <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'#F44336'}}>heart_fill</i>&nbsp;
                                                                <span>Kuis Tersimpan</span>
                                                            </Button>
                                                            }
                                                    </div>
                                                </Col>
                                                <Col width="85" tabletWidth="20" style={{padding:'8px'}}>
                                                    <Row>
                                                        <Col width="100">
                                                            <Button className="bawahCiriBiru" raised fill onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi)}>
                                                                <i className="icon f7-icons" style={{fontSize:'20px'}}>play_fill</i>&nbsp;
                                                                Ikuti
                                                            </Button>
                                                        </Col>
                                                        {/* <Col width="25">
                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.sesi_kuis_id}>
                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                            </Button>
                                                        </Col> */}
                                                        <Col width="100" style={{fontSize:'10px'}}>
                                                            <br/>
                                                            Ikuti sesi umum kuis ini
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col width="15" tabletWidth="10" style={{padding:'8px'}}>
                                                    <Link popoverOpen={".popover-menu-kuis-"+option.kuis_id}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px'}}>ellipsis_vertical</i>&nbsp;
                                                    </Link>
                                                    <Popover className={"popover-menu-kuis-"+option.kuis_id}>
                                                        <List>
                                                            {parseInt(option.a_boleh_assign) === 1 &&
                                                            <ListItem link={'/buatSesiKuis/'+option.kuis_id+"/kuis_orang_lain"} popoverClose title="Buat Sesi Kuis" />
                                                            }
                                                            <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat" />
                                                            <ListItem link={'/statistikKuis/'+option.sesi_kuis_id} popoverClose title="Statistik" />
                                                        </List>
                                                    </Popover>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {/* <CardContent>
                                        {option.judul}
                                    </CardContent> */}
                                    {/* <Popover className={"popover-menu-"+option.sesi_kuis_id}>
                                        <List>
                                            <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat Hasil" />
                                        </List>
                                    </Popover> */}
                                </Card>
                            )
                        })}
                        </>
                        }
                    </Col>
                    <Col width="0" tabletWidth="30" desktopWidth="30">
                        <Card>
                            <CardHeader>
                                Saring dan Urut
                            </CardHeader>
                            <CardContent>
                                <List>
                                    <ListItem
                                        title="Jenjang"
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup', searchbar: true, searchbarPlaceholder: 'Saring Jenjang'}}
                                        >
                                        <select name="jenjang_id" defaultValue={"99"} onChange={this.setParamValue}>
                                            <option value={"99"}>Semua</option>
                                            <option value={"1"}>SD</option>
                                            <option value={"2"}>SMP</option>
                                            <option value={"3"}>SMA</option>
                                            <option value={"4"}>SMK</option>
                                        </select>
                                    </ListItem>
                                    <ListItem
                                        title="Tingkat"
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup', searchbar: true, searchbarPlaceholder: 'Saring Tingkat'}}
                                        >
                                        <select name="tingkat_pendidikan_id" defaultValue={"99"} onChange={this.setParamValue}>
                                            <option value={"99"}>Semua</option>
                                            <option value={"1"}>Kelas 1</option>
                                            <option value={"2"}>Kelas 2</option>
                                            <option value={"4"}>Kelas 4</option>
                                            <option value={"5"}>Kelas 5</option>
                                            <option value={"6"}>Kelas 6</option>
                                            <option value={"7"}>Kelas 7</option>
                                            <option value={"8"}>Kelas 8</option>
                                            <option value={"9"}>Kelas 9</option>
                                            <option value={"10"}>Kelas 10</option>
                                            <option value={"11"}>Kelas 11</option>
                                            <option value={"12"}>Kelas 12</option>
                                            <option value={"13"}>Kelas 13</option>
                                        </select>
                                    </ListItem>
                                </List>
                                {/* <List>
                                    <ListItem
                                        title="Tingkat"
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup', searchbar: true, searchbarPlaceholder: 'Saring Tingkat'}}
                                        >
                                        <select name="tingkat_pendidikan_id" defaultValue={"99"} onChange={this.setParamValue}>
                                            <option value={"99"}>Semua</option>
                                            <option value={"1"}>Kelas 1</option>
                                            <option value={"2"}>Kelas 2</option>
                                            <option value={"4"}>Kelas 4</option>
                                            <option value={"5"}>Kelas 5</option>
                                            <option value={"6"}>Kelas 6</option>
                                            <option value={"7"}>Kelas 7</option>
                                            <option value={"8"}>Kelas 8</option>
                                            <option value={"9"}>Kelas 9</option>
                                            <option value={"10"}>Kelas 10</option>
                                            <option value={"11"}>Kelas 11</option>
                                            <option value={"12"}>Kelas 12</option>
                                            <option value={"13"}>Kelas 13</option>
                                        </select>
                                    </ListItem>
                                </List> */}
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
  