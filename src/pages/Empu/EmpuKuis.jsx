import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle, Subnavbar, Segmented
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import { Bar, Line } from 'react-chartjs-2';

import moment from 'moment';

class EmpuKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            jenis: this.$f7route.params['jenis'] ? this.$f7route.params['jenis'] : 'kuis',
            interval: 10
        },
        routeParamsBulan: {
            jenis: this.$f7route.params['jenis'] ? this.$f7route.params['jenis'] : 'kuis',
            interval: 3
        },
        rekap_harian: [],
        rekap_bulanan: [],
        arrLabel: [],
        arrData: [],
        arrLabelBulanan: [],
        arrDataBulanan: [],
        jenisLabel: (
            this.$f7route.params['jenis'] === 'kuis' ? 'Kuis' : 
            (
                this.$f7route.params['jenis'] === 'ruang' ? 'Ruang' : 
                (
                    this.$f7route.params['jenis'] === 'pengguna' ? 'Pengguna' : 
                    (
                        this.$f7route.params['jenis'] === 'pengguna_kuis' ? 'Peserta Kuis' : 
                        (
                            this.$f7route.params['jenis'] === 'sekolah' ? 'Sekolah' : 
                            'Kuis'
                        )
                    )
                )
            )
        )
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
        
        this.props.getRekap(this.state.routeParams).then((result)=>{
            let label = []
            let data = []
            let arrData = []

            result.payload.map((option)=>{
                label.push(option.tanggal)
                data.push(option.total)
                arrData.unshift(option)
            })

            this.setState({
                arrlabel: label,
                arrData: data,
                rekap_harian: arrData
            },()=>{

                this.props.getRekapBulanan(this.state.routeParamsBulan).then((result)=>{
                    let labelBulanan = []
                    let dataBulanan = []
                    let arrDataBulanan = []
        
                    result.payload.map((option)=>{
                        labelBulanan.push(option.tanggal)
                        dataBulanan.push(option.total)
                        arrDataBulanan.unshift(option)
                    })
        
                    this.setState({
                        arrlabelBulanan: labelBulanan,
                        arrDataBulanan: dataBulanan,
                        rekap_bulanan: arrDataBulanan
                    })
                })

            })
        })
    }

    gantiInterval = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                interval: e.currentTarget.value
            }
        },()=>{
            this.props.getRekap(this.state.routeParams).then((result)=>{
                let label = []
                let data = []
                let arrData = []
    
                result.payload.map((option)=>{
                    label.push(option.tanggal)
                    data.push(option.total)
                    arrData.unshift(option)
                })
    
                this.setState({
                    arrlabel: label,
                    arrData: data,
                    rekap_harian: arrData
                })
            })
        })
    }

    gantiIntervalBulan = (e) => {
        this.setState({
            routeParamsBulan: {
                ...this.state.routeParamsBulan,
                interval: e.currentTarget.value
            }
        },()=>{
            this.props.getRekapBulanan(this.state.routeParamsBulan).then((result)=>{
                let labelBulanan = []
                let dataBulanan = []
                let arrDataBulanan = []
    
                result.payload.map((option)=>{
                    labelBulanan.push(option.tanggal)
                    dataBulanan.push(option.total)
                    arrDataBulanan.unshift(option)
                })
    
                this.setState({
                    arrlabelBulanan: labelBulanan,
                    arrDataBulanan: dataBulanan,
                    rekap_bulanan: arrDataBulanan
                })
            })
        })
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="EmpuKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Rekap {this.state.jenisLabel+' Baru'}</NavTitle>
                    <NavTitleLarge>
                        Rekap {this.state.jenisLabel+' Baru'}
                    </NavTitleLarge>
                    <Subnavbar>
                        <Segmented raised>
                            <Button className="color-theme-deeporange" tabLink="#tab-kuis-1" tabLinkActive>Diskrit</Button>
                            <Button className="color-theme-deeporange"  onClick={()=>this.$f7router.navigate('/EmpuKuisKumulatif/'+this.$f7route.params['jenis'])}>Kumulatif</Button>
                        </Segmented>
                    </Subnavbar>
                </Navbar>

                <Row>
                    {/* <Col width="0" tabletWidth="15"></Col> */}
                    <Col width="100" tabletWidth="100">
                        <BlockTitle>Rekap Harian</BlockTitle>
                        <Row noGap>
                            <Col width="100" tabletWidth="70">
                                <Card>
                                    <CardContent>
                                        
                                        <List noHairlinesMd>
                                            <ListInput
                                                label="Interval Hari"
                                                type="select"
                                                outline
                                                defaultValue={this.state.routeParams.interval}
                                                placeholder="Silakan pilih..."
                                                onChange={this.gantiInterval}
                                            >
                                                <option value="10">10</option>
                                                <option value="15">15</option>
                                                <option value="20">20</option>
                                                <option value="25">25</option>
                                                <option value="30">30</option>
                                            </ListInput>
                                        </List>
                                    

                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>

                                        <Line
                                            data={{
                                            labels: this.state.arrlabel,
                                            datasets: [
                                                {
                                                label: this.state.jenisLabel+' Baru',
                                                // backgroundColor: 'rgba(255,99,132,1)',
                                                borderColor: 'rgba(255,99,132,1)',
                                                borderWidth: 2,
                                                // hoverBackgroundColor: 'rgba(255,99,132,1)',
                                                hoverBorderColor: 'rgba(255,99,132,1)',
                                                data: this.state.arrData
                                                }
                                            ]
                                            }}
                                            width={100}
                                            height={300}
                                            options={{ maintainAspectRatio: false }}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="30">
                                <Card style={{height:'410px', overflowY:'auto'}}>
                                    <CardContent style={{overflow:'auto'}}>
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <table>
                                            <thead style={{background:'#eeeeee'}}>
                                                <tr>
                                                    <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                                    <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>{this.state.jenisLabel+' Baru'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.rekap_harian.map((option)=>{
                                                return (
                                                    <tr>
                                                    <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                                    <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total}</td>
                                                    </tr>
                                                )
                                                })}
                                            </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>

                        <BlockTitle>Rekap Bulanan</BlockTitle>
                        <Row noGap>
                            <Col width="100" tabletWidth="70">
                                <Card>
                                    <CardContent>
                                        
                                        <List noHairlinesMd>
                                            <ListInput
                                                label="Interval Bulan"
                                                type="select"
                                                outline
                                                defaultValue={this.state.routeParamsBulan.interval}
                                                placeholder="Silakan pilih..."
                                                onChange={this.gantiIntervalBulan}
                                            >
                                                <option value="3">3</option>
                                                <option value="6">6</option>
                                                <option value="9">9</option>
                                                <option value="12">12</option>
                                                <option value="24">24</option>
                                            </ListInput>
                                        </List>
                                    

                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent>

                                        <Line
                                            data={{
                                            labels: this.state.arrlabelBulanan,
                                            datasets: [
                                                {
                                                label: this.state.jenisLabel+' Baru',
                                                // backgroundColor: 'rgba(255,99,132,1)',
                                                borderColor: 'rgba(255,99,132,1)',
                                                borderWidth: 2,
                                                // hoverBackgroundColor: 'rgba(255,99,132,1)',
                                                hoverBorderColor: 'rgba(255,99,132,1)',
                                                data: this.state.arrDataBulanan
                                                }
                                            ]
                                            }}
                                            width={100}
                                            height={300}
                                            options={{ maintainAspectRatio: false }}
                                        />
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="30">
                                <Card style={{height:'410px', overflowY:'auto'}}>
                                    <CardContent style={{overflow:'auto'}}>
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <table>
                                            <thead style={{background:'#eeeeee'}}>
                                                <tr>
                                                    <th className="label-cell" style={{minWidth:'60%', color:'#434343', fontSize:'13px'}}>Tanggal</th>
                                                    <th className="numeric-cell" style={{minWidth:'40%', color:'#434343', fontSize:'13px'}}>{this.state.jenisLabel+' Baru'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.rekap_bulanan.map((option)=>{
                                                return (
                                                    <tr>
                                                    <td className="label-cell" style={{minHeight:'10px', padding:'8px'}}>{option.tanggal}</td>
                                                    <td className="numeric-cell" style={{minHeight:'10px', padding:'8px'}}>{option.total}</td>
                                                    </tr>
                                                )
                                                })}
                                            </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
                        
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
      getRekap: Actions.getRekap,
      getRekapBulanan: Actions.getRekapBulanan
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(EmpuKuis));
  