import React, {Component} from 'react';
import {
    Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class BatchProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            produk_id: this.$f7route.params['produk_id']
        },
        batch: {
            rows: [],
            total: 0
        },
        batch_keluar: {
            rows: [],
            total: 0
        },
        produk_record: {},
        popupFilter: false
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

    componentDidMount = () => {
        this.$f7.dialog.preloader('Memuat data...')
        this.props.getBatch(this.state.routeParams).then((result)=>{
            this.setState({
                batch: result.payload
            },()=>{
                this.props.getProduk(this.state.routeParams).then((result)=>{
                    this.setState({
                        produk_record: result.payload.total > 0 ? result.payload.rows[0] : {}
                    },()=>{
                        this.$f7.dialog.close()

                        //batch keluar
                        this.props.getBatch({...this.state.routeParams, jenis_batch_id:2}).then((result)=>{
                            this.setState({
                                batch_keluar: result.payload
                            })
                        })
                    })
                })
            })
        })

        this.props.getStokTotal(this.state.routeParams).then((result)=>{
            // console.log(this.props.stok_total)
        })
    }

    tambah = () => {
        this.$f7router.navigate("/FormBatch/"+this.$f7route.params['produk_id'])
    }

    edit = (batch_id) => {
        this.$f7router.navigate('/FormBatch/'+this.$f7route.params['produk_id']+'/'+batch_id)
    }

    hapus = (batch_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanBatch({batch_id: batch_id, soft_delete:1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getBatch(this.state.routeParams).then((result)=>{
                        this.setState({
                            batch: result.payload
                        },()=>{
                            this.props.getStokTotal(this.state.routeParams).then((result)=>{
                                // console.log(this.props.stok_total)
                            })
                        })
                    })

                    this.$f7.dialog.alert("Berhasil menghapus data!", "Berhasil", ()=> {
                        //apa aja
                    })
                }else{
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menghapus data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            })
        })
        
    }

    daftarKodeProduk = (batch_id) => {
        this.$f7router.navigate('/daftarKodeProduk/'+batch_id)
    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    setValue = (type) => (e) => {

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    filter = () => {
        this.setState({popupFilter:!this.state.popupFilter})
    }

    tampilFilter = () => {
        this.$f7.dialog.preloader()
        this.props.getBatch(this.state.routeParams).then((result)=>{
            this.setState({
                batch: result.payload,
                popupFilter: !this.state.popupFilter
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    resetFilter = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: null
            }
        },()=>{

            this.props.getBatch(this.state.routeParams).then((result)=>{
                this.setState({
                    batch: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    klikNext = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{
            
            this.props.getBatch(this.state.routeParams).then((result)=>{
                this.setState({
                    batch: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })
    }
    
    klikPrev = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            }
        },()=>{
            
            this.props.getBatch(this.state.routeParams).then((result)=>{
                this.setState({
                    batch: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })
    }

    unduh = (batch_id) => {

        //simpan log
        this.props.simpanLogCetakTracking({
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
            batch_id: batch_id
        }).then((result)=>{
            // window.open('http://illobackend:8888/api/Produk/UnduhKodeTracking?batch_id='+batch_id+'&limit=1000000&output=excel')
            window.open('http://117.53.47.43:8085/api/Produk/UnduhKodeTracking?batch_id='+batch_id+'&limit=1000000&output=excel')
        })

    }
    
    render()
    {
        return (
            <Page name="BatchProduk" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Batch dan Stok Produk</NavTitle>
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Batch">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Nama Batch"
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    onChange={this.cariKeyword}
                                ></Searchbar>
                            </List>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button raised onClick={this.resetFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                        Reset Filter
                                    </Button>
                                </Col>
                                <Col width="50">
                                    <Button raised fill onClick={this.tampilFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Data
                                    </Button>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                <Row>
                                    <Col width="100">
                                        <Card>
                                            <CardContent style={{padding:'8px'}}>
                                                Nama Produk: <b style={{fontSize:'15px'}}>{this.state.produk_record.nama}</b>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100">
                                        <Row style={{marginBottom:'8px'}}>
                                            <Col width="50" tabletWidth="25">
                                                <Card style={{minHeight:'70px', margin:'8px'}}>
                                                    <CardContent style={{fontSize:'10px', padding:'8px'}}>
                                                        <b>Stok Masuk Total</b>
                                                        <div style={{fontSize:'25px'}}>
                                                            {parseInt(this.props.stok_total.stok_masuk) > 0 ? parseInt(this.props.stok_total.stok_masuk) : '0'}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" tabletWidth="25">
                                                <Card style={{minHeight:'70px', margin:'8px'}}>
                                                    <CardContent style={{fontSize:'10px', padding:'8px'}}>
                                                        <b>Stok Ready Total</b>
                                                        <div style={{fontSize:'25px'}}>
                                                            {parseInt(this.props.stok_total.stok_ready) > 0 ? parseInt(this.props.stok_total.stok_ready) : '0'}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" tabletWidth="25">
                                                <Card style={{minHeight:'70px', margin:'8px'}}>
                                                    <CardContent style={{fontSize:'10px', padding:'8px'}}>
                                                        <b>Batch Total</b>
                                                        <div style={{fontSize:'25px'}}>
                                                            {parseInt(this.state.batch.total)}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            <Col width="50" tabletWidth="25">
                                                <Card style={{minHeight:'70px', margin:'8px'}}>
                                                    <CardContent style={{fontSize:'10px', padding:'8px'}}>
                                                        <b>Produk Terjual</b>
                                                        <div style={{fontSize:'25px'}}>
                                                            {parseInt(this.props.stok_total.stok_keluar) > 0 ? parseInt(this.props.stok_total.stok_keluar) : '0'}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                            {/* <Col width="50" tabletWidth="25">
                                                <Card style={{minHeight:'70px', margin:'8px'}}>
                                                    <CardContent style={{fontSize:'10px', padding:'8px'}}>
                                                        <b>Hampir Kadaluarsa</b>
                                                        <div style={{fontSize:'25px'}}>
                                                            0
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Col> */}
                                        </Row>
                                    </Col>
                                    <Col width="100">
                                        <Block strong>
                                            <Segmented raised>
                                                <Button className="color-theme-deepgreen" tabLink="#tab-batch-masuk" tabLinkActive>Batch Masuk</Button>
                                                <Button className="color-theme-deepgreen" tabLink="#tab-batch-keluar">Batch Keluar</Button>
                                            </Segmented>
                                        </Block>
                                        <Tabs animated>
                                            <Tab id="tab-batch-masuk" tabActive style={{paddingTop:'16px'}}>

                                                <Row>
                                                    <Col width="100" tabletWidth="100" style={{textAlign:'right', marginBottom:'8px'}}>
                                                        <Button onClick={this.filter} raised style={{display:'inline-flex' , marginTop:'0px', marginRight:'4px'}}>
                                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>
                                                            Filter
                                                        </Button>
                                                        <Button raised fill style={{display:'inline-flex' , marginTop:'0px'}} onClick={this.tambah}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                                            Tambah
                                                        </Button>
                                                    </Col>
                                                    <Col width="100" tabletWidth="100">
                                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                                            <div className="data-table-footer" style={{display:'block'}}>
                                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                                    <i className="icon icon-prev color-gray"></i>
                                                                    </a>
                                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.batch.total) ? "disabled" : "" )}>
                                                                        <i className="icon icon-next color-gray"></i>
                                                                    </a>
                                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.batch.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.batch.total)} dari {this.formatAngka(this.state.batch.total)} Batch Masuk</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col width="100" tabletWidth="100">
                                                        {this.state.batch.total < 1 &&
                                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                                            <br/>
                                                            Data belum tersedia<br/>
                                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                                        </div>
                                                        }
                                                        {this.state.batch.rows.map((option)=>{
                                                            let last_update = '';
                                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                                            }

                                                            let tanggal_produksi = '';
                                                            tanggal_produksi = moment(option.tanggal_produksi).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_produksi).format('M')-1)] + ' ' + moment(option.tanggal_produksi).format('YYYY');

                                                            if(moment(option.tanggal_produksi).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_produksi).format('M')-1)] + ' ' + moment(option.tanggal_produksi).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                tanggal_produksi = 'Hari ini';
                                                            }
                                                            
                                                            let tanggal_kadaluarsa = '';
                                                            tanggal_kadaluarsa = moment(option.tanggal_kadaluarsa).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_kadaluarsa).format('M')-1)] + ' ' + moment(option.tanggal_kadaluarsa).format('YYYY');

                                                            if(moment(option.tanggal_kadaluarsa).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_kadaluarsa).format('M')-1)] + ' ' + moment(option.tanggal_kadaluarsa).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                tanggal_kadaluarsa = 'Hari ini';
                                                            }

                                                            return (
                                                                <Card key={option.batch_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <Row>
                                                                            <Col width="60" tabletWidth="50" desktopWidth="50" style={{display:'inline-flex'}}>
                                                                                {/* <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} /> */}
                                                                                <div style={{marginLeft:'16px'}}>
                                                                                    <b>{option.kode_batch} - {option.nama}</b> {option.varian_produk ? <>({option.varian_produk})</> : ''}
                                                                                    <div style={{fontSize:'10px'}}>
                                                                                        {option.keterangan &&
                                                                                        <>
                                                                                        {option.keterangan ? option.keterangan.replace(/(<([^>]+)>)/gi, "") : ''}
                                                                                        {/* &nbsp;&bull;&nbsp; */}
                                                                                        </>
                                                                                        }
                                                                                        <div style={{fontSize:'10px'}}>
                                                                                            Update Terakhir: {last_update}
                                                                                        </div>
                                                                                        {option.stok &&
                                                                                        <div className="hilangDiDesktop" style={{fontSize:'12px'}}>
                                                                                            Jumlah Stok: {option.stok}
                                                                                            
                                                                                        </div>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {/* <div style={{fontSize:'10px'}}>
                                                                                    produksi:
                                                                                </div>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    Kadaluarsa:
                                                                                </div> */}
                                                                            </Col>
                                                                            <Col width="30" tabletWidth="20" style={{fontSize:'10px'}}>
                                                                                Prod: <b>{tanggal_produksi}</b>
                                                                                <br/>
                                                                                Exp: <b>{tanggal_kadaluarsa}</b>
                                                                            </Col>
                                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                                {option.stok &&
                                                                                <div style={{fontSize:'12px'}}>
                                                                                    Jumlah Stok:
                                                                                    <div style={{fontSize:'16px', fontWeight: 'bold'}}>
                                                                                        {option.stok}
                                                                                    </div>
                                                                                </div>
                                                                                }
                                                                            </Col>
                                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                                <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+option.batch_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                                <Popover className={"popover-menu-"+option.batch_id} style={{minWidth:'300px'}}>
                                                                                    <List>
                                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.batch_id)} />
                                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.batch_id)} />
                                                                                        <ListItem link="#" popoverClose title="Daftar Kode Tracking" onClick={()=>this.daftarKodeProduk(option.batch_id)} />
                                                                                        <ListItem link="#" popoverClose title="Unduh Kode Tracking" onClick={()=>this.unduh(option.batch_id)} />
                                                                                    </List>
                                                                                </Popover>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        })}
                                                    </Col>
                                                </Row>
                                            </Tab>
                                            <Tab id="tab-batch-keluar" style={{paddingTop:'16px'}}>
                                                <Row>
                                                    {/* <Col width="100" tabletWidth="100" style={{textAlign:'right', marginBottom:'8px'}}>
                                                        <Button onClick={this.filter} raised style={{display:'inline-flex' , marginTop:'0px', marginRight:'4px'}}>
                                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>
                                                            Filter
                                                        </Button>
                                                        <Button raised fill style={{display:'inline-flex' , marginTop:'0px'}} onClick={this.tambah}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                                            Tambah
                                                        </Button>
                                                    </Col> */}
                                                    <Col width="100" tabletWidth="100">
                                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                                            <div className="data-table-footer" style={{display:'block'}}>
                                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                                    <a onClick={this.klikPrevKeluar} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                                    <i className="icon icon-prev color-gray"></i>
                                                                    </a>
                                                                    <a onClick={this.klikNextKeluar} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.batch_keluar.total) ? "disabled" : "" )}>
                                                                        <i className="icon icon-next color-gray"></i>
                                                                    </a>
                                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.batch_keluar.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.batch_keluar.total)} dari {this.formatAngka(this.state.batch_keluar.total)} Batch Keluar</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col width="100" tabletWidth="100">
                                                        {this.state.batch_keluar.total < 1 &&
                                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                                            <br/>
                                                            Data belum tersedia<br/>
                                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                                        </div>
                                                        }
                                                        {this.state.batch_keluar.rows.map((option)=>{
                                                            let last_update = '';
                                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                                            }

                                                            let tanggal_produksi = '';
                                                            tanggal_produksi = moment(option.tanggal_produksi).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_produksi).format('M')-1)] + ' ' + moment(option.tanggal_produksi).format('YYYY');

                                                            if(moment(option.tanggal_produksi).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_produksi).format('M')-1)] + ' ' + moment(option.tanggal_produksi).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                tanggal_produksi = 'Hari ini';
                                                            }
                                                            
                                                            let tanggal_kadaluarsa = '';
                                                            tanggal_kadaluarsa = moment(option.tanggal_kadaluarsa).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_kadaluarsa).format('M')-1)] + ' ' + moment(option.tanggal_kadaluarsa).format('YYYY');

                                                            if(moment(option.tanggal_kadaluarsa).format('D') + ' ' + this.bulan_singkat[(moment(option.tanggal_kadaluarsa).format('M')-1)] + ' ' + moment(option.tanggal_kadaluarsa).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                                tanggal_kadaluarsa = 'Hari ini';
                                                            }

                                                            return (
                                                                <Card key={option.batch_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <Row>
                                                                            <Col width="100" tabletWidth="80" desktopWidth="80" style={{display:'inline-flex'}}>
                                                                                {/* <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} /> */}
                                                                                <div style={{marginLeft:'16px'}}>
                                                                                    <b>{option.nama}</b>
                                                                                    <div style={{fontSize:'10px'}}>
                                                                                        
                                                                                        <div style={{fontSize:'10px'}}>
                                                                                            Tanggal Transaksi: {last_update}
                                                                                        </div>
                                                                                        {option.stok &&
                                                                                        <div className="hilangDiDesktop" style={{fontSize:'12px'}}>
                                                                                            Jumlah Stok: {option.stok}
                                                                                            
                                                                                        </div>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    &nbsp;
                                                                                </div>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    &nbsp;
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                                {option.stok &&
                                                                                <div style={{fontSize:'12px', marginRight:'32px'}}>
                                                                                    Jumlah Barang:
                                                                                    <div style={{fontSize:'16px', fontWeight: 'bold'}}>
                                                                                        {option.stok}
                                                                                    </div>
                                                                                </div>
                                                                                }
                                                                            </Col>
                                                                            {/* <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}> */}
                                                                                {/* <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+option.batch_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                                <Popover className={"popover-menu-"+option.batch_id} style={{minWidth:'300px'}}>
                                                                                    <List>
                                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.batch_id)} />
                                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.batch_id)} />
                                                                                        <ListItem link="#" popoverClose title="Daftar Kode Tracking" onClick={()=>this.daftarKodeProduk(option.batch_id)} />
                                                                                    </List>
                                                                                </Popover> */}
                                                                            {/* </Col> */}
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        })}
                                                    </Col>
                                                </Row>
                                            </Tab>
                                        </Tabs>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                    
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>

            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getBatch: Actions.getBatch,
      getStokTotal: Actions.getStokTotal,
      simpanBatch: Actions.simpanBatch,
      getProduk: Actions.getProduk,
      generateUUID: Actions.generateUUID,
      simpanLogCetakTracking: Actions.simpanLogCetakTracking
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        stok_total: Produk.stok_total
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(BatchProduk));
  