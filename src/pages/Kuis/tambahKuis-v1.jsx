import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, List, ListInput, BlockTitle, Card, CardHeader, CardContent, Row, Col, Sheet, PageContent, ListItem
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import PanelPertanyaan from './panelPertanyaan';

import Dropzone from 'react-dropzone';

class tambahKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'] ? this.$f7route.params['kuis_id'] : null,
            ruang_id: this.$f7route.params['ruang_id'] ? this.$f7route.params['ruang_id'] : 'N',
            waktu_mulai: '',
            waktu_selesai: ''
        },
        listPertanyaan: [],
        sekuen_pertanyaan: 0,
        sheetOpened: false,
        labelTombolSimpan: 'Simpan',
        smartSelectJenjang: (<></>),
        gambar_kuis: '',
        file_gambar_kuis: '',
        // ruang: {},
        ruang: {
            rows:[],
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

    smartSelectJenjang = (rows, value) => {
        return (
            <ListItem
                title={"Jenjang "+value}
                smartSelect
                smartSelectParams={{openIn: 'sheet'}}
            >
                <select name="jenjang_id" defaultValue={value} onChange={this.gantiJenjang}>
                    <option disabled value={0}>-</option>
                    {rows.map((option)=>{
                        return (
                            <option key={option.jenjang_id} value={option.jenjang_id}>{option.nama}</option>
                        )
                    })}
                </select>
            </ListItem>
        )
    }

    componentDidMount = () => {
        // console.log(new Date());

        
        if(this.$f7route.url.split('#').length > 1){
            console.log(this.$f7route.url.split('#')[1].split("=")[1]);

            this.setState({
                routeParamsRuang: {
                    ruang_id: this.$f7route.url.split('#')[1].split("=")[1]
                }
            },()=>{
                this.props.getRuang(this.state.routeParamsRuang).then((result)=>{
                    console.log(this.props.ruang);
                    this.setState({
                        ruang: this.props.ruang
                    });
                });
            });

        }

        this.props.getJenjang(this.state.routeParams).then((result)=>{
            this.props.getMataPelajaran(this.state.routeParams).then((result)=>{
                
                if(this.$f7route.params['kuis_id']){
                // if(this.state.routeParams.kuis_id){
                    this.props.getKuis(this.state.routeParams).then((result)=>{

                        let listPertanyaan = [];
                        let sekuen_pertanyaan = 0;

                        for (const key in this.props.kuis.rows[0].pertanyaan_kuis) {
                            if (this.props.kuis.rows[0].pertanyaan_kuis.hasOwnProperty(key)) {
                                const element = this.props.kuis.rows[0].pertanyaan_kuis[key];
                                
                                listPertanyaan = [
                                    ...listPertanyaan,
                                    (<PanelPertanyaan kuis_id={element.kuis_id} pertanyaan_kuis_id={key} id={(sekuen_pertanyaan+1)} key={(sekuen_pertanyaan+1)} />)
                                ]

                                sekuen_pertanyaan++;
                            }
                        }

                        // this.setState({
                        //     gambar_kuis: file[0].name,
                        //     // loading: true,
                        //     routeParams:{
                        //         ...this.state.routeParams,
                        //         gambar_kuis: file[0].name
                        //     }
                        // }
                        
                        this.setState({
                            ...this.state,
                            gambar_kuis: this.props.kuis.rows[0].gambar_kuis,
                            file_gambar_kuis: '/assets/berkas/' +  this.props.kuis.rows[0].gambar_kuis,
                            routeParams: {
                                ...this.state.routeParams,
                                ...this.props.kuis.rows[0],
                                gambar_kuis: this.props.kuis.rows[0].gambar_kuis
                            },
                            // routeParams: this.props.kuis.rows[0],
                            sekuen_pertanyaan: sekuen_pertanyaan,
                            listPertanyaan: listPertanyaan
                            // smartSelectJenjang: this.smartSelectJenjang(this.props.jenjang.rows, this.props.kuis.rows[0].jenjang_id)
                        },()=>{
                            
                            console.log(this.state);

                            this.props.setKuis(this.state.routeParams);
                            setTimeout(() => {
                                // console.log(this.props.fe_kuis);
                            }, 200);
                        });
        
                    });
                }else{
        
                    this.props.generateUUID(this.state.routeParams).then((result)=>{
            
                        this.setState({
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.props.uuid_kuis,
                                keterangan: '',
                                waktu_selesai: null,
                                pertanyaan_kuis: {},
                                publikasi: 0
                            }
                        },()=>{
                            this.props.fe_kuis.kuis_id = this.props.uuid_kuis;
                            // console.log(this.state.routeParams);
                            if(this.state.routeParams.ruang_id){
                                this.setState({
                                    ...this.state,
                                    routeParams:{
                                        ...this.state.routeParams,
                                        pengguna_id: null
                                    }
                                },()=>{

                                    this.props.setKuis(this.state.routeParams);

                                    // this.props.getRuang(this.state.routeParams).then((result)=>{

                                    //     this.setState({
                                    //         ...this.state,
                                    //         ruang: result.payload.rows[0],
                                    //         routeParams:{
                                    //             ...this.state.routeParams,
                                    //             pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                                    //         }
                                    //     },()=>{
                                    //         this.props.setKuis(this.state.routeParams);
                                    //     });
    
                                    
                                    // });

                                });

                            }else{
                                
                                this.props.setKuis(this.state.routeParams);
                            }
                            
                        });
                    });
        
                }

            });
        });


        // this.props.getTingkatPendidikan(this.state.routeParams);


    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    [key]: value
                }
            },()=>{
                this.props.setKuis(this.state.routeParams);
                setTimeout(() => {
                    // console.log(this.props.fe_kuis);
                }, 100);
            });
        });

    }

    setStateValueTanggal = (key) => (e) => {
        // console.log(e.currentTarget.value);
        // console.log(key);
        let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    [key]: value.replace("T"," ")
                }
            },()=>{
                this.props.setKuis(this.state.routeParams);
                setTimeout(() => {
                    // console.log(this.props.fe_kuis);
                }, 100);
            });
        });

    }

    tambahPertanyaan = () => {
        this.setState({
            ...this.state,
            sekuen_pertanyaan: (this.state.sekuen_pertanyaan+1),
            listPertanyaan: [
                ...this.state.listPertanyaan,
                (<PanelPertanyaan id={(this.state.sekuen_pertanyaan+1)} key={(this.state.sekuen_pertanyaan+1)} />)
            ]
        })
    }

    publikasiKuis = () => {
        if(this.state.routeParams.judul === null || this.state.routeParams.judul === ''){
            this.$f7.dialog.alert('Mohon lengkapi judul Kuis terlebih dahulu!', 'Peringatan');
            // return true;
        }

        // if(this.state.routeParams.waktu_mulai === null || this.state.routeParams.waktu_mulai === ''){
        //     this.$f7.dialog.alert('Mohon lengkapi waktu mulai kuis (hingga ke isian jam dan menit) terlebih dahulu!', 'Peringatan');
        //     // return true;
        // }

        this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

        // console.log('tes');
        // console.log(JSON.stringify(this.props.fe_kuis));
        // console.log(JSON.stringify(this.props.routeParams));
        this.setState({
            sheetOpened: true
            // routeParams: {
            //     ...this.state.routeParams
            // }
        },()=>{
            // this.props.setKuis(this.state.routeParams);
            // setTimeout(() => {
            this.props.simpanKuis(this.props.fe_kuis).then((result)=>{
                if(this.$f7route.url.split('#').length > 1){

                    this.setState({
                        sheetOpened: false
                    });

                    this.$f7router.navigate('/buatSesiKuis/'+result.payload.kuis_id);

                }else{
                    this.setState({
                        sheetOpened: false
                    },()=>{
                        // this.$f7router.navigate('/kodeKuis/'+this.props.fe_kuis.kuis_id);
                        this.$f7router.navigate('/KuisAnda/');
                    });
                }
            });
            // }, 100);
        });

    }

    gantiStatusPrivasi = (b) => {
        this.props.fe_kuis.status_privasi = b.target.value;
    }

    gantiPublikasi = (b) => {
        // localStorage.setItem('semester_id_aplikasi', b.target.value);
        this.props.fe_kuis.publikasi = b.target.value;
        this.setState({
            ...this.state,
            labelTombolSimpan: (b.target.value === "1" ? 'Rilis Kuis' : 'Simpan Draft')
        });
        
        setTimeout((b) => {
            // console.log(this.props.fe_kuis);

            // this.setState({
            //     ...this.state,
            //     labelTombolSimpan: (b.target.value === "1" ? 'Publikasikan' : 'Simpan Draft')
            // })
        }, 100);
    //     this.setState({
    //         routeParams: {
    //             ...this.state.routeParams,
    //             pertanyaan_kuis: {
    //                 ...this.state.pertanyaan_kuis
    //             },
    //             publikasi: b.target.value
    //         }
    //     },()=>{
    //         this.props.setKuis(this.state.routeParams);
    //         setTimeout(() => {
    //             console.log(this.props.fe_kuis);
    //         }, 100);
    //     });
    }

    gantiAssign = (b) => {
        this.props.fe_kuis.a_boleh_assign = b.target.value;
    }

    gantiJenjang = (b) => {
        this.props.fe_kuis.jenjang_id = b.target.value;
        
        this.setState({
            ...this.state,
            paramTingkatPendidikan: {
                jenjang_id: b.target.value
            }
        },()=>{
            this.props.getTingkatPendidikan(this.state.paramTingkatPendidikan);
        });

        setTimeout((b) => {
            // console.log(this.props.fe_kuis);

            // this.setState({
            //     ...this.state,
            //     paramTingkatPendidikan: {
            //         jenjang_id: b.target.value
            //     }
            // },()=>{
            //     this.props.getTingkatPendidikan(this.state.paramTingkatPendidikan);
            // });

        }, 100);
    }
    
    gantiTingkatPendidikan = (b) => {
        this.props.fe_kuis.tingkat_pendidikan_id = b.target.value;
        setTimeout((b) => {
            // console.log(this.props.fe_kuis);
        }, 100);
    }

    gantiMataPelajaran = (b) => {
        this.props.fe_kuis.mata_pelajaran_id = b.target.value;
        setTimeout((b) => {
            // console.log(this.props.fe_kuis);
        }, 100);
    }

    acceptedFile = (file) => {
        // console.log(file[0]);

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

            if(file[0].size >= 1000000){ //2Mb
                this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
                return true;
            }
    
            if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
                
                this.props.generateUUID(this.state.routeParams).then((result)=>{

                    this.setState({
                        gambar_kuis: file[0].name,
                        // loading: true,
                        guid_gambar: this.props.uuid_kuis,
                        routeParams:{
                            ...this.state.routeParams,
                            // gambar_kuis: file[0].name
                            gambar_kuis: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                        }
                    },()=>{
        
                        this.props.setKuis(this.state.routeParams);
                        //uploading
                        // const formData = new FormData();
                        console.log(this.state.routeParams);
    
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
                                data.append('jenis', 'gambar_kuis');
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
            
        });


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

    hapusKuis = () => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus kuis ini? (Proses ini tidak dapat dibatalkan!)', 'Peringatan', ()=>{
            // alert('hapus');
            this.setState({
                routeParamsHapus: {
                    kuis_id: this.state.routeParams.kuis_id
                }
            },()=>{
                this.props.hapusKuis(this.state.routeParamsHapus).then((result)=>{
                    if(result.payload.success){
                        this.$f7router.navigate('/KuisAnda/');
                    }else{
                        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum hapus', 'Mohon maaf');
                    }
                })
            });


        });
    }
    
    render()
    {
        return (
            <Page name="tambahKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['kuis_id'] ? <>Edit Kuis</> : <>Tambah Kuis</>}</NavTitle>
                    <NavTitleLarge>
                        {this.$f7route.params['kuis_id'] ? <>Edit Kuis</> : <>Tambah Kuis</>}
                    </NavTitleLarge>
                </Navbar>
                {this.state.ruang.result > 0 &&
                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                    Untuk Ruang <b>"{this.state.ruang.rows[0].nama}"</b>
                </Block>
                }
                {/* {this.props.fe_kuis.judul} */}
                <List noHairlinesMd style={{marginBottom:'0px'}}>
                    <ListInput
                        label="Judul"
                        type="textarea"
                        resizable
                        placeholder="Judul Kuis"
                        clearButton
                        onChange={this.setStateValue('judul')}
                        defaultValue={this.props.fe_kuis.judul}
                    >
                    </ListInput>
                    <ListInput
                        label="Keterangan"
                        type="textarea"
                        resizable
                        placeholder="Keterangan Kuis"
                        clearButton
                        onChange={this.setStateValue('keterangan')}
                        defaultValue={this.props.fe_kuis.keterangan}
                    >
                    </ListInput>
                    <ListItem
                        title={"Jenjang"}
                        smartSelect
                        smartSelectParams={{openIn: 'sheet'}}
                    >
                        <select name="jenjang_id" defaultValue={this.props.fe_kuis.jenjang_id} onChange={this.gantiJenjang}>
                            <option disabled value={0}>-</option>
                            {this.props.jenjang.rows.map((option)=>{
                                return (
                                    <option key={option.jenjang_id} value={option.jenjang_id}>{option.nama}</option>
                                )
                            })}
                        </select>
                    </ListItem>
                    {/* {this.state.smartSelectJenjang} */}
                    <ListItem
                        title="Tingkat Kelas"
                        smartSelect
                        smartSelectParams={{openIn: 'sheet'}}
                    >
                        <select name="tingkat_pendidikan_id" defaultValue={this.props.fe_kuis.tingkat_pendidikan_id} onChange={this.gantiTingkatPendidikan}>
                            <option disabled value={0}>-</option>
                            {this.props.tingkat_pendidikan.rows.map((option)=>{
                                return (
                                    <option key={option.tingkat_pendidikan_id} value={option.tingkat_pendidikan_id}>{option.nama}</option>
                                )
                            })}
                        </select>
                    </ListItem>
                    <ListItem
                        title="Mata Pelajaran"
                        smartSelect
                        smartSelectParams={{openIn: 'popup', searchbar: true, searchbarPlaceholder: 'Cari Mata Pelajaran'}}
                    >
                        <select name="mata_pelajaran_id" defaultValue={this.props.fe_kuis.mata_pelajaran_id} onChange={this.gantiMataPelajaran}>
                            <option disabled value={0}>-</option>
                            {this.props.mata_pelajaran.rows.map((option)=>{
                                return (
                                    <option value={option.mata_pelajaran_id}>{option.nama}</option>
                                )
                            })}
                        </select>
                    </ListItem>
                    {/* <ListInput
                        label="Waktu Mulai"
                        type="datetime-local"
                        style={{width:'100%'}}
                        placeholder="Pilih waktu mulai..."
                        // onCalendarChange={this.setStateValueTanggal('waktu_mulai')}
                        onChange={this.setStateValueTanggal('waktu_mulai')}
                        // value={this.props.fe_kuis.waktu_mulai}
                        // defaultValue={[new Date()]}
                    />
                    <ListInput
                        label="Waktu Selesai"
                        type="datetime-local"
                        placeholder="Pilih waktu selesai..."
                        onChange={this.setStateValueTanggal('waktu_mulai')}
                        // onCalendarChange={this.setStateValueTanggal('waktu_selesai')}
                        // defaultValue={this.props.fe_kuis.waktu_selesai}
                    /> */}
                </List>
                <BlockTitle>Upload Gambar Cover Kuis</BlockTitle>
                <Card>
                    <Dropzone className="droping" onDrop={this.acceptedFile}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_kuis !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
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
                </Card>
                <BlockTitle>Pertanyaan {this.state.sekuen_pertanyaan > 0 ? <>({this.state.sekuen_pertanyaan})</> : <></>}</BlockTitle>
                <Block strong style={{marginTop:'0px', marginBottom:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                    {/* <PanelPertanyaan /> */}
                    {this.state.listPertanyaan}
                </Block>
                <Block strong style={{marginTop:'0px', marginBottom:'16px'}}>
                    <Button disabled={this.state.routeParams.judul ? false : true } style={{background:'#00bcd4'}} large fill raised onClick={this.tambahPertanyaan}>
                        <Icon ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Buat Kuis Baru"/>
                        &nbsp;
                        Tambah Pertanyaan
                    </Button>
                </Block>
                <Block strong style={{marginTop:'-30px', marginBottom:'8px', paddingTop:'0px'}}>
                    <List>
                        <ListItem
                            title="Status Kuis"
                            smartSelect
                            smartSelectParams={{openIn: 'sheet'}}
                        >
                            <select name="status_privasi" defaultValue={this.props.fe_kuis.status_privasi} onChange={this.gantiStatusPrivasi}>
                                <option value="1">Publik</option>
                                <option value="2">Privat</option>    
                            </select>
                        </ListItem>
                        <ListItem
                            title="Izinkan orang lain membuat sesi kuis ini atau meng-assign kuis ini ke ruang"
                            smartSelect
                            smartSelectParams={{openIn: 'sheet'}}
                        >
                            <select name="a_boleh_assign" defaultValue={this.props.fe_kuis.a_boleh_assign} onChange={this.gantiAssign}>
                                <option value={null}>-</option>
                                <option value="0">Jangan Izinkan</option>
                                <option value="1">Izinkan</option>    
                            </select>
                        </ListItem>
                        <ListItem
                            title="Publikasi atau Simpan Draft"
                            smartSelect
                            smartSelectParams={{openIn: 'sheet'}}
                        >
                            <select name="publikasi" defaultValue={this.props.fe_kuis.publikasi} onChange={this.gantiPublikasi}>
                                <option value="0">Simpan Draft</option>
                                <option value="1">Rilis Kuis</option>    
                            </select>
                        </ListItem>
                    </List>
                    <Row>
                        <Col width="100">
                            <Button disabled={this.state.routeParams.judul ? false : true } large fill raised style={{background:'#8bc34a'}} onClick={this.publikasiKuis}>
                                <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Publikasikan Kuis"/>
                                &nbsp;
                                {this.state.labelTombolSimpan}
                            </Button>
                        </Col>
                        {this.state.routeParams.kuis_id &&
                        <Col width="100" style={{marginTop:'16px'}}>
                            <Button large fill raised style={{background:'#434343'}} onClick={this.hapusKuis}>
                                <Icon ios={"f7:trash_fill"} aurora={"f7:trash_fill"} md={"material:trash_fill"} tooltip="Hapus Kuis"/>
                                &nbsp;
                                Hapus Kuis
                            </Button>
                        </Col>
                        }
                        {/* <Col width="50">
                            <Button disabled={this.state.routeParams.judul ? '' : 'disabled' } large fill raised style={{background:'#80cbc4'}}>
                                <Icon ios={"f7:archivebox"} aurora={"f7:archivebox"} md={"material:archivebox"} tooltip="Buat Kuis Baru"/>
                                &nbsp;
                                Simpan Draft
                            </Button>
                        </Col> */}
                    </Row>

                </Block>
                <Sheet
                    className="demo-sheet-swipe-to-close"
                    style={{height: 'auto', '--f7-sheet-bg-color': '#fff'}}
                    // swipeToClose
                    backdrop
                    opened={this.state.sheetOpened}
                    closeByBackdropClick={false}
                    closeByOutsideClick={false}
                    // onSheetClosed={() => {
                    //     //do nothing
                    // }}
                    >
                    <PageContent>
                        {/* <BlockTitle large>Hello!</BlockTitle> */}
                        <Block>
                        <p>Menyimpan data. Mohon tunggu...</p>
                        </Block>
                    </PageContent>
                </Sheet>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      simpanKuis: Actions.simpanKuis,
      getKuis: Actions.getKuis,
      setKuis: Actions.setKuis,
      generateUUID: Actions.generateUUID,
      getJenjang: Actions.getJenjang,
      getTingkatPendidikan: Actions.getTingkatPendidikan,
      getMataPelajaran: Actions.getMataPelajaran,
      getRuang: Actions.getRuang,
      hapusKuis: Actions.hapusKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ref, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        fe_kuis: Kuis.fe_kuis,
        uuid_kuis: Kuis.uuid_kuis,
        jenjang: Ref.jenjang,
        tingkat_pendidikan: Ref.tingkat_pendidikan,
        mata_pelajaran: Ref.mata_pelajaran,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahKuis));
  