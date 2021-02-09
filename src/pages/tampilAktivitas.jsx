import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../store/actions'; 

import moment from 'moment';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

class tampilAktivitas extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            pertanyaan_id: this.$f7route.params['pertanyaan_id'] ? this.$f7route.params['pertanyaan_id'] : null,
            jenis_pertanyaan_aktivitas_id: 1,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 20,
            konten: ''
        },
        pertanyaan_sekolah: {
            total: 0,
            rows: []
        },
        routeParamsJawaban: {},
        komentar: {}
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        this.props.getPertanyaan({...this.state.routeParams, pengguna_id: null}).then((result)=>{
            this.setState({
                ...this.state,
                pertanyaan_sekolah: result.payload
            },()=>{

                this.state.pertanyaan_sekolah.rows.map((optionss)=>{

                    this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                        this.setState({
                            ...this.state,
                            komentar: {
                                ...this.state.komentar,
                                [optionss.pertanyaan_id]: resultss.payload
                            }
                        },()=>{
                            console.log(this.state.komentar)
                        })
                    })  

                })
            })
        })

    }

    editorChange = (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                konten: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    komentarChange = (pertanyaan_id) => (e) => {
        // alert(pertanyaan_id)

        this.setState({
            routeParamsJawaban: {
                ...this.state.routeParamsJawaban,
                [pertanyaan_id]: {
                    ...this.state.routeParamsJawaban[pertanyaan_id],
                    konten: e
                }
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    simpanKomentar = (pertanyaan_id) => {
        this.setState({
            routeParamsJawaban: {
                ...this.state.routeParamsJawaban,
                [pertanyaan_id]: {
                    ...this.state.routeParamsJawaban[pertanyaan_id],
                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                    pertanyaan_id: pertanyaan_id,
                    publikasi: 1
                }
            }
        },()=>{

            // console.log(this.state.routeParamsJawaban[pertanyaan_id]);
            // return true;

            this.props.simpanJawaban(this.state.routeParamsJawaban[pertanyaan_id]).then((result)=>{
                this.setState({
                    routeParamsJawaban: {
                        [pertanyaan_id]: {  
                            ...this.state.routeParamsJawaban[pertanyaan_id],
                            konten: null
                        }
                    }
                },()=>{
                    this.props.getJawaban({pertanyaan_id: pertanyaan_id}).then((resultss)=>{
                        this.setState({
                            ...this.state,
                            komentar: {
                                ...this.state.komentar,
                                [pertanyaan_id]: resultss.payload
                            }
                        },()=>{
                            // console.log(this.state.komentar)

                            this.props.simpanNotifikasiKomentar({...this.state.routeParams, pertanyaan_id: pertanyaan_id})
                        })
                    })
                })
            });

        });
    }

    hapusKomentar = (jawaban_id, pertanyaan_id) => {
        // alert(jawaban_id)
        this.$f7.dialog.confirm('Apakah Anda ingin menghapus komentar ini?', 'Konfirmasi', ()=>{
            
            this.props.hapusJawaban({jawaban_id: jawaban_id}).then((result)=>{
                
                this.props.getJawaban({pertanyaan_id: pertanyaan_id}).then((resultss)=>{
                    this.setState({
                        ...this.state,
                        komentar: {
                            ...this.state.komentar,
                            [pertanyaan_id]: resultss.payload
                        }
                    },()=>{
                        console.log(this.state.komentar)
                    })
                })
                
            });

        })
    }

    render()
    {
        return (
            <Page name="tampilAktivitas" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Aktivitas</NavTitle>
                    {/* <NavTitleLarge>
                        Aktivitas   
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <Card>
                            <CardContent style={{padding:'8px', paddingTop:'16px', paddingBottom:'16px'}}>
                                {this.state.pertanyaan_sekolah.result < 1 &&
                                <div style={{width:'100%', textAlign:'center', fontWeight:'bold'}}>
                                    <img src="./static/icons/183.jpg" style={{width:'100%'}} />
                                    <br/>
                                    Aktivitas ini tidak tersedia atau telah dihapus oleh pemiliknya :(
                                    <br/>
                                    <Link href="/">
                                        Kembali ke beranda
                                    </Link>
                                </div>     
                                }
                                <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>
                                {this.state.pertanyaan_sekolah.rows.map((option)=>{

                                    let tgl = new Date(option.create_date);
                                    let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                    let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
        
                                    return (
                                        <div className="timeline-item" key={option.pertanyaan_id}>
                                            <div className="timeline-item-content card">
                                                {/* <div className="card-header">Card header</div> */}
                                                <div className="card-content card-content-padding" style={{padding:'8px', paddingBottom:'16px'}}>
                                                <Row>
                                                    <Col width="100" tabletWidth="100" style={{textAlign:'left', display:'inline-flex'}}>
                                                        {/* <Link href={"/tampilPengguna/"+(option.pengguna_id)}> */}
                                                            <img src={option.gambar} style={{width:'5vh', height:'5vh', borderRadius:'50%', marginRight:'8px'}} />
                                                            <div style={{fontWeight:'normal', color:'#039be5'}}>
                                                                <Link href={"/tampilPengguna/"+(option.pengguna_id)}><b>{option.nama}</b></Link>{option.nama_ruang && <>&nbsp;di <Link href={"/tampilRuang/"+(option.ruang_id)}><b>{option.nama_ruang}</b></Link></>}{this.props.tipe === 'publik' ? option.nama_sekolah && <>&nbsp;di <Link href={"/sekolah/"+(option.sekolah_id)}><b>{option.nama_sekolah}</b></Link></> : <></>}   
                                                                <br/>
                                                                <Link href={"/aktivitas/"+option.pertanyaan_id}>
                                                                    <div className="hilangDiDesktopLevel2" style={{fontSize:'10px', color:'#434343'}}>{tanggal}, {waktu}</div>
                                                                </Link>
                                                                <div style={{fontSize:'10px', color:'#434343'}}>
                                                                    {option.jabatan_sekolah}
                                                                </div>
                                                            </div>
                                                        {/* </Link> */}
                                                    </Col>
                                                    <Col width="100" tabletWidth="100" className="postingan">
                                                        <div style={{marginTop:'8px'}} dangerouslySetInnerHTML={{ __html: option.konten.replace(/noreferrer/g, 'noreferrer" class="link external"') }} />
                                                    </Col>
                                                    <Col width="100" tabletWidth="100" style={{color:'#aaaaaa', fontSize:'10px', textAlign:'right', marginTop:'4px'}}>
                                                        {this.state.komentar[option.pertanyaan_id] ? this.state.komentar[option.pertanyaan_id].result   +" Komentar" : "Belum ada komentar"}
                                                    </Col>
                                                    <Col width="100" tabletWidth="100">
                                                        <Row style={{marginTop:'8px', borderTop:'1px solid #eeeeee'}}>
                                                            <Col width="10" style={{textAlign:'right'}}>
                                                                <img 
                                                                    src={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).gambar : null} 
                                                                    style={{width:'3vh', borderRadius:'50%', marginRight:'8px', marginTop:'4px', marginLeft:'4px'}} 
                                                                />
                                                            </Col>
                                                            <Col width="70">
                                                                <ReactQuill 
                                                                    className="kolomKomentar"
                                                                    theme="snow" 
                                                                    placeholder="Komentar Anda..."
                                                                    onChange={this.komentarChange(option.pertanyaan_id)} 
                                                                    // modules={null}
                                                                    // formats={this.formats}
                                                                    value={this.state.routeParamsJawaban[option.pertanyaan_id] ? this.state.routeParamsJawaban[option.pertanyaan_id].konten : null}
                                                                    on
                                                                />
                                                            </Col>
                                                            <Col width="20">
                                                                <Button 
                                                                    style={{
                                                                        display:'inline-flex', 
                                                                        marginBottom:'4ox', 
                                                                        marginTop:'4px', 
                                                                        padding:'0px', 
                                                                        paddingRight:'8px', 
                                                                        paddingLeft:'8px'
                                                                    }}
                                                                    onClick={()=>this.simpanKomentar(option.pertanyaan_id)}
                                                                >
                                                                    <i className="icons f7-icons" style={{fontSize:'15px', marginRight:'4px'}}>paperplane_fill</i>
                                                                    Kirim
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col width="100" tabletWidth="100">
                                                        {this.state.komentar[option.pertanyaan_id] &&
                                                        <>
                                                            {this.state.komentar[option.pertanyaan_id].rows.map((optionKomentar)=>{ 
                                                                if(optionKomentar.konten !== null){
                                                                    
                                                                    let tgl = new Date(optionKomentar.create_date);
                                                                    let tanggal = moment(optionKomentar.create_date).format('D') + ' ' + this.bulan[(moment(optionKomentar.create_date).format('M')-1)] + ' ' + moment(optionKomentar.create_date).format('YYYY');
                                                                    let waktu = moment(optionKomentar.create_date).format('H') + ':' + moment(optionKomentar.create_date).format('mm');
                                        
                                                                    return (
                                                                        <Row style={{marginTop:'8px', borderTop:'1px solid #eeeeee'}}>
                                                                            <Col width="10" style={{textAlign:'right'}}>
                                                                                <img 
                                                                                    src={optionKomentar.gambar_pengguna} 
                                                                                    style={{width:'3vh', borderRadius:'50%', marginRight:'8px', marginTop:'4px', marginLeft:'4px'}} 
                                                                                />
                                                                            </Col>
                                                                            <Col width="90">
                                                                                <Row noGap>
                                                                                    <Col width="60">
                                                                                        <div style={{fontWeight:'bold', fontSize:'12px', marginTop:'4px', marginBottom:'-8px'}}>{optionKomentar.pengguna}</div>
                                                                                    </Col>
                                                                                    <Col width="40" style={{fontSize:'10px', textAlign:'right', marginTop:'4px', color:'#aaaaaa'}}>
                                                                                        {tanggal}, {waktu}
                                                                                        <br/>
                                                                                        {optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                                                        <Link onClick={()=>this.hapusKomentar(optionKomentar.jawaban_id, optionKomentar.pertanyaan_id)}>Hapus</Link>
                                                                                        }
                                                                                    </Col>
                                                                                    <Col width="100" style={{marginTop:(optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '-4px' : '8px')}}>
                                                                                        <div style={{marginTop:(optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '-4px' : '0px')}} dangerouslySetInnerHTML={{ __html: optionKomentar.konten }} />
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                        // <>
                                                                        //     <div style={{marginTop:'8px'}} dangerouslySetInnerHTML={{ __html: optionKomentar.konten }} />
                                                                        // </>
                                                                    )

                                                                }
                                                            })}
                                                        </>
                                                        }
                                                    </Col>
                                                </Row>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
                </Row>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPertanyaan: actions.getPertanyaan,
      simpanPertanyaan: actions.simpanPertanyaan,
      simpanPertanyaanSekolah: actions.simpanPertanyaanSekolah,
      getPertanyaanSekolah: actions.getPertanyaanSekolah,
      getPertanyaanRuang: actions.getPertanyaanRuang,
      simpanJawaban: actions.simpanJawaban,
      hapusJawaban: actions.hapusJawaban,
      getJawaban: actions.getJawaban,
      simpanPertanyaanRuang: actions.simpanPertanyaanRuang,
      getPertanyaanPublik: actions.getPertanyaanPublik,
      simpanNotifikasiKomentar: actions.simpanNotifikasiKomentar
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilAktivitas));
  