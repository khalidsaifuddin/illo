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

class AnggotaMitra extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            jenis_mitra_id: this.$f7route.params['jenis_mitra_id'] ? this.$f7route.params['jenis_mitra_id'] : null,
            start:0,
            limit:20
        },
        anggota_mitra: {
            rows: [],
            total: 0
        },
        popupFilter: false,
        jenis_mitra: {}
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

        this.props.getJenisMitra(this.state.routeParams).then((result)=>{
            this.setState({
                jenis_mitra: result.payload.rows[0]
            },()=>{

                this.props.getAnggotaMitra(this.state.routeParams).then((result)=>{
                    this.setState({
                        anggota_mitra: result.payload
                    },()=>{
                        this.$f7.dialog.close()
                    })
                })

            })
        })

    }

    tambah = (jenis_mitra_id) => {



        this.$f7router.navigate("/FormAnggotaMitra/"+jenis_mitra_id)
    }

    edit = (jenis_mitra_id, pengguna_id) => {
        this.$f7router.navigate('/FormAnggotaMitra/'+jenis_mitra_id+'/'+pengguna_id)
    }

    hapus = (pengguna_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanAnggotaMitra({pengguna_id: pengguna_id, soft_delete:1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getAnggotaMitra(this.state.routeParams).then((result)=>{
                        this.setState({
                            anggota_mitra: result.payload
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
        this.props.getAnggotaMitra({...this.state.routeParams, start: 0}).then((result)=>{
            this.setState({
                anggota_mitra: result.payload,
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

            this.props.getAnggotaMitra(this.state.routeParams).then((result)=>{
                this.setState({
                    anggota_mitra: result.payload,
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
            this.props.getAnggotaMitra(this.state.routeParams).then((result)=>{
                this.setState({
                    anggota_mitra: result.payload,
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
            this.props.getAnggotaMitra(this.state.routeParams).then((result)=>{
                this.setState({
                    anggota_mitra: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        })
    }

    tambahDownline = (jenis_mitra_id, pengguna_id) => {
        // alert(jenis_mitra_id + ' - ' + pengguna_id)
        this.$f7router.navigate('/FormAnggotaMitrabaru/'+(parseInt(jenis_mitra_id)-1)+'/'+pengguna_id)
    }
    
    daftarDownline = (jenis_mitra_id, pengguna_id) => {
        // alert(jenis_mitra_id + ' - ' + pengguna_id)

    }
    
    render()
    {
        return (
            <Page name="AnggotaMitra" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Anggota {this.state.jenis_mitra.nama}</NavTitle>
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter AnggotaMitra">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    placeholder="Nama Anggota Mitra"
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
                                    <Col width="100" tabletWidth="100">
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.anggota_mitra.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.anggota_mitra.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.anggota_mitra.total)} dari {this.formatAngka(this.state.anggota_mitra.total)} Anggota Mitra</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right'}}>
                                        <Button onClick={this.filter} raised style={{display:'inline-flex', marginTop:'-60px', marginRight:'4px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                        </Button>
                                        {/* <Button raised fill style={{display:'inline-flex', marginTop:'-60px'}} onClick={()=>this.tambah(this.$f7route.params['jenis_mitra_id'])}> */}
                                        {parseInt(this.$f7route.params['jenis_mitra_id']) !== 2 &&
                                        <Button raised fill style={{display:'inline-flex', marginTop:'-60px'}} popoverOpen={".popover-tambah-menu"}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                            Tambah
                                        </Button>
                                        }
                                        {parseInt(this.$f7route.params['jenis_mitra_id']) === 2 &&
                                        <Button raised style={{display:'inline-flex', marginTop:'-60px'}} popoverOpen={".popover-informasi"}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>question_circle</i>
                                        </Button>
                                        }
                                        <Popover className={"popover-tambah-menu"} style={{minWidth:'320px'}}>
                                            <List>
                                                <ListItem onClick={()=>this.$f7router.navigate("/FormAnggotaMitraBaru/"+this.$f7route.params['jenis_mitra_id'])} link="#" popoverClose title="Pengguna Existing" />
                                                <ListItem onClick={()=>this.$f7router.navigate("/FormAnggotaMitra/"+this.$f7route.params['jenis_mitra_id'])} link="#" popoverClose title="Buat Pengguna Baru" />
                                            </List>
                                        </Popover>
                                        <Popover className={"popover-informasi"} style={{minWidth:'320px'}}>
                                            <div style={{margin:'8px'}}>
                                                Semua pengguna yang terdaftar di aplikasi ini adalah privileged customer bila yang bersangkutan belum terdaftar sebagai reseller, agen, atau distributor
                                            </div>
                                        </Popover>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.anggota_mitra.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        <div>
                                        {this.state.anggota_mitra.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            return (
                                                <Card key={option.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>

                                                            <Col width="90" tabletWidth="60" desktopWidth="60" style={{display:'inline-flex'}}>
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
                                                                    <div className="hilangDiDesktop" style={{fontSize:'10px', borderTop:'1px solid #eee', marginTop:'8px', paddingTop:'4px'}}>
                                                                        {/* {option.jenis_mitra} */}
                                                                        <div style={{fontSize:'10px'}}>
                                                                            {option.induk_mitra &&
                                                                                <>
                                                                                Induk {parseInt(option.induk_mitra.jenis_mitra_id) === 5 ? 'Distributor' : 'Agen'} <b>{option.induk_mitra.nama}</b>&nbsp;|&nbsp;
                                                                                </>
                                                                            }
                                                                            <b>{option.jenis_mitra}</b> <b>{parseInt(option.jenis_mitra_id) === 5 ? option.provinsi : (parseInt(option.jenis_mitra_id) === 4 ? option.kabupaten : option.kecamatan)}</b>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="30" desktopWidth="30" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                {/* <div style={{fontSize:'10px'}}>{option.jenis_mitra}</div> */}
                                                                {option.induk_mitra &&
                                                                <div style={{fontSize:'10px'}}>
                                                                    Induk {parseInt(option.induk_mitra.jenis_mitra_id) === 5 ? 'Distributor' : 'Agen'} <b>{option.induk_mitra.nama}</b>
                                                                </div>
                                                                }
                                                                <div style={{fontSize:'10px'}}>
                                                                    {option.jenis_mitra} wilayah {parseInt(option.jenis_mitra_id) === 5 ? option.provinsi : (parseInt(option.jenis_mitra_id) === 4 ? option.kabupaten : option.kecamatan)}
                                                                </div>
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        {parseInt(option.jenis_mitra_id) === 5 &&
                                                                        <ListItem link="#" popoverClose title={"Tambah "+(parseInt(option.jenis_mitra_id) === 5 ? "Agen" : (parseInt(option.jenis_mitra_id) === 4 ? "Reseller" : null))} onClick={()=>this.tambahDownline(option.jenis_mitra_id, option.pengguna_id)} />
                                                                        }
                                                                        {parseInt(option.jenis_mitra_id) === 5 &&
                                                                        <ListItem link="#" popoverClose title={"Daftar "+(parseInt(option.jenis_mitra_id) === 5 ? "Agen" : (parseInt(option.jenis_mitra_id) === 4 ? "Reseller" : null))} onClick={()=>this.daftarDownline(option.jenis_mitra_id, option.pengguna_id)} />
                                                                        }
                                                                        {parseInt(option.jenis_mitra_id) === 4 &&
                                                                        <ListItem link="#" popoverClose title={"Tambah "+(parseInt(option.jenis_mitra_id) === 5 ? "Agen" : (parseInt(option.jenis_mitra_id) === 4 ? "Reseller" : null))} onClick={()=>this.tambahDownline(option.jenis_mitra_id, option.pengguna_id)} />
                                                                        }
                                                                        {parseInt(option.jenis_mitra_id) === 4 &&
                                                                        <ListItem link="#" popoverClose title={"Daftar "+(parseInt(option.jenis_mitra_id) === 5 ? "Agen" : (parseInt(option.jenis_mitra_id) === 4 ? "Reseller" : null))} onClick={()=>this.daftarDownline(option.jenis_mitra_id, option.pengguna_id)} />
                                                                        }
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            )
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
      getAnggotaMitra: Actions.getAnggotaMitra,
      simpanAnggotaMitra: Actions.simpanAnggotaMitra,
      generateUUID: Actions.generateUUID,
      getJenisMitra: Actions.getJenisMitra
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(AnggotaMitra));
  