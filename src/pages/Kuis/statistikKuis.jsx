import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class statistikKuis extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            sesi_kuis_id: this.$f7route.params['sesi_kuis_id'],
            tampilkan_stat: 'Y'
        },
        loading:true,
        kuis: {
            kuis_id: '',
            nama: '-',
            pertanyaan_kuis: []
        },
        listPertanyaan: [],
        tampilkan_jawaban_benar: false,
        sesi_kuis: {}
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

        this.props.getSesiKuis(this.state.routeParams).then((result)=>{
            this.setState({
                sesi_kuis: this.props.sesi_kuis.rows[0],
                routeParams: {
                    ...this.state.routeParams,
                    kuis_id: this.props.sesi_kuis.rows[0].kuis_id
                }
            },()=>{

                this.props.getKuis(this.state.routeParams).then((result)=>{
                    this.setState({
                        ...this.state,
                        kuis: this.props.kuis.rows[0]
                    },()=>{
                        console.log(this.state);
        
                        let listPertanyaan = [];
        
                        for (const key in this.state.kuis.pertanyaan_kuis) {
                            if (this.state.kuis.pertanyaan_kuis.hasOwnProperty(key)) {
                                const element = this.state.kuis.pertanyaan_kuis[key];
        
                                let listPilihan = [];
        
                                for (const key_pilihan in element.pilihan_pertanyaan_kuis) {
                                    const element_pilihan = element.pilihan_pertanyaan_kuis[key_pilihan];
        
                                    listPilihan = [
                                        ...listPilihan,
                                        element_pilihan
                                    ];
                                }
        
                                element['listPilihan'] = listPilihan;
                                
                                listPertanyaan = [
                                    ...listPertanyaan,
                                    element
                                ];
        
                                // sekuen_pertanyaan++;
                            }
                        }
        
                        // console.log(listPertanyaan);
        
                        this.setState({
                            listPertanyaan: listPertanyaan
                        },()=>{
                            // console.log(this.state.listPertanyaan);

                            this.props.getStatKuis(this.state.routeParams).then((result)=>{
                                this.setState({
                                    loading: false
                                });
                            });
                        });
                    });
                });

            });
        })
        

    }

    tampilkanJawabanBenar = () => {
        this.setState({
            tampilkan_jawaban_benar: !this.state.tampilkan_jawaban_benar
        });
    }


    render()
    {
        let tanggal = '';
        // let tgl = new Date(this.state.kuis.create_date);

        tanggal = moment(this.state.kuis.create_date).format('D') + ' ' + this.bulan[(moment(this.state.kuis.create_date).format('M')-1)] + ' ' + moment(this.state.kuis.create_date).format('YYYY');

        return (
            <Page name="statistikKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.kuis.judul}</NavTitle>
                    {/* <NavTitleLarge style={{fontSize:'3vh'}}>
                        <span style={{fontSize:'3vh'}}>{this.state.kuis.judul}</span>
                    </NavTitleLarge> */}
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <Card>
                            <CardContent>
                                <Row>
                                    <Col width="100">
                                        <div style={{fontSize:'25px', fontWeight:'bold', color:'#434343'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                            {this.state.kuis.judul}
                                        </div>
                                        <div style={{fontSize:'15px', fontWeight:'normal', color:'#434343'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                            {this.state.kuis.keterangan}
                                        </div>
                                        <br/>
                                    </Col>
                                    <Col width="60" tabletWidth="50" className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                        <div style={{fontSize:'12px', fontWeight:'normal', color:'#434343'}}>
                                            <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>clock</i>&nbsp; Sesi <b>{this.state.sesi_kuis.keterangan}</b>
                                        </div>
                                        <div style={{fontSize:'12px', fontWeight:'normal', color:'#434343'}}>
                                            <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>play_fill</i>&nbsp;Jumlah Peserta: <b>{0}</b>
                                        </div>
                                    </Col>
                                    <Col width="40" tabletWidth="50" style={{fontSize:'12px'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_alt_circle</i>&nbsp;Oleh <b>{this.state.kuis.pengguna}</b>
                                        <br/>
                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>calendar</i>&nbsp;Tanggal <b>{tanggal}</b>
                                    </Col>
                                </Row>
                                {/* isinya detail kuis */}
                            </CardContent>
                        </Card>
                        <Row noGap>
                            <Col width="100" tabletWidth="100" desktopWidth="100">
                                <Card>
                                    <CardContent>
                                        Skor Rata-rata<br/>
                                        <div style={{fontSize:'40px', fontWeight:'bold'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                            {this.props.stat_kuis.rata && parseFloat(this.props.stat_kuis.rata).toFixed(2)}
                                            {!this.props.stat_kuis.rata && <>-&nbsp;&nbsp;</>}
                                        </div>
                                        dari {this.props.stat_kuis.total_peserta} peserta
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="50" desktopWidth="50">
                                <Card>
                                    <CardContent>
                                        Skor Tertinggi<br/>
                                        <div style={{fontSize:'40px', fontWeight:'bold'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                            {this.props.stat_kuis.maksimal && parseFloat(this.props.stat_kuis.maksimal).toFixed(2)}
                                            {!this.props.stat_kuis.maksimal && <>-&nbsp;&nbsp;</>}
                                        </div>
                                        {this.props.stat_kuis.peserta_tertinggi_nama}
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="50" desktopWidth="50">
                                <Card>
                                    <CardContent>
                                        Skor Terendah<br/>
                                        <div style={{fontSize:'40px', fontWeight:'bold'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                            {this.props.stat_kuis.minimal && parseFloat(this.props.stat_kuis.minimal).toFixed(2)}
                                            {!this.props.stat_kuis.minimal && <>-&nbsp;&nbsp;</>}
                                        </div>
                                        {this.props.stat_kuis.peserta_terendah_nama}
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
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
      getStatKuis: Actions.getStatKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis,
        stat_kuis: Kuis.stat_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(statistikKuis));
  