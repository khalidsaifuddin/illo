import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, BlockTitle, Card, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Dropzone from 'react-dropzone';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class tambahRuang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            ruang_id: this.$f7route.params['ruang_id'] ? this.$f7route.params['ruang_id'] : null,
            jenis_ruang_id: 1,
            deskripsi: ''
        },
        gambar_ruang: '',
        file_gambar_ruang: '',
        sekolah: {},
        ta_aktif: 2020,
        tahun_ajaran: {
            rows: [],
            total: 0
        }
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
                deskripsi: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    tambahRuang = () => {
        this.$f7.dialog.preloader()

        // alert('oke');
        this.setState({
            routeParams: {
                ...this.state.routeParams
            }
        },()=>{
            this.props.simpanRuang(this.state.routeParams).then((result)=>{
                //after simpan

                if(window.location.hash.split("/")[1] === 'tambahRuangSekolahBaru'){

                    this.props.simpanRuangSekolah({
                        sekolah_id: this.state.sekolah.sekolah_id, 
                        tahun_ajaran_id: this.state.ta_aktif, 
                        ruang_id: result.payload.ruang_id
                    }).then((result)=>{

                        this.$f7.dialog.close()
                        
                        this.$f7router.navigate('/tambahAnggotaRuang/'+this.props.simpan_ruang.ruang_id+'/'+this.state.sekolah.sekolah_id);
                        // this.$f7router.navigate('/tampilRuang/'+this.props.simpan_ruang.ruang_id);
                    
                    })

                }else{

                    this.$f7.dialog.close()
                    
                    this.$f7router.navigate('/tampilRuang/'+this.props.simpan_ruang.ruang_id);

                }



            });
        });

    }

    gantiJenis = (b) => {
        // b.target.value
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                jenis_ruang_id: b.target.value
            }
        },()=>{
            // console.log(this.state.routeParams);
        })
    }

    acceptedFile = (file) => {
        // console.log(file[0]);

        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){

            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    gambar_ruang: file[0].name,
                    guid_gambar: this.props.uuid_kuis,
                    // loading: true,
                    routeParams:{
                        ...this.state.routeParams,
                        // gambar_ruang: file[0].name
                        gambar_ruang: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    }
                },()=>{
                    //uploading
                    // const formData = new FormData();
                    console.log(this.state.routeParams);

                    // formData.append('avatar',file[0]);
                    // console.log(localStorage.getItem('api_base') + '/api/Ruang/upload');
                    return new Promise(
                        (resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                            xhr.onload = this.uploadBerhasil;
                            xhr.onerror = this.uploadGagal;
                            const data = new FormData();
                            data.append('image', file[0]);
                            data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                            data.append('jenis', 'gambar_ruang');
                            data.append('guid', this.state.guid_gambar);
                            xhr.send(data);
                        }
                    );
                });

            });

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
            return true;
        }

    }

    uploadBerhasil = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_ruang: response.filename,
                loading: false
            });
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    componentDidMount = () => {
        if(this.state.routeParams.ruang_id){
            
            this.$f7.dialog.preloader()
            
            //load ruang yang sudah ada
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    jenis_ruang_id: null
                }
            },()=>{
                this.props.getRuang(this.state.routeParams).then((result)=>{

                    this.setState({
                        routeParams: this.props.ruang.rows[0],
                        gambar_ruang: '/assets/berkas/'+this.props.ruang.rows[0].gambar_ruang,
                        file_gambar_ruang: '/assets/berkas/'+this.props.ruang.rows[0].gambar_ruang
                    },()=>{
                        this.$f7.dialog.close();
                    });
                });
            });
        }

        // console.log(window.location.hash.substring(3).replace("/",""))
        // if(window.location.hash.substring(3).replace("/","") === 'tambahRuangSekolahBaru'){

        setTimeout(() => {
            
            if(window.location.hash.split("/")[1] === 'tambahRuangSekolahBaru'){
                //tambah ruang untuk sekolah
                // alert(this.$f7route.params['sekolah_id'])
                this.props.getSekolah({
                    sekolah_id: window.location.hash.split("/")[2], 
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id
                }).then((result)=>{
                    if(parseInt(result.payload.total) > 0){
                        this.setState({
                            sekolah: result.payload.rows[0]
                        },()=>{
                            this.props.getTahunAjaran(this.state.routeParams).then((result)=>{
                                this.setState({
                                    tahun_ajaran: result.payload
                                })
                            })
                        })
                    }
                })
                
            }
            
        }, 1000);

    }

    gantiTahunAjaran = (e) => {
        console.log(e.currentTarget.value)

        this.setState({
            ta_aktif: e.currentTarget.value
        })
    }

    render()
    {
        // console.log(window.location.hash.split("/")[1])

        return (
            <Page name="tambahRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['ruang_id'] ? 'Edit' : 'Tambah'} Ruang</NavTitle>
                    <NavTitleLarge>
                        {this.$f7route.params['ruang_id'] ? 'Edit' : 'Tambah'} Ruang
                    </NavTitleLarge>
                </Navbar>

                <Row noGap>
                    <Col tabletWidth="15" width="0"></Col>
                    <Col tabletWidth="70" width="100">

                        {window.location.hash.split("/")[1] === 'tambahRuangSekolahBaru' &&
                        <Block strong style={{marginBottom:'0px', background:'#c6ebc9'}}>
                            Ruang baru untuk <b>{this.state.sekolah.nama}</b>
                        </Block>
                        }

                        <List noHairlinesMd style={{marginBottom:'0px', marginTop:'0px'}}>
                            {window.location.hash.split("/")[1] === 'tambahRuangSekolahBaru' &&
                            <ListInput
                                type="select"
                                defaultValue={this.state.ta_aktif}
                                onChange={this.gantiTahunAjaran}
                            >
                                {this.state.tahun_ajaran.rows.map((option)=>{
                                    return (
                                        <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                        )
                                })}
                            </ListInput>
                            }
                            <ListInput
                                label="Nama"
                                type="text"
                                placeholder="Nama Ruang"
                                clearButton
                                defaultValue={this.state.routeParams.nama}
                                onChange={this.setStateValue('nama')}
                            >
                            </ListInput>
                            <ListItem
                            title="Jenis Ruang"
                            smartSelect
                            >
                                <select onChange={this.gantiJenis} name="jenis_ruang_id" defaultValue={this.state.routeParams.jenis_ruang_id}>
                                    <option value="1">Publik</option>
                                    <option value="2">Privat</option>
                                </select>
                            </ListItem>
                        </List>
                        <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                            <div style={{marginBottom:'8px'}}>
                                Deskripsi
                            </div>
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
                                value={this.state.routeParams.deskripsi}
                                on
                            />
                            {/* <Col width={100} tabletWidth={50}> */}
                            <BlockTitle>Upload Gambar Ruang</BlockTitle>
                            <Card>
                                <Dropzone className="droping" onDrop={this.acceptedFile}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_ruang !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                            <input {...getInputProps()} />
                                            {this.state.file_gambar_ruang === '' &&
                                            <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                            }
                                            {this.state.file_gambar_ruang !== '' &&
                                            <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_ruang} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_ruang === '' &&
                                            <>
                                            <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_ruang !== '' && this.state.file_gambar_ruang === '' &&
                                            <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_ruang}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                        </div>
                                    </section>
                                )}
                                </Dropzone>
                            </Card>
                            {/* </Col> */}
                        </Block>
                        <Block strong style={{marginTop:'0px'}}>
                            <Button 
                                disabled={this.state.routeParams.nama ? false : true} 
                                raised 
                                fill 
                                onClick={this.tambahRuang} 
                                style={{
                                    marginBottom:'8px', 
                                    backgroundColor:'green', 
                                    width:'100%', 
                                    display: 'inline-flex'
                                }}
                            >
                                <i className="f7-icons" style={{fontSize:'20px', marginBottom:'4px'}}>paperplane_fill</i>&nbsp;
                                Simpan Ruang
                            </Button>
                            {/* <Button raised fill onClick={this.simpanDraft} style={{backgroundColor:'gray'}}><i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;Simpan Sebagai Draft</Button> */}
                        </Block>

                    </Col>
                    <Col tabletWidth="15" width="0"></Col>
                </Row>

            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      simpanRuang: Actions.simpanRuang,
      generateUUID: Actions.generateUUID,
      getRuang: Actions.getRuang,
      getSekolah: Actions.getSekolah,
      getTahunAjaran: Actions.getTahunAjaran,
      simpanRuangSekolah: Actions.simpanRuangSekolah
    }, dispatch);
}

function mapStateToProps({ App, Ruang, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,
        simpan_ruang: Ruang.simpan_ruang,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahRuang));
  