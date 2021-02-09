import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class daftarSekolahGuru extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        sekolah: {},
        sekolah_pengguna: {
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
        // this.props.getSekolah(this.state.routeParams).then((result)=>{
            // this.setState({
            //     sekolah: this.props.sekolah.rows[0],
            //     routeParams: {
            //         ...this.state.routeParams,
            //         pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            //     }
            // },()=>{
            this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    sekolah_pengguna: this.props.sekolah_pengguna
                });
            });
            // });
        // });

    }

    render()
    {
        return (
            <Page name="daftarSekolahGuru" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    {/* <NavTitle sliding>{JSON.parse(localStorage.getItem('user')).nama}</NavTitle> */}
                    <NavRight>
                        <Button onClick={()=>this.$f7router.navigate('/gabungSekolah/')} raised fill className="bawahCiriHijau color-theme-teal" style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} >
                            <i className="icons f7-icons" style={{fontSize:'15px'}}>person_badge_plus_fill</i>&nbsp;
                            Gabung ke Sekolah
                        </Button>
                    </NavRight>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        <BlockTitle style={{marginTop:'8px'}}>Daftar Sekolah {JSON.parse(localStorage.getItem('user')).nama}</BlockTitle>
                        {this.state.sekolah_pengguna.rows.map((option)=>{
                            return (
                                <Card style={{border:option.sekolah_utama === 1 ? '2px solid teal' : '0px solid teal'}}>
                                    <CardContent>
                                        {/* {option.nama} */}
                                        <Row>
                                            <Col width="15">
                                                <img src={"https://be.diskuis.id"+option.gambar_logo} style={{width:'40px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} />
                                                {/* <img src={localStorage.getItem('api_base')+option.gambar_logo} style={{width:'40px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} /> */}
                                            </Col>
                                            <Col width="55">
                                                {/* <b><Link href={"/tampilPengguna/"+option.pengguna_id}>{option.nama}</Link></b>
                                                <br/>{option.username} */}
                                                {/* <br/> */}
                                                {option.sekolah_utama === 1 ? <><span style={{color:'teal', fontWeight:'bold'}}>Sekolah Induk</span><br/></> : <></>}
                                                <b>{option.jabatan_sekolah}</b> di <b>{option.nama_sekolah}</b>
                                                <br/>
                                                {/* 
                                                Sejak {moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY')}
                                                <br/>
                                                <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.valid) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                    {parseInt(option.valid) === 1 ? 'Terverifikasi' : 'Perlu Verifikasi'}
                                                </Button> */}
                                                <Button raised fill small style={{fontSize:'9px', height:'15px', padding:'4px', display:'inline-flex', marginTop:'0px', marginRight:'4px'}} className={(parseInt(option.valid) === 1 ? 'color-theme-teal' : 'color-theme-orange')}>
                                                    {parseInt(option.valid) === 1 ? <><i className="icons f7-icons" style={{fontSize:'10px'}}>checkmark_seal_fill</i>&nbsp;Terverifikasi</> : 'Belum Terverifikasi'}
                                                </Button>
                                                <span style={{fontSize:'10px'}}>
                                                    Sejak {moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY')}
                                                </span>
                                                {/* <br/> */}
                                                {/* <br/> */}
                                            </Col>
                                            <Col width="30" style={{textAlign:'right'}}>
                                                <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/sekolah/'+option.sekolah_id)}>
                                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                                    Laman
                                                </Button>
                                                {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick={()=>this.$f7router.navigate('/'+(parseInt(option.jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+option.sekolah_id)}>
                                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                                    Menu
                                                </Button> */}
                                                {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick={()=>this.$f7router.navigate('/menuSekolahGuru/'+option.sekolah_id)}>
                                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                                </Button> */}
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
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
      getSekolah: actions.getSekolah,
      getSekolahPengguna: actions.getSekolahPengguna
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarSekolahGuru));
  