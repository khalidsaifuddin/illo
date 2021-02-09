import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, List, ListInput, BlockTitle, Card, CardHeader, CardContent, Row, Col, Sheet, PageContent, ListItem, AccordionItem, AccordionContent
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import PanelPertanyaan from './panelPertanyaan';

import Dropzone from 'react-dropzone';

import ReactAudioPlayer from 'react-audio-player';
import YouTube from 'react-youtube';

class tambahKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id,
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'] ? this.$f7route.params['kuis_id'] : null,
            ruang_id: this.$f7route.params['ruang_id'] ? this.$f7route.params['ruang_id'] : 'N',
            waktu_mulai: '',
            waktu_selesai: '',
            simpan_pertanyaan: 'N',
            tingkat_pendidikan_id: null,
            status_privasi: (this.$f7route.params['kuis_id'] ? null : 1),
            // status_privasi: 1,
            a_boleh_assign: null,
            publikasi: null,
            judul: '',
            keterangan: ''
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
        },
        aspek: {
            rows: [],
            total: 0
        },
        kuis: {},
        tampilkan_jawaban_benar: true
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
        this.$f7.dialog.preloader('Memuat kuis...');
        
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
                                
                                // listPertanyaan = [
                                //     ...listPertanyaan,
                                //     (<PanelPertanyaan kuis_id={element.kuis_id} pertanyaan_kuis_id={key} id={(sekuen_pertanyaan+1)} key={(sekuen_pertanyaan+1)} />)
                                // ]

                                
                                let listPilihan = [];
                                
                                for (const key_pilihan in element.pilihan_pertanyaan_kuis) {
                                    const element_pilihan = element.pilihan_pertanyaan_kuis[key_pilihan];
                                    
                                    listPilihan = [
                                        ...listPilihan,
                                        element_pilihan
                                    ];
                                }
                                
                                element['listPilihan'] = listPilihan;
                                
                                listPertanyaan = [
                                    ...listPertanyaan,
                                    element
                                ];

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
                            kuis: this.props.kuis.rows[0],
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
                            this.$f7.dialog.close();

                            this.props.setKuis(this.state.routeParams);
                            setTimeout(() => {
                                // console.log(this.props.fe_kuis);
                            }, 200);
                        });
        
                    });

                }else{
                    // alert('tes');
        
                    this.props.generateUUID(this.state.routeParams).then((result)=>{

                        this.$f7.dialog.close();

                        console.log('yeye');
                        console.log(this.props.fe_kuis);
            
                        this.setState({
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.props.uuid_kuis,
                                keterangan: '',
                                waktu_selesai: null,
                                pertanyaan_kuis: {},
                                publikasi: 0,
                                judul: '',
                                keterangan: ''
                            }
                        },()=>{
                            // this.props.fe_kuis = {};
                            this.props.setKuis(this.state.routeParams);
                            // this.props.fe_kuis.judul = null;
                            // this.props.fe_kuis.keterangan = null;
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

                            this.props.fe_kuis.judul = null;
                            this.props.fe_kuis.keterangan = null;
                            console.log(this.props.fe_kuis);
                            
                        });
                    });
        
                }

            });
        });

        this.props.getTingkatPendidikan(this.state.routeParams);
        this.props.getMataPelajaran(this.state.routeParams);

        // this.props.getTingkatPendidikan(this.state.routeParams);

        if(this.$f7route.params['kuis_id']){
            this.props.getAspek(this.state.routeParams).then((result)=>{
                this.setState({
                    aspek: this.props.aspek
                })
            })
        }


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

    // tambahPertanyaan = () => {
    //     this.setState({
    //         ...this.state,
    //         sekuen_pertanyaan: (this.state.sekuen_pertanyaan+1),
    //         listPertanyaan: [
    //             ...this.state.listPertanyaan,
    //             (<PanelPertanyaan id={(this.state.sekuen_pertanyaan+1)} key={(this.state.sekuen_pertanyaan+1)} />)
    //         ]
    //     })
    // }

    publikasiKuis = () => {
        if(this.state.routeParams.judul === null || this.state.routeParams.judul === ''){
            this.$f7.dialog.alert('Mohon lengkapi judul Kuis terlebih dahulu!', 'Peringatan');
            // return true;
        }

        // if(this.state.routeParams.waktu_mulai === null || this.state.routeParams.waktu_mulai === ''){
        //     this.$f7.dialog.alert('Mohon lengkapi waktu mulai kuis (hingga ke isian jam dan menit) terlebih dahulu!', 'Peringatan');
        //     // return true;
        // }

        this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
        // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

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
            this.props.fe_kuis.pertanyaan_kuis = {};
            this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
            // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

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
        this.setState({
            ...this.state,
            kuis: {
                ...this.state.kuis,
                status_privasi: b.target.value
            }
        });
    }
    
    gantiJenisKuis = (b) => {
        this.props.fe_kuis.jenis_kuis_id = b.target.value;
        // this.state.kuis.jenis_kuis_id = b.target.value;
        this.setState({
            kuis: {
                ...this.state.kuis,
                jenis_kuis_id: b.target.value
            }
        })
    }

    gantiPublikasi = (b) => {
        // localStorage.setItem('semester_id_aplikasi', b.target.value);
        this.props.fe_kuis.publikasi = b.target.value;
        this.setState({
            ...this.state,
            labelTombolSimpan: (b.target.value === "1" ? 'Rilis Kuis' : 'Simpan Draft'),
            kuis: {
                ...this.state.kuis,
                publikasi: b.target.value
            }
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
        this.setState({
            ...this.state,
            kuis: {
                ...this.state.kuis,
                a_boleh_assign: b.target.value
            }
        })
    }

    gantiJenjang = (b) => {
        // console.log(this.props.jenjang.rows);
        this.props.jenjang.rows.map((option)=>{
            if(parseInt(option.jenjang_id) === parseInt(b.target.value)){
                this.props.fe_kuis.jenjang = option.nama;
            }
        })

        this.props.fe_kuis.jenjang_id = b.target.value;
        
        this.setState({
            ...this.state,
            paramTingkatPendidikan: {
                jenjang_id: b.target.value
            },
            kuis: {
                ...this.state.kuis,
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
        // console.log(this.props.tingkat_pendidikan.rows);
        // this.props.tingkat_pendidikan.rows.map((optiontingkat)=>{
        //     if(parseInt(optiontingkat.tingkat_pendidikan_id) === parseInt(b.target.value)){
        //         // this.props.fe_kuis.tingkat_pendidikan = optiontingkat.nama;
        //         this.setState({
        //             routeParams: {
        //                 ...this.state.routeParams,
        //                 tingkat_pendidikan_id: b.target.value
        //             }
        //         });
        //     }
        // });

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tingkat_pendidikan_id: b.target.value
            },
            kuis: {
                ...this.state.kuis,
                tingkat_pendidikan_id: b.target.value
            }
        });

        this.props.fe_kuis.tingkat_pendidikan_id = b.target.value;
        setTimeout((b) => {
            // console.log(this.props.fe_kuis);
        }, 100);
    }

    gantiMataPelajaran = (b) => {
        this.props.mata_pelajaran.rows.map((option)=>{
            if(parseInt(option.mata_pelajaran_id) === parseInt(b.target.value)){
                // this.props.fe_kuis.mata_pelajaran = option.nama;
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        mata_pelajaran: option.nama
                    },
                    kuis: {
                        ...this.state.kuis,
                        mata_pelajaran_id: option.mata_pelajaran_id
                    }
                });
            }
        });

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
                                data.append('pengguna_id', this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id);
                                // data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
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
            this.$f7.dialog.preloader('Menghapus kuis...');
            this.setState({
                routeParamsHapus: {
                    kuis_id: this.state.routeParams.kuis_id
                }
            },()=>{
                this.props.hapusKuis(this.state.routeParamsHapus).then((result)=>{
                    
                    this.$f7.dialog.close();

                    if(result.payload.success){
                        this.$f7router.navigate('/KuisAnda/');
                    }else{
                        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum hapus', 'Mohon maaf');
                    }
                })
            });


        });
    }

    editKuis = (kuis_id, pertanyaan_kuis_id) => {
        console.log(kuis_id);
        console.log(pertanyaan_kuis_id);
        
        this.$f7.dialog.preloader('Mempersiapkan pertanyaan...');

        this.props.fe_kuis.pertanyaan_kuis = {};
        this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
        // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

        this.props.simpanKuis(this.props.fe_kuis).then((result)=>{
            // console.log(kuis_id);
            // console.log(pertanyaan_kuis_id);
            this.$f7.dialog.close();

            this.$f7router.navigate("/formPertanyaan/"+kuis_id+"/"+pertanyaan_kuis_id);
        });
    }
    
    tambahPertanyaan = (kuis_id) => {
        console.log(kuis_id);

        this.$f7.dialog.preloader('Mempersiapkan pertanyaan baru...');

        this.props.fe_kuis.pertanyaan_kuis = {};
        this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
        // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

        this.props.simpanKuis(this.props.fe_kuis).then((result)=>{
            // console.log(kuis_id);
            // console.log(pertanyaan_kuis_id);
            this.$f7.dialog.close();

            this.$f7router.navigate("/formPertanyaan/"+kuis_id);
        });
    }

    hapusPertanyaan = (pertanyaan_kuis_id) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus pertanyaan ini? (Proses ini tidak dapat  dibatalkan!)', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menghapus Pertanyaan...');

            this.props.fe_kuis.pertanyaan_kuis = {};
            this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
            // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;
            
            this.props.simpanKuis(this.props.fe_kuis).then((result)=>{

                this.setState({
                    routeParamsHapus: {
                        pertanyaan_kuis_id: pertanyaan_kuis_id,
                        soft_delete: 1
                    }
                },()=>{
                    this.props.simpanPertanyaanKuis(this.state.routeParamsHapus).then((result)=>{
        
                        this.props.getKuis(this.state.routeParams).then((result)=>{
        
                            let listPertanyaan = [];
                            let sekuen_pertanyaan = 0;
        
                            for (const key in this.props.kuis.rows[0].pertanyaan_kuis) {
                                if (this.props.kuis.rows[0].pertanyaan_kuis.hasOwnProperty(key)) {
                                    const element = this.props.kuis.rows[0].pertanyaan_kuis[key];
                                    
                                    let listPilihan = [];
                                    
                                    for (const key_pilihan in element.pilihan_pertanyaan_kuis) {
                                        const element_pilihan = element.pilihan_pertanyaan_kuis[key_pilihan];
                                        
                                        listPilihan = [
                                            ...listPilihan,
                                            element_pilihan
                                        ];
                                    }
                                    
                                    element['listPilihan'] = listPilihan;
                                    
                                    listPertanyaan = [
                                        ...listPertanyaan,
                                        element
                                    ];
        
                                    sekuen_pertanyaan++;
                                }
                            }
                            
                            this.setState({
                                ...this.state,
                                gambar_kuis: this.props.kuis.rows[0].gambar_kuis,
                                file_gambar_kuis: '/assets/berkas/' +  this.props.kuis.rows[0].gambar_kuis,
                                routeParams: {
                                    ...this.state.routeParams,
                                    ...this.props.kuis.rows[0],
                                    gambar_kuis: this.props.kuis.rows[0].gambar_kuis
                                },
                                sekuen_pertanyaan: sekuen_pertanyaan,
                                listPertanyaan: listPertanyaan
                            },()=>{
                                
                                // console.log(this.state);
                                this.$f7.dialog.close();
        
                                this.props.setKuis(this.state.routeParams);
                                setTimeout(() => {
                                    
                                }, 200);
                            });
            
                        });
                    });
                });

            });

        });

    }

    tambahAspek = (kuis_id, pengguna_id, bagian_kuis_id, induk_bagian_kuis_id) => {
        console.log(kuis_id);

        this.$f7.dialog.preloader('Mempersiapkan aspek instrumen baru...');

        this.props.fe_kuis.pertanyaan_kuis = {};
        this.props.fe_kuis.pengguna_id = this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id;
        // this.props.fe_kuis.pengguna_id = JSON.parse(localStorage.getItem('user')).pengguna_id;

        this.props.simpanKuis(this.props.fe_kuis).then((result)=>{
            // console.log(kuis_id);
            // console.log(pertanyaan_kuis_id);
            this.$f7.dialog.close();

            this.$f7router.navigate("/tambahBagianKuis/"+pengguna_id+"/"+result.payload.kuis_id+(bagian_kuis_id ? "/"+bagian_kuis_id : '/-')+(induk_bagian_kuis_id ? "/"+induk_bagian_kuis_id : ''));
        });
    }

    hapusAspek = (bagian_kuis_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus aspek/sub aspek ini?','Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader()

            this.props.simpanAspek({bagian_kuis_id: bagian_kuis_id, soft_delete: 1}).then((result)=>{
                
                this.$f7.dialog.close()

                this.props.getAspek(this.state.routeParams).then((result)=>{
                    this.setState({
                        aspek: this.props.aspek
                    })
                })
            })

        })
        // alert(bagian_kuis_id)
    }
    
    render()
    {
        return (
            <Page name="tambahKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['kuis_id'] ? <>Edit Kuis</> : <>Tambah Kuis</>}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.$f7route.params['kuis_id'] ? <>Edit Kuis</> : <>Tambah Kuis</>}
                    </NavTitleLarge> */}
                </Navbar>
                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                    Penyusun Asli: <b>{this.props.fe_kuis.pengguna}</b>
                </Block>
                {this.state.ruang.result > 0 &&
                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                    Untuk Ruang <b>"{this.state.ruang.rows[0].nama}"</b>
                </Block>
                }
                {/* {this.props.fe_kuis.judul} */}
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        <Card>
                            <CardContent>

                                <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListInput
                                        label="Judul"
                                        type="textarea"
                                        resizable
                                        placeholder="Judul Kuis"
                                        clearButton
                                        onChange={this.setStateValue('judul')}
                                        defaultValue={(this.$f7route.params['kuis_id'] ? this.props.fe_kuis.judul : null)}
                                    >
                                    </ListInput>
                                    <ListInput
                                        label="Keterangan"
                                        type="textarea"
                                        resizable
                                        placeholder="Keterangan Kuis"
                                        clearButton
                                        onChange={this.setStateValue('keterangan')}
                                        defaultValue={(this.$f7route.params['kuis_id'] ? this.props.fe_kuis.keterangan : null)}
                                    >
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Jenis Kuis"} after={(parseInt(this.state.routeParams.jenis_kuis_id) === 1 ? 'Kuis' : (parseInt(this.state.routeParams.jenis_kuis_id) === 2 ? 'Survey' : '-'))}>
                                        <AccordionContent>
                                            <ListItem
                                                title="Edit Jenis Kuis"
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="jenis_kuis_id" defaultValue={99} onChange={this.gantiStatusPrivasi}>
                                                    <option value="99" disabled>-</option>
                                                    <option value="1">Kuis</option>
                                                    <option value="2">Survey</option>    
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                    <ListInput
                                        label="Jenjang Kuis"
                                        type="select"
                                        placeholder="Pilih Jenjang Kuis..."
                                        name="jenjang_id" 
                                        value={this.state.kuis.jenjang_id} 
                                        onChange={this.gantiJenjang}
                                    >
                                        <option value="99" disabled>-</option>
                                        {this.props.jenjang.rows.map((option)=>{
                                            return (
                                                <option key={option.jenjang_id} value={option.jenjang_id} teks={option.nama}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Jenjang"} after={this.props.fe_kuis.jenjang}>
                                        <AccordionContent>
                                            <ListItem
                                                title={"Edit Jenjang"}
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="jenjang_id" defaultValue={0} onChange={this.gantiJenjang}>
                                                    <option disabled value={0}>-</option>
                                                    {this.props.jenjang.rows.map((option)=>{
                                                        return (
                                                            <option key={option.jenjang_id} value={option.jenjang_id} teks={option.nama}>{option.nama}</option>
                                                        )
                                                    })}
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                    {parseInt(this.props.fe_kuis.jenjang_id) !== 98 &&
                                    <ListInput
                                        label="Tingkat Kelas"
                                        type="select"
                                        placeholder="Pilih Tingkat Kelas..."
                                        name="tingkat_pendidikan_id" 
                                        value={this.state.kuis.tingkat_pendidikan_id} 
                                        onChange={this.gantiTingkatPendidikan}
                                    >
                                        <option value={99}>Semua Tingkat Kelas</option>
                                        {this.props.tingkat_pendidikan.rows.map((option)=>{
                                            return (
                                                <option key={option.tingkat_pendidikan_id} value={option.tingkat_pendidikan_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    // <ListItem accordionItem title={"Tingkat Kelas"} after={"Kelas " + this.state.routeParams.tingkat_pendidikan_id}>
                                    //     <AccordionContent>
                                    //         <ListItem
                                    //             title="Edit Tingkat Kelas"
                                    //             smartSelect
                                    //             smartSelectParams={{openIn: 'sheet'}}
                                    //         >
                                    //             <select name="tingkat_pendidikan_id" defaultValue={0} onChange={this.gantiTingkatPendidikan}>
                                    //                 <option disabled value={0}>-</option>
                                    //                 {this.props.tingkat_pendidikan.rows.map((option)=>{
                                    //                     return (
                                    //                         <option key={option.tingkat_pendidikan_id} value={option.tingkat_pendidikan_id}>{option.nama}</option>
                                    //                     )
                                    //                 })}
                                    //             </select>
                                    //         </ListItem>
                                    //     </AccordionContent>
                                    // </ListItem>
                                    }
                                    {parseInt(this.props.fe_kuis.jenjang_id) !== 98 &&
                                    <ListInput
                                        label="Mata Pelajaran"
                                        type="select"
                                        placeholder="Pilih Mata Pelajaran..."
                                        name="mata_pelajaran_id" 
                                        value={this.state.kuis.mata_pelajaran_id} 
                                        onChange={this.gantiMataPelajaran}
                                    >
                                        <option value={99}>-</option>
                                        {this.props.mata_pelajaran.rows.map((option)=>{
                                            return (
                                                <option value={option.mata_pelajaran_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    // <ListItem accordionItem title={"Mata Pelajaran"} after={this.state.routeParams.mata_pelajaran}>
                                    //     <AccordionContent>
                                    //         <ListItem
                                    //             title="Edit Mata Pelajaran"
                                    //             smartSelect
                                    //             smartSelectParams={{openIn: 'popup', searchbar: true, searchbarPlaceholder: 'Cari Mata Pelajaran'}}
                                    //         >
                                    //             <select name="mata_pelajaran_id" defaultValue={0} onChange={this.gantiMataPelajaran}>
                                    //                 <option disabled value={0}>-</option>
                                    //                 {this.props.mata_pelajaran.rows.map((option)=>{
                                    //                     return (
                                    //                         <option value={option.mata_pelajaran_id}>{option.nama}</option>
                                    //                     )
                                    //                 })}
                                    //             </select>
                                    //         </ListItem>
                                    //     </AccordionContent>
                                    // </ListItem>
                                    }
                                    <ListInput
                                        label="Status Privasi"
                                        type="select"
                                        placeholder="Pilih Status Privasi Kuis..."
                                        name="status_privasi" 
                                        value={this.state.kuis.status_privasi} 
                                        defaultValue={1}
                                        onChange={this.gantiStatusPrivasi}
                                    >
                                        {/* <option value="99" disabled>-</option> */}
                                        <option value="1">Publik</option>
                                        <option value="2">Privat</option>    
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Status Kuis"} after={(parseInt(this.state.routeParams.status_privasi) === 1 ? 'Publik' : 'Privat')}>
                                        <AccordionContent>
                                            <ListItem
                                                title="Edit Status Kuis"
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="status_privasi" defaultValue={99} onChange={this.gantiStatusPrivasi}>
                                                    <option value="99" disabled>-</option>
                                                    <option value="1">Publik</option>
                                                    <option value="2">Privat</option>    
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                    <ListInput
                                        label="Izinkan pengguna lain membuat sesi kuis"
                                        type="select"
                                        placeholder="Pilih Pengaturan..."
                                        name="a_boleh_assign" 
                                        value={this.state.kuis.a_boleh_assign} 
                                        defaultValue={"0"}
                                        onChange={this.gantiAssign}
                                    >
                                        {/* <option value="99" disabled>-</option> */}
                                        <option value="0">Jangan Izinkan</option>
                                        <option value="1">Izinkan</option>    
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Izinkan pengguna lain membuat sesi kuis"} after={(parseInt(this.state.routeParams.a_boleh_assign) === 1 ? 'Izinkan' : 'Jangan Izinkan')}>
                                        <AccordionContent>
                                            <ListItem
                                                title="Edit"
                                                // ="Pengguna lain dapat meng-assign kuis ini ke ruangnya"
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="a_boleh_assign" defaultValue={99} onChange={this.gantiAssign}>
                                                    <option value={99} disabled>-</option>
                                                    <option value="0">Jangan Izinkan</option>
                                                    <option value="1">Izinkan</option>    
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                    <ListInput
                                        label="Rilis atau Simpan Draft Kuis"
                                        type="select"
                                        placeholder="Pilih Pengaturan..."
                                        name="publikasi" 
                                        value={this.state.kuis.publikasi} 
                                        defaultValue={"0"}
                                        onChange={this.gantiPublikasi}
                                    >
                                        <option value="0">Simpan Draft</option>
                                        <option value="1">Rilis Kuis</option>   
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Rilis atau Simpan Draft"} after={(parseInt(this.state.routeParams.publikasi) === 1 ? 'Rilis Kuis' : 'Simpan Draft')}>
                                        <AccordionContent>
                                            <ListItem
                                                title="Edit"
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="publikasi" defaultValue={99} onChange={this.gantiPublikasi}>
                                                    <option value="99" disabled>-</option>
                                                    <option value="0">Simpan Draft</option>
                                                    <option value="1">Rilis Kuis</option>    
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                    {/* <ListItem
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
                                    </ListItem> */}
                                    {/* {this.state.smartSelectJenjang} */}
                                    {/* <ListItem
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
                                    </ListItem> */}
                                    {/* <ListItem
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
                                    </ListItem> */}
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
                                {/* </List> */}
                                {/* <br/>
                                <List> */}
                                    {/* <ListItem
                                        title="Status Kuis"
                                        smartSelect
                                        smartSelectParams={{openIn: 'sheet'}}
                                    >
                                        <select name="status_privasi" defaultValue={this.props.fe_kuis.status_privasi} onChange={this.gantiStatusPrivasi}>
                                            <option value="1">Publik</option>
                                            <option value="2">Privat</option>    
                                        </select>
                                    </ListItem> */}
                                    {/* <ListItem
                                        title="Izinkan pengguna lain membuat sesi kuis"
                                        // ="Pengguna lain dapat meng-assign kuis ini ke ruangnya"
                                        smartSelect
                                        smartSelectParams={{openIn: 'sheet'}}
                                    >
                                        <select name="a_boleh_assign" defaultValue={this.props.fe_kuis.a_boleh_assign} onChange={this.gantiAssign}>
                                            <option value={null}>-</option>
                                            <option value="0">Jangan Izinkan</option>
                                            <option value="1">Izinkan</option>    
                                        </select>
                                    </ListItem> */}
                                    {/* <ListItem
                                        title="Publikasi atau Simpan Draft"
                                        smartSelect
                                        smartSelectParams={{openIn: 'sheet'}}
                                    >
                                        <select name="publikasi" defaultValue={this.props.fe_kuis.publikasi} onChange={this.gantiPublikasi}>
                                            <option value="0">Simpan Draft</option>
                                            <option value="1">Rilis Kuis</option>    
                                        </select>
                                    </ListItem> */}
                                </List>
                            </CardContent>
                        </Card>
                        <BlockTitle>Upload Gambar Cover Kuis</BlockTitle>
                        <Card style={{borderRadius:'20px'}}>
                            <Dropzone className="droping" onDrop={this.acceptedFile}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()} style={{borderRadius:'20px', height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_kuis !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
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

                        <BlockTitle>Jenis Kuis</BlockTitle>
                        <Card>
                            <CardContent style={{padding:'16px'}}>
                                <List>
                                    <ListInput
                                        label="Edit Jenis Kuis"
                                        type="select"
                                        placeholder="Pilih Jenis Kuis..."
                                        name="jenis_kuis_id" 
                                        outline
                                        value={this.state.kuis.jenis_kuis_id} 
                                        onChange={this.gantiJenisKuis}
                                    >
                                        <option value="99" disabled>-</option>
                                        <option value="1">Kuis</option>
                                        <option value="2">Survey</option>    
                                    </ListInput>
                                    {/* <ListItem accordionItem title={"Jenis Kuis"} after={(parseInt(this.state.routeParams.jenis_kuis_id) === 1 ? 'Kuis' : (parseInt(this.state.routeParams.jenis_kuis_id) === 2 ? 'Survey' : '-'))}>
                                        <AccordionContent>
                                            <ListItem
                                                title="Edit Jenis Kuis"
                                                smartSelect
                                                smartSelectParams={{openIn: 'sheet'}}
                                            >
                                                <select name="jenis_kuis_id" defaultValue={99} onChange={this.gantiStatusPrivasi}>
                                                    <option value="99" disabled>-</option>
                                                    <option value="1">Kuis</option>
                                                    <option value="2">Survey</option>    
                                                </select>
                                            </ListItem>
                                        </AccordionContent>
                                    </ListItem> */}
                                </List>
                                <br/>
                                <div>
                                    Keterangan Jenis Kuis:
                                    <ul>
                                        <li><b>Kuis</b>: Pilih jenis kuis ini bila membutuhkan kuis dengan penghitungan skor akhir secara otomatis. Benar atau salahnya isian peserta akan langsung dikalkulasi oleh aplikasi</li>
                                        <li><b>Survey</b>: Pilih jenis kuis ini bila membutuhkan kuis yang tidak membutuhkan penghitungan skor akhir. Tidak ada jawaban benar atau salah</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <BlockTitle>Bagian Pertanyaan</BlockTitle>
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                {/* <Block strong style={{marginTop:'0px', marginBottom:'16px'}}> */}
                                <Button disabled={this.state.routeParams.judul ? false : true } className="color-theme-teal bawahCiriHijau" large fill raised onClick={()=>this.tambahAspek(this.state.routeParams.kuis_id, this.$f7route.params['pengguna_id'], null, null)}>
                                    <Icon ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Bagian"/>
                                    &nbsp;
                                    Tambah Bagian
                                </Button>
                                {/* </Block> */}
                                {this.state.aspek.rows.map((option)=>{
                                    return (
                                        <Card style={{marginLeft:'0px', marginRight:'0px', marginBottom:'0px', borderRadius:'10px'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="70" style={{padding:'0px', marginTop:'4px', marginLeft:'8px'}}>
                                                        <Row>
                                                            <Col width="100">
                                                                <b>{option.kode_bagian ? <>{option.kode_bagian}.</> : <></>} {option.nama}</b> 
                                                                {/* &nbsp; */}
                                                                {/* <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.$f7router.navigate('/tambahBagianKuis/'+this.state.routeParams.pengguna_id+'/'+this.state.routeParams.kuis_id+'/'+option.bagian_kuis_id)}>Edit</Link>
                                                                &nbsp;
                                                                <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.hapusAspek(option.bagian_kuis_id)}>Hapus</Link> */}
                                                            </Col>
                                                            {/* <Col width="30">
                                                            </Col> */}
                                                        </Row>
                                                    </Col>
                                                    <Col width="30" style={{textAlign:'right'}}>
                                                        <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.$f7router.navigate('/tambahBagianKuis/'+this.state.routeParams.pengguna_id+'/'+this.state.routeParams.kuis_id+'/'+option.bagian_kuis_id)}>Edit</Link>
                                                        &nbsp;
                                                        <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.hapusAspek(option.bagian_kuis_id)}>Hapus</Link>
                                                        {/* <Button disabled={this.state.routeParams.judul ? false : true } className="color-theme-teal" small fill raised onClick={()=>this.tambahAspek(this.state.routeParams.kuis_id, this.state.routeParams.pengguna_id, '-', option.bagian_kuis_id)}>
                                                            <Icon ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Sub Aspek" style={{fontSize:'20px'}} />
                                                            &nbsp;
                                                            Tambah Sub Bagian
                                                        </Button> */}
                                                    </Col>
                                                    <Col width="100" style={{marginTop:'4px'}}>
                                                        {option.sub_aspek.rows.map((optionSub)=>{
                                                            return (
                                                                <Card style={{margin:'0px', marginTop:'0px', borderRadius:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <Row>
                                                                            <Col width="100">
                                                                                <i className="icons f7-icons" style={{fontSize:'10px'}}>chevron_right_2</i>&nbsp;&nbsp;
                                                                                {optionSub.nama} 
                                                                                &nbsp;
                                                                                <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.$f7router.navigate('/tambahBagianKuis/'+this.state.routeParams.pengguna_id+'/'+this.state.routeParams.kuis_id+'/'+optionSub.bagian_kuis_id)}>Edit</Link>
                                                                                &nbsp;
                                                                                <Link style={{fontStyle:'italic', fontSize:'12px'}} onClick={()=>this.hapusAspek(optionSub.bagian_kuis_id)}>Hapus</Link>
                                                                            </Col>
                                                                            {/* <Col width="20">
                                                                            </Col> */}
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        })}
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <BlockTitle>Pertanyaan {this.state.sekuen_pertanyaan > 0 ? <>({this.state.sekuen_pertanyaan})</> : <></>}</BlockTitle>
                        {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                        <BlockTitle style={{marginTop:'0px'}}><i className="f7-icons" style={{fontSize:'20px', color:'#66bb6a'}}>circle_fill</i>: Benar, <i className="f7-icons" style={{fontSize:'20px', color:'#f57f17'}}>circle_fill</i>: Salah</BlockTitle>
                        }
                        
                        <Card>
                            <CardContent>
                                <Block strong style={{marginTop:'0px', marginBottom:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                                    {/* {this.state.listPertanyaan} */}
                                    {this.state.aspek.rows.map((optionBagian)=>{
                                        return (
                                            <div style={{paddingLeft:'8px', background: '#eeeeee', paddingTop:'8px', paddingBottom: '16px', border:'0px solid #ccc', margin:'4px', borderRadius:'10px'}}>
                                                <b>{optionBagian.kode_bagian ? <>{optionBagian.kode_bagian}.</> : <></>} {optionBagian.nama}</b>
                                                {this.state.listPertanyaan.map((option)=>{
                                                    return (
                                                        <>
                                                        {option.bagian_kuis_id === optionBagian.bagian_kuis_id &&
                                                        <Card style={{background:'url('+localStorage.getItem('api_base')+'/assets/img/paper_fibers.png)'}}>
                                                            <CardContent className="tampilPertanyaanKuis">
                                                                {/* <b style={{fontSize:'15px', color:'#434343'}}>pertanyaan 1</b> */}
                                                                {/* <Card>
                                                                    <CardContent> */}
                                                                        {/* Pertanyaan {(this.state.listPertanyaan.indexOf(option)+1)}<br/>
                                                                        <div dangerouslySetInnerHTML={{ __html: option.teks }} /> */}
                                                                    {/* </CardContent>
                                                                </Card> */}
                                                                <Row>
                                                                    <Col width="80">
                                                                        Pertanyaan {(this.state.listPertanyaan.indexOf(option)+1)} - &nbsp;<img src={localStorage.getItem('api_base')+"/assets/img/"+(parseInt(option.tipe_pertanyaan_id) === 3 ? 'input.png' : (parseInt(option.tipe_pertanyaan_id) === 2 ? 'checkbox.png' : 'radio.png'))} style={{width:'15px'}} />&nbsp;{parseInt(option.tipe_pertanyaan_id) === 2 ? <><b>Checkbox</b></> : (parseInt(option.tipe_pertanyaan_id) === 3 ? <><b>Isian</b></> : <><b>Pilihan Ganda</b></>)}<br/>
                                                                        <b>{option.kode_pertanyaan ? <div style={{marginBottom:'-8px', marginTop:'8px'}}>{option.kode_pertanyaan}<br/></div> : <></>}</b>
                                                                        <div dangerouslySetInnerHTML={{ __html: option.teks }} />
                                                                        {option.file_audio &&
                                                                        <ReactAudioPlayer
                                                                            src={option.file_audio}
                                                                            autoPlay={false}
                                                                            controls
                                                                            style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                                                        />
                                                                        }
                                                                        {option.file_video &&
                                                                        <>
                                                                        <YouTube
                                                                            videoId={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                                                            id={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                                                        />
                                                                        <br/>
                                                                        </>
                                                                        }
                                                                    </Col>
                                                                    <Col width="20">
                                                                        <Button onClick={()=>this.editKuis(this.props.fe_kuis.kuis_id, option.pertanyaan_kuis_id)} style={{fontSize:'12px', marginBottom:'8px', textAlign:'right'}}><i className="f7-icons" style={{fontSize:'20px'}}>pencil</i>&nbsp;Edit</Button>
                                                                        <Button style={{fontSize:'12px', textAlign:'right'}}><i className="f7-icons" style={{fontSize:'20px'}} tooltip="Hapus" onClick={()=>this.hapusPertanyaan(option.pertanyaan_kuis_id)}>trash_fill</i></Button>
                                                                    </Col>
                                                                    {option.listPilihan.map((optionPilihan)=>{
                                                                        return (
                                                                            <Col width="50">
                                                                                {!this.state.tampilkan_jawaban_benar &&
                                                                                <>
                                                                                    <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>circle</i>&nbsp;
                                                                                    {optionPilihan.teks}
                                                                                </>
                                                                                }
                                                                                {this.state.tampilkan_jawaban_benar &&
                                                                                <>
                                                                                    {parseInt(optionPilihan.jawaban_benar) === 1 &&
                                                                                    <i className="f7-icons" style={{fontSize:'20px', color:'#66bb6a'}}>circle_fill</i>
                                                                                    }
                                                                                    {parseInt(optionPilihan.jawaban_benar) !== 1 &&
                                                                                    <i className="f7-icons" style={{fontSize:'20px', color:'#f57f17'}}>circle_fill</i>
                                                                                    }
                                                                                    &nbsp;{optionPilihan.teks}
                                                                                </>
                                                                                }
                                                                            </Col>
                                                                        )
                                                                    })}
                                                                </Row>
                                                            </CardContent>
                                                        </Card>
                                                        }
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                    <div style={{paddingLeft:'8px', border:'1px solid #ccc', margin:'4px', borderRadius:'10px'  }}>
                                        {/* <b>Pertanyaan non bagian</b> */}
                                    {this.state.listPertanyaan.map((option)=>{
                                        return (
                                            <>
                                            {!option.bagian_kuis_id &&
                                            <Card style={{background:'url('+localStorage.getItem('api_base')+'/assets/img/paper_fibers.png)'}}>
                                                <CardContent className="tampilPertanyaanKuis">
                                                    {/* <b style={{fontSize:'15px', color:'#434343'}}>pertanyaan 1</b> */}
                                                    {/* <Card>
                                                        <CardContent> */}
                                                            {/* Pertanyaan {(this.state.listPertanyaan.indexOf(option)+1)}<br/>
                                                            <div dangerouslySetInnerHTML={{ __html: option.teks }} /> */}
                                                        {/* </CardContent>
                                                    </Card> */}
                                                    <Row>
                                                        <Col width="80">
                                                            Pertanyaan {(this.state.listPertanyaan.indexOf(option)+1)} - &nbsp;<img src={localStorage.getItem('api_base')+"/assets/img/"+(parseInt(option.tipe_pertanyaan_id) === 3 ? 'input.png' : (parseInt(option.tipe_pertanyaan_id) === 2 ? 'checkbox.png' : 'radio.png'))} style={{width:'15px'}} />&nbsp;{parseInt(option.tipe_pertanyaan_id) === 2 ? <><b>Checkbox</b></> : (parseInt(option.tipe_pertanyaan_id) === 3 ? <><b>Isian</b></> : <><b>Pilihan Ganda</b></>)}<br/>
                                                            <div dangerouslySetInnerHTML={{ __html: option.teks }} />
                                                            {option.file_audio &&
                                                            <ReactAudioPlayer
                                                                src={option.file_audio}
                                                                autoPlay={false}
                                                                controls
                                                                style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                                            />
                                                            }
                                                            {option.file_video &&
                                                            <>
                                                            <YouTube
                                                                videoId={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                                                id={(option.file_video ? (typeof option.file_video.split("?")[1] !== 'undefined' ? option.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                                            />
                                                            <br/>
                                                            </>
                                                            }
                                                        </Col>
                                                        <Col width="20">
                                                            <Button onClick={()=>this.editKuis(this.props.fe_kuis.kuis_id, option.pertanyaan_kuis_id)} style={{fontSize:'12px', marginBottom:'8px', textAlign:'right'}}><i className="f7-icons" style={{fontSize:'20px'}}>pencil</i>&nbsp;Edit</Button>
                                                            <Button style={{fontSize:'12px', textAlign:'right'}}><i className="f7-icons" style={{fontSize:'20px'}} tooltip="Hapus" onClick={()=>this.hapusPertanyaan(option.pertanyaan_kuis_id)}>trash_fill</i></Button>
                                                        </Col>
                                                        {option.listPilihan.map((optionPilihan)=>{
                                                            return (
                                                                <Col width="50">
                                                                    {!this.state.tampilkan_jawaban_benar &&
                                                                    <>
                                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#434343'}}>circle</i>&nbsp;
                                                                        {optionPilihan.teks}
                                                                    </>
                                                                    }
                                                                    {this.state.tampilkan_jawaban_benar &&
                                                                    <>
                                                                        {parseInt(optionPilihan.jawaban_benar) === 1 &&
                                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#66bb6a'}}>circle_fill</i>
                                                                        }
                                                                        {parseInt(optionPilihan.jawaban_benar) !== 1 &&
                                                                        <i className="f7-icons" style={{fontSize:'20px', color:'#f57f17'}}>circle_fill</i>
                                                                        }
                                                                        &nbsp;{optionPilihan.teks}
                                                                    </>
                                                                    }
                                                                </Col>
                                                            )
                                                        })}
                                                    </Row>
                                                </CardContent>
                                            </Card>
                                            }
                                            </>
                                        )
                                    })}
                                    </div>
                                </Block>
                                <Block strong style={{marginTop:'0px', marginBottom:'16px'}}>
                                    <Button disabled={this.state.routeParams.judul ? false : true } style={{background:'#00bcd4'}} large fill raised onClick={()=>this.tambahPertanyaan(this.state.routeParams.kuis_id)}>
                                    {/* <Button disabled={this.state.routeParams.judul ? false : true } style={{background:'#00bcd4'}} large fill raised onClick={this.tambahPertanyaan}> */}
                                        <Icon ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Buat Kuis Baru"/>
                                        &nbsp;
                                        Tambah Pertanyaan
                                    </Button>
                                </Block>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>

                                <Block strong style={{marginTop:'0px', marginBottom:'8px', paddingTop:'8px'}}>
                                    {/* <List>
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
                                    </List> */}
                                    <Row>
                                        <Col width="100">
                                            <Button disabled={this.state.routeParams.judul ? false : true } large fill raised style={{background:'#8bc34a'}} onClick={this.publikasiKuis}>
                                                <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Publikasikan Kuis"/>
                                                &nbsp;
                                                {this.state.labelTombolSimpan}
                                            </Button>
                                        </Col>
                                        {this.$f7route.params['kuis_id'] &&
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
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
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
      hapusKuis: Actions.hapusKuis,
      simpanPertanyaanKuis: Actions.simpanPertanyaanKuis,
      getAspek: Actions.getAspek,
      simpanAspek: Actions.simpanAspek
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
        ruang: Ruang.ruang,
        aspek: Kuis.aspek
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahKuis));
  