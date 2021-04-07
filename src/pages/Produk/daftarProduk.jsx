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

class daftarProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            kategori_produk_id: (this.$f7route.params['kategori_produk_id'] && this.$f7route.params['kategori_produk_id'] !== 'semua') ? this.$f7route.params['kategori_produk_id'] : null
        },
        produk: {
            rows: [],
            total: 0
        },
        kategori_produk: {},
        mitra_terdekat: (localStorage.getItem('mitra_terdekat') && localStorage.getItem('mitra_terdekat') !== '' ? JSON.parse(localStorage.getItem('mitra_terdekat')) : {thi})
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
        this.props.getProduk(this.state.routeParams).then((result)=>{
            this.setState({
                produk: result.payload
            },()=>{
                if(this.state.routeParams.kategori_produk_id){
                    this.props.getKategoriProduk(this.state.routeParams).then((result)=>{
                        this.setState({
                            kategori_produk: result.payload.total > 0 ? result.payload.rows[0] : {}
                        })
                    })
                }
            })
        })
    }
    
    render()
    {
        return (
            <Page name="daftarProduk" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.kategori_produk_id ? this.state.kategori_produk.nama : 'Semua Produk'}</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">

                        {/* <Card noShadow noBorder style={{background: 'transparent'}}> */}
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                Menampilkan stok barang dari:
                                <br/>
                                <div style={{display:'inline-flex', marginTop:'8px'}}>
                                    <img src={this.state.mitra_terdekat[0].gambar ? this.state.mitra_terdekat[0].gambar : '/static/icons/illo-logo-icon.png'} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                    <div style={{marginLeft:'8px'}}>
                                        {this.state.mitra_terdekat.length > 0 &&
                                        <div>
                                            <b style={{fontSize:'14px'}}>{this.state.mitra_terdekat[0].pengguna}</b>
                                            <br/>
                                            <span style={{fontSize:'12px'}}>
                                                {this.state.mitra_terdekat[0].jenis_mitra} - {parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 5 ? <>{this.state.mitra_terdekat[0].provinsi}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 4 ? <>{this.state.mitra_terdekat[0].kabupaten}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 3 ? <>{this.state.mitra_terdekat[0].kecamatan}</> : <></>))}
                                            </span>
                                        </div>
                                        }
                                    </div>
                                </div>
                                {/* {this.state.mitra_terdekat.length > 0 &&
                                <div>
                                <b style={{fontSize:'14px'}}>{this.state.mitra_terdekat[0].pengguna}</b>
                                
                                <span style={{fontSize:'12px'}}>
                                  &nbsp;({this.state.mitra_terdekat[0].jenis_mitra} - {parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 5 ? <>{this.state.mitra_terdekat[0].provinsi}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 4 ? <>{this.state.mitra_terdekat[0].kabupaten}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 3 ? <>{this.state.mitra_terdekat[0].kecamatan}</> : <></>))})
                                </span>
                              </div>
                                } */}
                            </CardContent>
                        </Card>
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{paddingLeft:'0px', paddingRight:'0px'}}>
                                {/* <div className="kotakProduk"> */}
                                <Row noGap style={{justifyContent:'end'}}>
                                    {this.state.produk.rows.map((option)=>{
                                        let last_update = '';
                                        last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                        if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                            last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                        }

                                        return (
                                            <Col width="50" tabletWidth="33" desktopWidth="33">
                                                {/* <Card key={option.produk_id} className="boxProduk"> */}
                                                <Card key={option.produk_id} style={{margin:'8px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <div className="gambarProduk" style={{
                                                            backgroundImage:'url('+localStorage.getItem('api_base')+(option.gambar_produk.length > 0 ? option.gambar_produk[0].nama_file : '/assets/berkas/3577232-1.jpg')+')', 
                                                            backgroundSize:'cover',
                                                            backgroundPosition:'center'
                                                        }}>&nbsp;</div>
                                                        <Row noGap>
                                                            <Col width="85">
                                                                <div className="namaProduk">
                                                                    <Link href={"/TampilProduk/"+option.produk_id}>{option.nama}</Link>
                                                                </div>
                                                                <div className="namaProduk" style={{fontSize:'10px', fontWeight:'normal', marginTop:'0px'}}>
                                                                    {option.keterangan ? option.keterangan.replace(/(<([^>]+)>)/gi, "") : <>&nbsp;</>}
                                                                </div>
                                                                <div className="hargaProduk">
                                                                    Rp {(option.harga_produk.length > 0 ? this.formatAngka(option.harga_produk[0].nominal) : '0')}
                                                                </div>
                                                                <div className="namaProduk" style={{fontSize:'10px', color:'#b3b3b3'}}>
                                                                    {option.kategori_produk}
                                                                </div>
                                                                <div className="namaProduk" style={{fontSize:'10px', color:'#b3b3b3', float:'right', marginTop:'-14px', marginRight:'-24px'}}>
                                                                    {option.varian_produk ? (option.varian_produk.length > 0 ? <>{option.varian_produk.length + ' Varian'}</> : '') : ''}
                                                                </div>
                                                            </Col>
                                                            {/* <Col width="15"> */}
                                                                {/* <Button popoverOpen={".popover-menu-"+option.produk_id}><i className="icons f7-icons" style={{fontSize:'18px', display:'inline-flex', textAlign:'right'}}>ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.produk_id} style={{minWidth:'150px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.produk_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.produk_id)} />
                                                                        <ListItem link="#" popoverClose title="Batch & Stok" onClick={()=>this.batch(option.produk_id)} />
                                                                    </List>
                                                                </Popover> */}
                                                            {/* </Col> */}
                                                            {/* <Col width="100">
                                                                <Button className="bawahCiriBiru" raised fill style={{marginTop:'8px'}}>
                                                                    <i className="f7-icons" style={{fontSize:'20px'}}>cart_badge_plus</i>&nbsp;
                                                                    Beli
                                                                </Button>
                                                            </Col> */}
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                        )
                                    })}
                                </Row>
                                {/* </div> */}
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
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      generateUUID: Actions.generateUUID,
      getProduk: Actions.getProduk,
      getKategoriProduk: Actions.getKategoriProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarProduk));
  