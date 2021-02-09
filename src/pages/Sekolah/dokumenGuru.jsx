import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class dokumenGuru extends Component {
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
        dokumen_guru: {
            total: 0,
            rows: []
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

        //what to do after mount
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: {...this.props.pengguna.rows[0], agama: (parseInt(this.props.pengguna.rows[0].agama_id) === 1 ? 'Islam' : (parseInt(this.props.pengguna.rows[0].agama_id) === 2 ? 'Kristen' : (parseInt(this.props.pengguna.rows[0].agama_id) === 3 ? 'Katholik' : (parseInt(this.props.pengguna.rows[0].agama_id) === 4 ? 'Hindu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 5 ? 'Budha' : (parseInt(this.props.pengguna.rows[0].agama_id) === 6 ? 'Konghucu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 7 ? 'Kepercayaan' : '-')))))))}
            },()=>{
                // if(this.state.pengguna.kode_wilayah){

                //     this.props.getWilayahHirarki({kode_wilayah:this.state.pengguna.kode_wilayah, id_level_wilayah: 3}).then((result)=>{
                //         // console.log(result.payload[0])
                //         this.setState({
                //             wilayah: result.payload[0]
                //         })
                //     })

                // }
                this.props.getDokumenGuru(this.state.routeParams).then((result)=>{
                    this.setState({
                        dokumen_guru: result.payload
                    })
                })
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
        this.$f7router.navigate('/tambahDokumenGuru/'+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id'])
    }

    klikBerkas= () => {

    }

    hapusDokumen = (dokumen_guru_id, pengguna_id, sekolah_id) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus berkasi ini?','Konfirmasi Hapus', ()=>{

            this.props.uploadDokumenGuru({
                dokumen_guru_id: dokumen_guru_id, 
                pengguna_id: pengguna_id, 
                sekolah_id: sekolah_id, 
                soft_delete: 1
            }).then((result)=>{
                if(result.payload.sukses){
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Hapus berkas berhasil!', 'Berhasil');
    
                    this.props.getDokumenGuru(this.state.routeParams).then((result)=>{
                        this.setState({
                            dokumen_guru: result.payload
                        })
                    })
                }
            })

        })

    }

    render()
    {
        return (
            <Page name="dokumenGuru" hideBarsOnScroll style={{paddingBottom:'60px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.props.pengguna.rows[0].nama}</NavTitle>
                </Navbar>
                {/* <br/> */}
                {/* <BlockTitle>Profil di {this.state.sekolah_pengguna.nama_sekolah}</BlockTitle> */}
                <Segmented raised style={{marginLeft:'16px', marginRight:'16px', marginTop:'16px'}} className="bawahCiriAbu">
                    <Button tabLink="#tab-1-1" onClick={()=>this.$f7router.navigate('/profilGuru/'+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id'])}>Profil</Button>
                    <Button tabLink="#tab-1-2" tabLinkActive>Dokumen</Button>
                </Segmented>
                
                <Row noGap>
                    <Col width="100" tabletWidth="100">
                        <Card style={{marginTop:'32px'}}>
                            <CardContent>
                                <BlockTitle style={{marginTop:'0px'}}>Arsip Dokumen {this.state.pengguna.nama}</BlockTitle>
                                {/* <div> */}
                                    <Row noGap style={{justifyContent:'flex-start'}}>
                                        {this.state.dokumen_guru.rows.map((option)=>{
                                            return (
                                                <Col width="50" tabletWidth="25">
                                                    
                                                        {/* <Card style={{width:'150px', height:'150px', border:'1px solid #ccc'}}> */}
                                                        <Card style={{border:'1px solid #ccc', minHeight:'150px'}}>
                                                            <CardContent style={{textAlign:'center', padding:'8px', overflow:'hidden'}}>
                                                            <Button fill small className=" color-theme-orange buttonHapusDokumen" onClick={()=>this.hapusDokumen(option.dokumen_guru_id, option.pengguna_id, option.sekolah_id)}>
                                                                <i className="icons f7-icons" style={{right:'10px'}}>trash</i>&nbsp;
                                                                Hapus
                                                            </Button>
                                                            <div style={{minHeight:'150px'}}>

                                                                <Link onClick={this.klikBerkas} style={{width:'100%'}}>
                                                                {
                                                                    option.nama_file !== '' && 
                                                                    (
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'jpg' || 
                                                                        option.nama_file.substr(option.nama_file.length - 4) === 'jpeg' || 
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'png'
                                                                    ) &&
                                                                <>
                                                                <img style={{height:'120px'}} src={localStorage.getItem('api_base')+option.nama_file} />
                                                                </>
                                                                }
                                                                {
                                                                    option.nama_file !== '' && 
                                                                    (
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'xls' || 
                                                                        option.nama_file.substr(option.nama_file.length - 4) === 'xlsx'
                                                                    ) &&
                                                                <>
                                                                <div style={{border:'0px dashed #ccc', borderRadius:'20px', padding:'8px', overflow:'hidden'}}>
                                                                    <img style={{height:'60px'}} src={"https://img.icons8.com/color/452/microsoft-excel-2019--v1.png"} /><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.caption}</b>
                                                                </div>
                                                                
                                                                </>
                                                                }
                                                                {
                                                                    option.nama_file !== '' && 
                                                                    (
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'doc' || 
                                                                        option.nama_file.substr(option.nama_file.length - 4) === 'docx'
                                                                    ) &&
                                                                <>
                                                                <div style={{border:'0px dashed #ccc', borderRadius:'20px', padding:'8px', overflow:'hidden'}}>
                                                                    <img style={{height:'60px'}} src={"https://cdn.iconscout.com/icon/free/png-256/microsoft-word-1411849-1194338.png"} /><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.caption}</b>
                                                                </div>
                                                                
                                                                </>
                                                                }
                                                                {
                                                                    option.nama_file !== '' && 
                                                                    (
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'ppt' || 
                                                                        option.nama_file.substr(option.nama_file.length - 4) === 'pptx'
                                                                    ) &&
                                                                <>
                                                                <div style={{border:'0px dashed #ccc', borderRadius:'20px', padding:'8px', overflow:'hidden'}}>
                                                                    <img style={{height:'60px'}} src={"https://image.flaticon.com/icons/png/512/732/732224.png"} /><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.caption}</b>
                                                                </div>
                                                                
                                                                </>
                                                                }
                                                                {
                                                                    option.nama_file !== '' && 
                                                                    (
                                                                        option.nama_file.substr(option.nama_file.length - 3) === 'pdf'
                                                                    ) &&
                                                                <>
                                                                <div style={{border:'0px dashed #ccc', borderRadius:'20px', padding:'8px', overflow:'hidden'}}>
                                                                    <img style={{height:'60px'}} src={"https://cdn4.iconfinder.com/data/icons/file-extensions-1/64/pdfs-512.png"} /><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.caption}</b>
                                                                </div>
                                                                
                                                                </>
                                                                }
                                                                </Link>
                                                                <h4 style={{marginTop:'0px', marginBottom:'0px'}}>{option.jenis_berkas}</h4>
                                                            </div>                                                            
                                                            <div className="keteranganBerkas">
                                                                Diunggah tanggal: {option.create_date}
                                                            </div>
                                                            </CardContent>
                                                        </Card>
                                                </Col>
                                            )
                                        })}
                                        <Col width="50" tabletWidth="25">
                                            <Link onClick={this.kliktambah} style={{width:'100%'}}>
                                                <Card style={{minHeight:'140px', border:'5px dashed #ccc', width:'100%'}}>
                                                    <CardContent style={{textAlign:'center', minHeight:'140px'}}>
                                                        <i className="icons f7-icons" style={{fontSize:'80px', color:'#ccc'}}>plus</i>
                                                        <br/>
                                                        <span style={{color:'#434343'}}>
                                                            Tambah Dokumen
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </Col>
                                    </Row>
                                {/* </div> */}
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
      getDokumenGuru: actions.getDokumenGuru,
      uploadDokumenGuru: actions.uploadDokumenGuru
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

export default (connect(mapStateToProps, mapDispatchToProps)(dokumenGuru));
  