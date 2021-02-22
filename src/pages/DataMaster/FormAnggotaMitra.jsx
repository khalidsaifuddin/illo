import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import { map } from 'leaflet';

class FormAnggotaMitra extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            jenis_mitra_id: this.$f7route.params['jenis_mitra_id'] ? this.$f7route.params['jenis_mitra_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            induk_mitra_id: this.$f7route.params['induk_mitra_id'] ? this.$f7route.params['induk_mitra_id'] : null
        },
        jenis_mitra: {},
        pengguna: {},
        provinsi: {
            rows: [],
            total: 0
        },
        kabupaten: {
            rows: [],
            total: 0
        },
        kecamatan: {
            rows: [],
            total: 0
        },
        induk_mitra: {},
        anggota_mitra: {
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

    bulan_singkat = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Ags',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    componentDidMount = () => {

        //what to do after mount


        this.props.getPengguna(this.state.routeParams).then((result)=>{
            if(result.payload.total > 0){
                this.setState({
                    pengguna: result.payload.rows[0],
                    routeParams: {
                        ...this.state.routeParams,
                        ...result.payload.rows[0],
                        jenis_mitra_id: this.$f7route.params['jenis_mitra_id']
                    }
                },()=>{
                    this.props.getJenisMitra(this.state.routeParams).then((result)=>{
                        this.setState({
                            jenis_mitra: result.payload.rows[0]
                        },()=>{
                            //adkfjakldfaldf
                            this.props.getWilayah({id_level_wilayah: 1}).then((result)=>{
                                this.setState({
                                    provinsi: result.payload
                                },()=>{
                                    if(this.state.routeParams.induk_mitra_id){
                                        this.props.getAnggotaMitra({pengguna_id: this.state.routeParams.induk_mitra_id}).then((result)=>{
                                            this.setState({
                                                induk_mitra: result.payload.total > 0 ?  result.payload.rows[0] : {}
                                            })
                                        })
                                    }else{
                                        this.props.getAnggotaMitra({jenis_mitra_id: (parseInt(this.$f7route.params['jenis_mitra_id'])+1)}).then((result)=>{
                                            this.setState({
                                                anggota_mitra: result.payload
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })

    }

    cariPengguna = () => {
        
        this.setState({
            loading: true,
            display: true,
            routeParams: {
                ...this.state.routeParams
            },
            pengguna: {
                rows: [{
                    nama: '*********'
                },{
                    nama: '*********'
                },{
                    nama: '*********'
                }],
                total: 0
            }
        },()=>{
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    loading: false,
                    pengguna: result.payload
                })
            });
        });
    }

    setValue = (type) => (e) => {

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)

            if(type === 'kode_wilayah_provinsi'){
                this.props.getWilayah({id_level_wilayah:2, mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
                    this.setState({
                        kabupaten: result.payload
                    })
                })
            }

            if(type === 'kode_wilayah_kabupaten'){
                this.props.getWilayah({id_level_wilayah:3, mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
                    this.setState({
                        kecamatan: result.payload
                    })
                })
            }

            if(type === 'induk_mitra_id'){
                this.props.getAnggotaMitra({pengguna_id: this.state.routeParams.induk_mitra_id}).then((result)=>{
                    this.setState({
                        induk_mitra: result.payload.total > 0 ?  result.payload.rows[0] : {}
                    })
                })
            }
        })
    }

    simpan = () => {
        // console.log(this.state.routeParams)
        if(
            this.state.routeParams.kode_wilayah_provinsi &&
            this.state.routeParams.kode_wilayah_kabupaten &&
            this.state.routeParams.kode_wilayah_kecamatan &&
            this.state.routeParams.lintang &&
            this.state.routeParams.bujur &&
            this.state.routeParams.alamat &&
            this.state.routeParams.no_hp &&
            this.state.routeParams.no_telepon
        ){

            if(this.state.routeParams.jenis_mitra_id === 5){
                //distributor
                if(!this.state.routeParams.induk_mitra_id){
                    this.$f7.dialog.alert('Mohon lengkapi induk distributor/agen sebelum melanjutkan!', 'Peringatan')
                }else{
                    this.$f7.dialog.preloader()
        
                    this.props.simpanMitra(this.state.routeParams).then((result)=>{
                        if(result.payload.sukses_pengguna && result.payload.sukses_mitra){
                            this.$f7.dialog.close()
                            this.$f7router.navigate("/AnggotaMitra/"+this.$f7route.params['jenis_mitra_id'])
                        }else{
                            this.$f7.dialog.close()
                            this.$f7.dialog.alert('Ada kesalahan. Kami coba perbaiki dulu ya!', 'Peringatan');
                        }
                    })
                }

            }else{
                //bukan distributor
                this.$f7.dialog.preloader()
        
                this.props.simpanMitra(this.state.routeParams).then((result)=>{
                    if(result.payload.sukses_pengguna && result.payload.sukses_mitra){
                        this.$f7.dialog.close()
                        this.$f7router.navigate("/AnggotaMitra/"+this.$f7route.params['jenis_mitra_id'])
                    }else{
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Ada kesalahan. Kami coba perbaiki dulu ya!', 'Peringatan');
                    }
                })
            }

        }else{
            this.$f7.dialog.alert('Mohon lengkapi semua isian sebelum melanjutkan!', 'Peringatan')
        }

    }
    
    render()
    {
        return (
            <Page name="FormAnggotaMitra" hideBarsOnScroll style={{marginBottom:'50px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Form Kelengkapan Anggota Mitra</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent style={{fontSize:'20px'}}>
                                <Row noGap>
                                    <Col width="50">
                                        <div style={{fontSize:'10px'}}>Jenis Mitra</div>
                                        <span style={{fontWeight:'bold'}}>{this.state.jenis_mitra.nama}</span>
                                    </Col>
                                    {this.state.routeParams.induk_mitra_id &&
                                    <Col width="50" style={{textAlign:'right'}}>
                                        <div style={{fontSize:'10px'}}>Induk</div>
                                        <span style={{fontWeight:'bold', fontSize:'15px'}}>{this.state.induk_mitra.nama} (Wilayah {parseInt(this.state.induk_mitra.jenis_mitra_id) === 5 ? this.state.induk_mitra.provinsi : this.state.induk_mitra.kabupaten})</span>
                                    </Col>
                                    }
                                    {!this.state.routeParams.induk_mitra_id && parseInt(this.state.routeParams.jenis_mitra_id) !== 5 &&
                                    <Col width="50" style={{textAlign:'right'}}>
                                        <List>
                                            <ListInput
                                                label={this.state.routeParams.jenis_mitra_id === 4 ? "Induk Distributor" : "Induk Agen"}
                                                type="select"
                                                value={this.state.routeParams.induk_mitra_id}
                                                placeholder={this.state.routeParams.jenis_mitra_id === 4 ? "Pilih Induk Distributor" : "Pilih Induk Agen"}
                                                onChange={this.setValue('induk_mitra_id')}
                                            >
                                                <option value={null} disabled selected={(this.state.routeParams.induk_mitra_id ? false : true)}>-</option>
                                                {this.state.anggota_mitra.rows.map((option)=>{
                                                    return (
                                                        <option value={option.pengguna_id}>{option.nama} (Wilayah {parseInt(option.jenis_mitra_id) === 5 ? option.provinsi : option.kabupaten})</option>
                                                    )
                                                })}
                                            </ListInput>
                                        </List>
                                    </Col>
                                    }
                                </Row>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <List style={{marginBottom:'16px'}}>
                                    <ListInput
                                        label="Nama"
                                        type="text"
                                        placeholder="Nama"
                                        clearButton
                                        value={this.state.pengguna.nama}
                                    />
                                    <ListInput
                                        label="Username"
                                        type="text"
                                        placeholder="Username"
                                        clearButton
                                        value={this.state.pengguna.username}
                                    />
                                    <ListInput
                                        label="Provinsi"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_provinsi}
                                        placeholder="Pilih Provinsi..."
                                        onChange={this.setValue('kode_wilayah_provinsi')}
                                    >
                                        <option value={null} disabled selected={(this.state.routeParams.kode_wilayah_provinsi ? false : true)}>-</option>
                                        {this.state.provinsi.rows.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kabupaten/Kota"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kabupaten}
                                        placeholder="Pilih Kabupaten/Kota..."
                                        onChange={this.setValue('kode_wilayah_kabupaten')}
                                    >
                                        <option value={null} disabled selected={(this.state.routeParams.kode_wilayah_kabupaten ? false : true)}>-</option>
                                        {this.state.kabupaten.rows.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kecamatan"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kecamatan}
                                        placeholder="Pilih Kecamatan..."
                                        onChange={this.setValue('kode_wilayah_kecamatan')}
                                    >
                                        <option value={null} disabled selected={(this.state.routeParams.kode_wilayah_kecamatan ? false : true)}>-</option>
                                        {this.state.kecamatan.rows.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Alamat Detail"
                                        type="text"
                                        placeholder="Alamat Detail"
                                        clearButton
                                        value={this.state.routeParams.alamat}
                                        onChange={this.setValue('alamat')}
                                    />
                                    <ListInput
                                        label="No Telepon"
                                        type="text"
                                        placeholder="No Telepon"
                                        clearButton
                                        value={this.state.routeParams.no_telepon}
                                        onChange={this.setValue('no_telepon')}
                                    />
                                    <ListInput
                                        label="No HP"
                                        type="text"
                                        placeholder="No HP"
                                        clearButton
                                        value={this.state.routeParams.no_hp}
                                        onChange={this.setValue('no_hp')}
                                    />
                                    <ListInput
                                        label="Tanggal Bergabung"
                                        type="date"
                                        placeholder="Tanggal Bergabung"
                                        value={this.state.routeParams.tanggal_mulai || ''}
                                        onChange={this.setValue('tanggal_mulai')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Koordinat Lintang"
                                        type="text"
                                        placeholder="Koordinat Lintang"
                                        clearButton
                                        value={this.state.routeParams.lintang}
                                        onChange={this.setValue('lintang')}
                                    />
                                    <ListInput
                                        label="Koordinat Bujur"
                                        type="text"
                                        placeholder="Koordinat Bujur"
                                        clearButton
                                        value={this.state.routeParams.bujur}
                                        onChange={this.setValue('bujur')}
                                    />
                                    {/* <ListItem>
                                        <Button raised fill className="bawahCiriBiru">
                                            <i className="f7-icons" style={{fontSize:'20px'}}>map_fill</i>&nbsp;
                                            Buka Peta
                                        </Button>
                                    </ListItem> */}
                                </List>
                                {/* <br/> */}
                                <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpan}>
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
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
      getPengguna: actions.getPengguna,
      getJenisMitra: actions.getJenisMitra,
      getWilayah: actions.getWilayah,
      simpanMitra: actions.simpanMitra,
      getAnggotaMitra: actions.getAnggotaMitra
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormAnggotaMitra));
  