import React, {Component} from 'react';
import {
    Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';


class Pos extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        produk: {
            rows: [],
            total: 0
        },
        produk_terpilih: [],
        item_produk: 0,
        harga_total: 0,
        popupOpen: false,
        popupOpenLanjut: false,
        popupOpenCariPengguna: false,
        pengguna: {
            rows: [],
            total: 0
        },
        customer_aktif: {},
        pengguna_manual: {
            pengguna_manual: 1,
            pengguna_id_pembuat: JSON.parse(localStorage.getItem('user')).pengguna_id
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

        this.props.getProduk(this.state.routeParams).then((result)=>{
            this.setState({
                produk: result.payload
            })
        })
        
    }

    pilihProduk = (optionProduk) => {
        // alert(optionProduk.nama)
        let sudah_ada = 0
        let harga_total = this.state.harga_total
        let produk_terpilih = []

        for (let index = 0; index < this.state.produk_terpilih.length; index++) {
            const element = this.state.produk_terpilih[index]

            if(element.produk_id === optionProduk.produk_id){
                //sudah ada, tinggal tambah jumlahnya aja
                sudah_ada++
                element.jumlah++

                harga_total = harga_total + (optionProduk.harga_produk.length > 0 ? parseFloat(optionProduk.harga_produk[0].nominal) : 0)
            }else{
                //do nothing
            }

            produk_terpilih.push(element)
        }

        this.setState({
            produk_terpilih: produk_terpilih,
            item_produk: (sudah_ada > 0 ? (this.state.item_produk+1) : this.state.item_produk),
            harga_total: harga_total
        },()=>{

            if(sudah_ada < 1){
                // belum ada, tambah baru
                this.setState({
                    produk_terpilih: [
                        ...this.state.produk_terpilih,
                        {
                            ...optionProduk,
                            jumlah: 1
                        }
                    ],
                    item_produk: this.state.item_produk+1,
                    harga_total: this.state.harga_total + (optionProduk.harga_produk.length > 0 ? parseFloat(optionProduk.harga_produk[0].nominal) : 0)
                },()=>{
                    console.log(this.state.produk_terpilih)
                })
            }else{
                console.log(this.state.produk_terpilih)
            }

        })


    }

    bukaRincian = () => {
        // alert('tes')
        this.setState({
            popupOpen: true
        })
    }

    hapusKeranjang = (optionProduk) => {

        console.log(optionProduk)

        let arrNow = []
        let harga_total = parseInt(this.state.harga_total)
        let item_produk = parseInt(this.state.item_produk)

        console.log(this.state.harga_total)

        this.state.produk_terpilih.map((option)=>{
            if(option.produk_id !== optionProduk.produk_id){
                arrNow.push(option)
            }else{
                // console.log(parseInt(optionProduk.nominal))

                harga_total = parseInt(harga_total) - (optionProduk.harga_produk.length > 0 ? parseInt(optionProduk.harga_produk[0].nominal) : 0)
                item_produk = parseInt(item_produk) - parseInt(optionProduk.jumlah)
            }
        })

        // console.log(harga_total)

        this.setState({
            produk_terpilih: arrNow,
            harga_total: harga_total,
            item_produk: item_produk
        })
    }

    lanjutkanCheckout = () => {
        this.setState({
            popupOpenLanjut: true
        })
    }

    cariPengguna = (e) => {
        setTimeout(() => {
            this.props.getPengguna({
                keyword: e.currentTarget.value
            })
            
        }, 1000);
    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    cariPengguna = () => {
        this.$f7.dialog.preloader()

        this.props.getPengguna({...this.state.routeParams, pengguna_id: null}).then((result)=>{
            this.setState({
                pengguna: result.payload,
                popupOpenCariPengguna: true
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    pilihCustomer = (option) => {
        this.setState({
            customer_aktif: option,
            popupOpenCariPengguna: false
        })
    }

    ketikPenggunaManual = (e) => {
        this.setState({
            pengguna_manual: {
                ...this.state.pengguna_manual,
                nama: e.currentTarget.value
            }
        })
    }
    
    simpanPenggunaManual = () => {
        this.$f7.dialog.preloader()
        
        this.props.simpanPenggunaManual(this.state.pengguna_manual).then((result)=>{
            
            this.$f7.dialog.close()

            this.setState({
                customer_aktif: result.payload.rows[0],
                popupOpenCariPengguna: false
            })

        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="Pos" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Point of Sales</NavTitle>                   
                </Navbar>
                <Popup backdrop={true} opened={this.state.popupOpenCariPengguna} className="demo-popup-swipe-handler popupLebar" swipeToClose swipeHandler=".swipe-handler" onPopupClosed={()=>this.setState({popupOpenCariPengguna:false})}>
                    <Page>
                        <Navbar className="swipe-handler" title={"Hasil Pencarian Customer"}>
                            <NavRight>
                                <Link style={{color:'white'}} popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block strong style={{marginTop:'0px'}}>
                            {this.state.pengguna.total < 1 &&
                                <div style={{width:'100%', textAlign:'center'}}>
                                    Customer tidak ditemukan. Silakan tambah customer baru
                                    {/* <Button raised fill style={{display:'inline-flex'}}>
                                        Tambah Customer Baru
                                    </Button> */}
                                    {/* <hr/> */}
                                    <List style={{marginTop:'16px'}}>
                                        <ListInput
                                            label="Nama Customer Baru"
                                            type="text"
                                            placeholder="Nama Customer Baru..."
                                            clearButton
                                            onChange={this.ketikPenggunaManual}
                                        />
                                    </List>
                                    <Button raised fill style={{display:'inline-flex'}} onClick={this.simpanPenggunaManual}>
                                        Simpan Customer Baru
                                    </Button>
                                </div>
                            }
                            {this.state.pengguna.rows.map((option)=>{
                                let last_update = '';
                                last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                    last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                }

                                return (
                                    <Card key={option.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                        <CardContent style={{padding:'8px'}}>
                                            <Row>
                                                <Col width="70" tabletWidth="50" desktopWidth="50" style={{display:'inline-flex'}}>
                                                    <img src={option.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                    <div style={{marginLeft:'16px'}}>
                                                        
                                                        <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                        <div style={{fontSize:'10px'}}>
                                                            {option.username &&
                                                            <>
                                                            {option.username}
                                                            </>
                                                            }
                                                            <div style={{fontSize:'10px'}}>
                                                                Update Terakhir: {last_update}
                                                            </div>
                                                        </div>
                                                        <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                                            {option.jenis_mitra}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                    <div style={{fontSize:'10px'}}>{parseInt(option.a_admin) === 1 ? <b>Administrator</b> : 'Pengguna Umum'}</div>
                                                    <div style={{fontSize:'10px'}}>{option.jenis_mitra}</div>
                                                </Col>
                                                
                                                <Col width="30" tabletWidth="30" desktopWidth="30" style={{textAlign:'right'}}>
                                                    <Button raised fill onClick={()=>this.pilihCustomer(option)}>
                                                        Pilih Customer
                                                    </Button>
                                                </Col>
                                                </Row>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            {this.state.pengguna.total > 0 &&
                            <div style={{width:'100%', textAlign:'center'}}>
                                Customer tidak ditemukan? Silakan tambah customer baru
                                <List style={{marginTop:'16px'}}>
                                    <ListInput
                                        label="Nama Customer baru"
                                        type="text"
                                        placeholder="Nama Customer baru..."
                                        clearButton
                                        onChange={this.ketikPenggunaManual}
                                    />
                                </List>
                                <Button raised fill style={{display:'inline-flex'}} onClick={this.simpanPenggunaManual}>
                                    Simpan Customer Baru
                                </Button>
                            </div>
                            }
                        </Block>
                    </Page>
                </Popup>
                <Popup opened={this.state.popupOpenLanjut} className="demo-popup-swipe-handler popupLebar" swipeToClose swipeHandler=".swipe-handler" onPopupClosed={()=>this.setState({popupOpenLanjut:false})}>
                    <Page>
                        <Navbar className="swipe-handler" title={"Checkout Transaksi"}>
                            <NavRight>
                                <Link style={{color:'white'}} popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block strong style={{marginTop:'0px'}}>
                            <Searchbar
                                className="searchbar-demo"
                                placeholder="Nama Customer"
                                searchContainer=".search-list"
                                searchIn=".item-title"
                                onChange={this.cariKeyword}
                            ></Searchbar>
                            <Button raised fill onClick={this.cariPengguna} style={{marginTop:'8px', display:'inline-flex'}}>
                                Cari Customer
                            </Button>
                            {this.state.customer_aktif.pengguna_id &&
                            <Card key={this.state.customer_aktif.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                <CardHeader>
                                    Nama Customer
                                </CardHeader>
                                <CardContent style={{padding:'8px'}}>
                                    <Row>
                                        <Col width="100" tabletWidth="80" desktopWidth="80" style={{display:'inline-flex'}}>
                                            <img src={this.state.customer_aktif.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                            <div style={{marginLeft:'16px'}}>
                                                
                                                <Link href={"/tampilPengguna/"+this.state.customer_aktif.pengguna_id}><b>{this.state.customer_aktif.nama}</b></Link>
                                                <div style={{fontSize:'10px'}}>
                                                    {this.state.customer_aktif.username &&
                                                    <>
                                                    {this.state.customer_aktif.username}
                                                    </>
                                                    }
                                                    
                                                </div>
                                                <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                                    {this.state.customer_aktif.jenis_mitra}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                            <div style={{fontSize:'10px'}}>{parseInt(this.state.customer_aktif.a_admin) === 1 ? <b>Administrator</b> : 'Pengguna Umum'}</div>
                                            <div style={{fontSize:'10px'}}>{this.state.customer_aktif.jenis_mitra}</div>
                                        </Col>
                                        </Row>
                                </CardContent>
                            </Card>
                            }
                            {this.state.customer_aktif.pengguna_id &&
                            <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                <CardHeader>
                                    Daftar Item Produk
                                </CardHeader>
                                <CardContent style={{padding:'8px'}}>
                                {this.state.produk_terpilih.map((optionProduk)=>{
                                    return (
                                        <Card>
                                            <CardContent>
                                                <div style={{display:'inline-flex', width:'100%'}}>
                                                    <div
                                                    style={{
                                                        height:'80px',
                                                        width:'80px',
                                                        border:'0px solid red',
                                                        borderRadius:'10px',
                                                        backgroundImage: 'url('+(optionProduk.gambar_produk.length > 0 ? ('http://117.53.47.43:8085' + optionProduk.gambar_produk[0].nama_file) : ('http://117.53.47.43:8085'+'/assets/berkas/3577232-1.jpg') )+')',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundPosition: 'center'
                                                    }}
                                                    >
                                                        &nbsp;
                                                    </div>
                                                    <div style={{
                                                        fontWeight:'bold', 
                                                        marginTop:'8px', 
                                                        // height:'90px',
                                                        color: 'black',
                                                        marginLeft:'16px',
                                                        width: '220px'
                                                    }}>
                                                        {optionProduk.nama}
                                                        <div style={{
                                                            fontSize:'10px',
                                                            color:'#4f4f4f'
                                                        }}>
                                                            {optionProduk.kategori_produk}
                                                        </div>
                                                        <div style={{
                                                            fontSize:'14px',
                                                            color:'#4f4f4f',
                                                            marginTop:'16px'
                                                        }}>
                                                            Rp {optionProduk.harga_produk.length > 0 ? this.formatAngka(optionProduk.harga_produk[0].nominal) : '0'}
                                                        </div>
                                                    </div>
                                                    <div style={{textAlign:'right', width:'calc( 100% - 300px )', paddingLeft:'16px'}}>
                                                        Jumlah:<br/>
                                                        <b style={{fontSize:'20px'}}>{optionProduk.jumlah}</b>
                                                        {/* <br/>
                                                        <Button raised style={{display:'inline-flex'}} className={"color-theme-red"} onClick={()=>this.hapusKeranjang(optionProduk)}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>trash</i>&nbsp;
                                                            Hapus
                                                        </Button> */}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                                </CardContent>
                            </Card>
                            }
                            {/* <List>
                                <ListInput
                                    label="Nama Customer"
                                    type="text"
                                    placeholder="Nama Customer..."
                                    clearButton
                                    // value={this.state.routeParams.hpp}
                                    // onChange={this.setValue('hpp')}
                                    onChange={this.cariPengguna}
                                />
                            </List> */}
                        </Block>
                    </Page>
                </Popup>
                <Popup opened={this.state.popupOpen} className="demo-popup-swipe-handler popupLebar" swipeToClose swipeHandler=".swipe-handler" onPopupClosed={()=>this.setState({popupOpen:false})}>
                    <Page>
                        <Navbar className="swipe-handler" title={"Rincian Keranjang"}>
                            <NavRight>
                                <Link style={{color:'white'}} popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block strong style={{marginTop:'0px'}}>

                            {this.state.produk_terpilih.map((optionProduk)=>{
                                return (
                                    <Card style={{width:'100%'}}>
                                        <CardContent>
                                            <div style={{display:'inline-flex', width:'100%'}}>
                                                <div
                                                style={{
                                                    height:'80px',
                                                    width:'80px',
                                                    border:'0px solid red',
                                                    borderRadius:'10px',
                                                    backgroundImage: 'url('+(optionProduk.gambar_produk.length > 0 ? ('http://117.53.47.43:8085' + optionProduk.gambar_produk[0].nama_file) : ('http://117.53.47.43:8085'+'/assets/berkas/3577232-1.jpg') )+')',
                                                    backgroundSize: 'cover',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center'
                                                }}
                                                >
                                                    &nbsp;
                                                </div>
                                                <div style={{
                                                    fontWeight:'bold', 
                                                    marginTop:'8px', 
                                                    // height:'90px',
                                                    color: 'black',
                                                    marginLeft:'16px',
                                                    width: '220px'
                                                }}>
                                                    {optionProduk.nama}
                                                    <div style={{
                                                        fontSize:'10px',
                                                        color:'#4f4f4f'
                                                    }}>
                                                        {optionProduk.kategori_produk}
                                                    </div>
                                                    <div style={{
                                                        fontSize:'14px',
                                                        color:'#4f4f4f',
                                                        marginTop:'16px'
                                                    }}>
                                                        Rp {optionProduk.harga_produk.length > 0 ? this.formatAngka(optionProduk.harga_produk[0].nominal) : '0'}
                                                    </div>
                                                </div>
                                                <div style={{textAlign:'right', width:'calc( 100% - 300px )', paddingLeft:'16px'}}>
                                                    Jumlah:<br/>
                                                    <b style={{fontSize:'20px'}}>{optionProduk.jumlah}</b>
                                                    <br/>
                                                    <Button raised style={{display:'inline-flex'}} className={"color-theme-red"} onClick={()=>this.hapusKeranjang(optionProduk)}>
                                                        <i className="f7-icons" style={{fontSize:'20px'}}>trash</i>&nbsp;
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            
                        </Block>
                    </Page>
                </Popup>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        <Card noBorder noShadow style={{background:'transparent'}}>
                            <CardContent style={{padding:'0px'}}>
                                <Card>
                                    <CardHeader>
                                        Keranjang
                                    </CardHeader>
                                    <CardContent>
                                        <Row>
                                            <Col width="40">
                                                <b>{this.state.produk_terpilih.length ? this.state.produk_terpilih.length : '0'}</b> Produk (<b>{this.state.item_produk ? this.state.item_produk : '0'}</b> Item)
                                                <br/>
                                                <Link onClick={this.bukaRincian}>Rincian</Link>
                                            </Col>
                                            <Col width="40" style={{textAlign:'right'}}>
                                                Total:<br/>
                                                <b>Rp {this.formatAngka(this.state.harga_total)}</b>
                                            </Col>
                                            <Col width="20">
                                                <Button raised fill disabled={this.state.produk_terpilih.length > 0 ? false : true} onClick={this.lanjutkanCheckout}>
                                                    Lanjutkan&nbsp;<i className="f7-icons" style={{fontSize:'20px'}}>arrow_right</i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        Produk
                                    </CardHeader>
                                    <CardContent>
                                        <Row noGap>
                                        {this.state.produk.rows.map((optionProduk)=>{
                                            return (
                                                <Col width="33">
                                                    <Link onClick={()=>this.pilihProduk(optionProduk)}style={{width:'100%'}}>
                                                        <Card style={{width:'100%'}}>
                                                            <CardContent>
                                                                <div
                                                                style={{
                                                                    height:'164px',
                                                                    width:'100%',
                                                                    border:'0px solid red',
                                                                    borderRadius:'10px',
                                                                    backgroundImage: 'url('+(optionProduk.gambar_produk.length > 0 ? ('http://117.53.47.43:8085' + optionProduk.gambar_produk[0].nama_file) : ('http://117.53.47.43:8085'+'/assets/berkas/3577232-1.jpg') )+')',
                                                                    backgroundSize: 'cover',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundPosition: 'center'
                                                                }}
                                                                >
                                                                    &nbsp;
                                                                </div>
                                                                <div style={{
                                                                    fontWeight:'bold', 
                                                                    marginTop:'8px', 
                                                                    height:'90px',
                                                                    color: 'black'
                                                                }}>
                                                                    {optionProduk.nama}
                                                                    <div style={{
                                                                        fontSize:'10px',
                                                                        color:'#4f4f4f'
                                                                    }}>
                                                                        {optionProduk.kategori_produk}
                                                                    </div>
                                                                    <div style={{
                                                                        fontSize:'14px',
                                                                        color:'#4f4f4f',
                                                                        marginTop:'16px'
                                                                    }}>
                                                                        Rp {optionProduk.harga_produk.length > 0 ? this.formatAngka(optionProduk.harga_produk[0].nominal) : '0'}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                </Col>
                                            )
                                        })}
                                        </Row>
                                    </CardContent>
                                </Card>
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
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getProduk: actions.getProduk,
      getPengguna: actions.getPengguna,
      simpanPenggunaManual: actions.simpanPenggunaManual
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Pos));
  