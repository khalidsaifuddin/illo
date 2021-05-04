import React, {Component} from 'react';
import {
    Page, 
    Navbar, 
    NavTitle, 
    NavTitleLarge,
    List,
    ListInput,
    ListItem,
    ListItemContent,
    Block,
    Button,
    CardHeader,
    Row,
    Col,
    Card,
    CardContent,
    CardFooter,
    Link,
    NavRight,
    Subnavbar,
    BlockTitle,
    Searchbar,
    Segmented,
    Tabs,
    Tab,
    Chip,
    Icon,
    Popover,
    Progressbar,
    Toggle,
    Radio
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class FormDiskonPengguna extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            diskon_pelanggan_id: this.$f7route.params['diskon_pelanggan_id'],
            diskon_pengguna_id: this.$f7route.params['diskon_pengguna_id'],
            pengguna_acc_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        pengguna: {
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

        // this.props.getPengguna(this.state.routeParams).then((result)=>{

        //     this.setState({
        //         pengguna: result.payload
        //     },()=>{

        if(this.$f7route.params['diskon_pengguna_id'] && this.$f7route.params['diskon_pengguna_id'] !== '-'){
            this.props.getDiskonPengguna(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...this.state.routeParams,
                            ...result.payload.rows[0],
                            waktu_mulai: result.payload.rows[0].waktu_mulai.replace(' ','T'),
                            waktu_selesai: result.payload.rows[0].waktu_selesai.replace(' ','T')
                        }
                    },()=>{
                        console.log(this.state.routeParams)
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        diskon_pengguna_id: result.payload
                    }
                })
            })
        
        }
        //     })
        // })

    }

    setValue = (type) => (e) => {

        console.log(type)

        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanDiskonPengguna(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/DaftarPenggunaDiskon/"+this.state.routeParams.diskon_pelanggan_id)
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    changeToggle = (key) => (e) => {

        console.log(key)
        console.log(e)
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state.routeParams);
        });
    }
    
    generateKodeDiskon = () => {
        // alert('tes')
        this.props.generateKodeDiskon(this.state.routeParams).then((result)=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    kode_diskon: result.payload
                }
            })
        })
    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.routeParams)

            // setTimeout(() => {
            //     this.props.getPengguna(this.state.routeParams).then((result)=>{
            //         this.setState({
            //             pengguna: result.payload
            //         })
            //     })
            // }, 1000);
        })
    }

    ketikEnter = (e) => {
        if(e.key === 'Enter'){

            this.setState({
                loading: true
            },()=>{
                this.props.getPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        pengguna: result.payload,
                        loading: false
                    })
                })
            })

        }
    }

    pilihPengguna = (option) => {
        // alert(pengguna_id)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: option.pengguna_id,
                nama: option.nama,
                username: option.username
            },
            pengguna: {
                rows: [],
                total: 0
            }
        })
    }

    render()
    {
        return (
            <Page name="FormDiskonPengguna" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['diskon_pengguna_id'] ? "Edit" : "Tambah"} Pengguna Diskon</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                {/* <List>
                                    <ListInput
                                        label="Cari Nama Pengguna (Tekan Enter)"
                                        type="text"
                                        placeholder="Cari Nama Pengguna (Tekan Enter) ..."
                                        clearButton
                                        value={this.state.routeParams.keyword}
                                        onChange={this.cariKeyword}
                                        onBlur
                                    />
                                </List> */}
                                <div class="list no-hairlines-md" style={{marginTop:'16px'}}>
                                    <ul>
                                        <li class="item-content item-input item-input-outline">
                                            <div class="item-inner">
                                                <div class="item-input-wrap">
                                                    <input 
                                                        ref={'ketikCari'}
                                                        value={this.state.routeParams.keyword} 
                                                        onKeyPress={this.ketikEnter} 
                                                        onChange={this.cariKeyword} 
                                                        type="text"
                                                        placeholder="Nama Pengguna ... (Tekan Enter)" 
                                                    />
                                                    <span class="input-clear-button"></span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <BlockTitle>Hasil Pencarian</BlockTitle>
                                {this.state.loading &&
                                <Progressbar style={{height:'2px', marginBottom:'8px'}} infinite />
                                }
                                <div className="hasilCari" style={{width:'100%', borderRadius:'20px', border:'1px dashed #ccc'}}>
                                    {this.state.pengguna.rows.map((option)=>{
                                        return (
                                            <Card>
                                                <CardContent style={{display:'inline-flex'}}>
                                                    <div>
                                                        <Radio name={"radio-pengguna"} value={option.pengguna_id}  onChange={()=>this.pilihPengguna(option)} />
                                                    </div>
                                                    <div style={{marginLeft:'8px'}}>
                                                        <div><b>{option.nama}</b></div>
                                                        <div style={{fontSize:'10px'}}>{option.username}</div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                                <Card style={{marginLeft:'0px', marginRight:'0px', marginBottom:'16px', borderRadius:'10px'}}>
                                    <CardContent>
                                        <div style={{marginLeft:'0px'}}>
                                            <div style={{fontSize:'12px', marginBottom:'8px'}}>Nama Pengguna:</div>
                                            <div><b>{this.state.routeParams.nama}</b></div>
                                            <div style={{fontSize:'10px'}}>{this.state.routeParams.username}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {/* <List>
                                    <ListInput
                                        label="Waktu Mulai"
                                        type="datetime-local"
                                        placeholder="Waktu Mulai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_mulai}
                                        onChange={this.setValue('waktu_mulai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                    <ListInput
                                        label="Waktu Selesai"
                                        type="datetime-local"
                                        placeholder="Waktu Selesai Tampil"
                                        // clearButton
                                        value={this.state.routeParams.waktu_selesai}
                                        onChange={this.setValue('waktu_selesai')}
                                        // style={{maxWidth:'96%'}}
                                    />
                                </List> */}
                                <div style={{borderTop:'1px solid #ccc', marginTop:'16px', marginBottom:'8px'}}>&nbsp;</div>
                                <Button onClick={this.simpan} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    
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
      getUnit: Actions.getUnit,
      getDiskonPengguna: Actions.getDiskonPengguna,
      simpanDiskonPengguna: Actions.simpanDiskonPengguna,
      generateUUID: Actions.generateUUID,
      generateKodeDiskon: Actions.generateKodeDiskon,
      getPengguna: Actions.getPengguna
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormDiskonPengguna));
  