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

class Mitra extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20
        },
        jenis_mitra: {
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
        this.props.getJenisMitra(this.state.routeParams).then((result)=>{
            this.setState({
                jenis_mitra: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    edit = (jenis_mitra_id) => {
        
    }

    tambahAnggota = (jenis_mitra_id) => {
        this.$f7router.navigate('/AnggotaMitra/'+jenis_mitra_id)
    }

    render()
    {
        return (
            <Page name="Mitra" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Mitra</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row noGap>
                                    {this.state.jenis_mitra.rows.map((option)=>{
                                        return (
                                            <Col width="100" tabletWidth="50">
                                                <Card style={{marginTop:'4px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <div className="boxGambar" style={{backgroundImage: 'url('+localStorage.getItem('api_base')+option.gambar+')', backgroundSize: 'cover', backgroundPosition: 'center'}}>&nbsp;</div>
                                                        <Row>
                                                            <Col width="85">
                                                                <div style={{fontWeight:'bold'}}>
                                                                    {option.nama}
                                                                </div>
                                                                <div style={{marginBottom:'12px', fontSize:'12px'}}>
                                                                    {option.jumlah_anggota} anggota
                                                                </div>
                                                            </Col>
                                                            <Col width="15">
                                                                <Button popoverOpen={".popover-menu-"+option.jenis_mitra_id}><i className="icons f7-icons" style={{fontSize:'18px', display:'inline-flex', textAlign:'right'}}>ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.jenis_mitra_id} style={{minWidth:'150px'}}>
                                                                    <List>
                                                                        {/* <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.jenis_mitra_id)} /> */}
                                                                        <ListItem link="#" popoverClose title="Anggota Mitra" onClick={()=>this.tambahAnggota(option.jenis_mitra_id)} />
                                                                    </List>
                                                                </Popover>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                        )
                                    })}
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
      getJenisMitra: Actions.getJenisMitra,
      generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Mitra));
  