import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Link, Icon, Button, Card, CardHeader, Row, Col, CardContent, CardFooter, Chip, Tabs, Tab, List, ListItem, BlockTitle, Popover, NavRight, Segmented, Block
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


import moment from 'moment';

class kuisAnda extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        }, 
        kuis: {
            rows: [],
            total: 0
        },
        sesi_kuis_pengguna: {
            rows: [],
            total: 0
        },
        kolaborasi_kuis: {
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
        this.$f7.dialog.preloader('Memuat Kuis...');
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tampilkan_pertanyaan: 'N'
            }
        },()=>{
            this.props.getKuis(this.state.routeParams).then(()=>{
                this.$f7.dialog.close();
                this.setState({
                    kuis: this.props.kuis
                })
            });
            
            this.props.getSesiKuisPengguna(this.state.routeParams).then(()=>{
                this.$f7.dialog.close();

                if(this.props.sesi_kuis_pengguna.total > 0){

                    this.setState({
                        sesi_kuis_pengguna: this.props.sesi_kuis_pengguna
                    })

                }
            });

            this.props.getKolaborasiKuis(this.state.routeParams).then(()=>{
                if(this.props.kolaborasi_kuis.total > 0){

                    this.setState({
                        kolaborasi_kuis: this.props.kolaborasi_kuis
                    })

                }
            });

            // this.props.getKuisDiikuti(this.state.routeParams).then((result)=>{

            // });
        });

    }

    buatKuis = () => {
        this.$f7router.navigate('/tambahKuis/'+JSON.parse(localStorage.getItem('user')).pengguna_id);
    }

    render()
    {
        return (
            // <Page name="kuisAnda" hideBarsOnScroll className="halamanBeranda">
            <Page name="kuisAnda" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kuis Anda</NavTitle>
                    {/* <NavTitleLarge>
                        Kuis Anda
                    </NavTitleLarge> */}
                    <NavRight>
                        <Button fill raised style={{width:'100%'}} onClick={this.buatKuis}>
                            {/* <i className="icon f7-icons" style={{fontSize:'25px'}}>plus</i> */}
                            <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                            Buat Kuis Baru
                        </Button>
                    </NavRight>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        <Row noGap>
                            <Col width="100">

                                {/* <Toolbar tabbar>
                                    <Link tabLink="#tab-kuis-1" tabLinkActive>Kuis Anda ({this.props.kuis.total})</Link>
                                    <Link tabLink="#tab-kuis-2">Kuis yang diikuti (0)</Link>
                                </Toolbar> */}
                                <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    <Segmented raised>
                                        <Button className="color-theme-deeporange" tabLink="#tab-kuis-1" tabLinkActive>Kuis Anda</Button>
                                        <Button className="color-theme-deeporange" tabLink="#tab-kuis-2">Sesi Kuis Anda</Button>
                                        <Button className="color-theme-deeporange" tabLink="#tab-kuis-3">Kuis Kolaborasi</Button>
                                    </Segmented>
                                </Block>
                                <Tabs animated>
                                    <Tab id="tab-kuis-1" tabActive>
                                        
                                        {/* <Block strong style={{marginTop:'0px', marginBottom:'8px'}}>
                                                <Row>
                                                    <Col width="0" tabletWidth="15"></Col>
                                                    <Col width="100" tabletWidth="70">
                                                        <Card>
                                                        <CardContent>
                                                            <Button large fill raised style={{width:'100%'}} onClick={this.buatKuis}>
                                                                <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                                                                Buat Kuis
                                                            </Button>
                                                        </CardContent>
                                                        </Card>
                                                    </Col>
                                                    <Col width="0" tabletWidth="15"></Col>
                                                </Row>
                                        </Block> */}
                                        {this.state.kuis.total < 1 &&
                                        <Card><CardContent>Belum ada kuis yang Anda buat :(</CardContent></Card>
                                        }
                                        {this.state.kuis.total > 0 &&
                                        <>
                                        <BlockTitle style={{color:'#434343', fontWeight:'bold'}}>Kuis yang Anda buat ({this.state.kuis ? this.state.kuis.total : '0'})</BlockTitle>
                                        <Row style={{justifyContent:'flex-start', paddingBottom:'16px'}}>
                                        {this.state.kuis.rows.map((option)=>{

                                            let tanggal = '';
                                            tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                            return (
                                                <Col width="100" tabletWidth="33" desktopWidth="33">
                                                    <Card>
                                                    {/* <Card style={{borderBottom:'4px solid #4dd0e1'}}> */}
                                                        <CardHeader style={{
                                                            height:'100px', 
                                                            backgroundImage:'url("'+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            backgroundSize:'cover', 
                                                            backgroundPosition:'center', 
                                                            backgroundRepeat:'no-repeat',
                                                            borderRadius:'20px 20px 0px 0px'
                                                        }}>
                                                            {/* <Link href={""}>
                                                                <b style={{fontSize:'23px'}}>{option.judul}</b>
                                                            </Link> */}
                                                            <div className="mantab" style={{
                                                                backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                width:'1000%',
                                                                marginLeft:'-15px',
                                                                marginRight:'-15px',
                                                                paddingLeft:'10px',
                                                                overflow:'hidden',
                                                                // marginBottom:'-50px',
                                                                color:'white',
                                                                paddingBottom:'0px',
                                                                minHeight:'40px',
                                                                paddingTop:'10px'
                                                            }}>
                                                                <Link href={"/tampilKuis/"+option.kuis_id} style={{color:'white'}}>
                                                                    <h3 style={{marginTop:'0px',marginBottom:'0px', fontSize:'15px'}}>
                                                                        {option.judul}
                                                                    </h3>
                                                                </Link>
                                                            </div>
                                                        </CardHeader>
                                                        <CardHeader style={{fontSize:'15px', minHeight:'75px', paddingTop:'4px', paddingBottom: '4px', display:'flow-root'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col width="75">
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dibuat tanggal <b>{tanggal}</b></span><br/>
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.jenjang} {option.tingkat_pendidikan} {parseInt(option.tingkat_pendidikan_id) === 99 ? 'Semua Tingkat Kelas' : ''}</b>
                                                                    <b style={{fontSize:'10px'}}>{option.mata_pelajaran ? <> - {option.mata_pelajaran}</> : ''}</b><br/>
                                                                </Col>
                                                                <Col width="25" style={{textAlign:'right'}}>
                                                                    <div style={{width:'100%', textAlign:'right'}}>
                                                                        {option.publikasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Rilis" color="green" style={{color:'black'}}/>
                                                                        }
                                                                        {option.publikasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Draft" />
                                                                        }
                                                                        {option.status_privasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Publik" color="teal " style={{color:'white', marginLeft:'4px'}}/>
                                                                        }
                                                                        {option.status_privasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Privat" style={{marginLeft:'4px'}} />
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </CardHeader>
                                                        {/* <CardContent style={{paddingTop:'8px', height:'50px'}}>
                                                            <div style={{marginTop:'10px', maxHeight:'200px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                                <Row noGap>
                                                                    <Col width="100" style={{paddingTop:'0px', paddingBottom:'4px'}}>
                                                                        <b>{option.jenjang} {option.tingkat_pendidikan}</b> - <b>{option.mata_pelajaran}</b><br/>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </CardContent> */}
                                                        <CardFooter>
                                                            {/* <Button raised fill onClick={()=>this.$f7router.navigate('/kodeKuis/'+option.kuis_id)} style={{background:'#bf360c'}}>
                                                                <Icon ios={"f7:qrcode"} aurora={"f7:qrcode"} md={"material:qrcode"} tooltip="Tampilkan Kode Kuis"/>&nbsp;
                                                                Kode Kuis
                                                            </Button>
                                                            <Button raised fill onClick={()=>this.$f7router.navigate('/peringkatKuis/'+option.kuis_id)}>
                                                                <Icon ios={"f7:stopwatch"} aurora={"f7:stopwatch"} md={"material:stopwatch"} tooltip="Edit Kuis"/>&nbsp;
                                                                Peringkat
                                                            </Button> */}
                                                            {/* <Button disabled={(parseInt(option.publikasi) === 1 ? true : false)} raised fill onClick={()=>this.$f7router.navigate('/tambahKuis/'+option.pengguna_id+'/'+option.kuis_id)} style={{background:'#2e7d32'}}> */}
                                                            {/* <Button raised fill onClick={()=>this.$f7router.navigate('/tambahKuis/'+option.pengguna_id+'/'+option.kuis_id)} style={{background:'#2e7d32'}}>
                                                                <Icon ios={"f7:pencil_circle"} aurora={"f7:pencil_circle"} md={"material:pencil_circle"} tooltip="Edit Kuis"/>&nbsp;
                                                                Edit
                                                            </Button> */}
                                                            <Button disabled={(parseInt(option.publikasi) === 1 ? false : true)} raised fill onClick={()=>this.$f7router.navigate('/buatSesiKuis/'+option.kuis_id)} style={{background:'#1976D2'}}>
                                                                <Icon ios={"f7:pencil_circle"} aurora={"f7:pencil_circle"} md={"material:pencil_circle"} style={{fontSize:'20px'}} tooltip="Edit Kuis"/>&nbsp;
                                                                <span style={{fontSize:'12px'}}>Buat Sesi</span>
                                                            </Button>
                                                            <Button disabled={(parseInt(option.publikasi) === 1 ? false : true)} raised fill onClick={()=>this.$f7router.navigate('/kolaborasiKuis/'+option.kuis_id)} className="color-theme-teal" style={{marginLeft:'4px'}}>
                                                                <Icon ios={"f7:person_3_fill"} aurora={"f7:person_3_fill"} md={"material:person_3_fill"} style={{fontSize:'20px'}} tooltip="Kolaborasi Kuis"/>&nbsp;
                                                                <span style={{fontSize:'12px'}}>Kolaborasi</span>
                                                            </Button>
                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.kuis_id}>
                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                            </Button>
                                                        </CardFooter>
                                                        <Popover className={"popover-menu-"+option.kuis_id}>
                                                            <List>
                                                                <ListItem link={'/tambahKuis/'+option.pengguna_id+'/'+option.kuis_id} popoverClose title="Edit" />
                                                                <ListItem link={'/RiwayatSesiKuis/'+option.kuis_id} popoverClose title="Riwayat Sesi" />
                                                                {/* <ListItem link={'/kolaborasiKuis/'+option.kuis_id} popoverClose title="Kolaborasi" /> */}
                                                                {/* <ListItem link="#" popoverClose title="Tabs" />
                                                                <ListItem link="#" popoverClose title="Side Panels" />
                                                                <ListItem link="#" popoverClose title="List View" />
                                                                <ListItem link="#" popoverClose title="Form Inputs" /> */}
                                                            </List>
                                                        </Popover>
                                                        {/* <CardFooter style={{padding:'4px', minHeight:'0px', paddingRight:'16px'}}>
                                                            {parseInt(option.publikasi) === 1 &&
                                                            <span style={{textAlign:'right', width:'100%', fontSize:'10px', fontStyle:'italic'}}>Kuis yang sudah dirilis tidak bisa diedit</span>
                                                            }
                                                        </CardFooter> */}
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                        </Row>
                                        </>
                                        }
                                        
                                    </Tab>
                                    <Tab id="tab-kuis-2">
                                        <BlockTitle style={{color:'#434343', fontWeight:'bold'}}>Sesi Kuis yang Anda buat ({this.state.sesi_kuis_pengguna.total > 0 ? this.state.sesi_kuis_pengguna.total : '0'})</BlockTitle>
                                        <Row style={{justifyContent:'flex-start', paddingBottom:'16px'}}>
                                        {this.state.sesi_kuis_pengguna.rows.map((option)=>{

                                            let tanggal = '';
                                            tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                            
                                            return (
                                                <Col width="100" tabletWidth="33" desktopWidth="33">
                                                    <Card>
                                                        <CardHeader style={{
                                                            height:'100px', 
                                                            backgroundImage:'url("'+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            backgroundSize:'cover', 
                                                            backgroundPosition:'center', 
                                                            backgroundRepeat:'no-repeat',
                                                            borderRadius:'20px 20px 0px 0px'
                                                        }}>
                                                            <div className="mantab" style={{
                                                                backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                width:'1000%',
                                                                marginLeft:'-15px',
                                                                marginRight:'-15px',
                                                                paddingLeft:'10px',
                                                                overflow:'hidden',
                                                                color:'white',
                                                                paddingBottom:'0px',
                                                                minHeight:'40px',
                                                                paddingTop:'10px'
                                                            }}>
                                                                <Link href={"/tampilKuis/"+option.kuis_id} style={{color:'white'}}>
                                                                    <h3 style={{marginTop:'0px',marginBottom:'0px', fontSize:'15px'}}>
                                                                        {option.judul} (oleh {option.pembuat_kuis})
                                                                    </h3>
                                                                </Link>
                                                            </div>
                                                        </CardHeader>
                                                        <CardHeader style={{fontSize:'15px', minHeight:'75px', paddingTop:'4px', paddingBottom: '4px', display:'flow-root'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col width="75">
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>{option.keterangan}</span><br/>
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dibuat tanggal <b>{tanggal}</b></span><br/>
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.jenjang} {option.tingkat_pendidikan}{parseInt(option.tingkat_pendidikan_id) === 99 ? 'Semua Tingkat Kelas' : ''}</b>
                                                                    <b style={{fontSize:'10px'}}>{option.mata_pelajaran ? <> - {option.mata_pelajaran}</> : ''}</b><br/>
                                                                </Col>
                                                                <Col width="25" style={{textAlign:'right'}}>
                                                                    <div style={{width:'100%', textAlign:'right'}}>
                                                                        {option.publikasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Rilis" color="green" style={{color:'black'}}/>
                                                                        }
                                                                        {option.publikasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Draft" />
                                                                        }
                                                                        {option.status_privasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Publik" color="teal " style={{color:'white', marginLeft:'4px'}}/>
                                                                        }
                                                                        {option.status_privasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Privat" style={{marginLeft:'4px'}} />
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </CardHeader>
                                                        <CardFooter>
                                                            <Button disabled={(parseInt(option.publikasi) === 1 ? false : true)} raised fill onClick={()=>this.$f7router.navigate('/peringkatKuis/'+option.sesi_kuis_id)} style={{background:'#1976D2'}}>
                                                                <Icon ios={"f7:list_number"} aurora={"f7:list_number"} md={"material:list_number"} tooltip="Peringkat"/>&nbsp;
                                                                Peringkat
                                                            </Button>
                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.kuis_id}>
                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                            </Button>
                                                        </CardFooter>
                                                        <Popover className={"popover-menu-"+option.kuis_id}>
                                                            <List>
                                                                <ListItem onClick={()=>this.hapusSesiKuis(option.sesi_kuis_id)} style={{cursor:'pointer'}} popoverClose title="Hapus Sesi" />
                                                                <ListItem link={'/statistikKuis/'+option.sesi_kuis_id} popoverClose title="Statistik" />
                                                                {/* <ListItem link={'/peringkatKuis/'+option.sesi_kuis_id} popoverClose title="Peringkat" /> */}
                                                            </List>
                                                        </Popover>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                        </Row>
                                    </Tab>
                                    
                                    <Tab id="tab-kuis-3">
                                        <BlockTitle style={{color:'#434343', fontWeight:'bold'}}>Kuis Kolaborasi ({this.state.kolaborasi_kuis.total > 0 ? this.state.kolaborasi_kuis.total : '0'})</BlockTitle>
                                        <Row style={{justifyContent:'flex-start', paddingBottom:'16px'}}>
                                        {this.state.kolaborasi_kuis.rows.map((option)=>{

                                            let tanggal = '';
                                            let tanggal_kolab = '';
                                            tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                            tanggal_kolab = moment(option.tanggal_kolab).format('D') + ' ' + this.bulan[(moment(option.tanggal_kolab).format('M')-1)] + ' ' + moment(option.tanggal_kolab).format('YYYY');

                                            return (
                                                <Col width="100" tabletWidth="33" desktopWidth="33">
                                                    <Card>
                                                    {/* <Card style={{borderBottom:'4px solid #4dd0e1'}}> */}
                                                        <CardHeader style={{
                                                            height:'100px', 
                                                            backgroundImage:'url("'+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                            backgroundSize:'cover', 
                                                            backgroundPosition:'center', 
                                                            backgroundRepeat:'no-repeat',
                                                            borderRadius:'20px 20px 0px 0px'
                                                        }}>
                                                            <div className="mantab" style={{
                                                                backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                width:'1000%',
                                                                marginLeft:'-15px',
                                                                marginRight:'-15px',
                                                                paddingLeft:'10px',
                                                                overflow:'hidden',
                                                                // marginBottom:'-50px',
                                                                color:'white',
                                                                paddingBottom:'0px',
                                                                minHeight:'40px',
                                                                paddingTop:'10px'
                                                            }}>
                                                                <Link href={"/tampilKuis/"+option.kuis_id} style={{color:'white'}}>
                                                                    <h3 style={{marginTop:'0px',marginBottom:'0px', fontSize:'15px'}}>
                                                                        {option.judul} (oleh {option.pembuat_kuis})
                                                                    </h3>
                                                                </Link>
                                                            </div>
                                                        </CardHeader>
                                                        <CardHeader style={{fontSize:'15px', minHeight:'75px', paddingTop:'4px', paddingBottom: '4px', display:'flow-root'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col width="75">
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Dibuat tanggal <b>{tanggal}</b></span><br/>
                                                                    <span style={{fontSize:'10px', color: '#8c8c8c'}}>Ditambah sebagai kolaborator tanggal <b>{tanggal_kolab}</b></span><br/>
                                                                    <b style={{fontSize:'10px'}}>{option.jenjang} {option.tingkat_pendidikan} {parseInt(option.tingkat_pendidikan_id) === 99 ? 'Semua Tingkat Kelas' : ''}</b>
                                                                    <b style={{fontSize:'10px'}}>{option.mata_pelajaran ? <> - {option.mata_pelajaran}</> : ''}</b><br/>
                                                                </Col>
                                                                <Col width="25" style={{textAlign:'right'}}>
                                                                    <div style={{width:'100%', textAlign:'right'}}>
                                                                        {option.publikasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Rilis" color="green" style={{color:'black'}}/>
                                                                        }
                                                                        {option.publikasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Draft" />
                                                                        }
                                                                        {option.status_privasi === 1  &&
                                                                        // <span>Rilis</span>
                                                                        <Chip text="Publik" color="teal " style={{color:'white', marginLeft:'4px'}}/>
                                                                        }
                                                                        {option.status_privasi !== 1  &&
                                                                        // <span>Draft</span>
                                                                        <Chip text="Privat" style={{marginLeft:'4px'}} />
                                                                        }
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </CardHeader>
                                                        <CardFooter>
                                                            <Button disabled={(parseInt(option.publikasi) === 1 ? false : true)} raised fill onClick={()=>this.$f7router.navigate('/buatSesiKuis/'+option.kuis_id+'/'+JSON.parse(localStorage.getItem('user')).pengguna_id)} style={{background:'#1976D2'}}>
                                                                <Icon ios={"f7:pencil_circle"} aurora={"f7:pencil_circle"} md={"material:pencil_circle"} tooltip="Buat Sesi"/>
                                                                Buat Sesi
                                                            </Button>
                                                            {/* <Button disabled={(parseInt(option.publikasi) === 1 ? false : true)} raised fill onClick={()=>this.$f7router.navigate('/kolaborasiKuis/'+option.kuis_id)} className="color-theme-teal">
                                                                <Icon ios={"f7:person_3_fill"} aurora={"f7:person_3_fill"} md={"material:person_3_fill"} tooltip="Kolaborasi Kuis"/>&nbsp;
                                                                Kolaborasi
                                                            </Button> */}
                                                            <Button style={{paddingRight:'0px'}} popoverOpen={".popover-menu-"+option.kuis_id}>
                                                                <Icon ios={"f7:ellipsis_vertical"} aurora={"f7:ellipsis_vertical"} md={"material:ellipsis_vertical"} tooltip="Menu"/>
                                                            </Button>
                                                        </CardFooter>
                                                        <Popover className={"popover-menu-"+option.kuis_id}>
                                                            <List>
                                                                <ListItem link={'/tambahKuis/'+option.pengguna_id_kuis+'/'+option.kuis_id} popoverClose title="Edit" />
                                                                <ListItem link={'/RiwayatSesiKuis/'+option.kuis_id} popoverClose title="Riwayat Sesi" />
                                                            </List>
                                                        </Popover>
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
      getKuis: Actions.getKuis,
      getKuisDiikuti: Actions.getKuisDiikuti,
      getSesiKuisPengguna: Actions.getSesiKuisPengguna,
      getKolaborasiKuis: Actions.getKolaborasiKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        kuis_diikuti: Kuis.kuis_diikuti,
        sesi_kuis_pengguna: Kuis.sesi_kuis_pengguna,
        kolaborasi_kuis: Kuis.kolaborasi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kuisAnda));
  