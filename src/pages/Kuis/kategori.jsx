import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Link, Card, Row, Col, CardContent} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';



class kategori extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        mapel: [],
        count_kuis_umum: {}
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

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    componentDidMount = () => {
        this.props.getMapel(this.state.routeParams).then(()=>{
            this.setState({
                loading: false,
                mapel: this.props.mapel
            });
        });
        this.props.getCountKuisUmum(this.state.routeParams).then(()=>{
            this.setState({
                loading: false,
                count_kuis_umum: this.props.count_kuis_umum
            },()=>{
                console.log(this.state);
            });
        });
    }

    render()
    {
        return (
            <Page name="kategori" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kategori</NavTitle>
                    {/* <NavTitleLarge>
                        Kategori
                    </NavTitleLarge> */}
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        <Row noGap style={{justifyContent:'flex-start'}}>
                            {this.state.loading &&
                            <>
                            <Col width="50" tabletWidth="33" desktopWidth="25" className={"skeleton-text skeleton-effect-blink"}>
                                <Card style={{background:'url('+"option.gambar_latar"+') no-repeat center center / cover',minHeight:'80px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                    <CardContent style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                        <Link href={"/daftarKuis/"+"option.mata_pelajaran_id"} style={{display:'block'}}>
                                            <div style={{color:'white', fontSize:'20px'}}>
                                                {"option.nama"}
                                            </div>
                                            {/* <br/> */}
                                            <div style={{color:'white',fontSize:'12px'}}>
                                                ({"option.total" ? "option.total" : '0'} kuis)
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="50" tabletWidth="33" desktopWidth="25" className={"skeleton-text skeleton-effect-blink"}>
                                <Card style={{background:'url('+"option.gambar_latar"+') no-repeat center center / cover',minHeight:'80px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                    <CardContent style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                        <Link href={"/daftarKuis/"+"option.mata_pelajaran_id"} style={{display:'block'}}>
                                            <div style={{color:'white', fontSize:'20px'}}>
                                                {"option.nama"}
                                            </div>
                                            {/* <br/> */}
                                            <div style={{color:'white',fontSize:'12px'}}>
                                                ({"option.total" ? "option.total" : '0'} kuis)
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="50" tabletWidth="33" desktopWidth="25" className={"skeleton-text skeleton-effect-blink"}>
                                <Card style={{background:'url('+"option.gambar_latar"+') no-repeat center center / cover',minHeight:'80px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                    <CardContent style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                        <Link href={"/daftarKuis/"+"option.mata_pelajaran_id"} style={{display:'block'}}>
                                            <div style={{color:'white', fontSize:'20px'}}>
                                                {"option.nama"}
                                            </div>
                                            {/* <br/> */}
                                            <div style={{color:'white',fontSize:'12px'}}>
                                                ({"option.total" ? "option.total" : '0'} kuis)
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Col>
                            </>
                            }
                            {!this.state.loading &&
                            <>
                            <Col width="50" tabletWidth="33" desktopWidth="25">
                                <Card style={{background:'#434343 no-repeat center center / cover',minHeight:'80px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                    <CardContent style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)', borderRadius:'20px'}}>
                                        <Link href={"/daftarKuis/"+"98"} style={{display:'block'}}>
                                            <div style={{color:'white', fontSize:'15px', textShadow:'2px 2px #434343'}}>
                                                Umum
                                            </div>
                                            <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                                ({this.state.count_kuis_umum ? this.state.count_kuis_umum.total : '0'} kuis)
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </Col>
                            {this.state.mapel.map((option)=>{
                                return (
                                    <Col width="50" tabletWidth="33" desktopWidth="25">
                                        <Card style={{background:'url('+option.gambar_latar+') no-repeat center center / cover',minHeight:'80px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                                            <CardContent style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)', borderRadius:'20px'}}>
                                                <Link href={"/daftarKuis/"+option.mata_pelajaran_id} style={{display:'block'}}>
                                                    <div style={{color:'white', fontSize:'15px', textShadow:'2px 2px #434343'}}>
                                                        {option.nama}
                                                    </div>
                                                    {/* <br/> */}
                                                    <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                                        ({option.total ? option.total : '0'} kuis)
                                                    </div>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                )
                            })}
                            </>
                            }
                        </Row>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
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
      getKuisDiikuti: Actions.getKuisDiikuti,
      getMapel: Actions.getMapel,
      getCountKuisUmum: Actions.getCountKuisUmum
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        kuis_diikuti: Kuis.kuis_diikuti,
        mapel: App.mapel,
        count_kuis_umum: Kuis.count_kuis_umum
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kategori));
  