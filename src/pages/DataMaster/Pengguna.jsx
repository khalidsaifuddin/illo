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

class Pengguna extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20
        },
        pengguna: {
            rows: [],
            total: 0
        },
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
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    tambah = () => {
        this.$f7router.navigate("/FormPengguna/")
    }

    edit = (pengguna_id) => {
        this.$f7router.navigate('/FormPengguna/'+pengguna_id)
    }
    
    alamatPengguna = (pengguna_id) => {
        this.$f7router.navigate('/AlamatPengguna/'+pengguna_id)
    }

    hapus = (option) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanPengguna({pengguna_id:option.pengguna_id, data:{soft_delete:1}}).then((result)=>{
                if(result.payload.status === 'berhasil'){
                    
                    this.props.getPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            pengguna: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            
                            this.$f7.dialog.alert("Berhasil menghapus data!", "Berhasil", ()=> {
                                //apa aja
                            })
                        })
                    })

                }else{
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menghapus data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
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
        this.props.getPengguna({...this.state.routeParams, start: 0}).then((result)=>{
            this.setState({
                pengguna: result.payload,
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

            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna: result.payload,
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
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
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
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        })
    }

    jadikanAdmin = (option) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menjadikan pengguna ini sebagai Administrator?', 'Konfirmasi',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanPengguna({pengguna_id:option.pengguna_id, data:{a_admin:1}}).then((result)=>{
                if(result.payload.status === 'berhasil'){
                    
                    this.props.getPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            pengguna: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            
                            this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                                //apa aja
                            })
                        })
                    })

                }else{
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menghapus data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            })
        })
    }
    
    stopAdmin = (option) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghentikan pengguna ini sebagai Administrator?', 'Konfirmasi',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanPengguna({pengguna_id:option.pengguna_id, data:{a_admin:0}}).then((result)=>{
                if(result.payload.status === 'berhasil'){
                    
                    this.props.getPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            pengguna: result.payload
                        },()=>{
                            this.$f7.dialog.close()
                            
                            this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                                //apa aja
                            })
                        })
                    })

                }else{
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menghapus data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            })
        })
    }
    
    render()
    {
        return (
            <Page name="Pengguna" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pengguna</NavTitle>
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Pengguna">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Nama Pengguna"
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
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.pengguna.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.pengguna.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.pengguna.total)} dari {this.formatAngka(this.state.pengguna.total)} Pengguna</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.pengguna.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        <div>
                                        {this.state.pengguna.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            return (
                                                <Card key={option.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>

                                                            <Col width="90" tabletWidth="50" desktopWidth="50" style={{display:'inline-flex'}}>
                                                                <img src={option.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                                <div style={{marginLeft:'16px'}}>
                                                                    
                                                                    <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                                    <div style={{fontSize:'10px'}}>
                                                                        {option.username &&
                                                                        <>
                                                                        {option.username}
                                                                        </>
                                                                        }
                                                                        <div style={{fontSize:'10px'}}>
                                                                            Update Terakhir: {last_update}
                                                                        </div>
                                                                    </div>
                                                                    <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                                                        {option.jenis_mitra}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                <div style={{fontSize:'10px'}}>{parseInt(option.a_admin) === 1 ? <b>Administrator</b> : 'Pengguna Umum'}</div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                <div style={{fontSize:'10px'}}>{option.jenis_mitra}</div>
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.pengguna_id)} />
                                                                        <ListItem link="#" popoverClose title="Alamat Pengguna" onClick={()=>this.alamatPengguna(option.pengguna_id)} />
                                                                        {parseInt(option.a_admin) !== 1 && <ListItem link="#" popoverClose title="Set sebagai Administrator" onClick={()=>this.jadikanAdmin(option)} />}
                                                                        {parseInt(option.a_admin) === 1 && <ListItem link="#" popoverClose title="Stop sebagai Administrator" onClick={()=>this.stopAdmin(option)} />}
                                                                        <ListItem link="#" popoverClose title="Nonaktifkan" onClick={()=>this.hapus(option)} />
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                                // <Card key={option.pengguna_id} className="boxProduk">
                                                //     <CardContent style={{padding:'8px'}}>
                                                //         <div className="gambarProduk" style={{
                                                //             backgroundImage:'url('+localStorage.getItem('api_base')+(option.gambar.length > 0 ? option.gambar : '/assets/berkas/3577232-1.jpg')+')', 
                                                //             backgroundSize:'cover',
                                                //             backgroundPosition:'center'
                                                //         }}>&nbsp;</div>
                                                //         <Row noGap>
                                                //             <Col width="85">
                                                //                 <div className="namaProduk">
                                                //                     {option.nama}
                                                //                 </div>
                                                //             </Col>
                                                //             <Col width="15">
                                                //                 <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons" style={{fontSize:'18px', display:'inline-flex', textAlign:'right'}}>ellipsis_vertical</i></Button>
                                                //                 <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'150px'}}>
                                                //                     <List>
                                                //                         <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.pengguna_id)} />
                                                //                         <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.pengguna_id)} />
                                                //                     </List>
                                                //                 </Popover>
                                                //             </Col>
                                                //         </Row>
                                                //     </CardContent>
                                                // </Card>
                                            )

                                            // return (
                                            //     <Card key={option.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                            //         <CardContent style={{padding:'8px'}}>
                                            //             <Row>
                                            //                 <Col width="15" tabletWidth="15" desktopWidth="10" style={{textAlign:'center'}}>
                                            //                     <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                            //                 </Col>
                                            //                 <Col width="65" tabletWidth="55" desktopWidth="60">
                                            //                     <b>{option.nama}</b>
                                            //                     <div style={{fontSize:'10px'}}>
                                            //                         {option.keterangan &&
                                            //                         <>
                                            //                         {option.keterangan}
                                            //                         </>
                                            //                         }
                                            //                         <div style={{fontSize:'10px'}}>
                                            //                             Update Terakhir: {last_update}
                                            //                         </div>
                                            //                         {option.jumlah_produk &&
                                            //                         <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                            //                         {option.jumlah_produk}
                                            //                         </div>
                                            //                         }
                                            //                     </div>
                                            //                 </Col>
                                            //                 <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                            //                     {option.jumlah_produk &&
                                            //                     <div style={{fontSize:'10px'}}>
                                            //                     {option.jumlah_produk}
                                            //                     </div>
                                            //                     }
                                            //                 </Col>
                                            //                 <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                            //                     <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                            //                     <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'300px'}}>
                                            //                         <List>
                                            //                             <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.pengguna_id)} />
                                            //                             <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.pengguna_id)} />
                                            //                         </List>
                                            //                     </Popover>
                                            //                 </Col>
                                            //             </Row>
                                            //         </CardContent>
                                            //     </Card>
                                            // )
                                        })}
                                        </div>
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
      getPengguna: Actions.getPengguna,
      simpanPengguna: Actions.simpanPengguna,
      generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Pengguna));
  