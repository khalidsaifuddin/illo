import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, BlockTitle, AccordionContent, Icon
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import moment from 'moment';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class tampilPertanyaan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pertanyaan_id: this.$f7route.params['pertanyaan_id'],
            konten: ''
        },
        tampilEditorKomentar:{},
        loadingPertanyaan: true,
        loadingJawaban: true,
        jawaban: {
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

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    componentDidMount = () => {
        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            for (let indexPertanyaan = 0; indexPertanyaan < this.props.pertanyaan.rows.length; indexPertanyaan++) {
                const element = this.props.pertanyaan.rows[indexPertanyaan];

                if(element.jumlah_jawaban > 0){
                    this.setState({
                        routeParamsJawaban: {
                            pertanyaan_id: element.pertanyaan_id,
                            pengguna_id: ( (localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id : null )
                        },
                        loadingPertanyaan: false
                    },()=>{
                        this.props.getJawaban(this.state.routeParamsJawaban).then((result)=>{
                            this.setState({
                                ...this.state,
                                loadingJawaban: false,
                                jawaban: this.props.jawaban
                            })
                        });
                    });
                }else{
                    this.setState({
                        ...this.state,
                        loadingPertanyaan: false,
                        loadingJawaban: false
                    });
                }
                
            }
        });
    }

    klikKomentar = (jawaban_id) => {
        // alert('tes');
        // this.setState({
        //     tampilEditorKomentar: {
        //         ...this.state.tampilEditorKomentar,
        //         [jawaban_id] : 'block'
        //     }
        // });
        this.state.tampilEditorKomentar[jawaban_id] = 'block';
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

    kirimKomentar = (jawaban_id) => {

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                jawaban_id: jawaban_id,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{
            // console.log(this.state.routeParams);
            this.props.simpanKomentar(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        pertanyaan_id: this.$f7route.params['pertanyaan_id']
                    }
                },()=>{
                    this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                        for (let indexPertanyaan = 0; indexPertanyaan < this.props.pertanyaan.rows.length; indexPertanyaan++) {
                            const element = this.props.pertanyaan.rows[indexPertanyaan];

                            this.setState({
                                routeParamsNotifikasi: {
                                    pengguna_id: element.pengguna_id,
                                    pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                    judul: JSON.parse(localStorage.getItem('user')).nama + ' memberikan komentar pada jawaban Anda di pertanyaan "'+ element.judul +'"',
                                    jenis_notifikasi_id: 3,
                                    pertanyaan_id: element.pertanyaan_id,
                                    tautan: '/tampilPertanyaan/'+element.pertanyaan_id
                                }
                            },()=>{
                                this.props.simpanNotifikasi(this.state.routeParamsNotifikasi);
                            });
            
                            if(element.jumlah_jawaban > 0){
                                
                                this.setState({
                                    routeParamsJawaban: {
                                        pertanyaan_id: element.pertanyaan_id,
                                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                                    },
                                    routeParams: {
                                        ...this.state.routeParams,
                                        konten: ''
                                    },
                                    loadingPertanyaan: false
                                },()=>{
                                    this.props.getJawaban(this.state.routeParamsJawaban).then((result)=>{
                                        //
                                        this.setState({
                                            ...this.state,
                                            loadingJawaban: false,
                                            jawaban: this.props.jawaban
                                        },()=>{
                                            
                                        });
                                    });
                                });

                            }else{

                                this.setState({
                                    ...this.state,
                                    loadingPertanyaan: false,
                                    loadingJawaban: false
                                });
                            
                            }
                            
                        }
                    });
                })
            });
        });

    }

    klikSetuju = (jawaban_id) => {
        this.setState({
            routeParamsSetuju: {
                jawaban_id: jawaban_id,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                jenis_dukungan_id: 1
            }
        },()=>{
            this.props.simpanDukungan(this.state.routeParamsSetuju).then((result)=>{

                //notifikasi
                this.setState({
                    ...this.state,
                    routeParamsPertanyaan:{
                        jawaban_id: jawaban_id
                    }
                },()=>{
                    this.props.getJawaban(this.state.routeParamsPertanyaan).then((result)=>{
                        let obj = result.payload.rows[0];

                        this.setState({
                            routeParamsNotifikasi: {
                                pengguna_id: obj.pengguna_id,
                                pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                judul: JSON.parse(localStorage.getItem('user')).nama + ' mendukung jawaban Anda "'+ obj.judul +'"',
                                jenis_notifikasi_id: 5, 
                                pertanyaan_id: obj.pertanyaan_id,
                                tautan: '/tampilPertanyaan/'+obj.pertanyaan_id
                            }
                        },()=>{
                            this.props.simpanNotifikasi(this.state.routeParamsNotifikasi);
                        });
                    });
                });
                //end of notifikasi

                this.props.getJawaban(this.state.routeParamsJawaban).then((result)=>{
                    this.setState({
                        jawaban: this.props.jawaban
                    },()=>{
                        
                    });
                });
            });
        });
    }

    simpanPantauan = (pertanyaan_id) => {
        // alert(pertanyaan_id);
        this.setState({
          routeParamsPantauan: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            pertanyaan_id: pertanyaan_id
          }
        },()=>{
          this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{
    
            this.props.getPertanyaan(this.state.routeParams).then((result)=>{
              this.setState({
                pertanyaan: this.props.pertanyaan,
                notifikasi: this.props.notifikasi,
                loadingPertanyaan: false,
              });
            });
    
          })
        });
    }

    render()
    {
        return (
            <Page name="tampilPertanyaan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Materi & Diskusi</NavTitle>
                    <NavTitleLarge>
                        Materi & Diskusi
                    </NavTitleLarge>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        {this.state.loadingPertanyaan ? 
                        <>
                            <Col width="100">
                                <Card>
                                    <CardHeader>
                                        <b style={{fontSize:'23px'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx</b>
                                    </CardHeader>
                                    <CardContent style={{paddingTop:'8px'}}>
                                        <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}} className="skeleton-text skeleton-effect-blink">
                                            xxxxxxxxxxxxxxxxxxx<br/>
                                            xxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                                            xxxxxxxxxxxxxxxxxxxxxx<br/>
                                            xxxxxxxxxxxxxxx<br/>
                                        </div>
                                        <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                        <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span><br/>
                                        <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span>
                                    </CardContent>
                                    <CardFooter>
                                        <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                                        <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </> 
                        : 
                        <>
                            <Row>
                                {this.props.pertanyaan.rows.map((option)=>{
                                    let tanggal = '';
                                    let tgl = new Date(option.create_date);

                                    // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();
                                    tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                    return (
                                        <Col width="100">
                                            <Card>
                                                
                                                <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                                                    {option.ruang.map((optionRuang)=>{
                                                    return (
                                                        <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                                                        <span>&nbsp;/ {optionRuang.nama}</span>
                                                        </Link>
                                                    )
                                                    })}
                                                </CardHeader>
                                                
                                                <CardHeader>
                                                    <b style={{fontSize:'23px'}}>{option.judul}</b>
                                                </CardHeader>
                                                <CardContent style={{paddingTop:'8px'}}>
                                                    {/* {option.konten} */}
                                                    <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}}>
                                                        <div dangerouslySetInnerHTML={{ __html: (option.konten ? option.konten.replace(/noreferrer/g, 'noreferrer" class="link external') : "<p></p>")}} />
                                                    </div>
                                                    <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dipublikasi tanggal <b>{tanggal}</b></span> | <span style={{fontSize:'10px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                </CardContent>
                                                <CardFooter>
                                                    <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right">&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                                                    {localStorage.getItem('user') !== null && localStorage.getItem('user') !== '' &&
                                                    <>
                                                    <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle" onClick={()=>this.simpanPantauan(option.pertanyaan_id)}>&nbsp; {option.jumlah_pantauan} Pantauan</Link>
                                                    <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle" href={"/jawabPertanyaan/"+option.pertanyaan_id}>&nbsp; Jawab</Link>
                                                    </>
                                                    }
                                                    {localStorage.getItem('user') === null || localStorage.getItem('user') === '' &&
                                                    <Link href="/login">Login untuk jawab</Link>
                                                    }

                                                </CardFooter>
                                            </Card>
                                            <BlockTitle>BALASAN</BlockTitle>
                                            {this.state.jawaban.total < 1 &&
                                            <Block inner>
                                                <span>Belum ada balasan</span>
                                            </Block>
                                            }
                                            {this.state.loadingJawaban ? 
                                            <>
                                                <Col width="100">
                                                    <Card>
                                                        <CardHeader>
                                                            <b style={{fontSize:'23px'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx</b>
                                                        </CardHeader>
                                                        <CardContent style={{paddingTop:'8px'}}>
                                                            <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}} className="skeleton-text skeleton-effect-blink">
                                                                xxxxxxxxxxxxxxxxxxx<br/>
                                                                xxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                                                                xxxxxxxxxxxxxxxxxxxxxx<br/>
                                                                xxxxxxxxxxxxxxx<br/>
                                                            </div>
                                                            <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                            <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span><br/>
                                                            <span style={{fontSize:'12px', color: '#8c8c8c'}} className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxx <b>xxxxxxxxxxx</b></span>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                                                            <Link className="skeleton-text skeleton-effect-blink">xxxxxxxxx</Link>
                                                        </CardFooter>
                                                    </Card>
                                                </Col>
                                            </> 
                                            : 
                                            <>
                                            {this.state.jawaban.rows.map((optionJawaban)=>{
                                                let tanggalJawaban = '';
                                                let tglJawaban = new Date(optionJawaban.create_date);
                        
                                                tanggalJawaban = moment(optionJawaban.create_date).format('D') + ' ' + this.bulan[(moment(optionJawaban.create_date).format('M')-1)] + ' ' + moment(optionJawaban.create_date).format('YYYY');
                                                // tanggalJawaban = tglJawaban.getDate() + ' ' + this.bulan[tglJawaban.getMonth()] + ' ' + tglJawaban.getFullYear();

                                                this.state.tampilEditorKomentar[optionJawaban.jawaban_id] = 'none';

                                                return(
                                                    <Card>
                                                        <CardContent style={{paddingTop:'8px'}}>
                                                            {/* {option.konten} */}
                                                            <Row>
                                                                <Col width="15" tabletWidth="10">
                                                                    <div style={{textAlign:"center"}}>
                                                                        <Link onClick={()=>this.klikSetuju(optionJawaban.jawaban_id)}>
                                                                            <Row style={{marginBottom:'20px'}}>
                                                                                <Col width="100">
                                                                                    <Icon style={{fontSize:'20px'}} f7={optionJawaban.dukungan_pengguna_id ? "hand_thumbsup_fill" : "hand_thumbsup"} />
                                                                                </Col>
                                                                                <Col width="100">
                                                                                    <span style={{fontSize:'12px'}}>{optionJawaban.jumlah_dukungan}<br/>Mendukung {optionJawaban.dukungan_pengguna_id ? "termasuk Anda" : ""}</span>
                                                                                </Col>
                                                                            </Row>
                                                                        </Link>
                                                                        {/* <Link>
                                                                            <Row>
                                                                                <Col width="100">
                                                                                    <Icon style={{fontSize:'20px'}} f7="hand_thumbsdown" />
                                                                                </Col>
                                                                                <Col width="100">
                                                                                    <span style={{fontSize:'12px'}}>0 Tidak Setuju</span>
                                                                                </Col>
                                                                            </Row>
                                                                        </Link> */}
                                                                    </div>
                                                                </Col>
                                                                <Col width="85" tabletWidth="90">
                                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Dibalas pada tanggal <b>{tanggalJawaban}</b></span><br/>
                                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{optionJawaban.pengguna}</b></span>
                                                                    <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                                    <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}}>
                                                                        <div dangerouslySetInnerHTML={{ __html: (optionJawaban.konten ? optionJawaban.konten.replace(/noreferrer/g, 'noreferrer" class="link external"') : "<p></p>") }} />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Link iconIos="f7:bubble_left" iconAurora="f7:bubble_left" iconMd="material:bubble_left">&nbsp;{optionJawaban.jumlah_komentar} Komentar</Link>
                                                            {/* <Link onClick={()=>this.klikKomentar(optionJawaban.jawaban_id)} iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle">&nbsp;Buat Komentar</Link> */}
                                                        </CardFooter>
                                                        <CardContent style={{paddingTop:'8px', fontSize:'12px'}}>
                                                            {localStorage.getItem('user') !== null && localStorage.getItem('user') !== ''  &&
                                                            <Card>
                                                                <CardContent>
                                                                    <List accordionList accordionOpposite>
                                                                        <ListItem accordionItem title="Buat Komentar">
                                                                            <AccordionContent>
                                                                                <Block>
                                                                                    {/* <SunEditor
                                                                                        // setContents={this.state.routeParams.konten}
                                                                                        onChange={this.editorChange}
                                                                                        setOptions={{
                                                                                            height: 70,
                                                                                            buttonList : [
                                                                                                [
                                                                                                    'undo', 
                                                                                                    'redo', 
                                                                                                    'font', 
                                                                                                    'fontSize', 
                                                                                                    'formatBlock'
                                                                                                ],
                                                                                                [
                                                                                                    'bold', 
                                                                                                    'underline', 
                                                                                                    'italic', 
                                                                                                    'strike', 
                                                                                                    'removeFormat'
                                                                                                    // 'subscript', 
                                                                                                    // 'superscript', 
                                                                                                ]
                                                                                            ],
                                                                                        }}
                                                                                    /> */}
                                                                                    <ReactQuill 
                                                                                        theme="snow" 
                                                                                        onChange={this.editorChange} 
                                                                                        modules={this.modules}
                                                                                        formats={this.formats}
                                                                                    />
                                                                                    <Button raised fill onClick={()=>this.kirimKomentar(optionJawaban.jawaban_id)} style={{marginBottom:'8px', backgroundColor:'green', marginTop:'4px', display:'inline-flex'}}>
                                                                                        <i className="f7-icons" style={{fontSize:'20px', marginBottom:'0px'}}>paperplane_fill</i>&nbsp;
                                                                                        Kirim Komentar
                                                                                    </Button>
                                                                                    <br/>
                                                                                </Block>
                                                                            </AccordionContent>
                                                                        </ListItem>
                                                                    </List>
                                                                </CardContent>
                                                            </Card>
                                                            }

                                                            {/* <AccordionContent> */}
                                                            {/* <div style={{display:this.state.tampilEditorKomentar[optionJawaban.jawaban_id]}}> */}
                                                                
                                                            {/* </AccordionContent> */}
                                                            {/* </div> */}
                                                            
                                                            <hr style={{borderTop:'1px solid #eeeeee'}}/>

                                                            {optionJawaban.jumlah_komentar < 1 &&
                                                            <span style={{paddingLeft:'10px'}}>Belum ada komentar</span>
                                                            }

                                                            {optionJawaban.jumlah_komentar > 0 &&
                                                            <>
                                                            {optionJawaban.komentar.rows.map((optionKomentar)=>{
                                                                let tanggalKomentar = '';
                                                                let tglKomentar = new Date(optionKomentar.create_date);
                                        
                                                                // tanggalKomentar = tglKomentar.getDate() + ' ' + this.bulan[tglKomentar.getMonth()] + ' ' + tglKomentar.getFullYear();
                                                                tanggalKomentar = moment(optionKomentar.create_date).format('D') + ' ' + this.bulan[(moment(optionKomentar.create_date).format('M')-1)] + ' ' + moment(optionKomentar.create_date).format('YYYY');

                                                                
                                                                return (
                                                                    <>
                                                                        <Row style={{paddingLeft:'8px', paddingRight:'8px'}}>
                                                                            <Col width="15" tabletWidth="10">
                                                                                <div className="media" style={{margin:'auto', height:'45px', width:'45px', backgroundColor:'#8c8c8c', borderRadius:'50%'}}>
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="85" tabletWidth="90">
                                                                                <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dikomentari pada tanggal <b>{tanggalKomentar}</b></span><br/>
                                                                                <span style={{fontSize:'10px', color: '#8c8c8c'}}>Oleh <b>{optionKomentar.pengguna}</b></span>
                                                                                <div style={{width:'100%', overflowX:'hidden'}}>
                                                                                    <div dangerouslySetInnerHTML={{ __html: (optionKomentar.konten ? optionKomentar.konten.replace(/noreferrer/g, 'noreferrer" class="link external"') : "<p></p>") }} />
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                        <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                                    </>
                                                                )
                                                            })}
                                                            </>
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                            </>
                                            }
                                        </Col>
                                    )
                                })}
                            </Row>
                        </> 
                        }
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
      setLoading: Actions.setLoading,
      getPertanyaan: Actions.getPertanyaan,
      getJawaban: Actions.getJawaban,
      simpanKomentar: Actions.simpanKomentar,
      simpanDukungan: Actions.simpanDukungan,
      simpanNotifikasi: Actions.simpanNotifikasi,
      simpanPantauan: Actions.simpanPantauan
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan,
        jawaban: Pertanyaan.jawaban
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilPertanyaan));
  