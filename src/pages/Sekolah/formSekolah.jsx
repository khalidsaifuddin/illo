import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import Dropzone from 'react-dropzone';

class formSekolah extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            tipe_sekolah_id: 1,
            // kode_wilayah_provinsi: '010000'
        },
        gambar_latar_sekolah: '',
        file_gambar_latar_sekolah: '',
        gambar_logo_sekolah: '',
        file_gambar_logo_sekolah: '',
        provinsi: [],
        kabupaten: [],
        kecamatan: [],
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

        if(!this.state.routeParams.sekolah_id){
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        sekolah_id: this.props.uuid_kuis
                    }
                },()=>{
                    console.log(this.state);

                    this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                        this.setState({
                            provinsi: result.payload.rows                            
                        },()=>{
                            
                        })
                    })
                })
            })
        }else{

            this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                this.setState({
                    provinsi: result.payload.rows                            
                },()=>{

                    console.log(this.state)
                    
                    this.props.getSekolah(this.state.routeParams).then((result)=>{
                        this.setState({
                            // routeParams: {
                            //     ...this.state.routeParams,
                            //     ...this.props.sekolah.rows[0]
                            // },
                            gambar_latar_sekolah: this.props.sekolah.rows[0].gambar_latar,
                            file_gambar_latar_sekolah: this.props.sekolah.rows[0].gambar_latar,
                            gambar_logo_sekolah: this.props.sekolah.rows[0].gambar_logo,
                            file_gambar_logo_sekolah: this.props.sekolah.rows[0].gambar_logo,
                            // provinsi: [{kode_wilayah: this.state.routeParams.kode_wilayah_provinsi, nama: this.state.routeParams.provinsi}],
                            kabupaten: [{kode_wilayah: this.props.sekolah.rows[0].kode_wilayah_kabupaten, nama: this.props.sekolah.rows[0].kabupaten}],
                            kecamatan: [{kode_wilayah: this.props.sekolah.rows[0].kode_wilayah_kecamatan, nama: this.props.sekolah.rows[0].kecamatan}]
                        },()=>{

                            this.setState({
                                routeParams: {
                                    ...this.state.routeParams,
                                    ...this.props.sekolah.rows[0]
                                }
                            },()=>{
                                // console.log(this.state.kabupaten[0])
                            })
        
                            // console.log(this.state)
        
                        })
                    })

                })
            })
        }

    }

    acceptedFile = (file) => {
        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
            
            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    gambar_latar_sekolah: file[0].name,
                    // loading: true,
                    guid_gambar: this.props.uuid_kuis,
                    routeParams:{
                        ...this.state.routeParams,
                        // gambar_latar_sekolah: file[0].name
                        gambar_latar_sekolah: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    }
                },()=>{
    
                    // this.props.setKuis(this.state.routeParams);
                    //uploading
                    // const formData = new FormData();
                    // console.log(this.state.routeParams);

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
                            data.append('jenis', 'gambar_latar_sekolah');
                            xhr.send(data);
                        }
                    );

                    // });
                    // formData.append('avatar',file[0]);
                    // console.log(localStorage.getItem('api_base') + '/api/Ruang/upload');
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
                file_gambar_latar_sekolah: response.filename,
                loading: false
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

    acceptedFileLogo = (file) => {
        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
            
            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    gambar_logo_sekolah: file[0].name,
                    // loading: true,
                    guid_gambar: this.props.uuid_kuis,
                    routeParams:{
                        ...this.state.routeParams,
                        // gambar_logo_sekolah: file[0].name
                        gambar_logo_sekolah: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    }
                },()=>{
    
                    // this.props.setKuis(this.state.routeParams);
                    //uploading
                    // const formData = new FormData();
                    // console.log(this.state.routeParams);

                    return new Promise(
                        (resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                            xhr.onload = this.uploadBerhasilLogo;
                            xhr.onerror = this.uploadGagal;
                            const data = new FormData();
                            data.append('image', file[0]);
                            data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                            data.append('guid', this.state.guid_gambar);
                            data.append('jenis', 'gambar_logo_sekolah');
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

    simpanSekolah = () => {
        // this.$f7.dialog.load
        this.$f7.dialog.preloader();

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                gambar_latar: this.state.file_gambar_latar_sekolah,
                gambar_logo: this.state.file_gambar_logo_sekolah
            }
        },()=>{
            this.props.simpanSekolah(this.state.routeParams).then((result)=>{
                this.$f7.dialog.close();

                this.$f7router.navigate('/kelolaSekolah/');
            });
        });
    }

    setSelectValue = (b) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tipe_sekolah_id: b.target.value
            }
        });
    }

    render()
    {
        return (
            <Page name="formSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                <NavTitle sliding>{this.$f7route.params['sekolah_id'] ? 'Ubah' : 'Tambah'} Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10"></Col>
                    <Col width="100" tabletWidth="80">
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent>
                                <List form style={{minWidth:'100%'}} noHairlines>
                                    <ListItem
                                        title="Tipe"
                                        info="Tipe dari sekolah"
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="tipe_sekolah_id" defaultValue={this.state.routeParams.tipe_sekolah_id} onChange={this.setSelectValue}>
                                            {/* <option value={99} disabled>-</option> */}
                                            <option value={1}>Sekolah</option>
                                            <option value={5}>Boarding School / Pondok Pesantren</option>
                                            <option value={2}>Kursus</option>
                                            <option value={3}>Komunitas</option>
                                            <option value={4}>Umum</option>
                                        </select>
                                    </ListItem>
                                    <ListInput
                                        type="text"
                                        name="nama"
                                        placeholder="Nama Sekolah ...."
                                        label='Nama Sekolah'
                                        noHairlines
                                        disabled={(this.state.loading ? true : false)}
                                        defaultValue={this.state.routeParams.nama}
                                        onInput={(e) => this.setState({routeParams:{...this.state.routeParams,nama: e.target.value}})}
                                    ></ListInput>
                                    <ListInput
                                        type="text"
                                        name="keterangan"
                                        placeholder="Keterangan Sekolah ...."
                                        label='Keterangan Sekolah'
                                        noHairlines
                                        disabled={(this.state.loading ? true : false)}
                                        defaultValue={this.state.routeParams.keterangan}
                                        onInput={(e) => this.setState({routeParams:{...this.state.routeParams,keterangan: e.target.value}})}
                                    ></ListInput>
                                    <ListInput
                                        type="text"
                                        name="npsn"
                                        placeholder="NPSN/NILEK (Bila Ada)...."
                                        label='NPSN/NILEK (Bila Ada)'
                                        noHairlines
                                        disabled={(this.state.loading ? true : false)}
                                        defaultValue={this.state.routeParams.npsn}
                                        onInput={(e) => this.setState({routeParams:{...this.state.routeParams,npsn: e.target.value}})}
                                    ></ListInput>
                                    <ListInput
                                        type="textarea"
                                        name="alamat"
                                        placeholder="Alamat...."
                                        label='Alamat'
                                        noHairlines
                                        disabled={(this.state.loading ? true : false)}
                                        defaultValue={this.state.routeParams.alamat}
                                        onInput={(e) => this.setState({routeParams:{...this.state.routeParams,alamat: e.target.value}})}
                                    ></ListInput>
                                    {/* <ListItem title="Provinsi">
                                        <select slot="after">
                                            <option value="0" disabled>-</option>
                                            <option value="1">1</option>
                                        </select>
                                    </ListItem> */}
                                    <ListInput
                                        label="Provinsi"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_provinsi ? this.state.routeParams.kode_wilayah_provinsi : "0"}
                                        placeholder="Pilih provinsi..."
                                        onChange={(e) => {
                                            this.setState({
                                                routeParams:{...this.state.routeParams,kode_wilayah_provinsi: e.target.value}
                                            },()=>{
                                                this.props.getWilayah({id_level_wilayah:2, mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
                                                    this.setState({
                                                        kabupaten: result.payload.rows
                                                    })
                                                })
                                            })
                                        }}
                                    >
                                        <option value={0} disabled>-</option>
                                        {this.state.provinsi.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kabupaten/Kota"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kabupaten ? this.state.routeParams.kode_wilayah_kabupaten : "0"}
                                        placeholder="Pilih kabupaten/kota..."
                                        onChange={(e) => {
                                            this.setState({
                                                routeParams:{...this.state.routeParams,kode_wilayah_kabupaten: e.target.value}
                                            },()=>{
                                                this.props.getWilayah({id_level_wilayah:3, mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
                                                    this.setState({
                                                        kecamatan: result.payload.rows
                                                    })
                                                })
                                            })
                                        }}
                                    >
                                        {this.state.kabupaten.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kecamatan"
                                        type="select"
                                        value={this.state.routeParams.kode_wilayah_kecamatan ? this.state.routeParams.kode_wilayah_kecamatan : "0"}
                                        placeholder="Pilih kecamatan..."
                                        onChange={(e) => this.setState({routeParams:{...this.state.routeParams,kode_wilayah_kecamatan: e.target.value}})}
                                    >
                                        {this.state.kecamatan.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                </List>

                                <BlockTitle>Upload Gambar Latar Sekolah</BlockTitle>
                                <Dropzone className="droping" onDrop={this.acceptedFile}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_latar_sekolah !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                            <input {...getInputProps()} />
                                            {this.state.file_gambar_latar_sekolah === '' &&
                                            <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                            }
                                            {this.state.file_gambar_latar_sekolah !== '' &&
                                            <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_latar_sekolah} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_latar_sekolah === '' &&
                                            <>
                                            <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_latar_sekolah !== '' && this.state.file_gambar_latar_sekolah === '' &&
                                            <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_latar_sekolah}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                        </div>
                                    </section>
                                )}
                                </Dropzone>

                                <BlockTitle>Upload Gambar Logo Sekolah</BlockTitle>
                                <Dropzone className="droping" onDrop={this.acceptedFileLogo}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_latar_sekolah !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                            <input {...getInputProps()} />
                                            {this.state.file_gambar_logo_sekolah === '' &&
                                            <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                            }
                                            {this.state.file_gambar_logo_sekolah !== '' &&
                                            <>
                                            <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_logo_sekolah} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_logo_sekolah === '' &&
                                            <>
                                            <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_logo_sekolah !== '' && this.state.file_gambar_logo_sekolah === '' &&
                                            <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_logo_sekolah}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                        </div>
                                    </section>
                                )}
                                </Dropzone>
                                <br/>
                                <Button raised fill large onClick={this.simpanSekolah} className="bawahCiriBiru">
                                    Simpan
                                </Button>           
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      simpanSekolah: actions.simpanSekolah,
      generateUUID: actions.generateUUID,
      getSekolah: actions.getSekolah,
      getWilayah: actions.getWilayah,
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,
        sekolah: Sekolah.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(formSekolah));
  