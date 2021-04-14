import React, {Component} from 'react';
import {
    Page, Popup, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

            this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
                this.setState({
                    transaksi: result.payload,
                    transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {}
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
            this.props.cariKodeProduk({
                ...this.state.routeParams,
                produk_id: this.state.produk_aktif.produk_id,
                varian_produk_id: this.state.produk_aktif.varian_produk_id,
                transaksi_id: this.state.transaksi_record.transaksi_id
            })
        }
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
                        <Navbar title="Input Kode Produk">
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
                                                        <input onKeyPress={this.ketikEnter} onChange={this.ketikCari} type="text" placeholder="Kode Produk (Tekan Enter untuk mencari)" />
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
                                        Kode terinput: 0/{this.state.produk_aktif.jumlah} barang
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
                                                    <CardContent style={{display:'inline-flex'}}>
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
                                                            <Button raised fill style={{marginTop:'8px', background:'linear-gradient(to right, #ed213a, #93291e)'}} onClick={()=>this.inputKode(option)}>
                                                                <i className="f7-icons" style={{fontSize:'20px'}}>qrcode</i>&nbsp;
                                                                Input Kode Produk
                                                            </Button>
                                                            {/* <span>Input kode produ</span> */}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </Col>
                                    <Col width="100">
                                        <Card noBorder noShadow>
                                            <CardContent style={{padding:'0px'}}>
                                                <Button raised fill style={{display:'inline-flex'}}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>paperplane</i>&nbsp;
                                                    Simpan dan Lanjutkan
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
      getMitra: Actions.getMitra
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProsesTransaksi));
  