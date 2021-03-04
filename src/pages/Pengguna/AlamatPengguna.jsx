import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';
import Dropzone from 'react-dropzone';


class AlamatPengguna extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            start: 0,
            limit: 20,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        pengguna: {},
        alamat_pengguna: {
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
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                pengguna: this.props.pengguna.rows[0]
            },()=>{
                this.props.getAlamatPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        alamat_pengguna: result.payload
                    },()=>{
                        this.$f7.dialog.close()
                    })
                }).catch(()=>{
                    this.$f7.dialog.close()
                })
            });
        });
        
    }

    simpanPengguna = () => {
        this.props.setPengguna({...this.state.routeParams, data:this.state.pengguna}).then((result)=> {
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                localStorage.setItem('user', JSON.stringify(result.payload.rows[0]))

                this.$f7router.navigate('/ProfilPengguna')
            })
        })
    }

    tambah = () => {
        this.$f7router.navigate("/FormAlamatPengguna/")
    }

    edit = (alamat_pengguna_id) => {
        this.$f7router.navigate('/FormAlamatPengguna/'+alamat_pengguna_id)
    }

    hapus = (alamat_pengguna_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanAlamatPengguna({alamat_pengguna_id: alamat_pengguna_id, soft_delete:1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getAlamatPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            alamat_pengguna: result.payload
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

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="AlamatPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Alamat Pengguna</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" desktopWidth="10"></Col>
                    <Col width="100" desktopWidth="80">

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
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.alamat_pengguna.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.alamat_pengguna.total > 0 ? this.state.routeParams.start+1 : '0')}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.alamat_pengguna.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.alamat_pengguna.total)} dari {this.formatAngka(this.state.alamat_pengguna.total)} Alamat</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.alamat_pengguna.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.alamat_pengguna.total > 0 &&
                                        <>
                                        {this.state.alamat_pengguna.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }
                                            
                                            return (
                                                <Card key={option.alamat_pengguna_id} style={{marginLeft:'0px', marginRight:'0px', border: (parseInt(option.alamat_utama) === 1 ? "2px solid green" : "none")}}>
                                                    <CardContent>
                                                        <Row>
                                                            <Col width="90" tabletWidth="90" desktopWidth="90">
                                                                <b>{option.nama_penerima}</b>
                                                                <br/>
                                                                {option.alamat_jalan}
                                                                <br/>
                                                                {option.kode_pos}
                                                                <br/>
                                                                {option.kecamatan}, {option.kabupaten}, {option.provinsi}
                                                                <br/>
                                                                {/* {parseInt(option.alamat_utama) === 1 && <b style={{fontSize:'15px', color:'green'}}>Alamat Utama</b>} */}
                                                                {/* {parseInt(option.alamat_utama) !== 1 && <b style={{fontSize:'15px', color:'green'}}>Alamat Utama</b>} */}
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.alamat_pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.alamat_pengguna_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.alamat_pengguna_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.alamat_pengguna_id)} />
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                            <Col width="100" tabletWidth="100" desktopWidth="100" style={{textAlign:'right'}}>
                                                                {parseInt(option.alamat_utama) === 1 && <b style={{fontSize:'15px', color:'green'}}><i className="f7-icons" style={{fontSize:'15px'}}>checkmark_alt_circle</i>&nbsp; Alamat Utama</b>}
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                        </>
                                        }
                                    </Col>
                                </Row>
                                
                            </CardContent>
                        </Card>

                    </Col>
                    <Col width="0" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna,
      generateUUID: actions.generateUUID,
      setPengguna: actions.setPengguna,
      getAlamatPengguna: actions.getAlamatPengguna,
      simpanAlamatPengguna: actions.simpanAlamatPengguna
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Pengguna }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        uuid_kuis: Kuis.uuid_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(AlamatPengguna));
  