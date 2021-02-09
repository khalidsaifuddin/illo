import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Preloader, Radio
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

class kehadiranSiswa extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            tanggal: moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD')
        },
        sekolah_pengguna: {
            rows: [],
            total: 0
        },
        sekolah_pengguna_record: {},
        geolocation: false,
        zoom: 17,
        lintang: -8.109038,
        bujur: 113.141552,
        kehadiran_siswa_total: 0,
        kehadiran_siswa_record: {
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        pengaturan_sekolah: {
            radius_absen_aktif: 1,
            radius_absen_sekolah_guru: 1000
        }
    }

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
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
        this.$f7.dialog.preloader();

        setInterval(() => {
            this.setState({
                sekarang: moment().format('D') + ' ' + this.bulan[(moment().format('M')-1)] + ' ' + moment().format('YYYY'),
                sekarang_pukul: moment().format('H') + ':' + moment().format('mm') + ':' + moment().format('ss')
            })
        }, 1000);

        this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah_pengguna: this.props.sekolah_pengguna,
                sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0]
            });
        });

        this.props.getKehadiranSiswa(this.state.routeParams).then((result)=>{
            console.log(this.props.kehadiran_siswa); 
            this.$f7.dialog.close();
            if(this.props.kehadiran_siswa.total > 0){

                this.setState({
                    kehadiran_siswa_record: this.props.kehadiran_siswa.rows[0],
                    kehadiran_siswa_total: this.props.kehadiran_siswa.total
                });

            }
        });

        if ("geolocation" in navigator) {
            console.log("geolocation Available");
            navigator.geolocation.getCurrentPosition((position) => {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                this.setState({
                    geolocation: true,
                    lintang: position.coords.latitude,
                    bujur: position.coords.longitude
                },()=>{
                    this.props.getJarakSekolah({
                        lintang: position.coords.latitude, 
                        bujur: position.coords.longitude,
                        pengguna_id: this.$f7route.params['pengguna_id'],
                        sekolah_id: this.$f7route.params['sekolah_id']
                    }).then((result)=>{
                        this.props.getPengaturanSekolah({sekolah_id: this.$f7route.params['sekolah_id']}).then((result)=>{
                            this.setState({
                                pengaturan_sekolah: this.props.pengaturan_sekolah.rows[0]
                            })
                        })
                    })
                });
            }, (error) => {
                switch(error.code) {
                  case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    this.setState({
                        geolocation: false,
                        geolocation_error: 'blocked'
                    });
                    break;
                  case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                    this.setState({
                        geolocation: false,
                        geolocation_error: 'unavailable'
                    });
                    break;
                  case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                    this.setState({
                        geolocation: false,
                        geolocation_error: 'timeout'
                    });
                    break;
                  case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                    this.setState({
                        geolocation: false,
                        geolocation_error: 'unknown'
                    });
                    break;
                }
              });
        } else {
            console.log("geolocation Not Available");
        }
    }

    catatKehadiran = (tipe) => {
        // alert('hadir!');    

        if(tipe === 'hadir'){
            this.$f7.dialog.preloader();
            this.setState({
                kehadiran_siswa_record: {
                    ...this.state.kehadiran_siswa_record,
                    media_input_kehadiran_id: (localStorage.getItem('device') === 'web' ? 1 : 2),
                    tanggal:  moment().format('YYYY') + "-" + moment().format('MM') + "-" + moment().format('DD'),
                    waktu_datang: moment().format('YYYY') + "-" + moment().format('MM') + "-" + moment().format('DD') + " " + moment().format('H') + ':' + moment().format('mm') + ':' + moment().format('ss'),
                    waktu_pulang: null,
                    keterangan: '-',
                    lintang: this.state.lintang,
                    bujur: this.state.bujur,
                    jenis_kehadiran_id: 1
                }
            },()=>{
                console.log(this.state.kehadiran_siswa_record);
                this.props.simpanKehadiranSiswa(this.state.kehadiran_siswa_record).then((result)=>{
                    if(result.payload.sukses){
                        //berhasil!
                        this.$f7.dialog.close();
                        this.$f7.dialog.alert('Selamat Belajar!', 'Berhasil menyimpan kehadiran!');
                        this.props.getKehadiranSiswa(this.state.routeParams).then((result)=>{
                            this.setState({
                                kehadiran_siswa_record: this.props.kehadiran_siswa.rows[0],
                                kehadiran_siswa_total: this.props.kehadiran_siswa.total
                            });
                        });
                    }else{
                        //gagal :(
                            this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                            return false;
                    }
                })
            });

        }else{
            //absen pulang
            this.$f7.dialog.confirm('Anda yakin akan mencatat waktu pulang sekarang? Proses ini tidak dapat dibatalkan atau diulangi!','Konfirmasi',()=>{
                this.$f7.dialog.preloader();
                this.setState({
                    kehadiran_siswa_record: {
                        ...this.state.kehadiran_siswa_record,
                        waktu_pulang: moment().format('YYYY') + "-" + moment().format('MM') + "-" + moment().format('DD') + " " + moment().format('H') + ':' + moment().format('mm') + ':' + moment().format('ss')
                    }
                },()=>{
                    this.props.simpanKehadiranSiswa(this.state.kehadiran_siswa_record).then((result)=>{
                        if(result.payload.sukses){
                            //berhasil!
                            this.$f7.dialog.close();
                            this.$f7.dialog.alert('Selamat beristirahat! Sampai jumpa esok hari!', 'Berhasil menyimpan waktu pulang!');
                            this.props.getKehadiranSiswa(this.state.routeParams).then((result)=>{
                                this.setState({
                                    kehadiran_siswa_record: this.props.kehadiran_siswa.rows[0],
                                    kehadiran_siswa_total: this.props.kehadiran_siswa.total
                                });
                            });
                        }else{
                            //gagal :(
                                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                                return false;
                        }
                    })
                });
            });
        }

    }

    render()
    {
        return (
            <Page name="kehadiranSiswa" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kehadiran Siswa</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <div style={{textAlign:'center', width:'100%'}}>
                            <Card>
                                <CardContent>
                                    <h2>{this.state.sekarang}, {this.state.sekarang_pukul}</h2>
                                    {/* <h2></h2> */}
                                    <div style={{fontSize:'20px', color: '#007AFF', fontWeight:'bold', marginTop:'16px'}}>
                                        {this.state.sekolah_pengguna_record.nama_sekolah}
                                    </div>
                                    {this.state.kehadiran_siswa_record.waktu_datang &&
                                    <div style={{fontSize:'15px', color: 'teal', fontWeight:'normal', marginTop:'16px'}}>
                                        Waktu Hadir: {moment(this.state.kehadiran_siswa_record.waktu_datang).format('H') + ':' + moment(this.state.kehadiran_siswa_record.waktu_datang).format('mm') + ':' + moment(this.state.kehadiran_siswa_record.waktu_datang).format('ss')}
                                    </div>
                                    }
                                    {this.state.kehadiran_siswa_record.waktu_pulang &&
                                    <div style={{fontSize:'15px', color: 'teal', fontWeight:'normal', marginTop:'0px'}}>
                                        Waktu Pulang: {moment(this.state.kehadiran_siswa_record.waktu_pulang).format('H') + ':' + moment(this.state.kehadiran_siswa_record.waktu_pulang).format('mm') + ':' + moment(this.state.kehadiran_siswa_record.waktu_pulang).format('ss')}
                                    </div>
                                    }
                                    {this.state.pengaturan_sekolah &&
                                    <Button disabled={((this.state.pengaturan_sekolah && parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) !== 1 ? (!this.state.kehadiran_siswa_record.waktu_pulang ? false : true) : (parseFloat(this.props.jarak_sekolah.m) <= parseFloat(this.state.pengaturan_sekolah.radius_absen_sekolah_guru) ? (!this.state.kehadiran_siswa_record.waktu_pulang ? false : true) : true) ) )} raised fill large className={(this.state.kehadiran_siswa_total > 0 ? "button-absen color-theme-teal bawahCiriHijau" : "button-absen color-theme-red bawahCiri")} onClick={()=>this.catatKehadiran((this.state.kehadiran_siswa_total > 0 ? 'pulang' : 'hadir'))}>
                                        <img src={localStorage.getItem('api_base')+"/assets/img/125503_white.png"} style={{height:'70px'}} />
                                        <br/>
                                        <div>{(this.state.kehadiran_siswa_total > 0 ? (!this.state.kehadiran_siswa_record.waktu_pulang ? 'Pulang' : '-') : 'Hadir')}</div>
                                    </Button>
                                    }
                                    {!this.state.pengaturan_sekolah &&
                                    <Button disabled={(!this.state.kehadiran_siswa_record.waktu_pulang ? false : true)} raised fill large className={(this.state.kehadiran_siswa_total > 0 ? "button-absen color-theme-teal bawahCiriHijau" : "button-absen color-theme-red bawahCiri")} onClick={()=>this.catatKehadiran((this.state.kehadiran_siswa_total > 0 ? 'pulang' : 'hadir'))}>
                                        <img src={localStorage.getItem('api_base')+"/assets/img/125503_white.png"} style={{height:'70px'}} />
                                        <br/>
                                        <div>{(this.state.kehadiran_siswa_total > 0 ? (!this.state.kehadiran_siswa_record.waktu_pulang ? 'Pulang' : '-') : 'Hadir')}</div>
                                    </Button>
                                    }
                                    <br/>
                                    <BlockTitle style={{marginTop:'16px'}}>Lokasi Anda Saat ini</BlockTitle>
                                    {this.state.pengaturan_sekolah && parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) === 1 &&
                                    <Card>
                                        <CardContent>
                                            Jarak dari sekolah:
                                            <div style={{fontSize:'25px'}}>
                                                <b>{this.formatAngka(parseFloat(this.props.jarak_sekolah.km).toFixed(2))} km</b><br/>
                                                <div style={{fontSize:'15px', marginTop:'0px'}}>({this.formatAngka(parseFloat(this.props.jarak_sekolah.m).toFixed(0))} meter)</div>
                                                {/* {parseFloat(this.props.jarak_sekolah.m)} - {parseFloat(this.state.pengaturan_sekolah.radius_absen_sekolah_guru)} */}
                                                {this.state.pengaturan_sekolah && parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) === 1 &&
                                                <>
                                                {/* Radius absen aktif! */}
                                                {(parseFloat(this.props.jarak_sekolah.m) > parseFloat(this.state.pengaturan_sekolah.radius_absen_sekolah_guru)) &&
                                                <>
                                                <Card>
                                                    <CardContent style={{fontSize:'12px', color:'white', background:'#F44336'}}>
                                                Lokasi Anda saat ini terlalu jauh dari titik koordinat sekolah yang telah ditentukan. Mohon pindah ke tempat dalam radius <b>{this.formatAngka(this.state.pengaturan_sekolah.radius_absen_sekolah_guru)}</b> meter dari titik koordinat sekolah!
                                                    </CardContent>
                                                </Card>
                                                </>
                                                }
                                                </>
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                    }
                                    <div style={{border:'1px solid #ccc', width:'100%', height:'160px', marginTop:'8px', borderRadius:'20px', overflow:'hidden'}}>
                                        <Map 
                                            style={{
                                                // paddingBottom: "5%",
                                                height: '160px',
                                                width: "100%",
                                                // marginTop:'35px',
                                                cursor: 'pointer'
                                            }} 
                                            center={[this.state.lintang, this.state.bujur]} zoom={this.state.zoom}
                                            // onLocationfound={this.handleLocationFound}
                                            // onClick={this.klikPeta}
                                        >
                                            <TileLayer
                                                // attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                                // url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"/>
                                            />
                                            {/* attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                                            <Marker position={[this.state.lintang, this.state.bujur]}>
                                                {/* <Popup keepInView={true}>
                                                    {this.state.popup}
                                                </Popup> */}
                                            </Marker>
                                        </Map>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
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
      getSekolah: actions.getSekolah,
      getSekolahPengguna: actions.getSekolahPengguna,
      simpanSekolahPengguna: actions.simpanSekolahPengguna,
      getKehadiranSiswa: actions.getKehadiranSiswa,
      simpanKehadiranSiswa: actions.simpanKehadiranSiswa,
      getJarakSekolah: actions.getJarakSekolah,
      getPengaturanSekolah: actions.getPengaturanSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Guru }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna,
        kehadiran_siswa: Guru.kehadiran_siswa,
        jarak_sekolah: Sekolah.jarak_sekolah,
        pengaturan_sekolah: Sekolah.pengaturan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kehadiranSiswa));
  