import React, {Component} from 'react';
import {
    Page, 
    Navbar, 
    NavTitle, 
    NavTitleLarge,
    List,
    ListInput,
    ListItem,
    ListItemContent,
    Block,
    Button,
    CardHeader,
    Row,
    Col,
    Card,
    CardContent,
    CardFooter,
    Link,
    NavRight,
    Subnavbar,
    BlockTitle,
    Searchbar,
    Segmented,
    Tabs,
    Tab,
    Chip,
    Icon,
    Popover,
    Progressbar,
    Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class FormDiskonPelanggan extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            diskon_pelanggan_id: this.$f7route.params['diskon_pelanggan_id'],
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            jenis_hitung_diskon_id: 1,
            jenis_diskon_id: 1
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

        if(this.$f7route.params['diskon_pelanggan_id'] && this.$f7route.params['diskon_pelanggan_id'] !== '-'){
            this.props.getDiskonPelanggan(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...this.state.routeParams,
                            ...result.payload.rows[0],
                            waktu_mulai: result.payload.rows[0].waktu_mulai.replace(' ','T'),
                            waktu_selesai: result.payload.rows[0].waktu_selesai.replace(' ','T')
                        }
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        diskon_pelanggan_id: result.payload
                    }
                })
            })
        }
    }

    setValue = (type) => (e) => {

        console.log(type)

        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanDiskonPelanggan(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/DiskonPelanggan/")
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    changeToggle = (key) => (e) => {

        console.log(key)
        console.log(e)
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state.routeParams);
        });
    }
    
    generateKodeDiskon = () => {
        // alert('tes')
        this.props.generateKodeDiskon(this.state.routeParams).then((result)=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    kode_diskon: result.payload
                }
            })
        })
    }

    render()
    {
        return (
            <Page name="FormDiskonPelanggan" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.diskon_pelanggan_id ? "Edit" : "Tambah"} Diskon Pelanggan</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="Judul Diskon"
                                        type="text"
                                        placeholder="Judul Diskon"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    />
                                    <ListInput
                                        label="Deskripsi"
                                        type="text"
                                        placeholder="Deskripsi"
                                        clearButton
                                        value={this.state.routeParams.deskripsi}
                                        onChange={this.setValue('deskripsi')}
                                    />
                                    <ListInput
                                        label="Waktu Mulai"
                                        type="datetime-local"
                                        placeholder="Waktu Mulai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_mulai}
                                        onChange={this.setValue('waktu_mulai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                    <ListInput
                                        label="Waktu Selesai"
                                        type="datetime-local"
                                        placeholder="Waktu Selesai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_selesai}
                                        onChange={this.setValue('waktu_selesai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                    <ListItem>
                                        <span>Aktifkan Diskon Pelanggan</span>
                                        <Toggle defaultChecked={parseInt(this.state.routeParams.aktif) === 1 ? true : false} value={1} onToggleChange={this.changeToggle('aktif')} />
                                    </ListItem>
                                    <ListInput
                                        label="Kode Diskon"
                                        type="text"
                                        placeholder="Kode Diskon"
                                        clearButton
                                        value={this.state.routeParams.kode_diskon}
                                        onChange={this.setValue('kode_diskon')}
                                    />
                                    <ListItem>
                                        <div>
                                            <Button raised fill style={{display:'inline-flex'}} onClick={this.generateKodeDiskon}>
                                                <i className="f7-icons" style={{fontSize:'20px'}}>barcode_viewfinder</i>&nbsp;
                                                Generate Kode Diskon
                                            </Button>
                                            <div style={{fontSize:'10px', marginTop:'4px'}}>
                                                Anda dapat me-generate kode diskon untuk mendapatkan kode diskon secara random, atau Anda dapat menginput kode diskon Anda sendiri. Kode diskon bersifat <i>case-insensitive</i>
                                            </div>
                                        </div>
                                    </ListItem>
                                    <ListInput
                                        label="Jenis Diskon"
                                        type="select"
                                        defaultValue={this.state.routeParams.jenis_diskon_id}
                                        placeholder="Pilih Jenis Diskon..."
                                        onChange={this.setValue('jenis_diskon_id')}
                                    >
                                        <option value={1}>Diskon Umum</option>
                                        <option value={2}>Diskon Personal</option>
                                    </ListInput>
                                    <ListInput
                                        label="Jenis Perhitungan Diskon"
                                        type="select"
                                        defaultValue={this.state.routeParams.jenis_hitung_diskon_id}
                                        placeholder="Pilih Jenis Diskon..."
                                        onChange={this.setValue('jenis_hitung_diskon_id')}
                                    >
                                        <option value={1}>Persentase</option>
                                        <option value={2}>Nominal</option>
                                    </ListInput>
                                    {parseInt(this.state.routeParams.jenis_hitung_diskon_id) === 1 &&
                                    <ListInput
                                        label="Persentase Diskon (%)"
                                        type="number"
                                        placeholder="Persentase Diskon (%)"
                                        clearButton
                                        value={this.state.routeParams.persen_diskon}
                                        onChange={this.setValue('persen_diskon')}
                                    />
                                    }
                                    {parseInt(this.state.routeParams.jenis_hitung_diskon_id) === 2 &&
                                    <ListInput
                                        label="Nominal Diskon (Rp)"
                                        type="number"
                                        placeholder="Nominal Diskon (Rp)"
                                        clearButton
                                        value={this.state.routeParams.nominal_diskon}
                                        onChange={this.setValue('nominal_diskon')}
                                    />
                                    }
                                    
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
      getUnit: Actions.getUnit,
      getDiskonPelanggan: Actions.getDiskonPelanggan,
      simpanDiskonPelanggan: Actions.simpanDiskonPelanggan,
      generateUUID: Actions.generateUUID,
      generateKodeDiskon: Actions.generateKodeDiskon
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormDiskonPelanggan));
  