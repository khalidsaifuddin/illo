import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class StoreToko extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
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
        
    }
    
    render()
    {
        return (
            <Page name="StoreToko" className="halamanStoreToko" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar className="navbarStore">
                    {/* <NavTitle sliding>Illo Store</NavTitle> */}
                </Navbar>
                
                <iframe src={localStorage.getItem('store_url')+'?inframe=1&loginRedirect='+JSON.parse(localStorage.getItem('user')).pengguna_id+'&user='+localStorage.getItem('user')} style={{width:'100%', height: '100%', border:'none'}} />
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(StoreToko));
  