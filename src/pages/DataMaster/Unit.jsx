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

class Unit extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20
        },
        unit: {
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
        this.$f7.dialog.preloader('Memuat data...')
        this.props.getUnit(this.state.routeParams).then((result)=>{
            this.setState({
                unit: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    tambah = () => {
        this.$f7router.navigate("/FormUnit/")
    }

    edit = (unit_id) => {
        this.$f7router.navigate('/FormUnit/'+unit_id)
    }

    tambahSub = (induk_unit_id) => {
        this.$f7router.navigate('/FormUnit/-/'+induk_unit_id)
    }

    anggotaUnit = (unit_id) => {
        this.$f7router.navigate('/AnggotaUnit/'+unit_id)
    }

    hapus = (unit_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanUnit({unit_id: unit_id, soft_delete:1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getUnit(this.state.routeParams).then((result)=>{
                        this.setState({
                            unit: result.payload
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
        return (
            <Page name="Unit" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Unit Dukungan</NavTitle>
                    
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="100">
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.unit.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.unit.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.unit.total)} dari {this.formatAngka(this.state.unit.total)} unit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right'}}>
                                        <Button raised fill style={{display:'inline-flex', marginTop:'-60px'}} onClick={this.tambah}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                            Tambah
                                        </Button>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.unit.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.unit.rows.map((option)=>{
                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }
                                            
                                            return (
                                                <Card key={option.unit_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            {/* <Col width="15" tabletWidth="15" desktopWidth="10" style={{textAlign:'center'}}>
                                                            </Col> */}
                                                            <Col width="65" tabletWidth="55" desktopWidth="60" style={{display:'inline-flex'}}>
                                                                <img src={"./static/icons/illo-logo-icon.png"} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                                <div style={{marginLeft:'16px'}}>
                                                                    <b>{option.nama}</b>
                                                                    <div style={{fontSize:'12px'}}>
                                                                        {option.keterangan &&
                                                                        <>
                                                                        {option.keterangan}&nbsp;&bull;&nbsp;
                                                                        </>
                                                                        }
                                                                        {option.alamat &&
                                                                        <>
                                                                        {option.alamat}
                                                                        </>
                                                                        }
                                                                        {option.induk_unit &&
                                                                        <div className="hilangDiDesktop">
                                                                        Sub Unit <b>{option.induk_unit}</b>
                                                                        </div>
                                                                        }
                                                                        <div style={{fontSize:'10px'}}>
                                                                            {last_update}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right', fontSize:'10px'}} className="hilangDiMobile">
                                                                {option.induk_unit &&
                                                                <div>
                                                                Sub Unit <b>{option.induk_unit}</b>
                                                                </div>
                                                                }
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.unit_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.unit_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.unit_id)} />
                                                                        <ListItem link="#" popoverClose title="Tambah Sub Jenis" onClick={()=>this.tambahSub(option.unit_id)} />
                                                                        <ListItem link="#" popoverClose title="Anggota Unit" onClick={()=>this.anggotaUnit(option.unit_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.unit_id)} />
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
      simpanUnit: Actions.simpanUnit
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Unit));
  