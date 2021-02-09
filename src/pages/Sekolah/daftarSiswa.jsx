import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class daftarSiswa extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            jabatan_sekolah_id: 2,
            start: 0,
            limit: 20
        },
        sekolah: {
            gambar_logo: '/1.jpg'
        },
        siswa_sekolah: {
            total: 0,
            rows: []
        },
        ta_aktif: 2020,
        tahun_ajaran: {
            rows: [],
            total: 0
        },
        popupFilter: false,
        ruang_sekolah: {
            rows: [],
            total: 0
        },
        menuRuang: false
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
                    siswa_sekolah: result.payload
                },()=>{

                    this.$f7.dialog.close()

                })
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
                    siswa_sekolah: result.payload
                },()=>{

                    this.$f7.dialog.close()

                })
            });
        });
    }

    componentDidMount = () => {

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
                        siswa_sekolah: result.payload
                    },()=>{

                        this.props.getTahunAjaran(this.state.routeParams).then((result)=>{
                            let ta_aktif = 2020;
    
                            for (let index = 0; index < result.payload.rows.length; index++) {
                                const element = result.payload.rows[index];
    
                                if(parseInt(element.aktif) === 1){
                                    ta_aktif = element.tahun_ajaran_id
                                }
                                
                            }


                            this.setState({
                                tahun_ajaran: result.payload,
                                ta_aktif: ta_aktif
                            },()=>{
                                this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                                    this.setState({
                                        ruang_sekolah: result.payload
                                    })
                                })
                            })
                        })
                    })
                });

                // this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                //     this.setState({
                //         siswa_sekolah: result.payload
                //     },()=>{

                //         this.props.getTahunAjaran(this.state.routeParams).then((result)=>{
                //             let ta_aktif = 2020;
    
                //             for (let index = 0; index < result.payload.rows.length; index++) {
                //                 const element = result.payload.rows[index];
    
                //                 if(parseInt(element.aktif) === 1){
                //                     ta_aktif = element.tahun_ajaran_id
                //                 }
                                
                //             }


                //             this.setState({
                //                 tahun_ajaran: result.payload,
                //                 ta_aktif: ta_aktif
                //             },()=>{
                //                 this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                //                     this.setState({
                //                         ruang_sekolah: result.payload
                //                     })
                //                 })
                //             })
                //         })
                //     })
                // });
            });
        });

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

    gantiTa = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tahun_ajaran_id: parseInt(e.currentTarget.value) !== 99 ? e.currentTarget.value : null
            }
        },()=>{
            console.log(this.state.routeParams)
        })
    }

    gantiRuang = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                ruang_id: parseInt(e.currentTarget.value) !== 99 ? e.currentTarget.value : null
            }
        },()=>{
            console.log(this.state.routeParams)
        })
    }

    tampilkanSiswaFilter = () => {
        this.$f7.dialog.preloader()
        this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                siswa_sekolah: result.payload,
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
                    siswa_sekolah: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    tutupMenu = () => {
        this.setState({
            menuRuang: !this.state.menuRuang
        })
    }

    bukaMenu = (pengguna_id, nama_pengguna, tahun_ajaran_id) => {
        this.setState({
            nama_pengguna_terpilih: nama_pengguna,
            pengguna_terpilih: pengguna_id,
            ta_terpilih: tahun_ajaran_id,
            menuRuang: !this.state.menuRuang
        })
    }

    bukaMenuDesktop = (pengguna_id, nama_pengguna, tahun_ajaran_id) => {
        this.setState({
            nama_pengguna_terpilih: nama_pengguna,
            pengguna_terpilih: pengguna_id,
            ta_terpilih: tahun_ajaran_id
        })
    }

    tampilPenggunaRuang = (tipe, pengguna_id, sekolah_id) => {
        this.$f7router.navigate('/'+(tipe==='profil'?'profilSiswa':'kehadiranSiswa')+'/'+pengguna_id+'/'+sekolah_id)
    }

    render()
    {
        return (
            <Page name="daftarSiswa" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Siswa</NavTitle>
                    <NavRight>
                        <Button onClick={()=>this.setState({popupFilter:!this.state.popupFilter})}>
                            <i className="icons f7-icons">arrow_right_arrow_left_square</i>&nbsp;
                            Filter
                        </Button>
                    </NavRight>
                </Navbar>

                <Actions ref="actionsOneGroup" opened={this.state.menuRuang} onActionsClose={this.tutupMenu}>
                    <ActionsGroup>
                        <ActionsLabel>{this.state.nama_pengguna_terpilih}</ActionsLabel>
                        <ActionsButton onClick={()=>this.tampilPenggunaRuang('profil', this.state.pengguna_terpilih, this.$f7route.params['sekolah_id'])}>Profil Siswa</ActionsButton>
                        <ActionsButton onClick={()=>this.tampilPenggunaRuang('kehadiran', this.state.pengguna_terpilih, this.$f7route.params['sekolah_id'])}>Kehadiran</ActionsButton>
                        <ActionsButton color="red">Batal</ActionsButton>
                    </ActionsGroup>
                </Actions>

                <Row style={{marginBottom:'40px'}}>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                    <Col tabletWidth="80" desktopWidth="70" width="100">

                        <Card>
                            <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'#434343'}}>
                            {/* <CardContent style={{padding:'8px', marginTop:'8px', borderRadius:'20px', color:'white'}} className="halamanBeranda"> */}
                                <div style={{
                                    height:'60px', 
                                    width:'60px',
                                    backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                    // backgroundImage:'url('+localStorage.getItem('api_base')+this.state.sekolah.gambar_logo+')',
                                    backgroundSize:'cover',
                                    position:'absolute',
                                    marginTop:'0px',
                                    borderRadius: '20px',
                                    border: '1px solid #ccc'
                                }}>
                                    &nbsp;
                                </div>
                                <h1 className="namaSekolah" style={{marginLeft:'80px'}}>{this.state.sekolah.nama}</h1>
                                <h3 className="keteranganSekolah" style={{marginLeft:'80px', marginBottom:'24px'}}>{this.state.sekolah.keterangan}</h3>
                                
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i class="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.siswa_sekolah.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.siswa_sekolah.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.siswa_sekolah.total)} dari {this.formatAngka(this.state.siswa_sekolah.total)} siswa</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="10" style={{textAlign:'center'}}>
                                        <i className="icons f7-icons" style={{fontSize:'40px', color:'#434343'}}>info_circle</i>
                                    </Col>
                                    <Col width="90" style={{color:'#434343'}}>
                                        Daftar siswa yang ada di bawah ini adalah siswa yang telah menjadi anggota dari Ruang yang telah ditambahkan ke Sekolah. Untuk melihat dan mengelola ruang, klik di <Link href={"/daftarRuang/"+this.$f7route.params['sekolah_id']}>sini</Link>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'4px'}}>
                                
                                <Card strong style={{borderRadius:'0px'}}>
                                    {/* <List>
                                        <ListInput
                                            type="select"
                                            defaultValue={this.state.ta_aktif}
                                        >
                                            {this.state.tahun_ajaran.rows.map((option)=>{
                                                return (
                                                    <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                                    )
                                            })}
                                        </ListInput>
                                    </List> */}
                                </Card>

                                {this.state.siswa_sekolah.rows.map((option)=>{
                                    return (
                                        <Card>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="15" tabletWidth="10">
                                                        <img src={option.gambar} style={{width:'60px', borderRadius:'50%', marginRight:'0px', border:'1px solid #eee', marginBottom:'-8px'}} />
                                                    </Col>
                                                    <Col width="45" tabletWidth="50" style={{paddingLeft:'8px'}}>
                                                        <b><Link href={"/tampilPengguna/"+option.pengguna_id}>{option.nama}</Link></b>
                                                        <br/>{option.username}
                                                        <div className="hilangDiDesktop">
                                                            {option.ruang_id &&
                                                            <i><Link href={"/tampilRuang/"+option.ruang_id}>{option.nama_ruang}</Link></i>
                                                            }
                                                            {!option.ruang_id &&
                                                            <>Belum masuk ruang</>
                                                            }
                                                        </div>
                                                        {/* <br/>{option.jabatan_sekolah} */}
                                                    </Col>
                                                    <Col width="30" tabletWidth="40" style={{textAlign:'right', paddingRight:'40px'}}>
                                                        <div className="hilangDiMobile">
                                                            {option.ruang_id &&
                                                            <i><Link href={"/tampilRuang/"+option.ruang_id}>{option.nama_ruang}</Link></i>
                                                            }
                                                            {!option.ruang_id &&
                                                            <>Belum masuk ruang</>
                                                            }
                                                        </div>
                                                        {/* <Button onClick={()=>this.verifikasi(option.pengguna_id, option.sekolah_id)} raised fill small style={{fontSize:'10px', height:'20px'}} className={(parseInt(option.valid) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                            {parseInt(option.valid) === 1 ? 'Terverifikasi' : 'Perlu Verifikasi'}
                                                        </Button> */}
                                                    </Col>
                                                </Row>
                                                <div className="hilangDiMobile">
                                                    <Button className="vertButton" popoverOpen={".popover-menu-"+option.pengguna_id} onClick={()=>this.bukaMenuDesktop(option.pengguna_id, option.nama, option.tahun_ajaran_id)}>
                                                        <i className="icons f7-icons">ellipsis_vertical</i>
                                                    </Button>
                                                </div>
                                                <div className="hilangDiDesktop">
                                                    <Button className="vertButton" onClick={()=>this.bukaMenu(option.pengguna_id, option.nama, option.tahun_ajaran_id)}>
                                                        <i className="icons f7-icons">ellipsis_vertical</i>
                                                    </Button>
                                                </div>
                                                <Popover className={"popover-menu-"+option.pengguna_id}>
                                                    <List>
                                                        <ListItem onClick={()=>this.tampilPenggunaRuang('profil', this.state.pengguna_terpilih, this.$f7route.params['sekolah_id'])} link="#" popoverClose title="Profil Siswa" />
                                                        <ListItem onClick={()=>this.tampilPenggunaRuang('kehadiran', this.state.pengguna_terpilih, this.$f7route.params['sekolah_id'])} link="#" popoverClose title="Kehadiran" />
                                                        {/* <ListItem onClick={()=>this.hapusRuang(this.state.pengguna_terpilih)} link="#" popoverClose title="Hapus Ruang dari Sekolah" /> */}
                                                    </List>
                                                </Popover>
                                            </CardContent>
                                        </Card>
                                    )
                                })}

                            </CardContent>
                        </Card>
                    </Col>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                </Row>
                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Daftar Siswa">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    // expandable
                                    placeholder="Nama Siswa"
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    onChange={this.cariKeyword}
                                ></Searchbar>
                                <ListInput
                                    type="select"
                                    defaultValue={this.state.ta_aktif}
                                    onChange={this.gantiTa}
                                >
                                    <option value={99}>Semua Tahun Ajaran</option>
                                    {this.state.tahun_ajaran.rows.map((option)=>{
                                        return (
                                            <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                            )
                                    })}
                                </ListInput>
                                <ListInput
                                    type="select"
                                    defaultValue={99}
                                    onChange={this.gantiRuang}
                                >
                                    <option value={99}>Semua Ruang</option>
                                    {this.state.ruang_sekolah.rows.map((option)=>{
                                        return (
                                            <option value={option.ruang_id}>{option.nama}</option>
                                            )
                                    })}
                                </ListInput>
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
                                    <Button raised fill onClick={this.tampilkanSiswaFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Siswa
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
    //   getSekolahPengguna: actions.getSekolahPengguna,
      getRuangSekolah: actions.getRuangSekolah,
      getTahunAjaran: actions.getTahunAjaran
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarSiswa));
  