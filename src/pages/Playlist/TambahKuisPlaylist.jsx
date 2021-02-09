import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, Popup, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader, Subnavbar, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';
import KuisFavorit from '../Kuis/KuisFavorit';


class TambahKuisPlaylist extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            playlist_id: this.$f7route.params['playlist_id'] ? this.$f7route.params['playlist_id'] : null
        },
        pengguna: {},
        playlist: {
            playlist_id: this.$f7route.params['playlist_id'] ? this.$f7route.params['playlist_id'] : null,
            status_privasi:2,
            kolaboratif: 0
        },
        kuis: {
            rows: [],
            total: 0
        },
        loading_kuis: {},
        popupOpened: false,
        sesi_kuis: {
            total: 0,
            rows: []
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

    componentDidMount = () => {
        this.$f7.dialog.preloader()
        
        this.props.getPlaylist(this.state.routeParams).then((result)=>{
            this.setState({
                playlist: result.payload.rows[0]
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    cariPertanyaan = () => {
        this.$f7.dialog.preloader()

        this.props.getKuis({...this.state.routeParams, status_privasi: 1, untuk_playlist: true, playlist_id: this.$f7route.params['playlist_id']}).then((result)=>{
            this.setState({
                loading: false,
                loadingKuis: false,
                kuis: this.props.kuis
            },()=>{
                this.$f7.dialog.close()
            })
        });
    }

    ketikCari = (e) => {
        // console.log(e.currentTarget.value);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    tambahKuis = (kuis_id, nama_kuis) => {
        // alert(kuis_id);
        this.setState({
            popupOpened: true,
            judul_kuis: nama_kuis
        },()=>{
            this.props.getSesiKuis({kuis_id: kuis_id}).then((result)=>{
                this.setState({
                    sesi_kuis: result.payload
                })
            })
        })
    }

    pilihSesiKuis = (playlist_id, sesi_kuis_id) => {
        this.$f7.dialog.preloader()

        this.props.simpanPlaylistKuis({
            playlist_id: playlist_id,
            sesi_kuis_id: sesi_kuis_id,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        }).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Simpan Sesi Kuis Berhasil', 'Berhasil', ()=>{
                    this.setState({
                        popupOpened: false
                    },()=>{
                        this.$f7router.navigate('/TampilPlaylist/'+this.$f7route.params['playlist_id'])
                    })

                });
            }else{
                //gagal
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
            }
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        let waktu_buat = '';
        waktu_buat = moment(this.state.playlist.create_date).format('D') + ' ' + this.bulan[(moment(this.state.playlist.create_date).format('M')-1)] + ' ' + moment(this.state.playlist.create_date).format('YYYY');

        return (
            <Page name="TambahKuisPlaylist" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Kuis untuk "{this.state.playlist.nama}"</NavTitle>
                    <Subnavbar inner={false}>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            placeholder="Cari kuis..."
                            searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariPertanyaan}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                            // clickClear={this.clickClear}
                        ></Searchbar>
                    </Subnavbar>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="0"></Col>
                    <Col width="100" tabletWidth="100">
                        <Card>
                            {/* <CardHeader>Hasil Pencarian Kuis</CardHeader> */}
                            <CardContent style={{padding:'8px'}}>
                                <BlockHeader>Hasil Pencarian</BlockHeader>
                                {!this.state.loadingKuis &&
                                <>
                                {this.state.kuis.rows.map((option)=>{
                                    let d1 = moment();
                                    let d2 = moment(option.waktu_mulai);
                                    let d3 = moment(option.waktu_selesai);
                                    // let disabled = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? false : true) : true);
                                    // let disabled_label = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');
                                    // moment(option.create_date)
                                    let tanggalKuis = '';
                                    let tgl = new Date(option.create_date);
                            
                                    tanggalKuis = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                    let disabled = (d1.isAfter(d2) ? (d1.isBefore(d3) ? false : true) : true);
                                    let disabled_label = (d1.isAfter(d2) ? (d1.isBefore(d3) ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');

                                    return (
                                        <Card>
                                            <Row>
                                                <Col width="20" style={{
                                                    height:'100%',
                                                    position: 'absolute', 
                                                    width:'20%',
                                                    borderRadius:'20px 0px 0px 20px', 
                                                    // backgroundPosition:'center', 
                                                    background:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'") no-repeat center center / cover', 
                                                    // backgroundRepeat:'no-repeat',
                                                    // backgroundSize:'cover', 
                                                    // backgroundAttachment:'fixed',
                                                    marginTop:'0px', 
                                                    marginBottom:'0px'
                                                    // marginRight: '8px'
                                                }}>
                                                    &nbsp;
                                                </Col>
                                                <Col width="80" style={{paddingLeft:'8px', marginLeft:'20%'}}>
                                                    <Row>
                                                        <Col width="100" tabletWidth="70">
                                                            <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                                <Link href={"/tampilKuis/"+option.kuis_id}>{option.judul}</Link>
                                                            </h3>
                                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                dibuat oleh <b>{option.pengguna}</b>
                                                                <br/>Tanggal <b>{tanggalKuis}</b>
                                                            </div>
                                                            {/* <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                {option.keterangan}
                                                            </div> */}
                                                        </Col>
                                                        <Col width="100" tabletWidth="30">
                                                            <Button onClick={()=>this.tambahKuis(option.kuis_id, option.judul)} raised fill className="cardBorder-20" style={{marginTop:'8px', marginBottom:'8px', marginRight:'8px'}}>                                                            
                                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'white'}}>plus</i>&nbsp;
                                                                <span>Tambahkan Kuis</span>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    )
                                })}
                                </>
                                }
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="0"></Col>
                </Row>
                <Popup opened={this.state.popupOpened} onPopupClosed={() => this.setState({popupOpened : false})}>
                    <Page>
                        <Navbar title={"Pilih Sesi Kuis "+this.state.judul_kuis}>
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <List>
                            {this.state.sesi_kuis.rows.map((optionSesiKuis)=>{

                                let waktu_mulai = '';
                                waktu_mulai = moment(optionSesiKuis.waktu_mulai).format('D') + ' ' + this.bulan[(moment(optionSesiKuis.waktu_mulai).format('M')-1)] + ' ' + moment(optionSesiKuis.waktu_mulai).format('YYYY') + ' ' + moment(optionSesiKuis.waktu_mulai).format('HH') + ':' + moment(optionSesiKuis.waktu_mulai).format('m');
                                
                                let waktu_selesai = '';
                                waktu_selesai = moment(optionSesiKuis.waktu_selesai).format('D') + ' ' + this.bulan[(moment(optionSesiKuis.waktu_selesai).format('M')-1)] + ' ' + moment(optionSesiKuis.waktu_selesai).format('YYYY') + ' ' + moment(optionSesiKuis.waktu_mulai).format('HH') + ':' + moment(optionSesiKuis.waktu_mulai).format('m');

                                return (
                                    <ListItem>
                                        <Row style={{width:'100%'}}>
                                            <Col width={70}>
                                                {optionSesiKuis.keterangan}<br/>
                                                <span style={{fontSize:'10px'}}>{optionSesiKuis.waktu_mulai ? waktu_mulai : 'Tidak berbatas waktu'} - {optionSesiKuis.waktu_selesai ? waktu_selesai : 'Tidak berbatas waktu'}</span>
                                            </Col>
                                            <Col width={30} style={{textAlign:'right'}}>
                                                <Button fill style={{display:'inline-flex'}} onClick={()=>this.pilihSesiKuis(this.$f7route.params['playlist_id'], optionSesiKuis.sesi_kuis_id)}>
                                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                                    Pilih
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Page>
                </Popup>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna,
      getPlaylist: actions.getPlaylist,
      simpanPlaylist: actions.simpanPlaylist,
      getKuis: actions.getKuis,
      getSesiKuis: actions.getSesiKuis,
      simpanPlaylistKuis: actions.simpanPlaylistKuis
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        kuis: Kuis.kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TambahKuisPlaylist));
  