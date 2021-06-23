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

class ProsesPengiriman extends Component {
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
        kurir: {
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

        this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
            this.setState({
                transaksi: result.payload,
                transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {},
                routeParams: {
                    ...this.state.routeParams,
                    ...result.payload.rows[0],
                    tanggal_pengiriman: result.payload.total > 0 ? ( result.payload.rows[0].tanggal_pengiriman ? result.payload.rows[0].tanggal_pengiriman.replace(' ','T') : null ): null,
                }
            },()=>{

                this.props.getAlamatPengiriman({
                    pengguna_id: this.state.transaksi_record.pengguna_id
                }).then((result)=>{

                    this.props.getKurir(this.state.routeParams).then((result)=>{
                        this.setState({
                            kurir: result.payload,
                            routeParams: {
                                ...this.state.routeParams,
                                kurir_id: result.payload.total > 0 ? result.payload.rows[0].kurir_id : null
                            }
                        })
                    })
                    
                })


            })
        })

    }

    setValue = (type) => (e) => {

        console.log(type)

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    simpanLanjut = () => {
        // alert('oke')
        this.$f7.dialog.preloader()
        this.props.simpanKurir(this.state.routeParams).then((result)=>{
            
            this.$f7.dialog.close()
            
            if(result.payload.sukses){
                this.$f7router.navigate('/Penjualan/')
            }else{
                this.$f7.dialog.alert('Terdapat kesalahan. Mohon coba kembali dalam beberapa waktu ke depan', 'Gagal')
            }
        }).catchn(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Terdapat kesalahan. Mohon coba kembali dalam beberapa waktu ke depan', 'Gagal')
        })

    }

    render()
    {
        return (
            <Page name="ProsesPengiriman" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Proses Pengiriman</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <CardTransaksi transaksi={this.state.transaksi_record} />
                                <Card>
                                    <CardHeader>
                                        Alamat Pengiriman
                                    </CardHeader>
                                    <CardContent>
                                        
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>
                                        <List noHairlinesMd style={{marginBottom:'0px'}}>
                                            <ListInput
                                                label="Nama Kurir"
                                                type="select"
                                                defaultValue={this.state.routeParams.kurir_id}
                                                value={this.state.routeParams.kurir_id}
                                                placeholder="Pilih Nama Kurir..."
                                                onChange={this.setValue('kurir_id')}
                                            >
                                                {this.state.kurir.rows.map((option)=>{
                                                    return (
                                                        <option selected={option.kurir_id === this.state.routeParams.kurir_id ? true : false} value={option.kurir_id}>{option.nama}</option>    
                                                    )
                                                })}
                                            </ListInput>
                                            <ListInput
                                                label="Jenis Layanan"
                                                type="text"
                                                resizable
                                                placeholder="Jenis Layanan"
                                                clearButton
                                                onChange={this.setValue('jenis_layanan_kurir')}
                                                defaultValue={this.state.routeParams.jenis_layanan_kurir}
                                            >
                                            </ListInput>
                                            <ListInput
                                                label="Nomor Resi"
                                                type="text"
                                                resizable
                                                placeholder="Nomor Resi"
                                                clearButton
                                                onChange={this.setValue('nomor_resi')}
                                                defaultValue={this.state.routeParams.nomor_resi}
                                            >
                                            </ListInput>
                                            <ListInput
                                                label="Tanggal Pengiriman"
                                                type="datetime-local"
                                                placeholder="Tanggal Pengiriman"
                                                value={this.state.routeParams.tanggal_pengiriman}
                                                onChange={this.setValue('tanggal_pengiriman')}
                                            />
                                        </List>
                                        <Button onClick={this.simpanLanjut} raised fill style={{display:'inline-flex', paddingRight:'32px', paddingLeft:'32px', marginTop:'16px', marginRight:'8px'}}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>paperplane</i>&nbsp;
                                            Simpan Pengiriman
                                        </Button>
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
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      generateUUID: Actions.generateUUID,
      getTransaksi: Actions.getTransaksi,
      getKurir: Actions.getKurir,
      simpanKurir: Actions.simpanKurir,
      getAlamatPengiriman: Actions.getAlamatPengiriman
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProsesPengiriman));
  