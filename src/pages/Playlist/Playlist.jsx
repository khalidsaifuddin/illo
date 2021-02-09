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


class Playlist extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        pengguna: {},
        playlist: {
            total: 0,
            rows: []
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

    componentDidMount = () => {

        this.$f7.dialog.preloader()
        
        this.props.getPlaylist(this.state.routeParams).then((result)=>{
            this.setState({
                playlist: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="Playlist" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Playlist Kuis</NavTitle>,
                    <NavRight>
                        <Button raised fill onClick={()=>this.$f7router.navigate('/formPlaylist/')} className="bawahCiriBiru">
                            <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                            Buat Playlist Baru
                        </Button>
                    </NavRight>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <Card>
                            <CardContent>
                                Playlist kuis adalah kumpulan kuis dengan tema yang serupa yang disusun menjadi satu untuk memudahkan pengerjaan
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                {this.state.playlist.rows.map((option)=>{
                                    let waktu_buat = '';
                                    waktu_buat = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                    return (
                                        <a href={"/TampilPlaylist/"+option.playlist_id}>
                                            <div style={{borderBottom:'1px solid #eeeeee', marginTop:'16px', paddingBottom:'8px'}}>
                                                <Row>
                                                    <Col width="80" style={{display:'inline-flex'}}>
                                                        <div style={{height:'45px', width:'45px', background:"#cccccc", borderRadius:'50%', textAlign:'center'}}>
                                                            <i className="icons f7-icons" style={{marginTop:'7px', color:'white'}}>gamecontroller_fill</i>
                                                        </div>
                                                        <div style={{marginLeft:'8px'}}>
                                                            <b style={{fontSize:'16px'}}>{option.nama}</b> {parseInt(option.status_privasi) === 2 ? <i className="icons f7-icons" style={{fontSize:'18px'}}>lock_fill</i>  : <i className="icons f7-icons" style={{fontSize:'18px'}}>globe</i>}
                                                            <div style={{fontSize:'11px', color:'#434343'}}>Oleh <b>{option.pengguna}</b> - Sejak <b>{waktu_buat}</b></div>
                                                            <div style={{fontSize:'11px', color:'green'}}>{parseInt(option.kolaboratif) === 1 ? 'Kolaboratif' : <></>}</div>
                                                        </div>
                                                    </Col>
                                                    <Col width="20" style={{textAlign:'right'}}>
                                                        {option.jumlah_kuis ? option.jumlah_kuis : '0'} Kuis
                                                        {/* <Button>Tambah Kuis</Button> */}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </a>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
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
      getPlaylist: actions.getPlaylist
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Playlist));
  