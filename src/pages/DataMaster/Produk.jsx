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

class Produk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20
        },
        produk: {
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
        this.props.getProduk(this.state.routeParams).then((result)=>{
            this.setState({
                produk: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    tambah = () => {
        this.$f7router.navigate("/FormProduk/")
    }

    edit = (produk_id) => {
        this.$f7router.navigate('/FormProduk/'+produk_id)
    }
    
    batch = (produk_id) => {
        this.$f7router.navigate('/BatchProduk/'+produk_id)
    }

    hapus = (produk_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanProduk({produk_id: produk_id, soft_delete:1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getProduk(this.state.routeParams).then((result)=>{
                        this.setState({
                            produk: result.payload
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
        this.props.getProduk(this.state.routeParams).then((result)=>{
            this.setState({
                produk: result.payload,
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

            this.props.getProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    produk: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }
    
    render()
    {
        return (
            <Page name="Produk" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Produk</NavTitle>
                    {/* <NavRight>
                        <Button raised fill>
                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>
                            Filter
                        </Button>
                    </NavRight> */}
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Produk">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Nama Produk"
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
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.produk.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.produk.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.produk.total)} dari {this.formatAngka(this.state.produk.total)} Produk</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.produk.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        <Row noGap style={{justifyContent:'end'}}>
                                        {/* <div className="kotakProduk"> */}
                                        {this.state.produk.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            return (
                                                <Col width="50" tabletWidth="33" desktopWidth="33">
                                                    <Card key={option.produk_id} className="boxProduk" style={{height:'260px'}}>
                                                        <CardContent style={{padding:'8px'}}>
                                                            <div className="gambarProduk" style={{
                                                                backgroundImage:'url('+localStorage.getItem('api_base')+(option.gambar_produk.length > 0 ? option.gambar_produk[0].nama_file : '/assets/berkas/3577232-1.jpg')+')', 
                                                                backgroundSize:'cover',
                                                                backgroundPosition:'center'
                                                            }}>&nbsp;</div>
                                                            <Row noGap>
                                                                <Col width="85">
                                                                    <div className="namaProduk">
                                                                        {option.nama}
                                                                    </div>
                                                                    <div className="namaProduk" style={{fontSize:'10px', fontWeight:'normal', marginTop:'0px'}}>
                                                                        {option.keterangan ? option.keterangan.replace(/(<([^>]+)>)/gi, "") : ''}
                                                                    </div>
                                                                    <div className="hargaProduk">
                                                                        Rp {(option.harga_produk.length > 0 ? this.formatAngka(option.harga_produk[0].nominal) : '0')}
                                                                    </div>
                                                                    <div className="namaProduk" style={{fontSize:'10px', color:'#b3b3b3'}}>
                                                                        {option.kategori_produk}
                                                                    </div>
                                                                </Col>
                                                                <Col width="15">
                                                                    <Button popoverOpen={".popover-menu-"+option.produk_id}><i className="icons f7-icons" style={{fontSize:'18px', display:'inline-flex', textAlign:'right'}}>ellipsis_vertical</i></Button>
                                                                    <Popover className={"popover-menu-"+option.produk_id} style={{minWidth:'150px'}}>
                                                                        <List>
                                                                            <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.produk_id)} />
                                                                            <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.produk_id)} />
                                                                            <ListItem link="#" popoverClose title="Batch & Stok Pusat" onClick={()=>this.batch(option.produk_id)} />
                                                                        </List>
                                                                    </Popover>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                    </Card>
                                                </Col>
                                            )

                                            // return (
                                            //     <Card key={option.produk_id} style={{marginLeft:'0px', marginRight:'0px'}}>
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
                                            //                     <Button popoverOpen={".popover-menu-"+option.produk_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                            //                     <Popover className={"popover-menu-"+option.produk_id} style={{minWidth:'300px'}}>
                                            //                         <List>
                                            //                             <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.produk_id)} />
                                            //                             <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.produk_id)} />
                                            //                         </List>
                                            //                     </Popover>
                                            //                 </Col>
                                            //             </Row>
                                            //         </CardContent>
                                            //     </Card>
                                            // )
                                        })}
                                        {/* </div> */}
                                        </Row>
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
      getProduk: Actions.getProduk,
      simpanProduk: Actions.simpanProduk,
      generateUUID: Actions.generateUUID,
      getKategoriProduk: Actions.getKategoriProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Produk));
  