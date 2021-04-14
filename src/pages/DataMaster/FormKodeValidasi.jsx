import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class FormKodeValidasi extends Component {
    state = {
        error: null,
        routeParams: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            produk_id: (this.$f7route.params['produk_id'] && this.$f7route.params['produk_id'] !== '-') ? this.$f7route.params['produk_id'] : null,
            batch_kode_validasi_id: (this.$f7route.params['batch_kode_validasi_id'] && this.$f7route.params['batch_kode_validasi_id'] !== '-') ? this.$f7route.params['batch_kode_validasi_id'] : null
        },
        varian_produk: {},
        produk: {}
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
        if(this.$f7route.params['batch_kode_validasi_id'] && this.$f7route.params['batch_kode_validasi_id'] !== '-'){
            this.props.getBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    },()=>{
                        if(this.state.routeParams.produk_id){
                            this.props.getProduk({produk_id: this.$f7route.params['produk_id']}).then((result)=>{
                                this.setState({
                                    produk: result.payload.total > 0 ? result.payload.rows[0] : {}
                                })
                            })
                        }
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        batch_kode_validasi_id: result.payload
                    }
                },()=>{
                    if(this.state.routeParams.produk_id){
                        this.props.getProduk({produk_id: this.$f7route.params['produk_id']}).then((result)=>{
                            this.setState({
                                produk: result.payload.total > 0 ? result.payload.rows[0] : {}
                            },()=>{
                                if(this.state.produk.varian_produk && parseInt(this.state.produk.varian_produk.length) > 0){
                                    //update varian produk_id nya kalau masih kosong
                                    console.log(this.state.routeParams.varian_produk)

                                    if(!this.state.routeParams.varian_produk_id){
                                        this.setState({
                                            routeParams: {
                                                ...this.state.routeParams,
                                                varian_produk_id: this.state.produk.varian_produk[0].varian_produk_id
                                            }
                                        },()=>{
                                            console.log(this.state.routeParams)
                                        })
                                    }

                                }
                            })
                        })
                    }
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
        })
    }

    simpan = () => {

        if(!this.state.routeParams.nama || !this.state.routeParams.jumlah){
            this.$f7.dialog.alert('Mohon lengkapi semua isian sebelum melanjutkan!', 'Peringatan')
            return true
        }

        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.close()
                this.$f7.dialog.preloader('Generate Kode Validasi Produk ('+this.state.routeParams.jumlah+' kode)...')
                this.props.simpanKodeValidasiProduk(this.state.routeParams).then((result)=>{
                    if(result.payload.berhasil > 0){
                        //sukses generate
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Berhasil generate kode validasi produk!', 'Berhasil',()=>{
                            this.$f7router.navigate('/KodeValidasiProduk/'+this.state.routeParams.produk_id)
                        })
                    }else{
                        //gagal generate
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                    }
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    render()
    {
        return (
            <Page name="FormKodeValidasi" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.produk_id ? "Edit" : "Tambah"} Kode Validasi Produk</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        <Card>
                            <CardContent>
                                Nama Produk:<br/>
                                <b>{this.state.produk.nama} {this.state.produk.kode_produk ? (<>{this.state.produk.kode_produk}</>) : ''}</b>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    {this.state.produk.varian_produk && parseInt(this.state.produk.varian_produk.length) > 0 &&
                                    <ListInput
                                        label="Varian Produk"
                                        type="select"
                                        placeholder="Varian Produk"
                                        value={this.state.routeParams.varian_produk_id}
                                        onChange={this.setValue('varian_produk_id')}
                                    >
                                        {this.state.produk.varian_produk.map((option)=>{
                                            return (
                                                <option value={option.varian_produk_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>  
                                    }
                                    <ListInput
                                        label="Nama Batch Kode Validasi"
                                        type="text"
                                        placeholder="Nama Batch Kode Validasi"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                        info="Nama digunakan untuk membedakan antara batch kode validasi dalam satu produk untuk memudahkan pencarian"
                                    />
                                    <ListInput
                                        label="Jumlah Kode"
                                        type="number"
                                        placeholder="Jumlah Kode"
                                        clearButton
                                        value={this.state.routeParams.jumlah}
                                        onChange={this.setValue('jumlah')}
                                        info="Jumlah kode yang akan digenerate dalam satu batch"
                                    />
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
      simpanVarian: Actions.simpanVarian,
      getBatchKodeValidasiProduk: Actions.getBatchKodeValidasiProduk,
      simpanBatchKodeValidasiProduk: Actions.simpanBatchKodeValidasiProduk,
      simpanKodeValidasiProduk: Actions.simpanKodeValidasiProduk,
      getProduk: Actions.getProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormKodeValidasi));
  