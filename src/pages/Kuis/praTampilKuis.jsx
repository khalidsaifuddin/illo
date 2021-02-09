import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import localForage from 'localforage';

import moment from 'moment';
import { Offline, Online } from 'react-detect-offline';

class praTampilKuis extends Component {
    state = {
        error: null,
        loading: false,
        // loading: ( localStorage.getItem('user') ? (localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.$f7route.params['kuis_id']+':'+this.$f7route.params['kode_kuis']) ? false : true ) : true ),
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            kode_sesi: this.$f7route.params['kode_kuis']
        },
        // kuis: ( localStorage.getItem('user') ? (localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.$f7route.params['kuis_id']+':'+this.$f7route.params['kode_kuis']) ? JSON.parse(localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.$f7route.params['kuis_id']+':'+this.$f7route.params['kode_kuis'])) : {rows: [{kuis_id: '',nama: '-'}],total: 0} ) : {rows: [{kuis_id: '',nama: '-'}],total: 0} ),
        kuis: {
            rows: [{
                kuis_id: '',
                nama: '-'
            }],
            total: 0
        },
        displayClass3: 'none',
        displayClass2: 'none',
        displayClass1: 'none',
        boleh_mengerjakan: true,
        n_percobaan: 0,
        lewat_waktu: false,
        loading_kuis: {},
        unduh_kuis: {}
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

        console.log(this.state.loading)

        console.log(window.location.href.split('!')[1]);

        if(parseInt(localStorage.getItem('sudah_login')) !== 1){
            //belum login

            this.$f7router.navigate('/login/ikutiKuis/'+this.$f7route.params['kode_kuis']);

            // this.$f7route.navigate('/login')
            // window.location.href="/#!/login?params="+window.location.href.split('!')[1] ;
            // if(localStorage.getItem('device') === 'android'){
            //     window.location.reload(true);
            // }else{
            // }

        }else{

            localForage.getItem( 'getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.$f7route.params['kuis_id']+':'+this.$f7route.params['kode_kuis'] ).then((value)=>{
                if(value){

                    this.setState({
                        kuis: value
                    },()=>{
                        console.log(this.state.kuis)
                    })

                }
            })

