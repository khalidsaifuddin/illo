import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle, Subnavbar, Segmented, NavRight, Block
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import { Bar, Line } from 'react-chartjs-2';

import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Dropzone from 'react-dropzone';
import { getArtikel } from '../../store/actions';

class tambahBlog extends Component {
    state = {
        error: null,
        loading: false,
        artikel: {
            rows: [],
            total: 0
        },
        routeParams: {
            start: 0,
            limit: 20
        },
        record_artikel: {
            konten: '',
            publikasi: 1,
            artikel_id: this.$f7route.params['artikel_id'] ? this.$f7route.params['artikel_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        gambar_artikel: '',
        file_gambar_artikel: '',
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
        if(this.$f7route.params['artikel_id']){
            this.props.getArtikel(this.state.record_artikel).then((result)=>{
                if(parseInt(result.payload.total) > 0){
                    //ada
                    this.setState({
                        ...this.state,
                        record_artikel: result.payload.rows[0],
                        gambar_artikel: result.payload.rows[0].gambar,
                        file_gambar_artikel: result.payload.rows[0].gambar
                    })
                }else{
                    //tidak ada
                }
            })
        }
    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            ...this.state,
            record_artikel: {
                ...this.state.record_artikel,
                [key]: value
            }
        });

    }

    gantiStatusPublikasi = (b) => {
        this.setState({
            ...this.state,
            record_artikel: {
                ...this.state.record_artikel,
                publikasi: b.target.value
            }
        });
    }

    acceptedFile = (file) => {
        this.$f7.dialog.preloader()
        // console.log(file[0]);

        this.setState({
            routeParams: this.state.record_artikel
        },()=>{

            if(file[0].size >= 10000000){ //2Mb
                this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 10MB!', 'Peringatan');
                return true;
            }
    
            if(
                file[0].name.substr(file[0].name.length - 3) === 'jpg' || 
                file[0].name.substr(file[0].name.length - 4) === 'jpeg' || 
                file[0].name.substr(file[0].name.length - 3) === 'png'
            ){
                
                this.props.generateUUID(this.state.routeParams).then((result)=>{

                    this.setState({
                        gambar_artikel: file[0].name,
                        // loading: true,
                        guid_gambar: this.props.uuid_kuis,
                        record_artikel:{
                            ...this.state.record_artikel,
                            gambar_artikel: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                        }
                    },()=>{
        
                        return new Promise(
                            (resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                // xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                                xhr.open('POST', 'https://be.diskuis.id' + '/api/Ruang/upload');
                                xhr.onload = this.uploadBerhasil;
                                xhr.onerror = this.uploadGagal;
                                const data = new FormData();
                                data.append('image', file[0]);
                                data.append('pengguna_id', this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id);
                                // data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                                data.append('guid', this.state.guid_gambar);
                                data.append('jenis', 'gambar_artikel');
                                xhr.send(data);
                            }
                        );
    
                    });

                });
    
            }else{
                this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
                return true;
            }
            
        });


    }

    uploadBerhasil = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_artikel: response.filename,
                loading: false,
                record_artikel: {
                    ...this.state.record_artikel,
                    gambar: response.filename
                }
            },()=>{
                this.$f7.dialog.close()
            })
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    editorChange = (e) => {
        // console.log(e);
        this.setState({
            record_artikel: {
                ...this.state.record_artikel,
                konten: e
            }
        },()=>{
            // console.log(this.state.record_artikel);
        });
    }

    simpanArtikel = () => {
        this.$f7.dialog.preloader()
        // console.log('tes')
        // console.log(this.state.record_artikel)
        if(!this.state.record_artikel.judul || !this.state.record_artikel.konten || !this.state.record_artikel.gambar){
            this.$f7.dialog.alert('Judul, konten, dan gambar cover harus terisi lengkap sebelum menyimpan!')
            return true;
        }

        this.props.simpanArtikel(this.state.record_artikel).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                
                this.$f7.dialog.alert('Artikel berhasil disimpan', 'Berhasil',()=>{
                    this.$f7router.navigate("/kelola-blog/");
                })

            }else{
                //gagal
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon dicoba kembali dalam beberapa saat', 'Gagal')
            
            }
        })
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="tambahBlog" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Artikel</NavTitle>
                    <NavTitleLarge>
                        Tambah Artikel
                    </NavTitleLarge>
                </Navbar>

                <Row>
                    <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        <Card>
                            <CardContent>
                            <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListInput
                                        label="Judul"
                                        type="textarea"
                                        resizable
                                        placeholder="Judul Artikel"
                                        clearButton
                                        onChange={this.setStateValue('judul')}
                                        defaultValue={(this.$f7route.params['artikel_id'] ? this.state.record_artikel.judul : null)}
                                    >
                                    </ListInput>
                                    <ListInput
                                        label="Status Publikasi"
                                        type="select"
                                        placeholder="Pilih Status Publikasi Artikel..."
                                        name="publikasi" 
                                        value={this.state.record_artikel.publikasi} 
                                        defaultValue={1}
                                        onChange={this.gantiStatusPublikasi}
                                    >
                                        <option value="1">Draft</option>
                                        <option value="2">Publikasi</option>    
                                    </ListInput>
                                </List>
                                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                                    <div style={{marginBottom:'8px'}}>
                                        Konten Artikel
                                    </div>
                                    <ReactQuill 
                                        className={"kontenArtikel"}
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.record_artikel.konten}
                                        on
                                    />
                                </Block>

                                <BlockTitle>Upload Gambar Cover Artikel</BlockTitle>
                                <Card style={{borderRadius:'20px'}}>
                                    <Dropzone className="droping" onDrop={this.acceptedFile}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()} style={{borderRadius:'20px', height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_artikel !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                <input {...getInputProps()} />
                                                {this.state.file_gambar_artikel === '' &&
                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                }
                                                {this.state.file_gambar_artikel !== '' &&
                                                <>
                                                <img style={{height:'150px'}} src={'https://be.diskuis.id'+this.state.file_gambar_artikel} />
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_artikel === '' &&
                                                <>
                                                <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_artikel !== '' && this.state.file_gambar_artikel === '' &&
                                                <>
                                                <p style={{fontSize:'20px'}}>{this.state.gambar_artikel}</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                            </div>
                                        </section>
                                    )}
                                    </Dropzone>
                                </Card>
                                <Block strong style={{marginTop:'0px'}}>
                                    <Button 
                                    raised 
                                    fill 
                                    large
                                    onClick={this.simpanArtikel} 
                                    style={{marginBottom:'8px', backgroundColor:'green', display:'inline-flex'}}
                                    >
                                        <i className="f7-icons" style={{fontSize:'20px'}}>paperplane_fill</i>&nbsp;Simpan
                                    </Button>
                                </Block>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      generateUUID: Actions.generateUUID,
      simpanArtikel: Actions.simpanArtikel,
      getArtikel: Actions.getArtikel
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,  
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahBlog));
  