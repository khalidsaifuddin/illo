import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions'; 

import moment from 'moment';

// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AktivitasSosial from '../AktivitasSosial';

class profilSekolah extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            start: 0,
            limit: 20,
            konten: ''
        },
        sekolah: {
            gambar_log: '/1.jpg',
            gambar_latar: '/1.jpg'
        },
        siswa_sekolah: {
            total: 0,
            rows: []
        },
        ta_aktif: 2020,
        tahun_ajaran: {
            rows: [],
            total: 0
        },
        popupFilter: false,
        ruang_sekolah: {
            rows: [],
            total: 0
        },
        menuRuang: false,
        sekolah_pengguna_record: {},
        sekolah_pengguna: {
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

    // modules = {
    //     toolbar: [
    //       [{ 'header': [1, 2, false] }],
    //       ['bold', 'italic', 'underline','strike', 'blockquote'],
    //     //   [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    //       ['link', 'image'],
    //     //   ['clean']
    //     ],
    // }
    
    // formats = [
    //     'header',
    //     'bold', 'italic', 'underline', 'strike', 'blockquote',
    //     'list', 'bullet', 'indent',
    //     'link', 'image'
    // ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        //what to do after mount
        this.props.getSekolahIndividu2({...this.state.routeParams, sekolah_id: this.$f7route.params['sekolah_id']}).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0],
                routeParams: {
                    ...this.state.routeParams,
                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{

                this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        loading: false,
                        sekolah_pengguna: this.props.sekolah_pengguna,
                        sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0]
                    });
                });
                
            });
        });

    }

    // editorChange = (e) => {
    //     // console.log(e);
    //     this.setState({
    //         routeParams: {
    //             ...this.state.routeParams,
    //             konten: e
    //         }
    //     },()=>{
    //         // console.log(this.state.routeParams);
    //     });
    // }

    setSekolahInduk =  () => {
        // this.$f7.dialog.alert('set!');
        this.$f7.dialog.preloader();
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                sekolah_utama: 1
            }
        },()=>{
            console.log(this.state.routeParams)
            this.props.simpanSekolahUtama(this.state.routeParams).then((result)=>{
                this.$f7.dialog.close()

                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Set sekolah induk berhasil!', 'Berhasil')

                    this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            loading: false,
                            sekolah_pengguna: this.props.sekolah_pengguna,
                            sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0]
                        })
                    })

                }else{
                    //gagal
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!', 'Peringatan')
                }
            })
        })
    }

    render()
    {
        return (
            <Page name="profilSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.sekolah.nama}</NavTitle>
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">   
                    
                        <div 
                            className="merahAtas"
                            style={{minHeight:'200px', background:'#cccccc', backgroundSize:'cover', backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_latar+')'}}
                        >
                        </div>
                        <Card>
                            <CardContent style={{padding:'8px', marginTop:'-50px', borderRadius:'20px', color:'#434343'}}>
                                <div style={{
                                    height:'100px', 
                                    width:'100px',
                                    background:'white',
                                    backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                    backgroundSize:'cover',
                                    position:'absolute',
                                    marginTop:'-45px',
                                    borderRadius:'20px',
                                    border:'1px solid #CCC'
                                }}>
                                    &nbsp;
                                </div>
                                <h1 className="namaSekolah">{this.state.sekolah.nama}</h1>
                                <h3 className="keteranganSekolah">{this.state.sekolah.keterangan}</h3>
                                <h3 className="alamatSekolah" style={{fontSize:'10px', color:'#aaaaaa', marginTop:'0px'}}>{this.state.sekolah.alamat}</h3>
                            </CardContent>
                        </Card>
                        <Row noGap>
                            <Col width="100" tabletWidth="70">
                                <AktivitasSosial tipe="sekolah" sekolah_id={this.$f7route.params['sekolah_id']} style={{marginBottom:'50px'}} />
                                {/* <Card>
                                    <CardContent style={{padding:'8px', paddingTop:'16px', paddingBottom:'16px'}}>
                                        <BlockTitle style={{marginTop:'0px', marginLeft:'0px'}}>Bagikan sesuatu</BlockTitle>
                                        <ReactQuill 
                                            theme="snow" 
                                            onChange={this.editorChange} 
                                            modules={this.modules}
                                            formats={this.formats}
                                            value={this.state.routeParams.konten}
                                            on
                                        />
                                        <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginTop:'4px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>paperplane_fill</i>&nbsp;
                                            Bagikan
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent style={{padding:'8px', paddingTop:'16px', paddingBottom:'16px'}}>
                                        isinya
                                    </CardContent>
                                </Card> */}
                            </Col>
                            <Col width="100" tabletWidth="30">
                                <Card>
                                    <CardContent>
                                        {parseInt(this.state.sekolah_pengguna_record.jabatan_sekolah_id) === 1 &&
                                        <List>
                                            <ListItem disabled={(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? true : false)} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)}  onClick={this.setSekolahInduk} style={{cursor:'pointer'}}>
                                                {parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? <i className="icons f7-icons" slot="media">heart_fill</i> : <i className="icons f7-icons" slot="media">heart</i>}
                                                {(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? 'Sekolah Induk' : 'Set Sebagai Sekolah Induk')}
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">person_crop_rectangle</i>
                                                Profil Guru
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">checkmark_rectangle</i>
                                                Absensi Kehadiran Guru
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">calendar  </i>
                                                Rekap Kehadiran Harian
                                            </ListItem>
                                            {parseInt(this.state.sekolah_pengguna_record.administrator) === 1 &&
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/BerandaSekolah/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">building_2_fill</i>
                                                Dasbor Sekolah
                                            </ListItem>
                                            }
                                            {/* <ListItem button link="/menuSekolahGuru/">
                                                <i className="icons f7-icons">list</i>&nbsp;
                                                <span style={{width:'100%', textAlign:'left'}}>Aktivitas</span>
                                            </ListItem>
                                            <ListItem button link="/menuSekolahGuru/">
                                                <i className="icons f7-icons">list</i>&nbsp;
                                                <span style={{width:'100%', textAlign:'left'}}>Menu Guru</span>
                                            </ListItem>
                                            <ListItem button link="/menuSekolahGuru/">
                                                <i className="icons f7-icons">list</i>&nbsp;
                                                <span style={{width:'100%', textAlign:'left'}}>Menu Siswa</span>
                                            </ListItem> */}
                                        </List>
                                        }
                                        {parseInt(this.state.sekolah_pengguna_record.jabatan_sekolah_id) === 2 &&
                                        <List>
                                            <ListItem disabled={(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? true : false)} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)}  onClick={this.setSekolahInduk} style={{cursor:'pointer'}}>
                                                {parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? <i className="icons f7-icons" slot="media">heart_fill</i> : <i className="icons f7-icons" slot="media">heart</i>}
                                                {(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? 'Sekolah Utama' : 'Set Sebagai Sekolah Utama')}
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/profilSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">person_crop_rectangle</i>
                                                Profil Siswa
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">checkmark_rectangle  </i>
                                                Absensi Kehadiran Siswa
                                            </ListItem>
                                            <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranHarianSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                                                <i className="icons f7-icons" slot="media">calendar  </i>
                                                Rekap Kehadiran Harian
                                            </ListItem>
                                        </List>
                                        }
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolahIndividu2: actions.getSekolahIndividu2,
      getSekolahPengguna: actions.getSekolahPengguna,
      simpanSekolahUtama: actions.simpanSekolahUtama
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(profilSekolah));
  