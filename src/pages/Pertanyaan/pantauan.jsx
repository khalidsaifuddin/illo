import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class pantauan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            pantauan: 1
        },
        pertanyaan: {
            rows: [],
            total: 0
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
        this.props.getPertanyaanPantauan(this.state.routeParams).then((result)=>{
            this.setState({
                pertanyaan: this.props.pertanyaan_pantauan
            });
        });
    }

    render()
    {
        return (
            <Page name="pantauan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pantauan Pertanyaan</NavTitle>
                    <NavTitleLarge>
                        Pantauan Pertanyaan
                    </NavTitleLarge>
                    <NavRight>
                        <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Pertanyaan Baru" href="/tambahPertanyaan"></Link>
                    </NavRight>
                </Navbar>
                <BlockTitle style={{marginTop:'8px'}}>
                    Pertanyaan yang Anda pantau perkembangannya
                </BlockTitle>
                <Row noGap>
                    {this.state.pertanyaan.rows.map((option)=>{
                        let tanggal = '';
                        let tgl = new Date(option.create_date);

                        // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();
                        tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                        return (
                            <Col width="100" tabletWidth="50">
                                <Card>
                                    <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                                        {option.ruang.map((optionRuang)=>{
                                        return (
                                            <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                                            <span>&nbsp;/ {optionRuang.nama}</span>
                                            </Link>
                                        )
                                        })}
                                    </CardHeader>
                                    <CardHeader>
                                        <Link href={"/tampilPertanyaan/"+option.pertanyaan_id}>
                                            <b style={{fontSize:'23px'}}>{option.judul}</b>
                                        </Link>
                                    </CardHeader>
                                    <CardContent style={{paddingTop:'8px'}}>
                                        {/* {option.konten} */}
                                        <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                                        <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                        <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                        <div style={{marginTop:'-8px', maxHeight:'100px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                            <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                                            <p className="read-more" style={{textAlign:'center'}}>
                                            </p>
                                        </div>
                                        <Link style={{width:'100%', marginTop:'8px'}} href={"/tampilPertanyaan/"+option.pertanyaan_id}>Baca Selengkapnya</Link>
                                    </CardContent>
                                    <CardFooter>
                                        <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right" href={"/tampilPertanyaan/"+option.pertanyaan_id}>&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                                        <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle">&nbsp;{option.jumlah_pantauan} Pantauan</Link>
                                        <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle">&nbsp; Jawab</Link>
                                        {/* <Link iconIos="f7:square_pencil" iconAurora="f7:square_pencil" iconMd="material:square_pencil">&nbsp; Ubah</Link> */}
                                    </CardFooter>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getPertanyaan: Actions.getPertanyaan,
      getPertanyaanPantauan: Actions.getPertanyaanPantauan,
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan,
        pertanyaan_pantauan: Pertanyaan.pertanyaan_pantauan,
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(pantauan));
  