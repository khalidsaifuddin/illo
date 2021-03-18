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

class daftarKodeProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            batch_id: this.$f7route.params['batch_id']
        },
        kode_produk: {
            rows: [],
            total: 0
        },
        produk_record: {},
        popupFilter: false
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
        this.props.getKodeProduk(this.state.routeParams).then((result)=>{
            this.setState({
                kode_produk: result.payload
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
            this.props.getKodeProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    kode_produk: result.payload
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
            this.props.getKodeProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    kode_produk: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
    
            })
        })
    }
    
    render()
    {
        return (
            <Page name="daftarKodeProduk" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Kode Produk</NavTitle>
                </Navbar>

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
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.kode_produk.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.kode_produk.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.kode_produk.total)} dari {this.formatAngka(this.state.kode_produk.total)} Batch</span>
                                        </div>
                                    </div>
                                </div>
                                <Row>
                                    {this.state.kode_produk.rows.map((option)=>{
                                        return (
                                            <Col width="100">
                                                <Card style={{margin:'4px'}}>
                                                    <CardContent style={{display:'inline-flex', padding:'8px', paddingLeft:'16px'}}>
                                                        <QRCode value={option.kode_produk_id} style={{width:'50px', height:'50px'}} />
                                                        <div style={{fontSize:'10px', marginLeft:'8px', minWidth:'100%'}}>
                                                            <Row>
                                                                <Col width="50">
                                                                    Kode Produk:<br/>
                                                                    <b>{option.kode_produk_id}</b><br/>
                                                                </Col>
                                                                <Col width="50">
                                                                    Kode Produksi:<br/>
                                                                    <b>{option.batch_id}</b>
                                                                </Col>
                                                                <Col width="50">
                                                                    Batch:<br/>
                                                                    <b>{option.batch} ({option.kode_batch})</b>
                                                                </Col>
                                                                <Col width="50">
                                                                    Produk:<br/>
                                                                    <b>{option.produk}</b>
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
      getKodeProduk: Actions.getKodeProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        stok_total: Produk.stok_total
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarKodeProduk));
  