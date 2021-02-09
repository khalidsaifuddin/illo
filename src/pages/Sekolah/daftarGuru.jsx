import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class daftarGuru extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            jabatan_sekolah_id: 1,
            start: 0,
            limit: 20
        },
        sekolah: {},
        sekolah_pengguna: {
            total: 0,
            rows: []
        },
        popupFilter: false
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
            this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    sekolah_pengguna: this.props.sekolah_pengguna
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        });
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
            this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    sekolah_pengguna: this.props.sekolah_pengguna
                },()=>{
                    this.$f7.dialog.close()
                })
            });
        });
    }

    componentDidMount = () => {

        this.$f7.dialog.preloader()

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0],
                routeParams: {
                    ...this.state.routeParams
                    // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{
                this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        sekolah_pengguna: this.props.sekolah_pengguna
                    },()=>{
                        this.$f7.dialog.close()
                    })
                });
            });
        });

    }

    verifikasi = (pengguna_id, sekolah_id) => {
        // console.log(pengguna_id);
        // console.log(sekolah_id);
        // this.setState({
        //     routeParamsVerifikasi: {
        //         sekolah_id: sekolah_id,
        //         pengguna_id: pengguna_id,
        //         jabatan_sekolah_id: 1,
        //         valid: 1
        //     }
        // },()=>{
        //     this.props.getSekolahPengguna(this.state.routeParamsVerifikasi).then((result)=>{
        //         if(result)
        //     })
        // });
        this.$f7router.navigate('/vervalGuru/'+pengguna_id+'/'+sekolah_id);
    }

    setAdmin = (pengguna_id, sekolah_id, nama) => {
        this.$f7.dialog.confirm('Apakah Anda yakin akan menjadikan '+nama+' sebagai administrator?', 'Konfirmasi',()=>{
            this.$f7.dialog.preloader();
            this.props.simpanAdministrator({pengguna_id: pengguna_id, sekolah_id: sekolah_id, admin: 1}).then((result)=>{
                if(result.payload.sukses === true){
                    //berhasil
                    this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                        this.$f7.dialog.close();
                        this.$f7.dialog.alert('Set Administrator Berhasil','Berhasil');

                        this.setState({
                            sekolah_pengguna: this.props.sekolah_pengguna
                        });
                    });
                }else{
                    //gagal
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!','Peringatan');
                }
            })
        })
    }

    setBatalAdmin = (pengguna_id, sekolah_id, nama) => {
        this.$f7.dialog.confirm('Apakah Anda yakin akan membatalkan '+nama+' sebagai administrator?', 'Konfirmasi',()=>{
            this.$f7.dialog.preloader();
            this.props.simpanAdministrator({pengguna_id: pengguna_id, sekolah_id: sekolah_id, admin:'0'}).then((result)=>{
                if(result.payload.sukses === true){
                    //berhasil
                    this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                        this.$f7.dialog.close();
                        this.$f7.dialog.alert('Batalkan Administrator Berhasil','Berhasil');

                        this.setState({
                            sekolah_pengguna: this.props.sekolah_pengguna
                        });
                    });
                }else{
                    //gagal
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!','Peringatan');
                }
            })
        })
    }

    tampilkanGuruFilter = () => {
        this.$f7.dialog.preloader()
        this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah_pengguna: this.props.sekolah_pengguna,
                popupFilter: !this.state.popupFilter
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    resetFilter = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tahun_ajaran_id: null,
                keyword: null,
                ruang_id: null
            }
        },()=>{

            this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    sekolah_pengguna: this.props.sekolah_pengguna,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }
    
    unduhDaftarGuru = () => {
        // alert('tes')
        window.open(localStorage.getItem('api_base')+'/api/Sekolah/getSekolahPengguna_excel?sekolah_id='+this.$f7route.params['sekolah_id']+'&jabatan_sekolah_id=1&limit=100000&output=excel')
    }

    render()
    {
        return (
            <Page name="daftarGuru" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Guru</NavTitle>
                    <NavRight>
                        <Button style={{marginTop:'-8px'}} className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/tambahGuru/"+this.state.sekolah.sekolah_id)}>
                            <i className="f7-icons icons">plus</i>&nbsp;
                            Tambah Guru
                        </Button>
                        <Button onClick={()=>this.setState({popupFilter:!this.state.popupFilter})}>
                            <i className="icons f7-icons">arrow_right_arrow_left_square</i>&nbsp;
                            Filter
                        </Button>
                    </NavRight>
                </Navbar>
                <Row noGap style={{marginBottom:'40px'}}>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                    <Col tabletWidth="80" desktopWidth="70" width="100">

                        <Card>
                            <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'#434343'}}>
                            {/* <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'white'}} className="halamanBeranda"> */}
                                <Row>
                                    <Col width="70">
                                        <div style={{
                                            height:'60px', 
                                            width:'60px',
                                            backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                            // backgroundImage:'url('+localStorage.getItem('api_base')+this.state.sekolah.gambar_logo+')',
                                            backgroundSize:'cover',
                                            position:'absolute',
                                            marginTop:'0px',
                                            borderRadius: '20px',
                                            border: '1px solid #ccc',
                                            marginBottom:'16px'
                                        }}>
                                            &nbsp;
                                        </div>
                                        <h1 className="namaSekolah" style={{marginLeft:'80px'}}>{this.state.sekolah.nama}</h1>
                                        <h3 className="keteranganSekolah" style={{marginLeft:'80px', marginBottom:'24px'}}>{this.state.sekolah.keterangan}</h3>
                                    </Col>
                                    <Col width="30" style={{textAlign:'right'}}>
                                        <Button style={{display:'inline-flex'}} color="#287a22" onClick={this.unduhDaftarGuru}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_down_circle</i>&nbsp;
                                            Unduh
                                        </Button>

                                    </Col>
                                </Row>

                                <br/>
                            {/* </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'8px'}}> */}
                                <Row>
                                    {/* <Col width="50" tabletWidth="25">
                                        <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/tambahGuru/"+this.state.sekolah.sekolah_id)}>
                                            <i className="f7-icons icons">plus</i>&nbsp;
                                            Tambah Guru
                                        </Button>
                                    </Col> */}
                                    <Col width="100" tabletWidth="100">
                                        {/* <Button className="color-theme-red bawahCiri" raised fill onClick={()=>this.$f7router.navigate("#")}>
                                            Bagikan Kode Sekolah
                                        </Button> */}
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.sekolah_pengguna.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.sekolah_pengguna.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.sekolah_pengguna.total)} dari {this.formatAngka(this.state.sekolah_pengguna.total)} guru</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        {this.state.sekolah_pengguna.rows.map((option)=>{
                            return (
                                <Card key={option.pengguna_id}>
                                    <CardContent>
                                        {/* {option.nama} */}
                                        <Row>
                                            <Col width="15" tabletWidth="15" desktopWidth="10">
                                                <img src={option.gambar} style={{height:'60px', width:'60px', borderRadius:'50%', marginRight:'0px'}} />
                                            </Col>
                                            <Col width="65" tabletWidth="55" desktopWidth="60">
                                                <b><Link href={"/tampilPengguna/"+option.pengguna_id}>{option.nama}</Link></b>
                                                <br/>{option.username}
                                                <br/>{option.jabatan_sekolah} {parseInt(option.administrator) ===  1 && <>- <b>Administrator</b></>}
                                                <div className="hilangDiDesktop">
                                                    <Button onClick={()=>this.verifikasi(option.pengguna_id, option.sekolah_id)} raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.valid) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                        {parseInt(option.valid) === 1 ? 'Terverifikasi' : 'Perlu Verifikasi'}
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}} className="hilangDiMobile">
                                                <Button onClick={()=>this.verifikasi(option.pengguna_id, option.sekolah_id)} raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.valid) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                    {parseInt(option.valid) === 1 ? 'Terverifikasi' : 'Perlu Verifikasi'}
                                                </Button>
                                            </Col>
                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{textAlign:'right'}}>
                                                <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                <Popover className={"popover-menu-"+option.pengguna_id} style={{minWidth:'300px'}}>
                                                    <List>
                                                        {parseInt(option.administrator) !==  1 && 
                                                        <ListItem onClick={()=>this.setAdmin(option.pengguna_id,option.sekolah_id, option.nama)} link="#" popoverClose title="Set sebagai Administrator" />
                                                        }
                                                        {parseInt(option.administrator) ===  1 && 
                                                        <ListItem onClick={()=>this.setBatalAdmin(option.pengguna_id,option.sekolah_id, option.nama)} link="#" popoverClose title="Batalkan sebagai Administrator" />
                                                        }
                                                        <ListItem onClick={()=>this.$f7router.navigate('/profilGuru/'+option.pengguna_id+'/'+option.sekolah_id)} link="#" popoverClose title="Profil" />
                                                        <ListItem onClick={()=>this.verifikasi(option.pengguna_id, option.sekolah_id)} link="#" popoverClose title="Verifikasi" />
                                                        {/* <ListItem onClick={()=>this.$f7router.navigate('/pengaturanPengguna/'+option.pengguna_id+'/'+option.sekolah_id)} link="#" popoverClose title="Pengaturan" /> */}
                                                        {/* <ListItem link="#" popoverClose title="Tabs" /> */}
                                                    </List>
                                                </Popover>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Col>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                </Row>
                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Daftar Guru">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    // expandable
                                    placeholder="Nama Guru"
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    onChange={this.cariKeyword}
                                ></Searchbar>
                            </List>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button raised onClick={this.resetFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                        Reset Filter
                                    </Button>
                                </Col>
                                <Col width="50">
                                    <Button raised fill onClick={this.tampilkanGuruFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Guru
                                    </Button>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah,
      getSekolahPengguna: actions.getSekolahPengguna,
      simpanAdministrator: actions.simpanAdministrator
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarGuru));
  