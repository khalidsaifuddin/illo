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
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 15
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


    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        // this.props.getRuang(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         ruang: this.props.ruang
        //     });
        // });
        
        this.props.getRuangDiikuti(this.state.routeParams).then((result)=>{
            this.setState({
                ruang_diikuti: this.props.ruang_diikuti,
                loading: false
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

    klikNext = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getRuangDiikuti(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang_diikuti: this.props.ruang_diikuti,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        })
    }
    
    klikPrev = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getRuangDiikuti(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang_diikuti: this.props.ruang_diikuti,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        })
    }

    render()
    {
        return (
            <Page name="ruang" hideBarsOnScroll>
            {/* <Page name="ruang" hideBarsOnScroll className="halamanBeranda"> */}
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Ruang</NavTitle>
                    {/* <NavTitleLarge>
                        Ruang
                    </NavTitleLarge> */}
                    {/* <NavRight>
                        <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Ruang Baru" href="/tambahRuang">&nbsp; Ruang Baru</Link>
                    </NavRight> */}
                </Navbar>
                {/* <BlockTitle style={{marginTop:'8px'}}>
                    Pertanyaan yang Anda tanyakan
                </BlockTitle> */}
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
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
                                        <Block strong style={{marginTop:'0px', marginBottom:'8px'}} className="kuisPage">
                                            {/* <Button large fill raised onClick={()=>this.$f7router.navigate('/gabungRuang/')}>
                                                <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Ikuti Ruang"/>
                                                &nbsp;
                                                Ikuti Ruang
                                            </Button> */}
                                            <Row>
                                                <Col width="0" tabletWidth="15"></Col>
                                                <Col width="100" tabletWidth="70">
                                                    <Card>
                                                    <CardContent>
                                                    <List noHairlinesMd>
                                                        <ListInput
                                                            outline
                                                            large
                                                            // label="Cari Kuis"
                                                            floatingLabel
                                                            type="text"
                                                            placeholder="Cari Ruang menggunakan kode/judul ..."
                                                            clearButton
                                                            onFocus={()=>this.$f7router.navigate('/gabungRuang/')}
                                                            // style={{width:'100%',maxWidth:'500px'}}
                                                        ></ListInput>
                                                        <ListItem>
                                                        <Button className="bawahCiriBiru cardBorder-20" large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungRuang/')}>
                                                            Gabung Ruang
                                                        </Button>
                                                        </ListItem>
                                                    </List>
                                                    </CardContent>
                                                    </Card>
                                                </Col>
                                                <Col width="0" tabletWidth="15"></Col>
                                            </Row>
                                        </Block>
                                        <BlockTitle style={{color:'#434343', fontWeight:'bold'}}>Ruang yang Kamu ikuti</BlockTitle>
                                        
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.ruang_diikuti.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.ruang_diikuti.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.ruang_diikuti.total)} dari {this.formatAngka(this.state.ruang_diikuti.total)} ruang</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {this.state.loading &&
                                        <Row style={{justifyContent:'flex-start'}} className={"skeleton-text skeleton-effect-blink"}>
                                            <Col width="50" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
                                                <Card className={"skeleton-text skeleton-effect-blink"}>
                                                    <CardContent 
                                                        style={{
                                                            background:'#CCCCCC',
                                                            backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+')', 
                                                            backgroundSize:'cover',
                                                            height:'100px'
                                                        }}
                                                        className={"skeleton-text skeleton-effect-blink"}
                                                    >
                                                        <h2 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            marginBottom:'0px'
                                                        }}>
                                                            {'option.judul'}
                                                        </h2>
                                                        <h4 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            fontSize:'10px'
                                                        }}>
                                                            Sesi {'option.keterangan_sesi_kuis'}
                                                        </h4>
                                                    </CardContent>
                                                    <CardContent style={{
                                                        background:'white', 
                                                        // background:'#cccccc', 
                                                        height:'50px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Row noGap>
                                                            <Col width={60}>
                                                                {/* <p> */}
                                                                    <div style={{fontSize:'10px', fontStyle:'italic'}}>{'option.keterangan' ? 'option.keterangan' : <>Tidak ada deskripsi</>}</div>
                                                                    {/* <br/> */}
                                                                    <div style={{fontSize:'10px'}}>
                                                                        Tanggal {'waktu_mengerjakan'}
                                                                    </div>
                                                                {/* </p> */}
                                                            </Col>
                                                            <Col width={40} style={{textAlign:'right'}}>
                                                                <div style={{fontSize:'10px'}}>
                                                                    Skor
                                                                </div>
                                                                <div style={{fontSize:'30px', fontWeight:'bold', color:'#434343'}}>{('0')}</div>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                    <CardFooter style={{
                                                        background:'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)'
                                                        // background:'rgba(0, 0, 0, 0.8)'
                                                    }}>
                                                        <Button raised fill disable style={{background:'#cccccc'}}>
                                                            Rincian
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                            <Col width="50" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
                                                <Card className={"skeleton-text skeleton-effect-blink"}>
                                                    <CardContent 
                                                        style={{
                                                            background:'#CCCCCC',
                                                            backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+')', 
                                                            backgroundSize:'cover',
                                                            height:'100px'
                                                        }}
                                                        className={"skeleton-text skeleton-effect-blink"}
                                                    >
                                                        <h2 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            marginBottom:'0px'
                                                        }}>
                                                            {'option.judul'}
                                                        </h2>
                                                        <h4 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            fontSize:'10px'
                                                        }}>
                                                            Sesi {'option.keterangan_sesi_kuis'}
                                                        </h4>
                                                    </CardContent>
                                                    <CardContent style={{
                                                        background:'white', 
                                                        // background:'#cccccc', 
                                                        height:'50px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Row noGap>
                                                            <Col width={60}>
                                                                {/* <p> */}
                                                                    <div style={{fontSize:'10px', fontStyle:'italic'}}>{'option.keterangan' ? 'option.keterangan' : <>Tidak ada deskripsi</>}</div>
                                                                    {/* <br/> */}
                                                                    <div style={{fontSize:'10px'}}>
                                                                        Tanggal {'waktu_mengerjakan'}
                                                                    </div>
                                                                {/* </p> */}
                                                            </Col>
                                                            <Col width={40} style={{textAlign:'right'}}>
                                                                <div style={{fontSize:'10px'}}>
                                                                    Skor
                                                                </div>
                                                                <div style={{fontSize:'30px', fontWeight:'bold', color:'#434343'}}>{('0')}</div>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                    <CardFooter style={{
                                                        background:'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)'
                                                        // background:'rgba(0, 0, 0, 0.8)'
                                                    }}>
                                                        <Button raised fill style={{background:'#cccccc'}}>
                                                            Rincian
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                            <Col width="50" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
                                                <Card className={"skeleton-text skeleton-effect-blink"}>
                                                    <CardContent 
                                                        style={{
                                                            background:'#CCCCCC',
                                                            backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+'option.gambar_kuis'+')', 
                                                            backgroundSize:'cover',
                                                            height:'100px'
                                                        }}
                                                        className={"skeleton-text skeleton-effect-blink"}
                                                    >
                                                        <h2 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            marginBottom:'0px'
                                                        }}>
                                                            {'option.judul'}
                                                        </h2>
                                                        <h4 style={{
                                                            marginTop:'0px', 
                                                            background:'#cccccc', 
                                                            color:'white',
                                                            padding:'4px',
                                                            fontSize:'10px'
                                                        }}>
                                                            Sesi {'option.keterangan_sesi_kuis'}
                                                        </h4>
                                                    </CardContent>
                                                    <CardContent style={{
                                                        background:'white', 
                                                        // background:'#cccccc', 
                                                        height:'50px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Row noGap>
                                                            <Col width={60}>
                                                                {/* <p> */}
                                                                    <div style={{fontSize:'10px', fontStyle:'italic'}}>{'option.keterangan' ? 'option.keterangan' : <>Tidak ada deskripsi</>}</div>
                                                                    {/* <br/> */}
                                                                    <div style={{fontSize:'10px'}}>
                                                                        Tanggal {'waktu_mengerjakan'}
                                                                    </div>
                                                                {/* </p> */}
                                                            </Col>
                                                            <Col width={40} style={{textAlign:'right'}}>
                                                                <div style={{fontSize:'10px'}}>
                                                                    Skor
                                                                </div>
                                                                <div style={{fontSize:'30px', fontWeight:'bold', color:'#434343'}}>{('0')}</div>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                    <CardFooter style={{
                                                        background:'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)'
                                                        // background:'rgba(0, 0, 0, 0.8)'
                                                    }}>
                                                        <Button raised fill style={{background:'#cccccc'}}>
                                                            Rincian
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            </Col>
                                        </Row>
                                        }

                                        {!this.state.loading &&
                                        <>
                                        <Row style={{justifyContent:'flex-start'}} style={{marginBottom:'50px', justifyContent:'end'}}>
                                        {this.state.ruang_diikuti.total < 1 &&
                                            // <Card><CardContent>Belum ada ruang yang Anda ikuti</CardContent></Card>
                                            <Card style={{width:'100%'}}><CardContent>
                                            <>
                                            <div style={{marginTop:'16px', textAlign:'center', borderRadius:'10px', border:'3px dashed #cccccc', padding:'16px', background:'white'}}>
                                                <img src={localStorage.getItem('api_base')+'/assets/berkas/sad-face.png'} style={{width:'100px'}}/><br/>
                                                <span style={{fontSize:'20px', color:'#cccccc'}}>Terasa hampa ya di sini...</span><br/>
                                                <span style={{fontSize:'20px', color:'#cccccc'}}>Coba deh gabung ke salah satu ruang, seru lho :)</span>
                                            </div>
                                            </>
                                            {/* Belum ada kuis yang Anda ikuti */}
                                        </CardContent></Card>
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
                                                <Col width="50" tabletWidth="33" desktopWidth="33">
                                                    <Card className="cardBorder-20">
                                                        <CardHeader style={{height:'120px', backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+'")', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', borderRadius:'20px 20px 0px 0px'}}>  
                                                            <div className="mantab" style={{
                                                                backgroundColor:'rgba(0, 0, 0, 0.6)',
                                                                width:'1000%',
                                                                marginLeft:'-15px',
                                                                marginRight:'-15px',
                                                                paddingLeft:'10px',
                                                                marginBottom:'-70px',
                                                                color:'white',
                                                                paddingBottom:'0px',
                                                                height:'40px',
                                                                paddingTop:'10px'
                                                            }}>
                                                                <Link href={"/tampilRuang/"+option.ruang_id} style={{color:'white'}}>
                                                                    <h3 style={{marginTop:'0px',marginBottom:'0px', fontSize:'15px'}}>
                                                                    {parseInt(option.jenis_ruang_id) === 2 ? <i slot="media" style={{color:'#ffffff', fontSize:'15px'}} tooltip="Ruang Privat" className="f7-icons">lock_fill</i> : <i slot="media" tooltip="Ruang Publik" style={{color:'#ffffff', fontSize:'15px'}} className="f7-icons">globe</i>}
                                                                    &nbsp;{option.nama} 
                                                                    </h3>
                                                                </Link>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div style={{marginTop:'-10px', fontSize:'10px', fontStyle:'italic', height:'30px', overflow:'hidden'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                            <div style={{color:'#636363', fontSize:'12px', height:'30px'}}>
                                                                Sejak {tanggal}<br/>
                                                                Dibuat oleh <b>{option.pengguna}</b>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Link>{option.sesi_kuis ? option.sesi_kuis.total : '0'} Kuis</Link>
                                                            <Link>{option.ruang.total ? option.ruang.total : '0'} Anggota</Link>
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
                                                            <CardHeader style={{height:'100px', backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+'")', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}>  
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
                                                                {/* <Link>{option.pertanyaan ? option.pertanyaan.result : '0'} Diskusi</Link>
                                                                <Link>{option.ruang ? option.ruang.total : '0'} Pengikut</Link> */}
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
  