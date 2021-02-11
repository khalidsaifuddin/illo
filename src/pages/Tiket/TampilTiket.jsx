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

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class TampilTiket extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            tiket_id: this.$f7route.params['tiket_id']
        },
        induk_unit: {},
        jenis_tiket: {
            rows: [],
            total: 0
        },
        unit: {
            rows: [],
            total: 0
        },
        prioritas_tiket: {
            rows: [],
            total: 0
        },
        tiket: {
            rows:[],
            total: 0
        },
        pesan_tiket: {
            rows:[],
            total: 0
        },
        status_tiket: {
            rows:[],
            total: 0
        },
        respon: {
            konten: '',
            pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
            tiket_id: this.$f7route.params['tiket_id']
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

    bulan_singkat = [
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    componentDidMount = () => {
        this.props.getUnit(this.state.routeParams).then((result)=>{
            this.setState({
                unit: result.payload
            },()=>{
                
                this.props.getPrioritasTiket(this.state.routeParams).then((result)=>{
                    this.setState({
                        prioritas_tiket: result.payload
                    },()=>{
                        this.props.getTiket(this.state.routeParams).then((result)=>{
                            this.setState({
                                tiket: result.payload,
                                routeParams: {
                                    ...result.payload.rows[0]
                                }
                            },()=>{
                                this.props.getPesanTiket(this.state.routeParams).then((result)=>{
                                    this.setState({
                                        pesan_tiket: result.payload
                                    },()=>{
                                        this.props.getStatusTiket(this.state.routeParams).then((result)=>{
                                            this.setState({
                                                status_tiket: result.payload
                                            })
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

    setValue = (type) => (e) => {

        // console.log(e.currentTarget.value);return true;
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }
        },()=>{

            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanPesanTiket(this.state.respon).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    // this.$f7router.navigate("/DaftarTiket/")
                    this.props.getPesanTiket(this.state.routeParams).then((result)=>{
                        this.setState({
                            pesan_tiket: result.payload,
                            respon: {
                                ...this.state.respon,
                                konten: ''
                            }
                        })
                    })
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    editorChange = (e) => {
        this.setState({
            respon: {
                ...this.state.respon,
                konten: e
            }
        },()=>{
            
        });
    }

    simpanTiket = () => {
        // alert('tes')
        this.$f7.dialog.preloader()
        this.props.simpanTiket({...this.state.routeParams}).then((result)=>{
            this.props.getTiket(this.state.routeParams).then((result)=>{
                this.setState({
                    tiket: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })

    }

    render()
    {
        return (
            <Page name="TampilTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.unit_id ? "Edit" : "Buat"} Tiket</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card style={{borderRadius:'20px 20px 0px 0px'}}>
                            <CardContent>
                                {this.state.tiket.total > 0 &&
                                <>
                                    {this.state.tiket.rows.map((option)=>{
                                        let last_update = '';
                                        let warna_prioritas = 'blue'

                                        last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                        if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                            last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                        }

                                        switch (parseInt(option.prioritas_tiket_id)) {
                                            case 1:
                                                warna_prioritas = 'red'
                                                break;
                                            case 2:
                                                warna_prioritas = 'red'
                                                break;
                                            case 3:
                                                warna_prioritas = 'deeporange'
                                                break;
                                            case 4:
                                                warna_prioritas = 'yellow'
                                                break;
                                            default:
                                                break;
                                        }

                                        return (
                                            <>
                                                <div style={{fontSize:'20px', marginTop:'0px', marginBottom:'8px', marginLeft:'0px', marginRight:'0px', fontWeight:'bold'}}>
                                                    {option.judul}
                                                </div>
                                                <Row>
                                                    <Col width="10" tabletWidth="5">
                                                        <img src={option.gambar_pembuat} style={{height:'36px', width:'36px', borderRadius:'50%', marginRight:'0px', marginBottom:'16px'}} />
                                                    </Col>
                                                    <Col width="90" tabletWidth="95" style={{paddingLeft:'16px'}}>
                                                        {option.pembuat}<br/>
                                                        <span style={{fontSize:'10px'}}>{last_update}</span>
                                                    </Col>
                                                    <Col width="100">
                                                        <Button className={"color-theme-"+warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px'}}>
                                                            <i className='f7-icons' style={{fontSize:'15px'}}>speedometer</i>&nbsp;
                                                            Prioritas {option.prioritas_tiket}
                                                        </Button>
                                                        <Button className={"color-theme-"+(parseInt(option.status_tiket_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginLeft:'4px', marginBottom:'4px'}}>
                                                            <i className='f7-icons' style={{fontSize:'15px'}}>ticket</i>&nbsp;
                                                            {option.status_tiket}
                                                        </Button>
                                                    </Col>
                                                    <Col width="100">
                                                        <div dangerouslySetInnerHTML={{ __html: (option.konten ? option.konten.replace(/noreferrer/g, 'noreferrer" class="link external') : "<p></p>")}} />
                                                    </Col>
                                                </Row>
                                            </>
                                        )
                                    })}
                                </>
                                }
                            </CardContent>
                        </Card>
                        {this.state.tiket.total > 0 &&
                            <>
                            {parseInt(this.state.tiket.rows[0].status_tiket_id) !== 2 &&
                            <Card style={{marginTop:'-10px', borderRadius:'0px 0px 20px 20px'}}>
                                <CardContent style={{padding:'8px'}}>
                                    <BlockTitle style={{marginTop:'8px'}}>Respon Tiket</BlockTitle>
                                    <List noHairlinesBetweenIos style={{marginBottom:'8px'}}>
                                        <ListItem>
                                            <ReactQuill 
                                                theme="snow" 
                                                onChange={this.editorChange} 
                                                modules={this.modules}
                                                formats={this.formats}
                                                value={this.state.respon.konten}
                                                on
                                                style={{width:'100%'}}
                                            />
                                        </ListItem> 
                                    </List>
                                    <Button onClick={this.simpan} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                        <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                        Kirim Respon
                                    </Button>
                                </CardContent>
                            </Card>
                            }
                            {parseInt(this.state.tiket.rows[0].status_tiket_id) === 2 &&
                            <Card style={{marginTop:'-10px', borderRadius:'0px 0px 20px 20px'}}>
                                <CardContent style={{padding:'8px'}}>
                                    <BlockTitle style={{marginTop:'8px'}}>Tiket ini telah ditutup</BlockTitle>
                                </CardContent>
                            </Card>
                            }
                            </>
                        }
                        {this.state.pesan_tiket.total < 1 &&
                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                            <img src="./static/icons/189.png" style={{width:'60%'}} /> 
                            <br/>
                            Belum ada respon dari tiket ini<br/>
                        </div>
                        }
                        {this.state.pesan_tiket.total > 0 &&
                        <>
                        {this.state.pesan_tiket.rows.map((option)=>{
                            let last_update = '';
                            let warna_prioritas = 'blue'

                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                            }

                            switch (parseInt(option.prioritas_tiket_id)) {
                                case 1:
                                    warna_prioritas = 'red'
                                    break;
                                case 2:
                                    warna_prioritas = 'red'
                                    break;
                                case 3:
                                    warna_prioritas = 'deeporange'
                                    break;
                                case 4:
                                    warna_prioritas = 'yellow'
                                    break;
                                default:
                                    break;
                            }

                            return (
                                <Row>
                                    {JSON.parse(localStorage.getItem('user')).pengguna_id !== option.pengguna_id_pengirim &&
                                    <>
                                    <Col width="15" tabletWidth="10" style={{textAlign:'center', marginTop:'12px', paddingLeft:'12px'}}>
                                        <img src={option.gambar_pembuat} style={{height:'50px', width:'50px', borderRadius:'50%', marginRight:'0px', marginBottom:'16px'}} />
                                    </Col>
                                    <Col width="85" tabletWidth="90">
                                        <Card>
                                            <CardContent>
                                                <b>{option.pembuat}</b><br/>
                                                <span style={{fontSize:'10px'}}>{last_update}</span>
                                                <div dangerouslySetInnerHTML={{ __html: (option.konten ? option.konten.replace(/noreferrer/g, 'noreferrer" class="link external') : "<p></p>")}} />
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    </>
                                    }
                                    {JSON.parse(localStorage.getItem('user')).pengguna_id === option.pengguna_id_pengirim &&
                                    <>
                                    <Col width="85" tabletWidth="90">
                                        <Card>
                                            <CardContent>
                                                <div style={{textAlign:'right'}}>
                                                    <b>{option.pembuat}</b><br/>
                                                    <span style={{fontSize:'10px'}}>{last_update}</span>
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: (option.konten ? option.konten.replace(/noreferrer/g, 'noreferrer" class="link external') : "<p></p>")}} />
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="15" tabletWidth="10" style={{textAlign:'center', marginTop:'12px', paddingRight:'12px'}}>
                                        <img src={option.gambar_pembuat} style={{height:'50px', width:'50px', borderRadius:'50%', marginRight:'0px', marginBottom:'16px'}} />
                                    </Col>
                                    </>
                                    }
                                </Row>
                            )
                        })}
                        </>
                        }
                        {this.state.tiket.total > 0 &&
                            <>
                            {parseInt(this.state.tiket.rows[0].status_tiket_id) !== 2 &&
                                <Card style={{marginBottom:'100px'}}>
                                    <CardContent style={{paddingTop:'8px'}}>
                                        <BlockTitle style={{marginTop:'8px'}}>Ubah Status Tiket</BlockTitle> 
                                        <Row>
                                            <Col width="80">
                                                <List>
                                                    <ListInput
                                                        // label="Prioritas"
                                                        type="select"
                                                        value={this.state.routeParams.status_tiket_id}
                                                        placeholder="Status Tiket..."
                                                        onChange={this.setValue('status_tiket_id')}
                                                    >
                                                        <option value={99} disabled selected={(this.state.routeParams.status_tiket_id ? false : true)}>-</option>
                                                        {this.state.status_tiket.rows.map((option)=>{   
                                                            return (
                                                                <option value={option.status_tiket_id}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>  
                                                </List>
                                            </Col>
                                            <Col width="20">
                                                <Button raised fill onClick={this.simpanTiket}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                                    Simpan
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            }
                            </>
                        }
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
      generateUUID: Actions.generateUUID,
      simpanTiket: Actions.simpanTiket,
      getJenisTiket: Actions.getJenisTiket,
      getUnit: Actions.getUnit,
      getPrioritasTiket: Actions.getPrioritasTiket,
      getTiket: Actions.getTiket,
      getPesanTiket: Actions.getPesanTiket,
      simpanPesanTiket: Actions.simpanPesanTiket,
      getStatusTiket: Actions.getStatusTiket
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TampilTiket));
  