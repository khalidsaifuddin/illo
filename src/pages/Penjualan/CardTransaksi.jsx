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

class CardTransaksi extends Component {
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
            <Card>
                <CardContent>
                    <Row noGap>
                        <Col width="100" tabletWidth="50">
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>ID Transaksi</BlockTitle>
                            <div style={{fontWeight:'bold'}}>{this.props.transaksi.transaksi_id}</div>
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>Tanggal Transaksi</BlockTitle>
                            <div style={{fontWeight:'bold'}}>{moment(this.props.transaksi.create_date).format('DD') + ' ' + this.bulan[(moment(this.props.transaksi.create_date).format('M')-1)] + ' ' + moment(this.props.transaksi.create_date).format('YYYY') + ', ' + moment(this.props.transaksi.create_date).format('HH') + ':' + moment(this.props.transaksi.create_date).format('mm')}</div>
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>Pembeli</BlockTitle>
                            <div style={{fontWeight:'bold'}}>{this.props.transaksi.pengguna}</div>
                        </Col>
                        <Col width="100" tabletWidth="50">
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>Status Pembayaran</BlockTitle>
                            <div style={{fontWeight:'bold'}}>{this.props.transaksi.status_pembayaran_id === 1 ? 'PAID' : 'MENUNGGU PEMBAYARAN'}</div>
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>Status Verifikasi</BlockTitle>
                            <div style={{fontWeight:'bold'}}>{this.props.transaksi.status_konfirmasi_id === 1 ? 'TERVERIFIKASI' : 'MENUNGGU VERIFIKASI'}</div>
                            <BlockTitle style={{marginLeft:'0px', marginTop:'16px'}}>Status Terakhir</BlockTitle>
                            <div style={{fontWeight:'bold'}}>
                                {this.props.transaksi.status_pembayaran_id !== 1 && this.props.transaksi.status_konfirmasi_id !== 1 && this.props.transaksi.status_pengiriman_id !== 1 && this.props.transaksi.status_diterima_id !== 1 && this.props.transaksi.status_selesai_id !== 1 && 'MENUNGGU PEMBAYARAN'}    
                                {this.props.transaksi.status_pembayaran_id === 1 && this.props.transaksi.status_konfirmasi_id !== 1 && this.props.transaksi.status_pengiriman_id !== 1 && this.props.transaksi.status_diterima_id !== 1 && this.props.transaksi.status_selesai_id !== 1 && 'MENUNGGU VERIFIKASI'}    
                                {this.props.transaksi.status_pembayaran_id === 1 && this.props.transaksi.status_konfirmasi_id === 1 && this.props.transaksi.status_pengiriman_id !== 1 && this.props.transaksi.status_diterima_id !== 1 && this.props.transaksi.status_selesai_id !== 1 && 'DIPROSES'}    
                                {this.props.transaksi.status_pembayaran_id === 1 && this.props.transaksi.status_konfirmasi_id === 1 && this.props.transaksi.status_pengiriman_id === 1 && this.props.transaksi.status_diterima_id !== 1 && this.props.transaksi.status_selesai_id !== 1 && 'DIKIRIM'}    
                                {this.props.transaksi.status_pembayaran_id === 1 && this.props.transaksi.status_konfirmasi_id === 1 && this.props.transaksi.status_pengiriman_id === 1 && this.props.transaksi.status_diterima_id === 1 && this.props.transaksi.status_selesai_id !== 1 && 'DITERIMA'}    
                                {this.props.transaksi.status_pembayaran_id === 1 && this.props.transaksi.status_konfirmasi_id === 1 && this.props.transaksi.status_pengiriman_id === 1 && this.props.transaksi.status_diterima_id === 1 && this.props.transaksi.status_selesai_id === 1 && 'SELESAI'}    
                            </div>
                        </Col>
                    </Row>
                </CardContent>
            </Card>
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

export default (connect(mapStateToProps, mapDispatchToProps)(CardTransaksi));
  