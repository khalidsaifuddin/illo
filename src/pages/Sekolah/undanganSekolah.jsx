import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class undanganSekolah extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {},
        undangan_sekolah: {
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

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0],
                routeParams: {
                    ...this.state.routeParams,
                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{
                this.props.getUndanganSekolah(this.state.routeParams).then((result)=>{
                    this.setState({
                        undangan_sekolah: this.props.undangan_sekolah
                    });
                });
            });
        });

    }

    render()
    {
        return (
            <Page name="undanganSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Undangan Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        {this.state.undangan_sekolah.rows.map((option)=>{
                            return (
                                <Card>
                                    <CardContent>
                                        {/* {option.nama} */}
                                        <Row>
                                            <Col width="60">
                                                Aktif Sejak: <b>{option.waktu_mulai}</b>
                                                <br/>Berakhir: <b>{option.waktu_selesai}</b>
                                                <br/>Keterangan: {option.keterangan}
                                                <br/>Untuk: {option.jabatan_sekolah}
                                            </Col>
                                            <Col width="40" style={{textAlign:'right'}}>
                                                <Button style={{fontSize:'13px'}} raised fill className={'color-theme-red'} onClick={()=>this.$f7router.navigate("/kodeSekolah/"+option.sekolah_id+"/"+option.undangan_sekolah_id)}>
                                                    <i className="icons f7-icons">qrcode</i>&nbsp;
                                                    Kode Sekolah
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
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
      getSekolah: actions.getSekolah,
      getUndanganSekolah: actions.getUndanganSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        undangan_sekolah: Sekolah.undangan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(undanganSekolah));
  