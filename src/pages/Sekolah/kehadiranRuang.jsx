import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Checkbox, Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class kehadiranRuang extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            ruang_id: this.$f7route.params['ruang_id'] ? this.$f7route.params['ruang_id'] : null,
            tahun_ajaran_id: this.$f7route.params['tahun_ajaran_id'] ? this.$f7route.params['tahun_ajaran_id'] : 2020
        },
        sekolah: {},
        ruang: {},
        kehadiran_ruang: {
            rows: [],
            total: 0
        },
        tahun_ajaran: {},
        cekHadir: {}
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

    hari = [
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu'
    ]

    componentDidMount = () => {

        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        let hari_ini = ''

        // today = mm + '/' + dd + '/' + yyyy;
        hari_ini = this.hari[moment(today).day()] + ', ' + moment(today).format('D') + ' ' + this.bulan[(moment(today).format('M')-1)] + ' ' + moment(today).format('YYYY') 
        // + ', pukul ' + moment(today).format('H') + ':' + moment(today).format('mm');
        today = yyyy + '-' + mm + '-' + dd

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0],
                today: today,
                hari_ini: hari_ini,
                routeParams: {
                    ...this.state.routeParams,
                    tanggal: today
                }
            },()=>{
                this.props.getRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        ruang: result.payload.rows[0]
                    },()=>{

                        this.props.getKehadiranRuang(this.state.routeParams).then((result)=>{
                            this.setState({
                                kehadiran_ruang: result.payload
                            },()=>{
                                this.props.getTahunAjaran(this.state.routeParams).then((result)=>{
                                    this.setState({
                                        tahun_ajaran: result.payload.rows[0]
                                    })
                                })

                                //setting default view
                                let cekHadir = {};

                                this.state.kehadiran_ruang.rows.map((option)=>{
                                    cekHadir[option.pengguna_id] = {
                                        pengguna_id: option.pengguna_id,
                                        hadir: option.waktu_datang ? '1' : 0,
                                        waktu_datang: option.waktu_datang,
                                        waktu_pulang: option.waktu_pulang,
                                        dirty: 0
                                    }
                                })

                                this.setState({
                                    cekHadir: cekHadir
                                },()=>{
                                    console.log(this.state.cekHadir)
                                })

                            })
                        })

                    })
                })
            })
        })

    }

    // cekHadir = (pengguna_id) => (e) => {
    //     // alert(pengguna_id)
    //     console.log(e.target.value)
    //     // console.log(pengguna_id)
    //     this.setState({
    //         cekHadir: {
    //             ...this.state.cekHadir,
    //             [pengguna_id]: {
    //                 hadir: 'a'
    //             }
    //         }
    //     },()=>{
    //         console.log(this.state.cekHadir)
    //     })
    // }

    changeToggle = (pengguna_id) => (e) => {
        // console.log(e);
        this.setState({
            cekHadir: {
                ...this.state.cekHadir,
                [pengguna_id]: {
                    ...this.state.cekHadir[pengguna_id],
                    hadir: (e ? '0' : 1),
                    waktu_datang: (e ? null : this.state.cekHadir[pengguna_id].waktu_datang),
                    waktu_pulang: (e ? null : this.state.cekHadir[pengguna_id].waktu_pulang),
                    dirty: 1
                }
            }
        },()=>{
            console.log(this.state.cekHadir);
        });
    }

    gantiWaktu = (pengguna_id, tipe) => (e) => {
        // console.log(tipe)
        // console.log(e.currentTarget.value)

        

        this.setState({
            cekHadir: {
                ...this.state.cekHadir,
                [pengguna_id]: {
                    ...this.state.cekHadir[pengguna_id],
                    [tipe]: this.state.today + ' ' + e.currentTarget.value,
                    dirty: 1
                }
            }
        },()=>{
            console.log(this.state.cekHadir)
        })
    }

    simpanKehadiranRuang = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                data: this.state.cekHadir
            }
        },()=>{
            this.props.simpanKehadiranRuang(this.state.routeParams).then((result)=>{

                this.props.getKehadiranRuang(this.state.routeParams).then((result)=>{
                    this.setState({
                        kehadiran_ruang: result.payload
                    },()=>{
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Berhasil Menyimpan Kehadiran!','Berhasil')

                        //setting default view
                        let cekHadir = {};

                        this.state.kehadiran_ruang.rows.map((option)=>{
                            cekHadir[option.pengguna_id] = {
                                pengguna_id: option.pengguna_id,
                                hadir: option.waktu_datang ? '1' : 0,
                                waktu_datang: option.waktu_datang,
                                waktu_pulang: option.waktu_pulang,
                                dirty: 0
                            }
                        })

                        this.setState({
                            cekHadir: cekHadir
                        },()=>{
                            console.log(this.state.cekHadir)
                        })
                    })
                })
            })
        })
    }

    render()
    {
        

        return (
            <Page name="kehadiranRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kehadiran Siswa</NavTitle>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">

                        <Card>
                            <CardContent>
                                <h1 style={{marginTop:'0px', marginBottom:'0px'}}>{this.state.ruang.nama}</h1>
                                <h4 style={{marginTop:'0px', marginBottom:'0px', color:'#636363'}}>{this.state.sekolah.nama}</h4>
                                <Row noGap style={{borderTop:'1px solid #eee', marginTop:'8px', paddingTop:'8px'}}>
                                    <Col width="50" style={{textAlign:'left'}}>
                                        <b>{this.state.tahun_ajaran.nama}</b>
                                    </Col>
                                    <Col width="50" style={{textAlign:'right'}}>
                                        {this.state.hari_ini}
                                        {/* <br/>
                                        <Link>Ganti Tanggal</Link> */}
                                    </Col>
                                </Row>
                                <br/>
                                <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpanKehadiranRuang}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="card-padding-4">
                                <br/>
                                {this.state.kehadiran_ruang.rows.map((option)=>{
                                    return (
                                        <Card className="card-side-0">
                                            <CardContent className="card-padding-8">
                                                <Row>
                                                    <Col width="15" tabletWidth="10">
                                                        <img src={option.gambar} style={{width:'60px', borderRadius:'50%', marginRight:'0px', border:'1px solid #eee', marginBottom:'-8px'}} />
                                                    </Col>
                                                    <Col width="85" tabletWidth="90" style={{paddingLeft:'8px'}}>
                                                        <Row noGap>
                                                            <Col width="100" tabletWidth="40" style={{marginBottom:'8px'}}>
                                                                <b><Link href={"/tampilPengguna/"+option.pengguna_id}>{option.nama}</Link></b>
                                                                <br/>{option.username}
                                                                
                                                                {/* <div className="hilangDiDesktop">
                                                                    <i><Link href={"/tampilRuang/"+option.ruang_id}>{option.nama_ruang}</Link></i>
                                                                </div> */}
                                                            </Col>
                                                            <Col width="100" tabletWidth="60">
                                                                <Card style={{marginTop:'0px', marginBottom:'0px', marginLeft:'0px', marginRight:'0px'}}>
                                                                    <CardContent style={{background:'#eeeeee', borderRadius:'20px'}} className="card-padding-8">
                                                                        <Row noGap>
                                                                            <Col width="30" style={{textAlign:'center', border:'0px solid #ccc'}}>
                                                                                Kehadiran<br/>
                                                                                <Toggle 
                                                                                    checked={this.state.cekHadir[option.pengguna_id] ? (parseInt(this.state.cekHadir[option.pengguna_id].hadir) === 1 ? true : false) : false} 
                                                                                    value={1} 
                                                                                    onToggleChange={this.changeToggle(option.pengguna_id)} 
                                                                                    style={{marginTop:'8px'}}
                                                                                />
                                                                                    
                                                                                {/* <Checkbox name={"checkbox-hadir-"+option.pengguna_id} onChange={this.cekHadir(option.pengguna_id)}></Checkbox> */}
                                                                                {/* <i className="icons f7-icons" style={{color:'green'}}>checkmark_circle_fill</i> */}
                                                                            </Col>
                                                                            <Col width="35" style={{textAlign:'center', border:'0px solid #ccc'}}>
                                                                                Datang<br/>
                                                                                {/* <b>08:00</b> */}
                                                                                <List>
                                                                                    <ListInput
                                                                                        type="time"
                                                                                        // outline
                                                                                        // defaultValue="08:00"
                                                                                        name="waktu_datang"
                                                                                        placeholder="Waktu Datang..."
                                                                                        style={{padding:'0px'}}
                                                                                        onChange={this.gantiWaktu(option.pengguna_id, 'waktu_datang')}
                                                                                        // defaultValue="18:00"
                                                                                        defaultValue={
                                                                                        this.state.cekHadir[option.pengguna_id] ? 
                                                                                        (
                                                                                            this.state.cekHadir[option.pengguna_id].waktu_datang ? 
                                                                                            this.state.cekHadir[option.pengguna_id].waktu_datang.substring(11,16) : null
                                                                                        ) : 
                                                                                        null
                                                                                        }
                                                                                        // style={{
                                                                                        //     paddingLeft:'4px',
                                                                                        //     paddingRight:'4px'
                                                                                        // }}
                                                                                    >
                                                                                    </ListInput>
                                                                                </List>
                                                                            </Col>
                                                                            <Col width="35" style={{textAlign:'center', border:'0px solid #ccc'}}>
                                                                                Pulang<br/>
                                                                                <List>
                                                                                    <ListInput
                                                                                        type="time"
                                                                                        // outline
                                                                                        // defaultValue="17:00"
                                                                                        name="waktu_pulang"
                                                                                        placeholder="Waktu Pulang..."
                                                                                        style={{padding:'0px'}}
                                                                                        onChange={this.gantiWaktu(option.pengguna_id, 'waktu_pulang')}
                                                                                        defaultValue={
                                                                                        this.state.cekHadir[option.pengguna_id] ? 
                                                                                        (
                                                                                            this.state.cekHadir[option.pengguna_id].waktu_pulang ? 
                                                                                            this.state.cekHadir[option.pengguna_id].waktu_pulang.substring(11,16) : null
                                                                                        ) : 
                                                                                        null
                                                                                        }
                                                                                    >
                                                                                    </ListInput>
                                                                                </List>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                        {/* <br/>{option.jabatan_sekolah} */}
                                                    </Col>
                                                    {/* <Col width="100" tabletWidth="50" style={{textAlign:'right'}}> */}
                                                        {/* <Card style={{marginTop:'0px', marginBottom:'0px'}}>
                                                            <CardContent style={{background:'#eeeeee', borderRadius:'20px'}}>

                                                            </CardContent>
                                                        </Card> */}
                                                    {/* </Col> */}
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
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
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah,
      getRuang: actions.getRuang,
      getKehadiranRuang: actions.getKehadiranRuang,
      simpanKehadiranRuang: actions.simpanKehadiranRuang,
      getTahunAjaran: actions.getTahunAjaran
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kehadiranRuang));
  