            this.props.getSesiKuis(this.state.routeParams).then((result)=>{
    
                if(result.payload.total < 1){
                    //tidak ada kuis
                    this.$f7.dialog.confirm('Kuis tidak ditemukan! Silakan cek kembali kode kuis yang Anda gunakan dan pastikan tidak ada yang salah!', 'Peringatan', ()=>{
                        this.$f7router.navigate("/gabungKuis/");
                        return false;
                    });
    
                }else{
                    // ada kuis
                    this.setState({
                        loading:false,
                        kuis_id: this.props.sesi_kuis.rows[0].kuis_id, 
                        kuis: this.props.sesi_kuis,
                        routeParams: {
                            ...this.state.routeParams,
                            // sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                            kuis_id: this.props.sesi_kuis.rows[0].kuis_id,
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                        },
                        loading: false
                    },()=>{
                        // this.props.getSesiKuis(this.state.routeParams);
                        localStorage.setItem('sesi_kuis_id',this.props.sesi_kuis.rows[0].sesi_kuis_id);
                        localStorage.setItem('status_mengerjakan',1);
                        
                        this.setState({
                            routeParams: {
                                ...this.state.routeParams,
                                sesi_kuis_id: localStorage.getItem('sesi_kuis_id')
                            }
                        },()=>{
        
                            this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
    
                                // console.log(this.props.pengguna_kuis);
    
                                if(this.props.pengguna_kuis.total > 0){
                                    //sudah pernah mengerjakan
                                    console.log(this.props.sesi_kuis.rows[0].jumlah_percobaan);
                                    console.log(this.props.sesi_kuis.rows[0].status_mengerjakan);
    
                                    if(parseInt(this.props.pengguna_kuis.rows[0].status_mengerjakan_id) !== 2){
                                        //belum selesai, jadi masih boleh mengerjakan lagi
                                        console.log('belum selesai, jadi masih boleh mengerjakan lagi');
                                    }else{
                                        //sudah pernah selesai
                                        console.log('sudah pernah selesai');
                                        if(parseInt(this.props.pengguna_kuis.rows[0].n_percobaan) < parseInt(this.props.sesi_kuis.rows[0].jumlah_percobaan)){
                                            //masih boleh mengerjakan
                                            console.log('masih boleh mengerjakan');
                                        }else{
                                            //sudah tidak boleh mengerjakan
                                            console.log('sudah tidak boleh mengerjakan');
                                            this.setState({
                                                boleh_mengerjakan:false,
                                                n_percobaan: this.props.pengguna_kuis.rows[0].n_percobaan
                                            });
                                        }
                                    }
    
    
                                }else{
                                    //belum pernah mengerjakan
                                    //aman
                                    ///lanjut
                                    console.log('belum pernah mngerjakan. aman. lanjut');
                                }
    
                                //cek batas waktu
                                
                                let sekarang = new Date();
    
                                console.log(moment(this.props.sesi_kuis.rows[0].waktu_selesai));
                                console.log(moment(sekarang));
    
                                if(this.props.sesi_kuis.rows[0].waktu_selesai){
                                    //kalau ada waktu selesai
                                    // if(moment('2020-07-23 18:05:00') > moment(sekarang)){
                                    if(moment(this.props.sesi_kuis.rows[0].waktu_selesai) > moment(sekarang)){
                                        //waktunya masih masuk
                                        console.log('waktunya masih masuk');
                                    }else{
                                        //waktunya sudah lewat
                                        console.log('waktunya sudah lewat');
                                        this.setState({
                                            ...this.state,
                                            lewat_waktu: true
                                        });
                                    }
                                }else{
                                    console.log('tidak berbatas waktu');
                                }
    
    
                                // this.setState({
                                //     ...this.state,
                                //     routeParams:{
                                //         ...this.state.routeParams,
                                //         pengguna_id: null
                                //     }
                                // },()=>{
                    
                                //     this.props.getKuis(this.state.routeParams).then((result)=>{
                                //         this.setState({
                                //             loading:false,
                                //             kuis_id: this.props.kuis.rows[0].kuis_id, 
                                //             kuis: this.props.kuis
                                //         },()=>{
                                            
                                //         });
                                //     });
                    
                                // });
                            });
        
                        });
        
                    });
                }
    
            });
            // this.setState({
            //     routeParams: {
            //         ...this.state.routeParams
            //     }
            // },()=>{
            //     // this.props.getKuis(this.state.routeParams).then((result)=>{
            //     //     this.setState({
            //     //         loading:false
            //     //     });
            //     // });
            // });
            // this.setState({
            //     ...this.state,
            //     routeParams: {
            //         ...this.state.routeParams,
            //         kuis_id: this.state.kuis_id
            //     }
            // },()=>{
            // this.props.getPenggunaKuis(this.state.routeParams).then((result)=>{
            //     this.setState({
            //         ...this.state,
            //         routeParams:{
            //             ...this.state.routeParams,
            //             pengguna_id: null
            //         }
            //     },()=>{
    
            //         this.props.getKuis(this.state.routeParams).then((result)=>{
            //             this.setState({
            //                 loading:false,
            //                 kuis_id: this.props.kuis.rows[0].kuis_id, 
            //                 kuis: this.props.kuis
            //             },()=>{
                            
            //             });
            //         });
    
            //     });
            // });
            // });
        }



    }

    kerjakanKuisOffline = () => {
        this.setState({
            displayClass3: 'block'
        },()=>{
            setTimeout(() => {
                this.setState({
                    displayClass3: 'none',
                    displayClass2: 'block'
                },()=>{
                    setTimeout(() => {
                        this.setState({
                            displayClass2: 'none',
                            displayClass1: 'block'
                        },()=>{

                            setTimeout(() => {
                                
                                this.setState({
                                    ...this.state,
                                    routeParams: {
                                        ...this.state.routeParams,
                                        kuis_id: this.state.kuis_id,
                                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                        sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                    }
                                },()=>{
                        
                                    // this.props.simpanPenggunaKuis(this.state.routeParams).then((result)=>{
                                    //     this.$f7router.navigate('/kerjakanKuis/'+this.state.routeParams.kuis_id);
                                    // });
                        
                                });

                            }, 1000);

                            
                        });
                    }, 1000);
                });
            }, 1000);
        });
    }

    kerjakanKuis = () => {

        this.setState({
            displayClass3: 'block'
        },()=>{
            setTimeout(() => {
                this.setState({
                    displayClass3: 'none',
                    displayClass2: 'block'
                },()=>{
                    setTimeout(() => {
                        this.setState({
                            displayClass2: 'none',
                            displayClass1: 'block'
                        },()=>{

                            setTimeout(() => {
                                
                                this.setState({
                                    ...this.state,
                                    routeParams: {
                                        ...this.state.routeParams,
                                        kuis_id: this.state.kuis_id,
                                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                                        sesi_kuis_id: localStorage.getItem('sesi_kuis_id'),
                                        kode_sesi: null
                                    }
                                },()=>{
                        
                                    this.props.simpanPenggunaKuis(this.state.routeParams).then((result)=>{
                                        this.$f7router.navigate('/kerjakanKuis/'+this.state.routeParams.kuis_id+(this.$f7route.params['kode_kuis'] ? '/'+this.$f7route.params['kode_kuis'] : ''));
                                        // this.$f7router.navigate('/kerjakanKuis/'+this.state.routeParams.kuis_id+(this.$f7route.params['kode_kuis'] ? '/'+this.$f7route.params['kode_kuis'] : '') + '/1');
                                    });
                        
                                });

                            }, 1000);

                            
                        });
                    }, 1000);
                });
            }, 1000);
        });


    }

    unduhKuis = (sesi_kuis_id, kuis_id, kode_sesi) => {
        this.setState({
          ...this.state,
          loading_kuis: {
            ...this.state.loading_kuis,
            [sesi_kuis_id]: true
          },
          unduh_kuis: {
            sesi_kuis_id: sesi_kuis_id,
            kuis_id: kuis_id,
            kode_sesi: kode_sesi
          }
        },()=>{
    
          this.props.getKuis(this.state.unduh_kuis).then((result)=>{
              this.setState({
                ...this.state
              },()=>{
    
                localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.props.kuis).then((valueId)=>{
                  localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.kode_sesi, this.props.kuis).then((valueKode)=>{
                    // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))
                    console.log(valueKode)
                    
                    let daftar_kuis_tersimpan = [];
    
                    localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ).then((result)=>{
                      // console.log(result)
                      if(result){
                        //ada
                        daftar_kuis_tersimpan = [
                          ...result,
                          ...this.props.kuis.rows
                        ]
                      }else{
                        //tidak ada
                        daftar_kuis_tersimpan = [
                          ...this.props.kuis.rows
                        ]
                      }
    
                      localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, daftar_kuis_tersimpan )
                      
                      localStorage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.state.unduh_kuis.sesi_kuis_id)
                    })
                    
                  })
    
                })
    
    
    
              })
          })
    
          setTimeout(() => {
            
            this.setState({
              ...this.state,
              loading_kuis: {
                ...this.state.loading_kuis,
                [sesi_kuis_id]: false
              }
            })
    
          }, 3000);
    
        })
    }

    render()
    {
        return (
            <Page name="praTampilKuis" hideBarsOnScroll className="halamanBeranda">
            {/* <Page name="praTampilKuis" hideBarsOnScroll className="halamanKuis"> */}
                {/* <Navbar sliding={false}> */}
                {/* <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}> */}
                    {/* <NavTitle sliding>Kuis</NavTitle>
                    <NavTitleLarge>
                        Kuis
                    </NavTitleLarge> */}
                {/* </Navbar> */}
                <div className="class3" style={{display:this.state.displayClass3, position:'absolute', zIndex:'999999'}}>
                    <div className="angkanya">3</div>
                </div>
                <div className="class2" style={{display:this.state.displayClass2, position:'absolute', zIndex:'999999'}}>
                    <div className="angkanya">2</div>
                </div>
                <div className="class1" style={{display:this.state.displayClass1, position:'absolute', zIndex:'999999'}}>
                    <div className="angkanya">1</div>
                </div>
                <Row noGap style={{marginTop:'32px'}}>
                <Col width="0" tabletWidth="15" desktopWidth="20"></Col>
                <Col width="100" tabletWidth="70" desktopWidth="60">
                {this.state.loading &&
                <Card className="praTampilKuis skeleton-text skeleton-text-blink" style={{marginTop:'16px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
                    <CardContent>
                        <Row>
                            <Col width="100" className="praTampilKuisNegatif">
                            </Col>
                            <Col width="100">
                                <Card className="praTampilKuisPositif">
                                    <CardContent>
                                        <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                            {'option.judul'}
                                        </h2>
                                        <h4 style={{marginTop:'0px',marginBottom:'0px'}}>
                                            {'option.keterangan'}
                                        </h4>
                                        <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                        <span>{'option.jenjang'} {'option.tingkat_pendidikan'}</span><br/>
                                        <span>{'option.mata_pelajaran'}</span><br/>
                                        
                                        <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                        {'option.waktu_mulai'  &&
                                        <>
                                        Waktu Mulai: <b>{'waktu_mulai'}</b><br/>
                                        </>
                                        }
                                        {!'option.waktu_selesai'  &&
                                        <>
                                        Waktu Mulai: <b>Tidak berbatas waktu</b><br/>
                                        </>
                                        }
                                        Waktu Selesai: 
                                        {'option.waktu_selesai'  &&
                                        <span>&nbsp;<b>{'waktu_selesai'}</b><br/></span>
                                        }
                                        {!'option.waktu_selesai'  &&
                                        <span>&nbsp;<b>Tidak berbatas waktu</b><br/></span>
                                        }
                                        <br/>
                                        <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                        <Online>
                                            <Button className="bawahCiriBiru cardBorder-20" raised fill large onClick={this.kerjakanKuis}>
                                                <i className="icons f7-icons">play_fill</i>&nbsp;
                                                Mulai
                                            </Button>
                                        </Online>
                                        <Offline>
                                            <Button className="bawahCiriBiru cardBorder-20 skeleton-text skeleton-text-blink" raised fill large onClick={this.kerjakanKuisOffline}>
                                                <i className="icons f7-icons">play_fill</i>&nbsp;
                                                Mulai secara offline
                                            </Button>
                                        </Offline>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                    </CardContent>
                </Card>
                }
                {!this.state.loading &&
                <>
                {this.state.kuis.rows.map((option)=>{
                    let waktu_mulai = '';
                    let tgl_waktu_mulai = new Date(option.waktu_mulai);
                    waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', pukul ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');
                    
                    let waktu_selesai = '';
                    let tgl_waktu_selesai = new Date(option.waktu_selesai);
                    waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', pukul ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                    return (
                        <Card className="praTampilKuis" style={{backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>
                            {/* <CardHeader style={{height:'200px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}> */}
                            {/* <CardHeader style={{height:'200px'}}>
                                <div className="mantab" style={{
                                    backgroundColor:'rgba(0, 0, 0, 0.6)',
                                    width:'1000%',
                                    marginLeft:'-15px',
                                    marginRight:'-15px',
                                    paddingLeft:'10px',
                                    marginBottom:'-35px',
                                    color:'white',
                                    paddingBottom:'0px',
                                    height:'55px',
                                    paddingTop:'10px',
                                    paddingLeft: '16px'
                                }}>
                                    <Link href={""} style={{color:'white'}}>
                                        <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                            {option.judul}
                                        </h2>
                                    </Link>
                                    <div style={{marginTop:'0px', fontSize:'12px', color: '#cccccc'}}>Oleh <b>{option.pengguna}</b></div><br/>
                                </div>
                            </CardHeader> */}
                            <CardContent>
                                {/* <h4>{option.keterangan}</h4>
                                
                                <div style={{borderBottom:'1px solid #009efd'}}></div>
                                <span>{option.jenjang} {option.tingkat_pendidikan}</span><br/>
                                <span>{option.mata_pelajaran}</span><br/>
                                <br/>
                                
                                <div style={{borderBottom:'1px solid #009efd'}}></div>
                                {option.waktu_mulai  &&
                                <>
                                Waktu Mulai: <b>{waktu_mulai}</b><br/>
                                </>
                                }
                                {!option.waktu_selesai  &&
                                <>
                                Waktu Mulai: <b>Tidak berbatas waktu</b><br/>
                                </>
                                }
                                Waktu Selesai: 
                                {option.waktu_selesai  &&
                                <span>&nbsp;<b>{waktu_selesai}</b><br/></span>
                                }
                                {!option.waktu_selesai  &&
                                <span>&nbsp;<b>Tidak berbatas waktu</b><br/></span>
                                }
                                <br/>
                                
                                <div style={{borderBottom:'1px solid #009efd'}}></div>
                                <br/>
                                <Button raised fill large onClick={this.kerjakanKuis}>
                                    Mulai
                                </Button> */}
                                <Row>
                                    <Col width="100" className="praTampilKuisNegatif">
                                    </Col>
                                    <Col width="100">
                                        <Card className="praTampilKuisPositif">
                                            <CardContent>
                                                <h1 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                    {option.judul}
                                                </h1>
                                                <h4 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                    {option.keterangan}
                                                </h4>
                                                <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                                <span>{option.jenjang} {option.tingkat_pendidikan}</span><br/>
                                                <span>{option.mata_pelajaran}</span><br/>
                                                
                                                <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                                {option.waktu_mulai  &&
                                                <>
                                                Waktu Mulai: <b>{waktu_mulai}</b><br/>
                                                </>
                                                }
                                                {!option.waktu_selesai  &&
                                                <>
                                                Waktu Mulai: <b>Tidak berbatas waktu</b><br/>
                                                </>
                                                }
                                                Waktu Selesai: 
                                                {option.waktu_selesai  &&
                                                <span>&nbsp;<b>{waktu_selesai}</b><br/></span>
                                                }
                                                {!option.waktu_selesai  &&
                                                <span>&nbsp;<b>Tidak berbatas waktu</b><br/></span>
                                                }
                                                <br/>
                                                <div style={{borderBottom:'1px solid #fff8e1'}}></div>
                                                {/* {!this.state.boleh_mengerjakan &&
                                                <Card style={{margin:'0px', marginBottom:'8px'}}>
                                                    <CardContent>
                                                        Anda telah selesai mengerjakan kuis ini
                                                        <br/>
                                                        <Link href="/" style={{fontWeight:'bold'}}>Kembali ke Beranda</Link>
                                                    </CardContent>
                                                </Card>
                                                } */}

                                                {this.state.loading_kuis[option.sesi_kuis_id] &&
                                                <Progressbar infinite></Progressbar>
                                                }
                                                {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                                                    <>
                                                    {!localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                                    <Button className="cardBorder-20" style={{marginTop:'8px', border:'1px solid #cccccc'}} onClick={()=>this.unduhKuis(option.sesi_kuis_id, option.kuis_id, option.kode_sesi)}>
                                                        <i className="icons f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>heart</i>&nbsp;
                                                        <span style={{color:'#434343'}}>Simpan Kuis</span>
                                                    </Button>
                                                    }
                                                    {localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                                    <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                                        <i className="icons f7-icons" style={{fontSize:'20px', color:'#F44336'}}>heart_fill</i>&nbsp;
                                                        <span>Kuis Tersimpan</span>
                                                    </Button>
                                                    }
                                                    </>
                                                }
                                                
                                                <br/>

                                                {this.state.lewat_waktu &&
                                                <Card style={{margin:'0px', marginBottom:'8px', background:'#d50000', color:'white'}}>
                                                    <CardContent>
                                                        Anda telah melewati batas waktu mengerjakan kuis ini
                                                        <br/>
                                                        <Link href="/" style={{color:'white', fontWeight:'bold'}}>Kembali ke Beranda</Link>
                                                    </CardContent>
                                                </Card>
                                                }
                                                <Online>
                                                    <Button disabled={this.state.boleh_mengerjakan ? (this.state.lewat_waktu ? true: false) : true} className="bawahCiriBiru cardBorder-20" raised fill large onClick={this.kerjakanKuis}>
                                                        <i className="icons f7-icons">play_fill</i>&nbsp;
                                                        {!this.state.boleh_mengerjakan ? "Anda telah selesai mengerjakan kuis ini" : "Mulai"}
                                                    </Button>
                                                </Online>
                                                <Offline>
                                                    <Button className="bawahCiriBiru cardBorder-20" raised fill large onClick={this.kerjakanKuisOffline} disabled={parseInt(this.state.kuis.total) > 0 ? false : true}>
                                                        <i className="icons f7-icons">play_fill</i>&nbsp;
                                                        Kerjakan secara offline
                                                    </Button>
                                                </Offline>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                    )
                })}
                </>
                }
                </Col>
                <Col width="0" tabletWidth="15" desktopWidth="20"></Col>
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
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getSesiKuis: Actions.getSesiKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(praTampilKuis));
  