import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, BlockTitle, Card, Searchbar, Subnavbar, CardHeader, CardContent, Row, Col, Link, CardFooter, Checkbox, BlockHeader, Segmented, Tabs, Tab
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Dropzone from 'react-dropzone';
import moment from 'moment';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Ruang from './ruang';

class tambahAnggotaRuangManual extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            ruang_id: this.$f7route.params['ruang_id'],
            sekolah_id: this.$f7route.params['sekolah_id'],
            keyword: null,
            jabatan_ruang_id: 1,
            start: 0,
            limit: 10
        },
        ruang: {
            rows: [],
            total: 0
        },
        pengguna: {
            rows: [],
            total: 0
        },
        checkPengguna: {},
        pengguna: {}
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        // console.log(Ruang)

        this.props.getRuang(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                ruang: this.props.ruang
            },()=>{
                
            })
        })
    }

    setValuePengguna = (jenis) => (e) => {
        this.setState({
            pengguna: {
                ...this.state.pengguna,
                [jenis]: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.pengguna)
        })
    }

    simpanPenggunaManual = (key) => {

        this.$f7.dialog.preloader('Menyimpan pengguna...')

        if(
            this.state.pengguna.username && 
            this.state.pengguna.nama && 
            this.state.pengguna.jenis_kelamin
        ){
            this.props.simpanPenggunaManual({...this.state.pengguna, pengguna_id_pembuat: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
                if(!result.payload.sukses){
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert(result.payload.pesan,'Peringatan')
                }else{
                    //berhasil, lanjut simpan sekolah_pengguna dan pengguna_ruang
                    let objPenggunaBaru = result.payload.rows[0];

                    this.$f7.dialog.close()
                    this.$f7.dialog.preloader('Mencatat pengguna dalam sekolah...')

                    this.props.simpanSekolahPengguna({
                        sekolah_id: this.$f7route.params['sekolah_id'],
                        pengguna_id: objPenggunaBaru.pengguna_id,
                        jabatan_sekolah_id: 2,
                        valid: 1,
                        soft_delete: 0
                    }).then((result)=>{

                        this.$f7.dialog.close()
                        this.$f7.dialog.preloader('Mencatat pengguna dalam ruang...')


                        this.props.simpanPenggunaRuang({
                            ruang_id: this.$f7route.params['ruang_id'],
                            pengguna_id: objPenggunaBaru.pengguna_id,
                            jabatan_ruang_id: 3,
                            soft_delete: 0
                        }).then((result)=>{

                            this.$f7.dialog.close()

                            if(result.payload.sukses){
                                // this.$f7.dialog.confirm('Berhasil menyimpan anggota ruang baru','Berhasil')
                                this.$f7.dialog.create({
                                    title: 'Berhasil',
                                    text: 'Berhasil menyimpan anggota ruang baru',
                                    buttons: [
                                      {
                                        text: 'Tambah lagi',
                                        onClick: () => {
                                            this.$f7.dialog.close()
                                            this.setState({
                                                pengguna: {}
                                            })
                                        }
                                      },
                                      {
                                        text: 'Tutup',
                                        onClick: () => {
                                            this.$f7router.navigate('/daftarRuang/'+this.$f7route.params['sekolah_id'])
                                        }
                                      }
                                    ],
                                    verticalButtons: true,
                                  }).open()

                            }else{
                                this.$f7.dialog.alert('Gagal menyimpan anggota ruang baru','Gagal')
                            }

                        })

                    })
                }
            })
        }else{
            this.$f7.dialog.alert('Mohon lengkapi semua isian sebelum menyimpan!', 'Peringatan')
        }

    }
    
    render()
    {
        return (
            <Page name="tambahAnggotaRuangManual" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>
                        {this.state.ruang.rows.map((option)=>{
                            return (
                                <b>Tambah Anggota Ruang {option.nama}</b>
                            )
                        })}
                    </NavTitle>
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">
                        <Block strong style={{marginTop:'0px'}}>
                            {/* <Segmented raised>
                                <Button className="color-theme-deeporange" style={{fontWeight:'bold'}} tabLink="#tab-1" tabLinkActive>Isi manual</Button>
                                <Button className="color-theme-deeporange" style={{fontWeight:'bold'}} tabLink="#tab-2" >Import File Template</Button>
                            </Segmented> */}
                            <Tabs animated>
                                <Tab id="tab-1" tabActive>
                                    {/* <BlockTitle>Isi manual</BlockTitle> */}
                                    <Card>
                                    <CardContent style={{padding:'8px'}}>
                                        <Row>
                                            <Col width="15" tabletWidth="15" style={{textAlign:'center'}}>
                                            <i className="icons f7-icons" style={{fontSize:'50px'}}>info_circle</i>
                                            </Col>
                                            <Col width="85" tabletWidth="85" style={{fontSize:'10px', fontStyle:'italic'}}>
                                            Anggota ruang yang akan ditambahkan akan dibuatkan password secara otomatis dan dapat login ke dalam aplikasi secara mandiri. 
                                            <br/>
                                            Pastikan username yang digunakan <b>belum pernah digunakan</b> oleh pengguna lain sebelumnya
                                            </Col>
                                        </Row>
                                    </CardContent>
                                    </Card>
                                    <List>
                                        <ListInput
                                            label="Username"
                                            type="text"
                                            placeholder="Username"
                                            clearButton
                                            value={this.state.pengguna.username || ''}
                                            onChange={this.setValuePengguna('username')}
                                        />
                                        <ListInput
                                            label="Nama"
                                            type="text"
                                            placeholder="Nama"
                                            clearButton
                                            value={this.state.pengguna.nama || ''}
                                            onChange={this.setValuePengguna('nama')}
                                        />
                                        {/* <ListItem
                                            title={"Jenis Kelamin"}
                                            smartSelect
                                            smartSelectParams={{openIn: 'popup'}}
                                        >
                                            <select name="jenis_kelamin" defaultValue={0} onChange={this.setValuePengguna('jenis_kelamin')}>
                                                <option disabled value={0}>-</option>
                                                <option key={1} value={'L'}>Laki-laki</option>
                                                <option key={2} value={'P'}>Perempuan</option>
                                            </select>
                                        </ListItem> */}
                                        <ListInput
                                            label="Jenis Kelamin"
                                            type="select"
                                            value={this.state.pengguna.jenis_kelamin || 0}
                                            placeholder="Pilih Jenis Kelamin..."
                                            onChange={this.setValuePengguna('jenis_kelamin')}
                                        >
                                            <option disabled value={0}>-</option>
                                            <option value={'L'}>Laki-laki</option>
                                            <option value={'P'}>Perempuan</option>
                                        </ListInput>
                                        <ListInput
                                            label="Tempat Lahir"
                                            type="text"
                                            placeholder="Tempat Lahir"
                                            clearButton
                                            value={this.state.pengguna.tempat_lahir || ''}
                                            onChange={this.setValuePengguna('tempat_lahir')}
                                        />
                                        <ListInput
                                            label="Tanggal Lahir"
                                            type="date"
                                            placeholder="Tanggal Lahir"
                                            value={this.state.pengguna.tanggal_lahir || ''}
                                            onChange={this.setValuePengguna('tanggal_lahir')}
                                            style={{maxWidth:'100%'}}
                                            className="tanggalan"
                                        />
                                    </List>
                                    <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginBottom:'8px'}} onClick={()=>this.simpanPenggunaManual('key')}>
                                        <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                        Simpan
                                    </Button>
                                </Tab>
                                <Tab id="tab-2">
                                    <BlockTitle>Import file template</BlockTitle>
                                </Tab>
                            </Tabs>
                        </Block>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getRuang: Actions.getRuang,
      getPengguna: Actions.getPengguna,
      simpanPenggunaRuangBulk: Actions.simpanPenggunaRuangBulk,
      simpanPenggunaManual: Actions.simpanPenggunaManual,
      simpanSekolahPengguna: Actions.simpanSekolahPengguna,
      simpanPenggunaRuang: Actions.simpanPenggunaRuang
    }, dispatch);
}

function mapStateToProps({ App, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahAnggotaRuangManual));
  