import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class BerandaSekolah extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            foo:'bar',
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        pengaturan_pengguna: {},
        sekolah: null,
        langganan: {
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

        if(parseInt(localStorage.getItem('sudah_login')) !== 1){
            this.$f7router.navigate('/login/');
        }else{

            //what to do after mount
    
            this.setState({
                routeParams: {
                    pengguna_id: localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')).pengguna_id : null,
                    aktif: 1,
                    administrator: 1
                }
            },()=>{

                if(!this.$f7route.params['sekolah_id']){
                    
                    this.props.getSekolah(this.state.routeParams).then((result)=>{
                        this.setState({
                            sekolah: this.props.sekolah.rows[0]
                        },()=>{
    
                            this.props.getPengaturanPengguna(this.state.routeParams).then((result)=>{
                                // console.log(this.props.pengaturan_pengguna);
                                if(this.props.pengaturan_pengguna.total > 0){
            
                                    this.setState({
                                        pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
                                    },()=>{
    
                                        this.props.getLangganan({sekolah_id: this.state.sekolah.sekolah_id}).then((resultLangganan)=>{
                                            this.setState({
                                                langganan: resultLangganan.payload
                                            })
                                        })
    
                                    })
                                    
                                }
                            })
                        })
                    })

                }else{

                    this.props.getSekolah({...this.state.routeParams, sekolah_id: this.$f7route.params['sekolah_id'], aktif: null}).then((result)=>{
                        this.setState({
                            sekolah: this.props.sekolah.rows[0]
                        },()=>{
    
                            this.props.getPengaturanPengguna(this.state.routeParams).then((result)=>{
                                // console.log(this.props.pengaturan_pengguna);
                                if(this.props.pengaturan_pengguna.total > 0){
            
                                    this.setState({
                                        pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
                                    },()=>{
    
                                        this.props.getLangganan({sekolah_id: this.state.sekolah.sekolah_id}).then((resultLangganan)=>{
                                            this.setState({
                                                langganan: resultLangganan.payload
                                            })
                                        })
    
                                    })
                                    
                                }
                            })

                        })
                    })

                }
                
        
    
            })

        }


        // console.log(this.props.pengaturan_sekolah);

    }

    render()
    {
        return (
            <Page name="BerandaSekolah" hideBarsOnScroll>
                {!localStorage.getItem('sekolah_id_beranda') &&
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Sekolah</NavTitle>
                </Navbar>
                }
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">   

                        {!this.state.sekolah &&
                        <>
                        <Card>
                            <CardContent style={{textAlign:'center'}}>
                                <img src="./static/icons/sekolah2.png" style={{width:'80%', maxWidth:'400px', filter:'grayscale(100%)'}} />
                                <br/>
                                <b style={{fontSize:'15px'}}>Anda belum membuat sekolah atau menjadi administrator dari sekolah tertentu</b>
                                <br/>
                                <br/>
                                <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/formSekolah/")} style={{display: 'inline-flex', width:'100%', maxWidth:'400px'}}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                                    Tambah Sekolah
                                </Button>
                                <br/>
                            </CardContent>
                        </Card>
                        {/* <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="50">
                                        <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/kelolaSekolah/")}>
                                            Tambah Sekolah
                                        </Button>
                                    </Col>
                                    <Col width="50">
                                        {/* <Button className="color-theme-red bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/kodeSekolah/"+this.state.sekolah.sekolah_id)}>
                                            Kode Sekolah
                                        </Button> */}
                                    {/* </Col>
                                </Row>
                            </CardContent>
                        </Card> */}
                        </>
                        }
                        {this.state.sekolah &&
                        <>
                        <div
                            className="merahAtas"
                            style={{minHeight:'200px', background:'#cccccc', backgroundSize:'cover', background:'#3434343', backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_latar+')'}}
                            // style={{minHeight:'200px', backgroundSize:'cover', backgroundImage:'url('+localStorage.getItem('api_base')+this.state.sekolah.gambar_latar+')'}}
                        >
                        </div>
                        <Card>
                            <CardContent style={{padding:'8px', marginTop:'-50px', borderRadius:'20px', color:'#434343'}}>
                            {/* <CardContent style={{padding:'8px', marginTop:'-50px', borderRadius:'20px', color:'white'}} className="halamanBeranda"> */}
                                <Row>
                                    <Col width="100" tabletWidth="80">
                                        <div style={{
                                            height:'110px', 
                                            width:'110px',
                                            background:'white', 
                                            backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                            backgroundSize:'cover',
                                            position:'absolute',
                                            marginTop:'-45px',
                                            // borderRadius: '50%',
                                            borderRadius:'20px',
                                            border:'1px solid #CCC'
                                        }}>
                                            &nbsp;
                                        </div>
                                        <h1 className="namaSekolah">{this.state.sekolah.nama}</h1>
                                        {/* <h1 className="namaSekolah">{this.state.sekolah.nama} {(this.state.sekolah.npsn ? <>({this.state.sekolah.npsn})</> : '')}</h1> */}
                                        <h3 className="keteranganSekolah">{this.state.sekolah.keterangan}</h3>
                                        <span className="alamatSekolah hilangDiMobile">{this.state.sekolah.alamat}</span>
                                    </Col>
                                    <Col width="100" tabletWidth="20" className="hilangDiMobile">
                                        {this.state.langganan.total < 1 &&
                                        <div className="boxGratis">
                                            <div class="namaPaket">
                                                <img src="./static/icons/free.png" />
                                                <br/>
                                                Standar
                                                <br/>
                                            </div>
                                        </div>
                                        }
                                        {this.state.langganan.total > 0 &&
                                        <div className="boxPremium">
                                            <div class="namaPaket">
                                                <img src="./static/icons/vip.png" style={{width:'30px'}} />
                                                <br/>
                                                Premium
                                                <br/>
                                            </div>
                                        </div>
                                        }
                                    </Col>
                                </Row>
                                {/* <a className="link external" href="https://google.com">tes</a> */}
                            </CardContent>
                        </Card>
                        <Row noGap style={{marginBottom:'50px'}}>
                            <Col width="100">
                                <Card>  
                                    <CardContent style={{padding:'8px'}}>
                                        <Row>
                                            <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                                            <Col width="0" tabletWidth="100" desktopWidth="100">
                                                <Row>
                                                    {this.state.pengaturan_pengguna.hide_menu_sekolah !== 1 &&
                                                    <Col width="50" tabletWidth="25" style={{padding:'4px'}}>
                                                        <Button style={{marginBottom:'8px', display:'inline-flex', width:'100%'}} className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/kelolaSekolah/")}>
                                                            <i className="icons f7-icons">menu</i>&nbsp;
                                                            Kelola Sekolah
                                                        </Button>
                                                    </Col>
                                                    }
                                                    <Col width={this.state.pengaturan_pengguna.hide_menu_sekolah !== 1 ? "50" : "100"} tabletWidth={this.state.pengaturan_pengguna.hide_menu_sekolah !== 1 ? "25" : "33"} style={{padding:'4px'}}>
                                                        <Button style={{marginBottom:'8px', display:'inline-flex', width:'100%'}} className="color-theme-teal bawahCiriHijau" raised fill onClick={()=>this.$f7router.navigate("/formSekolah/"+this.state.sekolah.sekolah_id)}>
                                                            <i className="icons f7-icons">pencil</i>&nbsp;
                                                            Edit Sekolah
                                                        </Button>
                                                    </Col>
                                                    <Col width="50" tabletWidth={this.state.pengaturan_pengguna.hide_menu_sekolah !== 1 ? "25" : "33"} style={{padding:'4px'}}>
                                                        <Button style={{marginBottom:'8px', display:'inline-flex', width:'100%'}} className="color-theme-red bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/buatKodeSekolah/"+this.state.sekolah.sekolah_id)}>
                                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>qrcode</i>&nbsp;
                                                            Buat Undangan
                                                        </Button>
                                                    </Col>
                                                    <Col width="50" tabletWidth={this.state.pengaturan_pengguna.hide_menu_sekolah !== 1 ? "25" : "33"} style={{padding:'4px'}}>
                                                        <Button style={{marginBottom:'8px', display:'inline-flex', width:'100%'}} className="color-theme-blue bawahCiriBiru" raised fill onClick={()=>this.$f7router.navigate("/undanganSekolah/"+this.state.sekolah.sekolah_id)}>
                                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>square_list</i>&nbsp;
                                                            Daftar Undangan
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col tabletWidth="50" width="100">
                                <Card>
                                    <CardContent style={{padding:'8px'}}>
                                        <BlockTitle style={{marginTop:'4px'}}>Data Guru dan Siswa</BlockTitle>
                                        <Row>
                                            <Col width="0" tabletWidth="0"></Col>
                                            <Col width="100" tabletWidth="100">
                                                <Row style={{justifyContent:'left'}}>
                                                    <Col width="33" tabletWidth="33">
                                                        <a href={"/daftarGuru/"+this.state.sekolah.sekolah_id}>
                                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                                <CardContent style={{textAlign:'center'}}>
                                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>person_2_alt</i> */}
                                                                    <img src="./static/icons/teacher.png" style={{width:'100%'}} />
                                                                    <br/>
                                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Guru</div>
                                                                </CardContent>
                                                            </Card>
                                                        </a>
                                                    </Col>
                                                    <Col width="33" tabletWidth="33">
                                                        <a href={"/daftarSiswa/"+this.state.sekolah.sekolah_id}>
                                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                                <CardContent style={{textAlign:'center'}}>
                                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>person_3_fill</i> */}
                                                                    <img src="./static/icons/pupil.png" style={{width:'100%'}} />
                                                                    <br/>
                                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Siswa</div>
                                                                </CardContent>
                                                            </Card>
                                                        </a>
                                                    </Col>
                                                    <Col width="33" tabletWidth="33">
                                                        <a href={"/daftarRuang/"+this.state.sekolah.sekolah_id}>
                                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                                <CardContent style={{textAlign:'center'}}>
                                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>circle_grid_hex_fill</i> */}
                                                                    <img src="./static/icons/room.png" style={{width:'100%'}} />
                                                                    <br/>
                                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Ruang</div>
                                                                </CardContent>
                                                            </Card>
                                                        </a>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="0" tabletWidth="00"></Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col tabletWidth="50" width="100">
                                <Card>
                                    <CardContent style={{padding:'8px'}}>
                                        <BlockTitle style={{marginTop:'4px'}}>Kehadiran Guru dan Siswa</BlockTitle>
                                        <Row>
                                            <Col width="0" tabletWidth="0"></Col>
                                            <Col width="100" tabletWidth="100">
                                                <Row style={{justifyContent:'center'}}>
                                                    <Col width="50" tabletWidth="50">
                                                        <a href={"/kehadiranRekapGuru/"+this.state.sekolah.sekolah_id}>
                                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                                <CardContent style={{textAlign:'center'}}>
                                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>person_crop_circle_badge_checkmark</i> */}
                                                                    <img src="./static/icons/teacher2.png" style={{width:'55%'}} />
                                                                    <br/>
                                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Kehadiran Guru</div>
                                                                </CardContent>
                                                            </Card>
                                                        </a>
                                                    </Col>
                                                    <Col width="50" tabletWidth="50">
                                                        {/* <a href="/adc"> */}
                                                        <a href={"/kehadiranRekapSiswa/"+this.state.sekolah.sekolah_id}>
                                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                                <CardContent style={{textAlign:'center'}}>
                                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>rectangle_badge_checkmark</i>
                                                                    <br/> */}
                                                                    <img src="./static/icons/student2.png" style={{width:'55%'}} />
                                                                    <br/>
                                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Kehadiran Siswa</div>
                                                                </CardContent>
                                                            </Card>
                                                        </a>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="0" tabletWidth="00"></Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="100" tabletWidth="50">
                                <Card>
                                    <CardContent>
                                        <BlockTitle style={{marginTop:'4px'}}>Pengaturan Sekolah</BlockTitle>
                                        <a href={"/pengaturanPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah.sekolah_id}>
                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                <CardContent style={{textAlign:'center'}}>
                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>gear_alt_fill</i>
                                                    <br/> */}
                                                    <img src="./static/icons/gear.png" style={{height:'85px'}} />
                                                    <br/>
                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>Pengaturan Sekolah</div>
                                                </CardContent>
                                            </Card>
                                        </a>
                                    </CardContent>
                                </Card>
                            </Col>
                            {(this.state.sekolah.kode_wilayah_kabupaten ? this.state.sekolah.kode_wilayah_kabupaten.trim() : '') === '052100' &&
                            <Col width="100" tabletWidth="50">
                                <Card>
                                    <CardContent>
                                        <BlockTitle style={{marginTop:'4px'}}>PPDB</BlockTitle>
                                        <a href={"/PPDB-Lumajang/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah.sekolah_id}>
                                            <Card style={{border:'1px solid #eeeeee'}}>
                                                <CardContent style={{textAlign:'center'}}>
                                                    {/* <i className="icon f7-icons" style={{fontSize:'80px'}}>gear_alt_fill</i>
                                                    <br/> */}
                                                    <img src={"https://be.diskuis.id/assets/berkas/lumajang_logo_besar.png"} style={{height:'85px'}} />
                                                    <br/>
                                                    <div style={{fontStyle:'50px', fontWeight:'bold'}}>PPDB Lumajang 2021</div>
                                                </CardContent>
                                            </Card>
                                        </a>
                                    </CardContent>
                                </Card>
                            </Col>
                            }
                            {(this.state.sekolah.tipe_sekolah_id ? parseInt(this.state.sekolah.tipe_sekolah_id) : '') === 5 &&
                            <Col width="100" tabletWidth="50">
                                <Card>
                                    <CardContent>
                                        <BlockTitle style={{marginTop:'4px'}}>Keuangan</BlockTitle>
                                        <Row noGap>
                                            <Col width="50">
                                                <a href={"/SakuSiswa/"+this.state.sekolah.sekolah_id}>
                                                    <Card style={{border:'1px solid #eeeeee', marginTop:'0px'}}>
                                                        <CardContent style={{textAlign:'center'}}>
                                                            <img src={"./static/icons/dompet.png"} style={{height:'85px'}} />
                                                            <br/>
                                                            <div style={{fontStyle:'50px', fontWeight:'bold'}}>Saku Siswa</div>
                                                        </CardContent>
                                                    </Card>
                                                </a>
                                            </Col>
                                            <Col width="50">
                                                <a href={"/UnitUsaha/"+this.state.sekolah.sekolah_id}>
                                                    <Card style={{border:'1px solid #eeeeee', marginTop:'0px'}}>
                                                        <CardContent style={{textAlign:'center'}}>
                                                            <img src={"./static/icons/toko.png"} style={{height:'85px'}} />
                                                            <br/>
                                                            <div style={{fontStyle:'50px', fontWeight:'bold'}}>Unit Usaha</div>
                                                        </CardContent>
                                                    </Card>
                                                </a>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            </Col>
                            }
                        </Row>
                        </>
                        }
                        
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
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
      getPengaturanPengguna: actions.getPengaturanPengguna,
      getLangganan: actions.getLangganan
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        pengaturan_pengguna: App.pengaturan_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(BerandaSekolah));
  