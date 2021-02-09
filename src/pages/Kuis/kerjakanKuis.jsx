import React, {Component} from 'react';
import {
    Page, Navbar, Block, Link, Button, Card, CardContent, Progressbar, BlockTitle, Sheet, PageContent, Row, Col, List, ListInput, ListItemContent, ListItem, Checkbox
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import ReactAudioPlayer from 'react-audio-player';
import YouTube from 'react-youtube';

import localForage from 'localforage';

class kerjakanKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id_peserta: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            kode_sesi: this.$f7route.params['kode_sesi'],
            nomor: this.$f7route.params['nomor'] ? this.$f7route.params['nomor'] : 1,
            sesi_kuis_id: localStorage.getItem('sesi_kuis_id')
        },
        loading:true,
        kuis: {
            rows: [{
                kuis_id: '',
                nama: '-'
            }],
            total: 0
        },
        pertanyaan_kuis: [{
            pertanyaan_kuis_id: '',
            nama: '-'
        }],
        sekuen_pertanyaan: 1,
        // sekuen_pertanyaan: this.$f7route.params['nomor'] ? this.$f7route.params['nomor'] : 1,
        pilihan_pertanyaan_kuis: [],
        benar: 0,
        skor: 0,
        sheetOpened: false,
        totalSeconds: 0,
        secondsLabel: 0,
        minutesLabel: 0,
        checkbox_jawaban: {}
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

    warna = [
        '#E65100',
        '#1B5E20',
        '#006064',
        '#311B92',
        '#1565C0',
        '#E040FB'
    ]

    componentDidMount = () => {
        // this.$f7.dialog.preloader();
        // let socket = io(localStorage.getItem('socket_url'));
        console.log(this.state.routeParams.nomor)
        
        this.$f7.dialog.preloader();

        //offline
        localForage.getItem( 'getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.$f7route.params['kuis_id']+':'+this.$f7route.params['kode_sesi'] ).then((value)=>{
            if(value){
                
                console.log(value)

                this.setState({
                    loading: false,
                    kuis: value.rows[0]
                },()=>{
                    console.log(this.state.kuis)

                    let pertanyaanKuis = [];

                    for (const key in this.state.kuis.pertanyaan_kuis) {
                        if (this.state.kuis.pertanyaan_kuis.hasOwnProperty(key)) {
                            const element = this.state.kuis.pertanyaan_kuis[key];
                            
                            pertanyaanKuis = [
                                ...pertanyaanKuis,
                                element
                            ];
                        }
                    }

                    this.setState({
                        ...this.state,
                        pertanyaan_kuis: pertanyaanKuis
                    },()=>{
                        // console.log(this.state.pertanyaan_kuis);
    
                        let pilihanPertanyaanKuis = [];
    
                        for (const key in this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis) {
                            if (this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                const elementPilihan = this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis[key];
                                
                                pilihanPertanyaanKuis = [
                                    ...pilihanPertanyaanKuis,
                                    elementPilihan
                                ];
                            }
                        }
    
                        this.setState({
                            ...this.state,
                            pilihan_pertanyaan_kuis: pilihanPertanyaanKuis
                        },()=>{
                            this.$f7.dialog.close();
    
                            setInterval(this.setTime, 1000);
    
                        });
                    })
                })
                
            }
        })

        //online
        this.props.getKuis(this.state.routeParams).then(()=>{

            this.setState({
                loading:false,
                kuis: this.props.kuis.rows[0]
            },()=>{

                let pertanyaanKuis = [];

                for (const key in this.state.kuis.pertanyaan_kuis) {
                    if (this.state.kuis.pertanyaan_kuis.hasOwnProperty(key)) {
                        const element = this.state.kuis.pertanyaan_kuis[key];
                        
                        pertanyaanKuis = [
                            ...pertanyaanKuis,
                            element
                        ];
                    }
                }

                this.setState({
                    ...this.state,
                    pertanyaan_kuis: pertanyaanKuis,
                    sekuen_pertanyaan: this.$f7route.params['nomor'] ? this.$f7route.params['nomor'] : 1
                },()=>{
                    // console.log(this.state.pertanyaan_kuis);

                    let pilihanPertanyaanKuis = [];

                    for (const key in this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis) {
                        if (this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                            const elementPilihan = this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis[key];
                            
                            pilihanPertanyaanKuis = [
                                ...pilihanPertanyaanKuis,
                                elementPilihan
                            ];
                        }
                    }

                    this.setState({
                        ...this.state,
                        pilihan_pertanyaan_kuis: pilihanPertanyaanKuis,
                        // sekuen_pertanyaan: this.$f7route.params['nomor'] ? this.$f7route.params['nomor'] : 1
                    },()=>{
                        this.$f7.dialog.close();

                        console.log(this.state)

                        setInterval(this.setTime, 1000);

                        // this.props.getPenggunaKuis({...this.state.routeParams, pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
                        //     if(parseInt(result.payload.total) > 0){
                        //         // ada recordnya
                        //         this.setState({
                        //             skor: result.payload.rows[0].skor,
                        //             benar: result.payload.rows[0].benar
                        //         })
                        //     }
                        // })

                    });
                })
            });
        });

    }

    setTime = () => {
        this.setState({
            totalSeconds: ++this.state.totalSeconds
        },()=>{
            this.setState({
                secondsLabel: this.pad(this.state.totalSeconds % 60),
                minutesLabel: this.pad(parseInt(this.state.totalSeconds / 60)),
                durasi: this.state.totalSeconds,
                routeParams: {
                    ...this.state.routeParams,
                    durasi: this.state.totalSeconds
                }
            },()=>{
                // console.log(this.state.minutesLabel + ":" + this.state.secondsLabel);
                // console.log(this.state.durasi);
            });
        });
        // secondsLabel.innerHTML = 
        // minutesLabel.innerHTML = ;
    }

    pad = (val) => {
        let valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    klikJawabanCheckbox = (e) => {
        // console.log(pilihan_pertanyaan_kuis_id);
        // console.log(e);
        this.setState({
            ...this.state,
            checkbox_jawaban: {
                ...this.state.checkbox_jawaban,
                [e]: (this.state.checkbox_jawaban[e] ? (parseInt(this.state.checkbox_jawaban[e]) === 1 ? 0 : 1) : 1)
            }
        },()=>{
            console.log(this.state.checkbox_jawaban)
        })
    }

    simpanCheckboxJawaban = () => {

        this.$f7.dialog.preloader();

        console.log(parseInt(this.state.sekuen_pertanyaan));
        console.log(parseInt(this.state.kuis.jumlah_pertanyaan));
        
        if(parseInt(this.state.sekuen_pertanyaan) < parseInt(this.state.kuis.jumlah_pertanyaan)){
            // for (const key in this.state.checkbox_jawaban) {
            //     if (this.state.checkbox_jawaban.hasOwnProperty(key)) {
            //         const element = this.state.checkbox_jawaban[key];
            //         console.log(element);
            //     }
            // }

            let arrPilihanPertanyaanKuisId = []

            for (const key in this.state.checkbox_jawaban) {
                if (this.state.checkbox_jawaban.hasOwnProperty(key)) {
                    const element = this.state.checkbox_jawaban[key];
                    if(parseInt(element) === 1){
                        console.log(key + " lanjut " + element);

                        arrPilihanPertanyaanKuisId.push(key);
                    }
                }
            }
            
            this.setState({
                ...this.state,
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    pilihan_pertanyaan_kuis_id: arrPilihanPertanyaanKuisId,
                    sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                    nilai:1
                }
            },()=>{

                this.props.simpanJawabanKuisCheckbox(this.state.routeParamsJawabanKuis).then((result)=>{
                    this.setState({
                        ...this.state,
                        checkbox_jawaban: {},
                        benar: parseFloat(this.state.benar)+parseFloat(result.payload.rows[0].benar),
                        skor: ((parseFloat(this.state.benar)+parseFloat(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100,
                        sekuen_pertanyaan: parseFloat(this.state.sekuen_pertanyaan)+1
                    },()=>{
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
                            }
                        },()=>{

                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                let pilihanPertanyaanKuis = [];
        
                                for (const key in this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis) {
                                    if (this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                        const elementPilihan = this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis[key];
                                        
                                        pilihanPertanyaanKuis = [
                                            ...pilihanPertanyaanKuis,
                                            elementPilihan
                                        ];
                                    }
                                }
        
                                this.setState({
                                    ...this.state,
                                    pilihan_pertanyaan_kuis: pilihanPertanyaanKuis,
                                    checkbox_jawaban: {}
                                },()=>{
                                    let socket = io(localStorage.getItem('socket_url'));

                                    socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });

                                    this.$f7.dialog.close();

                                    // this.gantiUrl()
                                });

                            });
                        })
                    })
                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })

            })

        }else{

            let arrPilihanPertanyaanKuisId = []

            for (const key in this.state.checkbox_jawaban) {
                if (this.state.checkbox_jawaban.hasOwnProperty(key)) {
                    const element = this.state.checkbox_jawaban[key];
                    if(parseInt(element) === 1){
                        console.log(key + " stop " + element);

                        arrPilihanPertanyaanKuisId.push(key);
                    }
                }
            }
            
            this.setState({
                ...this.state,
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    pilihan_pertanyaan_kuis_id: arrPilihanPertanyaanKuisId,
                    sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                    nilai:1
                }
            },()=>{

                this.props.simpanJawabanKuisCheckbox(this.state.routeParamsJawabanKuis).then((result)=>{
                    this.setState({
                        ...this.state,
                        benar: parseFloat(this.state.benar)+parseFloat(result.payload.rows[0].benar),
                        skor: ((parseFloat(this.state.benar)+parseFloat(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100
                        // sekuen_pertanyaan: parseFloat(this.state.sekuen_pertanyaan)+1
                    },()=>{
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
                            }
                        },()=>{

                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                // console.log('akhir dari kuis');
                                let socket = io(localStorage.getItem('socket_url'));
                                socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });
            
                                this.setState({
                                    ...this.state,
                                    sheetOpened: true
                                },()=>{
                                    this.$f7.dialog.close();

                                    // this.gantiUrl()
                                });

                            });
                        })
                    })
                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })

            })

            // this.$f7.dialog.close();
        }
    }

    simpanIsianJawaban = () => {

        this.$f7.dialog.preloader();

        console.log(parseInt(this.state.sekuen_pertanyaan));
        console.log(parseInt(this.state.kuis.jumlah_pertanyaan));
        
        if(parseInt(this.state.sekuen_pertanyaan) < parseInt(this.state.kuis.jumlah_pertanyaan)){

            this.setState({
                ...this.state,
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    isian_jawaban:this.state.isian_jawaban,
                    pilihan_pertanyaan_kuis_id: null,
                    sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                    nilai:1
                }
            },()=>{
                console.log(this.state)

                this.props.simpanJawabanKuisIsian(this.state.routeParamsJawabanKuis).then((result)=>{
                    // console.log(result.payload);
                    this.setState({
                        ...this.state,
                        isian_jawaban: '',
                        benar: parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar),
                        skor: ((parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100,
                        sekuen_pertanyaan: parseInt(this.state.sekuen_pertanyaan)+1                        
                    },()=>{
                        // console.log(this.state);
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
                            }
                        },()=>{

                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                let pilihanPertanyaanKuis = [];
        
                                for (const key in this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis) {
                                    if (this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                        const elementPilihan = this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis[key];
                                        
                                        pilihanPertanyaanKuis = [
                                            ...pilihanPertanyaanKuis,
                                            elementPilihan
                                        ];
                                    }
                                }
        
                                this.setState({
                                    ...this.state,
                                    pilihan_pertanyaan_kuis: pilihanPertanyaanKuis
                                },()=>{
                                    let socket = io(localStorage.getItem('socket_url'));

                                    socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });

                                    this.$f7.dialog.close();

                                    // console.log(this.state)
                                    // this.gantiUrl()
                                });

                            });
                        })
                    })

                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })

                // this.$f7.dialog.close();
            })
        
        }else{

            //end of show
            this.setState({
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    isian_jawaban:this.state.isian_jawaban,
                    sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                    pilihan_pertanyaan_kuis_id: null,
                    nilai:1
                    // ...this.state.routeParamsJawabanKuis,
                    // pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    // kuis_id:this.$f7route.params['kuis_id'],
                    // pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    // // pilihan_pertanyaan_kuis_id:id,
                    // nilai:1,
                    // isian_jawaban:this.state.isian_jawaban
                }
            },()=>{
                
                this.props.simpanJawabanKuisIsian(this.state.routeParamsJawabanKuis).then((result)=>{

                    this.setState({
                        ...this.state,
                        benar: parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar),
                        skor: ((parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100,
                        // sekuen_pertanyaan: parseInt(this.state.sekuen_pertanyaan)+1
                    },()=>{

                        
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar),
                                isian_jawaban: null
                            }
                        },()=>{
                
                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                // console.log('akhir dari kuis');
                                let socket = io(localStorage.getItem('socket_url'));
                                socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });
            
                                this.setState({
                                    ...this.state,
                                    sheetOpened: true
                                },()=>{
                                    this.$f7.dialog.close();

                                    // this.gantiUrl()
                                });
                                
                            });
                
                        });

                    });
                

                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })
            
            });

        }
    }

    gantiUrl = () => {
        let arrUrl = window.location.href.split("/");
        let urlBaru = ""

        for (let index = 3; index < arrUrl.length; index++) {
            const element = arrUrl[index];

            if(index < parseInt(arrUrl.length)-1){
                urlBaru += "/"+element
            }
            
        }

        urlBaru += "/"+this.state.sekuen_pertanyaan

        window.history.pushState({}, null, urlBaru);
    }

    pilihJawaban = (id) => {

        this.$f7.dialog.preloader();

        console.log(parseInt(this.state.sekuen_pertanyaan));
        console.log(parseInt(this.state.kuis.jumlah_pertanyaan));
        
        if(parseInt(this.state.sekuen_pertanyaan) < parseInt(this.state.kuis.jumlah_pertanyaan)){

            this.setState({
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    pilihan_pertanyaan_kuis_id:id,
                    sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                    nilai:1,
                    isian:''
                }
            },()=>{
                this.props.simpanJawabanKuis(this.state.routeParamsJawabanKuis).then((result)=>{
                    // console.log(result.payload.rows[0].benar);
                    this.setState({
                        ...this.state,
                        benar: parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar),
                        skor: ((parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100,
                        sekuen_pertanyaan: parseInt(this.state.sekuen_pertanyaan)+1
                    },()=>{
                        // console.log(this.state);
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
                            }
                        },()=>{
                
                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                let pilihanPertanyaanKuis = [];
        
                                for (const key in this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis) {
                                    if (this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                        const elementPilihan = this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pilihan_pertanyaan_kuis[key];
                                        
                                        pilihanPertanyaanKuis = [
                                            ...pilihanPertanyaanKuis,
                                            elementPilihan
                                        ];
                                    }
                                }
        
                                this.setState({
                                    ...this.state,
                                    pilihan_pertanyaan_kuis: pilihanPertanyaanKuis
                                },()=>{
                                    let socket = io(localStorage.getItem('socket_url'));

                                    socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });

                                    this.$f7.dialog.close();

                                    // this.gantiUrl()
                                });

                            });
                
                        });

                    });

                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })
            });

        }else{

            this.setState({
                routeParamsJawabanKuis: {
                    ...this.state.routeParamsJawabanKuis,
                    pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id,
                    kuis_id:this.$f7route.params['kuis_id'],
                    pertanyaan_kuis_id:this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].pertanyaan_kuis_id,
                    pilihan_pertanyaan_kuis_id:id,
                    nilai:1,
                    isian:''
                }
            },()=>{
                
                this.props.simpanJawabanKuis(this.state.routeParamsJawabanKuis).then((result)=>{

                    this.setState({
                        ...this.state,
                        benar: parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar),
                        skor: ((parseInt(this.state.benar)+parseInt(result.payload.rows[0].benar))/this.state.kuis.jumlah_pertanyaan)*100,
                        // sekuen_pertanyaan: parseInt(this.state.sekuen_pertanyaan)+1
                    },()=>{

                        
                        this.setState({
                            ...this.state,
                            routeParams: {
                                ...this.state.routeParams,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                status_mengerjakan_id: 1,
                                skor: this.state.skor,
                                total: this.state.kuis.jumlah_pertanyaan,
                                benar: this.state.benar,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
                            }
                        },()=>{
                
                            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                                
                                // console.log('akhir dari kuis');
                                let socket = io(localStorage.getItem('socket_url'));
                                socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });
            
                                this.setState({
                                    ...this.state,
                                    sheetOpened: true
                                },()=>{
                                    this.$f7.dialog.close();

                                    // this.gantiUrl()
                                });
                                
                            });
                
                        });

                    });
                

                }).catch(error => {
                    // catch and handle error or do nothing
                    // alert('gagal')
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon pilih kembali jawaban Anda dan ulangi prosesnya', 'Peringatan')
                })
            });


        }
    }

    lihatHasilAkhir = () => {
        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                kuis_id: this.$f7route.params['kuis_id'],
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                status_mengerjakan_id: 2,
                skor: this.state.skor,
                total: this.state.kuis.jumlah_pertanyaan,
                benar: this.state.benar,
                sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                salah: parseFloat(this.state.kuis.jumlah_pertanyaan)-parseFloat(this.state.benar)
            }
        },()=>{

            this.props.simpanPenggunaKuis(this.state.routeParams).then(()=>{
                this.setState({
                    sheetOpened:false
                },()=>{
                    let socket = io(localStorage.getItem('socket_url'));
                    socket.emit('createMessage', this.state.routeParams.kuis_id, () => { });

                    this.$f7router.navigate('/hasilAkhirKuis/'+this.state.routeParams.kuis_id);
                });
            });

        });
    }

    gantiIsianJawaban = (e) => {
        // console.log(e.target.value);
        this.setState({
            isian_jawaban: e.target.value
        })

    }

    render()
    {
        return (
            <Page name="kerjakanKuis" hideBarsOnScroll>
            {/* <Page name="kerjakanKuis" hideBarsOnScroll className="halamanBeranda"> */}
                <Navbar>
                    {/* <Appbar> */}
                        <div className="left" style={{width:'100%'}}>
                            {/* <Button small panelToggle="left" className="display-flex" iconF7="bars" /> */}
                            <Button small className="display-flex margin-left-half" style={{fontSize:'20px', minWidth:'80px'}}>
                                {this.state.minutesLabel}:{this.state.secondsLabel}
                            </Button>
                            <Button small className="display-flex margin-left-half">
                                {this.state.sekuen_pertanyaan}/{this.state.kuis.jumlah_pertanyaan}
                            </Button>
                            <Progressbar style={{height:'20px'}} progress={((this.state.sekuen_pertanyaan/this.state.kuis.jumlah_pertanyaan)*100)} id="demo-inline-progressbar"></Progressbar>
                            {/* <Button small className="display-flex margin-left-half" iconF7="arrowshape_turn_up_left_fill" /> */}
                        </div>
                        {/* <div className="right" style={{width:'65%'}}>
                        </div> */}
                    {/* </Appbar> */}
                </Navbar>
                {/* <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kuis</NavTitle>
                    <NavTitleLarge>
                        Kuis
                    </NavTitleLarge>
                </Navbar> */}
                <Row>
                <Col width="0" tabletWidth="15"></Col>
                <Col width="100" tabletWidth="70">
                {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                <Card>
                    <CardContent style={{fontSize:'15px', fontWeight:'bold'}}>
                        Skor: {this.state.skor ? parseFloat(this.state.skor).toFixed(1) : "0"}/100
                    </CardContent>
                </Card>
                }
                <Card>
                    <CardContent style={{fontSize:'15px', fontWeight:'bold'}}>
                        {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].kode_bagian_kuis ? <>{this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].kode_bagian_kuis}.</> : <></>} {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].bagian_kuis}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{fontSize:'20px', fontWeight:'normal', minHeight:'100px'}} className="isiPertanyaan">
                        {/* {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].teks} */}
                        <div style={{fontSize:'12px', marginBottom:'-16px'}}>{this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].kode_pertanyaan}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].teks }} />
                        {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_audio &&
                        <ReactAudioPlayer
                            src={this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_audio}
                            autoPlay={false}
                            controls
                            style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                        />
                        }
                        {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video &&
                        <>
                        <YouTube
                            videoId={(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video ? (typeof this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video.split("?")[1] !== 'undefined' ? this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                            id={(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video ? (typeof this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video.split("?")[1] !== 'undefined' ? this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                        />
                        <br/>
                        </>
                        }
                    </CardContent>
                </Card>
                {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 1 &&
                <BlockTitle style={{color:'#434343'}}>Pilihan Jawaban</BlockTitle>
                }
                {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 2 &&
                <BlockTitle style={{color:'#434343'}}>Pilihan Jawaban (Bisa lebih dari satu)</BlockTitle>
                }
                {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 3 &&
                <BlockTitle style={{color:'#434343'}}>Isian Jawaban</BlockTitle>
                }
                <Card style={{marginBottom:'32px'}}>
                    <CardContent>
                        {this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id === null &&
                        <>
                        {this.state.pilihan_pertanyaan_kuis.map((option)=>{
                            console.log(this.state.sekuen_pertanyaan)

                            return (
                                <Link style={{display:'initial', color:'white'}} onClick={()=>this.pilihJawaban(option.pilihan_pertanyaan_kuis_id)}>
                                    <Card>
                                        <CardContent style={{fontSize:'20px', fontWeight:'bold', minHeight:'50px', backgroundColor:this.warna[this.state.pilihan_pertanyaan_kuis.indexOf(option)]}}>
                                            {option.teks}
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                        </>
                        }
                        {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 1 &&
                        <>
                        {this.state.pilihan_pertanyaan_kuis.map((option)=>{
                            return (
                                <Link style={{display:'initial', color:'white'}} onClick={()=>this.pilihJawaban(option.pilihan_pertanyaan_kuis_id)}>
                                    <Card>
                                        <CardContent style={{fontSize:'20px', fontWeight:'bold', minHeight:'50px', backgroundColor:this.warna[this.state.pilihan_pertanyaan_kuis.indexOf(option)]}}>
                                            {option.teks}
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                        </>
                        }
                        {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 2 &&
                        <>
                        {this.state.pilihan_pertanyaan_kuis.map((option)=>{
                            return (
                                <Card>
                                    <CardContent style={{fontSize:'20px', fontWeight:'bold', minHeight:'50px'}}>
                                        <Row>
                                            <Col width="90">
                                                {option.teks}
                                            </Col>
                                            <Col width="10" style={{textAlign:'right'}}>
                                                <Checkbox 
                                                    // style={{marginTop:'15px'}} 
                                                    // indeterminate    
                                                    checked={parseInt(this.state.checkbox_jawaban[option.pilihan_pertanyaan_kuis_id]) === 1 ? true : false}
                                                    name={"pilihan-"+option.pertanyaan_kuis_id} 
                                                    value={option.pilihan_pertanyaan_kuis_id} 
                                                    onChange={()=>this.klikJawabanCheckbox(option.pilihan_pertanyaan_kuis_id)}
                                                />
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        <Button large raised fill className="color-theme-teal" style={{width:'100%'}} onClick={this.simpanCheckboxJawaban}>
                            Submit Jawaban
                        </Button>
                        </>
                        }
                        {parseInt(this.state.pertanyaan_kuis[(this.state.sekuen_pertanyaan-1)].tipe_pertanyaan_id) === 3 &&
                        <>
                        <List>
                            <ListInput
                                outline
                                label="Ketik Jawaban di sini"
                                floatingLabel
                                type="text"
                                placeholder="Ketik Jawaban di sini ..."
                                clearButton
                                className="isianJawaban"
                                large
                                onChange={this.gantiIsianJawaban}
                                value={this.state.isian_jawaban}
                            >
                            </ListInput>
                            <ListItem>
                                <Button large raised fill className="color-theme-teal" style={{width:'100%'}} onClick={this.simpanIsianJawaban}>Submit Jawaban</Button>
                            </ListItem>
                        </List>
                        </>
                        }
                    </CardContent>
                </Card>
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
                            <h3>Selamat!</h3>
                            <p>Anda telah sampai pada akhir dari kuis ini</p>
                            <Button raised fill large onClick={this.lihatHasilAkhir}>
                                Lihat Hasil Akhir
                            </Button>
                        </Block>
                    </PageContent>
                </Sheet>
                </Col>
                <Col width="0" tabletWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      getPertanyaanKuis: Actions.getPertanyaanKuis,
      simpanJawabanKuis: Actions.simpanJawabanKuis,
      simpanJawabanKuisIsian: Actions.simpanJawabanKuisIsian,
      simpanJawabanKuisCheckbox: Actions.simpanJawabanKuisCheckbox,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pertanyaan_kuis: Kuis.pertanyaan_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kerjakanKuis));
  