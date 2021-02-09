import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

import ReactAudioPlayer from 'react-audio-player';
import YouTube from 'react-youtube';

class tampilKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            tampilkan_stat: 'Y'
        },
        loading:true,
        kuis: {
            kuis_id: '',
            nama: '-',
            pertanyaan_kuis: []
        },
        listPertanyaan: [],
        tampilkan_jawaban_benar: false
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
                    console.log(this.state.listPertanyaan);
                });
            });
        });

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
            <Page name="tampilKuis" hideBarsOnScroll>
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
                                        <div style={{fontSize:'25px', fontWeight:'bold', color:'#434343'}}>
                                            {this.state.kuis.judul}
                                        </div>
                                        <div style={{fontSize:'15px', fontWeight:'normal', color:'#434343'}}>
                                            {this.state.kuis.keterangan}
                                        </div>
                                        <br/>
                                    </Col>
                                    <Col width="60" tabletWidth="70">
                                        <div style={{fontSize:'12px', fontWeight:'normal', color:'#434343'}}>
                                            <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>clock</i>&nbsp;<b>{this.state.kuis.total_sesi}</b> sesi berjalan
                                        </div>
                                        <div style={{fontSize:'12px', fontWeight:'normal', color:'#434343'}}>
                                            <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>play_fill</i>&nbsp;telah diikuti <b>{this.state.kuis.total_pemain}</b> kali
                                        </div>
                                    </Col>
                                    <Col width="40" tabletWidth="30" style={{fontSize:'12px'}}>
                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_alt_circle</i>&nbsp;Oleh <b>{this.state.kuis.pengguna}</b>
                                        <br/>
                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>calendar</i>&nbsp;Tanggal <b>{tanggal}</b>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        <br/>
                                        <Row style={{justifyContent:'flex-start'}}>
                                            <Col width="35" style={{padding:'8px'}}>
                                                <Button raised fill onClick={()=>this.$f7router.navigate("/praTampilKuis/"+this.state.kuis.kode_sesi)}>
                                                    <i className="f7-icons" style={{fontSize:'25px', color:'#ffffff'}}>gamecontroller_alt_fill</i>&nbsp;
                                                    Ikuti
                                                </Button>
                                            </Col>
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id === this.state.kuis.pengguna_id &&
                                            <Col width="35" style={{padding:'8px'}}>
                                                <Button raised fill onClick={()=>this.$f7router.navigate("/buatSesiKuis/"+this.state.kuis.kuis_id)}>
                                                    <i className="f7-icons" style={{fontSize:'25px', color:'#ffffff'}}>pencil_circle</i>&nbsp;
                                                    Buat Sesi
                                                </Button>
                                            </Col>
                                            }
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.kuis.pengguna_id && parseInt(this.state.kuis.a_boleh_assign) === 1 &&
                                            <Col width="35" style={{padding:'8px'}}>
                                                <Button raised fill onClick={()=>this.$f7router.navigate("/buatSesiKuis/"+this.state.kuis.kuis_id+"/kuis_orang_lain")}>
                                                    <i className="f7-icons" style={{fontSize:'25px', color:'#ffffff'}}>pencil_circle</i>&nbsp;
                                                    Buat Sesi
                                                </Button>
                                            </Col>
                                            }
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id === this.state.kuis.pengguna_id &&
                                            <Col width="30" style={{padding:'8px'}}>
                                                <Button raised fill onClick={()=>this.$f7router.navigate("/tambahKuis/"+this.state.kuis.pengguna_id+'/'+this.state.kuis.kuis_id)}>
                                                    <i className="f7-icons" style={{fontSize:'25px', color:'#ffffff'}}>pencil</i>&nbsp;
                                                    Edit
                                                </Button>
                                            </Col>
                                            }
                                            <Col width="100" style={{padding:'8px'}} onClick={this.tampilkanJawabanBenar}>
                                                <Button raised fill style={{background:'#cccccc', color:'#434343'}}>
                                                    <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>checkmark_alt_circle</i>&nbsp;{this.state.tampilkan_jawaban_benar ? 'Sembunyikan' : 'Tampilkan'} Jawaban Benar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* isinya detail kuis */}
                            </CardContent>
                        </Card>

                        <BlockTitle>Pertanyaan</BlockTitle>
                        {/* {this.state.kuis.pertanyaan_kuis} */}
                        {this.state.listPertanyaan.map((option)=>{
                            return (
                                <Card style={{background:'url('+localStorage.getItem('api_base')+'/assets/img/paper_fibers.png)'}}>
                                    <CardContent className="tampilPertanyaanKuis">
                                        {/* <b style={{fontSize:'15px', color:'#434343'}}>pertanyaan 1</b> */}
                                        {/* <Card>
                                            <CardContent> */}
                                                {(this.state.listPertanyaan.indexOf(option)+1)}.<br/>
                                                <div dangerouslySetInnerHTML={{ __html: option.teks }} />
                                                {option.file_audio &&
                                                <ReactAudioPlayer
                                                    src={option.file_audio}
                                                    autoPlay={false}
                                                    controls
                                                    style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                                />
                                                }
                                                {option.file_video &&
                                                <>
                                                <YouTube
                                                    videoId={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                                    id={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                                />
                                                <br/>
                                                </>
                                                }
                                            {/* </CardContent>
                                        </Card> */}
                                        <Row>
                                        {option.listPilihan.map((optionPilihan)=>{
                                            return (
                                                <Col width="50">
                                                    {!this.state.tampilkan_jawaban_benar &&
                                                    <>
                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>circle</i>&nbsp;
                                                        {optionPilihan.teks}
                                                    </>
                                                    }
                                                    {this.state.tampilkan_jawaban_benar &&
                                                    <>
                                                        {parseInt(optionPilihan.jawaban_benar) === 1 &&
                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#66bb6a'}}>circle_fill</i>
                                                        }
                                                        {parseInt(optionPilihan.jawaban_benar) !== 1 &&
                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#f57f17'}}>circle_fill</i>
                                                        }
                                                        &nbsp;{optionPilihan.teks}
                                                    </>
                                                    }
                                                </Col>
                                            )
                                        })}
                                        </Row>
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
      simpanPenggunaKuis: Actions.simpanPenggunaKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilKuis));
  