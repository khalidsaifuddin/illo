import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';


class tampilPlaylist extends Component {
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
        playlist_kuis: {
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

    componentDidMount = () => {
        this.$f7.dialog.preloader()
        
        this.props.getPlaylist(this.state.routeParams).then((result)=>{
            this.setState({
                playlist: result.payload.rows[0]
            },()=>{

                this.props.getPlaylistKuis(this.state.routeParams).then((resultPlaylistKuis)=>{
                    this.setState({
                        playlist_kuis: resultPlaylistKuis.payload
                    },()=>{
                        this.$f7.dialog.close()
                    })
                })
            })
        })
    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;
        
        this.setState({
            playlist: {
                ...this.state.playlist,
                [key]: value
            }
        },()=>{
            //after effect
        });

    }

    hapusPlaylist = () => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus playlist ini? Proses ini tidak dapat dibatalkan!', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader()
            this.props.simpanPlaylist({playlist_id: this.state.playlist.playlist_id, soft_delete: 1}).then((result)=>{
                if(result.payload.sukses){
                    //berhasil hapus
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Berhasil menghapus Playlist!', 'Berhasil', ()=>{
                        this.$f7router.navigate('/Playlist/')
                    })
                }else{
                    //gagal hapus
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan internet Anda. Mohon ulangi lagi dalam beberapa saat!', 'Gagal')
                }
            })
        })

    }

    hapusKuisPlaylist = (sesi_kuis_id, playlist_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus Kuis dari playlist ini? Proses ini tidak dapat dibatalkan!', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader()
            this.props.simpanPlaylistKuis({
                playlist_id: playlist_id,
                sesi_kuis_id: sesi_kuis_id,
                soft_delete: 1,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    // this.$f7.dialog.close()

                    this.props.getPlaylistKuis(this.state.routeParams).then((resultPlaylistKuis)=>{
                        this.setState({
                            playlist_kuis: resultPlaylistKuis.payload
                        },()=>{
                            this.$f7.dialog.close()
                        })
                    })

                    // this.$f7.dialog.alert('Simpan Sesi Kuis Berhasil', 'Berhasil', ()=>{
                    //     this.setState({
                    //         popupOpened: false
                    //     },()=>{
                    //         this.$f7router.navigate('/TampilPlaylist/'+this.$f7route.params['playlist_id'])
                    //     })
    
                    // });
                }else{
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
                }
            })
            // this.props.simpanPlaylistKuis({playlist_id: this.state.playlist.playlist_id, soft_delete: 1}).then((result)=>{
            //     if(result.payload.sukses){
            //         //berhasil hapus
            //         this.$f7.dialog.close()
            //         this.$f7.dialog.alert('Berhasil menghapus Playlist!', 'Berhasil', ()=>{
            //             this.$f7router.navigate('/Playlist/')
            //         })
            //     }else{
            //         //gagal hapus
            //         this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan internet Anda. Mohon ulangi lagi dalam beberapa saat!', 'Gagal')
            //     }
            // })
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        let waktu_buat = '';
        waktu_buat = moment(this.state.playlist.create_date).format('D') + ' ' + this.bulan[(moment(this.state.playlist.create_date).format('M')-1)] + ' ' + moment(this.state.playlist.create_date).format('YYYY');

        return (
            <Page name="tampilPlaylist" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    {/* <NavTitle sliding>Tambah Playlist Kuis</NavTitle> */}
                    <NavRight>
                        {this.state.playlist.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ?
                        <>
                        <Button style={{display:'inline-flex'}} onClick={()=>this.$f7router.navigate('/formPlaylist/'+this.state.playlist.playlist_id)}>
                            Edit
                        </Button>
                        <Button style={{display:'inline-flex', marginLeft:'0px'}} onClick={this.hapusPlaylist}>
                            Hapus
                        </Button>
                        </>
                        :
                        <></>
                        }
                    </NavRight>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <Card>
                            <CardContent style={{textAlign:'center'}}>
                                <div style={{height:'45px', width:'45px', margin:'auto', background:"#cccccc", borderRadius:'50%', textAlign:'center', marginTop:'-10px'}}>
                                    <i className="icons f7-icons" style={{marginTop:'7px', color:'white'}}>gamecontroller_fill</i>
                                </div>
                                <h1 style={{marginTop:'0px'}}>{this.state.playlist.nama} {parseInt(this.state.playlist.status_privasi) === 2 ? <i className="icons f7-icons" style={{fontSize:'18px'}}>lock_fill</i>  : <i className="icons f7-icons" style={{fontSize:'18px'}}>globe</i>}</h1>
                                <div style={{fontSize:'11px', color:'#434343'}}>Oleh <b>{this.state.playlist.pengguna}</b> - Sejak <b>{waktu_buat}</b></div>
                                <div style={{fontSize:'11px', color:'green'}}>{parseInt(this.state.playlist.kolaboratif) === 1 ? 'Kolaboratif' : <></>}</div>
                                <br/>
                                <div style={{fontSize:'11px', color:'#434343'}}>0 pengikut</div>
                                <div style={{marginTop:'16px'}}>
                                    <Button raised fill style={{display:'inline-flex'}} className="bawahCiriBiru">
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>person_badge_plus_fill</i>&nbsp;
                                        Ikuti Playlist
                                    </Button>
                                    &nbsp;
                                    {parseInt(this.state.playlist.kolaboratif) === 1 && this.state.playlist.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id ?
                                    <Button raised fill style={{display:'inline-flex'}} className="bawahCiriBiru" onClick={()=>this.$f7router.navigate('/TambahKuisPlaylist/'+this.state.playlist.playlist_id)}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                        Tambah Kuis
                                    </Button>
                                    :
                                    <></>
                                    }
                                    
                                    {this.state.playlist.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ?
                                    <Button raised fill style={{display:'inline-flex'}} className="bawahCiriBiru" onClick={()=>this.$f7router.navigate('/TambahKuisPlaylist/'+this.state.playlist.playlist_id)}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                        Tambah Kuis
                                    </Button>
                                    :
                                    <></>
                                    }

                                </div>
                            </CardContent>
                        </Card>
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <BlockHeader>Daftar Kuis</BlockHeader>

                                {this.state.playlist_kuis.rows.map((option)=>{
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
                                                <Col width="20" tabletWidth="10" style={{
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
                                                <Col width="80" tabletWidth="90" style={{paddingLeft:'8px', marginLeft:'20%'}}>
                                                    <Row>
                                                        <Col width="100" tabletWidth="70" desktopWidth="75">
                                                            <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                                <Link href={"/tampilKuis/"+option.kuis_id}>{option.judul}</Link>
                                                            </h3>
                                                            <h4 style={{marginTop:'0px', marginBottom:'0px', fontSize:'12px'}}>{option.keterangan}</h4>
                                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                ditambahkan oleh <b>{option.pengguna}</b>
                                                                <br/>ditambahkan tanggal <b>{tanggalKuis}</b>
                                                            </div>
                                                            {/* <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                {option.keterangan}
                                                            </div> */}
                                                        </Col>
                                                        <Col width="100" tabletWidth="30" desktopWidth="25" style={{marginTop:'8px', marginRight:'8px', marginBottom:'8px', textAlign:'left'}}>
                                                            <Button fill className="bawahCiriBiru cardBorder-20" style={{display:'inline-flex', marginRight:'4px'}}>Ikuti Kuis</Button>
                                                            
                                                            {parseInt(this.state.playlist.kolaboratif) === 1 && this.state.playlist.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id ?
                                                            <Button raised fill style={{display:'inline-flex'}} className="bawahCiriBiru" onClick={()=>this.$f7router.navigate('/TambahKuisPlaylist/'+this.state.playlist.playlist_id)}>
                                                                <i className="icons f7-icons" style={{fontSize:'20px'}}>trash</i>
                                                            </Button>
                                                            :
                                                            <></>
                                                            }
                                                            
                                                            {this.state.playlist.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ?
                                                            <Button style={{display:'inline-flex', marginTop:'8px'}} onClick={()=>this.hapusKuisPlaylist(option.sesi_kuis_id, option.playlist_id)}>
                                                                <i className="icons f7-icons" style={{fontSize:'20px'}}>trash</i>
                                                            </Button>
                                                            :
                                                            <></>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
                </Row>
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
      getPlaylistKuis: actions.getPlaylistKuis,
      simpanPlaylist: actions.simpanPlaylist,
      simpanPlaylistKuis: actions.simpanPlaylistKuis
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilPlaylist));
  