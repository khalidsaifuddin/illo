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


class pengaturanPengguna extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        pengguna: {},
        sekolah: {},
        pengaturan_pengguna: {},
        pengaturan_sekolah: {},
        actionGridOpened: false,
        zoom: 17,
        hasLocation: false,
        bujur: 113.141552,
        lintang: -8.109038,
        popup: (<div>Lokasi Rumah PD</div>)
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

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0]
            });
        });
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                pengguna: this.props.pengguna.rows[0]
            },()=>{

                this.props.getPengaturanPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        ...this.state,
                        pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
                    });
                });
                
                this.props.getPengaturanSekolah(this.state.routeParams).then((result)=>{
                    this.setState({
                        ...this.state,
                        pengaturan_sekolah: this.props.pengaturan_sekolah.rows[0]
                    });

                    this.$f7.dialog.close();
                });
            
            });
        });
        
    }

    setValue = (tipe, kolom) => (e) => {
        this.setState({
            ...this.state,
            [tipe]: {
                ...this.state[tipe],
                [kolom]: e.target.value
            }
          }, ()=> {
            console.log(this.state[tipe]);
        });
    }

    simpan = () => {
        this.$f7.dialog.preloader();

        console.log(this.state.pengaturan_pengguna);
        console.log(this.state.pengaturan_sekolah);

        this.setState({
            ...this.state,
            pengaturan_pengguna: {
                ...this.state.pengaturan_pengguna,
                pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
                sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
            },
            pengaturan_sekolah: {
                ...this.state.pengaturan_sekolah,
                pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
                sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
            }
        },()=>{

            this.props.simpanPengaturanPengguna(this.state.pengaturan_pengguna).then((result)=>{
                // this.$f7.dialog.close();
                if(result.payload.sukses){
                    //sukses
                    this.props.simpanPengaturanSekolah(this.state.pengaturan_sekolah).then((result)=>{
                        if(result.payload.sukses){
                            //berhasil
                            if(parseInt(this.state.pengaturan_pengguna.tampilkan_beranda_sekolah) !== 1){
                                localStorage.setItem('sekolah_id_beranda', '');
                            }else{
                                localStorage.setItem('sekolah_id_beranda', this.$f7route.params['sekolah_id']);
                            }
                            
                            if(parseInt(this.state.pengaturan_pengguna.custom_logo_sekolah) !== 1){
                                localStorage.setItem('custom_logo_sekolah', '');
                                localStorage.setItem('custom_logo_sekolah_nama', '');
                            }else{
                                localStorage.setItem('custom_logo_sekolah', this.state.sekolah.gambar_logo);
                                localStorage.setItem('custom_logo_sekolah_nama', this.state.sekolah.nama);
                            }

                            this.$f7.dialog.close();
                            this.$f7.dialog.alert('Simpan pengaturan sekolah berhasil! Perubahan pengaturan akan terjadi setelah reload', 'Berhasil');

                            setTimeout(() => {
                                if(localStorage.getItem('device') === 'android'){
                                    window.location.reload(true);
                                }else{
                                    window.location.href="/";
                                }
                            }, 1000);
                        }else{
                            //gagal
                            this.$f7.dialog.close();
                            this.$f7.dialog.alert('Ada kendala pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                        }
                    });
    
                }else{
                    //gagal
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Ada kendala pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                }
            });

        });

    }

    changeToggle = (tipe, key) => (e) => {
        console.log(e);
        this.setState({
            [tipe]: {
                ...this.state[tipe],
                [key] : (e ? '0' : 1)
            }
        },()=>{
            console.log(this.state);
        });
    }

    handleLocationFound = (e) => {
        this.setState({
          hasLocation: true,
          latlng: e.latlng,
        })
    }

    klikPeta = (e) => {
        console.log(e);
        this.setState({
            lintang: e.latlng.lat,
            bujur: e.latlng.lng
            // popup: (<div>Lokasi</div>)
        });
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="pengaturanPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pengaturan Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <BlockTitle>Beranda Sekolah</BlockTitle>
                        <Card>
                            <CardContent>
                                <List>
                                    <ListItem title="Tampilkan sekolah aktif di beranda" footer="Beranda akan langsung menampilkan sekolah yang sedang aktif">
                                        <Toggle slot="after" checked={this.state.pengaturan_pengguna ? (parseInt(this.state.pengaturan_pengguna.tampilkan_beranda_sekolah) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_pengguna', 'tampilkan_beranda_sekolah')} />
                                    </ListItem>
                                    <ListItem title="Sembunyikan daftar sekolah yang lain" footer="Tombol tambah/ubah sekolah selain sekolah yang aktif akan disembunyikan">
                                        <Toggle slot="after" checked={this.state.pengaturan_pengguna ? (parseInt(this.state.pengaturan_pengguna.hide_menu_sekolah) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_pengguna', 'hide_menu_sekolah')} />
                                    </ListItem>
                                    <ListItem title="Set Logo Sekolah sebagai logo utama" footer="Logo Diskuis akan diganti dengan logo sekolah Anda">
                                        <Toggle slot="after" checked={this.state.pengaturan_pengguna ? (parseInt(this.state.pengaturan_pengguna.custom_logo_sekolah) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_pengguna', 'custom_logo_sekolah')} />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>

                        <BlockTitle>Kehadiran</BlockTitle>
                        <Card>
                            <CardContent>
                                <Card>
                                    <CardContent>
                                        <BlockHeader>Hari Masuk Sekolah</BlockHeader>
                                        <Row noGap>
                                            <Col width="50">
                                                <List>
                                                    <ListItem title="Senin">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_02) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_02')} />
                                                    </ListItem>
                                                    <ListItem title="Selasa">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_03) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_03')} />
                                                    </ListItem>
                                                    <ListItem title="Rabu">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_04) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_04')} />
                                                    </ListItem>
                                                    <ListItem title="Kamis">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_05) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_05')} />
                                                    </ListItem>                                                    
                                                </List>
                                            </Col>
                                            <Col width="50">
                                                <List>
                                                    <ListItem title="Jumat">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_06) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_06')} />
                                                    </ListItem>
                                                    <ListItem title="Sabtu">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_07) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_07')} />
                                                    </ListItem>
                                                    <ListItem title="Minggu">
                                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.masuk_01) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'masuk_01')} />
                                                    </ListItem>
                                                </List>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                                <br/>
                                <List>
                                    {/* <ListItem title="Sabtu masuk sekolah" footer="Rekap kehadiran akan memasukkan hari sabtu sebagai hari kerja">
                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.sabtu_masuk_sekolah) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'sabtu_masuk_sekolah')} />
                                    </ListItem> */}
                                    <ListInput
                                        label="Jam Masuk"
                                        type="time"
                                        placeholder="Contoh: 08:00"
                                        clearButton
                                        defaultValue={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.jam_masuk || '' : ''}
                                        onChange={this.setValue('pengaturan_sekolah','jam_masuk')}
                                        info="Batas jam masuk kerja/sekolah"
                                    >
                                        {/* <i slot="media" className="f7-icons">person_fill</i> */}
                                    </ListInput>
                                    <ListInput
                                        label="Jam Pulang"
                                        type="time"
                                        placeholder="Contoh: 17:00"
                                        clearButton
                                        defaultValue={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.jam_pulang || '' : ''}
                                        onChange={this.setValue('pengaturan_sekolah','jam_pulang')}
                                        info="Batas jam masuk kerja/sekolah"
                                    >
                                        {/* <i slot="media" className="f7-icons">person_fill</i> */}
                                    </ListInput>
                                    <ListItem title="Aktifkan Radius Absensi" footer="Absensi akan melihar jarak dari titik koordinat sekolah">
                                        <Toggle slot="after" checked={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_sekolah', 'radius_absen_aktif')} />
                                    </ListItem>
                                    <ListInput
                                        label="Lintang Sekolah"
                                        type="number"
                                        placeholder="Lintang Sekolah"
                                        clearButton
                                        value={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.lintang || '' : null}
                                        onChange={this.setValue('pengaturan_sekolah', 'lintang')}
                                    />
                                    <ListInput
                                        label="Bujur Sekolah"
                                        type="number"
                                        placeholder="Bujur Sekolah"
                                        clearButton
                                        value={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.bujur || '' : null}
                                        onChange={this.setValue('pengaturan_sekolah', 'bujur')}
                                    />
                                    {/* <ListItem>
                                        <Button raised fill onClick={()=>this.setState({actionGridOpened:true})}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>map</i>&nbsp;
                                            Buka Peta
                                        </Button>
                                    </ListItem> */}
                                    <ListInput
                                        label="Radius Maksimal Kehadiran Guru (Meter)"
                                        type="number"
                                        placeholder="Radius Maksimal Kehadiran Guru"
                                        clearButton
                                        disabled={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) === 1 ? false : true) : null}
                                        value={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.radius_absen_sekolah_guru || '' : ''}
                                        onChange={this.setValue('pengaturan_sekolah','radius_absen_sekolah_guru')}
                                    />
                                    <ListInput
                                        label="Radius Maksimal Kehadiran Siswa (Meter)"
                                        type="number"
                                        placeholder="Radius Maksimal Kehadiran Siswa"
                                        clearButton
                                        disabled={this.state.pengaturan_sekolah ? (parseInt(this.state.pengaturan_sekolah.radius_absen_aktif) === 1 ? false : true) : null}
                                        value={this.state.pengaturan_sekolah ? this.state.pengaturan_sekolah.radius_absen_sekolah_siswa || '' : ''}
                                        onChange={this.setValue('pengaturan_sekolah','radius_absen_sekolah_siswa')}
                                    />
                                </List>        
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Button raised fill className="bawahCiriBiru cardBorder-20" onClick={this.simpan}>
                                    <i className="icons f7-icons iconNormal" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
                </Row>
                <Actions convertToPopover={true} opened={this.state.actionGridOpened} onActionsClose={()=>this.setState({actionGridOpened:false})} style={{background:'white', minHeight:'90%', borderRadius:'20px 20px 0px 0px'}}>
                    <div style={{margin:'8px', marginTop:'20px'}}>
                        <i className="icons f7-icons">line_horizontal_3</i>
                        <Searchbar
                            className="searchbar-demo"
                            placeholder="Cari nama lokasi..."
                            // searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cari}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                        />
                        <Map 
                            style={{
                                // paddingBottom: "5%",
                                height: this.props.window_dimension.height,
                                width: "100%",
                                marginTop:'35px',
                                cursor: 'pointer'
                            }} 
                            center={position} 
                            zoom={this.state.zoom}
                            onLocationfound={this.handleLocationFound}
                            onClick={this.klikPeta}
                        >
                            <TileLayer
                                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                // url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"/>
                            />
                            {/* attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/> */}
                            <Marker position={position}>
                                <Popup keepInView={true}>
                                    {this.state.popup}
                                </Popup>
                            </Marker>
                        </Map>
                    </div>
                </Actions>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna,
      getSekolah: actions.getSekolah,
      simpanPengaturanPengguna: actions.simpanPengaturanPengguna,
      simpanPengaturanSekolah: actions.simpanPengaturanSekolah,
      getPengaturanPengguna: actions.getPengaturanPengguna,
      getPengaturanSekolah: actions.getPengaturanSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        sekolah: Sekolah.sekolah,
        pengaturan_pengguna: App.pengaturan_pengguna,
        pengaturan_sekolah: Sekolah.pengaturan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(pengaturanPengguna));
  