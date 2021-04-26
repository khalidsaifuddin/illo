import React, {Component} from 'react';
import {
    Page, Popup, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';
import QRCode from 'qrcode.react'

import localForage from 'localforage';
import CardTransaksi from './CardTransaksi';
import CardProdukTransaksi from './CardProdukTransaksi';

class ProsesTransaksi extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            transaksi_id: this.$f7route.params['transaksi_id'] ? this.$f7route.params['transaksi_id'] : null
        },
        transaksi: {
            rows: [],
            total: 0
        },
        transaksi_record: {},
        input_kode: false,
        produk_aktif: {
            harga_final: 0
        },
        tracking: {
            rows: [],
            total: 0
        },
        komplit: false
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
            this.setState({
                transaksi: result.payload,
                transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {}
            },()=>{

                if(this.state.transaksi_record.produk_transaksi && this.state.transaksi_record.produk_transaksi.length > 0){
                    // console.log(this.state.transaksi_record.produk_transaksi)
                    let tracking_komplit = 0

                    for (let index = 0; index < this.state.transaksi_record.produk_transaksi.length; index++) {
                        const element = this.state.transaksi_record.produk_transaksi[index];

                        // console.log(element)

                        if(parseInt(element.total_tracking) >= parseInt(element.jumlah)){
                            //sesuai
                            tracking_komplit++
                        }else{
                            //kurang
                        }
                        
                    }

                    if(parseInt(tracking_komplit) === parseInt(this.state.transaksi_record.produk_transaksi.length)){
                        //sudah semua
                        this.setState({komplit:true})
                    }else{
                        //ada yang belum
                        this.setState({komplit:false})
                    }
                }

            })
        })

    }

    inputKode = (option) => {
        console.log(option.produk_id)
        console.log(option.varian_produk_id)
        console.log(this.state.transaksi_record.transaksi_id)

        this.setState({
            input_kode: true,
            produk_aktif: option
        },()=>{
            // this.inputCari.focus()
            console.log(this.refs.ketikCari)

            this.props.getTracking(option).then((result)=>{
                this.setState({
                    tracking: result.payload
                })
            })

        })
    }

    ketikCari = (e) => {
        console.log(e.currentTarget.value)

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                kode_produk: e.currentTarget.value
            }
        })
    }

    ketikEnter = (e) => {
        // console.log(e.key)
        if(e.key === 'Enter'){
            //what to do

            if(this.state.routeParams.kode_produk.length < 1){
                this.$f7.dialog.alert('Mohon ketik kode tracking terlebih dahulu!', 'Peringatan')
                return true
            }

            this.$f7.dialog.preloader()

            this.props.cariKodeProduk({
                ...this.state.routeParams,
                produk_id: this.state.produk_aktif.produk_id,
                varian_produk_id: this.state.produk_aktif.varian_produk_id,
                transaksi_id: this.state.transaksi_record.transaksi_id
            }).then((result)=>{

                // this.$f7.dialog.close()
                console.log(result.payload)

                if(result.payload.length > 0){
                    //ketemu

                    console.log(this.state.produk_aktif.produk_id)
                    console.log(result.payload[0].produk_id)
                    
                    if(this.state.produk_aktif.produk_id === result.payload[0].produk_id){
                        //sama produknya
                        this.props.simpanTracking({
                            ...result.payload[0],
                            ...this.state.produk_aktif,
                            ...this.state.routeParams
                        }).then((result)=>{
    
                            if(result.payload.sukses){
                                //berhasil
                                this.$f7.dialog.close()
    
                                //final process
                                this.props.getTracking({
                                    ...this.state.routeParams,
                                    produk_transaksi_id: this.state.produk_aktif.produk_transaksi_id,
                                    produk_id: this.state.produk_aktif.produk_id,
                                    varian_produk_id: this.state.produk_aktif.varian_produk_id,
                                    transaksi_id: this.state.transaksi_record.transaksi_id
                                }).then((result)=>{
                                    this.setState({
                                        tracking: result.payload,
                                        routeParams: {
                                            ...this.state.routeParams,
                                            kode_produk: ''
                                        }
                                    },()=>{
                                        this.componentDidMount()
                                    })
                                })
        
                            }else{
                                //gagal
                                this.$f7.dialog.close()
                                this.$f7.dialog.alert(result.payload.pesan, 'Peringatan')
                            }

                        })
                    }else{
                        //produk tidak cocok/sesuai
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Kode Tracking tidak sesuai dengan produk ini! Mohon pastikan tidak ada kesalahan ketik', 'Peringatan')
                    }

                    // return true

                }else{
                    //nggak ketemu
                    
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Kode Tracking tidak ditemukan! Mohon pastikan tidak ada kesalahan ketik', 'Peringatan')
                }
            })
        }
    }

    simpanLanjut = () => {
        // alert('oke')
        this.$f7.dialog.preloader()
        this.props.prosesLanjutTransaksi(this.state.routeParams).then((result)=>{
            
            this.$f7.dialog.close()
            
            if(result.payload.sukses){
                this.$f7router.navigate('/ProsesPengiriman/'+this.$f7route.params['transaksi_id'])
            }else{
                this.$f7.dialog.alert('Terdapat kesalahan. Mohon coba kembali dalam beberapa waktu ke depan', 'Gagal')
            }
        }).catchn(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Terdapat kesalahan. Mohon coba kembali dalam beberapa waktu ke depan', 'Gagal')
        })

    }

    hapusTracking = (option) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus kode tracking ini?','Konfirmasi',()=>{

            this.props.hapusTracking({tracking_produk_transaksi_id: option.tracking_produk_transaksi_id}).then((result)=>{
                
                this.props.getTracking({
                    ...this.state.routeParams,
                    produk_id: this.state.produk_aktif.produk_id,
                    varian_produk_id: this.state.produk_aktif.varian_produk_id,
                    transaksi_id: this.state.transaksi_record.transaksi_id
                }).then((result)=>{
                    this.setState({
                        tracking: result.payload
                    },()=>{
                        this.componentDidMount()
                    })
                })
    
            })

        })
        // console.log(option)
    }
    
    render()
    {
        return (
            <Page name="ProsesTransaksi" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Proses Transaksi</NavTitle>
                </Navbar>

                <Popup className="input-kode-popup" opened={this.state.input_kode} onPopupClosed={() => this.setState({input_kode : false})}>
                    <Page>
                        <Navbar title="Input Kode Tracking">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <Card>
                                <CardContent style={{display:'inline-flex'}}>
                                    <div style={{
                                        height:'120px', 
                                        width:'120px', 
                                        backgroundColor:'#434343',
                                        backgroundImage: 'url('+localStorage.getItem('api_base')+''+this.state.produk_aktif.gambar_produk+')',
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        backgroundPosition:'center',
                                        borderRadius:'10px'
                                    }}>
                                        &nbsp;
                                    </div>
                                    <div style={{paddingLeft:'8px'}}>
                                        <h3 className="title" style={{marginTop:'0px', marginBottom:'8px', fontSize:'15px'}}>
                                            {this.state.produk_aktif.nama}
                                        </h3>
                                        {this.state.produk_aktif.varian_produk_id ? <div style={{marginTop:'-10px', color:'#434343', fontSize:'12px'}}>{this.state.produk_aktif.varian_produk}</div> : ''}
                                        <h2 style={{fontWeight:'bold', fontSize:'20px', marginTop:'0px'}}>
                                            Rp {this.formatAngka(this.state.produk_aktif.harga_final)}
                                        </h2>
                                        <span>Jumlah: {this.state.produk_aktif.jumlah}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <div style={{fontWeight:'bold'}}>
                                        Scan/Ketik kode produk yang akan dikirimkan untuk transaksi ini
                                    </div>
                                    <div class="list no-hairlines-md" style={{marginTop:'16px'}}>
                                        <ul>
                                            <li class="item-content item-input item-input-outline">
                                                <div class="item-inner">
                                                    {/* <div class="item-title item-floating-label">Name</div> */}
                                                    <div class="item-input-wrap">
                                                        <input 
                                                            ref={'ketikCari'}
                                                            value={this.state.routeParams.kode_produk} 
                                                            onKeyPress={this.ketikEnter} 
                                                            onChange={this.ketikCari} 
                                                            type="text"
                                                            placeholder="Kode Tracking (Tekan Enter untuk mencari)" 
                                                        />
                                                        <span class="input-clear-button"></span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <List noHairlinesMd style={{marginTop:'16px'}}> */}
                                        {/* <input onKeyPress /> */}
                                        {/* <div class="item-input-wrap">
                                            <input type="text" name="cari_kode" />
                                        </div> */}
                                        {/* <ListInput
                                        outline
                                        large
                                        floatingLabel
                                        type="text"
                                        placeholder="Kode Produk (Tekan Enter)..."
                                        clearButton
                                        ref={'ketikCari'} 
                                        inputRef={el => this.ketikCari = el} 
                                        onChange={this.ketikCari}
                                        ></ListInput> */}
                                    {/* </List>  */}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <div>
                                        Kode terinput: {this.state.tracking.total > 0 ? this.state.tracking.total : '0'}/{this.state.produk_aktif.jumlah} barang
                                    </div>
                                    <div>
                                        {this.state.tracking.rows.map((option)=>{
                                            return (
                                                <Card style={{margin:'4px'}}>
                                                    <CardContent style={{display:'inline-flex', padding:'8px', paddingLeft:'16px', width:'calc(100% - 30px)'}}>
                                                        <div style={{display:'inline-flex'}}>
                                                            <QRCode value={option.kode_produk} style={{width:'50px', height:'50px'}} />
                                                        </div>
                                                        <div style={{fontSize:'10px', marginLeft:'8px', width:'100%'}}>
                                                            <Row noGap>
                                                                <Col width="100" tabletWidth="100">
                                                                    <Row noGap>
                                                                        <Col width="80">
                                                                            Kode Tracking:<br/>
                                                                            <b>{option.kode_produk}</b><br/>
                                                                            Kode Produksi:<br/>
                                                                            <b>{btoa(option.batch_id).toUpperCase().substring(0,10)}</b>
                                                                        </Col>
                                                                        <Col width="20" style={{textAlign:'right'}}>
                                                                            <Link onClick={()=>this.hapusTracking(option)}>Hapus</Link>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                
                                                            </Row>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </Block>
                    </Page>
                </Popup>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <CardTransaksi transaksi={this.state.transaksi_record} />
                                {/* <CardProdukTransaksi transaksi={this.state.transaksi_record} /> */}
                                <Row noGap>
                                    <Col width="100" tabletWidth="100">
                                        <BlockTitle>Daftar Barang dalam transaksi ini</BlockTitle>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.transaksi_record.produk_transaksi && this.state.transaksi_record.produk_transaksi.map((option)=>{
                                            return (
                                                <Card>
                                                    <CardContent>
                                                        <Row>
                                                            <Col width="60" style={{display:'inline-flex'}}>
                                                                <div style={{
                                                                    height:'120px', 
                                                                    width:'120px', 
                                                                    backgroundColor:'#434343',
                                                                    backgroundImage: 'url('+localStorage.getItem('api_base')+''+option.gambar_produk+')',
                                                                    backgroundSize:'contain',
                                                                    backgroundRepeat:'no-repeat',
                                                                    backgroundPosition:'center',
                                                                    borderRadius:'10px' 
                                                                }}>
                                                                    &nbsp;
                                                                </div>
                                                                <div style={{paddingLeft:'8px'}}>
                                                                    <h3 className="title" style={{marginTop:'0px', marginBottom:'8px', fontSize:'15px'}}>
                                                                        {option.nama}
                                                                    </h3>
                                                                    {option.varian_produk_id ? <div style={{marginTop:'-10px', color:'#434343', fontSize:'12px'}}>{option.varian_produk}</div> : ''}
                                                                    <h2 style={{fontWeight:'bold', fontSize:'20px', marginTop:'0px'}}>
                                                                        Rp {this.formatAngka(option.harga_final)}
                                                                    </h2>
                                                                    <span>Jumlah: {option.jumlah}</span>
                                                                    <Button raised fill style={{marginTop:'8px', background:'linear-gradient(to right, #ed213a, #93291e)', paddingRight:'32px', paddingLeft:'32px'}} onClick={()=>this.inputKode(option)}>
                                                                        <i className="f7-icons" style={{fontSize:'20px'}}>qrcode</i>&nbsp;
                                                                        Input Kode Tracking
                                                                    </Button>
                                                                    {/* <span>Input kode produ</span> */}
                                                                </div>
                                                            </Col>
                                                            <Col width="40">
                                                                {/* {option.total_tracking} */}
                                                                {parseInt(option.total_tracking) === parseInt(option.jumlah) && <div style={{width:'100%', textAlign:'right', display:'inline-flex', justifyContent:'flex-end'}}><i className="f7-icons" style={{color:'green', fontSize:'20px'}}>checkmark_circle_fill</i>&nbsp;Tracking produk lengkap</div>}
                                                                {parseInt(option.total_tracking) < parseInt(option.jumlah) && <div style={{width:'100%', textAlign:'right', color:'red'}}>Tracking produk belum lengkap. Mohon lengkapi terlebih dahulu!</div>}
                                                                {!option.total_tracking && <div style={{width:'100%', textAlign:'right', color:'red'}}>Tracking produk belum lengkap. Mohon lengkapi terlebih dahulu!</div>}
                                                            </Col>
                                                        </Row>
                                                        {/* <div>
                                                            {option.total_tracking}
                                                        </div> */}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </Col>
                                    <Col width="100">
                                        <Card noBorder noShadow style={{marginBottom:'32px'}}>
                                            <CardContent style={{padding:'0px', color:'#6d6d6d', fontStyle:'italic'}}>
                                                <b>Keterangan:</b>
                                                <br/>
                                                Mohon lengkapi tracking produk untuk barang diata sebelum melanjutkan.
                                                <br/>
                                                Pastikan bahwa jumlah tracking yang dilengkapi sesuai dengan jumlah barang yang akan diproses/dikirimkan<br/>
                                            </CardContent>
                                        </Card>
                                        <Card noBorder noShadow>
                                            <CardContent style={{padding:'0px'}}>
                                                <Button onClick={this.simpanLanjut} raised fill style={{display:'inline-flex', paddingRight:'32px', paddingLeft:'32px', marginTop:'8px', marginRight:'8px'}} disabled={!this.state.komplit}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>paperplane</i>&nbsp;
                                                    Simpan dan Lanjutkan
                                                </Button>
                                                <Button onClick={()=>this.$f7router.navigate('/Penjualan/')} style={{display:'inline-flex', paddingRight:'4px', paddingLeft:'4px', marginTop:'8px', marginRight:'8px'}} disabled={!this.state.komplit}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>square_arrow_left</i>&nbsp;
                                                    Kembali ke Daftar Penjualan
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                    
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
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
      getTransaksi: Actions.getTransaksi,
      cariKodeProduk: Actions.cariKodeProduk,
      getMitra: Actions.getMitra,
      simpanTracking: Actions.simpanTracking,
      getTracking: Actions.getTracking,
      prosesLanjutTransaksi: Actions.prosesLanjutTransaksi,
      hapusTracking: Actions.hapusTracking
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProsesTransaksi));
  