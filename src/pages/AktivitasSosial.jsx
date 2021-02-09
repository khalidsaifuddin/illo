import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Preloader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../store/actions';

import moment from 'moment';
import ReactQuill from 'react-quill';

import io from 'socket.io-client';

class AktivitasSosial extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            pengguna_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).pengguna_id : null,
            konten: null,
            start: 0,
            limit: 5
        },
        pertanyaan_sekolah: {
            total: 0,
            rows: []
        },
        routeParamsJawaban: {},
        komentar: {},
        loadingAktivitas: false,
        loadingPosting: false
    }

    bulan = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Ags',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    modules = {
        toolbar: [
        //   [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
        //   [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
        //   ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    loadAktivitasLagi = () => {
        this.setState({
            loadingAktivitas: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{

            switch (this.props.tipe) {
                case 'sekolah':
                    
                    this.props.getPertanyaanSekolah({...this.state.routeParams, sekolah_id: this.props.sekolah_id}).then((result)=>{
                        this.setState({
                            ...this.state,
                            pertanyaan_sekolah: {
                                ...this.state.pertanyaan_sekolah,
                                rows: [
                                    ...this.state.pertanyaan_sekolah.rows,
                                    ...result.payload.rows
                                ]
                            },
                            loadingAktivitas: false,
                            pertanyaan_sekolah_loaded: result.payload
                            // pertanyaan_sekolah: result.payload
                        },()=>{
            
                            this.state.pertanyaan_sekolah_loaded.rows.map((optionss)=>{
            
                                this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                    this.setState({
                                        ...this.state,
                                        komentar: {
                                            ...this.state.komentar,
                                            [optionss.pertanyaan_id]: resultss.payload
                                        }
                                    },()=>{
                                        console.log(this.state.komentar)
                                    })
                                })  
            
                            })
                        })
                    })
    
                    break;
                
                case 'ruang':
    
                    this.props.getPertanyaanRuang({...this.state.routeParams, ruang_id: this.props.ruang_id}).then((result)=>{
                        this.setState({
                            ...this.state,
                            pertanyaan_sekolah: {
                                ...this.state.pertanyaan_sekolah,
                                rows: [
                                    ...this.state.pertanyaan_sekolah.rows,
                                    ...result.payload.rows
                                ]
                            },
                            loadingAktivitas: false,
                            pertanyaan_sekolah_loaded: result.payload
                        },()=>{
            
                            this.state.pertanyaan_sekolah_loaded.rows.map((optionss)=>{
            
                                this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                    this.setState({
                                        ...this.state,
                                        komentar: {
                                            ...this.state.komentar,
                                            [optionss.pertanyaan_id]: resultss.payload
                                        }
                                    },()=>{
                                        console.log(this.state.komentar)
                                    })
                                })  
            
                            })
                        })
                    })
    
                    break;
                case 'publik':
                    
                    this.props.getPertanyaanPublik({...this.state.routeParams, jenis_pertanyaan_aktivitas_id: 1}).then((result)=>{
                        this.setState({
                            pertanyaan_sekolah_loaded: result.payload,
                            loadingAktivitas: false,
                            pertanyaan_sekolah: {
                                ...this.state.pertanyaan_sekolah,
                                rows: [
                                    ...this.state.pertanyaan_sekolah.rows,
                                    ...result.payload.rows
                                ]
                            }
                        },()=>{
                            this.state.pertanyaan_sekolah_loaded.rows.map((optionss)=>{
            
                                this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                    this.setState({
                                        ...this.state,
                                        komentar: {
                                            ...this.state.komentar,
                                            [optionss.pertanyaan_id]: resultss.payload
                                        }
                                    },()=>{
                                        console.log(this.state.komentar)
                                    })
                                })  
            
                            })
                        })
                    })
    
                    break;
            
                default:
                    break;
            }

        })
    }
    

    componentDidMount = () => {

        let socket = io(localStorage.getItem('socket_url'));

        //what to do after mount
        // console.log(this.props)

        switch (this.props.tipe) {
            case 'sekolah':
                
                this.props.getPertanyaanSekolah({...this.state.routeParams, sekolah_id: this.props.sekolah_id}).then((result)=>{
                    this.setState({
                        ...this.state,
                        pertanyaan_sekolah: result.payload
                    },()=>{
        
                        this.state.pertanyaan_sekolah.rows.map((optionss)=>{
        
                            this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                this.setState({
                                    ...this.state,
                                    komentar: {
                                        ...this.state.komentar,
                                        [optionss.pertanyaan_id]: resultss.payload
                                    }
                                },()=>{
                                    // console.log(this.state.komentar)
                                })
                            })  
        
                        })
                    })
                })

                break;
            
            case 'ruang':

                this.props.getPertanyaanRuang({...this.state.routeParams, ruang_id: this.props.ruang_id}).then((result)=>{
                    this.setState({
                        ...this.state,
                        pertanyaan_sekolah: result.payload
                    },()=>{
        
                        this.state.pertanyaan_sekolah.rows.map((optionss)=>{
        
                            this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                this.setState({
                                    ...this.state,
                                    komentar: {
                                        ...this.state.komentar,
                                        [optionss.pertanyaan_id]: resultss.payload
                                    }
                                },()=>{
                                    console.log(this.state.komentar)
                                })
                            })  
        
                        })
                    })
                })

                break;
            case 'publik':
                
                this.props.getPertanyaanPublik({...this.state.routeParams, jenis_pertanyaan_aktivitas_id: 1}).then((result)=>{
                    this.setState({
                        pertanyaan_sekolah: result.payload
                    },()=>{
                        this.state.pertanyaan_sekolah.rows.map((optionss)=>{
        
                            this.props.getJawaban({pertanyaan_id: optionss.pertanyaan_id}).then((resultss)=>{
                                this.setState({
                                    ...this.state,
                                    komentar: {
                                        ...this.state.komentar,
                                        [optionss.pertanyaan_id]: resultss.payload
                                    }
                                },()=>{
                                    console.log(this.state.komentar)
                                })
                            })  
        
                        })
                    })
                })

                break;
        
            default:
                break;
        }

        

    }

    editorChange = (e) => {
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                konten: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    postingAktivitas = (foo) => {

        let socket = io(localStorage.getItem('socket_url'));
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                sekolah_id: this.props.sekolah_id,
                publikasi: 1,
                jenis_pertanyaan_aktivitas_id: 1
            },
            loadingPosting: true
        },()=>{
            // console.log(this.state.routeParams)
            this.props.simpanPertanyaan(this.state.routeParams).then((result)=>{
                //after simpan

                if(this.props.tipe === 'sekolah' && result.payload.sukses){

                    this.setState({
                        ...this.state,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                            pertanyaan_id: result.payload.pertanyaan_id
                        }
                    },()=>{
                        this.props.simpanPertanyaanSekolah(this.state.routeParams).then((result)=>{
                            this.props.getPertanyaanSekolah({...this.state.routeParams, start: 0}).then((result)=>{
                                this.setState({
                                    ...this.state,
                                    pertanyaan_sekolah: result.payload, 
                                    routeParams: {
                                        ...this.state.routeParams,
                                        konten: null
                                    },
                                    loadingPosting: false
                                },()=>{

                                    //socket.io launching
                                    
                                    // //kirim notifikasi
                                    this.props.simpanNotifikasiSekolah({
                                        ...this.state.routeParams
                                    }).then((result)=>{
                                        
                                        socket.emit('postingAktivitas', JSON.parse(localStorage.getItem('user')), 'sekolah', this.props.sekolah_id, result.payload, (err) => {
                                            if (err) {
                                                //gagal bos
                                            }
                                        })

                                    })
                                    // this.props.simpanNotifikasiKomentar(this.state.routeParams)

                                })
                            })
                        });
                    });

                }else if(this.props.tipe === 'ruang' && result.payload.sukses){
                    this.setState({
                        ...this.state,
                        routeParams: {
                            ...this.state.routeParams,
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                            pertanyaan_id: result.payload.pertanyaan_id,
                            ruang_id: this.props.ruang_id
                        }
                    },()=>{
                        this.props.simpanPertanyaanRuang(this.state.routeParams).then((result)=>{
                            this.props.getPertanyaanRuang({...this.state.routeParams, start: 0}).then((result)=>{
                                this.setState({
                                    ...this.state,
                                    pertanyaan_sekolah: result.payload,
                                    routeParams: {
                                        ...this.state.routeParams,
                                        konten: null
                                    },
                                    loadingPosting: false
                                },()=>{
                                    // //kirim notifikasi
                                    this.props.simpanNotifikasiRuang({
                                        ...this.state.routeParams
                                    }).then((result)=>{
                                        socket.emit('postingAktivitas', JSON.parse(localStorage.getItem('user')), 'ruang', null, result.payload, (err) => {
                                            if (err) {
                                                //gagal bos
                                            }
                                        })
                                    })
                                })
                            })
                        });
                    });
                                    
                }else{
                    this.props.getPertanyaanPublik({...this.state.routeParams, jenis_pertanyaan_aktivitas_id: 1, start: 0}).then((result)=>{
                        this.setState({
                            ...this.state,
                            pertanyaan_sekolah: result.payload,
                            routeParams: {
                                ...this.state.routeParams,
                                konten: null
                            },
                            loadingPosting: false
                        },()=>{
                            // //kirim notifikasi
                            // this.props.simpanNotifikasiKomentar(this.state.routeParams)
                        })
                    })
                }

                // else{
                    
                //     this.$f7router.navigate('/pertanyaanPengguna/'+this.state.routeParams.pengguna_id);

                // }


            });
        })
    }

    komentarChange = (pertanyaan_id) => (e) => {
        // alert(pertanyaan_id)

        this.setState({
            routeParamsJawaban: {
                ...this.state.routeParamsJawaban,
                [pertanyaan_id]: {
                    ...this.state.routeParamsJawaban[pertanyaan_id],
                    konten: e
                }
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    simpanKomentar = (pertanyaan_id) => {
        let socket = io(localStorage.getItem('socket_url'));

        let kontenKomentar = this.state.routeParamsJawaban[pertanyaan_id].konten.replace(/(<([^>]+)>)/gi, "");

        // console.log(kontenKomentar)

        this.setState({
            routeParamsJawaban: {
                ...this.state.routeParamsJawaban,
                [pertanyaan_id]: {
                    ...this.state.routeParamsJawaban[pertanyaan_id],
                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                    pertanyaan_id: pertanyaan_id,
                    publikasi: 1
                }
            }
        },()=>{

            // console.log(this.state.routeParamsJawaban[pertanyaan_id]);
            // return true;

            this.props.simpanJawaban(this.state.routeParamsJawaban[pertanyaan_id]).then((result)=>{
                this.setState({
                    routeParamsJawaban: {
                        [pertanyaan_id]: {  
                            ...this.state.routeParamsJawaban[pertanyaan_id],
                            konten: null
                        }
                    }
                },()=>{
                    this.props.getJawaban({pertanyaan_id: pertanyaan_id}).then((resultss)=>{
                        this.setState({
                            ...this.state,
                            komentar: {
                                ...this.state.komentar,
                                [pertanyaan_id]: resultss.payload
                            }
                        },()=>{
                            // console.log(this.state.komentar)

                            //kirim notifikasi
                            this.props.simpanNotifikasiKomentar({...this.state.routeParams, pertanyaan_id: pertanyaan_id, tekss: kontenKomentar}).then((result)=>{
                                console.log('broadcast notif')

                                socket.emit('postingAktivitas', JSON.parse(localStorage.getItem('user')), 'komentar', null, result.payload, (err) => {
                                    if (err) {
                                        //gagal bos
                                    }
                                })

                            })
                        })
                    })
                })
            });

        });
    }

    hapusPertanyaan = (pertanyaan_id) => {
        this.$f7.dialog.confirm('Apakah Anda ingin menghapus aktivitas ini?', 'Konfirmasi', ()=>{
            this.props.hapusPertanyaan({pertanyaan_id: pertanyaan_id}).then((result)=>{
                
                this.componentDidMount()
                
            });
        })
    }

    hapusKomentar = (jawaban_id, pertanyaan_id) => {
        // alert(jawaban_id)
        this.$f7.dialog.confirm('Apakah Anda ingin menghapus komentar ini?', 'Konfirmasi', ()=>{
            
            this.props.hapusJawaban({jawaban_id: jawaban_id}).then((result)=>{
                
                this.props.getJawaban({pertanyaan_id: pertanyaan_id}).then((resultss)=>{
                    this.setState({
                        ...this.state,
                        komentar: {
                            ...this.state.komentar,
                            [pertanyaan_id]: resultss.payload
                        }
                    },()=>{
                        console.log(this.state.komentar)
                    })
                })
                
            });

        })
    }

    render()
    {
        return (
            <div name="AktivitasSosial">
                <Card>
                    <CardContent style={{padding:'8px', paddingTop:'16px', paddingBottom:'16px'}}>
                        <BlockTitle style={{marginTop:'0px', marginLeft:'0px'}}>Bagikan sesuatu</BlockTitle>
                        <ReactQuill 
                            theme="snow" 
                            onChange={this.editorChange} 
                            modules={this.modules}
                            formats={this.formats}
                            value={this.state.routeParams.konten}
                            on
                        />
                        <Button 
                            raised 
                            fill 
                            className="bawahCiriBiru" 
                            style={{display:'inline-flex', marginTop:'4px'}}
                            onClick={()=>this.postingAktivitas('foo')}
                            disabled={this.state.loadingPosting}
                        >
                            {!this.state.loadingPosting && <><i className="icons f7-icons" style={{fontSize:'20px'}}>paperplane_fill</i>&nbsp;</>}
                            {this.state.loadingPosting && <><Preloader color="white" />&nbsp;</>}
                            Bagikan
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent style={{padding:'8px', paddingTop:'16px', paddingBottom:'16px'}}>
                        {this.state.pertanyaan_sekolah.total < 1 &&
                        <>
                        <div className="aktivitasKosong">
                            <img src="./static/icons/190.jpg" />
                            <br/>
                            Belum ada aktivitas :(
                            <div style={{fontSize:'12px'}}>
                                Kalau Anda mengikuti seseorang, aktivitas mereka akan tampil di sini :)
                            </div>
                        </div>
                        </>
                        }
                        {this.state.pertanyaan_sekolah.total > 0 &&
                        <>
                        <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>
                        {this.state.pertanyaan_sekolah.rows.map((option)=>{

                            let tgl = new Date(option.create_date);
                            let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                            let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
  
                            return (
                                <div className="timeline-item" key={option.pertanyaan_id}>
                                    <Link href={"/aktivitas/"+option.pertanyaan_id} style={{display:'block'}}>
                                        <div className="timeline-item-date hilangDiMobileLevel2" style={{fontSize:'10px', width:'40px'}}>
                                            {tanggal}
                                            <br/>
                                            {waktu}
                                        </div>
                                    </Link>
                                    <div className="timeline-item-divider hilangDiMobileLevel2"></div>
                                    <div className="timeline-item-content card">
                                        {/* <div className="card-header">Card header</div> */}
                                        <div className="card-content card-content-padding" style={{padding:'8px', paddingBottom:'16px'}}>
                                        <Row>
                                            <Col width="100" tabletWidth="100" style={{textAlign:'left', display:'inline-flex'}}>
                                                {/* <Link href={"/tampilPengguna/"+(option.pengguna_id)}> */}
                                                    <img src={option.gambar} style={{width:'5vh', height:'5vh', borderRadius:'50%', marginRight:'8px'}} />
                                                    <div style={{fontWeight:'normal', color:'#434343'}}>
                                                        <Link href={"/tampilPengguna/"+(option.pengguna_id)}><b>{option.nama}</b></Link>{option.nama_ruang && <>&nbsp;di <Link href={"/tampilRuang/"+(option.ruang_id)}><b>{option.nama_ruang}</b></Link></>}{this.props.tipe === 'publik' ? option.nama_sekolah && <>&nbsp;di <Link href={"/sekolah/"+(option.sekolah_id)}><b>{option.nama_sekolah}</b></Link></> : <></>}   
                                                        <br/>
                                                        <Link href={"/aktivitas/"+option.pertanyaan_id}>
                                                            <div className="hilangDiDesktopLevel2" style={{fontSize:'10px', color:'#434343'}}>{tanggal}, {waktu}</div>
                                                        </Link>
                                                        <div style={{fontSize:'10px', color:'#434343'}}>
                                                            {option.jabatan_sekolah}
                                                        </div>
                                                    </div>
                                                {/* </Link> */}
                                            </Col>
                                            <Col width="100" tabletWidth="100" className="postingan">
                                                <div style={{marginTop:'8px'}} dangerouslySetInnerHTML={{ __html: option.konten.replace(/noreferrer/g, 'noreferrer" class="link external"').replace('<p class=""><br></p>','') }} />
                                            </Col>
                                            <Col width="100" tabletWidth="100" style={{color:'#aaaaaa', fontSize:'10px', textAlign:'right', marginTop:'4px'}}>
                                                {this.state.komentar[option.pertanyaan_id] ? this.state.komentar[option.pertanyaan_id].result   +" Komentar" : "Belum ada komentar"}
                                                {option.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                <Link onClick={()=>this.hapusPertanyaan(option.pertanyaan_id)}>&nbsp;Hapus</Link>
                                                }
                                            </Col>
                                            <Col width="100" tabletWidth="100">
                                                <Row style={{marginTop:'8px', borderTop:'1px solid #eeeeee'}}>
                                                    <Col width="10" style={{textAlign:'right'}}>
                                                        <img 
                                                            src={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).gambar : null} 
                                                            style={{width:'3vh', height:'3vh', borderRadius:'50%', marginRight:'8px', marginTop:'4px', marginLeft:'4px'}} 
                                                        />
                                                    </Col>
                                                    <Col width="70">
                                                        <ReactQuill 
                                                            className="kolomKomentar"
                                                            theme="snow" 
                                                            placeholder="Komentar Anda..."
                                                            onChange={this.komentarChange(option.pertanyaan_id)} 
                                                            // modules={null}
                                                            // formats={this.formats}
                                                            value={this.state.routeParamsJawaban[option.pertanyaan_id] ? this.state.routeParamsJawaban[option.pertanyaan_id].konten : null}
                                                            on
                                                        />
                                                    </Col>
                                                    <Col width="20">
                                                        <Button 
                                                            style={{
                                                                display:'inline-flex', 
                                                                marginBottom:'4ox', 
                                                                marginTop:'4px', 
                                                                padding:'0px', 
                                                                paddingRight:'8px', 
                                                                paddingLeft:'8px'
                                                            }}
                                                            onClick={()=>this.simpanKomentar(option.pertanyaan_id)}
                                                        >
                                                            <i className="icons f7-icons" style={{fontSize:'15px', marginRight:'4px'}}>paperplane_fill</i>
                                                            Kirim
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="100">
                                                {this.state.komentar[option.pertanyaan_id] &&
                                                <>
                                                    {this.state.komentar[option.pertanyaan_id].rows.map((optionKomentar)=>{ 
                                                        if(optionKomentar.konten !== null){
                                                            
                                                            let tgl = new Date(optionKomentar.create_date);
                                                            let tanggal = moment(optionKomentar.create_date).format('D') + ' ' + this.bulan[(moment(optionKomentar.create_date).format('M')-1)] + ' ' + moment(optionKomentar.create_date).format('YYYY');
                                                            let waktu = moment(optionKomentar.create_date).format('H') + ':' + moment(optionKomentar.create_date).format('mm');
                                
                                                            return (
                                                                <Row style={{marginTop:'8px', borderTop:'1px solid #eeeeee'}} key={optionKomentar.jawaban_id}>
                                                                    <Col width="10" style={{textAlign:'right'}}>
                                                                        <img 
                                                                            src={optionKomentar.gambar_pengguna} 
                                                                            style={{width:'3vh', height:'3vh', borderRadius:'50%', marginRight:'8px', marginTop:'4px', marginLeft:'4px'}} 
                                                                        />
                                                                    </Col>
                                                                    <Col width="90">
                                                                        <Row noGap>
                                                                            <Col width="60">
                                                                                <Link href={"/tampilPengguna/"+(optionKomentar.pengguna_id)}>
                                                                                    <div style={{fontWeight:'bold', fontSize:'11px', marginTop:'4px', marginBottom:'-8px'}}>{optionKomentar.pengguna}</div>
                                                                                </Link>
                                                                            </Col>
                                                                            <Col width="40" style={{fontSize:'10px', textAlign:'right', marginTop:'4px', color:'#aaaaaa'}}>
                                                                                {tanggal}, {waktu}
                                                                                <br/>
                                                                                {optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                                                <Link onClick={()=>this.hapusKomentar(optionKomentar.jawaban_id, optionKomentar.pertanyaan_id)}>Hapus</Link>
                                                                                }
                                                                            </Col>
                                                                            <Col width="100" style={{fontSize:'11px', marginTop:(optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '-4px' : '8px')}}>
                                                                                <div style={{marginTop:(optionKomentar.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '-4px' : '0px')}} dangerouslySetInnerHTML={{ __html: optionKomentar.konten.replace('<p class=""><br></p>','').replace(/noreferrer/g, 'noreferrer" class="link external"') }} />
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                                // <>
                                                                //     <div style={{marginTop:'8px'}} dangerouslySetInnerHTML={{ __html: optionKomentar.konten }} />
                                                                // </>
                                                            )

                                                        }
                                                    })}
                                                </>
                                                }
                                            </Col>
                                        </Row>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        </div>

                        <Button raised large onClick={this.loadAktivitasLagi} disabled={this.state.loadingAktivitas}>
                            {!this.state.loadingAktivitas && <><i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_down_to_line_alt</i>&nbsp;</>}    
                            {this.state.loadingAktivitas && <><Preloader color="blue" />&nbsp;</>}
                            Tampilkan Aktivitas lebih lama
                        </Button>
                        </>
                        }
                    </CardContent>
                </Card>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      simpanPertanyaan: actions.simpanPertanyaan,
      simpanPertanyaanSekolah: actions.simpanPertanyaanSekolah,
      getPertanyaanSekolah: actions.getPertanyaanSekolah,
      getPertanyaanRuang: actions.getPertanyaanRuang,
      simpanJawaban: actions.simpanJawaban,
      hapusJawaban: actions.hapusJawaban,
      hapusPertanyaan: actions.hapusPertanyaan,
      getJawaban: actions.getJawaban,
      simpanPertanyaanRuang: actions.simpanPertanyaanRuang,
      getPertanyaanPublik: actions.getPertanyaanPublik,
      simpanNotifikasiKomentar: actions.simpanNotifikasiKomentar,
      simpanNotifikasiRuang: actions.simpanNotifikasiRuang,
      simpanNotifikasiSekolah: actions.simpanNotifikasiSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(AktivitasSosial));
  