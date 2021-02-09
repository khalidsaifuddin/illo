import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import Dropzone from 'react-dropzone';

class tambahDokumenGuru extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        profilEdit: false,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {},
        guru: {
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        pengguna: {},
        sekolah_pengguna: {},
        provinsi: [],
        kabupaten: [],
        kecamatan: [],
        wilayah: {},
        nama_file: '',
        file_nama_file: '',
        jenis_berkas: []
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

        //what to do after mount
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: {...this.props.pengguna.rows[0], agama: (parseInt(this.props.pengguna.rows[0].agama_id) === 1 ? 'Islam' : (parseInt(this.props.pengguna.rows[0].agama_id) === 2 ? 'Kristen' : (parseInt(this.props.pengguna.rows[0].agama_id) === 3 ? 'Katholik' : (parseInt(this.props.pengguna.rows[0].agama_id) === 4 ? 'Hindu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 5 ? 'Budha' : (parseInt(this.props.pengguna.rows[0].agama_id) === 6 ? 'Konghucu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 7 ? 'Kepercayaan' : '-')))))))}
            },()=>{
                this.props.getJenisBerkas(this.state.routeParams).then((result)=>{
                    this.setState({
                        jenis_berkas: result.payload
                    })
                })
                
                if(this.state.pengguna.kode_wilayah){

                    this.props.getWilayahHirarki({kode_wilayah:this.state.pengguna.kode_wilayah, id_level_wilayah: 3}).then((result)=>{
                        // console.log(result.payload[0])
                        this.setState({
                            wilayah: result.payload[0]
                        },()=>{
                            
                        })
                    })

                }
            })
        });

        this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah_pengguna: this.props.sekolah_pengguna.rows[0]
            });
        });

        this.props.getGuru(this.state.routeParams).then((result)=>{
            console.log(this.props.guru);

            if(this.props.guru.total > 0){

                this.setState({
                    // guru: this.props.guru.rows[0],
                    guru: {
                        ...this.props.guru.rows[0]
                        // pengguna_id: this.state.routeParams.pengguna_id,
                        // sekolah_id: this.state.routeParams.sekolah_id
                    },
                    routeParamsPengguna: {
                        pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
                    }
                },()=>{
                    console.log(this.state.guru);

                    this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                        this.setState({
                            provinsi: this.props.wilayah.rows
                        })
                    })
                });

            }
        });

        this.props.getMapel(this.state.routeParams);
        
    }

    acceptedFile = (file) => {
        if(file[0].size >= 2000000){ //2Mb
            this.$f7.dialog.alert('Ukuran berkas tidak boleh melebihi 2MB!', 'Peringatan');
            return true;
        }

        if(
            file[0].name.substr(file[0].name.length - 3) === 'jpg'  || 
            file[0].name.substr(file[0].name.length - 4) === 'jpeg' || 
            file[0].name.substr(file[0].name.length - 3) === 'png'  || 
            file[0].name.substr(file[0].name.length - 3) === 'doc'  ||
            file[0].name.substr(file[0].name.length - 4) === 'docx' ||
            file[0].name.substr(file[0].name.length - 3) === 'pdf'  ||
            file[0].name.substr(file[0].name.length - 4) === 'xlsx' ||
            file[0].name.substr(file[0].name.length - 3) === 'xls'  ||
            file[0].name.substr(file[0].name.length - 3) === 'ppt'  ||
            file[0].name.substr(file[0].name.length - 4) === 'pptx' 
        ){
            
            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    nama_file: file[0].name,
                    guid_gambar: result.payload,
                    routeParams:{
                        ...this.state.routeParams,
                        nama_file: file[0].name
                        // nama_file: result.payload+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    }
                },()=>{
    
                    return new Promise(
                        (resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                            xhr.onload = this.uploadBerhasil;
                            xhr.onerror = this.uploadGagal;
                            const data = new FormData();
                            data.append('image', file[0]);
                            data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                            data.append('guid', this.state.guid_gambar);
                            data.append('jenis', 'nama_file');
                            xhr.send(data);
                        }
                    );
                });

            });

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf!', 'Peringatan');
            return true;
        }

    }

    uploadBerhasil = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_nama_file: response.filename,
                loading: false,
                routeParams: {
                    ...this.state.routeParams,
                    file_nama_file: response.filename
                }
            },()=>{
                // console.log(this.state)
            });
        }
    }

    uploadBerhasilLogo = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_logo_sekolah: response.filename,
                loading: false
            });
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    setValuePengguna = (kolom) => (e) => {

        this.setState({
            ...this.state,
            pengguna: {
                ...this.state.pengguna,
                [kolom]: e.target.value,
                agama: (kolom === 'agama_id' ? (parseInt(e.target.value) === 1 ? 'Islam' : (parseInt(e.target.value) === 2 ? 'Kristen' : (parseInt(e.target.value) === 3 ? 'Katholik' : (parseInt(e.target.value) === 4 ? 'Hindu' : (parseInt(e.target.value) === 5 ? 'Budha' : (parseInt(e.target.value) === 6 ? 'Konghucu' : (parseInt(e.target.value) === 7 ? 'Kepercayaan' : '-'))))))) : this.state.agama)
            }
          }, ()=> {
            console.log(this.state.pengguna);

            if(kolom === 'kode_wilayah_provinsi'){
                this.props.getWilayah({id_level_wilayah:2, mst_kode_wilayah: this.state.pengguna.kode_wilayah_provinsi}).then((result)=>{
                    this.setState({
                        kabupaten: this.props.wilayah.rows
                    })
                })
            }

            if(kolom === 'kode_wilayah_kabupaten'){
                this.props.getWilayah({id_level_wilayah:3, mst_kode_wilayah: this.state.pengguna.kode_wilayah_kabupaten}).then((result)=>{
                    this.setState({
                        kecamatan: this.props.wilayah.rows
                    })
                })
            }
        });
    }

    setValue = (kolom) => (e) => {
        this.setState({
            ...this.state,
            guru: {
                ...this.state.guru,
                [kolom]: e.target.value
            }
          }, ()=> {
            console.log(this.state.guru);
        });
    }

    simpanGuru = () => {
        this.$f7.dialog.preloader();

        this.props.simpanGuru(this.state.guru).then((result)=>{
            
            
            if(result.payload.sukses){
                //berhasil
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        pengguna_id: this.$f7route.params['pengguna_id'],
                        data: {...this.state.pengguna, agama: null}
                    }
                },()=>{
                    this.props.setPengguna(this.state.routeParams).then((result)=>{

                        this.props.getWilayahHirarki({kode_wilayah: this.state.pengguna.kode_wilayah, id_level_wilayah: 3}).then((resultWilayah)=>{
                            this.setState({
                                wilayah: resultWilayah.payload.length > 0 ? resultWilayah.payload[0] : this.state.wilayah
                            },()=>{

                                this.props.getGuru(this.state.routeParams).then((result)=>{
                                    this.setState({
                                        // guru: this.props.guru.rows[0],
                                        profilEdit: false,
                                        guru: {
                                            ...this.props.guru.rows[0]
                                            // pengguna_id: this.state.routeParams.pengguna_id,
                                            // sekolah_id: this.state.routeParams.sekolah_id
                                        },
                                        routeParamsPengguna: {
                                            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
                                        }
                                    },()=>{
                                        this.$f7.dialog.close();
                                        this.$f7.dialog.alert('Simpan Profil Guru Berhasil', 'Berhasil');
                                        // console.log(this.state.guru);
                                    });
                                })
                                
                            })
                        })
                        

                    })
                })
                
            }else{
                //gagal
                this.$f7.dialog.close();
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
            }
        });
    }

    kliktambah = () => {
        // alert('tes')
    }

    simpanUpload = () => {
        this.$f7.dialog.preloader()

        this.props.uploadDokumenGuru(this.state.routeParams).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close();
                this.$f7.dialog.alert('Simpan Berkas Guru Berhasil', 'Berhasil', ()=>{
                    this.$f7router.navigate('/dokumenGuru/'+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id'])
                });
            }else{
                //gagal
                this.$f7.dialog.close();
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
            }
        })
    }

    gantiJenisBerkas = (e) => {
        console.log(e.currentTarget.value)

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                jenis_berkas_id: e.currentTarget.value
            }
        })
    }

    render()
    {
        return (
            <Page name="tambahDokumenGuru" hideBarsOnScroll style={{paddingBottom:'60px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.props.pengguna.rows[0].nama}</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="100" tabletWidth="100">
                        <Card style={{marginTop:'32px'}}>
                            <CardContent>
                                <BlockTitle style={{marginTop:'0px'}}>Tambah Dokumen {this.state.pengguna.nama}</BlockTitle>
                                
                                <br/>
                                <List noHairlinesMd>
                                    <ListInput
                                        label="Jenis Dokumen"
                                        type="select"
                                        outline
                                        defaultValue="1"
                                        placeholder="Silakan pilih..."
                                        onChange={this.gantiJenisBerkas}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                        {/* <option value="Male">Male</option>
                                        <option value="Female">Female</option> */}
                                        {this.state.jenis_berkas.map((optionJenisBerkas)=>{
                                            return (
                                                <option value={optionJenisBerkas.jenis_berkas_id}>{optionJenisBerkas.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                </List>
                                <br/>
                                
                                <Dropzone className="droping" onDrop={this.acceptedFile}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} style={{height:'300px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_nama_file !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px', borderRadius:'20px'}}>
                                            <input {...getInputProps()} />
                                            {this.state.file_nama_file === '' &&
                                            <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                            }
                                            {
                                                this.state.file_nama_file !== '' && 
                                                (
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'jpg' || 
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 4) === 'jpeg' || 
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'png'
                                                ) &&
                                            <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_nama_file} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {
                                                this.state.file_nama_file !== '' && 
                                                (
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'xls' || 
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 4) === 'xlsx'
                                                ) &&
                                            <>
                                            <div style={{border:'2px dashed #ccc', borderRadius:'20px', padding:'16px'}}>
                                                <img style={{height:'150px'}} src={"https://img.icons8.com/color/452/microsoft-excel-2019--v1.png"} /><br/>
                                                <b>{this.state.nama_file}</b>
                                            </div>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {
                                                this.state.file_nama_file !== '' && 
                                                (
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'doc' || 
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 4) === 'docx'
                                                ) &&
                                            <>
                                            <div style={{border:'2px dashed #ccc', borderRadius:'20px', padding:'16px'}}>
                                                <img style={{height:'150px'}} src={"https://cdn.iconscout.com/icon/free/png-256/microsoft-word-1411849-1194338.png"} /><br/>
                                                <b>{this.state.nama_file}</b>
                                            </div>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {
                                                this.state.file_nama_file !== '' && 
                                                (
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'ppt' || 
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 4) === 'pptx'
                                                ) &&
                                            <>
                                            <div style={{border:'2px dashed #ccc', borderRadius:'20px', padding:'16px'}}>
                                                <img style={{height:'150px'}} src={"https://image.flaticon.com/icons/png/512/732/732224.png"} /><br/>
                                                <b>{this.state.nama_file}</b>
                                            </div>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {
                                                this.state.file_nama_file !== '' && 
                                                (
                                                    this.state.file_nama_file.substr(this.state.file_nama_file.length - 3) === 'pdf'
                                                ) &&
                                            <>
                                            <div style={{border:'2px dashed #ccc', borderRadius:'20px', padding:'16px'}}>
                                                <img style={{height:'150px'}} src={"https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png"} /><br/>
                                                <b>{this.state.nama_file}</b>
                                            </div>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {this.state.nama_file === '' &&
                                            <>
                                            <p>Tarik dan seret berkas pilihan Anda ke sini, atau klik/Sentuh untuk cari berkas</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                            {this.state.nama_file !== '' && this.state.file_nama_file === '' &&
                                            <>
                                            <p style={{fontSize:'20px'}}>{this.state.nama_file}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, .png, .doc/.docx, .xls/xlsx, .ppt/.pptx, atau .pdf</p>
                                            </>
                                            }
                                        </div>
                                    </section>
                                )}
                                </Dropzone>
                                <br/>
                                <div style={{width:'100&', textAlign:'center'}}>
                                    <Button raised fill large className="bawahCiriBiru" style={{display:'inline-flex', minWidth:'200px'}} onClick={this.simpanUpload}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                        Simpan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah,
      getGuru: actions.getGuru,
      simpanGuru: actions.simpanGuru,
      setPengguna: actions.setPengguna,
      getPengguna: actions.getPengguna,
      getSekolahPengguna: actions.getSekolahPengguna,
      getMapel: actions.getMapel,
      getWilayah: actions.getWilayah,
      getWilayahHirarki: actions.getWilayahHirarki,
      generateUUID: actions.generateUUID,
      uploadDokumenGuru: actions.uploadDokumenGuru,
      getJenisBerkas: actions.getJenisBerkas
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Guru }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        guru: Guru.guru,
        pengguna: App.pengguna,
        sekolah_pengguna: Sekolah.sekolah_pengguna,
        mapel: App.mapel,
        wilayah: App.wilayah,
        wilayah_hirarki: app.wilayah_hirarki
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahDokumenGuru));
  