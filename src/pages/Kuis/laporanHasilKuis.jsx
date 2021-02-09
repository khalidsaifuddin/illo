import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col, ListItem, BlockTitle, Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';
import RuangReducer from '../../store/reducers/Ruang.reducers';

class laporanHasilKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            ruang_id: this.$f7route.params['ruang_id']
        },
        loading:true,
        ruang: {
            rows: [{
                nama: ' '
            }],
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

        this.props.getRuang(this.state.routeParams).then((result)=>{
            this.setState({
                ruang: this.props.ruang
            },()=>{
                this.props.getLaporanHasilKuis(this.state.routeParams);
            });
        })

    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="laporanHasilKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.ruang.rows[0].nama}</NavTitle>
                    <NavTitleLarge>
                        {this.state.ruang.rows[0].nama}
                    </NavTitleLarge>
                </Navbar>
                <Row>
                    {/* <Col width="0" tabletWidth="15"></Col> */}
                    <Col width="60" tabletWidth="60">
                        <BlockTitle style={{color:'#434343', marginTop:'8px'}}>Laporan Hasil Kuis</BlockTitle>
                    </Col>
                    <Col width="40" tabletWidth="40">
                        <Button raised fill style={{background:'green', marginRight:'16px',marginTop:'8px', marginBottom:'8px'}} onClick={()=>window.open(localStorage.getItem('api_base')+'/api/Kuis/getLaporanHasilKuis?ruang_id='+this.state.ruang.rows[0].ruang_id+'&output=xlsx')}>
                            <i className="icon f7-icons" style={{fontSize:'25px'}}>download_circle_fill</i>&nbsp;
                            Unduh Xlsx
                        </Button>
                    </Col>
                    <Col width="100" tabletWidth="100">
                        
                        <Block strong style={{
                            marginTop:'0px', 
                            paddingLeft:'0px', 
                            paddingRight:'0px', 
                            paddingTop:'0px', 
                            paddingBottom:'0px'
                        }}>
                            <div className="data-table" style={{overflowY:'hidden'}}>
                                <table>
                                    <thead style={{background:'#eeeeee'}}>
                                        <tr>
                                            <th className="label-cell" rowSpan="2" style={{minWidth:'40px', color:'#434343', fontSize:'15px'}}>No.</th>
                                            <th className="label-cell" rowSpan="2" style={{minWidth:'200px', color:'#434343', fontSize:'15px'}}>Nama Peserta</th>
                                            <th className="label-cell" colSpan={(this.props.laporan_hasil_kuis.total  > 0 ? (this.props.laporan_hasil_kuis.rows[0].kuis.length): 0)} style={{minWidth:'200px', color:'#434343', fontSize:'15px', textAlign:'center'}}>Judul Kuis</th>
                                        </tr>
                                        <tr>
                                            {this.props.laporan_hasil_kuis.total > 0 &&
                                                <>
                                                {this.props.laporan_hasil_kuis.rows[0].kuis.map((optionJudul)=>{
                                                    return (
                                                    <th className="label-cell" rowSpan="2" style={{maxWidth:'120px', color:'#434343', fontSize:'15px'}}>{optionJudul.judul}<br/><span style={{fontSize:'10px',color:'#9E9E9E'}}>({optionJudul.keterangan})</span></th>
                                                    )
                                                })}
                                                </>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                            {this.props.laporan_hasil_kuis.total > 0 &&
                                                <>
                                                {this.props.laporan_hasil_kuis.rows.map((option)=>{
                                                    return (
                                                        <tr>
                                                            <td className="numeric-cell">{(parseInt(this.props.laporan_hasil_kuis.rows.indexOf(option))+1)}</td>
                                                            <td className="label-cell">{option.nama}</td>
                                                            {option.kuis.map((optionKuis)=>{
                                                                return (
                                                                    <td className="numeric-cell">{optionKuis.skor}</td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                                </>
                                            }
                                    </tbody>
                                </table>
                            </div>
                        </Block>
                    </Col>
                    {/* <Col width="0" tabletWidth="15"></Col> */}
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getSesiKuis: Actions.getSesiKuis,
      setSesiKuis: Actions.setSesiKuis,
      getRuang: Actions.getRuang,
      getLaporanHasilKuis: Actions.getLaporanHasilKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis,
        ruang: Ruang.ruang,
        laporan_hasil_kuis: Kuis.laporan_hasil_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(laporanHasilKuis));
  