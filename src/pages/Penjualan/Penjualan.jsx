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

class Penjualan extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20
        },
        transaksi: {
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        if(parseInt(JSON.parse(localStorage.getItem('user')).a_admin) === 1){
            this.props.getTransaksi({...this.state.routeParams, mitra_id: '7efe511c-4c9a-4fd3-baa3-893e7093b372'}).then((result)=>{
                this.setState({
                    transaksi: result.payload
                })
            })
        }else{

        }

    }

    detail = (option) => {
        // alert(option.transaksi_id)
        this.$f7router.navigate('/KonfirmasiPembayaran/'+option.transaksi_id)
    }

    proses = (option) => {
        this.$f7router.navigate('/ProsesTransaksi/'+option.transaksi_id)
    }
    
    render()
    {
        return (
            <Page name="Penjualan" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Penjualan</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent>
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i className="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+this.state.routeParams.limit) >= parseInt(this.state.transaksi.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.transaksi.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.transaksi.total)} dari {this.formatAngka(this.state.transaksi.total)} Transaksi</span>
                                        </div>
                                    </div>
                                    <table>
                                        <thead style={{background:'#eeeeee'}}>
                                            <tr>
                                                <th className="label-cell" style={{minWidth:'40px'}}>&nbsp;</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Status</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Tanggal Pembelian</th>
                                                <th className="label-cell" style={{minWidth:'400px', color:'#434343', fontSize:'12px'}}>Produk</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Pembeli</th>
                                                <th className="label-cell" style={{minWidth:'100px', color:'#434343', fontSize:'12px'}}>Status Pembeli</th>
                                                <th className="numeric-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Sub Total</th>
                                                <th className="numeric-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Ongkos Kirim</th>
                                                <th className="numeric-cell" style={{minWidth:'200px', color:'#434343', fontSize:'12px'}}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.transaksi.rows.map((option)=>{
                                                return(
                                                    <tr key={option.transaksi_id}>
                                                        <td className="label-cell">
                                                            <Button popoverOpen={".popover-menu-"+option.transaksi_id}>
                                                                <i className="f7-icons" style={{fontSize:'20px'}}>ellipsis_vertical</i>
                                                            </Button>
                                                            <Popover className={"popover-menu-"+option.transaksi_id}>
                                                                <List>
                                                                    {parseInt(option.status_pembayaran_id) === 1 && <ListItem link popoverClose onClick={()=>this.detail(option)} title="Konfirmasi Pembayaran" />}
                                                                    <ListItem link popoverClose onClick={()=>this.detail(option)} title="Detail Transaksi" />
                                                                    <ListItem link popoverClose onClick={()=>this.proses(option)} title="Proses Transaksi" />
                                                                </List>
                                                            </Popover>
                                                        </td>
                                                        <td className="label-cell" style={{textAlign:'center'}}>
                                                            {parseInt(option.status_pembayaran_id) === 0 && <Button raised fill style={{background:'#fbc02d', marginTop:'8px'}}>Menunggu Pembayaran</Button>}
                                                            {parseInt(option.status_pembayaran_id) === 1 && parseInt(option.status_konfirmasi_id) === 0 && <Button raised fill style={{background:'#ff6f00', marginTop:'8px'}}>Menunggu Verifikasi</Button>}
                                                            {parseInt(option.status_pembayaran_id) === 1 && parseInt(option.status_konfirmasi_id) === 1 && parseInt(option.status_pengiriman_id) === 0 && <Button raised fill style={{background:'#00acc1', marginTop:'8px'}}>Diproses</Button>}
                                                            {parseInt(option.status_pembayaran_id) === 0 && <div style={{fontSize:'10px', marginBottom:'8px', marginTop:'4px'}}>Batas Pembayaran: {moment(option.batas_pembayaran).format('DD') + ' ' + this.bulan[(moment(option.batas_pembayaran).format('M')-1)] + ' ' + moment(option.batas_pembayaran).format('YYYY') + ', ' + moment(option.batas_pembayaran).format('HH') + ':' + moment(option.batas_pembayaran).format('mm')}</div>}
                                                            {parseInt(option.status_pembayaran_id) === 1 && option.tanggal_pembayaran !== null && <div style={{fontSize:'10px', marginBottom:'8px', marginTop:'4px'}}>Pembayaran: {moment(option.tanggal_pembayaran).format('DD') + ' ' + this.bulan[(moment(option.tanggal_pembayaran).format('M')-1)] + ' ' + moment(option.tanggal_pembayaran).format('YYYY')}</div>}
                                                        </td>
                                                        <td className="label-cell">
                                                            {moment(option.create_date).format('DD') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ', ' + moment(option.create_date).format('HH') + ':' + moment(option.create_date).format('mm')}
                                                        </td>
                                                        <td className="label-cell">
                                                            {option.produk_transaksi && option.produk_transaksi.length > 0 &&
                                                            <>
                                                            <ul style={{paddingLeft:'4px'}}>
                                                            {option.produk_transaksi.map((option)=>{
                                                                return (
                                                                    <li><b>{option.nama}</b> {option.varian_produk ? <>({option.varian_produk})</> : ''} - {option.jumlah} pcs</li>
                                                                )
                                                            })}
                                                            </ul>
                                                            </>
                                                            }
                                                        </td>
                                                        <td className="label-cell">
                                                            {option.pengguna}
                                                        </td>
                                                        <td className="label-cell">
                                                            {option.jenis_mitra ? option.jenis_mitra : 'Priv. Customer'}
                                                        </td>
                                                        <td className="numeric-cell">
                                                            {this.formatAngka(option.total_nominal)}
                                                        </td>
                                                        <td className="numeric-cell">
                                                            {this.formatAngka(option.ongkos_kirim)}
                                                        </td>
                                                        <td className="numeric-cell">
                                                            {this.formatAngka(parseFloat(option.total_nominal)+parseFloat(option.ongkos_kirim))}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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
      getTransaksi: Actions.getTransaksi
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Penjualan));
  