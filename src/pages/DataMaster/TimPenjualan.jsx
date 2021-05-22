import React, {Component} from 'react';
import {
    Popover, Searchbar, Radio, Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Toolbar, Tabs, Tab, Segmented, Icon
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class TimPenjualan extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 10
        },
        tim_penjualan: {
            rows: [],
            total: 0
        },
        popupOpen: false
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
        
        clearInterval()

        this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
            this.setState({
                tim_penjualan: result.payload
            })
        })

    }

    setValue = (key) => (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        },()=>{

        })
    }

    tambah = () => {
        // alert('tes')
        this.$f7router.navigate('/FormTimPenjualan/')
    }

    klikNext = () => {

        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            },
            tim_penjualan: {
                ...this.state.tim_penjualan,
                rows: [],
            }
        },()=>{
            this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                this.setState({
                    tim_penjualan: result.payload
                })
            })
        })
    }

    klikPrev = () => {
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            },
            tim_penjualan: {
                ...this.state.tim_penjualan,
                rows: [],
            }
        },()=>{
            this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                this.setState({
                    tim_penjualan: result.payload
                })
            })
        })
    }

    setValue = (key) => (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        },()=>{

        })
    }

    tampilFilter = () => {
        
        this.setState({
            popupOpen: false,
            routeParams: {
                ...this.state.routeParams,
                start: 0
            }
        },()=>{
            
            this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                this.setState({
                    tim_penjualan: result.payload
                })
            })
            
        })

    }

    resetFilter = () => {
        
        this.setState({
            popupOpen: false,
            routeParams: {
                ...this.state.routeParams,
                start: 0,
                keyword: null
            }
        },()=>{

            this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                this.setState({
                    tim_penjualan: result.payload
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

    hapus = (option) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus '+option.nama+' sebagai tim penjualan?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menghapus data...')

            this.props.simpanTimPenjualan({
                tim_penjualan_id: option.tim_penjualan_id, 
                pengguna_id: option.pengguna_id,
                // klien_id: option.klien_id,
                soft_delete: 1
            }).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    // this.$f7.dialog.close()
                    // this.f7.dialog.alert('Berhasil menghapus data!', 'Berhasil', ()=>{
                    this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                        this.setState({
                            tim_penjualan: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            this.$f7.dialog.alert('Berhasil menghapus data!', 'Berhasil')
                        })
                    })
                    // }})
                }else{
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            })
        })

    }

    nonaktifkan = (option, aktif) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin '+(parseInt(aktif) === 0 ? 'menonaktifkan' : 'mengaktifkan')+' '+option.nama+' sebagai tim penjualan?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menyimpan data...')

            this.props.simpanTimPenjualan({
                tim_penjualan_id: option.tim_penjualan_id, 
                pengguna_id: option.pengguna_id,
                // // klien_id: option.klien_id,
                soft_delete: 0,
                aktif: aktif
            }).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    // this.$f7.dialog.close()
                    // this.f7.dialog.alert('Berhasil menghapus data!', 'Berhasil', ()=>{
                    this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                        this.setState({
                            tim_penjualan: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            this.$f7.dialog.alert('Berhasil menyimpan data!', 'Berhasil')
                        })
                    })
                    // }})
                }else{
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            })
        })

    }

    setAdmin = (option, admin) => {

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menjadikan '+option.nama+' sebagai '+(parseInt(admin) === 0 ? 'anggota tim' : 'koordinator')+'?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menyimpan data...')

            this.props.simpanTimPenjualan({
                tim_penjualan_id: option.tim_penjualan_id, 
                pengguna_id: option.pengguna_id,
                // // klien_id: option.klien_id,
                soft_delete: 0,
                aktif: 1,
                admin: admin
            }).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    // this.$f7.dialog.close()
                    // this.f7.dialog.alert('Berhasil menghapus data!', 'Berhasil', ()=>{
                    this.props.getTimPenjualan(this.state.routeParams).then((result)=>{
                        this.setState({
                            tim_penjualan: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            this.$f7.dialog.alert('Berhasil menyimpan data!', 'Berhasil')
                        })
                    })
                    // }})
                }else{
                    //gagal
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            })
        })

    }

    render()
    {
        return (
            <Page name="TimPenjualan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tim Penjualan</NavTitle>
                </Navbar>

                {/* popup starts */}
                <Popup opened={this.state.popupOpen} className="demo-popup-swipe-handler popupLebar" swipeToClose swipeHandler=".swipe-handler" onPopupClosed={()=>this.setState({popupOpen:false})}>
                    <Page>
                        <Navbar className="swipe-handler" title={"Filter Tim Penjualan"}>
                            <NavRight>
                                <Link style={{color:'white'}} popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block strong style={{marginTop:'0px', padding:'0px'}}>

                            <List style={{marginTop:'0px', marginBottom:'0px'}}>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Cari Tim Penjualan..."
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    // onSubmit={this.cariTimHelpdesk}
                                    customSearch={true}
                                    backdrop={false}
                                    onChange={this.ketikCari}
                                    value={this.state.routeParams.keyword}
                                ></Searchbar>
                            </List>
                            <Block style={{marginTop:'0px', padding:'8px'}}>
                                <Row>
                                    <Col width="50">
                                        <Button raised onClick={this.resetFilter}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>return</i>&nbsp;
                                            Reset Filter
                                        </Button>
                                    </Col>
                                    <Col width="50">
                                        <Button raised fill onClick={this.tampilFilter}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>sort_down</i>&nbsp;
                                            Tampilkan data
                                        </Button>
                                    </Col>
                                </Row>
                            </Block>
                        </Block>
                    </Page>
                </Popup>
                {/* popup ends */}

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Row noGap>
                            <Col width="100">

                                <Card noBorder noShadow style={{marginBottom:'16px'}}>
                                    <CardContent>
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div style={{display:'block', textAlign: 'right', marginBottom:'8px'}}>
                                                <Button raised style={{display:'inline-flex', marginRight:'4px'}} onClick={()=>this.setState({popupOpen:true})}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>sort_down</i>&nbsp;
                                                    Filter
                                                </Button>
                                                <Button raised fill style={{display:'inline-flex', marginRight:'1px'}} onClick={this.tambah}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                                    Tambah
                                                </Button>
                                            </div>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+this.state.routeParams.limit) >= parseInt(this.state.tim_penjualan.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    {this.state.tim_penjualan.total > 0 &&
                                                    <span className="data-table-pagination-label">{(this.state.tim_penjualan.total > 0 ? (this.state.routeParams.start+1) : 0)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.tim_penjualan.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.tim_penjualan.total)} dari {this.formatAngka(this.state.tim_penjualan.total)} Tiket</span>
                                                    }
                                                    {this.state.tim_penjualan.total < 1 &&
                                                    <span className="data-table-pagination-label">Tidak ada tim penjualan</span>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{display:'block'}}>
                                                {this.state.tim_penjualan.total < 1 &&
                                                <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                                    <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                                    <br/>
                                                    Data belum tersedia<br/>
                                                    Silakan klik tombol tambah diatas untuk membuat data baru   
                                                </div>
                                                }
                                                {this.state.tim_penjualan.rows.map((option)=>{

                                                    let last_update = '';
                                                    last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                                    if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                        last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                                    }

                                                    let warna_aktif = 'green'

                                                    switch (parseInt(option.aktif)) {
                                                        case 1:
                                                            //yasudah
                                                            break;
                                                        case 0:
                                                            warna_aktif = 'red'
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    return (
                                                        <Card key={option.tim_penjualan_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                            <CardContent style={{padding:'8px'}}>
                                                                <Row>
                                                                    <Col width="90" tabletWidth="60" desktopWidth="70" style={{display:'inline-flex'}}>
                                                                        <div style={{
                                                                            backgroundColor: '#434343',
                                                                            backgroundImage: 'url('+(option.gambar ? option.gambar : 'https://be.diskuis.id/assets/img/boy.jpg')+')',
                                                                            backgroundSize: 'cover',
                                                                            backgroundRepeat: 'no-repeat',
                                                                            backgroundPosition: 'center',
                                                                            minHeight:'45px',
                                                                            minWidth:'45px',
                                                                            maxHeight:'45px',
                                                                            maxWidth:'45px',
                                                                            borderRadius:'50%'
                                                                        }}>&nbsp;</div>
                                                                        <div style={{marginLeft:'16px', width:'100%'}}>
                                                                            
                                                                            <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                                            <div style={{fontSize:'10px'}}>
                                                                                <Row>
                                                                                    <Col width="100" tabletWidth="70">
                                                                                        {option.username &&
                                                                                        <>
                                                                                        {option.username}
                                                                                        </>
                                                                                        }
                                                                                        <div style={{fontSize:'10px'}}>
                                                                                            Update Terakhir: {last_update}
                                                                                        </div>

                                                                                    </Col>
                                                                                    <Col width="100" tabletWidth="30">
                                                                                        
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                            <div className="hilangDiDesktop" style={{fontSize:'10px', borderTop:'1px solid #eee', marginTop:'8px', paddingTop:'4px'}}>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    {parseInt(option.admin) === 1 ? <b><span>Koordinator</span></b> : <span>Anggota Tim</span>}
                                                                                    <br/>
                                                                                    <Button className={"color-theme-"+warna_aktif} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px', paddingLeft:'16px', paddingRight:'16px'}}>
                                                                                        {parseInt(option.aktif) === 1 ? 'Aktif' : 'Non Aktif'}
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col>
                                                                    <Col width="0" tabletWidth="30" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                        {parseInt(option.admin) === 1 ? <b><span>Koordinator</span></b> : <span>Anggota Tim</span>}
                                                                        <br/>
                                                                        <Button className={"color-theme-"+warna_aktif} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px', paddingLeft:'16px', paddingRight:'16px'}}>
                                                                            {parseInt(option.aktif) === 1 ? 'Aktif' : 'Non Aktif'}
                                                                        </Button>
                                                                    </Col>
                                                                    <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                        <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                        <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'300px'}}>
                                                                            <List>
                                                                                <ListItem disabled={parseInt(option.aktif) === 1 ? false : true} link="#" popoverClose title={"Jadikan "+(parseInt(option.admin) === 1 ? 'Anggota Tim' : 'Koordinator')} onClick={()=>this.setAdmin(option, (parseInt(option.admin) === 1 ? '0' : 1))} />
                                                                                <ListItem link="#" popoverClose title={parseInt(option.aktif) === 1 ? "Nonaktifkan" : "Aktifkan"} onClick={()=>this.nonaktifkan(option, (parseInt(option.aktif) === 1 ? '0' : 1))} />
                                                                                <ListItem link="#" popoverClose title={"Hapus"} onClick={()=>this.hapus(option)} />
                                                                            </List>
                                                                        </Popover>
                                                                    </Col>
                                                                </Row>
                                                            </CardContent>
                                                        </Card>
                                                    )

                                                })}
                                            </div>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+this.state.routeParams.limit) >= parseInt(this.state.tim_penjualan.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    {this.state.tim_penjualan.total > 0 &&
                                                    <span className="data-table-pagination-label">{(this.state.tim_penjualan.total > 0 ? (this.state.routeParams.start+1) : 0)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.tim_penjualan.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.tim_penjualan.total)} dari {this.formatAngka(this.state.tim_penjualan.total)} Tiket</span>
                                                    }
                                                    {this.state.tim_penjualan.total < 1 &&
                                                    <span className="data-table-pagination-label">Tidak ada tim penjualan</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                                
                            </Col>
                        </Row>
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
      getTimPenjualan: Actions.getTimPenjualan,
      simpanTimPenjualan: Actions.simpanTimPenjualan
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TimPenjualan));
  