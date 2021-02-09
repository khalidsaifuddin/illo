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

class cariPertanyaan extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            // pantauan: 1
        },
        pertanyaan: {
            rows: [],
            total: 0
        },
        pengguna: {
            rows: [],
            total: 0
        },
        kuis: {
            rows: [],
            total: 0
        },
        playlist: {
            rows: [],
            total: 0
        },
        sekolah: {
            rows: [],
            total: 0
        },
        riwayat_kata_kunci: [],
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
        // this.props.getPertanyaanPantauan(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         pertanyaan: this.props.pertanyaan_pantauan
        //     });
        // });
        let arrRiwayat = localStorage.getItem('riwayat_kata_kunci').split(", ");
        let objRiwayat = [];

        for (let indexRiwayat = (arrRiwayat.length-2); indexRiwayat >= 0; indexRiwayat--) {
            const element = arrRiwayat[indexRiwayat];

            objRiwayat[indexRiwayat] = {
                kata_kunci: element
            };
            
        }

        this.setState({
            riwayat_kata_kunci: objRiwayat
        },()=>{
            console.log(this.state.riwayat_kata_kunci);
        });
    }

    cariPertanyaan = () => {
        localStorage.setItem('riwayat_kata_kunci', event.target[0].value + ', ' + localStorage.getItem('riwayat_kata_kunci'));
        // console.log(event.target[0].value);
        let arrRiwayat = localStorage.getItem('riwayat_kata_kunci').split(", ");
        let objRiwayat = [];

        for (let indexRiwayat = (arrRiwayat.length-2); indexRiwayat >= 0; indexRiwayat--) {
            const element = arrRiwayat[indexRiwayat];

            objRiwayat[indexRiwayat] = {
                kata_kunci: element
            };
            
        }

        this.setState({
            riwayat_kata_kunci: objRiwayat
        },()=>{
            console.log(this.state.riwayat_kata_kunci);
        });

        this.setState({
            loading: true,
            loadingPengguna: true,
            loadingKuis: true,
            routeParams: {
                ...this.state.routeParams,
                keyword: event.target[0].value,
                status_privasi: 1,
                sesi: 'umum',
                tampilkan_pertanyaan: 'N',
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{

            // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            //     this.setState({
            //         loading: false,
            //         pertanyaan: this.props.pertanyaan
            //     });
            // });

            this.props.getKuis(this.state.routeParams).then((result)=>{

                this.setState({
                    loading: false,
                    loadingKuis: false,
                    kuis: this.props.kuis
                },()=>{

                    this.props.getPlaylist(this.state.routeParams).then((result)=>{

                        this.setState({
                            loading: false,
                            loadingKuis: false,
                            playlist: result.payload
                        },()=>{

                            this.props.getPengguna(this.state.routeParams).then((result)=>{

                                this.setState({
                                    loading: false,
                                    loadingPengguna: false,
                                    pengguna: this.props.pengguna
                                },()=>{

                                    this.props.getSekolahIndividu2(this.state.routeParams).then((result)=>{

                                        this.setState({
                                            loading: false,
                                            loadingPengguna: false,
                                            sekolah: result.payload
                                        })
                                        
                                    })
                                    
                                })
                                
                            })

                        })

                    })

                })

            })
            
            

        })
    }

    ketikCari = (e) => {
        // console.log(e.currentTarget.value);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    repeatKataKunci = (kata_kunci) => {
        // alert(kata_kunci);
        this.setState({
            loading: true,
            loadingKuis: true,
            loadingPengguna: true,
            routeParams: {
                ...this.state.routeParams,
                keyword: kata_kunci,
                status_privasi: 1,
                sesi: 'umum',
                tampil_pertanyaan: 'N',
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{
            // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            //     this.setState({
            //         loading: false,
            //         pertanyaan: this.props.pertanyaan
            //     });
            // });

            this.props.getKuis(this.state.routeParams).then((result)=>{

                this.setState({
                    loading: false,
                    loadingKuis: false,
                    kuis: this.props.kuis
                },()=>{

                    this.props.getPlaylist(this.state.routeParams).then((result)=>{

                        this.setState({
                            loading: false,
                            loadingKuis: false,
                            playlist: result.payload
                        },()=>{

                            this.props.getPengguna(this.state.routeParams).then((result)=>{
                                
                                this.setState({
                                    loading: false,
                                    loadingPengguna: false,
                                    pengguna: this.props.pengguna
                                },()=>{

                                    this.props.getSekolahIndividu2(this.state.routeParams).then((result)=>{

                                        this.setState({
                                            loading: false,
                                            loadingPengguna: false,
                                            sekolah: result.payload
                                        })
                                        
                                    })
                                })
                                
                            })

                        })

                    })

                })

            })
        })
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

    ikutiPengguna = (pengguna_id) => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 0
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{

                this.props.getPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        loading: false,
                        pengguna: this.props.pengguna
                    })
                });
                // this.setState({
                //     routeParamsCek: {
                //         pengguna_id: this.state.pengguna.pengguna_id,
                //         pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                //         soft_delete: 0
                //     }
                // },()=>{
                //     this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                //         this.setState({
                //             status_mengikuti: result.payload.status,
                //             disabledButtonMengikuti: false
                //         },()=>{
                //             this.props.getPengikut(this.state.routeParams).then((result)=>{
                //                 this.props.pengikut.map((option)=>{
                //                     if(option.label === 'pengikut'){
                //                         this.setState({
                //                             pengikut: option.jumlah
                //                         });
                //                     }
                //                     if(option.label === 'mengikuti'){
                //                         this.setState({
                //                             mengikuti: option.jumlah
                //                         });
                //                     }
                //                 });            
                //             });
                //         });
                //     });
                // });
            });
        });
    }

    stopIkutiPengguna = (pengguna_id) => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 1
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{

                this.props.getPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        loading: false,
                        pengguna: this.props.pengguna
                    })
                });
                
                // this.setState({
                //     routeParamsCek: {
                //         pengguna_id: this.state.pengguna.pengguna_id,
                //         pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                //         soft_delete: 0
                //     }
                // },()=>{
                //     this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                //         this.setState({
                //             status_mengikuti: result.payload.status,
                //             disabledButtonMengikuti: false
                //         },()=>{
                //             this.props.getPengikut(this.state.routeParams).then((result)=>{
                //                 this.props.pengikut.map((option)=>{
                //                     if(option.label === 'pengikut'){
                //                         this.setState({
                //                             pengikut: option.jumlah
                //                         });
                //                     }
                //                     if(option.label === 'mengikuti'){
                //                         this.setState({
                //                             mengikuti: option.jumlah
                //                         });
                //                     }
                //                 });            
                //             });
                //         });
                //     });
                // });
            });
        });
    }

    prosesGabungKuis = (kode_sesi) =>{
        this.$f7router.navigate('/praTampilKuis/'+kode_sesi);
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

    // unduhKuis = (sesi_kuis_id, kuis_id, kode_sesi) => {
    //     this.setState({
    //       ...this.state,
    //       loading_kuis: {
    //         ...this.state.loading_kuis,
    //         [sesi_kuis_id]: true
    //       },
    //       unduh_kuis: {
    //         sesi_kuis_id: sesi_kuis_id,
    //         kuis_id: kuis_id,
    //         kode_sesi: kode_sesi
    //       }
    //     },()=>{
    
    //       this.props.getKuis(this.state.unduh_kuis).then((result)=>{
    //           this.setState({
    //             ...this.state
    //             // loading_kuis: {
    //             //   ...this.state.loading_kuis,
    //             //   [sesi_kuis_id]: false
    //             // }
    //           },()=>{
    //             localStorage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, JSON.stringify(this.props.kuis))
    //             localStorage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.kode_sesi, JSON.stringify(this.props.kuis))
    
    //             let daftar_kuis_tersimpan = [];
    
    //             if(localStorage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id )){
    //               daftar_kuis_tersimpan = [
    //                 ...JSON.parse( localStorage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ) ),
    //                 ...this.props.kuis.rows
    //               ]
    //             }else{
    //               daftar_kuis_tersimpan = [
    //                 ...this.props.kuis.rows
    //               ]
    //             } 
    
    //             localStorage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, JSON.stringify(daftar_kuis_tersimpan) )
    
    //             console.log(localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id))
    //             console.log(localStorage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse(localStorage.getItem('user')).pengguna_id))
    //           })
    //       })
    
    //       setTimeout(() => {
            
    //         this.setState({
    //           ...this.state,
    //           loading_kuis: {
    //             ...this.state.loading_kuis,
    //             [sesi_kuis_id]: false
    //           }
    //         })
    
    //       }, 3000);
    
    //     })
    //   }

    render()
    {
        return (
            <Page name="cariPertanyaan" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pencarian</NavTitle>
                    <Subnavbar inner={false}>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            placeholder="Cari kuis/playlist/pengguna..."
                            searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariPertanyaan}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                            // clickClear={this.clickClear}
                        ></Searchbar>
                    </Subnavbar>
                </Navbar>
                
                {/* <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                    Riwayat Pencarian:<br/>
                    {this.state.riwayat_kata_kunci.map((option)=>{

                        if(this.state.riwayat_kata_kunci.indexOf(option) <= 10){
                            return (
                                <><a onClick={()=>this.repeatKataKunci(option.kata_kunci)}><b><i>{option.kata_kunci}</i></b></a>, </>
                            )
                        }

                    })}
                    <br/>
                    <a onClick={()=>{localStorage.setItem('riwayat_kata_kunci','');this.setState({riwayat_kata_kunci:[]});}}>Bersihkan riwayat pencarian</a>
                </Block> */}
                {/* <Row>
                    <Col width="100" tabletWidth="30">
                    </Col>
                    <Col width="100" tabletWidth="70">
                    </Col>
                </Row> */}
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                    <Block className="riwayatPencarian" style={{marginTop:'0px', marginBottom:'0px'}}>
                        <span>Riwayat Pencarian :</span>
                        <div className="daftarRiwayat">
                            {this.state.riwayat_kata_kunci.map((option, key)=> {
                            if(this.state.riwayat_kata_kunci.indexOf(option) <= 10) {
                                return (
                                <a key={key} onClick={()=>this.repeatKataKunci(option.kata_kunci)}>{option.kata_kunci}</a>
                                )
                            }
                            })}
                        </div>
                        <a className="hapusRiwayat" onClick={()=>{localStorage.setItem('riwayat_kata_kunci','');this.setState({riwayat_kata_kunci:[]});}}>Bersihkan Riwayat</a>
                    </Block>

                    <BlockTitle style={{marginTop:'8px'}}>Hasil Pencarian</BlockTitle>

                        <Block strong style={{marginBottom:'0px'}}>
                            Menampilkan <b>{this.state.pertanyaan.result}</b> hasil pencarian
                        </Block>
                        <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                            <Segmented raised>
                                <Button className="color-theme-deeporange" style={{color:'#434343', fontWeight:'bold'}} tabLink="#tab-6" tabLinkActive>Kuis ({this.state.kuis.total > 0 ? this.state.kuis.total : '0'})</Button>
                                <Button className="color-theme-deeporange" style={{color:'#434343', fontWeight:'bold'}} tabLink="#tab-5" >Playlist ({this.state.playlist.total > 0 ? this.state.playlist.total : '0'})</Button>
                                <Button className="color-theme-deeporange" style={{color:'#434343', fontWeight:'bold'}} tabLink="#tab-4" >Pengguna ({this.state.pengguna.total > 0 ? this.state.pengguna.total : '0'})</Button>
                                <Button className="color-theme-deeporange" style={{color:'#434343', fontWeight:'bold'}} tabLink="#tab-7" >Sekolah ({this.state.sekolah.total > 0 ? this.state.sekolah.total : '0'})</Button>
                            </Segmented>
                        </Block>
                        <Tabs animated>
                            <Tab id="tab-6" tabActive>
                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    {this.state.kuis.total < 1 &&
                                    <>
                                    Kuis tidak ditemukan
                                    </>
                                    }
                                    {this.state.loadingKuis &&
                                    <>
                                    <Card style={{borderBottom:'3px solid #009efd'}} className={"skeleton-text skeleton-effect-blink"}>
                                        <Row>
                                            <Col width="20" style={{
                                                height:'80px', 
                                                // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+"option.gambar_kuis"+'")', 
                                                backgroundSize:'cover',
                                                background: '#cccccc', 
                                                // backgroundPosition:'center', 
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
                                                    <Col width="100" tabletWidth="70">
                                                        <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                            {"option.judul"}
                                                        </h3>
                                                        <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                            dibuat oleh <b>{"option.pengguna"}</b> 
                                                            <br/>Tanggal <b>{"tanggalKuis"}</b>
                                                        </div>
                                                        <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                            {"option.keterangan"}
                                                        </div>
                                                    </Col>
                                                    <Col width="100" tabletWidth="30" style={{padding:'8px'}}>
                                                        <Row>
                                                            <Col width="75">
                                                                <Button raised fill onClick={()=>this.prosesGabungKuis("option.kode_sesi")}>
                                                                    <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                                    Ikuti
                                                                </Button>
                                                            </Col>
                                                            <Col width="100" style={{fontSize:'10px'}}>
                                                                Ikuti sesi umum kuis ini
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card>
                                    </>
                                    }
                                    {!this.state.loadingKuis &&
                                    <>
                                    {this.state.kuis.rows.map((option)=>{
                                        let d1 = moment();
                                        let d2 = moment(option.waktu_mulai);
                                        let d3 = moment(option.waktu_selesai);
                                        // let disabled = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? false : true) : true);
                                        // let disabled_label = (d1.getTime() >= d2.getTime() ? (d1.getTime() <= d3.getTime() ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');
                                        // moment(option.create_date)
                                        let tanggalKuis = '';
                                        let tgl = new Date(option.create_date);
                                
                                        tanggalKuis = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                        let disabled = (d1.isAfter(d2) ? (d1.isBefore(d3) ? false : true) : true);
                                        let disabled_label = (d1.isAfter(d2) ? (d1.isBefore(d3) ? '' : 'Sesi kuis ini telah berakhir') : 'Sesi kuis ini belum dimulai');

                                        return (
                                            <Card style={{borderBottom:'3px solid #009efd'}}>
                                                <Row>
                                                    <Col width="20" style={{
                                                        height:'100%',
                                                        position: 'absolute', 
                                                        width:'20%',
                                                        borderRadius:'20px 0px 0px 20px', 
                                                        // backgroundPosition:'center', 
                                                        background:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'") no-repeat center center / cover', 
                                                        // backgroundRepeat:'no-repeat',
                                                        // backgroundSize:'cover', 
                                                        // backgroundAttachment:'fixed',
                                                        marginTop:'0px', 
                                                        marginBottom:'0px'
                                                        // marginRight: '8px'
                                                    }}>
                                                        &nbsp;
                                                    </Col>
                                                    <Col width="80" style={{paddingLeft:'8px', marginLeft:'20%'}}>
                                                        <Row>
                                                            <Col width="100" tabletWidth="70">
                                                                <h3 style={{marginTop:'4px', marginBottom:'4px', color:'#007AFF'}}>
                                                                    <Link href={"/tampilKuis/"+option.kuis_id}>{option.judul}</Link>
                                                                </h3>
                                                                <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                    dibuat oleh <b>{option.pengguna}</b>
                                                                    <br/>Tanggal <b>{tanggalKuis}</b>
                                                                </div>
                                                                <div style={{marginTop:'4px', marginBottom:'4px', fontSize:'12px'}}>
                                                                    {option.keterangan}
                                                                </div>
                                                            </Col>
                                                            <Col width="100" tabletWidth="30">
                                                                {this.state.loading_kuis[option.sesi_kuis_id] &&
                                                                <Progressbar infinite></Progressbar>
                                                                }
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
                                                            </Col>
                                                            <Col width="85" tabletWidth="20" style={{padding:'8px'}}>
                                                                <Row>
                                                                    <Col width="100">
                                                                        <Button className="bawahCiriBiru cardBorder-20" raised fill onClick={()=>this.prosesGabungKuis(option.kode_sesi)}>
                                                                            {/* <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp; */}
                                                                            Ikuti
                                                                        </Button>
                                                                    </Col>
                                                                    {/* <Col width="25">
                                                                        <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.sesi_kuis_id}>
                                                                            <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                                        </Button>
                                                                    </Col> */}
                                                                    <Col width="100" style={{fontSize:'10px', paddingTop:'16px'}}>
                                                                        Ikuti sesi umum kuis ini
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col width="15" tabletWidth="10" style={{padding:'8px'}}>
                                                                <Link popoverOpen={".popover-menu-kuis-"+option.kuis_id}>
                                                                    <i className="icon f7-icons" style={{fontSize:'30px'}}>ellipsis_vertical</i>&nbsp;
                                                                </Link>
                                                                <Popover className={"popover-menu-kuis-"+option.kuis_id}>
                                                                    <List>
                                                                        {parseInt(option.a_boleh_assign) === 1 &&
                                                                        <ListItem link={'/buatSesiKuis/'+option.kuis_id+"/kuis_orang_lain"} popoverClose title="Buat Sesi Kuis" />
                                                                        }
                                                                        <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat" />
                                                                        <ListItem link={'/statistikKuis/'+option.sesi_kuis_id} popoverClose title="Statistik" />
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                {/* <CardContent>
                                                    {option.judul}
                                                </CardContent> */}
                                                {/* <Popover className={"popover-menu-"+option.sesi_kuis_id}>
                                                    <List>
                                                        <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat Hasil" />
                                                    </List>
                                                </Popover> */}
                                            </Card>
                                        )
                                    })}
                                    </>
                                    }
                                </Block>
                            </Tab>
                            <Tab id="tab-5">
                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    {this.state.playlist.total < 1 &&
                                    <>
                                    Playlist tidak ditemukan
                                    </>
                                    }
                                    {this.state.playlist.total > 0 &&
                                    <>
                                    {this.state.playlist.rows.map((option)=>{
                                        let waktu_buat = '';
                                        waktu_buat = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                        return (
                                            <a href={"/TampilPlaylist/"+option.playlist_id}>
                                                <div style={{borderBottom:'1px solid #eeeeee', marginTop:'16px', paddingBottom:'8px'}}>
                                                    <Row>
                                                        <Col width="80" style={{display:'inline-flex'}}>
                                                            <div style={{height:'45px', width:'45px', background:"#cccccc", borderRadius:'50%', textAlign:'center'}}>
                                                                <i className="icons f7-icons" style={{marginTop:'7px', color:'white'}}>gamecontroller_fill</i>
                                                            </div>
                                                            <div style={{marginLeft:'8px'}}>
                                                                <b style={{fontSize:'16px'}}>{option.nama}</b> {parseInt(option.status_privasi) === 2 ? <i className="icons f7-icons" style={{fontSize:'18px'}}>lock_fill</i>  : <i className="icons f7-icons" style={{fontSize:'18px'}}>globe</i>}
                                                                <div style={{fontSize:'11px', color:'#434343'}}>Oleh <b>{option.pengguna}</b> - Sejak <b>{waktu_buat}</b></div>
                                                                <div style={{fontSize:'11px', color:'green'}}>{parseInt(option.kolaboratif) === 1 ? 'Kolaboratif' : <></>}</div>
                                                            </div>
                                                        </Col>
                                                        <Col width="20" style={{textAlign:'right'}}>
                                                            {option.jumlah_kuis ? option.jumlah_kuis : '0'} Kuis
                                                            {/* <Button>Tambah Kuis</Button> */}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </a>
                                        )
                                    })}
                                    </>
                                    }
                                </Block>
                            </Tab>
                            <Tab id="tab-4" >
                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    {this.state.pengguna.total < 1 &&
                                    <>
                                    Pengguna tidak ditemukan
                                    </>
                                    }
                                    {this.state.loadingPengguna &&
                                    <>
                                    <List mediaList style={{marginTop:'0px'}} className={"skeleton-text skeleton-effect-blink"}>
                                    
                                        <ListItem href={'/tampilPengguna/'+"optionPengguna.pengguna_id"}
                                            title={"optionPengguna.nama"}
                                            subtitle={"Bergabung sejak " + "tanggalPengguna"}>
                                            <div slot="media" style={{background: '#cccccc', width:'44px', height:'44px', borderRadius:'50%'}}>
                                                {/* &nbsp; */}
                                            </div>
                                            {/* <img slot="media" src={"optionPengguna.gambar"} width="44" style={{borderRadius:'50%'}} /> */}
                                            {/* <img slot="media" src={"optionPengguna.gambar"} width="44" style={{borderRadius:'50%'}} /> */}
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id !== "optionPengguna.pengguna_id" && "optionPengguna.validasi_pengikut" === null &&
                                            <Button slot="after" raised fill onClick={()=>this.ikutiPengguna("optionPengguna.pengguna_id")}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                Ikuti
                                            </Button>
                                            }
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id !== "optionPengguna.pengguna_id" && "optionPengguna.validasi_pengikut" !== null &&
                                            <Button style={{background:'#cccccc'}} slot="after" raised fill onClick={()=>this.stopIkutiPengguna("optionPengguna.pengguna_id")}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_badge_plus_fill</i>&nbsp;
                                                <span style={{color:'#434343'}}>Mengikuti</span>
                                            </Button>
                                            }
                                        </ListItem>
                                        
                                    </List>
                                    </>
                                    }
                                    {!this.state.loadingPengguna &&
                                    <>
                                    <List mediaList style={{marginTop:'0px'}}>
                                    {this.state.pengguna.rows.map((optionPengguna)=>{
                                        let tanggalPengguna = '';
                                        let tgl = new Date(optionPengguna.create_date);
                                
                                        tanggalPengguna = moment(optionPengguna.create_date).format('D') + ' ' + this.bulan[(moment(optionPengguna.create_date).format('M')-1)] + ' ' + moment(optionPengguna.create_date).format('YYYY');
                                        
                                        return (
                                                <ListItem href={'/tampilPengguna/'+optionPengguna.pengguna_id}
                                                    title={optionPengguna.nama + " ("+optionPengguna.username+")"}
                                                    subtitle={"Bergabung sejak " + tanggalPengguna}>
                                                    <img slot="media" src={optionPengguna.gambar} width="44" style={{borderRadius:'50%'}} />
                                                    {JSON.parse(localStorage.getItem('user')).pengguna_id !== optionPengguna.pengguna_id && optionPengguna.validasi_pengikut === null &&
                                                    <Button slot="after" raised fill onClick={()=>this.ikutiPengguna(optionPengguna.pengguna_id)}>
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                        Ikuti
                                                    </Button>
                                                    }
                                                    {JSON.parse(localStorage.getItem('user')).pengguna_id !== optionPengguna.pengguna_id && optionPengguna.validasi_pengikut !== null &&
                                                    <Button style={{background:'#cccccc'}} slot="after" raised fill onClick={()=>this.stopIkutiPengguna(optionPengguna.pengguna_id)}>
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_badge_plus_fill</i>&nbsp;
                                                        <span style={{color:'#434343'}}>Mengikuti</span>
                                                    </Button>
                                                    }
                                                </ListItem>
                                        )
                                    })}
                                    </List>
                                    </>
                                    }
                                </Block>
                            </Tab>
                            <Tab id="tab-7" >
                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    {this.state.sekolah.total < 1 &&
                                    <>
                                    Sekolah tidak ditemukan
                                    </>
                                    }
                                    {this.state.sekolah.total >= 1 &&
                                    <>
                                    {this.state.sekolah.rows.map((option)=>{
                                        return (
                                            <Card key={option.sekolah_id}>
                                                <CardContent style={{padding:'8px'}}>
                                                    <Row>
                                                        <Col width="20">
                                                            <div style={{height:'70px', width:'100%', overflow:'hidden', borderRadius:'10px', border:'1px solid #eee'}}>
                                                                {option.gambar_logo &&
                                                                <img src={"https://be.diskuis.id"+option.gambar_logo} style={{width:'100%'}} />
                                                                }
                                                            </div>
                                                        </Col>
                                                        <Col width={'80'}>
                                                            <div style={{marginLeft:'8px', marginRight:'40px'}}>
                                                                <Link href={"/tampilSekolah/"+option.sekolah_id}><b>{option.nama} ({option.npsn})</b></Link>
                                                            </div> 
                                                            <h4 style={{marginLeft:'8px', marginTop:'0px', marginBottom:'0px', fontSize:'12px', color:'#bbbbbb'}}>
                                                                {option.alamat}
                                                            </h4>
                                                        </Col>
                                                    </Row>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                    </>
                                    }
                                </Block>
                            </Tab>
                        </Tabs>
                        {/* <Row>
                            {this.state.pertanyaan.rows.map((option)=>{
                                let tanggal = '';
                                let tgl = new Date(option.create_date);

                                tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                return (
                                    <Col width="100">
                                        <Card>
                                            <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                                                {option.ruang.map((optionRuang)=>{
                                                return (
                                                    <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                                                    <span>&nbsp;/ {optionRuang.nama}</span>
                                                    </Link>
                                                )
                                                })}
                                            </CardHeader>
                                            <CardHeader>
                                                <Link href={"/tampilPertanyaan/"+option.pertanyaan_id}>
                                                    <b style={{fontSize:'23px'}}>
                                                        
                                                        {this.state.routeParams.keyword ? <span dangerouslySetInnerHTML= {{__html:option.judul.replace(new RegExp(this.state.routeParams.keyword, "ig"), "<span style='background-color: #FFFF00'>"+this.state.routeParams.keyword.toUpperCase()+"</span>")}} /> : option.judul}
                                                    </b>
                                                </Link>
                                            </CardHeader>
                                            <CardContent style={{paddingTop:'8px'}}>
                                                
                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
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
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row> */}
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
      getPertanyaan: Actions.getPertanyaan,
      getPertanyaanPantauan: Actions.getPertanyaanPantauan,
      simpanPantauan: Actions.simpanPantauan,
      getPengguna: Actions.getPengguna,
      getKuis: Actions.getKuis,
      simpanPengikut: Actions.simpanPengikut,
      getPlaylist: Actions.getPlaylist,
      getSekolahIndividu2: Actions.getSekolahIndividu2
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan,
        pertanyaan_pantauan: Pertanyaan.pertanyaan_pantauan,
        pengguna: App.pengguna,
        kuis: Kuis.kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(cariPertanyaan));
  