import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';
import AktivitasSosial from '../AktivitasSosial';

class tampilRuang extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            ruang_id: this.$f7route.params['ruang_id'],
            jabatan_ruang_id: 99,
            start: 0
        },
        ruang: {
            rows: [{
                nama: '-',
                deskripsi: '-',
                self_pengguna_ruang: {}
            }],
            total: 0
        },
        pertanyaan: {
            rows: [],
            result: 0
        },
        pengguna_ruang: {
            rows: [],
            total: 0
        },
        kuis_ruang: {
            rows: [],
            total: 0
        },
        sesi_kuis: {
            rows: [],
            total: 0
        },
        linimasa: {
            rows: [],
            total: 0
        },
        startLinimasa: 0,
        openActions: false,
        edited: {
            nama: '-',
            jabatan_ruang_id: 99
        },
        defaultValueJabatanRuangId: 99,
        tabAktif: {
            tab0:true,
            tab1:false,
            tab2:false,
            tab3:false
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    klikNext = () => {
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna_ruang: result.payload
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        });
    }
    
    klikPrev = () => {
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna_ruang: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            });
        });
    }

    componentDidMount = () => {

        window.addEventListener("resize", ()=>{
            this.props.updateWindowDimension()
            console.log(this.props.window_dimension)
        })

        console.log(this.props.window_dimension)

        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: null
            }
        },()=>{

            this.props.getRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang: this.props.ruang,
                    routeParams: {
                        ...this.state.routeParams,
                        pengguna_id: null,
                        dengan_rows: 'Y',
                        limit: 10
                    }
                },()=>{
                    this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                        this.setState({
                            ...this.state,
                            pengguna_ruang: this.props.pengguna_ruang
                        })
                    });
    
                    this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                        this.setState({
                            ...this.state,
                            pertanyaan: this.props.pertanyaan
                        })
                    });
    
                    // this.props.getKuisRuang(this.state.routeParams).then((result)=>{
                    //     this.setState({
                    //         ...this.state,
                    //         kuis_ruang: this.props.kuis_ruang
                    //     })
                    // });

                    this.props.getSesiKuis(this.state.routeParams).then((result)=>{
                        this.setState({
                            sesi_kuis: this.props.sesi_kuis,
                            loadingKuis: false,
                            routeParamsNotifikasi: {
                                ...this.state.routeParamsNotifikasi,
                                start: this.state.startLinimasa,
                                ruang_id: this.$f7route.params['ruang_id']
                            }
                        },()=>{

                            this.props.getLinimasa(this.state.routeParamsNotifikasi).then((result)=>{
                                this.setState({
                                    linimasa: {
                                        rows: [
                                        ...this.state.linimasa.rows,
                                        ...this.props.linimasa.rows
                                        ],
                                        total: (parseInt(this.state.linimasa.total)+parseInt(this.props.linimasa.total))
                                    }
                                });
                            });

                        });
                    });

                });
            });

        });

    }

    tambahPertanyaanRuang = () => {
        // alert('tes');
        this.$f7router.navigate('/tambahPertanyaanRuang/'+this.$f7route.params['ruang_id']);
    }

    simpanPantauan = (pertanyaan_id) => {
        // alert(pertanyaan_id);
        this.setState({
          routeParamsPantauan: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            pertanyaan_id: pertanyaan_id
          }
        },()=>{
          this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{
    
            this.props.getPertanyaan(this.state.routeParams).then((result)=>{
              this.setState({
                pertanyaan: this.props.pertanyaan,
                notifikasi: this.props.notifikasi,
                loadingPertanyaan: false,
              });
            });
    
          })
        });
    }

    ikutiRuang = () => {
        // alert('tes');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.routeParams).then((result)=>{
                // this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                //     this.setState({
                //         ...this.state,
                //         pengguna_ruang: this.props.pengguna_ruang
                //     })
                // });
                this.props.getRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        ruang: this.props.ruang,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: null
                        }
                    },()=>{
                        this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                            this.setState({
                                ...this.state,
                                pengguna_ruang: this.props.pengguna_ruang
                            })
                        });
        
                        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                            this.setState({
                                ...this.state,
                                pertanyaan: this.props.pertanyaan
                            })
                        });
                    });
                });
            });



        });
    }

    hapusIkutiRuang = () => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 1
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.routeParams).then((result)=>{
                // this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                //     this.setState({
                //         ...this.state,
                //         pengguna_ruang: this.props.pengguna_ruang
                //     })
                // });
                this.props.getRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        ruang: this.props.ruang,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: null
                        }
                    },()=>{
                        this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                            this.setState({
                                ...this.state,
                                pengguna_ruang: this.props.pengguna_ruang
                            })
                        });
        
                        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                            this.setState({
                                ...this.state,
                                pertanyaan: this.props.pertanyaan
                            })
                        });
                    
                    });
                });
            });


        });
    }

    prosesGabungKuis = (kode_sesi) =>{
        this.$f7router.navigate('/praTampilKuis/'+kode_sesi);
    }

    openEditDetail = (pengguna_id, nama, no_absen, jabatan_ruang_id) => {
        this.setState({
            openActions: true,
            edited: {
                ...this.state.edited,
                nama: nama,
                pengguna_id: pengguna_id,
                ruang_id: this.state.routeParams.ruang_id,
                no_absen: no_absen,
                jabatan_ruang_id: 99
                // jabatan_ruang_id: (jabatan_ruang_id ? jabatan_ruang_id : this.state.edited.jabatan_ruang_id)
            }
        });
    }

    setSelectValue = (b) => {
        this.setState({
            edited: {
                ...this.state.edited,
                jabatan_ruang_id: b.target.value
            }
        });
    }

    simpanDetailRuang = () => {
        this.$f7.dialog.preloader();

        this.setState({
            ...this.state,
            edited: {
                ...this.state.edited,
                jabatan_ruang_id: (parseInt(this.state.edited.jabatan_ruang_id) !== 99 ? this.state.edited.jabatan_ruang_id : null)
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.edited).then((result)=>{
                this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        ...this.state,
                        openActions:false,
                        pengguna_ruang: this.props.pengguna_ruang,
                        defaultValueJabatanRuangId: 99
                    },()=>{
                        this.$f7.dialog.close();
                    });
                });
            });
        });

    }

    hapusAnggota = (pengguna_id, nama) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin mengeluarkan '+nama+' dari ruang?', 'Konfirmasi', ()=>{

            this.$f7.dialog.preloader()

            this.props.simpanPenggunaRuang({
                pengguna_id: pengguna_id, 
                ruang_id: this.$f7route.params['ruang_id'], 
                soft_delete: 1
            }).then((result)=>{
                this.$f7.dialog.close()
                this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        ...this.state,
                        pengguna_ruang: this.props.pengguna_ruang
                    })
                });
            })

        })

    }

    cariKeyword = (e) => {
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    cariAnggota = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                start: 0,
                limit: 10
            }
        },()=>{
        
            this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna_ruang: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date(this.state.ruang.rows[0].create_date);

        tanggal = moment(this.state.ruang.rows[0].create_date).format('D') + ' ' + this.bulan[(moment(this.state.ruang.rows[0].create_date).format('M')-1)] + ' ' + moment(this.state.ruang.rows[0].create_date).format('YYYY');
        // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

        return (
            <Page name="tampilRuang" hideBarsOnScroll>
            {/* <Page name="tampilRuang" hideBarsOnScroll className="halamanRuang"> */}
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.ruang.rows[0].nama}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.state.ruang.rows[0].nama}
                    </NavTitleLarge> */}
                    {/* <NavRight>
                        <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Ruang Baru" href="/tambahRuang">&nbsp; Ruang Baru</Link>
                    </NavRight> */}
                </Navbar>
                {/* <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70"> */}

                        <Block strong style={{
                            height:'250px', 
                            backgroundImage:'url("'+"https://be.diskuis.id"+'/assets/berkas/'+this.state.ruang.rows[0].gambar_ruang+'")', 
                            // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+this.state.ruang.rows[0].gambar_ruang+'")', 
                            backgroundSize:'100%', 
                            backgroundPosition:'center', 
                            backgroundRepeat:'no-repeat',
                            // backgroundAttachment:'fixed',
                            marginTop:'0px', 
                            marginBottom:'0px'
                        }}>
                            <Row noGap>
                                <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                                <Col width="100" tabletWidth="80" desktopWidth="80">

                                    <Card style={{background:'rgba(255, 255, 255, 0.7)', marginLeft:'0px', marginRight:'0px'}}>
                                        <CardContent>
                                            <NavTitleLarge className="judulRuang">
                                                {this.state.ruang.rows[0].nama}
                                            </NavTitleLarge>
                                            <div style={{marginTop:'0px'}} dangerouslySetInnerHTML={{ __html: this.state.ruang.rows[0].deskripsi }} />
                                            {/* <br/> */}
                                            <div style={{color:'#636363', fontSize:'12px'}}>
                                                Sejak {tanggal}<br/>
                                                Dibuat oleh <b>{this.state.ruang.rows[0].pengguna}</b>
                                            </div>
                                            {/* <div style={{color:'#636363', fontSize:'12px'}}>
                                                {this.state.pertanyaan.result} Pertanyaan<br/>
                                                {this.state.pengguna_ruang.total} Pengikut
                                            </div> */}
                                        </CardContent>
                                        <CardFooter style={{justifyContent:'space-around'}}>
                                        {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                                        <Button className={"bawahCiri color-theme-deeporange"} raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+this.state.ruang.rows[0].ruang_id)} style={{background:'#bf360c', width:'50%', maxWidth:'400px'}}>
                                            <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                            Kode Ruang
                                        </Button>
                                        }
                                        {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                                        <>
                                        {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 1 &&
                                        <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+this.state.ruang.rows[0].ruang_id)} style={{background:'#bf360c', width:'50%', maxWidth:'400px'}}>
                                            <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                            Kode Ruang
                                        </Button>
                                        }
                                        </>
                                        }
                                        </CardFooter>
                                        {/* {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                                        <CardFooter style={{justifyContent:'center'}}>
                                            {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 1 &&
                                            <>
                                            {this.state.ruang.rows[0].self_pengguna_ruang.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                            <Button large onClick={this.hapusIkutiRuang} style={{width:'100%', background:'#fefefe'}} raised iconIos="f7:checkmark_circle" iconAurora="f7:checkmark_circle" iconMd="material:checkmark_circle">&nbsp; Mengikuti</Button>
                                            }
                                            {this.state.ruang.rows[0].self_pengguna_ruang.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                            <Button large onClick={this.ikutiRuang} style={{width:'100%', background:'#007AFF', color:'white'}} raised iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button>
                                            }
                                            </>
                                            }
                                        </CardFooter>
                                        } */}
                                        {/* {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                                        <CardFooter style={{justifyContent:'center'}}>
                                            {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 2 &&
                                            <>
                                            <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+this.state.ruang.rows[0].ruang_id)} style={{background:'#bf360c', width:'50%', maxWidth:'400px'}}>
                                                <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                                Kode Ruang
                                            </Button>
                                            {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 1 &&
                                            <>
                                            <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+this.state.ruang.rows[0].ruang_id)} style={{background:'#bf360c', width:'50%', maxWidth:'400px'}}>
                                                <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                                Kode Ruang
                                            </Button>
                                            </>
                                            }
                                            </>
                                            }
                                        </CardFooter>
                                        } */}
                                    </Card>
                                </Col>
                                <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                            </Row>
                        </Block>
                        <Row noGap>
                            <Col width="100" tabletWidth="100" style={{display:'none'}}>
                                <Row noGap>
                                    <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                                    <Col width="100" tabletWidth="80" desktopWidth="80">

                                        <Card>
                                            <CardContent>
                                                <NavTitleLarge className="judulRuang">
                                                    {this.state.ruang.rows[0].nama}
                                                </NavTitleLarge>
                                                <div style={{marginTop:'0px'}} dangerouslySetInnerHTML={{ __html: this.state.ruang.rows[0].deskripsi }} />
                                                {/* <br/> */}
                                                <div style={{color:'#636363', fontSize:'12px'}}>
                                                    Sejak {tanggal}<br/>
                                                    Dibuat oleh <b>{this.state.ruang.rows[0].pengguna}</b>
                                                </div>
                                                {/* <div style={{color:'#636363', fontSize:'12px'}}>
                                                    {this.state.pertanyaan.result} Pertanyaan<br/>
                                                    {this.state.pengguna_ruang.total} Pengikut
                                                </div> */}
                                            </CardContent>
                                            {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                                            <CardFooter style={{justifyContent:'center'}}>
                                                {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 1 &&
                                                <>
                                                {this.state.ruang.rows[0].self_pengguna_ruang.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                <Button large onClick={this.hapusIkutiRuang} style={{width:'100%', background:'#fefefe'}} raised iconIos="f7:checkmark_circle" iconAurora="f7:checkmark_circle" iconMd="material:checkmark_circle">&nbsp; Mengikuti</Button>
                                                }
                                                {this.state.ruang.rows[0].self_pengguna_ruang.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                <Button large onClick={this.ikutiRuang} style={{width:'100%', background:'#007AFF', color:'white'}} raised iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button>
                                                }
                                                </>
                                                }
                                                {parseInt(this.state.ruang.rows[0].jenis_ruang_id) === 2 &&
                                                <>
                                                <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+this.state.ruang.rows[0].ruang_id)} style={{background:'#bf360c', width:'100%', maxWidth:'400px'}}>
                                                    <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                                    Kode Ruang
                                                </Button>
                                                </>
                                                }
                                            </CardFooter>
                                            }
                                        </Card>
                                    </Col>
                                    <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                                </Row>
                            </Col> 
                            <Col width="100" tabletWidth="100">
                                {/* <Toolbar tabbar>
                                    <Link tabLink="#tab-1" tabLinkActive>Pertanyaan ({this.state.pertanyaan.result ? this.state.pertanyaan.result : "0"})</Link>
                                    <Link tabLink="#tab-2">Pengikut ({this.state.pengguna_ruang.total ? this.state.pengguna_ruang.total : "0"})</Link>
                                    <Link tabLink="#tab-3">Kuis (0)</Link>
                                </Toolbar> */}
                                <Row noGap>
                                    <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                                    <Col width="100" tabletWidth="80" desktopWidth="80">

                                        <Row noGap style={{marginTop:'8px'}}>
                                            <Col width="100" tabletWidth="30">
                                                <Card style={{margin:'4px'}}>
                                                    <CardContent style={{padding:'8px', display:(this.props.window_dimension.width < 768 ? 'inline-flex' : 'block')}}>
                                                        <Button tabLink="#tab-6" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}} tabLinkActive>Aktivitas</Button>
                                                        <Button tabLink="#tab-4" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Kuis ({this.state.sesi_kuis.total > 0 ? this.state.sesi_kuis.total : "0"})</Button>
                                                        <Button tabLink="#tab-2" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Anggota ({this.state.pengguna_ruang.total ? this.state.pengguna_ruang.total : "0"})</Button>
                                                        <Button tabLink="#tab-5" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Diskusi ({this.state.pertanyaan.result ? this.state.pertanyaan.result : "0"})</Button>
                                                    </CardContent>
                                                </Card>
                                                {/* <Card style={{margin:'4px'}} className="hilangDiDesktop">
                                                    <CardContent style={{padding:'8px', display:'inline-flex', width:'100%', justifyContent:'center'}}>
                                                        <Button tabLink="#tab-6" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}} tabLinkActive>Aktivitas</Button>
                                                        <Button tabLink="#tab-4" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Kuis ({this.state.sesi_kuis.total > 0 ? this.state.sesi_kuis.total : "0"})</Button>
                                                        <Button tabLink="#tab-2" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Anggota ({this.state.pengguna_ruang.total ? this.state.pengguna_ruang.total : "0"})</Button>
                                                        <Button tabLink="#tab-5" style={{lineHeight:'14px', textAlign:'left', display:'block', paddingTop:'8px'}}>Diskusi ({this.state.pertanyaan.result ? this.state.pertanyaan.result : "0"})</Button>
                                                    </CardContent>
                                                </Card> */}
                                            </Col>
                                            <Col width="100" tabletWidth="70">
                                                <Card style={{margin:'4px'}}>
                                                    <CardContent>
                                                
                                                        <Tabs animated>
                                                            <Tab id="tab-6" tabActive>
                                                                {/* <Row noGap>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                <Col width="100" tabletWidth="80" desktopWidth="70"> */}
                                                                <AktivitasSosial tipe="ruang" ruang_id={this.$f7route.params['ruang_id']} style={{marginBottom:'50px'}} />
                                                                {/* </Col>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                </Row> */}
                                                                {/* <Row noGap>
                                                                    <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                    <Col width="100" tabletWidth="80" desktopWidth="70">

                                                                        <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                            {this.state.linimasa.rows.map((option)=>{
                                                                                let tgl = new Date(option.create_date);
                                                                                let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                                                                let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
                                                        
                                                                                return (
                                                                                <div className="timeline-item">
                                                                                    <div className="timeline-item-date" style={{fontSize:'10px'}}>
                                                                                    {tanggal}
                                                                                    <br/>
                                                                                    {waktu}
                                                                                    </div>
                                                                                    <div className="timeline-item-divider"></div>
                                                                                    <div className="timeline-item-content card">
                                                                                    <div className="card-content card-content-padding" style={{padding:'8px'}}>
                                                                                        <Row>
                                                                                        <Col width="15" tabletWidth="10">
                                                                                            <Link href={"/tampilPengguna/"+option.pengguna_id_pelaku}>
                                                                                            <img src={option.gambar} style={{width:'50%', borderRadius:'50%', marginTop:'10px'}} />
                                                                                            </Link>
                                                                                        </Col>
                                                                                        <Col width="85" tabletWidth="90">
                                                                                            <Link href={"/tampilPengguna/"+option.pengguna_id_pelaku}>
                                                                                            <div style={{fontWeight:'normal', color:'#039be5'}}>{option.nama_pengguna}</div>
                                                                                            </Link>
                                                                                            <div dangerouslySetInnerHTML={{ __html: option.keterangan }} />
                                                                                            {parseInt(option.jenis_linimasa_id) === 1 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Kunjungi Ruang)</Link>}
                                                                                            {parseInt(option.jenis_linimasa_id) === 2 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Kunjungi Ruang)</Link>}
                                                                                            {parseInt(option.jenis_linimasa_id) === 3 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Lihat Peringkat)</Link>}
                                                                                        </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                    </div>
                                                                                </div>
                                                                                )
                                                                            })}    
                                                                        </Block>   
                                                                    </Col>
                                                                    <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                </Row> */}
                                                            </Tab>
                                                            <Tab id="tab-4">
                                                                {/* <Row noGap>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                <Col width="100" tabletWidth="80" desktopWidth="70"> */}
                                                                {/* className={"skeleton-text skeleton-effect-blink"} */}
                                                                
                                                                {this.state.loadingKuis &&
                                                                <>
                                                                <Card style={{borderBottom:'3px solid #009efd'}} className={"skeleton-text skeleton-effect-blink"}>
                                                                    <Row className={"skeleton-text skeleton-effect-blink"}>
                                                                        <Col width="20" style={{
                                                                            height:'80px', 
                                                                            backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+'")', 
                                                                            backgroundSize:'cover', 
                                                                            backgroundRepeat:'no-repeat',
                                                                            marginTop:'0px', 
                                                                            marginBottom:'0px'
                                                                        }}
                                                                        className={"skeleton-text skeleton-effect-blink"}
                                                                        >
                                                                            &nbsp;
                                                                        </Col>
                                                                        <Col width="80" style={{paddingLeft:'8px'}} className={"skeleton-text skeleton-effect-blink"}>
                                                                            <Row>
                                                                                <Col width="100" tabletWidth="75">
                                                                                    <h3 style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        {'option.judul'}
                                                                                    </h3>
                                                                                    <div style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        {'option.keterangan'}
                                                                                    </div>
                                                                                    <div style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        dari {'option.waktu_mulai'} sampai {'option.waktu_selesai'}
                                                                                    </div>
                                                                                </Col>
                                                                                <Col width="100" tabletWidth="25" style={{padding:'8px'}}>
                                                                                    <Row>
                                                                                        <Col width="80">
                                                                                            <Button disabled={'disabled'} large raised fill onClick={()=>this.prosesGabungKuis('option.kode_sesi')}>
                                                                                                <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                                                                Ikuti Kuis
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col width="20">
                                                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+'option.sesi_kuis_id'}>
                                                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col width="100" style={{fontSize:'10px'}}>
                                                                                            {'disabled_label'}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                    <Popover className={"popover-menu-"+'option.sesi_kuis_id'}>
                                                                        <List>
                                                                            <ListItem link={'/peringkatKuis/'+'option.sesi_kuis_id'} popoverClose title="Peringkat Hasil" />
                                                                        </List>
                                                                    </Popover>
                                                                </Card>
                                                                <Card style={{borderBottom:'3px solid #009efd'}} className={"skeleton-text skeleton-effect-blink"}>
                                                                    <Row>
                                                                        <Col width="20" style={{
                                                                            height:'80px', 
                                                                            backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+')', 
                                                                            backgroundSize:'cover', 
                                                                            backgroundRepeat:'no-repeat',
                                                                            marginTop:'0px', 
                                                                            marginBottom:'0px'
                                                                        }}
                                                                        className={"skeleton-text skeleton-effect-blink"}
                                                                        >
                                                                            &nbsp;
                                                                        </Col>
                                                                        <Col width="80" style={{paddingLeft:'8px'}} className={"skeleton-text skeleton-effect-blink"}>
                                                                            <Row>
                                                                                <Col width="100" tabletWidth="75">
                                                                                    <h3 style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        {'option.judul'}
                                                                                    </h3>
                                                                                    <div style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        {'option.keterangan'}
                                                                                    </div>
                                                                                    <div style={{marginTop:'4px', marginBottom:'4px'}}>
                                                                                        dari {'option.waktu_mulai'} sampai {'option.waktu_selesai'}
                                                                                    </div>
                                                                                </Col>
                                                                                <Col width="100" tabletWidth="25" style={{padding:'8px'}}>
                                                                                    <Row>
                                                                                        <Col width="80">
                                                                                            <Button disabled={'disabled'} large raised fill onClick={()=>this.prosesGabungKuis('option.kode_sesi')}>
                                                                                                <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                                                                Ikuti Kuis
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col width="20">
                                                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+'option.sesi_kuis_id'}>
                                                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                                                            </Button>
                                                                                        </Col>
                                                                                        <Col width="100" style={{fontSize:'10px'}}>
                                                                                            {'disabled_label'}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                    <Popover className={"popover-menu-"+'option.sesi_kuis_id'}>
                                                                        <List>
                                                                            <ListItem link={'/peringkatKuis/'+'option.sesi_kuis_id'} popoverClose title="Peringkat Hasil" />
                                                                        </List>
                                                                    </Popover>
                                                                </Card>
                                                                </>
                                                                }
                                                                {/* daftar kuis yang di assign ke ruang ini */}
                                                                {!this.state.loadingKuis &&
                                                                <>
                                                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                    <Row style={{justifyContent:'flex-start'}}>
                                                                        {JSON.parse(localStorage.getItem('user')).pengguna_id === this.state.ruang.rows[0].pengguna_id &&
                                                                        <Col width="50" tabletWidth="50">
                                                                            {/* <Block strong style={{marginTop:'0px', marginBottom:'0px'}}> */}
                                                                            <Button raised style={{background:'#434343', color:'white'}} onClick={()=>this.$f7router.navigate('/tambahKuis/#ruang_id='+this.state.routeParams.ruang_id)}>
                                                                            {/* <Button raised style={{background:'#434343', color:'white'}} actionsOpen="#actions-two-groups"> */}
                                                                                <i className="f7-icons" style={{fontSize:'17px'}}>plus</i>&nbsp;Tambah Kuis
                                                                            </Button>
                                                                            {/* </Block> */}
                                                                        </Col>
                                                                        }
                                                                        {JSON.parse(localStorage.getItem('user')).pengguna_id === this.state.ruang.rows[0].pengguna_id &&
                                                                        <Col width="50" tabletWidth="50">
                                                                            <Button style={{marginLeft:'8px'}} raised fill onClick={()=>this.$f7router.navigate('/laporanHasilKuis/'+this.state.ruang.rows[0].ruang_id)}>
                                                                                <i className="f7-icons" style={{fontSize:'17px'}}>doc_chart</i>&nbsp;Laporan Hasil Kuis
                                                                            </Button>
                                                                        </Col>
                                                                        }
                                                                    </Row>
                                                                </Block>
                                                                {this.state.sesi_kuis.rows.map((option)=>{
                                                                    let d1 = moment();
                                                                    let d2 = moment(option.waktu_mulai);
                                                                    let d3 = moment(option.waktu_selesai);
                                                                    
                                                                    let disabled = (d1.isAfter(d2) ? (d1.isBefore(d3) ? false : true) : true);
                                                                    let disabled_label = (d1.isAfter(d2) ? (d1.isBefore(d3) ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');

                                                                    let waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', ' + moment(option.waktu_mulai).format('HH')+ ':' + moment(option.waktu_mulai).format('mm');
                                                                    let waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', ' + moment(option.waktu_mulai).format('HH')+ ':' + moment(option.waktu_mulai).format('mm');

                                                                    return (
                                                                        <Card>
                                                                        {/* <Card style={{borderBottom:'3px solid #009efd'}}> */}
                                                                            <Row>
                                                                                <Col width="20" style={{
                                                                                    // height:'80px', 
                                                                                    height:'80px',
                                                                                    backgroundImage:'url("'+"https://be.diskuis.id"+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                                                    // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                                                    backgroundSize:'cover', 
                                                                                    backgroundPosition:'center', 
                                                                                    backgroundRepeat:'no-repeat',
                                                                                    // backgroundAttachment:'fixed',
                                                                                    marginTop:'0px', 
                                                                                    marginBottom:'0px'
                                                                                    // marginRight: '8px'
                                                                                }}>
                                                                                    &nbsp;
                                                                                </Col>
                                                                                <Col width="80" style={{paddingLeft:'8px'}}>
                                                                                    <Row>
                                                                                        <Col width="100" tabletWidth="65">
                                                                                            <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#1B1746'}}>
                                                                                                {option.judul}
                                                                                            </h3>
                                                                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'10px'}}>
                                                                                                {option.keterangan}
                                                                                            </div>
                                                                                            <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'10px'}}>
                                                                                                <b>{waktu_mulai}</b> - <b>{waktu_selesai}</b>
                                                                                                {/* dari {option.waktu_mulai} sampai {option.waktu_selesai} */}
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col width="100" tabletWidth="35" style={{padding:'8px'}}>
                                                                                            <Row>
                                                                                                <Col width="75">
                                                                                                    <Button disabled={disabled} raised fill onClick={()=>this.prosesGabungKuis(option.kode_sesi)}>
                                                                                                        <i className="icon f7-icons" style={{fontSize:'20px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                                                                        Ikuti
                                                                                                    </Button>
                                                                                                </Col>
                                                                                                <Col width="25">
                                                                                                    <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.sesi_kuis_id}>
                                                                                                        <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                                                                    </Button>
                                                                                                </Col>
                                                                                                <Col width="100" style={{fontSize:'8px', paddingTop:'4px'}}>
                                                                                                    {disabled_label}
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                            {/* <CardContent>
                                                                                {option.judul}
                                                                            </CardContent> */}
                                                                            <Popover className={"popover-menu-"+option.sesi_kuis_id}>
                                                                                <List>
                                                                                    <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat Hasil" />
                                                                                    <ListItem link={'/statistikKuis/'+option.sesi_kuis_id} popoverClose title="Statistik" />
                                                                                </List>
                                                                            </Popover>
                                                                        </Card>
                                                                    )
                                                                })}
                                                                </>
                                                                }
                                                                {/* </Col>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                </Row> */}
                                                            </Tab>
                                                            <Tab id="tab-2" >
                                                                {/* <Row noGap>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                <Col width="100" tabletWidth="80" desktopWidth="70"> */}

                                                                {/* <BlockTitle>Pengikut</BlockTitle> */}

                                                                {/* searchbar */}
                                                                <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                                                                    <List>
                                                                        <Searchbar
                                                                            className="searchbar-demo"
                                                                            // expandable
                                                                            placeholder="Cari Anggota"
                                                                            searchContainer=".search-list"
                                                                            searchIn=".item-title"
                                                                            onChange={this.cariKeyword}
                                                                            onSubmit={this.cariAnggota}
                                                                        ></Searchbar>
                                                                    </List>
                                                                </Block>

                                                                {/* pagination */}
                                                                <div className="data-table" style={{overflowY:'hidden'}}>
                                                                    <div className="data-table-footer" style={{display:'block'}}>
                                                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                                            <i className="icon icon-prev color-gray"></i>
                                                                            </a>
                                                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.pengguna_ruang.total) ? "disabled" : "" )}>
                                                                                <i className="icon icon-next color-gray"></i>
                                                                            </a>
                                                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.pengguna_ruang.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.pengguna_ruang.total)} dari {this.formatAngka(this.state.pengguna_ruang.total)} anggota</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <List mediaList>
                                                                {this.state.pengguna_ruang.rows.map((optionPengguna)=>{
                                                                    let tanggalPengguna = '';
                                                                    let tgl = new Date(optionPengguna.create_date);
                                                            
                                                                    tanggalPengguna = moment(optionPengguna.create_date).format('D') + ' ' + this.bulan[(moment(optionPengguna.create_date).format('M')-1)] + ' ' + moment(optionPengguna.create_date).format('YYYY');
                                                                    // tanggalPengguna = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                                                    return (
                                                                            <ListItem
                                                                                // title={optionPengguna.pengguna + (optionPengguna.room_master  === 1 ? " (Room Master)" : "")}
                                                                                // subtitle={"Mengikuti sejak " + tanggalPengguna}
                                                                            >
                                                                                <img slot="media" src={optionPengguna.gambar} width="44" style={{borderRadius:'50%'}} />
                                                                                <Row>
                                                                                    <Col width={localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' ? "70" : "100"}>
                                                                                        <Link href={'/tampilPengguna/'+optionPengguna.pengguna_id} style={{fontWeight:'bold'}}>{optionPengguna.pengguna} {(optionPengguna.room_master  === 1 ? " (Room Master)" : "")}</Link>
                                                                                        <br/><span style={{fontSize:'12px'}}>Bergabung sejak {tanggalPengguna}</span>
                                                                                        <br/><span style={{fontSize:'12px'}}>{(parseInt(optionPengguna.jabatan_ruang_id) === 3 && <>No.Absensi <b>{optionPengguna.no_absen}</b> | </>)} {(optionPengguna.jabatan_ruang_id ? <>Sebagai <b>{optionPengguna.jabatan_ruang}</b></> : <></>)}</span>
                                                                                    </Col>
                                                                                    {localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' &&
                                                                                    <Col width="30" style={{textAlign:'right'}}>
                                                                                        <Button style={{display:'contents'}} width="44" onClick={()=>this.openEditDetail(optionPengguna.pengguna_id, optionPengguna.pengguna, optionPengguna.no_absen, optionPengguna.jabatan_ruang_id)}>Edit Detail</Button>
                                                                                        <br/>
                                                                                        <Button style={{display:'contents'}} width="44" onClick={()=>this.hapusAnggota(optionPengguna.pengguna_id, optionPengguna.pengguna)}>Hapus</Button>
                                                                                    </Col>
                                                                                    }
                                                                                </Row>
                                                                            </ListItem>
                                                                    )
                                                                })}
                                                                </List>
                                                                {/* </Col>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                </Row> */}
                                                            </Tab>

                                                            <Tab id="tab-5">
                                                                {/* <Row noGap>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                <Col width="100" tabletWidth="80" desktopWidth="70"> */}

                                                                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                                                                    <Row>
                                                                        <Col width="100" tabletWidth="50">
                                                                            <Button raised style={{background:'#434343', color:'white', margin:'8px'}} onClick={()=>this.$f7router.navigate('/tambahPertanyaanRuang/'+this.state.routeParams.ruang_id)}>
                                                                                <i className="f7-icons" style={{fontSize:'17px'}}>plus</i>&nbsp;Tambah dari yang telah ada
                                                                            </Button>
                                                                        </Col>
                                                                        <Col width="100" tabletWidth="50">
                                                                            <Button raised style={{background:'#039be5', color:'white', margin:'8px'}} onClick={()=>this.$f7router.navigate('/tambahPertanyaan/'+this.state.routeParams.ruang_id)}>
                                                                                <i className="f7-icons" style={{fontSize:'17px'}}>plus</i>&nbsp;Tambah baru
                                                                            </Button>
                                                                        </Col>
                                                                    </Row>
                                                                </Block>
                                                                <Block strong style={{marginTop:'0px'}}>
                                                                    <Row>
                                                                        
                                                                        {this.state.pertanyaan.rows.map((option)=>{
                                                                            return(
                                                                                <Col width="100" tabletWidth="100">
                                                                                <Card>
                                                                                    {/* <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                                                                                        {option.ruang.map((optionRuang)=>{
                                                                                        return (
                                                                                            <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                                                                                            <span>&nbsp;/ {optionRuang.nama}</span>
                                                                                            </Link>
                                                                                        )
                                                                                        })}
                                                                                    </CardHeader> */}
                                                                                    <CardHeader style={{overflow: 'hidden', display:'flow-root'}}>
                                                                                        <Link href={"/tampilPertanyaan/"+option.pertanyaan_id}>
                                                                                            <b style={{fontSize:'18px'}}>{option.judul}</b>
                                                                                        </Link>
                                                                                    </CardHeader>
                                                                                    <CardContent style={{paddingTop:'8px'}}>
                                                                                        {/* {option.konten} */}
                                                                                        <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dipublikasi tanggal <b>{tanggal}</b></span> | <span style={{fontSize:'10px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                                                        <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                                                        <div style={{marginTop:'-8px', maxHeight:'100px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                                                            <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                                                                                            <p className="read-more" style={{textAlign:'center'}}>
                                                                                            </p>
                                                                                        </div>
                                                                                        <Link style={{width:'100%', marginTop:'8px'}} href={"/tampilPertanyaan/"+option.pertanyaan_id}>Baca Selengkapnya</Link>
                                                                                    </CardContent>
                                                                                    <CardFooter>
                                                                                        <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right" href={"/tampilPertanyaan/"+option.pertanyaan_id}>&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                                                                                        <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle" onClick={()=>this.simpanPantauan(option.pertanyaan_id)}>&nbsp; {option.jumlah_pantauan} Pantauan</Link>
                                                                                        <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle">&nbsp; Jawab</Link>
                                                                                        {/* <Link iconIos="f7:square_pencil" iconAurora="f7:square_pencil" iconMd="material:square_pencil">&nbsp; Ubah</Link> */}
                                                                                    </CardFooter>
                                                                                </Card>
                                                                                </Col>
                                                                            )
                                                                        })}
                                                                    </Row>

                                                                </Block>
                                                                {/* <BlockTitle>Pertanyaan</BlockTitle> */}
                                                                {/* </Col>
                                                                <Col width="100" tabletWidth="10" desktopWidth="15"></Col>
                                                                </Row> */}
                                                            </Tab>
                                                            
                                                            <Tab id="tab-3">s
                                                                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                                                                    <Button raised style={{background:'#434343', color:'white'}} actionsOpen="#actions-two-groups">
                                                                        <i className="f7-icons" style={{fontSize:'17px'}}>plus</i>&nbsp;Tambah Kuis
                                                                    </Button>
                                                                </Block>
                                                                {/* <Block strong style={{marginTop:'0px', marginBottom:'0px'}}> */}
                                                                    {this.state.kuis_ruang.rows.map((option)=>{
                                                                        let tanggal = '';
                                                                        let tgl = new Date(option.create_date);
                                                                        tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                                                        
                                                                        let waktu_mulai = '';
                                                                        let tgl_waktu_mulai = new Date(option.waktu_mulai);
                                                                        waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', pukul ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('m');
                                                                        
                                                                        let waktu_selesai = '';
                                                                        let tgl_waktu_selesai = new Date(option.waktu_selesai);
                                                                        waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', pukul ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('m');


                                                                        return (
                                                                            <Col width="50" tabletWidth="50">
                                                                                <Card style={{borderBottom:'4px solid #4dd0e1'}}>
                                                                                    <CardHeader style={{height:'100px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
                                                                                        {/* <Link href={""}>
                                                                                            <b style={{fontSize:'23px'}}>{option.judul}</b>
                                                                                        </Link> */}
                                                                                        <div className="mantab" style={{
                                                                                            backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                                            width:'1000%',
                                                                                            marginLeft:'-15px',
                                                                                            marginRight:'-15px',
                                                                                            paddingLeft:'10px',
                                                                                            marginBottom:'-50px',
                                                                                            color:'white',
                                                                                            paddingBottom:'0px',
                                                                                            height:'40px',
                                                                                            paddingTop:'10px'
                                                                                        }}>
                                                                                            <Link href={""} style={{color:'white'}}>
                                                                                                <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                                                    {option.judul}
                                                                                                </h2>
                                                                                            </Link>
                                                                                        </div>
                                                                                    </CardHeader>
                                                                                    <CardHeader style={{fontSize:'15px', minHeight:'10px', paddingTop:'4px', paddingBottom: '4px'}}>
                                                                                        <Row style={{width:'100%'}}>
                                                                                            <Col width="80">
                                                                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Dibuat pada tanggal <b>{tanggal}</b></span><br/>
                                                                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                                                            </Col>
                                                                                            <Col width="20" style={{textAlign:'right'}}>
                                                                                                <div style={{width:'100%', textAlign:'right'}}>
                                                                                                    {option.publikasi === 1  &&
                                                                                                    // <span>Rilis</span>
                                                                                                    <Chip text="Rilis" color="green" style={{color:'black'}}/>
                                                                                                    }
                                                                                                    {option.publikasi !== 1  &&
                                                                                                    // <span>Draft</span>
                                                                                                    <Chip text="Draft" />
                                                                                                    }
                                                                                                </div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </CardHeader>
                                                                                    <CardContent style={{paddingTop:'8px'}}>
                                                                                        {/* <span style={{fontSize:'12px', color: '#8c8c8c'}}>Dibuat pada tanggal <b>{tanggal}</b></span><br/>
                                                                                        <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span> */}
                                                                                        {/* <hr style={{borderTop:'1px solid #434343'}}/> */}
                                                                                        <div style={{marginTop:'10px', maxHeight:'200px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                                                            <Row noGap>
                                                                                                {/* {option.keterangan !== '' && option.keterangan !== null &&
                                                                                                <Col width="100" style={{borderBottom:'1px solid #434343', marginBottom:'8px'}}>
                                                                                                    <i>{option.keterangan}</i><br/>
                                                                                                </Col>
                                                                                                } */}
                                                                                                <Col width="100" style={{paddingTop:'0px', paddingBottom:'4px'}}>
                                                                                                    <b>{option.jenjang} {option.tingkat_pendidikan}</b><br/>
                                                                                                    <b>{option.mata_pelajaran}</b><br/>
                                                                                                </Col>
                                                                                                {/* <Col width="100">
                                                                                                    Waktu Mulai: <b>{waktu_mulai}</b><br/>
                                                                                                    {option.waktu_selesai !== '' && option.waktu_selesai !== null &&
                                                                                                    <span>Waktu Selesai: <b>{waktu_selesai}</b><br/></span>
                                                                                                    }
                                                                                                </Col> */}
                                                                                            </Row>
                                                                                        </div>
                                                                                    </CardContent>
                                                                                    <CardFooter>
                                                                                        <Button raised fill onClick={()=>this.$f7router.navigate('/kodeKuis/'+option.kuis_id)} style={{background:'#bf360c'}}>
                                                                                            <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Kuis"/>&nbsp;
                                                                                            Kode Kuis
                                                                                        </Button>
                                                                                        <Button raised fill onClick={()=>this.$f7router.navigate('/peringkatKuis/'+option.kuis_id)}>
                                                                                            <Icon ios={"f7:stopwatch"} aurora={"f7:stopwatch"} md={"material:stopwatch"} tooltip="Edit Kuis"/>&nbsp;
                                                                                            Peringkat
                                                                                        </Button>
                                                                                        {JSON.parse(localStorage.getItem('user')).pengguna_id === option.pengguna_id &&
                                                                                        <Button raised fill onClick={()=>this.$f7router.navigate('/tambahKuis/'+option.pengguna_id+'/'+option.kuis_id)} style={{background:'#2e7d32'}}>
                                                                                            <Icon ios={"f7:pencil_circle"} aurora={"f7:pencil_circle"} md={"material:pencil_circle"} tooltip="Edit Kuis"/>&nbsp;
                                                                                            Edit
                                                                                        </Button>
                                                                                        }
                                                                                        {/* <Button raised fill>
                                                                                            <Icon ios={"f7:today"} aurora={"f7:today"} md={"material:today"} tooltip="Buat Kuis Baru"/>&nbsp;
                                                                                            Live Report
                                                                                        </Button> */}
                                                                                    </CardFooter>
                                                                                </Card>
                                                                                {/* <Card raised style={{border:'0px solid #434343'}}>
                                                                                    <CardHeader>
                                                                                        {option.judul}
                                                                                    </CardHeader>
                                                                                    <CardContent>
                                                                                        <Row noGap>
                                                                                            <Col width="100">
                                                                                                Keterangan: {option.keterangan}<br/>
                                                                                            </Col>
                                                                                            <Col width="50">
                                                                                                Jenjang: {option.jenjang}<br/>
                                                                                                Tingkat: {option.tingkat_pendidikan}<br/>
                                                                                            </Col>
                                                                                            <Col width="50">
                                                                                                Mapel: {option.mata_pelajaran}<br/>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </CardContent>
                                                                                    <CardFooter>

                                                                                    </CardFooter>
                                                                                </Card> */}

                                                                            </Col>
                                                                        )
                                                                    })}
                                                                {/* </Block> */}
                                                            </Tab>
                                                        </Tabs>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                        </Row>

                                        {/* <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                            <Segmented raised>
                                                <Button tabLink="#tab-6" tabLinkActive>Aktivitas</Button>
                                                <Button tabLink="#tab-4" >Kuis ({this.state.sesi_kuis.total > 0 ? this.state.sesi_kuis.total : 0})</Button>
                                                <Button tabLink="#tab-2" >Anggota ({this.state.pengguna_ruang.total ? this.state.pengguna_ruang.total : "0"})</Button>
                                                <Button tabLink="#tab-5" style={{lineHeight:'14px'}}>Diskusi & Materi ({this.state.pertanyaan.result ? this.state.pertanyaan.result : "0"})</Button>
                                            </Segmented>
                                        </Block> */}
                                    </Col>
                                    <Col width="100" tabletWidth="10" desktopWidth="10"></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Actions id="actions-two-groups">
                            <ActionsGroup>
                                <ActionsLabel>Tambah Kuis untuk Ruang</ActionsLabel>
                                <ActionsButton bold onClick={()=>this.$f7router.navigate('/tambahKuisRuang/'+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.ruang.rows[0].ruang_id)}>Buat Kuis Baru</ActionsButton>
                                <ActionsButton>Tambah dari Kuis yang sudah ada</ActionsButton>
                            </ActionsGroup>
                            <ActionsGroup>
                                <ActionsButton color="red">Batal</ActionsButton>
                            </ActionsGroup>
                        </Actions>
                        <Actions 
                            ref="actionEditPengikut" 
                            opened={this.state.openActions} 
                            className="actionEditPengikut" 
                            onActionsClose={()=>this.setState({openActions:false})}
                        >
                            <div className="actionEditPengikut-inner">
                                <h2>Edit Detail &nbsp;<span style={{color:'#007AFF'}}>{this.state.edited.nama}</span></h2>
                                <List form style={{minWidth:'100%'}} noHairlines>
                                    <ListItem
                                        title="Posisi di ruang sebagai ..."
                                        info="Posisi di ruang sebagai ..."
                                        className="selectJabatanRuang"
                                        // smartSelect
                                        // smartSelectParams={{openIn: 'popup'}}
                                    >
                                        <select className="selectCustom" style={{padding:'8px'}} name="jabatan_ruang_id" defaultValue={this.state.defaultValueJabatanRuangId} onChange={this.setSelectValue}>
                                            <option value={99} disabled>-</option>
                                            <option value={1}>Guru</option>
                                            <option value={2}>Administrator</option>
                                            <option value={3}>Siswa</option>
                                            <option value={4}>Umum</option>
                                        </select>
                                    </ListItem>
                                    <ListInput
                                        type="text"
                                        name="no_absen"
                                        placeholder="Nomor Absensi Kelas...."
                                        label='Nomor Absensi Kelas'
                                        noHairlines
                                        defaultValue={this.state.edited.no_absen}
                                        onInput={(e) => this.setState({edited:{...this.state.edited,no_absen: e.target.value}})}
                                    ></ListInput>
                                </List>
                                <Button className="bawahCiriBiru" raised fill onClick={this.simpanDetailRuang}>
                                    Simpan
                                </Button>
                            </div>
                        </Actions>
                    {/* </Col>
                    <Col width="0" tabletWidth="15"></Col>
                </Row> */}
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getRuang: actions.getRuang,
      getPenggunaRuang: actions.getPenggunaRuang,
      getPertanyaan: actions.getPertanyaan,
      simpanPantauan: actions.simpanPantauan,
      simpanPenggunaRuang: actions.simpanPenggunaRuang,
      getKuisRuang: actions.getKuisRuang,
      getSesiKuis: actions.getSesiKuis,
      getLinimasa: actions.getLinimasa
    }, dispatch);
}

function mapStateToProps({ App, Ruang, Pertanyaan, Kuis, Notifikasi }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang,
        pengguna_ruang: Ruang.pengguna_ruang,
        pertanyaan: Pertanyaan.pertanyaan,
        kuis_ruang: Kuis.kuis_ruang,
        sesi_kuis: Kuis.sesi_kuis,
        linimasa: Notifikasi.linimasa
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilRuang));
  