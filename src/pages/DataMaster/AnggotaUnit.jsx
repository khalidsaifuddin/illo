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

class AnggotaUnit extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            unit_id: this.$f7route.params['unit_id'],
        },
        unit: {
            rows: [{
                nama: '-'
            }],
            total: 0
        },
        anggota_unit: {
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
                this.props.getAnggotaUnit(this.state.routeParams).then((result)=>{
                    this.setState({
                        anggota_unit: result.payload
                    },()=>{
                        this.$f7.dialog.close()
                    })
                })

            })
        })
    }

    tambah = (unit_id) => {
        this.$f7router.navigate("/FormAnggotaUnit/"+unit_id)
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

    hapus = (pengguna_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi Hapus',()=>{
            this.$f7.dialog.preloader('Menyimpan...')

            this.props.simpanAnggotaUnit({
                pengguna_id: pengguna_id, 
                unit_id: this.$f7route.params['unit_id'],
                soft_delete:1
            }).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){

                    this.props.getAnggotaUnit(this.state.routeParams).then((result)=>{
                        this.setState({
                            anggota_unit: result.payload
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
            <Page name="AnggotaUnit" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Anggota Unit</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <BlockTitle style={{marginBottom:'4px', marginTop:'4px', fontWeight:'bold', fontSize:'15px'}}>
                                        Unit {this.state.unit.rows[0].nama}
                                    </BlockTitle>
                                </Row>
                            </CardContent>
                        </Card>
                        <Card>
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
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.unit.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.unit.total)} dari {this.formatAngka(this.state.unit.total)} anggota unit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right'}}>
                                        <Button raised fill style={{display:'inline-flex', marginTop:'-60px'}} onClick={()=>this.tambah(this.$f7route.params['unit_id'])}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                            Tambah
                                        </Button>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.anggota_unit.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.anggota_unit.rows.map((option)=>{
                                            let create_date = '';
                                            create_date = moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ', ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                            if(moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                create_date = 'Hari ini, ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
                                            }

                                            return (
                                                <Card key={option.anggota_unit_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            <Col width="15" tabletWidth="15" desktopWidth="10" style={{textAlign:'center'}}>
                                                                <img src={option.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                            </Col>
                                                            <Col width="65" tabletWidth="55" desktopWidth="60">
                                                                <span className={"hilangDiDesktop"}><b>{option.nama}</b></span>
                                                                <span className={"hilangDiMobile"}><b>{option.nama}</b> ({option.username})</span>
                                                                <div style={{fontSize:'10px'}} className="hilangDiDesktop">
                                                                    {option.username}
                                                                </div>
                                                                <div style={{fontSize:'10px'}}>
                                                                    Bergabung sejak {create_date}
                                                                </div>
                                                            </Col>
                                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                {option.jabatan_unit}
                                                            </Col>
                                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button popoverOpen={".popover-menu-"+option.anggota_unit_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.anggota_unit_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit Jabatan" onClick={()=>this.edit(option.anggota_unit_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.pengguna_id)} />
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
      getAnggotaUnit: Actions.getAnggotaUnit,
      simpanAnggotaUnit: Actions.simpanAnggotaUnit
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(AnggotaUnit));
  