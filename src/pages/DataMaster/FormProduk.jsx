import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
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

class FormProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            produk_id: this.$f7route.params['produk_id'],
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            keterangan: ''
        },
        gambar_produk: {},
        gambar_produk_arr: [],
        harga_produk: []
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
        //   ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        // 'link', 'image'
    ]

    componentDidMount = () => {

        this.props.getKategoriProduk(this.state.routeParams)

        if(this.$f7route.params['produk_id'] && this.$f7route.params['produk_id'] !== '-'){
            this.props.getProduk(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    },()=>{
                        
                        this.props.getHargaProduk(this.state.routeParams).then((result)=>{

                            let harga_produk = []

                            for (let index = 0; index < result.payload.rows.length; index++) {
                                const element = result.payload.rows[index];

                                let persen = parseFloat(element.nominal)/parseFloat(this.state.routeParams.harga_jual)*100
                                element.persen = persen

                                harga_produk.push(element)
                                
                            }

                            this.setState({
                                harga_produk: harga_produk
                            },()=>{
                                this.props.getGambarProduk(this.state.routeParams).then((result)=>{

                                    let gambar_produk = {}

                                    result.payload.rows.map((option)=>{
                                        gambar_produk[option.gambar_produk_id] = option
                                    })

                                    this.setState({
                                        gambar_produk: gambar_produk,
                                        gambar_produk_arr: result.payload.rows
                                    })
                                })
                            })
                        })

                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        produk_id: result.payload
                    }
                },()=>{

                    this.props.getHargaProduk(this.state.routeParams).then((result)=>{
                        this.setState({
                            harga_produk: result.payload.rows
                        },()=>{
                            this.props.getGambarProduk(this.state.routeParams).then((result)=>{
                                this.setState({
                                    gambar_produk: result.payload.rows
                                })
                            })
                        })
                    })

                })
            })
        }

    }

    setValue = (type) => (e) => {

        console.log(type)

        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)

            if(type === 'harga_jual'){
                let harga_produk = []

                this.state.harga_produk.map((option)=>{
                    option.nominal = parseFloat(parseFloat(option.persen)/100*parseFloat(this.state.routeParams.harga_jual)).toFixed(0)

                    harga_produk.push(option)

                })

                this.setState({
                    harga_produk: harga_produk
                })
            }

        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanProduk({...this.state.routeParams, gambar_produk: this.state.gambar_produk_arr, harga_produk: this.state.harga_produk}).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/Produk/")
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
            // console.log(this.state.routeParams);
        });
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

    acceptedFile = (file) => {
        
        if(file[0].size >= 10000000){ //10MB
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 10MB!', 'Peringatan');
            return true;
        }

        // this.resizeImage({
        //     file: file[0],
        //     maxSize: 500
        // }).then(function (resizedImage) {
        //     // console.log(resizedImage)
        //     // console.log("upload resized image")
        // }).catch(function (err) {
        //     console.error(err)
        // })

        // if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
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
                    gambar_produk: {
                        ...this.state.gambar_produk,
                        [result.payload]: {
                            produk_id: this.state.routeParams.produk_id,
                            gambar_produk_id: result.payload,
                            nama_file: "/assets/berkas/"+result.payload+"."+ekstensi,
                            soft_delete: 0,
                            gambar_utama: 0
                        } 
                    }
                },()=>{
                    //uploading
                    console.log(this.state.gambar_produk);

                    this.resizeImage({
                        file: file[0],
                        maxSize: 1000
                    }).then((resizedImage) => {
                        // console.log("upload resized image")
                        resizedImage.lastModifiedDate = new Date()
                        resizedImage.name = file[0].name
                        console.log(resizedImage)

                        return new Promise(
                            (resolve, reject) => {
                                const xhr = new XMLHttpRequest()
                                xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload')
                                xhr.onload = this.uploadBerhasil
                                xhr.onerror = this.uploadGagal
                                const data = new FormData()
                                // data.append('image', file[0])
                                data.append('image', resizedImage)
                                data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id)
                                data.append('jenis', 'gambar_ruang')
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
            // this.setState({
            //     file_gambar_ruang: response.filename,
            //     loading: false
            // });

            let gambar_produk_arr = []

            for (const prop in this.state.gambar_produk) {
                const element = this.state.gambar_produk[prop]
                gambar_produk_arr.push(element)
                // if (this.state.gambar_produk.hasOwnProperty.call(this.state.gambar_produk, prop)) {
                //     const element = this.state.gambar_produk[prop]
                    
                //     gambar_produk_arr.push(element)
                // }
            }

            // console.log(gambar_produk_arr)

            this.setState({
                gambar_produk_arr: gambar_produk_arr
            },()=>{
                console.log(this.state.gambar_produk_arr)
            })
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    hapusGambar = (gambar_produk_id) => {
        
        this.setState({
            gambar_produk: {
                ...this.state.gambar_produk,
                [gambar_produk_id]: {
                    ...this.state.gambar_produk[gambar_produk_id],
                    soft_delete: 1
                }
            }
        })


        let gambar_produk_arr = []

        for (const prop in this.state.gambar_produk) {
            const element = this.state.gambar_produk[prop]
            gambar_produk_arr.push(element)
        }

        this.setState({
            gambar_produk_arr: gambar_produk_arr
        },()=>{
            console.log(this.state.gambar_produk_arr)
        })
    }

    setGambarUtama = (gambar_produk_id) => {

        let tmp_gambar_produk = {}

        for (const key in this.state.gambar_produk) {
            const element = this.state.gambar_produk[key]
            element.gambar_utama = 0;

            tmp_gambar_produk[key] = element
        }

        console.log(tmp_gambar_produk)

        this.setState({
            gambar_produk: tmp_gambar_produk
        },()=>{
            console.log(this.state.gambar_produk)

            this.setState({
                gambar_produk: {
                    ...this.state.gambar_produk,
                    [gambar_produk_id]: {
                        ...this.state.gambar_produk[gambar_produk_id],
                        gambar_utama: 1
                    }
                }
            },()=>{
                // console.log(this.state.gambar_produk)
                let gambar_produk_arr = []

                for (const prop in this.state.gambar_produk) {
                    const element = this.state.gambar_produk[prop]
                    gambar_produk_arr.push(element)
                }

                this.setState({
                    gambar_produk_arr: gambar_produk_arr
                },()=>{
                    console.log(this.state.gambar_produk_arr)
                })
            })
        })

    }

    setHargaProduk = (jenis_harga_id) => (e) => {
        
        let harga_produk  = []

        this.state.harga_produk.map((option)=>{
            if(option.jenis_harga_id === jenis_harga_id){
                option.nominal = e.currentTarget.value
                option.produk_id = this.state.routeParams.produk_id,
                option.soft_delete = 0
                option.persen = parseFloat(e.currentTarget.value)/parseFloat(this.state.routeParams.harga_jual)*100
            }else{
                //do nothing
            }

            harga_produk.push(option)
        })

        // console.log(this.state.harga_produk)
        this.setState({
            harga_produk: harga_produk
        },()=>{
            console.log(this.state.harga_produk)
        })
    }

    gantiPersenHarga = (jenis_harga_id) => (e) => {
        //hitung
        let nominal = parseFloat(parseFloat(e.currentTarget.value)/100*this.state.routeParams.harga_jual).toFixed(0)

        console.log(nominal)
        
        let harga_produk  = []

        this.state.harga_produk.map((option)=>{
            if(option.jenis_harga_id === jenis_harga_id){
                option.persen = e.currentTarget.value
                option.nominal = nominal
            }else{
                //do nothing
            }

            harga_produk.push(option)

        })

        this.setState({
            harga_produk: harga_produk
        },()=>{
            console.log(this.state.harga_produk)
        })

    }
    
    render()
    {
        return (
            <Page name="FormProduk" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['produk_id'] ? "Edit" : "Tambah"} Produk</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Kode Produk"
                                        type="text"
                                        placeholder="Kode Produk"
                                        clearButton
                                        value={this.state.routeParams.kode_produk}
                                        onChange={this.setValue('kode_produk')}
                                    />   
                                    <ListInput
                                        label="Nama Produk"
                                        type="text"
                                        placeholder="Nama Produk"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                    />   
                                    <ListItem className="teksQuill">
                                        <div>Keterangan Produk</div>
                                        <ReactQuill 
                                            theme="snow" 
                                            onChange={this.editorChange} 
                                            modules={this.modules}
                                            formats={this.formats}
                                            value={this.state.routeParams.keterangan}
                                            on
                                            style={{width:'100%'}}
                                            // value={this.state.pertanyaan_kuis.rows[0].teks}
                                        />
                                        <div style={{fontSize:'10px', color:(this.state.routeParams.keterangan ? (parseInt(this.state.routeParams.keterangan.replace(/(<([^>]+)>)/gi, "").length) > 2000 ? 'red' : '#434343') : '#434343')}}>
                                            {this.state.routeParams.keterangan ? this.state.routeParams.keterangan.replace(/(<([^>]+)>)/gi, "").length : '0'}/2000 karakter
                                        </div>
                                    </ListItem>
                                    <ListInput
                                        label="Kategori Produk"
                                        type="select"
                                        value={this.state.routeParams.kategori_produk_id}
                                        placeholder="Kategori Produk..."
                                        onChange={this.setValue('kategori_produk_id')}
                                    >
                                        <option value={null} selected={this.state.routeParams.kategori_produk_id ? false : true}>-</option>
                                        {this.props.kategori_produk.rows.map((option)=>{
                                            return (
                                                <option value={option.kategori_produk_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListItem className="teksQuill">
                                        <div>Gambar Produk</div>
                                        <Dropzone className="droping" onDrop={this.acceptedFile}>
                                        {({getRootProps, getInputProps}) => (
                                            <section>
                                                <div {...getRootProps()} style={{height:'200px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_produk !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                    <input {...getInputProps()} />
                                                    <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                    <>
                                                    <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 10MB, dan hanya dalam format .jpg/.jpeg, atau .png</p>
                                                    </>
                                                </div>
                                            </section>
                                        )}
                                        </Dropzone>

                                        <div className="kotak_gambar">
                                            {this.state.gambar_produk_arr.map((option)=>{

                                                if(option.soft_delete !== 1){

                                                    return (
                                                        <div 
                                                        className="gambar_produk" 
                                                        style={{
                                                            backgroundImage:'url('+localStorage.getItem('api_base')+option.nama_file+')', 
                                                            backgroundSize:'cover', 
                                                            backgroundPosition:'center',
                                                            border: (option.gambar_utama !== 1 ? '1px solid #eee' : '3px solid green')
                                                        }}>
                                                            <Button onClick={()=>this.hapusGambar(option.gambar_produk_id)} className="buttonGambar" style={{marginTop: '172px'}}>
                                                                Hapus
                                                            </Button>
                                                            <Button onClick={()=>this.setGambarUtama(option.gambar_produk_id)} className="buttonGambar" style={{fontSize:'10px'}}>
                                                                {option.gambar_utama !== 1 ? 'Atur sebagai gambar utama' : 'Gambar Utama'}
                                                            </Button>
                                                        </div>
                                                
                                                )
                                                }

                                            })}
                                        </div>
                                    </ListItem>
                                    <ListInput
                                        label="HPP Produk (Rp)"
                                        type="number"
                                        placeholder="HPP Produk (Rp) ..."
                                        clearButton
                                        value={this.state.routeParams.hpp}
                                        onChange={this.setValue('hpp')}
                                    />
                                    <ListInput
                                        label="Harga Jual Dasar (Rp)"
                                        type="number"
                                        placeholder="Harga Jual Dasar (Rp) ..."
                                        clearButton
                                        value={this.state.routeParams.harga_jual}
                                        onChange={this.setValue('harga_jual')}
                                    />
                                    <ListItem className="teksQuill" style={{marginTop:'16px'}}>
                                        {/* <div>Harga Produk</div> */}
                                        {this.state.harga_produk.map((optionHarga)=>{

                                            return (
                                                <List noHairlinesBetweenIos className="listHarga" style={{
                                                    marginBottom:'16px', 
                                                    border:'1px solid #ccc', 
                                                    padding:'16px',
                                                    borderRadius: '10px'
                                                }}>
                                                    <ListInput
                                                        label={"Persentase " + optionHarga.nama + " (%)"}
                                                        type="number"
                                                        placeholder={"Persentase " + optionHarga.nama}
                                                        clearButton
                                                        value={optionHarga.persen}
                                                        onChange={this.gantiPersenHarga(optionHarga.jenis_harga_id)}
                                                        info={"Persentase dari harga jual dasar"}
                                                    /> 
                                                    <ListInput
                                                        label={"Nominal " + optionHarga.nama + " (Rp)"}
                                                        type="number"
                                                        placeholder={"Nominal " + optionHarga.nama}
                                                        clearButton
                                                        value={optionHarga.nominal}
                                                        onChange={this.setHargaProduk(optionHarga.jenis_harga_id)}
                                                    /> 
                                                </List>
                                            )
                                        })}
                                    </ListItem>
                                    {/* <ListInput
                                        label="Keterangan Produk"
                                        type="text"
                                        placeholder="Keterangan Produk"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    /> */}
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
      getProduk: Actions.getProduk,
      simpanProduk: Actions.simpanProduk,
      generateUUID: Actions.generateUUID,
      getHargaProduk: Actions.getHargaProduk,
      getGambarProduk: Actions.getGambarProduk,
      getKategoriProduk: Actions.getKategoriProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,
        kategori_produk: Produk.kategori_produk
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormProduk));
  