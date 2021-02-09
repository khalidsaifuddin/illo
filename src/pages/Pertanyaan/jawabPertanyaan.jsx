import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link
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

class jawabPertanyaan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pertanyaan_id: this.$f7route.params['pertanyaan_id']
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        loadingPertanyaan: true
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
        // console.log(this.state.routeParams.pertanyaan_id);
        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                loadingPertanyaan: false
            })
        });
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

    jawabPertanyaan = () => {
        // alert('oke');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                publikasi: 1
            }
        },()=>{
            this.props.simpanJawaban(this.state.routeParams).then((result)=>{
                //after simpan
                this.setState({
                    ...this.state,
                    routeParamsPertanyaan:{
                        pertanyaan_id: this.state.routeParams.pertanyaan_id
                    }
                },()=>{
                    this.props.getPertanyaan(this.state.routeParamsPertanyaan).then((result)=>{
                        let obj = result.payload.rows[0];

                        this.setState({
                            routeParamsNotifikasi: {
                                pengguna_id: obj.pengguna_id,
                                pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                judul: JSON.parse(localStorage.getItem('user')).nama + ' menjawab pertanyaan Anda "'+ obj.judul +'"',
                                jenis_notifikasi_id: 2,
                                pertanyaan_id: obj.pertanyaan_id,
                                tautan: '/tampilPertanyaan/'+obj.pertanyaan_id
                            }
                        },()=>{
                            this.props.simpanNotifikasi(this.state.routeParamsNotifikasi);
                        });
                    });
                });


                this.$f7router.navigate('/tampilPertanyaan/'+this.state.routeParams.pertanyaan_id);
            });
        });

    }

    simpanDraft = () => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                publikasi: 0
            }
        },()=>{
            this.props.simpanJawaban(this.state.routeParams).then((result)=>{
                //after simpan
                this.$f7router.navigate('/tampilPertanyaan/'+this.state.routeParams.pertanyaan_id);
            });
        });
    }

    render()
    {
        return (
            <Page name="jawabPertanyaan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Jawab Diskusi</NavTitle>
                    {/* <NavTitleLarge>
                        Jawab Pertanyaan
                    </NavTitleLarge> */}
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

                                    tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                    // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

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
                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                    <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                    <div style={{marginTop:'-8px', maxHeight:'200px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                        <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                                                        <p className="read-more" style={{textAlign:'center'}}>
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <b>Jawab sebagai {JSON.parse(localStorage.getItem('user')).nama}</b>
                                                </CardHeader>
                                                <CardContent>
                                                    {/* <SunEditor 
                                                        onChange={this.editorChange}
                                                        setOptions={{
                                                            height: 500,
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
                                                                ],
                                                                '/' // Line break
                                                                [
                                                                    'fontColor', 
                                                                    'hiliteColor', 
                                                                    'outdent', 
                                                                    'indent', 
                                                                    'align', 
                                                                    'horizontalRule', 
                                                                    'list', 
                                                                    'table'
                                                                ],
                                                                [
                                                                    'link', 
                                                                    'image', 
                                                                    'video', 
                                                                    // 'fullScreen', 
                                                                    'showBlocks', 
                                                                    // 'codeView', 
                                                                    // 'preview', 
                                                                    // 'print', 
                                                                    // 'save'
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
                                                    <Block strong style={{marginTop:'8px'}}>
                                                        <Row>
                                                            <Col width="100" tabletWidth="50" style={{padding:'4px'}}>
                                                                <Button raised fill onClick={this.simpanDraft} style={{backgroundColor:'#ccc', color:'#434343'}}><i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;Simpan Sebagai Draft</Button>
                                                            </Col>
                                                            <Col width="100" tabletWidth="50" style={{padding:'4px'}}>
                                                                <Button raised fill onClick={this.jawabPertanyaan} style={{marginBottom:'8px', backgroundColor:'green'}}><i className="f7-icons" style={{fontSize:'20px', marginBottom:'8px'}}>paperplane_fill</i>&nbsp;Publikasi Jawaban</Button>
                                                            </Col>
                                                        </Row>
                                                        </Block>
                                                </CardContent>
                                            </Card>
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
      simpanJawaban: Actions.simpanJawaban,
      simpanNotifikasi: Actions.simpanNotifikasi
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(jawabPertanyaan));
  