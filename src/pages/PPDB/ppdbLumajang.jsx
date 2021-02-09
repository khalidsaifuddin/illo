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


class ppdbLumajang extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        pengguna: {},
        sekolah: {}
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

    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="Leaderboard" hideBarsOnScroll className="akarHalaman akarHalamanIframe">
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>PPDB Lumajang 2021</NavTitle>                   
                </Navbar>
                {/* {!this.$f7route.params['override'] &&
                <Card>
                    <CardContent style={{textAlign:'center'}}>
                        <img src="https://be.diskuis.id/assets/wait.png" style={{width:'100%', maxWidth:'450px', margin:'auto'}} className="hilangDiMobile" />
                        <br/>
                        <img src="https://be.diskuis.id/assets/wait.png" style={{width:'100%'}} className="hilangDiDesktop" />
                        <h1>PPDB Lumajang Tahun 2021 belum dibuka</h1>
                        <h3>Jadwal akan diumumkan kemudian. Mohon kembali lagi ke halaman ini setelah ada jadwal resmi dari Dinas Pendidikan Kabupaten Lumajang</h3>
                        <span>Terima kasih</span>
                    </CardContent>
                </Card>
                }
                {this.$f7route.params['override'] && */}
                {/* <iframe src={"http://117.53.47.43:8060/#!/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']} style={{width: '100%',height: '100%', border:'none'}}></iframe> */}
                <iframe src={"https://ppdblumajang.diskuis.id/#!/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']} style={{width: '100%',height: '100%', border:'none', overflow:'hidden'}}></iframe>
                {/* } */}
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ppdbLumajang));
  