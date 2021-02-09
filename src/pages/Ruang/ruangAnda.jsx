import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Toolbar, Tabs, Tab, Segmented, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class ruangAnda extends Component {
    state = {
        error: null,
        loading: true,
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
        },
        dummy: [{
            foo:'bar'
        },{
            foo:'bar'
        }]
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
                loading: false,
                ruang: this.props.ruang
            });
        });
        
        // this.props.getRuangDiikuti(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         loading: false,
        //         ruang_diikuti: this.props.ruang_diikuti
        //     });
        // });
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

    hapusRuang = (ruang_id) => {
        this.$f7.dialog.confirm('Semua progres ruang akan ikut terhapus. Proses ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus ruang?', 'Perhatian', () => {
            // app.dialog.alert('Great!');
            this.setState({
                loading: true,
                routeParamsHapus:{
                    ruang_id: ruang_id
                }
            },()=>{
                this.props.hapusRuang(this.state.routeParamsHapus).then((result)=>{
                    this.props.getRuang(this.state.routeParams).then((result)=>{
                        this.setState({
                            loading: false,
                            ruang: this.props.ruang
                        });
                    });
                })
            });
        });
    }

    editRuang = (ruang_id) => {
        this.$f7router.navigate('/tambahRuang/'+ruang_id);
    }

    render()
    {
        return (
            // <Page name="ruangAnda" hideBarsOnScroll className="halamanBeranda">
            <Page name="ruangAnda" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Ruang</NavTitle>
                    {/* <NavTitleLarge>
                        Ruang
                    </NavTitleLarge> */}
                    <NavRight>
                        <Button fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/tambahRuang/')}>
                            {/* <i className="icon f7-icons" style={{fontSize:'25px'}}>plus</i> */}
                            <i className="icon f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                            Buat Ruang Baru
                        </Button>
                    </NavRight>
                    {/* <NavRight>
                        <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Ruang Baru" href="/tambahRuang">&nbsp; Ruang Baru</Link>
                    </NavRight> */}
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        {/* <BlockTitle style={{marginTop:'8px'}}>
                            Pertanyaan yang Anda tanyakan
                        </BlockTitle> */}
                        <Row noGap>
                            <Col width="100">

                                {/* <Toolbar tabbar>
                                    <Link tabLink="#tab-ruang-1" tabLinkActive>Ruang Anda ({this.props.ruang.result})</Link>
                                    <Link tabLink="#tab-ruang-2">Ruang yang diikuti (0)</Link>
                                </Toolbar> */}
                                {/* <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    <Segmented raised>
                                        <Button tabLink="#tab-ruang-1" tabLinkActive>Ruang yang diikuti ({this.props.ruang_diikuti.total ? this.props.ruang_diikuti.total : '0'})</Button>
                                        <Button tabLink="#tab-ruang-2">Ruang Anda ({this.props.ruang.result ? this.props.ruang.result : '0'})</Button>
                                    </Segmented>
                                </Block> */}
                                <Tabs animated>
                                    <Tab id="tab-ruang-1" tabActive>
                                        {/* <Block strong style={{marginTop:'0px', marginBottom:'8px'}}>
                                            <Row>
                                                <Col width="0" tabletWidth="15"></Col>
                                                <Col width="100" tabletWidth="70">
                                                    <Card>
                                                    <CardContent>
                                                        <Button large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/tambahRuang/')}>
                                                            Tambah Ruang
                                                        </Button>
                                                    </CardContent>
                                                    </Card>
                                                </Col>
                                                <Col width="0" tabletWidth="15"></Col>
                                            </Row>
                                        </Block> */}
                                        <BlockTitle style={{color:'#434343', fontWeight:'bold'}}>Ruang yang Anda buat</BlockTitle>
                                        <Row style={{justifyContent:'flex-start'}}>
                                            {this.state.loading &&
                                            <>
                                            {this.state.dummy.map((dumm)=>{
                                                return (
                                                <Col width="50" tabletWidth="33">
                                                    <Card className="skeleton-text skeleton-effect-blink">
                                                        <CardHeader style={{
                                                            borderRadius:'20px 20px 0px 0px',
                                                            height:'120px', 
                                                            background: '#cccccc',
                                                            backgroundSize:'cover', 
                                                            backgroundPosition:'center', 
                                                            backgroundRepeat:'no-repeat'
                                                        }}>  
                                                            <div className="mantab" style={{
                                                                backgroundColor:'rgba(255, 255, 255, 0.6)',
                                                                width:'1000%',
                                                                marginLeft:'-15px',
                                                                marginRight:'-15px',
                                                                paddingLeft:'10px',
                                                                color:'white',
                                                                paddingTop:'15px',
                                                                marginTop:'-30px',
                                                                paddingBottom:'10px'
                                                            }}>
                                                                
                                                                <h3 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                    {"option.nama"} {parseInt("option.jenis_ruang_id") === 2 ? <i slot="media" style={{color:'#868686'}} tooltip="Ruang Privat" className="f7-icons">lock_fill</i> : <i slot="media" tooltip="Ruang Publik" style={{color:'#868686'}} className="f7-icons">globe</i>}
                                                                </h3>
                                                                
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div style={{marginTop:'-10px', fontSize:'10px', fontStyle:'italic', height:'50px', overflow:'hidden'}} dangerouslySetInnerHTML={{ __html: "option.deskripsi" }} />
                                                            <div style={{color:'#636363', fontSize:'12px', height:'30px'}}>
                                                                Sejak {"tanggal"}<br/>
                                                                Dibuat oleh <b>{"option.pengguna"}</b>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Link>{"option.sesi_kuis" ? "option.sesi_kuis".total : '0'} Kuis</Link>
                                                            <Link>{"option.ruang" ? "option.ruang".total : '0'} Anggota</Link>
                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+"option.ruang_id"}>
                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                            </Button>
                                                            <Popover className={"popover-menu-"+"option.ruang_id"}>
                                                                <List>
                                                                    <ListItem style={{cursor:'pointer'}} onClick={()=>this.editRuang("option.ruang_id")} popoverClose title="Edit Ruang" />
                                                                    <ListItem style={{cursor:'pointer'}} onClick={()=>this.hapusRuang("option.ruang_id")} popoverClose title="Hapus Ruang" />
                                                                </List>
                                                            </Popover>
                                                        </CardFooter>
                                                    </Card>
                                                </Col>
                                                )
                                            })}
                                            </>
                                            }
                                            {this.state.ruang.result < 1 &&
                                            <Card style={{width:'100%'}}><CardContent>Belum ada ruang yang Anda buat</CardContent></Card>
                                            }
                                            {this.state.ruang.result > 0 &&
                                            <>
                                            {this.state.ruang.rows.map((option)=>{
                                                let tanggal = '';
                                                let tgl = new Date(option.create_date);

                                                tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                                // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                                // console.log(option.self_pengguna_ruang.pengguna_id);
                                                // console.log(JSON.parse(localStorage.getItem('user')).pengguna_id);

                                                return (
                                                    <Col width="50" tabletWidth="33">
                                                        <Card>
                                                            <CardHeader className="gambarRuang" style={{
                                                                borderRadius:'20px 20px 0px 0px',
                                                                height:'120px', 
                                                                backgroundSize:'cover', 
                                                                backgroundPosition:'center', 
                                                                backgroundRepeat:'no-repeat',
                                                                backgroundImage:'url("https://be.diskuis.id/assets/berkas/'+option.gambar_ruang+'")'
                                                                // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+'")'
                                                            }}>  
                                                                <div className="mantab" style={{
                                                                    backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                    width:'1000%',
                                                                    marginLeft:'-15px',
                                                                    marginRight:'-15px',
                                                                    paddingLeft:'10px',
                                                                    // marginBottom:'-70px',
                                                                    color:'white',
                                                                    // paddingBottom:'0px',
                                                                    // height:'40px',
                                                                    paddingTop:'15px',
                                                                    marginTop:'0px',
                                                                    paddingBottom:'10px'
                                                                }}>
                                                                    <Link href={"/tampilRuang/"+option.ruang_id} style={{color:'white'}}>
                                                                        <h3 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                                            {option.nama} {parseInt(option.jenis_ruang_id) === 2 ? <i slot="media" style={{color:'white', fontSize:'20px'}} tooltip="Ruang Privat" className="f7-icons">lock_fill</i> : <i slot="media" tooltip="Ruang Publik" style={{color:'#868686'}} className="f7-icons">globe</i>}
                                                                        </h3>
                                                                    </Link>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div style={{marginTop:'-10px', fontSize:'10px', fontStyle:'italic', height:'50px', overflow:'hidden'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                                <div style={{color:'#636363', fontSize:'12px', height:'30px'}}>
                                                                    Sejak {tanggal}<br/>
                                                                    Dibuat oleh <b>{option.pengguna}</b>
                                                                </div>
                                                            </CardContent>
                                                            <CardFooter>
                                                                <Link>{option.sesi_kuis ? option.sesi_kuis.total : '0'} Kuis</Link>
                                                                <Link>{option.ruang ? option.ruang.total : '0'} Anggota</Link>
                                                                <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.ruang_id}>
                                                                    <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                                </Button>
                                                                <Popover className={"popover-menu-"+option.ruang_id}>
                                                                    <List>
                                                                        <ListItem style={{cursor:'pointer'}} onClick={()=>this.editRuang(option.ruang_id)} popoverClose title="Edit Ruang" />
                                                                        <ListItem style={{cursor:'pointer'}} onClick={()=>this.hapusRuang(option.ruang_id)} popoverClose title="Hapus Ruang" />
                                                                    </List>
                                                                </Popover>
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
                                    </Row>
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
                                                            <CardHeader style={{
                                                                borderRadius:'20px 20px 0px 0px',
                                                                height:'100px', 
                                                                backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+') no-repeat center center / cover', 
                                                                backgroundSize:'cover', 
                                                                backgroundPosition:'center', 
                                                                backgroundRepeat:'no-repeat'
                                                            }}>  
                                                                <div className="mantab" style={{
                                                                    backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                    width:'1000%',
                                                                    marginLeft:'-15px',
                                                                    marginRight:'-15px',
                                                                    paddingLeft:'10px',
                                                                    // marginTop:'0px',
                                                                    // marginBottom:'-50px',
                                                                    color:'white',
                                                                    // paddingBottom:'0px',
                                                                    // height:'40px',
                                                                    paddingTop:'10px',
                                                                    marginTop:'-45px',
                                                                    paddingBottom:'10px'
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
                                                                <Link>{option.pertanyaan ? option.pertanyaan.result : '0'} Pertanyaan</Link>
                                                                <Link>{option.ruang ? option.ruang.total : '0'} Anggota</Link>
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
      getPertanyaan: Actions.getPertanyaan,
      getRuang: Actions.getRuang,
      simpanPenggunaRuang: Actions.simpanPenggunaRuang,
      getRuangDiikuti: Actions.getRuangDiikuti,
      hapusRuang: Actions.hapusRuang
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

export default (connect(mapStateToProps, mapDispatchToProps)(ruangAnda));
  