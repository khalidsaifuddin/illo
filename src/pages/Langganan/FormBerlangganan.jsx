import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, CardContent, Card, Row, Col, Segmented, Button, Tabs, Tab, Link, CardFooter
} from 'framework7-react';

import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

class formBerlangganan extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        loading:true
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
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: this.props.pengguna.rows[0]
            },()=>{
                
            })
        })

    }

    render()
    {
        return (
            <Page name="formBerlangganan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Berlangganan</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        <Card>
                            <CardContent>
                                ---
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
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getPengguna: Actions.getPengguna
    }, dispatch);
}

function mapStateToProps({ App, Notifikasi, Aktivitas, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(formBerlangganan));
  