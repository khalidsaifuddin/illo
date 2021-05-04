import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar, Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Dropzone from 'react-dropzone';

class FormBanner extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            banner_id: this.$f7route.params['banner_id'] ? this.$f7route.params['banner_id'] : null,
            jenis_banner_id: this.$f7route.params['jenis_banner_id'] ? this.$f7route.params['jenis_banner_id'] : '1',
            jenis_banner: parseInt(this.$f7route.params['jenis_banner_id']) === 1 ? 'Banner Utama' : (parseInt(this.$f7route.params['jenis_banner_id']) === 2 ? 'Banner Samping' : (parseInt(this.$f7route.params['jenis_banner_id']) === 3 ? 'Banner Bawah': 'Banner Utama')),
            jenis: parseInt(this.$f7route.params['jenis_banner_id']) === 1 ? 'utama' : (parseInt(this.$f7route.params['jenis_banner_id']) === 2 ? 'samping' : (parseInt(this.$f7route.params['jenis_banner_id']) === 3 ? 'bawah': 'utama')),
            tautan: 'http://',
            aktif: 1,
            keterangan: ''
        },
        gambar_kuis: '',
        file_gambar_kuis: '',
    }

    resizeImage = (settings) => {
        let file = settings.file
        let maxSize = settings.maxSize
        let reader = new FileReader()
        let image = new Image()
        let canvas = document.createElement('canvas')
        let dataURItoBlob = (dataURI) => {
            let bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1])
            let mime = dataURI.split(',')[0].split(':')[1].split('')[0]
            let max = bytes.length
            let ia = new Uint8Array(max)
            for (let i = 0; i < max; i++){
                ia[i] = bytes.charCodeAt(i)
            }
            return new Blob([ia], { type: mime })
        }
        let resize = () => {
            let width = image.width
            let height = image.height
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width
                    width = maxSize
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height
                    height = maxSize
                }
            }
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(image, 0, 0, width, height)
            let dataUrl = canvas.toDataURL('image/jpeg')
            return dataURItoBlob(dataUrl)
        }
        return new Promise((ok, no) => {
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"))
                return
            }
            reader.onload = (readerEvent) => {
                image.onload = () => { return ok(resize()) }
                image.src = readerEvent.target.result
            }
            reader.readAsDataURL(file)
        })
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

        // alert(this.$f7route.params['jenis_banner_id'])

        if(this.state.routeParams.banner_id){

            this.props.getBanner(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){
                    this.setState({
                        routeParams: {
                            ...this.state.routeParams,
                            ...result.payload.rows[0],
                            waktu_mulai: result.payload.rows[0].waktu_mulai.replace(' ','T'),
                            waktu_selesai: result.payload.rows[0].waktu_selesai.replace(' ','T')
                        },
                        gambar_kuis: result.payload.rows[0].nama_file,
                        file_gambar_kuis: result.payload.rows[0].nama_file,
                    },()=>{

                    })
                }
            })

        }

    }

    setValue = (type) => (e) => {

        // console.log(e.currentTarget.value);return true;
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }
        },()=>{

        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanBanner(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/Banner/"+this.state.routeParams.jenis)
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    editorChange = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keterangan: e
            }
        },()=>{
            
        });
    }

    changeToggle = (key) => (e) => {

        console.log(key)
        console.log(e)
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state.routeParams);
        });
    }

    acceptedFile = (file) => {
        
        if(file[0].size >= 10000000){ //10MB
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 10MB!', 'Peringatan');
            return true;
        }
        
        if(
            file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)] === 'jpg' ||
            file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)] === 'png' ||
            file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)] === 'jpeg' ||
            file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)] === 'webp' ||
            file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)] === 'gif'
        ){

            let ekstensi = file[0].name.split(".")[(parseInt(file[0].name.split(".").length)-1)];

            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        nama_file: "/assets/berkas/"+result.payload+"."+ekstensi,
                    }
                },()=>{
                    //uploading
                    console.log(this.state.routeParams);

                    this.resizeImage({
                        file: file[0],
                        maxSize: 3000
                    }).then((resizedImage) => {
                        
                        resizedImage.lastModifiedDate = new Date()
                        resizedImage.name = file[0].name
                        
                        return new Promise(
                            (resolve, reject) => {
                                const xhr = new XMLHttpRequest()
                                xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload')
                                xhr.onload = this.uploadBerhasil
                                xhr.onerror = this.uploadGagal
                                const data = new FormData()
                                data.append('image', resizedImage)
                                data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id)
                                data.append('jenis', 'gambar_banner')
                                data.append('ekstensi', ekstensi)
                                data.append('guid', this.props.uuid_kuis)
                                xhr.send(data)
                            }
                        )

                    }).catch((err) => {
                        console.error(err)
                    })

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
                file_gambar_kuis: response.filename,
                loading: false
            });
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    render()
    {
        return (
            <Page name="FormBanner" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.unit_id ? "Edit" : "Tambah"} Banner</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Jenis Banner"
                                        type="text"
                                        placeholder="Jenis Banner"
                                        // clearButton
                                        value={this.state.routeParams.jenis_banner}
                                    />
                                    <ListInput
                                        label="Keterangan Banner"
                                        type="text"
                                        placeholder="Keterangan Banner"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    />
                                    <ListInput
                                        label="Waktu Mulai Tampil"
                                        type="datetime-local"
                                        placeholder="Waktu Mulai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_mulai}
                                        onChange={this.setValue('waktu_mulai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                    <ListInput
                                        label="Waktu Selesai Tampil"
                                        type="datetime-local"
                                        placeholder="Waktu Selesai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_selesai}
                                        onChange={this.setValue('waktu_selesai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                    <ListInput
                                        label="Tautan Banner"
                                        type="text"
                                        placeholder="http://...."
                                        clearButton
                                        value={this.state.routeParams.tautan}
                                        onChange={this.setValue('tautan')}
                                    />
                                    <ListItem>
                                        <span>Aktifkan Banner</span>
                                        {/* <Toggle checked={this.state.routeParams.aktif === 1 ? true : false} value={1} onToggleChange={this.changeToggle('aktif')} /> */}
                                        <Toggle defaultChecked={parseInt(this.state.routeParams.aktif) === 1 ? true : false} value={1} onToggleChange={this.changeToggle('aktif')} />
                                    </ListItem>
                                    <ListItem>
                                        <Dropzone className="droping" onDrop={this.acceptedFile}>
                                        {({getRootProps, getInputProps}) => (
                                            <section>
                                                <div {...getRootProps()} style={{
                                                    borderRadius:'20px', 
                                                    minHeight:'250px',
                                                    border:'4px dashed #ccc', 
                                                    textAlign: 'center', 
                                                    paddingTop:(this.state.file_gambar_kuis !== '' ? '16px' : '10%'), 
                                                    paddingLeft:'16px', 
                                                    paddingRight:'16px',
                                                    width:'100%'
                                                }}>
                                                    <input {...getInputProps()} />
                                                    {this.state.file_gambar_kuis === '' &&
                                                    <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                    }
                                                    {this.state.file_gambar_kuis !== '' &&
                                                    <>
                                                    <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_kuis} />
                                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                    </>
                                                    }
                                                    {this.state.gambar_kuis === '' &&
                                                    <>
                                                    <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                    </>
                                                    }
                                                    {this.state.gambar_kuis !== '' && this.state.file_gambar_kuis === '' &&
                                                    <>
                                                    <p style={{fontSize:'20px'}}>{this.state.gambar_kuis}</p>
                                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                    </>
                                                    }
                                                </div>
                                            </section>
                                        )}
                                        </Dropzone>
                                    </ListItem>
                                </List>
                                <div style={{borderTop:'1px solid #ccc', marginTop:'16px', marginBottom:'8px'}}>&nbsp;</div>
                                <Button onClick={this.simpan} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    
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
      getBanner: Actions.getBanner,
      simpanBanner: Actions.simpanBanner,
      generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormBanner));
  