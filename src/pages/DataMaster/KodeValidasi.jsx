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

class KodeValidasi extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            produk_id: (this.$f7route.params['produk_id'] && this.$f7route.params['produk_id'] !== '-') ? this.$f7route.params['produk_id'] : null,
        },
        batch_kode_validasi: {
            rows: [],
            total: 0
        },
        log_cetak: {
            rows: [],
            total: 0
        },
        popupFilter: false,
        popupLog: false
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
        this.$f7.dialog.preloader()
        this.props.getBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            this.setState({
                batch_kode_validasi: result.payload
            })
        })
    }

    tambah = () => {
        this.$f7router.navigate('/FormKodeValidasiProduk/'+this.state.routeParams.produk_id)
    }

    hapus = (batch_kode_validasi_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus batch ini?', 'Konfirmasi', ()=>{
            this.$f7.dialog.preloader()
            this.props.simpanBatchKodeValidasiProduk({
                batch_kode_validasi_id: batch_kode_validasi_id, 
                soft_delete: 1
            }).then((result)=>{
                this.props.getBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
                    this.$f7.dialog.close()
                    this.setState({
                        batch_kode_validasi: result.payload
                    })
                })
            })
        })
    }

    daftarKode = (batch_kode_validasi_id) => {
        this.$f7router.navigate('/daftarKodeValidasiProduk/'+batch_kode_validasi_id)
    }

    cetak = (batch_kode_validasi_id) => {
        this.$f7.dialog.alert('Menu ini masih dalam pengembangan', 'Informasi')
        // this.$f7router.navigate('/daftarKodeValidasiProduk/'+batch_kode_validasi_id)
    }
    
    unduh = (batch_kode_validasi_id) => {

        //simpan log
        this.props.simpanLogCetak({
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
            batch_kode_validasi_id: batch_kode_validasi_id
        }).then((result)=>{
            // window.open('http://illobackend:8888/api/Produk/UnduhKodeValidasi?batch_kode_validasi_id='+batch_kode_validasi_id+'&limit=1000000&output=excel')
            window.open('http://117.53.47.43:8085/api/Produk/UnduhKodeValidasi?batch_kode_validasi_id='+batch_kode_validasi_id+'&limit=1000000&output=excel')
        })

    }

    bukaLogCetak = (batch_kode_validasi_id) => {
        // alert(batch_kode_validasi_id)
        this.$f7.dialog.preloader()

        this.setState({
            batch_kode_validasi_id_aktif: batch_kode_validasi_id
        },()=>{
            this.props.getLogCetak({batch_kode_validasi_id: batch_kode_validasi_id}).then((result)=>{
                this.setState({
                    log_cetak: result.payload,
    
                    popupLog: true
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
            this.props.getBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    batch_kode_validasi: result.payload,
                    loading: false
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
            this.props.getBatchKodeValidasiProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    batch_kode_validasi: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    klikNextLog = () => {
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
            this.props.getLogCetak({batch_kode_validasi_id: this.state.batch_kode_validasi_id_aktif}).then((result)=>{
                this.setState({
                    log_cetak: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    klikPrevLog = () => {
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
            this.props.getLogCetak({batch_kode_validasi_id: this.state.batch_kode_validasi_id_aktif}).then((result)=>{
                this.setState({
                    log_cetak: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    render()
    {
        return (
            <Page name="KodeValidasi" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kode Validasi</NavTitle>
                    
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Batch Kode Validasi">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Keterangan Kode Validasi Produk"
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

                <Popup className="log-popup" opened={this.state.popupLog} onPopupClosed={() => this.setState({popupLog : false})}>
                    <Page>
                        <Navbar title="Log Unduh dan Cetak">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <Row>
                                <Col width="100" tabletWidth="100">
                                    <div className="data-table" style={{overflowY:'hidden'}}>
                                        <div className="data-table-footer" style={{display:'block'}}>
                                            <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                <a onClick={this.klikPrevLog} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                <i className="icon icon-prev color-gray"></i>
                                                </a>
                                                <a onClick={this.klikNextLog} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.log_cetak.total) ? "disabled" : "" )}>
                                                    <i className="icon icon-next color-gray"></i>
                                                </a>
                                                <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.log_cetak.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.log_cetak.total)} dari {this.formatAngka(this.state.log_cetak.total)} baris log</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col width="100" tabletWidth="100">
                                    <div className="data-table" style={{overflowY:'hidden'}}>
                                        <table>
                                            <thead style={{background:'#eeeeee'}}>
                                                <tr>
                                                    <th className="label-cell" style={{minWidth:'40px'}}>&nbsp;</th>
                                                    <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'15px'}}>Tanggal Unduh</th>
                                                    <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'15px'}}>Pengguna</th>
                                                </tr>
                                                
                                            </thead>
                                            <tbody>
                                                {/* isi tabelnya */}
                                                {this.state.log_cetak.rows.map((option)=>{
                                                    return(
                                                        <tr key={option.log_unduh_kode_validasi_id}>
                                                            <td className="label-cell">
                                                                {/* <Button popoverOpen={".popover-menu-"+option.pendaftar_id}>
                                                                    <i className="f7-icons" style={{fontSize:'20px'}}>ellipsis_vertical</i>
                                                                </Button>
                                                                <Popover className={"popover-menu-"+option.pendaftar_id}>
                                                                    <List>
                                                                        <ListItem link popoverClose onClick={()=>this.buktiPembayaran(option)} title="Bukti Pembayaran" />
                                                                        <ListItem link popoverClose onClick={()=>this.verifikasi(option)} title="Verifikasi" />
                                                                        <ListItem link popoverClose onClick={()=>this.formulir(option)} title="Formulir" />
                                                                        <ListItem link popoverClose onClick={()=>this.cetakFormulir(option)} title="Cetak Formulir" />
                                                                        <ListItem link popoverClose onClick={()=>this.openWa(option)} title="Teks Pesan Whatsapp" />
                                                                    </List>
                                                                </Popover> */}
                                                            </td>
                                                            <td className="label-cell">
                                                                {moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY')},&nbsp;
                                                                {moment(option.create_date).format('HH') + ':' + moment(option.create_date).format('mm')}
                                                            </td>
                                                            <td className="label-cell">
                                                                {option.pengguna}
                                                                <div style={{fontSize:'10px', marginTop:'-2px'}}>{option.username}</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="data-table-footer" style={{display:'block', height:'75px'}}>
                                            <div className="data-table-pagination">
                                                &nbsp;
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                
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
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.batch_kode_validasi.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.batch_kode_validasi.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.batch_kode_validasi.total)} dari {this.formatAngka(this.state.batch_kode_validasi.total)} batch kode validasi</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.batch_kode_validasi.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.batch_kode_validasi.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            return (
                                                <Card key={option.batch_kode_validasi_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            {/* <Col width="15" tabletWidth="15" desktopWidth="10" style={{textAlign:'center'}}>
                                                                <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                            </Col> */}
                                                            <Col width="90" tabletWidth="50" desktopWidth="50" style={{display:'inline-flex'}}>
                                                                <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                                <div style={{marginLeft:'16px'}}>
                                                                    <b>{option.nama}</b>
                                                                    <div style={{fontSize:'10px'}}>
                                                                        {option.keterangan &&
                                                                        <>
                                                                        {option.keterangan}
                                                                        {/* &nbsp;&bull;&nbsp; */}
                                                                        </>
                                                                        }
                                                                        <div style={{fontSize:'10px'}}>
                                                                            Update Terakhir: {last_update}
                                                                        </div>
                                                                        {option.jumlah &&
                                                                        <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                                                            {option.jumlah} kode validasi
                                                                            <div style={{fontSize:'10px'}}>
                                                                                Unduh Terakhir:&nbsp;
                                                                                <b>
                                                                                    {option.unduh_terakhir && moment(option.unduh_terakhir).format('D') + ' ' + this.bulan_singkat[(moment(option.unduh_terakhir).format('M')-1)] + ' ' + moment(option.unduh_terakhir).format('YYYY') + ', ' + moment(option.unduh_terakhir).format('HH') + ':' + moment(option.unduh_terakhir).format('mm')}
                                                                                    {!option.unduh_terakhir && 'Belum pernah dicetak'}
                                                                                </b>
                                                                                <br/>
                                                                                <Link onClick={()=>this.bukaLogCetak(option.batch_kode_validasi_id)} href="">Log Unduh dan Cetak</Link>
                                                                            </div>
                                                                        </div>
                                                                        }
                                                                        
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="40" desktopWidth="40" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                {option.jumlah &&
                                                                <div style={{fontSize:'10px'}}>
                                                                <b>{option.jumlah}</b> kode validasi
                                                                </div>
                                                                }
                                                                <div style={{fontSize:'10px'}}>
                                                                    Unduh Terakhir:&nbsp;
                                                                    <b>
                                                                        {option.unduh_terakhir && moment(option.unduh_terakhir).format('D') + ' ' + this.bulan_singkat[(moment(option.unduh_terakhir).format('M')-1)] + ' ' + moment(option.unduh_terakhir).format('YYYY') + ', ' + moment(option.unduh_terakhir).format('HH') + ':' + moment(option.unduh_terakhir).format('mm')}
                                                                        {!option.unduh_terakhir && 'Belum pernah dicetak'}
                                                                    </b>
                                                                    <br/>
                                                                    <Link onClick={()=>this.bukaLogCetak(option.batch_kode_validasi_id)} href="">Log Unduh dan Cetak</Link>
                                                                </div>
                                                                {/* <div style={{fontSize:'10px'}}>
                                                                    <div>
                                                                        Unduh Daftar Terakhir:<br/>1 April 2021, 13:54 (diunduh 0 kali)
                                                                    </div>
                                                                    <div>
                                                                        Unduh Template Terakhir:<br/>1 April 2021, 13:54 (diunduh 0 kali)
                                                                    </div>
                                                                </div> */}
                                                                {/* <br/>
                                                                <Button raised fill>Unduh Template Zebra Designer</Button> */}
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.batch_kode_validasi_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.batch_kode_validasi_id} style={{minWidth:'350px'}}>
                                                                    <List>
                                                                        {/* <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.batch_kode_validasi_id)} /> */}
                                                                        <ListItem link="#" popoverClose title="Daftar Kode Validasi" onClick={()=>this.daftarKode(option.batch_kode_validasi_id)} />
                                                                        <ListItem link="#" popoverClose title="Unduh Daftar Kode Validasi" onClick={()=>this.unduh(option.batch_kode_validasi_id)} />
                                                                        <ListItem link="#" popoverClose title="Unduh Template Zebra Designer" onClick={()=>this.cetak(option.batch_kode_validasi_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.batch_kode_validasi_id)} />
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                            {/* <Col width="100">
                                                                <div>
                                                                    Unduh Daftar Terakhir:
                                                                </div>
                                                                <div>
                                                                    Unduh Template Terakhir:
                                                                </div>
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
      getKategoriProduk: Actions.getKategoriProduk,
      simpanKategoriProduk: Actions.simpanKategoriProduk,
      generateUUID: Actions.generateUUID,
      getBatchKodeValidasiProduk: Actions.getBatchKodeValidasiProduk,
      simpanBatchKodeValidasiProduk: Actions.simpanBatchKodeValidasiProduk,
      getLogCetak: Actions.getLogCetak,
      simpanLogCetak: Actions.simpanLogCetak
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(KodeValidasi));
  