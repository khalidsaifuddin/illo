import React, {Component} from 'react';
import {
    Toggle, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class FormAlamatPengguna extends Component {
    state = {
        error: null,
        routeParams: {
            alamat_pengguna_id: (this.$f7route.params['alamat_pengguna_id'] && this.$f7route.params['alamat_pengguna_id'] !== '-') ? this.$f7route.params['alamat_pengguna_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        provinsi: [],
        kabupaten: [],
        kecamatan: []
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
        if(this.$f7route.params['alamat_pengguna_id'] && this.$f7route.params['alamat_pengguna_id'] !== '-'){
            this.props.getAlamatPengguna(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    },()=>{
                        this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                            this.setState({
                                provinsi: result.payload.rows
                            })
                        })
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        alamat_pengguna_id: result.payload
                    }
                },()=>{
                    this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                        this.setState({
                            provinsi: result.payload.rows
                        })
                    })
                })
            })
        }
    }

    setValue = (type) => (e) => {
        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }
        },()=>{
            console.log(this.state)

            if(type === 'kode_wilayah_provinsi'){
                this.props.getWilayah({id_level_wilayah:2, mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
                    this.setState({
                        kabupaten: result.payload.rows
                    })
                })
            }

            if(type === 'kode_wilayah_kabupaten'){
                this.props.getWilayah({id_level_wilayah:3, mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
                    this.setState({
                        kecamatan: result.payload.rows
                    })
                })
            }
        })
    }

    simpan = () => {

        if(
            !this.state.routeParams.kode_wilayah_kecamatan ||
            !this.state.routeParams.kode_wilayah_kabupaten ||
            !this.state.routeParams.kode_wilayah_provinsi
        ){
            this.$f7.dialog.alert('Mohon lengkapi alamat sebelum menyimpan!', 'Peringatan')
        }else{

            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanAlamatPengguna(this.state.routeParams).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                        this.$f7router.navigate("/AlamatPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id)
                    })
                }else{
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            })
        }

    }

    changeToggle = (tipe, key) => (e) => {
        // console.log(e);

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '0' : 1)
            }
        },()=>{
            console.log(this.state);
        });
    }

    render()
    {
        return (
            <Page name="FormAlamatPengguna" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.unit_id ? "Edit" : "Tambah"} Alamat Pengguna</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                <ListInput
                                        label="Nama Penerima"
                                        type="text"
                                        placeholder="Nama Penerima"
                                        clearButton
                                        value={this.state.routeParams.nama_penerima}
                                        onChange={this.setValue('nama_penerima')}
                                    />
                                    <ListInput
                                        label="Alamat Lengkap"
                                        type="textarea"
                                        placeholder="Alamat Lengkap"
                                        clearButton
                                        value={this.state.routeParams.alamat_jalan}
                                        onChange={this.setValue('alamat_jalan')}
                                    />
                                    <ListInput
                                        label="Kode Pos"
                                        type="text"
                                        placeholder="Kode Pos"
                                        clearButton
                                        value={this.state.routeParams.kode_pos}
                                        onChange={this.setValue('kode_pos')}
                                    />
                                    <ListInput
                                        label="Desa/Kelurahan"
                                        type="text"
                                        placeholder="Desa/Kelurahan"
                                        clearButton
                                        value={this.state.routeParams.desa_kelurahan}
                                        onChange={this.setValue('desa_kelurahan')}
                                    />
                                    <ListInput
                                        label="Provinsi"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_provinsi}
                                        placeholder="Pilih provinsi..."
                                        onChange={this.setValue('kode_wilayah_provinsi')}
                                    >
                                        <option value={null} selected={this.state.routeParams.kode_wilayah_provinsi ? false : true}>-</option>
                                        {this.state.provinsi.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kabupaten/Kota"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kabupaten}
                                        placeholder="Pilih kabupaten/kota..."
                                        onChange={this.setValue('kode_wilayah_kabupaten')}
                                    >
                                        <option value={null} selected={this.state.routeParams.kode_wilayah_kabupaten ? false : true}>-</option>
                                        {this.state.kabupaten.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kecamatan"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kecamatan}
                                        placeholder="Pilih kecamatan..."
                                        onChange={this.setValue('kode_wilayah_kecamatan')}
                                    >
                                        <option value={null} selected={this.state.routeParams.kode_wilayah_kecamatan ? false : true}>-</option>
                                        {this.state.kecamatan.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Titik Koordinat Lintang"
                                        type="text"
                                        placeholder="Lintang"
                                        clearButton
                                        value={this.state.routeParams.lintang}
                                        onChange={this.setValue('lintang')}
                                    />
                                    <ListInput
                                        label="Titik Koordinat Bujur"
                                        type="text"
                                        placeholder="Bujur"
                                        clearButton
                                        value={this.state.routeParams.bujur}
                                        onChange={this.setValue('bujur')}
                                    />
                                    <ListItem title="Jadikan alamat utama pengiriman" footer="Alamat yang langsung dipilih ketika membeli barang">
                                        <Toggle slot="after" checked={this.state.routeParams.alamat_utama ? (parseInt(this.state.routeParams.alamat_utama) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('pengaturan_alamat', 'alamat_utama')} />
                                    </ListItem>
                                </List>
                                <div style={{borderTop:'1px solid #ccc', marginTop:'16px', marginBottom:'8px'}}>&nbsp;</div>
                                <Button onClick={this.simpan} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    
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
      generateUUID: Actions.generateUUID,
      simpanAlamatPengguna: Actions.simpanAlamatPengguna,
      getUnit: Actions.getUnit,
      getAlamatPengguna: Actions.getAlamatPengguna,
      getWilayah: Actions.getWilayah
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormAlamatPengguna));
  