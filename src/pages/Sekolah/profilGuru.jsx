import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class profilGuru extends Component {
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
        status_perkawinan: {
            rows: [],
            total: 0
        },
        status_kepegawaian: {
            rows: [],
            total: 0
        },
        lembaga_pengangkat: {
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

    componentDidMount = () => {

        //what to do after mount
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: {...this.props.pengguna.rows[0], agama: (parseInt(this.props.pengguna.rows[0].agama_id) === 1 ? 'Islam' : (parseInt(this.props.pengguna.rows[0].agama_id) === 2 ? 'Kristen' : (parseInt(this.props.pengguna.rows[0].agama_id) === 3 ? 'Katholik' : (parseInt(this.props.pengguna.rows[0].agama_id) === 4 ? 'Hindu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 5 ? 'Budha' : (parseInt(this.props.pengguna.rows[0].agama_id) === 6 ? 'Konghucu' : (parseInt(this.props.pengguna.rows[0].agama_id) === 7 ? 'Kepercayaan' : '-')))))))}
            },()=>{
                if(this.state.pengguna.kode_wilayah){

                    this.props.getWilayahHirarki({kode_wilayah:this.state.pengguna.kode_wilayah, id_level_wilayah: 3}).then((result)=>{
                        // console.log(result.payload[0])
                        this.setState({
                            wilayah: result.payload[0]
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

            this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                this.setState({
                    provinsi: this.props.wilayah.rows,
                    guru: {
                        ...this.props.guru.rows[0]
                        // pengguna_id: this.state.routeParams.pengguna_id,
                        // sekolah_id: this.state.routeParams.sekolah_id
                    },
                    routeParamsPengguna: {
                        pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
                    }
                })
            })

            // if(this.props.guru.total > 0){

            //     this.setState({
            //         // guru: this.props.guru.rows[0],
            //         guru: {
            //             ...this.props.guru.rows[0]
            //             // pengguna_id: this.state.routeParams.pengguna_id,
            //             // sekolah_id: this.state.routeParams.sekolah_id
            //         },
            //         routeParamsPengguna: {
            //             pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
            //         }
            //     },()=>{
            //         // console.log(this.state.guru);

            //         // this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
            //         //     this.setState({
            //         //         provinsi: this.props.wilayah.rows
            //         //     })
            //         // })
            //     });

            // }
        });

        this.props.getMapel(this.state.routeParams).then((result)=>{
            this.props.getRef({nama_tabel: 'status_perkawinan'}).then((result)=>{
                this.setState({
                    status_perkawinan: result.payload
                },()=>{
                    this.props.getRef({nama_tabel: 'status_kepegawaian'}).then((result)=>{
                        this.setState({
                            status_kepegawaian: result.payload
                        },()=>{
                            this.props.getRef({nama_tabel: 'lembaga_pengangkat'}).then((result)=>{
                                this.setState({
                                    lembaga_pengangkat: result.payload
                                })
                            })
                        })
                    })
                })
            })
        });
        
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
                                        this.$f7.dialog.alert('Simpan Profil Guru Berhasil', 'Berhasil',()=>{
                                            this.props.getPengguna(this.state.routeParams)
                                        });
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

    render()
    {
        return (
            <Page name="profilGuru" hideBarsOnScroll style={{paddingBottom:'60px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.props.pengguna.rows[0].nama}</NavTitle>
                </Navbar>
                {/* <br/> */}
                {/* <BlockTitle>Profil di {this.state.sekolah_pengguna.nama_sekolah}</BlockTitle> */}
                <Segmented raised style={{marginLeft:'16px', marginRight:'16px', marginTop:'16px'}} className="bawahCiriAbu">
                    <Button tabLink="#tab-1-1" tabLinkActive>Profil</Button>
                    <Button tabLink="#tab-1-2" onClick={()=>this.$f7router.navigate('/dokumenGuru/'+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id'])}>Dokumen</Button>
                </Segmented>
                <Row noGap>
                    <Col width="100" tabletWidth="70">
                        &nbsp;
                    </Col>
                    <Col width="100" tabletWidth="50">
                        {!this.state.profilEdit &&
                        <Card>
                            <CardContent>
                                <List>
                                    <ListItem header="Nama" title={this.state.pengguna.nama ? this.state.pengguna.nama : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="NIK" title={this.state.pengguna.nik ? this.state.pengguna.nik : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="No.KK" title={this.state.pengguna.no_kk ? this.state.pengguna.no_kk : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Tempat Lahir" title={this.state.pengguna.tempat_lahir ? this.state.pengguna.tempat_lahir : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Tanggal Lahir" title={this.state.pengguna.tanggal_lahir ? this.state.pengguna.tanggal_lahir : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Jenis Kelamin" title={this.state.pengguna.jenis_kelamin ? this.state.pengguna.jenis_kelamin : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Agama" title={this.state.pengguna.agama ? this.state.pengguna.agama : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Alamat" title={this.state.pengguna.alamat ? this.state.pengguna.alamat : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="RT" title={this.state.pengguna.rt ? this.state.pengguna.rt : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="RW" title={this.state.pengguna.rw ? this.state.pengguna.rw : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Nama Dusun" title={this.state.pengguna.nama_dusun ? this.state.pengguna.nama_dusun : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Desa/Kelurahan" title={this.state.pengguna.desa_kelurahan ? this.state.pengguna.desa_kelurahan : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Kecamatan" title={this.state.wilayah ? this.state.wilayah.kecamatan : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Kabupaten" title={this.state.wilayah ? this.state.wilayah.kabupaten : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Provinsi" title={this.state.wilayah ? this.state.wilayah.provinsi : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    
                                </List>
                            </CardContent>
                        </Card>
                        }
                        {this.state.profilEdit &&
                        <>
                        <Card>
                            {/* <CardHeader>
                                Identitas
                            </CardHeader> */}
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="Nama"
                                        type="text"
                                        placeholder="Nama"
                                        clearButton
                                        value={this.state.pengguna.nama || ''}
                                        onChange={this.setValuePengguna('nama')}
                                    />
                                    <ListInput
                                        label="NIK"
                                        type="text"
                                        placeholder="NIK"
                                        clearButton
                                        value={this.state.pengguna.nik || ''}
                                        onChange={this.setValuePengguna('nik')}
                                    />
                                    <ListInput
                                        label="No. KK"
                                        type="text"
                                        placeholder="No. KK"
                                        clearButton
                                        value={this.state.pengguna.no_kk || ''}
                                        onChange={this.setValuePengguna('no_kk')}
                                    />
                                    <ListInput
                                        label="Tempat Lahir"
                                        type="text"
                                        placeholder="Tempat Lahir"
                                        clearButton
                                        value={this.state.pengguna.tempat_lahir || ''}
                                        onChange={this.setValuePengguna('tempat_lahir')}
                                    />
                                    <ListInput
                                        label="Tanggal Lahir"
                                        type="date"
                                        placeholder="Tanggal Lahir"
                                        value={this.state.pengguna.tanggal_lahir || ''}
                                        onChange={this.setValuePengguna('tanggal_lahir')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListItem
                                        title={"Jenis Kelamin"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="jenis_kelamin" defaultValue={0} onChange={this.setValuePengguna('jenis_kelamin')}>
                                            <option disabled value={0}>-</option>
                                            <option key={1} value={'L'}>Laki-laki</option>
                                            <option key={2} value={'P'}>Perempuan</option>
                                        </select>
                                    </ListItem>
                                    <ListItem
                                        title={"Agama"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="agama_id" defaultValue={0} onChange={this.setValuePengguna('agama_id')}>
                                            <option disabled value={0}>-</option>
                                            <option key={1} value={1}>Islam</option>
                                            <option key={2} value={2}>Kristen</option>
                                            <option key={2} value={3}>Katholik</option>
                                            <option key={2} value={4}>Hindu</option>
                                            <option key={2} value={5}>Budha</option>
                                            <option key={2} value={6}>Konghucu</option>
                                            <option key={2} value={7}>Kepercayaan</option>
                                        </select>
                                    </ListItem>
                                    <ListInput
                                        label="Alamat"
                                        type="text"
                                        placeholder="Alamat"
                                        clearButton
                                        value={this.state.pengguna.alamat || ''}
                                        onChange={this.setValuePengguna('alamat')}
                                    />
                                    <ListInput
                                        label="RT"
                                        type="text"
                                        placeholder="RT..."
                                        clearButton
                                        value={this.state.pengguna.rt || ''}
                                        onChange={this.setValuePengguna('rt')}
                                    />
                                    <ListInput
                                        label="RW"
                                        type="text"
                                        placeholder="RW..."
                                        clearButton
                                        value={this.state.pengguna.rw || ''}
                                        onChange={this.setValuePengguna('rw')}
                                    />
                                    <ListInput
                                        label="Nama Dusun"
                                        type="text"
                                        placeholder="Nama Dusun..."
                                        clearButton
                                        value={this.state.pengguna.nama_dusun || ''}
                                        onChange={this.setValuePengguna('nama_dusun')}
                                    />
                                    <ListInput
                                        label="Desa/Kelurahan"
                                        type="text"
                                        placeholder="Desa/Kelurahan..."
                                        clearButton
                                        value={this.state.pengguna.desa_kelurahan || ''}
                                        onChange={this.setValuePengguna('desa_kelurahan')}
                                    />
                                    <ListInput
                                        label="Kode Pos"
                                        type="text"
                                        placeholder="Kode Pos..."
                                        clearButton
                                        value={this.state.pengguna.kode_pos || ''}
                                        onChange={this.setValuePengguna('kode_pos')}
                                    />
                                    <ListInput
                                        label="Provinsi"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Pilih provinsi..."
                                        onChange={this.setValuePengguna('kode_wilayah_provinsi')}
                                    >
                                        {this.state.provinsi.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Kabupaten/Kota"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Pilih kabupaten/kota..."
                                        onChange={this.setValuePengguna('kode_wilayah_kabupaten')}
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
                                        defaultValue={"0"}
                                        placeholder="Pilih kecamatan..."
                                        onChange={this.setValuePengguna('kode_wilayah')}
                                    >
                                        {this.state.kecamatan.map((option)=>{
                                            return (
                                                <option value={option.kode_wilayah}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    {/* <ListItem
                                        title={"Provinsi"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="kode_wilayah_provinsi" defaultValue={0} onChange={this.setValuePengguna('kode_wilayah_provinsi')}>
                                            <option disabled value={0}>-</option>
                                            {this.state.provinsi.map((option)=>{
                                                return (
                                                    <option value={option.kode_wilayah}>{option.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </ListItem> */}
                                    {/* <ListItem
                                        title={"Kabupaten"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="kode_wilayah_kabupaten" defaultValue={0} onChange={this.setValuePengguna('kode_wilayah_kabupaten')}>
                                            <option disabled value={0}>-</option>
                                            {this.state.kabupaten.map((option)=>{
                                                return (
                                                    <option value={option.kode_wilayah}>{option.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </ListItem> */}
                                    {/* <ListItem
                                        title={"Kecamatan"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="kode_wilayah" defaultValue={0} onChange={this.setValuePengguna('kode_wilayah')}>
                                            <option disabled value={0}>-</option>
                                            {this.state.kecamatan.map((option)=>{
                                                return (
                                                    <option value={option.kode_wilayah}>{option.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </ListItem> */}
                                </List>
                            </CardContent>
                        </Card>
                        </>
                        }
                    </Col>
                    <Col width="100" tabletWidth="50">

                        {!this.state.profilEdit &&
                        <Card>
                            <CardContent>
                                <List>
                                    <ListItem header="NPWP" title={this.state.pengguna.npwp ? this.state.pengguna.npwp : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Nama Wajib Pajak" title={this.state.pengguna.nama_wajib_pajak ? this.state.pengguna.nama_wajib_pajak : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Status Perkawinan" title={this.state.pengguna.status_perkawinan ? this.state.pengguna.status_perkawinan : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    
                                </List>
                            </CardContent>
                        </Card>
                        }
                        {!this.state.profilEdit &&
                        <Card>
                            <CardContent>
                                <List>
                                    <ListItem header="Status Kepegawaian" title={this.state.guru.status_kepegawaian ? this.state.guru.status_kepegawaian : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="NIP" title={this.state.guru.nip ? this.state.guru.nip : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="NUPTK" title={this.state.guru.nuptk ? this.state.guru.nuptk : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="NIY" title={this.state.guru.niy ? this.state.guru.niy : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="NPK" title={this.state.guru.npk ? this.state.guru.npk : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Jenis Guru" title={this.state.guru.jenis_guru ? this.state.guru.jenis_guru : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Mata Pelajaran" title={this.state.guru.mata_pelajaran ? this.state.guru.mata_pelajaran : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Nomor Surat Tugas" title={this.state.guru.nomor_surat_tugas ? this.state.guru.nomor_surat_tugas : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Tanggal Surat Tugas" title={this.state.guru.tanggal_surat_tugas ? this.state.guru.tanggal_surat_tugas : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="SK Pengangkatan" title={this.state.guru.sk_pengangkatan ? this.state.guru.sk_pengangkatan : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="TMT Pengangkatan" title={this.state.guru.tmt_pengangkatan ? this.state.guru.tmt_pengangkatan : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Lembaga Pengangkat" title={this.state.guru.lembaga_pengangkat ? this.state.guru.lembaga_pengangkat : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="SK CPNS" title={this.state.guru.sk_cpns ? this.state.guru.sk_cpns : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="TMT CPNS" title={this.state.guru.tmt_cpns ? this.state.guru.tmt_cpns : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                    <ListItem header="Masa Kerja (Tahun)" title={this.state.guru.masa_kerja ? this.state.guru.masa_kerja : '-'}>
                                        <i className="icons f7-icons" slot="media">square_list</i>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        }
                        {this.state.profilEdit &&
                        <>
                        <Card>
                            {/* <CardHeader>
                                Identitas
                            </CardHeader> */}
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="NPWP"
                                        type="text"
                                        placeholder="NPWP..."
                                        clearButton
                                        value={this.state.pengguna.npwp || ''}
                                        onChange={this.setValuePengguna('npwp')}
                                    />
                                    <ListInput
                                        label="Nama Wajib Pajak"
                                        type="text"
                                        placeholder="Nama Wajib Pajak..."
                                        clearButton
                                        value={this.state.pengguna.nama_wajib_pajak || ''}
                                        onChange={this.setValuePengguna('nama_wajib_pajak')}
                                    />
                                    <ListInput
                                        label="Status Perkawinan"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Pilih status perkawinan..."
                                        onChange={this.setValuePengguna('status_perkawinan_id')}
                                    >
                                        {this.state.status_perkawinan.rows.map((option)=>{
                                            return (
                                                <option value={option.status_perkawinan_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                </List>
                            </CardContent>
                        </Card>
                        </>
                        }
                        {this.state.profilEdit &&
                        <>
                        <Card>
                            {/* <CardHeader>
                                Identitas
                            </CardHeader> */}
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="Status Kepegawaian"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Status Kepegawaian..."
                                        onChange={this.setValue('status_kepegawaian_id')}
                                    >
                                        {this.state.status_kepegawaian.rows.map((option)=>{
                                            return (
                                                <option value={option.status_kepegawaian_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="NIP"
                                        type="number"
                                        placeholder="NIP"
                                        clearButton
                                        value={this.state.guru.nip || ''}
                                        onChange={this.setValue('nip')}
                                    />
                                    <ListInput
                                        label="NUPTK"
                                        type="number"
                                        placeholder="NUPTK"
                                        clearButton
                                        value={this.state.guru.nuptk || ''}
                                        onChange={this.setValue('nuptk')}
                                    />
                                    <ListInput
                                        label="NIY"
                                        type="number"
                                        placeholder="NIY"
                                        clearButton
                                        value={this.state.guru.niy || ''}
                                        onChange={this.setValue('niy')}
                                    />
                                    <ListInput
                                        label="NPK"
                                        type="number"
                                        placeholder="NPK"
                                        clearButton
                                        value={this.state.guru.npk || ''}
                                        onChange={this.setValue('npk')}
                                    />
                                    <ListItem
                                        title={"Jenis Guru"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="jenis_guru_id" defaultValue={0} onChange={this.setValue('jenis_guru_id')}>
                                            <option disabled value={0}>-</option>
                                            <option key={1} value={1}>Guru Kelas</option>
                                            <option key={2} value={2}>Guru Mata Pelajaran</option>
                                            <option key={3} value={3}>Guru BP/BK</option>
                                            {/* {rows.map((option)=>{
                                                return (
                                                    <option key={option.jenjang_id} value={option.jenjang_id}>{option.nama}</option>
                                                )
                                            })} */}
                                        </select>
                                    </ListItem>
                                    <ListItem
                                        title={"Mata Pelajaran"}
                                        smartSelect
                                        smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select name="mata_pelajaran_id" defaultValue={0} onChange={this.setValue('mata_pelajaran_id')}>
                                            <option disabled value={0}>-</option>
                                            {/* <option key={1} value={1}>Guru Kelas</option>
                                            <option key={2} value={2}>Guru Mata Pelajaran</option>
                                            <option key={3} value={3}>Guru BP/BK</option> */}
                                            {/* {rows.map((option)=>{
                                                return (
                                                    <option key={option.jenjang_id} value={option.jenjang_id}>{option.nama}</option>
                                                )
                                            })} */}
                                            {this.props.mapel.map((option)=>{
                                                return (
                                                    <option key={option.mata_pelajaran_id} value={option.mata_pelajaran_id}>{option.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </ListItem>
                                    <ListInput
                                        label="Nomor Surat Tugas"
                                        type="text"
                                        placeholder="Nomor Surat Tugas"
                                        clearButton
                                        value={this.state.guru.nomor_surat_tugas || ''}
                                        onChange={this.setValue('nomor_surat_tugas')}
                                    />
                                    <ListInput
                                        label="Tanggal Surat Tugas"
                                        type="date"
                                        placeholder="Tanggal Surat Tugas"
                                        value={this.state.guru.tanggal_surat_tugas || ''}
                                        onChange={this.setValue('tanggal_surat_tugas')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="SK Pengangkatan"
                                        type="text"
                                        placeholder="SK Pengangkatan..."
                                        clearButton
                                        value={this.state.guru.sk_pengangkatan || ''}
                                        onChange={this.setValue('sk_pengangkatan')}
                                    />
                                    <ListInput
                                        label="TMT Pengangkatan"
                                        type="date"
                                        placeholder="TMT Pengangkatan"
                                        value={this.state.guru.tmt_pengangkatan || ''}
                                        onChange={this.setValue('tmt_pengangkatan')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Lembaga Pengangkat"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Lembaga Pengangkat..."
                                        onChange={this.setValue('lembaga_pengangkat_id')}
                                    >
                                        {this.state.lembaga_pengangkat.rows.map((option)=>{
                                            return (
                                                <option value={option.lembaga_pengangkat_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="SK CPNS"
                                        type="text"
                                        placeholder="SK CPNS..."
                                        clearButton
                                        value={this.state.guru.sk_cpns || ''}
                                        onChange={this.setValue('sk_cpns')}
                                    />
                                    <ListInput
                                        label="TMT CPNS"
                                        type="date"
                                        placeholder="TMT CPNS"
                                        value={this.state.guru.tmt_cpns || ''}
                                        onChange={this.setValue('tmt_cpns')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Masa Kerja (Tahun)"
                                        type="number"
                                        placeholder="Masa Kerja (Tahun)"
                                        clearButton
                                        value={this.state.guru.masa_kerja || ''}
                                        onChange={this.setValue('masa_kerja')}
                                    />
                                </List>
                            </CardContent>
                        </Card>
                        </>
                        }
                    </Col>
                    {this.state.profilEdit &&
                    <Col width="100" tabletWidth="50">
                        <Card>
                            <CardContent>
                                <Button raised fill className="bawahCiriBiru cardBorder-20" onClick={this.simpanGuru}>
                                    <i className="icons f7-icons iconNormal" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    </Col>
                    }
                    <Col width="100" tabletWidth="50" style={{padding:'8px'}}>
                        {!this.state.profilEdit &&
                        <Button className="bawahCiriBiru" raised fill onClick={()=>this.setState({profilEdit:true})}>Edit</Button>
                        }
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
      getRef: actions.getRef
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

export default (connect(mapStateToProps, mapDispatchToProps)(profilGuru));
  