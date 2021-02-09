import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardHeader, Row, Col, CardContent, CardFooter, Chip, Tabs, Tab, List, ListInput, ListItem, BlockTitle, Segmented, Subnavbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


import moment from 'moment';

class kuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 15
        },
        kuis_diikuti: (localStorage.getItem('user') ? (localStorage.getItem('getKuisDiikuti:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getKuisDiikuti:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} )
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
        // this.$f7.dialog.preloader();

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tampilkan_pertanyaan: 'N'
            }
        },()=>{
            this.props.getKuis(this.state.routeParams).then(()=>{

            });

            this.props.getKuisDiikuti(this.state.routeParams).then(()=>{
                this.setState({
                    loading: false,
                    kuis_diikuti: this.props.kuis_diikuti
                },()=>{
                    localStorage.setItem('getKuisDiikuti:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.state.kuis_diikuti))
                })
            });
        });

    }

    buatKuis = () => {
        this.$f7router.navigate('/tambahKuis/'+JSON.parse(localStorage.getItem('user')).pengguna_id);
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
            this.props.getKuisDiikuti(this.state.routeParams).then(()=>{
                this.setState({
                    loading: false,
                    kuis_diikuti: this.props.kuis_diikuti
                },()=>{
                    this.$f7.dialog.close()
                    localStorage.setItem('getKuisDiikuti:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.state.kuis_diikuti))
                })
            })
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
            this.props.getKuisDiikuti(this.state.routeParams).then(()=>{
                this.setState({
                    loading: false,
                    kuis_diikuti: this.props.kuis_diikuti
                },()=>{
                    this.$f7.dialog.close()
                    localStorage.setItem('getKuisDiikuti:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.state.kuis_diikuti))
                })
            })
        })
    }

    render()
    {
        return (
            // <Page name="kuis" hideBarsOnScroll className="halamanBeranda" style={{paddingBottom:'40px'}}>
            <Page name="kuis" hideBarsOnScroll style={{marginBottom:'40px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kuis</NavTitle>
                    {/* <NavTitleLarge>
                        Kuis
                    </NavTitleLarge> */}
                    <Subnavbar>
                    <Row noGap style={{width:'100%'}}>
                        <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                        <Col width="100" tabletWidth="80" desktopWidth="80">
                            <Segmented raised>
                                <Button style={{color:'#434343', fontWeight:'bold'}} className="color-theme-deeporange" tabLink="#tab-kuis-1" tabLinkActive>Kuis yang Anda Ikuti</Button>
                                <Button style={{color:'#434343', fontWeight:'bold'}} className="color-theme-deeporange"  onClick={()=>this.$f7router.navigate('/KuisFavorit/'+JSON.parse(localStorage.getItem('user')).pengguna_id)}>Kuis Tersimpan</Button>
                            </Segmented>
                        </Col>
                        <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    </Row>
                    </Subnavbar>
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
                                {/* <Block strong style={{marginTop:'0px',marginBottom:'0px'}}>
                                    <Segmented raised>
                                        <Button tabLink="#tab-kuis-1" tabLinkActive>Kuis yang diikuti ({this.props.kuis_diikuti.total ? this.props.kuis_diikuti.total : '0'})</Button>
                                        <Button tabLink="#tab-kuis-2">Kuis Anda ({this.props.kuis.total ? this.props.kuis.total : '0'})</Button>
                                    </Segmented>
                                </Block> */}
                                {/* <Tabs animated>
                                    <Tab id="tab-kuis-1" tabActive> */}
                                        
                                        <Block strong style={{marginTop:'0px', marginBottom:'8px',borderRadius:'0px'}} className="kuisPage">
                                            {/* <Button large fill raised onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                                <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Ikuti Kuis"/>
                                                &nbsp;
                                                Ikuti Kuis
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
                                                                        placeholder="Cari Kuis menggunakan kode/judul ..."
                                                                        clearButton
                                                                        onFocus={()=>this.$f7router.navigate('/gabungKuis/')}
                                                                        // style={{width:'100%',maxWidth:'500px'}}
                                                                    ></ListInput>
                                                                    <ListItem>
                                                                    <Button className="bawahCiriBiru cardBorder-20" large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                                                        Ikuti Kuis
                                                                    </Button>
                                                                    </ListItem>
                                                                </List>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                    <Col width="0" tabletWidth="15"></Col>
                                                </Row>
                                        </Block>
                                        {this.state.loading &&
                                        <Row style={{justifyContent:'flex-start'}} className={"skeleton-text skeleton-effect-blink"}>
                                            <Col width="100" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
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
                                            <Col width="100" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
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
                                            <Col width="100" tabletWidth="33" className={"skeleton-text skeleton-effect-blink"}>
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

                                        <Tabs animated>
                                            <Tab id="tab-kuis-1" tabActive>

                                                {this.state.kuis_diikuti.total < 1  &&
                                                <Card><CardContent>
                                                    <>
                                                    <div style={{marginTop:'16px', textAlign:'center', borderRadius:'10px', border:'3px dashed #cccccc', padding:'16px', background:'white'}}>
                                                        <img src={localStorage.getItem('api_base')+'/assets/berkas/sad-face.png'} style={{width:'100px'}}/><br/>
                                                        <span style={{fontSize:'20px', color:'#cccccc'}}>Terasa hampa ya di sini...</span><br/>
                                                        <span style={{fontSize:'20px', color:'#cccccc'}}>Coba deh ikut salah satu kuis, seru lho :)</span>
                                                    </div>
                                                    </>
                                                    {/* Belum ada kuis yang Anda ikuti */}
                                                </CardContent></Card>
                                                }
                                                {this.state.kuis_diikuti.total > 0  &&
                                                <>
                                                    {/* <BlockTitle style={{color:'white', fontWeight:'bold'}}>Riwayat Kuis yang Kamu ikuti ({this.state.kuis_diikuti.total ? this.state.kuis_diikuti.total : '0'})</BlockTitle> */}
                                                    <BlockTitle style={{fontWeight:'bold'}}>Riwayat Kuis yang Kamu ikuti ({this.state.kuis_diikuti.total ? this.state.kuis_diikuti.total : '0'})</BlockTitle>
                                                    
                                                    <div className="data-table" style={{overflowY:'hidden'}}>
                                                        <div className="data-table-footer" style={{display:'block'}}>
                                                            <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                                <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                                <i className="icon icon-prev color-gray"></i>
                                                                </a>
                                                                <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.kuis_diikuti.total) ? "disabled" : "" )}>
                                                                    <i className="icon icon-next color-gray"></i>
                                                                </a>
                                                                <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.kuis_diikuti.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.kuis_diikuti.total)} dari {this.formatAngka(this.state.kuis_diikuti.total)} kuis</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <Row style={{justifyContent:'flex-start'}}>
                                                    {this.state.kuis_diikuti.rows.map((option)=>{

                                                        let waktu_mengerjakan = '';
                                                        waktu_mengerjakan = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ', pukul ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                                        return (
                                                            <Col width="100" tabletWidth="33" desktopWidth="33">
                                                                <Card className="cardBorder-20">
                                                                    <CardContent 
                                                                        className="cardBorder-20"
                                                                        style={{
                                                                            background:'#37474F',
                                                                            backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                                                            backgroundSize:'cover',
                                                                            height:'70px',
                                                                            borderRadius: '20px 20px 0px 0px'
                                                                        }}
                                                                    >
                                                                        <h2 style={{
                                                                            marginTop:'0px', 
                                                                            background:'rgba(0, 0, 0, 0.6)', 
                                                                            color:'white',
                                                                            padding:'4px',
                                                                            marginBottom:'0px'
                                                                        }}>
                                                                            {option.judul}
                                                                        </h2>
                                                                        <h4 style={{
                                                                            marginTop:'0px', 
                                                                            background:'rgba(0, 0, 0, 0.6)', 
                                                                            color:'white',
                                                                            padding:'4px',
                                                                            fontSize:'10px'
                                                                        }}>
                                                                            Sesi {option.keterangan_sesi_kuis}
                                                                        </h4>
                                                                    </CardContent>
                                                                    <CardContent style={{
                                                                        background:'white', 
                                                                        // background:'rgba(0, 0, 0, 0.6)', 
                                                                        height:'36px',
                                                                        overflow: 'hidden'
                                                                    }}>
                                                                        <Row noGap>
                                                                            <Col width={60}>
                                                                                {/* <p> */}
                                                                                    <div style={{fontSize:'10px', fontStyle:'italic'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div>
                                                                                    {/* <br/> */}
                                                                                    <div style={{fontSize:'10px'}}>
                                                                                        Tanggal {waktu_mengerjakan}
                                                                                    </div>
                                                                                {/* </p> */}
                                                                            </Col>
                                                                            {parseInt(option.jenis_kuis_id) !== 2 &&
                                                                            <Col width={40} style={{textAlign:'right'}}>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    Skor
                                                                                </div>
                                                                                <div style={{fontSize:'30px', fontWeight:'bolder', color:'#434343', marginTop:'-8px'}}>{(option.skor ? parseFloat(option.skor).toFixed(1) : "0")}</div>
                                                                                {/* <div style={{fontSize:'10px'}}>
                                                                                    Peringkat {option.peringkat} dari {option.total_peserta} peserta
                                                                                </div> */}
                                                                            </Col>
                                                                            }
                                                                        </Row>
                                                                    </CardContent>
                                                                    <CardFooter style={{
                                                                        background:'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
                                                                        // background:'rgba(0, 0, 0, 0.8)'
                                                                        borderRadius: '0px 0px 20px 20px',
                                                                        display:'block',
                                                                        padding:'4px',
                                                                        paddingBottom:'8px'
                                                                    }}
                                                                    className="cardBorder-20"
                                                                    >
                                                                        <Row>
                                                                            <Col width={parseInt(option.jenis_kuis_id) === 2 ? 50 : 33} style={{padding:'4px'}}>
                                                                                <Button className="cardBorder-20" onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi)} style={{width:'100%', fontSize:'10px'}}>
                                                                                    Ikuti lagi
                                                                                </Button>
                                                                            </Col>
                                                                            {parseInt(option.jenis_kuis_id) !== 2 &&
                                                                            <Col width="33" style={{padding:'4px'}}>
                                                                                <Button className="cardBorder-20" onClick={()=>this.$f7router.navigate('/peringkatKuis/'+option.sesi_kuis_id)} style={{width:'100%', fontSize:'10px'}}>
                                                                                    Peringkat
                                                                                </Button>
                                                                            </Col>
                                                                            }
                                                                            {/* {parseInt(option.jenis_kuis_id) === 2 && */}
                                                                            <Col width={parseInt(option.jenis_kuis_id) === 2 ? 50 : 33} style={{padding:'4px'}}>
                                                                                <Button className="color-theme-teal cardBorder-20" raised fill onClick={()=>this.$f7router.navigate('/hasilAkhirKuis/'+option.kuis_id+'/'+option.sesi_kuis_id)} style={{width:'100%', fontSize:'10px'}}>
                                                                                    {/* <i className="icons f7-icons" style={{fontSize:'20px'}}>list_number</i>&nbsp; */}
                                                                                    Hasil {parseInt(option.jenis_kuis_id) === 2 ? 'Pengisian' : ''}
                                                                                </Button>
                                                                            </Col>
                                                                            {/* } */}
                                                                        </Row>
                                                                    </CardFooter>
                                                                </Card>
                                                            </Col>
                                                        )
                                                    })}
                                                    </Row>
                                                </>
                                                }
                                                </Tab>
                                                {/* <Tab id="tab-kuis-2">
                                                    <BlockTitle style={{color:'white', fontWeight:'bold'}}>Kuis Favorit (0)</BlockTitle>
                                                </Tab> */}
                                            </Tabs>
                                        </>
                                        }
                                    {/* </Tab>
                                    <Tab id="tab-kuis-10"> */}

                                    {/* </Tab>
                                </Tabs> */}
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
      getKuisDiikuti: Actions.getKuisDiikuti
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        kuis_diikuti: Kuis.kuis_diikuti
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kuis));
  