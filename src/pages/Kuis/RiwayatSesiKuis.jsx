import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, ListItem, BlockTitle, Toggle, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class RiwayatSesiKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id']
        },
        loading:true,
        sesi_kuis: {
            rows: [],
            total: 0
        },
        kuis: {
            kuis_id: '',
            nama: '-'
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

    componentDidMount = () => {

        console.log(this.state.routeParams);

        this.props.getKuis({kuis_id: this.$f7route.params['kuis_id']}).then((result)=>{
            this.setState({
                kuis: this.props.kuis.rows[0]
            })
        });
        
        this.props.getSesiKuis(this.state.routeParams).then((result)=>{
            this.setState({
                sesi_kuis: this.props.sesi_kuis
            })
        });

    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: value
            }
        },()=>{
            console.log(this.state);
        });

    }

    changeToggle = (key) => (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state);
        });
    }

    setSesiKuis = () => {
        // if(this.state.routeParams.tanggal_mulai){
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tanggal_mulai: this.state.routeParams.tanggal_mulai.replace("T", " "),
                tanggal_selesai: this.state.routeParams.tanggal_selesai.replace("T", " ")
            }
        },()=>{
            this.props.setSesiKuis(this.state.routeParams).then((result)=>{
                if(result.payload.success){
                    this.$f7router.navigate('/KodeKuis/'+result.payload.rows[0].sesi_kuis_id);
                }else{
                    this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon tunggu beberapa saat lagi dan coba kembali!','Peringatan');
                }
            });
        });    
        // }

    }

    hapusSesiKuis = (sesi_kuis_id) => {
        this.$f7.dialog.confirm('Semua progres sesi ini akan ikut terhapus. Proses ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus sesi?', 'Perhatian', () => {

            this.setState({
                routeParamsHapus: {
                    sesi_kuis_id: sesi_kuis_id
                }
            },()=>{
                this.props.hapusSesiKuis(this.state.routeParamsHapus).then((result)=>{
                    this.props.getSesiKuis(this.state.routeParams).then((result)=>{
                        this.setState({
                            sesi_kuis: this.props.sesi_kuis
                        })
                    });
                })
            });

        });
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="RiwayatSesiKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.kuis.judul}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.state.kuis.judul}
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <BlockTitle style={{color:'#434343', marginTop:'16px'}}>Riwayat Sesi</BlockTitle>
                        <Card className="hilangDiMobile" style={{background:'#CCCCCC'}}>
                            <CardContent>
                                <Row>
                                    <Col width="100" tabletWidth="70">
                                        <Row>
                                            <Col width="100" tabletWidth="40" style={{fontWeight:'bold', color:'#434343'}}>
                                                Keterangan
                                            </Col>
                                            <Col width="100" tabletWidth="30" style={{fontWeight:'bold', color:'#434343'}}>
                                                Waktu Mulai
                                            </Col>
                                            <Col width="100" tabletWidth="30" style={{fontWeight:'bold', color:'#434343'}}>
                                                Waktu Selesai
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col width="100" tabletWidth="30">
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        {this.state.sesi_kuis.rows.map((option)=>{
                            return (
                                <Card>
                                    <CardContent>
                                        <Row>
                                            <Col width="100" tabletWidth="70">
                                                <Row style={{marginBottom:'10px'}}>
                                                    <Col width="30" tabletWidth="40">
                                                        <b>{option.keterangan ? option.keterangan : <i style={{color:'#b2b2b2', fontSize:'12px'}}>(Tanpa Keterangan)</i>}</b>
                                                        <br/><span style={{fontSize:'10px'}}>oleh {option.pengguna}</span>
                                                    </Col>
                                                    <Col width="35" tabletWidth="30">
                                                        <div className="hilangDiDesktop">Waktu Mulai</div>
                                                        {option.waktu_mulai}
                                                    </Col>
                                                    <Col width="35" tabletWidth="30">
                                                        <div className="hilangDiDesktop">Waktu Selesai</div>
                                                        {option.waktu_selesai}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="30">
                                                <Row>
                                                    <Col width="90" tabletWidth="70">
                                                            <Button raised fill onClick={()=>this.$f7router.navigate('/kodeKuis/'+option.sesi_kuis_id)} style={{background:'#bf360c'}}>
                                                                <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Sesi Kuis"/>&nbsp;
                                                                Kode
                                                            </Button>
                                                        </Col>
                                                    <Col width="10" tabletWidth="30">
                                                        <Button popoverOpen={".popover-menu-"+option.sesi_kuis_id}>
                                                            <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Tampilkan Kode Sesi Kuis"/>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="100" style={{fontSize:'10px', marginTop:'4px'}}>
                                                Jawaban diacak {(parseInt(option.jawaban_diacak) === 1 ? <><Icon style={{color:'green', fontSize:'15px'}} ios={"f7:checkmark_alt_circle_fill"} aurora={"f7:checkmark_alt_circle_fill"} md={"material:checkmark_alt_circle_fill"} tooltip="Ya"/></> : <><Icon style={{color:'red', fontSize:'15px'}} ios={"f7:circle"} aurora={"f7:circle"} md={"material:circle"} tooltip="Tidak"/></>)} | Tampilkan jawaban yang benar {(parseInt(option.tampilkan_jawaban_benar) === 1 ? <><Icon style={{color:'green'}} ios={"f7:checkmark_alt_circle_fill"} aurora={"f7:checkmark_alt_circle_fill"} md={"material:checkmark_alt_circle_fill"} tooltip="Ya"/></> : <><Icon style={{color:'red', fontSize:'15px'}} ios={"f7:circle"} aurora={"f7:circle"} md={"material:circle"} tooltip="Tidak"/></>)} | Jumlah percobaan per peserta = {(parseInt(option.jumlah_percobaan))}
                                            </Col>
                                        </Row>
                                        <Popover className={"popover-menu-"+option.sesi_kuis_id}>
                                            <List>
                                                <ListItem onClick={()=>this.hapusSesiKuis(option.sesi_kuis_id)} style={{cursor:'pointer'}} popoverClose title="Hapus Sesi" />
                                                <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat" />
                                                <ListItem link={'/statistikKuis/'+option.sesi_kuis_id} popoverClose title="Statistik" />
                                            </List>
                                        </Popover>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
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
      getSesiKuis: Actions.getSesiKuis,
      setSesiKuis: Actions.setSesiKuis,
      hapusSesiKuis: Actions.hapusSesiKuis
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

export default (connect(mapStateToProps, mapDispatchToProps)(RiwayatSesiKuis));
  