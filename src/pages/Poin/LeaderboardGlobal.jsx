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


class LeaderboardGlobal extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        pengguna: {},
        leaderboard_global: {
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

        this.props.getLeaderboardGlobal(this.state.routeParams).then((result)=>{
            this.setState({
                leaderboard_global: result.payload
            })
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="Leaderboard" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Leaderboard</NavTitle>                   
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        <Block style={{marginTop:'8px', marginBottom:'8px'}}>
                            <Segmented raised>
                                <Button className="color-theme-deeporange" style={{color:'#434343', fontWeight:'bold'}} tabLink="#tab-1" onClick={()=>this.$f7router.navigate('/Leaderboard/')}>Koneksi Anda</Button>
                                <Button className="color-theme-deeporange" style={{color:'#ffffff', fontWeight:'bold'}} tabLink="#tab-2" tabLinkActive>Global</Button>
                            </Segmented>
                        </Block>
                        <Card>
                            <CardContent>
                                <BlockTitle style={{marginTop:'0px'}}>Global</BlockTitle>
                                {this.state.leaderboard_global.rows.map((option)=>{
                                    return (
                                        <Card style={{border:(option.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #FF6B22' : 'none')}}>
                                            <CardContent style={{padding:'8px'}}>
                                                {/* {option.nama} */}
                                                <Row>
                                                    <Col width="10" tabletWidth="10" desktopWidth="5" style={{fontSize:'15px', fontWeight:'bold', paddingTop:'14px'}}>
                                                        #{(this.state.leaderboard_global.rows.indexOf(option)+1)}
                                                    </Col>
                                                    <Col width="20" tabletWidth="10" desktopWidth="10">
                                                        <img src={option.gambar} style={{width:'50px', height:'50px', borderRadius:'50%'}} />
                                                    </Col>
                                                    <Col width="45" tabletWidth="65" desktopWidth="70">
                                                        <Link href={"/TampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                        <br/><span style={{fontSize:'10px'}}>{option.username}</span>
                                                    </Col>
                                                    <Col width="25" tabletWidth="15" desktopWidth="15" style={{textAlign:'right', display:(parseInt(this.state.leaderboard_global.rows.indexOf(option)) === 0 ? 'inline-table' : 'block')}}>
                                                        <b style={{fontSize:'20px', color:'#558b2f'}}>{this.formatAngka(option.poin)}</b>
                                                        {parseInt(this.state.leaderboard_global.rows.indexOf(option)) === 0 &&
                                                        <img src="./static/icons/piala.png" style={{width:'20px', marginLeft:'4px'}} />
                                                        }
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
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
      getPengguna: actions.getPengguna,
      getLeaderboardGlobal: actions.getLeaderboardGlobal
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(LeaderboardGlobal));
  