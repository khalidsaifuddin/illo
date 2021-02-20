import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, CardContent, Card, Row, Col, Segmented, Button, Tabs, Tab, Link, CardFooter
} from 'framework7-react';

import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import NotifikasiReducer from '../../store/reducers/Notifikasi.reducers';



class tampilPengguna extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id']
        },
        loading:true,
        pengguna: {},
        pengikut: 0,
        mengikuti: 0,
        status_mengikuti: 'N',
        disabledButtonMengikuti: false,
        aktivitas: {
            rows: [],
            total: 0
        },
        startAktivitas: 0
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
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: this.props.pengguna.rows[0],
                routeParamsCek: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                    soft_delete: 0
                },
                routeParamsAktivitas: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    start: this.state.startAktivitas,
                    tipe: (this.props.pengguna.rows[0].pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'privat' : 'publik')
                },
                routeParamsKuis: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    hanya_publik: (this.props.pengguna.rows[0].pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'N' : 'Y')
                }
            },()=>{
                this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                    this.setState({
                        status_mengikuti: result.payload.status
                    });
                });

                this.props.getAktivitas(this.state.routeParamsAktivitas).then((result)=>{
                    this.setState({
                        aktivitas: {
                          rows: [
                            ...this.state.aktivitas.rows,
                            ...this.props.aktivitas.rows
                          ],
                          total: (parseInt(this.state.aktivitas.total)+parseInt(this.props.aktivitas.total))
                        }
                    });
                });

                this.props.getKuisDiikuti(this.state.routeParamsKuis).then((result)=>{
                    this.setState({
                        loading: false
                    });
                });
            });
        });

        this.props.getPengikut(this.state.routeParams).then((result)=>{
            this.props.pengikut.map((option)=>{
                if(option.label === 'pengikut'){
                    this.setState({
                        pengikut: option.jumlah
                    });
                }
                if(option.label === 'mengikuti'){
                    this.setState({
                        mengikuti: option.jumlah
                    });
                }
            });

            
        });

    }

    ikutiPengguna = () => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: this.state.pengguna.pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 0
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
                this.setState({
                    routeParamsCek: {
                        pengguna_id: this.state.pengguna.pengguna_id,
                        pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        soft_delete: 0
                    }
                },()=>{
                    this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                        this.setState({
                            status_mengikuti: result.payload.status,
                            disabledButtonMengikuti: false
                        },()=>{
                            this.props.getPengikut(this.state.routeParams).then((result)=>{
                                this.props.pengikut.map((option)=>{
                                    if(option.label === 'pengikut'){
                                        this.setState({
                                            pengikut: option.jumlah
                                        });
                                    }
                                    if(option.label === 'mengikuti'){
                                        this.setState({
                                            mengikuti: option.jumlah
                                        });
                                    }
                                });            
                            });
                        });
                    });
                });
            });
        });
    }

    stopIkutiPengguna = () => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: this.state.pengguna.pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 1
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
                this.setState({
                    routeParamsCek: {
                        pengguna_id: this.state.pengguna.pengguna_id,
                        pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        soft_delete: 0
                    }
                },()=>{
                    this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                        this.setState({
                            status_mengikuti: result.payload.status,
                            disabledButtonMengikuti: false
                        },()=>{
                            this.props.getPengikut(this.state.routeParams).then((result)=>{
                                this.props.pengikut.map((option)=>{
                                    if(option.label === 'pengikut'){
                                        this.setState({
                                            pengikut: option.jumlah
                                        });
                                    }
                                    if(option.label === 'mengikuti'){
                                        this.setState({
                                            mengikuti: option.jumlah
                                        });
                                    }
                                });            
                            });
                        });
                    });
                });
            });
        });
    }

    tambahPesan = (pengguna_id) => {
        // alert(pengguna_id)
        this.props.simpanKelompokPesan({
            pengguna_id_1: pengguna_id,
            pengguna_id_2: JSON.parse(localStorage.getItem('user')).pengguna_id
        }).then((result)=>{
            if(result.payload.sukses){
                this.$f7router.navigate("/TampilPesan/"+result.payload.kelompok_pesan_id)
            }
        })
    }

    render()
    {
        return (
            // <Page name="tampilPengguna" hideBarsOnScroll className="halamanRuang">
            <Page name="tampilPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.pengguna.nama}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.state.pengguna.nama}
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        <Card>
                            <CardContent>
                                <Row>
                                    <Col width="30" tabletWidth="20" style={{textAlign:'center'}}>
                                        <img src={this.state.pengguna.gambar} style={{width:'100px', height:'100px', borderRadius:'50%'}}/>
                                        {this.$f7route.params['pengguna_id'] === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                        <Button raised fill onClick={()=>this.$f7router.navigate('/ProfilPengguna/')}>
                                            Edit Profil
                                        </Button>
                                        }
                                    </Col>
                                    <Col width="70" tabletWidth="80" style={{paddingLeft:'8px'}}>
                                        <h1 style={{marginBottom:'0px', color:'#2670AF', marginTop:'0px'}}>{this.state.pengguna.nama}</h1>
                                        <h3 style={{marginTop:'0px', fontWeight:'normal'}}>{this.state.pengguna.username}</h3>

                                        <Row>
                                            <Col width="100" tabletWidth="50" style={{border:'1px solid #cccccc', padding:'8px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Row noGap>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_2_fill</i>&nbsp;
                                                        <b>{this.state.pengikut}</b><br/>Pengikut
                                                    </Col>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_2_fill</i>&nbsp;
                                                        <b>{this.state.mengikuti}</b><br/>Mengikuti
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="50" style={{border:'1px solid #cccccc', padding:'8px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Row noGap>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>star_fill</i>&nbsp;
                                                        <b>0</b> Poin
                                                    </Col>
                                                    {/* <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>checkmark_seal</i>&nbsp;
                                                        <b>2</b> Trofi
                                                    </Col> */}
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="100" style={{border:'0px solid #cccccc', padding:'0px', borderRadius:'8px', marginBottom:'8px'}}>
                                                {JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.pengguna.pengguna_id && this.state.status_mengikuti === 'N' &&
                                                <Button disabled={this.state.disabledButtonMengikuti} raised fill onClick={this.ikutiPengguna} style={{display:'inline-flex'}}>
                                                    <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                    Ikuti
                                                </Button>
                                                }
                                                {JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.pengguna.pengguna_id && this.state.status_mengikuti === 'Y' &&
                                                <Button disabled={this.state.disabledButtonMengikuti} raised fill onClick={this.stopIkutiPengguna} style={{background:'#cccccc', display:'inline-flex'}}>
                                                    <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_crop_circle_fill_badge_checkmark</i>&nbsp;
                                                    <span style={{color:'#434343'}}>Mengikuti</span>
                                                </Button>
                                                }
                                                {this.$f7route.params['pengguna_id'] !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                <Button raised fill style={{display:'inline-flex', marginLeft:'4px'}} onClick={()=>this.tambahPesan(this.$f7route.params['pengguna_id'])}>
                                                    <i className="icon f7-icons" style={{fontSize:'20px'}}>chat_bubble_2_fill</i>&nbsp;
                                                    Pesan
                                                </Button>
                                                }
                                            </Col>
                                            {/* <Col width="100" tabletWidth="50" style={{border:'0px solid #cccccc', padding:'0px', borderRadius:'8px', marginBottom:'8px'}}> */}
                                            {/* </Col> */}
                                        </Row>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                            
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getPengguna: Actions.getPengguna,
      simpanPengikut: Actions.simpanPengikut,
      getPengikut: Actions.getPengikut,
      cekMengikuti: Actions.cekMengikuti,
      getAktivitas: Actions.getAktivitas,
      getKuisDiikuti: Actions.getKuisDiikuti,
      simpanKelompokPesan: Actions.simpanKelompokPesan
    }, dispatch);
}

function mapStateToProps({ App, Notifikasi, Aktivitas, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        pengikut: Notifikasi.pengikut,
        aktivitas: Aktivitas.aktivitas,
        kuis_diikuti: Kuis.kuis_diikuti
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilPengguna));
  