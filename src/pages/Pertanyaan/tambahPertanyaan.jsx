import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { relativeTimeThreshold } from 'moment';

class tambahPertanyaan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pertanyaan_id: this.$f7route.params['pertanyaan_id'] ? this.$f7route.params['pertanyaan_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            ruang_id: this.$f7route.params['ruang_id'] ? this.$f7route.params['ruang_id'] : null,
            judul: '',
            topik_pertanyaan_id: '',
            konten: ''
        },
        ruang: {},
        pertanyaan: {}
    }

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

    setStateValue = (key) => (e) => {
        // console.log(key);
        // console.log(e.currentTarget.value);

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        },()=>{
            // console.log(this.state.routeParams);
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

    tambahPertanyaan = () => {
        // alert('oke');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                publikasi: 1
            }
        },()=>{
            this.props.simpanPertanyaan(this.state.routeParams).then((result)=>{
                //after simpan

                if(this.state.routeParams.ruang_id && result.payload.sukses){

                    this.setState({
                        ...this.state,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                            pertanyaan_id: result.payload.pertanyaan_id
                        }
                    },()=>{
                        this.props.simpanPertanyaanRuang(this.state.routeParams).then((result)=>{
                            this.$f7router.navigate('/tampilRuang/'+this.$f7route.params['ruang_id']);
                        });
                    });

                }else{
                    
                    this.$f7router.navigate('/pertanyaanPengguna/'+this.state.routeParams.pengguna_id);

                }


            });
        });

    }

    simpanDraft = () => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                publikasi: 0
            }
        },()=>{
            this.props.simpanPertanyaan(this.state.routeParams).then((result)=>{
                //after simpan
                if(this.state.routeParams.ruang_id && result.payload.sukses){

                    this.setState({
                        ...this.state,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                            pertanyaan_id: result.payload.pertanyaan_id
                        }
                    },()=>{
                        this.props.simpanPertanyaanRuang(this.state.routeParams).then((result)=>{
                            this.$f7router.navigate('/tampilRuang/'+this.$f7route.params['ruang_id']);
                        });
                    });

                }else{
                    
                    this.$f7router.navigate('/pertanyaanPengguna/'+this.state.routeParams.pengguna_id);
                    
                }
            });
        });
    }

    gantiTopik = (b) => {
        // b.target.value
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                topik_pertanyaan_id: b.target.value
            }
        },()=>{
            // console.log(this.state.routeParams);
        })
    }

    componentDidMount = () => {
        if(this.state.routeParams.ruang_id){
            this.props.getRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang: this.props.ruang.rows[0]
                });
            });
        }
        
        if(this.state.routeParams.pertanyaan_id){
            this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                this.setState({
                    pertanyaan: this.props.pertanyaan.rows[0],
                    routeParams: {
                        ...this.state.routeParams,
                        judul: this.props.pertanyaan.rows[0].judul,
                        topik_pertanyaan_id: this.props.pertanyaan.rows[0].topik_pertanyaan_id,
                        konten: this.props.pertanyaan.rows[0].konten
                    }
                });
            });
        }
    }

    render()
    {
        return (
            <Page name="tambahPertanyaan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Diskusi</NavTitle>
                    {/* <NavTitleLarge>
                        Tambah Materi & Diskusi
                    </NavTitleLarge> */}
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        {this.state.routeParams.ruang_id &&
                        <Block strong style={{margin:'0px', fontSize:'20px', padding:'8px', paddingLeft:'16px'}}>
                            Ruang <b>{this.state.ruang.nama}</b>
                        </Block>
                        }
                        <List noHairlinesMd style={{marginBottom:'0px'}}>
                            <ListInput
                                label="Judul"
                                type="text"
                                placeholder="Judul Diskusi"
                                clearButton
                                onChange={this.setStateValue('judul')}
                                defaultValue={this.state.routeParams.judul}
                            >
                            </ListInput>
                            <ListItem
                            title="Jenis Diskusi"
                            smartSelect
                            >
                                <select onChange={this.gantiTopik} name="topik_pertanyaan_id" defaultValue={this.state.routeParams.topik_pertanyaan_id}>
                                    <option value="1">Diskusi Umum</option>
                                    <option value="2">Diskusi Privat</option>
                                </select>
                            </ListItem>
                        </List>
                        <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                            <div style={{marginBottom:'8px'}}>
                                Konten Materi dan Diskusi
                            </div>
                            <ReactQuill 
                                theme="snow" 
                                onChange={this.editorChange} 
                                modules={this.modules}
                                formats={this.formats}
                                value={this.state.routeParams.konten}
                                on
                            />
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
                            {/* <CKEditor
                                style={{minHeight:'200px'}}
                                editor={ ClassicEditor }
                                // data="<p>Hello from CKEditor 5!</p>"
                                onInit={ editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log( 'Editor is ready to use!', editor );
                                } }
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    console.log( { event, editor, data } );

                                    this.setState({
                                        routeParams: {
                                            ...this.state.routeParams,
                                            konten: data
                                        }
                                    },()=>{
                                        console.log(this.state.routeParams);
                                    });
                                } }
                                onBlur={ ( event, editor ) => {
                                    console.log( 'Blur.', editor );
                                } }
                                onFocus={ ( event, editor ) => {
                                    console.log( 'Focus.', editor );
                                } }
                            /> */}
                        </Block>
                        <Block strong style={{marginTop:'0px'}}>
                            <Button raised fill onClick={this.tambahPertanyaan} style={{marginBottom:'8px', backgroundColor:'green'}}><i className="f7-icons" style={{fontSize:'20px', marginBottom:'8px'}}>paperplane_fill</i>&nbsp;Publikasi Materi dan Diskusi</Button>
                            <Button raised fill onClick={this.simpanDraft} style={{backgroundColor:'gray'}}><i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;Simpan Sebagai Draft</Button>
                        </Block>
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
      simpanPertanyaan: Actions.simpanPertanyaan,
      getRuang: Actions.getRuang,
      simpanPertanyaanRuang: Actions.simpanPertanyaanRuang,
      getPertanyaan: Actions.getPertanyaan
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        simpan_pertanyaan: Pertanyaan.simpan_pertanyaan,
        ruang: Ruang.ruang,
        pertanyaan: Pertanyaan.pertanyaan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahPertanyaan));
  