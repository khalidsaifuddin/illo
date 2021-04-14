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

class CardProdukTransaksi extends Component {
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
        },
        transaksi_record: {}
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

            // this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
            //     this.setState({
            //         transaksi: result.payload,
            //         transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {}
            //     })
            // })

    }
    
    render()
    {
        return (
            // <Card>
            //     <CardContent>
            <Row noGap>
                <Col width="100" tabletWidth="100">
                    <BlockTitle>Daftar Barang dalam transaksi ini</BlockTitle>
                </Col>
                <Col width="100" tabletWidth="100">
                    {this.props.transaksi.produk_transaksi && this.props.transaksi.produk_transaksi.map((option)=>{
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
                                        backgroundPosition:'center'
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
                                        <Button raised fill style={{marginTop:'8px', background:'linear-gradient(to right, #ed213a, #93291e)'}}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>qrcode</i>&nbsp;
                                            Input Kode Produk
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Col>
            </Row>
            //     </CardContent>
            // </Card>
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

export default (connect(mapStateToProps, mapDispatchToProps)(CardProdukTransaksi));
  