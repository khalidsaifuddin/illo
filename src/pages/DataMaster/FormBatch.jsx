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

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';

class FormBatch extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            produk_id: this.$f7route.params['produk_id'],
            batch_id: this.$f7route.params['batch_id'],
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            keterangan: ''
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

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent'
    ]

    componentDidMount = () => {

        if(this.$f7route.params['batch_id'] && this.$f7route.params['batch_id'] !== '-'){
            this.props.getBatch(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){
                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    },()=>{
                        
                    })
                }

            })
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        batch_id: result.payload
                    }
                },()=>{

                    
                })
            })
        }

    }

    setValue = (type) => (e) => {

        console.log(type)

        if(type === 'stok'){
            if(parseInt(e.target.value) < 0){
                this.$f7.dialog.alert('Stok tidak boleh kurang dari 0!', 'Peringatan', ()=>{

                    this.setState({
                        routeParams: {
                            ...this.state.routeParams,
                            [type]: 0
                        }        
                    },()=>{
                        return true
                    })

                })
            }
        }

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

        if(
            !this.state.routeParams.nama ||
            !this.state.routeParams.stok ||
            !this.state.routeParams.kode_batch
        ){
            this.$f7.dialog.alert('Isian tidak boleh kosong!', "Peringatan")
            return true
        }

        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanBatch({...this.state.routeParams, gambar_produk: this.state.gambar_produk_arr, harga_produk: this.state.harga_produk}).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/BatchProduk/"+this.$f7route.params['produk_id'])
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    editorChange = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keterangan: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    render()
    {
        return (
            <Page name="FormBatch" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['batch_id'] ? "Edit" : "Tambah"} Batch</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Kode Batch"
                                        type="text"
                                        placeholder="Kode Batch"
                                        clearButton
                                        value={this.state.routeParams.kode_batch}
                                        onChange={this.setValue('kode_batch')}
                                    />   
                                    <ListInput
                                        label="Nama Batch"
                                        type="text"
                                        placeholder="Nama Batch"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                    />   
                                    <ListItem className="teksQuill">
                                        <div>Keterangan Batch</div>
                                        <ReactQuill 
                                            theme="snow" 
                                            onChange={this.editorChange} 
                                            modules={this.modules}
                                            formats={this.formats}
                                            value={this.state.routeParams.keterangan}
                                            on
                                            style={{width:'100%'}}
                                        />
                                        <div style={{fontSize:'10px', color:(this.state.routeParams.keterangan ? (parseInt(this.state.routeParams.keterangan.replace(/(<([^>]+)>)/gi, "").length) > 2000 ? 'red' : '#434343') : '#434343')}}>
                                            {this.state.routeParams.keterangan ? this.state.routeParams.keterangan.replace(/(<([^>]+)>)/gi, "").length : '0'}/2000 karakter
                                        </div>
                                    </ListItem>
                                    <ListInput
                                        label="Jumlah Stok"
                                        type="number"
                                        placeholder="Jumlah Stok"
                                        clearButton
                                        value={this.state.routeParams.stok}
                                        onChange={this.setValue('stok')}
                                    />   
                                    <ListInput
                                        label="Tanggal Produksi"
                                        type="date"
                                        placeholder="Tanggal Produksi"
                                        value={this.state.routeParams.tanggal_produksi || ''}
                                        onChange={this.setValue('tanggal_produksi')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Tanggal Kadaluarsa"
                                        type="date"
                                        placeholder="Tanggal Kadaluarsa"
                                        value={this.state.routeParams.tanggal_kadaluarsa || ''}
                                        onChange={this.setValue('tanggal_kadaluarsa')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
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
      getBatch: Actions.getBatch,
      simpanBatch: Actions.simpanBatch,
      generateUUID: Actions.generateUUID,
      getHargaProduk: Actions.getHargaProduk,
      getGambarProduk: Actions.getGambarProduk,
      getKategoriProduk: Actions.getKategoriProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,
        kategori_produk: Produk.kategori_produk
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormBatch));
  