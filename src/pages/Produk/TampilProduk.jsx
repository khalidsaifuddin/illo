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

class TampilProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            produk_id: this.$f7route.params['produk_id'] ? this.$f7route.params['produk_id'] : null
        },
        produk: {
            rows: [],
            total: 0
        },
        produk_record: {
            gambar_produk: [],
            harga_produk: []
        },
        gambar_utama: {},
        harga_retail: 0,
        harga_tampil: 0,
        label_harga: ''
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
                produk: result.payload,
                produk_record: result.payload.total > 0 ? result.payload.rows[0] : {}
            },()=>{
                this.state.produk_record.gambar_produk.map((option)=>{
                    if(this.state.produk_record.gambar_produk.indexOf(option) === 0){
                        //first record
                        this.setState({
                            gambar_utama: option
                        })
                    }

                    if(parseInt(option.gambar_utama) === 1){
                        this.setState({
                            gambar_utama: option
                        })
                    }
                })

                let harga_retail = 0;
                let harga_tampil = 0;
                let label_harga = '';

                this.state.produk_record.harga_produk.map((option)=>{
                    if(parseInt(option.jenis_harga_id) === 1){
                        //harga retail
                        harga_retail = option.nominal
                    }

                    if(this.props.anggota_mitra.total < 1){
                        //privileged customer
                        if(parseInt(option.jenis_harga_id) === 2){
                            harga_tampil = option.nominal
                            label_harga = "Harga Privileged Customer"
                        }
                    }else{
                        //distributor, agen, atau reseller
                    }
                })

                this.setState({
                    harga_retail: harga_retail,
                    harga_tampil: harga_tampil,
                    label_harga: label_harga
                },()=>{
                    console.log(this.state)
                })
            })
        })

        console.log(this.props.anggota_mitra)
    }

    gantiGambar = (option) => {
        this.setState({
            gambar_utama: option
        })
    }
    
    render()
    {
        return (
            <Page name="TampilProduk" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box', background:'white'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.produk_record.nama}</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent>
                                <Row>
                                    <Col width="100" tabletWidth="50">
                                        <div className="gambarProdukUtama" style={{
                                            backgroundColor: '#434343',
                                            backgroundImage:'url('+localStorage.getItem('api_base')+this.state.gambar_utama.nama_file+')', 
                                            backgroundSize:'contain',
                                            backgroundPosition:'center',
                                            border:'1px solid #eee',
                                            backgroundRepeat: 'no-repeat'
                                        }}>&nbsp;</div>
                                        <br/>
                                        <div style={{display:'inline-flex', width:'100%', overflow: 'auto'}}>
                                        {this.state.produk_record.gambar_produk.map((optionGambar)=>{
                                            return (
                                                <Link onClick={()=>this.gantiGambar(optionGambar)} >
                                                    <div className="gambarProdukTampil" style={{
                                                        backgroundImage:'url('+localStorage.getItem('api_base')+optionGambar.nama_file+')', 
                                                        backgroundSize:'cover',
                                                        backgroundPosition:'center',
                                                        border:'1px solid #eee'
                                                    }}>&nbsp;</div>
                                                </Link>
                                            )
                                        })}
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="50">
                                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <h1 style={{marginTop:'-16px', marginBottom:'8px'}}>{this.state.produk_record.nama}</h1>
                                                <div className="jumlahStok">
                                                    Jumlah Stok: 0
                                                </div>
                                                <div className="hargaProdukCoret">
                                                    Rp {this.formatAngka(this.state.harga_retail)}
                                                </div>
                                                <div className="hargaProdukTampil">
                                                    Rp {this.formatAngka(this.state.harga_tampil)}
                                                </div>
                                                <div className="labelHarga">
                                                    {this.state.label_harga}
                                                </div>
                                                <Row style={{borderTop:'1px solid #ccc', marginTop:'16px'}}>
                                                    <Col width="100" tabletWidth="50" style={{marginTop:'6px'}}>
                                                        <List>
                                                            <ListInput
                                                                // label="Jumlah"

                                                                type="number"
                                                                placeholder="Jumlah barang"
                                                                clearButton
                                                                outline
                                                                style={{marginLeft:'-8px'}}
                                                            >
                                                            </ListInput>
                                                        </List>
                                                    </Col>
                                                    <Col width="100" tabletWidth="50">
                                                        <Button className="bawahCiriBiru" raised fill large style={{marginTop:'8px'}}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>cart_badge_plus</i>&nbsp;
                                                            Beli
                                                        </Button>
                                                    </Col>
                                                </Row>
                                                <BlockTitle style={{marginLeft:'0px'}}>Keterangan Produk</BlockTitle>
                                                {this.state.produk_record.keterangan &&
                                                <div style={{marginTop:'8px', fontSize:'12px'}} dangerouslySetInnerHTML={{ __html: this.state.produk_record.keterangan.replace(/noreferrer/g, 'noreferrer" class="link external"').replace('<p class=""><br></p>','') }} />
                                                }
                                                {!this.state.produk_record.keterangan &&
                                                <div style={{marginTop:'8px', fontSize:'12px'}}>
                                                    Tidak ada keterangan produk
                                                </div>
                                                }
                                                
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    {/* <Col width="100">
                                        deskripsi
                                    </Col> */}
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
      generateUUID: Actions.generateUUID,
      getProduk: Actions.getProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Mitra }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        anggota_mitra: Mitra.anggota_mitra
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TampilProduk));
  