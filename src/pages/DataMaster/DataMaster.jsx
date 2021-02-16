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

class DataMaster extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false
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

    componentDidMount = () => {
        
    }

    
    render()
    {
        return (
            <Page name="DataMaster" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Data Master</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Row style={{justifyContent:'end'}}>
                            <Col width="50" tabletWidth="25">
                                <Link href="/KategoriProduk/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/produk.jpg)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Kategori Produk
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/Produk/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/produk.jpg)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Produk
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/Pengguna/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/pengguna.jpg)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Pengguna
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/Pengguna/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/pengguna.jpg)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Mitra
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/UnitPenjualan/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/sales.jpg)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Unit Penjualan
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/Unit/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/6308.png)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Unit Dukungan
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="25">
                                <Link href="/JenisTiket/" style={{width:'100%'}}>
                                    <Card style={{background:'url(./static/icons/4074.png)', backgroundSize:'cover', minHeight:'100px', width:'100%'}}>
                                        <CardContent className="kontenMenu">
                                            Jenis Tiket
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Col>
                            <Col width="50" tabletWidth="50">

                            </Col>
                        </Row>
                    
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                </Row>

            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(DataMaster));
  