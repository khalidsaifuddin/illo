import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardHeader, Row, Col, CardContent, CardFooter, Chip, Toolbar, Tabs, Tab, Segmented
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class kuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
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
        this.setState({
            routeParams: {
                ...this.state.routeParams
            }
        },()=>{
            this.props.getKuis(this.state.routeParams).then((result)=>{

            });

            this.props.getKuisDiikuti(this.state.routeParams).then((result)=>{

            });
        });

    }

    buatKuis = () => {
        this.$f7router.navigate('/tambahKuis/'+JSON.parse(localStorage.getItem('user')).pengguna_id);
    }

    render()
    {
        return (
            <Page name="kuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kuis</NavTitle>
                    <NavTitleLarge>
                        Kuis
                    </NavTitleLarge>
                </Navbar>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getKuisDiikuti: Actions.getKuisDiikuti
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        kuis_diikuti: Kuis.kuis_diikuti
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kuis));
  