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

class KonfirmasiPembayaran extends Component {
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

    verifikasiPembayaran = () => {
        // alert('tes')
        this.$f7.dialog.confirm('Apakah Anda yakin ingin memverifikasi pembayaran transaksi ini?', 'Konfirmasi', ()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanVerifikasi(this.state.routeParams).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Berhasil memverifikasi pembayaran', 'Berhasil', ()=>{
                        this.$f7router.navigate('/Penjualan/')
                    })
                }else{
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
                }
            }).catch(()=>{
                //gagal
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            })
        })
    }

    componentDidMount = () => {

            this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
                this.setState({
                    transaksi: result.payload,
                    transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {}
                })
            })

    }
    
    render()
    {
        return (
            <Page name="KonfirmasiPembayaran" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Konfirmasi Pembayaran</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent>
                                <BlockTitle>Konfirmasi Pembayaran</BlockTitle>
                                <Row noGap>
                                    <Col width="100" tabletWidth="50">

                                        <Card style={{marginTop:'16px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'8px'}}>
                                            ID Transaksi: <b>{this.state.transaksi_record.transaksi_id}</b><br/>
                                            Tanggal Transaksi: <b>{this.state.transaksi_record.create_date}</b><br/>
                                            Pembeli: <b>{this.state.transaksi_record.pengguna}</b><br/>
                                            </CardContent>
                                        </Card>

                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Bank Pengirim
                                                <br/>
                                                <b>{this.state.transaksi_record.bank_pengirim}</b>
                                            </CardContent>
                                        </Card>
                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Atas Nama Pemilik Rekening
                                                <br/>
                                                <b>{this.state.transaksi_record.nama_rekening_pengirim}</b>
                                            </CardContent>
                                        </Card>
                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Nomor Rekening
                                                <br/>
                                                <b>{this.state.transaksi_record.no_rekening_pengirim}</b>
                                            </CardContent>
                                        </Card>
                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Jumlah Transfer
                                                <br/>
                                                <b>{this.state.transaksi_record.jumlah_transfer}</b>
                                            </CardContent>
                                        </Card>
                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Tanggal Transfer
                                                <br/>
                                                <b>{this.state.transaksi_record.tanggal_pembayaran}</b>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100" tabletWidth="50">
                                        <Card noBorder noShadow style={{marginBottom:'0px', marginTop:'4px'}}>
                                            <CardContent style={{padding:'8px', paddingLeft:'4px', paddingBottom:'4px'}}>
                                                Bukti Pembayaran
                                                <br/>
                                                <div
                                                style={{
                                                    backgroundColor:'#434343',
                                                    backgroundImage:'url(https://be.diskuis.id'+this.state.transaksi_record.bukti_pembayaran+')',
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    width:'100%',
                                                    minHeight:'350px'
                                                }}
                                                >&nbsp;</div>
                                                {/* <b>{this.state.transaksi_record.bukti_pembayaran}</b> */}
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100" tabletWidth="50">
                                        <Button raised fill style={{display:'inline-flex'}} onClick={this.verifikasiPembayaran}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>checkmark_circle</i>&nbsp;    
                                            Verifikasi Pembayaran
                                        </Button>
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
      simpanVerifikasi: Actions.simpanVerifikasi
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(KonfirmasiPembayaran));
  