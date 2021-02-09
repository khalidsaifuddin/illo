import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, Progressbar, BlockTitle, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class peringkatKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            sesi_kuis_id: this.$f7route.params['sesi_kuis_id'],
            kode_kuis: this.$f7route.params['kode_kuis'],
            tampil_jumlah_peserta: 'Y',
            order_by_peringkat: 'Y'
        },
        loading:true,
        sesi_kuis: {
            rows: [{
                kuis_id: '',
                nama: '-'
            }],
            total: 0
        },
        pengguna_kuis: {
            rows: [],
            total: 0
        },
        live_mode: false
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
        localStorage.setItem('current_url', this.$f7route.url);

        //socket
        let socket = io(localStorage.getItem('socket_url'));

        socket.on('newMessage', (kuis_id) => {
            console.log(kuis_id);
            console.log(this.state.routeParams.kuis_id);

            if(kuis_id === this.state.routeParams.kuis_id){
                this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
                    //todo
                });
            }
        });


        this.props.getSesiKuis(this.state.routeParams).then((result)=>{
            this.setState({
                loading:false,
                kuis_id: this.props.sesi_kuis.rows[0].kuis_id, 
                sesi_kuis: this.props.sesi_kuis,
                routeParams: {
                    ...this.state.routeParams,
                    kuis_id: this.props.sesi_kuis.rows[0].kuis_id,
                    // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{
                this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
                    this.setState({
                        pengguna_kuis: this.props.pengguna_kuis
                    });
                });
            });
        });
    }

    refreshPeringkat = () => {
        this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna_kuis: this.props.pengguna_kuis
            });
        });
    }

    // pad = (val) => {
    //     let valString = val + "";
    //     if (valString.length < 2) {
    //         return "0" + valString;
    //     } else {
    //         return valString;
    //     }
    // }

    // interval = setInterval(() => {
    //     let tgl = new Date();
    //     console.log(tgl);

    //     this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
    //         //nothing for now
    //     });
    // }, 3000);

    liveMode = () => {
        this.setState({
            live_mode: true
        },()=>{
            // this.interval;
            setInterval(() => {
                let tgl = new Date();
                console.log(tgl);
        
                this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
                    //nothing for now
                    this.setState({
                        pengguna_kuis: this.props.pengguna_kuis
                    });
                });
            }, 3000)
        });
    }

    stopLive = () => {

        this.setState({
            live_mode: false
        },()=>{
            // clearInterval(this.interval); 
        });
    }

    render()
    {
        return (
            <Page name="peringkatKuis" hideBarsOnScroll>
            {/* <Page name="peringkatKuis" hideBarsOnScroll className="halamanKuis"> */}
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Peringkat</NavTitle>
                    {/* <NavTitleLarge>
                        Peringkat
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        {this.state.sesi_kuis.rows.map((option)=>{
                            return (
                                <Card style={{borderBottom:'4px solid #4dd0e1'}}>
                                    <CardHeader style={{height:'120px', backgroundImage:'url('+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', borderRadius:'20px 20px'}}>
                                    {/* <CardHeader style={{height:'100px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', borderRadius:'20px 20px'}}> */}
                                        <div className="mantab" style={{
                                            backgroundColor:'rgba(0, 0, 0, 0.6)',
                                            width:'1000%',
                                            marginLeft:'-15px',
                                            marginRight:'-15px',
                                            paddingLeft:'10px',
                                            marginBottom:'-20px',
                                            color:'white',
                                            paddingBottom:'0px',
                                            height:'40px',
                                            paddingTop:'10px'
                                        }}>
                                            <Link href={""} style={{color:'white'}}>
                                                <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                    {option.judul}
                                                </h2>
                                            </Link>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* <Button raised fill onClick={this.refreshPeringkat}>Refresh</Button> */}
                                        <Block strong style={{borderRadius:'0px 0px 20px 20px'}}>
                                            <h4 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                {option.keterangan}
                                            </h4>
                                            <BlockHeader>{option.jumlah_peserta} peserta</BlockHeader>
                                            <Card style={{margin:'0px'}}>
                                                <CardContent style={{padding:'8px', fontSize:'10px'}}>
                                                    <Row>
                                                        <Col width="100">
                                                            <i>Peringkat diurutkan berdasarkan skor dan durasi pengerjaan</i>
                                                        </Col>
                                                        <Col width="100" style={{textAlign:'right'}}>
                                                            <Button onClick={()=>window.open(localStorage.getItem('api_base')+'/api/Kuis/getLaporanSesiKuis?sesi_kuis_id='+option.sesi_kuis_id+'&output=xlsx')} raise fill className="bawahCiriHijau cardBorder-20 color-theme-teal" style={{display:'inline-flex', paddingLeft:'16px',paddingRight:'16px', marginTop:'8px', marginRight:'8px'}}>
                                                                <i className="f7-icons icons" style={{fontSize:'15px'}}>download_circle_fill</i>&nbsp;
                                                                Unduh Xlsx
                                                            </Button>
                                                            {!this.state.live_mode &&
                                                            <Button onClick={this.liveMode} raise fill className="bawahCiri cardBorder-20 color-theme-deeporange" style={{display:'inline-flex', paddingLeft:'16px',paddingRight:'16px', marginTop:'8px'}}>
                                                                <i className="f7-icons icons" style={{fontSize:'15px'}}>antenna_radiowaves_left_right</i>&nbsp;
                                                                Aktifkan Live
                                                            </Button>
                                                            }
                                                            {this.state.live_mode &&
                                                            <>
                                                            <Button onClick={this.liveMode} raise fill className="bawahCiri cardBorder-20 color-theme-deeporange" style={{display:'inline-flex', paddingLeft:'16px',paddingRight:'16px', marginTop:'8px'}}>
                                                                <span className="blinking">
                                                                    <i className="f7-icons icons" style={{fontSize:'15px'}}>antenna_radiowaves_left_right</i>&nbsp;
                                                                    Live Sedang Berlangsung
                                                                </span>
                                                            </Button>
                                                            <Button onClick={this.stopLive} raise fill className="bawahCiri cardBorder-20 color-theme-red" style={{display:'inline-flex', paddingLeft:'16px',paddingRight:'16px', marginTop:'8px', marginLeft:'4px'}}>
                                                                <span>
                                                                    Berhenti
                                                                </span>
                                                            </Button>
                                                            </>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </CardContent>
                                            </Card>
                                            <br/>
                                            {this.state.pengguna_kuis.rows.map((option)=>{
                                                return (
                                                    <Card style={{background:'#ffffff', marginLeft:'0px', marginRight:'0px'}}>
                                                        <CardContent style={{padding:'8px'}}>
                                                            <Row>
                                                                <Col width="100">
                                                                    <div>
                                                                        <Row>
                                                                            <Col width="70">
                                                                                {option.peringkat}. <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama_pengguna}</b></Link> ({option.benar ? option.benar : '0'}/{option.total ? option.total : '0'})
                                                                                <br/>
                                                                                Durasi: <b>{(option.durasi ? (Math.floor(parseInt(option.durasi)/60) < 1 ? '0' : Math.floor(parseInt(option.durasi)/60)) : '0')}:{(option.durasi ? (Math.floor(parseInt(option.durasi)%60) < 1 ? '0' : Math.floor(parseInt(option.durasi)%60)) : '0')}</b> | <i style={{fontSize:'10px'}}>dikerjakan {option.last_update}</i>
                                                                            </Col>
                                                                            <Col width="30" style={{textAlign:'right'}}>
                                                                                {/* {parseInt(option.status_mengerjakan_id)} */}
                                                                                <b className="peringkatSkor">{option.skor ? parseFloat(option.skor).toFixed(2): '0'}</b>&nbsp;

                                                                                {parseInt(option.status_mengerjakan_id) === 2 &&
                                                                                <Icon style={{color:'#61d800', fontSize:'25px'}} ios="f7:checkmark_alt_circle_fill" aurora="f7:checkmark_alt_circle_fill" md="material:checkmark_alt_circle_fill" tooltip="Selesai"/>
                                                                                }
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                </Col>
                                                                <Col width="100">
                                                                    <Progressbar style={{height:'15px',background:'#D50000'}} progress={parseInt(option.skor)} id="demo-inline-progressbar"> 
                                                                    </Progressbar>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                        </Block>
                                    </CardContent>
                                </Card>
                            )
                        })}
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
      getKuis: Actions.getKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getSesiKuis: Actions.getSesiKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(peringkatKuis));
  