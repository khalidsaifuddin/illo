import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, CardHeader, Row, Col, AccordionContent, List, ListItem, BlockTitle, Link, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


import moment from 'moment';
import tambahKuis from './tambahKuis';

class hasilAkhirKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            sesi_kuis_id: this.$f7route.params['sesi_kuis_id'] ? this.$f7route.params['sesi_kuis_id'] : localStorage.getItem('sesi_kuis_id')
        },
        loading:true,
        kuis: {
            kuis_id: '',
            nama: '-'
        },
        pengguna_kuis: {
            kuis_id: '',
            pengguna_id: '',
            create_date: '2000-01-02 00:00:00'
        },
        jawaban_pengguna_kuis: {
            rows: [],
            total: 0
        },
        bagian_kuis: {
            rows: [],
            total: 0
        },
        pengguna: {
            rows: [],
            total: 0
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
        this.props.getPenggunaKuis(this.state.routeParams).then(()=>{
            this.setState({
                ...this.state,
                routeParams: {
                    ...this.state.routeParams,
                    pengguna_id: null
                }
            },()=>{
                this.props.getKuis(this.state.routeParams).then(()=>{
                    this.setState({
                        ...this.state,
                        pengguna_kuis: this.props.pengguna_kuis.rows[0],
                        kuis: this.props.kuis.rows[0]
                    },()=>{
                        // console.log(this.state);
                        this.props.getAspek(this.state.routeParams).then((result)=>{
                            this.setState({
                                bagian_kuis: result.payload
                            },()=>{

                                this.props.getJawabanPenggunaKuis({...this.state.routeParams, pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
                                    this.setState({
                                        jawaban_pengguna_kuis: this.props.jawaban_pengguna_kuis
                                    },()=>{
                                        this.props.getPengguna(this.state.routeParams).then((result)=>{
                                            this.setState({
                                                pengguna: result.payload.rows[0]
                                            })
                                        })
                                    })
                                })

                            })
                        })

                    })
                });
            })
        });

    }

    unduhexcel = (pengguna_id, sesi_kuis_id, kuis_id) => {
        // http://mejabantu:8888/api/Kuis/getHasilKuisPenggunaExcel?kuis_id= 3313b42a-a521-4c22-8fa4-2f70aed6f36b&pengguna_id= dfd3af3e-dda5-49a3-8427-c8b33bca0d5f&sesi_kuis_id= 182af368-5205-44d5-a78e-020a88707003

        window.open(localStorage.getItem('api_base')+'/api/Kuis/getHasilKuisPenggunaExcel?kuis_id='+kuis_id+'&pengguna_id='+pengguna_id+'&sesi_kuis_id='+sesi_kuis_id)
    }


    render()
    {
        let tanggal = '';

        tanggal = moment(this.state.pengguna_kuis.create_date).format('D') + ' ' + this.bulan[(moment(this.state.pengguna_kuis.create_date).format('M')-1)] + ' ' + moment(this.state.pengguna_kuis.create_date).format('YYYY');

        return (
            <Page name="hasilAkhirKuis" hideBarsOnScroll style={{paddingBottom:'40px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Hasil Akhir Kuis</NavTitle>
                </Navbar>
                <Row>
                <Col width="0" tabletWidth="15"></Col>
                <Col width="100" tabletWidth="70">
                    <Card>
                        <CardContent style={{textAlign:'center'}}>
                            <b style={{fontSize:'20px'}}>{this.state.kuis.judul}</b>
                        </CardContent>
                        <CardContent>
                            <Row style={{marginBottom:'8px', border:'3px dashed #ccc', padding:'8px', borderRadius:'20px'}}>
                                <Col width="15" tabletWidth="10">
                                    <img src={this.state.pengguna.gambar} style={{height:'55px', width:'55px', borderRadius:'50%', marginRight:'0px', border:'1px solid #eee', marginBottom:'-8px'}} />
                                </Col>
                                <Col width="85" tabletWidth="90" style={{paddingLeft:'8px'}}>
                                    <b><Link href={"/tampilPengguna/"+this.state.pengguna.pengguna_id}>{this.state.pengguna.nama}</Link></b>
                                    <br/>{this.state.pengguna.username}
                                </Col>
                                {/* <Col width="40" tabletWidth="40" style={{textAlign:'right', paddingRight:'40px'}}>
                                    &nbsp;
                                </Col> */}
                            </Row>

                            {/* <Row style={{borderBottom:'2px solid #434343', marginBottom:'20px'}}>
                                <Col width={100}>
                                    oleh {this.state.pengguna_kuis.nama_pengguna}<br/>
                                    dikerjakan pada tanggal {tanggal}
                                </Col>
                            </Row> */}

                            {parseInt(this.state.kuis.jenis_kuis_id) !== 2 &&
                            <>
                            {/* <Row style={{borderBottom:'2px solid #434343'}}>
                                <Col width={80}>
                                    Jumlah Pertanyaan
                                </Col>
                                <Col width={20} style={{textAlign:'right', fontWeight:'bold'}}>
                                    {this.state.pengguna_kuis.total}
                                </Col>
                            </Row>
                            <Row style={{borderBottom:'2px solid #434343'}}>
                                <Col width={80}>
                                    Jawaban Benar
                                </Col>
                                <Col width={20} style={{textAlign:'right', fontWeight:'bold'}}>
                                    {this.state.pengguna_kuis.benar}
                                </Col>
                            </Row>
                            <Row style={{borderBottom:'2px solid #434343'}}>
                                <Col width={80}>
                                    Jawaban Salah
                                </Col>
                                <Col width={20} style={{textAlign:'right', fontWeight:'bold'}}>
                                    {this.state.pengguna_kuis.salah}
                                </Col>
                            </Row> */}
                            <Row style={{border:'3px dashed #ccc', padding:'8px', borderRadius:'20px'}}>
                                <Col width={100} style={{textAlign:'center', fontWeight:'bold', paddingTop:'20px'}}>
                                    <Row>
                                        <Col width="100">
                                            <Card style={{margin:'4px'}}>
                                                <CardContent>
                                                    <Row>
                                                        <Col width="50" tabletWidth="60">
                                                            <img src="./static/icons/winner.png" style={{width:'80%'}} />
                                                        </Col>
                                                        <Col width="50" tabletWidth="40">
                                                            Skor Akhir
                                                            <h1 style={{marginBottom:'0px', marginTop:'0px', fontSize:'50px', fontWeight:'bold', color:'#E040FB'}}>
                                                                {parseFloat(this.state.pengguna_kuis.skor).toFixed(1)}
                                                            </h1>
                                                            /100
                                                        </Col>
                                                    </Row>
                                                </CardContent>
                                            </Card>
                                        </Col>
                                        {/* <Col width="50">
                                            <Card style={{margin:'4px'}}>
                                                <CardContent>
                                                    Peringkat
                                                    <h1 style={{marginBottom:'0px', marginTop:'0px', fontSize:'40px', fontWeight:'bold', color:'#3198ed'}}>
                                                        {this.state.pengguna_kuis.peringkat}/{this.state.pengguna_kuis.total_peserta}
                                                        <br/>
                                                    </h1>
                                                    peserta
                                                </CardContent>
                                            </Card>
                                        </Col> */}
                                    </Row>
                                </Col>
                                <Col width={100} style={{textAlign:'center', fontWeight:'normal', paddingTop:'20px'}}>
                                    <Progressbar color="green" style={{borderRadius:'10px', height:'20px',background:'#D50000', marginBottom:'8px'}} progress={parseInt(this.state.pengguna_kuis.skor)} id="demo-inline-progressbar"> 
                                    </Progressbar>
                                    Benar: <b>{this.state.pengguna_kuis.benar}</b> | Salah: <b>{this.state.pengguna_kuis.salah}</b> | Total: <b>{this.state.pengguna_kuis.total}</b>
                                </Col>
                                <Col width="100">
                                    <Card style={{margin:'4px', textAlign:'center'}}>
                                        <CardContent>
                                            <i className="f7-icons iconBg" style={{fontSize:'100px'}}>flame</i>
                                            Peringkat
                                            <h1 style={{marginBottom:'0px', marginTop:'0px', fontSize:'40px', fontWeight:'bold', color:'#3198ed'}}>
                                                {this.state.pengguna_kuis.peringkat}/{this.state.pengguna_kuis.total_peserta}
                                                <br/>
                                            </h1>
                                            peserta
                                        </CardContent>
                                    </Card>
                                </Col>
                                <Col width="50">
                                    <Card style={{margin:'4px', textAlign:'center'}}>
                                        <CardContent style={{minHeight:'95px'}}>
                                            <i className="f7-icons iconBg" style={{fontSize:'100px'}}>clock</i>
                                            Durasi Total Pengerjaan
                                            <h1 style={{marginBottom:'0px', marginTop:'0px', fontSize:'40px', fontWeight:'bold', color:'#3198ed'}}>
                                                {(this.state.pengguna_kuis.durasi ? (Math.floor(parseInt(this.state.pengguna_kuis.durasi)/60) < 1 ? '0' : Math.floor(parseInt(this.state.pengguna_kuis.durasi)/60)) : '0')}:{(this.state.pengguna_kuis.durasi ? (Math.floor(parseInt(this.state.pengguna_kuis.durasi)%60) < 1 ? '0' : Math.floor(parseInt(this.state.pengguna_kuis.durasi)%60)) : '0')}
                                                <br/>
                                            </h1>
                                            <br/>
                                            {/* peserta */}
                                        </CardContent>
                                    </Card>
                                </Col>
                                <Col width="50">
                                    <Card style={{margin:'4px', textAlign:'center', minHeight:'95px'}}>
                                        <CardContent>
                                            <i className="f7-icons iconBg" style={{fontSize:'100px'}}>clock</i>
                                            <span style={{fontSize:'12px'}}>Rata-rata durasi per pertanyaan</span>
                                            <h1 style={{marginBottom:'0px', marginTop:'0px', fontSize:'40px', fontWeight:'bold', color:'#3198ed'}}>
                                                {parseFloat(parseFloat(this.state.pengguna_kuis.durasi)/this.state.pengguna_kuis.total).toFixed(1)}
                                                <br/>
                                            </h1>
                                            detik
                                            {/* peserta */}
                                        </CardContent>
                                    </Card>
                                </Col>
                            </Row>
                            </>
                            }
                        </CardContent>
                    </Card>
                    {/* {parseInt(this.state.kuis.jenis_kuis_id) !== 2 &&
                    <Card>
                        <CardContent style={{textAlign:'center'}}>
                            Peringkat<br/>
                            <h1 style={{fontSize:'40px', color:'#8BC34A'}}>{this.state.pengguna_kuis.peringkat}</h1>
                            dari {this.state.pengguna_kuis.total_peserta} peserta
                        </CardContent>
                    </Card>
                    } */}
                    <BlockTitle>Hasil {parseInt(this.state.kuis.jenis_kuis_id) === 1 ? 'Pengerjaan' : 'Pengisian'}</BlockTitle>
                    <Card>
                        <CardContent>
                            <Button onClick={()=>this.unduhexcel(this.state.pengguna_kuis.pengguna_id, this.state.pengguna_kuis.sesi_kuis_id, this.state.pengguna_kuis.kuis_id)}>
                                <i className="icons f7-icons" style={{fontSize:'20px'}}>cloud_download_fill</i>&nbsp;
                                Unduh Excel
                            </Button>
                            <br/>
                            <List accordionList>
                                {this.state.bagian_kuis.rows.map((optionBagian)=>{
                                    return (
                                        <ListItem accordionItem title={optionBagian.nama}>
                                            <AccordionContent>        
                                                <Card className="cardPertanyaan">
                                                    <CardContent style={{padding:'8px'}}>
                                                        {/* {optionBagian.nama} */}
                                                        {this.state.jawaban_pengguna_kuis.rows.map((option)=>{
                                                            return (
                                                                <>
                                                                {option.bagian_kuis_id === optionBagian.bagian_kuis_id &&
                                                                <Card className="cardPertanyaan" style={{padding:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <div dangerouslySetInnerHTML={{ __html: option.teks }} />
                                                                        <div>
                                                                            {option.jawaban.rows.map((optionJawaban)=>{
                                                                                return (
                                                                                    <div className="jawabanHasilAkhir" style={{textDecoration:(optionJawaban.isian ? 'underline' : 'none')}}>
                                                                                    {optionJawaban.isian ? <></> : <><i className="icons f7-icons" style={{fontSize:'20px', color:'green'}}>checkmark_alt_circle</i>&nbsp;</>}
                                                                                    {optionJawaban.isian ? optionJawaban.isian : optionJawaban.pilihan_pertanyaan_kuis}
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                                }
                                                                </>
                                                            )
                                                        })}
                                                    </CardContent>
                                                </Card>
                                            </AccordionContent>
                                        </ListItem>
                                    )
                                })}
                            </List>
                            {this.state.jawaban_pengguna_kuis.rows.map((option)=>{
                                return (
                                    <>
                                    {!option.bagian_kuis_id &&
                                    <Card className="cardPertanyaan" style={{padding:'0px'}}>
                                        <CardContent style={{padding:'8px'}}>
                                            {/* {option.teks} */}
                                            <div dangerouslySetInnerHTML={{ __html: option.teks }} />
                                            <div>
                                                {option.jawaban.rows.map((optionJawaban)=>{
                                                    return (
                                                        <div className="jawabanHasilAkhir" style={{textDecoration:(optionJawaban.isian ? 'underline' : 'none')}}>
                                                        {optionJawaban.isian ? 
                                                        <></> 
                                                        : 
                                                        <>
                                                        {parseInt(this.state.kuis.jenis_kuis_id) === 2 &&
                                                        <>
                                                            <i className="icons f7-icons" style={{fontSize:'20px', color:'green'}}>checkmark_alt_circle</i>&nbsp;
                                                        </>
                                                        }
                                                        {parseInt(this.state.kuis.jenis_kuis_id) !== 2 &&
                                                        <>
                                                            {parseInt(optionJawaban.benar) === 1 ?
                                                            <>
                                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'green'}}>checkmark_alt_circle</i>&nbsp;
                                                            </>
                                                            :
                                                            <>
                                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'red'}}>multiply_circle</i>&nbsp;
                                                            </>
                                                            }
                                                        </>
                                                        }
                                                        </>
                                                        }
                                                        {optionJawaban.isian ? optionJawaban.isian : optionJawaban.pilihan_pertanyaan_kuis}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    }
                                    </>
                                )
                            })}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Button className="color-theme-teal bawahCiriHijau" raised fill large onClick={()=>this.$f7router.navigate('/kuis/'+this.state.routeParams.pengguna_id)}>
                                Selesai dan Tutup
                            </Button>
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
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getPengguna: Actions.getPengguna,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getJawabanPenggunaKuis: Actions.getJawabanPenggunaKuis,
      getAspek: Actions.getAspek
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        jawaban_pengguna_kuis: Kuis.jawaban_pengguna_kuis,
        aspek: Kuis.aspek
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(hasilAkhirKuis));
  