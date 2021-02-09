import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Fab, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class daftarRuang extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            start: 0,
            limit: 20
        },
        sekolah: {
            gambar_logo: '/1.jpg'
        },
        ruang_sekolah: {
            total: 0,
            rows: []
        },
        tahun_ajaran: {
            total: 0,
            rows: []
        },
        ta_aktif: 2020,
        menuRuang: false,
        menuTambahRuang: false,
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
            this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang_sekolah: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
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
            this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang_sekolah: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        });
    }

    componentDidMount = () => {

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0],
                routeParams: {
                    ...this.state.routeParams
                }
            },()=>{

                this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                    this.setState({
                        ruang_sekolah: result.payload
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
                            })
                        })
                    })
                })

            });
        });

    }

    bukaMenu = (ruang_id, nama_ruang, tahun_ajaran_id) => {
        this.setState({
            nama_ruang_terpilih: nama_ruang,
            ruang_terpilih: ruang_id,
            ta_terpilih: tahun_ajaran_id,
            menuRuang: !this.state.menuRuang
        })
    }
    
    bukaMenuDesktop = (ruang_id, nama_ruang, tahun_ajaran_id) => {
        this.setState({
            nama_ruang_terpilih: nama_ruang,
            ruang_terpilih: ruang_id,
            ta_terpilih: tahun_ajaran_id
        })
    }

    hapusRuang = (ruang_id) => {
        // alert(ruang_id)

        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus ruang ini dari sekolah?', 'Konfirmasi', ()=>{

            this.$f7.dialog.preloader()

            this.props.simpanRuangSekolah({...this.state.routeParams, tahun_ajaran_id: this.state.ta_terpilih, ruang_id: ruang_id, soft_delete:1}).then((result)=>{
                
                if(result.payload.sukses){
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ruang berhasil dihapus dari sekolah!','Berhasil');
    
                    setTimeout(() => {
                        this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                            this.setState({
                                ruang_sekolah: result.payload
                            })
                        })
    
                    }, 1000);
                }else{
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon dicoba kembali dalam beberapa saat','Peringatan');
                }
            })
        })


    }
    
    tambahAnggotaRuang = (ruang_id) => {
        // alert(ruang_id)
        this.$f7router.navigate('/tambahAnggotaRuang/'+ruang_id+'/'+this.$f7route.params['sekolah_id'])
    }
    
    tampilPenggunaRuang = (ruang_id) => {
        // alert(ruang_id)
        this.$f7router.navigate('/tampilRuang/'+ruang_id)
    }
    
    tampilKehadiran = (ruang_id) => {
        // alert(ruang_id)
        this.$f7router.navigate('/kehadiranRuang/'+ruang_id+'/'+this.$f7route.params['sekolah_id']+'/'+this.state.ta_aktif)
    }

    tutupMenu = () => {
        this.setState({
            menuRuang: !this.state.menuRuang
        })
    }
    
    tutupTambahMenu = () => {
        this.setState({
            menuTambahRuang: !this.state.menuTambahRuang
        })
    }

    tambahRuang = (sekolah_id) => {
        this.setState({
            menuTambahRuang: !this.state.menuTambahRuang
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

    gantiTa = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tahun_ajaran_id: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.routeParams)
        })
    }

    resetFilter = () => {
        this.$f7.dialog.preloader()
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: null,
                tahun_ajaran_id: null
            }
        },()=>{
            this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
                this.setState({
                    ruang_sekolah: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    tampilkanRuangFilter = () => {
        this.$f7.dialog.preloader()
        // this.props.getSiswaSekolah(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         siswa_sekolah: result.payload,
        //         popupFilter: !this.state.popupFilter
        //     },()=>{
        //         this.$f7.dialog.close()
        //     })
        // })

        this.props.getRuangSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                ruang_sekolah: result.payload,
                popupFilter: !this.state.popupFilter
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    render()
    {
        return (
            <Page name="daftarRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Ruang</NavTitle>
                    <NavRight>
                        <div className="hilangDiMobile">
                            <Button style={{marginTop:'-8px'}} className="color-theme-deeporange bawahCiri" raised fill popoverOpen={".popover-tambah-menu"}>
                                <i className="f7-icons icons">plus</i>&nbsp;
                                Tambah Ruang
                            </Button>
                            <Popover className={"popover-tambah-menu"} style={{minWidth:'320px'}}>
                                <List>
                                    <ListItem onClick={()=>this.$f7router.navigate("/tambahRuangSekolahBaru/"+this.state.sekolah.sekolah_id)} link="#" popoverClose title="Buat ruang baru" />
                                    <ListItem onClick={()=>this.$f7router.navigate("/tambahRuangSekolah/"+this.state.sekolah.sekolah_id)} link="#" popoverClose title="Tambah dari ruang yang ada" />
                                </List>
                            </Popover>
                        </div>
                        <div className="hilangDiDesktop">
                            <Button style={{marginTop:'-8px'}} className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.tambahRuang(this.state.sekolah.sekolah_id)}>
                                <i className="f7-icons icons">plus</i>&nbsp;
                                Tambah Ruang
                            </Button>
                        </div>
                        <Button onClick={()=>this.setState({popupFilter:!this.state.popupFilter})}>
                            <i className="icons f7-icons">arrow_right_arrow_left_square</i>&nbsp;
                            Filter
                        </Button>
                    </NavRight>
                </Navbar>

                <Actions ref="actionsOneGroup" opened={this.state.menuRuang} onActionsClose={this.tutupMenu}>
                    <ActionsGroup>
                        <ActionsLabel>{this.state.nama_ruang_terpilih}</ActionsLabel>
                        <ActionsButton onClick={()=>this.tambahAnggotaRuang(this.state.ruang_terpilih)}>Tambah Anggota Ruang</ActionsButton>
                        <ActionsButton onClick={()=>this.tampilPenggunaRuang(this.state.ruang_terpilih)}>Detail Ruang</ActionsButton>
                        <ActionsButton onClick={()=>this.tampilKehadiran(this.state.ruang_terpilih)}>Kehadiran Siswa</ActionsButton>
                        <ActionsButton onClick={()=>this.hapusRuang(this.state.ruang_terpilih)}>Hapus Ruang dari Sekolah</ActionsButton>
                        <ActionsButton color="red">Batal</ActionsButton>
                    </ActionsGroup>
                </Actions>
                
                <Actions ref="actionsOneGroup" opened={this.state.menuTambahRuang} onActionsClose={this.tutupTambahMenu}>
                    <ActionsGroup>
                        <ActionsLabel>Tambah Ruang untuk Sekolah</ActionsLabel>
                        <ActionsButton onClick={()=>this.$f7router.navigate("/tambahRuangSekolahBaru/"+this.state.sekolah.sekolah_id)}>Buat ruang baru</ActionsButton>
                        <ActionsButton onClick={()=>this.$f7router.navigate("/tambahRuangSekolah/"+this.state.sekolah.sekolah_id)}>Tambah dari ruang yang ada</ActionsButton>
                        <ActionsButton color="red">Batal</ActionsButton>
                    </ActionsGroup>
                </Actions>

                <Row>
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
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.ruang_sekolah.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.ruang_sekolah.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.ruang_sekolah.total)} dari {this.formatAngka(this.state.ruang_sekolah.total)} ruang</span>
                                        </div>
                                    </div>
                                </div>
                            {/* </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="40" tabletWidth="30"> */}
                                        {/* <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/tambahRuangSekolah/"+this.state.sekolah.sekolah_id)}> */}
                                        {/* <div className="hilangDiMobile">
                                            <Button className="color-theme-deeporange bawahCiri" raised fill popoverOpen={".popover-tambah-menu"}>
                                                <i className="f7-icons icons">plus</i>&nbsp;
                                                Tambah Ruang
                                            </Button>
                                            <Popover className={"popover-tambah-menu"} style={{minWidth:'300px'}}>
                                                <List>
                                                    <ListItem onClick={()=>this.$f7router.navigate("/tambahRuangSekolahBaru/"+this.state.sekolah.sekolah_id)} link="#" popoverClose title="Buat ruang baru" />
                                                    <ListItem onClick={()=>this.$f7router.navigate("/tambahRuangSekolah/"+this.state.sekolah.sekolah_id)} link="#" popoverClose title="Tambah dari ruang yang ada" />
                                                </List>
                                            </Popover>
                                        </div>
                                        <div className="hilangDiDesktop">
                                            <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.tambahRuang(this.state.sekolah.sekolah_id)}>
                                                <i className="f7-icons icons">plus</i>&nbsp;
                                                Tambah Ruang
                                            </Button>
                                        </div> */}
                                    {/* </Col>
                                    <Col width="60" tabletWidth="50">
                                        <List>
                                            <ListInput
                                                // label="Tahun Ajaran"
                                                // inlineLabel
                                                type="select"
                                                // defaultValue={99}
                                                defaultValue={this.state.ta_aktif}
                                                // placeholder="Tahun Ajaran..."
                                            >
                                                {this.state.tahun_ajaran.rows.map((option)=>{
                                                    return (
                                                        <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                                        )
                                                })}
                                                
                                            </ListInput>
                                        </List>
                                    </Col> */}
                                    {/* <Col width="50"> */}
                                        {/* <Button className="color-theme-red bawahCiri" raised fill onClick={()=>this.$f7router.navigate("#")}>
                                            Bagikan Kode Sekolah
                                        </Button> */}
                                    {/* </Col> */}
                                {/* </Row> */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                {this.state.ruang_sekolah.rows.map((option)=>{
                                    return (
                                        <Card key={option.ruang_sekolah_id}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="20">
                                                        <div style={{height:'70px', width:'100%', overflow:'hidden', borderRadius:'10px', border:'1px solid #eee'}}>
                                                            {option.gambar_ruang &&
                                                            <img src={"https://be.diskuis.id/assets/berkas/"+option.gambar_ruang} style={{width:'100%'}} />
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col width={'80'}>
                                                        <div style={{marginLeft:'8px', marginRight:'40px'}}>
                                                            <Link href={"/tampilRuang/"+option.ruang_id}><b>{option.nama}</b></Link>&nbsp;oleh {option.pembuat}
                                                            {/* <br/>{option.keterangan} */}
                                                            <div style={{marginTop:'-10px', fontSize:'10px', fontStyle:'italic', height:'30px', overflow:'hidden'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                            <div style={{fontSize:'12px'}}>{option.pengikut ? option.pengikut+" siswa" : "0 siswa"} | {option.kuis ? option.kuis+" kuis" : "0 kuis"}</div>
                                                        </div>
                                                        <div className="hilangDiMobile">
                                                            <Button className="vertButton" popoverOpen={".popover-menu-"+option.ruang_id} onClick={()=>this.bukaMenuDesktop(option.ruang_id, option.nama, option.tahun_ajaran_id)}>
                                                                <i className="icons f7-icons">ellipsis_vertical</i>
                                                            </Button>
                                                        </div>
                                                        <div className="hilangDiDesktop">
                                                            <Button className="vertButton" onClick={()=>this.bukaMenu(option.ruang_id, option.nama, option.tahun_ajaran_id)}>
                                                                <i className="icons f7-icons">ellipsis_vertical</i>
                                                            </Button>
                                                        </div>
                                                        <Popover className={"popover-menu-"+option.ruang_id} style={{minWidth:'300px'}}>
                                                            <List>
                                                                <ListItem onClick={()=>this.tambahAnggotaRuang(this.state.ruang_terpilih)} link="#" popoverClose title="Tambah Anggota Ruang" />
                                                                <ListItem onClick={()=>this.tampilPenggunaRuang(this.state.ruang_terpilih)} link="#" popoverClose title="Detail Ruang" />
                                                                <ListItem onClick={()=>this.tampilKehadiran(this.state.ruang_terpilih)} link="#" popoverClose title="Kehadiran Siswa" />
                                                                <ListItem onClick={()=>this.hapusRuang(this.state.ruang_terpilih)} link="#" popoverClose title="Hapus Ruang dari Sekolah" />
                                                            </List>
                                                        </Popover>
                                                    </Col>
                                                </Row>
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
                        <Navbar title="Filter Daftar Ruang">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    // expandable
                                    placeholder="Nama Ruang"
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    onChange={this.cariKeyword}
                                ></Searchbar>
                                <ListInput
                                    type="select"
                                    defaultValue={this.state.ta_aktif}
                                    onChange={this.gantiTa}
                                >
                                    {this.state.tahun_ajaran.rows.map((option)=>{
                                        return (
                                            <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                            )
                                    })}
                                </ListInput>
                            </List>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button raised large onClick={this.resetFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                        Reset Filter
                                    </Button>
                                </Col>
                                <Col width="50">
                                    <Button raised fill large onClick={this.tampilkanRuangFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Ruang
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
      getRuangSekolah: actions.getRuangSekolah,
      getTahunAjaran: actions.getTahunAjaran,
      simpanRuangSekolah: actions.simpanRuangSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarRuang));
  