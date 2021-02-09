import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Toolbar, Tabs, Tab, Segmented, Icon
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class ruang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            // jenis_ruang_id: 1
        },
        ruang: {
            rows: [],
            total: 0
        },
        ruang_diikuti: {
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
        this.props.getRuang(this.state.routeParams).then((result)=>{
            this.setState({
                ruang: this.props.ruang
            });
        });
        
        this.props.getRuangDiikuti(this.state.routeParams).then((result)=>{
            this.setState({
                ruang_diikuti: this.props.ruang_diikuti
            });
        });
    }

    ikutiRuang = (ruang_id) => {
        // alert('tes');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                ruang_id: ruang_id,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.routeParams).then((result)=>{
                // this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                //     this.setState({
                //         ...this.state,
                //         pengguna_ruang: this.props.pengguna_ruang
                //     })
                // });
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        ruang_id: null
                    }
                },()=>{
                    this.props.getRuang(this.state.routeParams).then((result)=>{
                        this.setState({
                            ruang: this.props.ruang
                        });
                    });
                });
            });

        });
    }

    hapusIkutiRuang = (ruang_id) => {
        // alert('tes');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                ruang_id: ruang_id,
                soft_delete: 1,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.routeParams).then((result)=>{
                // this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                //     this.setState({
                //         ...this.state,
                //         pengguna_ruang: this.props.pengguna_ruang
                //     })
                // });
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        ruang_id: null
                    }
                },()=>{
                    this.props.getRuang(this.state.routeParams).then((result)=>{
                        this.setState({
                            ruang: this.props.ruang
                        });
                    });
                });
            });

        });
    }

    render()
    {
        return (
            <Page name="ruang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Ruang</NavTitle>
                    <NavTitleLarge>
                        Ruang
                    </NavTitleLarge>
                    <NavRight>
                        <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Ruang Baru" href="/tambahRuang">&nbsp; Ruang Baru</Link>
                    </NavRight>
                </Navbar>
                {/* <BlockTitle style={{marginTop:'8px'}}>
                    Pertanyaan yang Anda tanyakan
                </BlockTitle> */}
                <Row noGap>
                    <Col width="100">

                        {/* <Toolbar tabbar>
                            <Link tabLink="#tab-ruang-1" tabLinkActive>Ruang Anda ({this.props.ruang.result})</Link>
                            <Link tabLink="#tab-ruang-2">Ruang yang diikuti (0)</Link>
                        </Toolbar> */}
                        <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                            <Segmented raised>
                                <Button tabLink="#tab-ruang-1" tabLinkActive>Ruang yang diikuti ({this.props.ruang_diikuti.total ? this.props.ruang_diikuti.total : '0'})</Button>
                                <Button tabLink="#tab-ruang-2">Ruang Anda ({this.props.ruang.result ? this.props.ruang.result : '0'})</Button>
                            </Segmented>
                        </Block>
                        <Tabs animated>
                            <Tab id="tab-ruang-1" tabActive>
                                <Block strong style={{marginTop:'0px', marginBottom:'8px'}}>
                                    <Button large fill raised onClick={()=>this.$f7router.navigate('/gabungRuang/')}>
                                        <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Ikuti Ruang"/>
                                        &nbsp;
                                        Ikuti Ruang
                                    </Button>
                                </Block>
                                {this.state.ruang_diikuti.total < 1 &&
                                    <Card><CardContent>Belum ada ruang yang Anda ikuti</CardContent></Card>
                                    }
                                    {this.state.ruang_diikuti.total > 0 &&
                                    <>
                                    {this.state.ruang_diikuti.rows.map((option)=>{
                                        let tanggal = '';
                                        let tgl = new Date(option.create_date);

                                        tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                        // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                        // console.log(option.self_pengguna_ruang.pengguna_id);
                                        // console.log(JSON.parse(localStorage.getItem('user')).pengguna_id);

                                        return (
                                            <Col width="100" tabletWidth="50">
                                                <Card>
                                                    <CardHeader style={{height:'100px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>  
                                                        <div className="mantab" style={{
                                                            backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                            width:'1000%',
                                                            marginLeft:'-15px',
                                                            marginRight:'-15px',
                                                            paddingLeft:'10px',
                                                            marginBottom:'-50px',
                                                            color:'white',
                                                            paddingBottom:'0px',
                                                            height:'40px',
                                                            paddingTop:'10px'
                                                        }}>
                                                            <Link href={"/tampilRuang/"+option.ruang_id} style={{color:'white'}}>
                                                                <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                    {option.nama} {parseInt(option.jenis_ruang_id) === 2 ? <i slot="media" style={{color:'#868686'}} tooltip="Ruang Privat" className="f7-icons">lock_fill</i> : <i slot="media" tooltip="Ruang Publik" style={{color:'#868686'}} className="f7-icons">globe</i>}
                                                                </h2>
                                                            </Link>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div style={{marginTop:'-10px'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                        <div style={{color:'#636363', fontSize:'12px'}}>
                                                            Sejak {tanggal}<br/>
                                                            Dibuat oleh <b>{option.pengguna}</b>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Link>{option.pertanyaan.result ? option.pertanyaan.result : '0'} Pertanyaan</Link>
                                                        <Link>{option.ruang.total ? option.ruang.total : '0'} Pengikut</Link>
                                                        {/* {parseInt(option.jenis_ruang_id) === 1 &&
                                                        <>
                                                        {option.self_pengguna_ruang.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                        <Button raised onClick={()=>this.hapusIkutiRuang(option.ruang_id)} style={{background:'#434343', color:'white', height:'35px', paddingTop:'3px'}} iconIos="f7:checkmark_circle" iconAurora="f7:checkmark_circle" iconMd="material:checkmark_circle">&nbsp; Mengikuti</Button>
                                                        }
                                                        {option.self_pengguna_ruang.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                        <Button fill raised color="blue" onClick={()=>this.ikutiRuang(option.ruang_id)} style={{background:'#007AFF', color:'white', height:'35px', paddingTop:'3px'}} iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button>
                                                        }
                                                        </>
                                                        }
                                                        {parseInt(option.jenis_ruang_id) === 2 &&
                                                        <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+option.ruang_id)} style={{background:'#bf360c'}}>
                                                            <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                                            Kode Ruang
                                                        </Button>
                                                        } */}
                                                        {/* <Button onClick={()=>this.ikutiRuang(option.ruang_id)} fill raised color="blue" iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button> */}
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                        )
                                    })}
                                </>
                            }
                                
                            </Tab>

                            <Tab id="tab-ruang-2">
                            <Row noGap>
                                    {this.state.ruang.rows.map((option)=>{

                                        let tanggal = '';
                                        let tgl = new Date(option.create_date);

                                        tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                        // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                        console.log(option.self_pengguna_ruang.pengguna_id);
                                        console.log(JSON.parse(localStorage.getItem('user')).pengguna_id);

                                        return (
                                            <Col width="100" tabletWidth="50">
                                                <Card>
                                                    <CardHeader style={{height:'100px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>  
                                                        <div className="mantab" style={{
                                                            backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                            width:'1000%',
                                                            marginLeft:'-15px',
                                                            marginRight:'-15px',
                                                            paddingLeft:'10px',
                                                            marginBottom:'-50px',
                                                            color:'white',
                                                            paddingBottom:'0px',
                                                            height:'40px',
                                                            paddingTop:'10px'
                                                        }}>
                                                            <Link href={"/tampilRuang/"+option.ruang_id} style={{color:'white'}}>
                                                                <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                    {option.nama} {parseInt(option.jenis_ruang_id) === 2 ? <i slot="media" style={{color:'#868686'}} tooltip="Ruang Privat" className="f7-icons">lock_fill</i> : <i slot="media" tooltip="Ruang Publik" style={{color:'#868686'}} className="f7-icons">globe</i>}
                                                                </h2>
                                                            </Link>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div style={{marginTop:'-10px'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                        <div style={{color:'#636363', fontSize:'12px'}}>
                                                            Sejak {tanggal}<br/>
                                                            Dibuat oleh <b>{option.pengguna}</b>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter>
                                                        <Link>{option.pertanyaan.result ? option.pertanyaan.result : '0'} Pertanyaan</Link>
                                                        <Link>{option.ruang.total ? option.ruang.total : '0'} Pengikut</Link>
                                                        {parseInt(option.jenis_ruang_id) === 1 &&
                                                        <>
                                                        {option.self_pengguna_ruang.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                        <Button raised onClick={()=>this.hapusIkutiRuang(option.ruang_id)} style={{background:'#434343', color:'white', height:'35px', paddingTop:'3px'}} iconIos="f7:checkmark_circle" iconAurora="f7:checkmark_circle" iconMd="material:checkmark_circle">&nbsp; Mengikuti</Button>
                                                        }
                                                        {option.self_pengguna_ruang.pengguna_id !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                        <Button fill raised color="blue" onClick={()=>this.ikutiRuang(option.ruang_id)} style={{background:'#007AFF', color:'white', height:'35px', paddingTop:'3px'}} iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button>
                                                        }
                                                        </>
                                                        }
                                                        {parseInt(option.jenis_ruang_id) === 2 &&
                                                        <Button raised fill onClick={()=>this.$f7router.navigate('/kodeRuang/'+option.ruang_id)} style={{background:'#bf360c'}}>
                                                            <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Ruang"/>&nbsp;
                                                            Kode Ruang
                                                        </Button>
                                                        }
                                                        {/* <Button onClick={()=>this.ikutiRuang(option.ruang_id)} fill raised color="blue" iconIos="f7:person_crop_circle_badge_plus" iconAurora="f7:person_crop_circle_badge_plus" iconMd="material:person_crop_circle_badge_plus">&nbsp; Ikuti</Button> */}
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
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
      getRuang: Actions.getRuang,
      simpanPenggunaRuang: Actions.simpanPenggunaRuang,
      getRuangDiikuti: Actions.getRuangDiikuti
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan,
        ruang: Ruang.ruang,
        ruang_diikuti: Ruang.ruang_diikuti
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ruang));
  