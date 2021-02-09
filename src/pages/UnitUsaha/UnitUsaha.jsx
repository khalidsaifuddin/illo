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


class UnitUsaha extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        sekolah: {
            gambar_logo: '/1.jpg'
        },
        unit_usaha: {
            total: 0,
            rows: []
        }
    }

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
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

    componentDidMount = () => {

        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0]
            })
        })
        
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="UnitUsaha" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Unit Usaha</NavTitle>
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                    <Card>
                            <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'#434343'}}>
                            {/* <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'white'}} className="halamanBeranda"> */}
                                <div style={{
                                    height:'60px', 
                                    width:'60px',
                                    backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                    // backgroundImage:'url('+localStorage.getItem('api_base')+this.state.sekolah.gambar_logo+')',
                                    backgroundSize:'cover',
                                    position:'absolute',
                                    marginTop:'0px',
                                    borderRadius: '20px',
                                    border: '1px solid #ccc'
                                }}>
                                    &nbsp;
                                </div>
                                <h1 className="namaSekolah" style={{marginLeft:'80px'}}>{this.state.sekolah.nama}</h1>
                                <h3 className="keteranganSekolah" style={{marginLeft:'80px', marginBottom:'24px'}}>{this.state.sekolah.keterangan}</h3>
                                
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i class="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.unit_usaha.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.unit_usaha.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.unit_usaha.total)} dari {this.formatAngka(this.state.unit_usaha.total)} unit usaha</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'4px'}}>
                                
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(UnitUsaha));
  