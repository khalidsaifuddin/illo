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

class TampilKategoriProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            hitung_produk: 'Y'
        },
        kategori_produk: {
            rows: [],
            total: 0
        },
        total_produk: 0
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

    gradients = [
        'linear-gradient(-45deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(-45deg, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)',
        'linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)',
        'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)',
        'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
        'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
        'linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)'
      ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        this.props.getKategoriProduk(this.state.routeParams).then((result)=>{
            this.setState({
                kategori_produk: result.payload
            },()=>{
                let total_produk = 0;

                this.state.kategori_produk.rows.map((option)=>{
                    total_produk = parseInt(total_produk) + option.jumlah_produk
                })

                this.setState({
                    total_produk: total_produk
                })
            })
        })
    }
    
    render()
    {
        return (
            <Page name="TampilKategoriProduk" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kategori Produk</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                <Row noGap>
                                    <Col width="100" tabletWidth="50">
                                        <Link style={{width:'100%', color:'#434343'}} href={"/daftarProduk/semua"}>
                                            <Card style={{width:'100%', marginLeft:'4px', marginRight:'4px', margin:'4px', background: 'linear-gradient(to top, #ffffff 0%, #f5efef 100%)'}}>
                                                <CardContent>
                                                    <Row>
                                                        <Col width="70" style={{display:'inline-flex'}}>
                                                            <img src="./static/icons/3370s.png" style={{height:'40px'}} />
                                                            <div style={{marginLeft:'8px'}}>
                                                                <b style={{fontSize:'18px'}}>Semua</b>
                                                                <div className="namaProduk" style={{width:'90%', fontSize:'10px', fontWeight:'normal', marginTop:'0px'}}>
                                                                    Semua kategori produk
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col width="30" style={{textAlign:'right'}}>
                                                            <div style={{fontSize:'18px'}}>{this.state.total_produk}</div>
                                                            <div style={{fontSize:'10px'}}>Produk</div>
                                                        </Col>
                                                    </Row>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </Col>
                                    {this.state.kategori_produk.rows.map((option)=>{
                                        return (
                                            <Col width="100" tabletWidth="50">
                                                <Link style={{width:'100%', color:'#434343'}} href={"/daftarProduk/"+option.kategori_produk_id}>
                                                    <Card style={{width:'100%', marginLeft:'4px', marginRight:'4px', margin:'4px', background: 'linear-gradient(to top, #ffffff 0%, #f5efef 100%)'}}>
                                                    {/* <Card style={{width:'100%', marginLeft:'4px', marginRight:'4px', margin:'4px', background: (this.gradients[this.state.kategori_produk.rows.indexOf(option)])}}> */}
                                                        <CardContent>
                                                            <Row>
                                                                <Col width="70" style={{display:'inline-flex', color:'#434343'}}>
                                                                    <img src="./static/icons/3370s.png" style={{height:'40px'}} />
                                                                    <div style={{marginLeft:'8px', width:'100%'}}>
                                                                        <b style={{fontSize:'18px'}}>{option.nama}</b>
                                                                        <br/>
                                                                        <div className="namaProduk" style={{width:'90%', fontSize:'10px', fontWeight:'normal', marginTop:'0px'}}>
                                                                            {option.keterangan ? option.keterangan.replace(/(<([^>]+)>)/gi, "") : <>&nbsp;</>}
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col width="30" style={{textAlign:'right'}}>
                                                                    <div style={{fontSize:'18px'}}>{parseInt(option.jumlah_produk) > 0 ? parseInt(option.jumlah_produk) : '0'}</div>
                                                                    <div style={{fontSize:'10px'}}>Produk</div>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
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
      generateUUID: Actions.generateUUID,
      getKategoriProduk: Actions.getKategoriProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TampilKategoriProduk));
  