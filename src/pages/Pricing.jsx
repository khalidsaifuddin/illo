import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, CardContent, Card, Row, Col, Button, CardHeader, List, ListItem, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class Pricing extends Component {
    state = {
        error: null,
        loading: true
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
            <Page name="Pricing" hideBarsOnScroll className="halamanBeranda">
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Berlangganan</NavTitle>
                </Navbar>
                <Card>
                    <CardContent>
                        <Row>
                            <Col width="100" tabletWidth="100" style={{textAlign:'center', marginBottom:'20px'}}>
                            <img src={localStorage.getItem('api_base')+"/assets/img/vip.png"} style={{width:'70px', marginTop:'0%', marginRight:'10px'}}/><br/>
                                Berlangganan sekarang. Bayar tiga bulan kemudian!<br/>
                                <b style={{fontSize:'25px'}}>Dapatkan keanggotaan VIP gratis selama tiga bulan sejak pertama kali mendaftar</b>, <br/><b style={{fontSize:'16px'}}>dan nikmati semua fasilitas VIP dari Diskuis</b>!<br/> 
                                Tidak terikat dan bisa dibatalkan kapan saja!
                            </Col>
                            {/* <Col width="100" tabletWidth="40">
                                <Button raised fill style={{display:'inline-flex', width:'100%', height:'80px', fontSize:'25px'}}>
                                    Daftar Sekarang!
                                </Button>
                            </Col> */}
                        </Row>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Row>
                            <Col width="100" tabletWidth="60">
                                {/* Kolom VIP */}
                                <Card>
                                    <CardHeader style={{
                                        fontSize:'25px', 
                                        fontWeight:'bold', 
                                        background:'#ffffff', 
                                        // background:'#ffc107', 
                                        color:'$434343', 
                                        textAlign:'center', 
                                        display:'block',
                                        minHeight:'90px'
                                    }}>
                                        <img src={localStorage.getItem('api_base')+"/assets/img/vip.png"} style={{width:'100px', marginTop:'0%', marginRight:'10px'}}/>
                                    </CardHeader>
                                    <CardContent>
                                        <BlockTitle style={{marginTop:'0px', marginLeft:'0px', marginBottom:'32px'}}>Fitur VIP</BlockTitle>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Ruang yang dapat dibuat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>Tidak Terbatas</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Kuis yang dapat dibuat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>Tidak Terbatas</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Kuis yang dapat di-<i>assign</i> ke ruang
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>Tidak Terbatas</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Ruang Privat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#43a047'}}>checkmark_seal</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Kuis Privat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#43a047'}}>checkmark_seal</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail kuis
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#43a047'}}>checkmark_seal</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail ruang
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#43a047'}}>checkmark_seal</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                            <   Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail siswa
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#43a047'}}>checkmark_seal</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Row noGap>
                                            <Col width="50" style={{padding:'0px'}}>
                                                <Card>
                                                    <CardContent style={{textAlign:'center', background:'#7cb342', color:'white', minHeight:'70px'}}>
                                                        1 Bulan<br/>
                                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>
                                                            Rp 24.000
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" style={{padding:'0px'}}>
                                                <Card>
                                                    <CardContent style={{textAlign:'center', background:'#7cb342', color:'white', minHeight:'70px'}}>
                                                        3 Bulan<br/>
                                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>
                                                            Rp 72.000
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" style={{padding:'0px'}}>
                                                <Card>
                                                    <CardContent style={{textAlign:'center', background:'#7cb342', color:'white', minHeight:'70px'}}>
                                                        6 Bulan<br/>
                                                        <div>
                                                            <strike>Rp 144.000</strike>
                                                        </div>
                                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>
                                                            Rp 108.000
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" style={{padding:'0px'}}>
                                                <Card>
                                                    <CardContent style={{textAlign:'center', background:'#7cb342', color:'white', minHeight:'70px'}}>
                                                        12 Bulan<br/>
                                                        <div>
                                                            <strike>Rp 288.000</strike>
                                                        </div>
                                                        <div style={{fontSize:'20px', fontWeight:'bold'}}>
                                                            Rp 201.000
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="40">
                                {/* kolom free */}
                                <Card>
                                    <CardHeader style={{
                                        fontSize:'25px', 
                                        fontWeight:'bold', 
                                        background:'#ffffff', 
                                        // background:'#cfd8dc', 
                                        color:'$ffffff', 
                                        textAlign:'center', 
                                        display:'block',
                                        minHeight:'90px'
                                    }}>
                                        <img src={localStorage.getItem('api_base')+"/assets/img/free.png"} style={{width:'70px', marginTop:'0%', marginRight:'10px'}}/>
                                    </CardHeader>
                                    <CardContent>
                                        <BlockTitle style={{marginTop:'0px', marginLeft:'0px', marginBottom:'32px'}}>Fitur Free</BlockTitle>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>   
                                                    <Col width={70}>
                                                        Ruang yang dapat dibuat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>maksimal 5</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>   
                                                    <Col width={70}>
                                                        Kuis yang dapat dibuat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>maksimal 10</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Kuis yang dapat di-<i>assign</i> ke ruang
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <b>maksimal 5 per ruang</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Ruang Privat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#f57f17'}}>clear</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Kuis Privat
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#f57f17'}}>clear</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail kuis
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#f57f17'}}>clear</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail ruang
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#f57f17'}}>clear</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        <Card className="listFitur">
                                            <CardContent>
                                                <Row>
                                                    <Col width={70}>
                                                        Unduh laporan detail siswa
                                                    </Col>
                                                    <Col width={30} style={{textAlign:'center'}}>
                                                        <i className="icon f7-icons" style={{fontSize:'30px', color:'#f57f17'}}>clear</i>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                    </CardContent>
                </Card>
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

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Pricing));
  