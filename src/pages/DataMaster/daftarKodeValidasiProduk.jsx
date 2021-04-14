import React, {Component} from 'react';
import {
    Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import QRCode from 'qrcode.react'

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class daftarKodeValidasiProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            batch_kode_validasi_id: this.$f7route.params['batch_kode_validasi_id']
        },
        kode_validasi: {
            rows: [],
            total: 0
        },
        produk_record: {},
        popupFilter: false,
        input_kode: false,
        kode_aktif: {}
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
        this.$f7.dialog.preloader()
        this.props.getKodeValidasiProduk(this.state.routeParams).then((result)=>{
            this.setState({
                kode_validasi: result.payload
            },()=>{
                this.$f7.dialog.close()
            })

        })
    }

    klikNext = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getKodeValidasiProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    kode_validasi: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }
    
    klikPrev = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getKodeValidasiProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    kode_validasi: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
    
            })
        })
    }

    perbesarKode = (option) => {
        this.setState({
            input_kode: true,
            kode_aktif: option
        })
    }
    
    render()
    {
        return (
            <Page name="daftarKodeValidasiProduk" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Kode Validasi Produk</NavTitle>
                </Navbar>

                <Popup className="kode-popup" opened={this.state.input_kode} onPopupClosed={() => this.setState({input_kode : false})}>
                    <Page>
                        <Navbar title="Kode Produk">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <Card>
                                <CardContent style={{textAlign:'center'}}>
                                    <QRCode value={btoa(this.state.kode_aktif.kode_produk_id).toUpperCase().substring(0,10)} style={{width:'80%', height:'auto'}} />
                                </CardContent>
                            </Card>
                        </Block>
                    </Page>
                </Popup>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i className="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.kode_validasi.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.kode_validasi.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.kode_validasi.total)} dari {this.formatAngka(this.state.kode_validasi.total)} Kode Validasi Produk</span>
                                        </div>
                                    </div>
                                </div>
                                <Row>
                                    {this.state.kode_validasi.rows.map((option)=>{
                                        return (
                                            <Col width="100">
                                                <Card style={{margin:'4px'}}>
                                                    <CardContent style={{display:'inline-flex', padding:'8px', paddingLeft:'16px'}}>
                                                        {/* <QRCode value={option.kode_produk_id} style={{width:'50px', height:'50px'}} /> */}
                                                        <div style={{display:'inline-flex'}}>
                                                            <QRCode value={btoa(option.kode_produk_id).toUpperCase().substring(0,10)} style={{width:'50px', height:'50px'}} />
                                                            {/* <Button style={{marginLeft:'4px'}}>
                                                                <i className="f7-icons" style={{fontSize:'20px'}}>zoom_in</i>
                                                            </Button> */}
                                                        </div>
                                                        <div style={{fontSize:'10px', marginLeft:'8px'}}>
                                                            <Row noGap>
                                                                <Col width="100" tabletWidth="80">
                                                                    <Row noGap>
                                                                        <Col width="50">
                                                                            Kode Validasi:<br/>
                                                                            {/* <b>{option.kode_produk_id}</b><br/> */}
                                                                            <b>{btoa(option.kode_validasi_id).toUpperCase().substring(0,10)}</b><br/>
                                                                        </Col>
                                                                        <Col width="50">
                                                                            Batch:<br/>
                                                                            <b>{option.batch_kode_validasi}</b>
                                                                        </Col>
                                                                        <Col width="50">
                                                                            Produk:<br/>
                                                                            <b>{option.produk}</b> {option.varian_produk_id ? <span>({option.varian_produk})</span> : ''}
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col width="100" tabletWidth="20" style={{textAlign:'right'}}>
                                                                    <Button style={{marginLeft:'4px', display:'inline-flex'}} onClick={()=>this.perbesarKode(option)}>
                                                                        <i className="f7-icons" style={{fontSize:'20px'}}>zoom_in</i>&nbsp;Perbesar QRCode
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                        )
                                    })}
                                </Row>
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
      getBatch: Actions.getBatch,
      getStokTotal: Actions.getStokTotal,
      simpanBatch: Actions.simpanBatch,
      getProduk: Actions.getProduk,
      generateUUID: Actions.generateUUID,
      getKodeValidasiProduk: Actions.getKodeValidasiProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        stok_total: Produk.stok_total
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarKodeValidasiProduk));
  