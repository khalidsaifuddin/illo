import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class kelolaSekolah extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            administrator: 1
        },
        sekolah: {
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

        this.$f7.dialog.preloader()

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah
            },()=>{
                this.$f7.dialog.close()
            })
        })

    }

    aktifkanSekolah = (sekolah_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin mengaktifkan sekolah ini?', 'Konfirmasi', ()=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    sekolah_id: sekolah_id
                }
            },()=>{
                this.props.aktifkanSekolah(this.state.routeParams).then((result)=>{
                    if(result.payload.sukses){
                        this.$f7router.navigate('/berandaSekolah/');
                    }else{
                        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                    }
                })
            });

        });
    }

    hapusSekolah = (sekolah_id) => {
        // alert(sekolah_id)
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus sekolah ini? Proses ini tidak dapat dibatalkan!', 'Konfirmasi', ()=>{

            this.$f7.dialog.preloader('Menghapus data sekolah...')

            this.props.simpanSekolah({sekolah_id: sekolah_id, soft_delete: 1}).then((result)=>{
                this.$f7.dialog.close()

                if(result.payload.success){
                    this.$f7.dialog.alert('Sekolah berhasil dihapus!', 'Berhasil',()=>{
                        this.props.getSekolah(this.state.routeParams).then((result)=>{
                            this.setState({
                                sekolah: this.props.sekolah
                            },()=>{
                                // this.$f7.dialog.close()
                            })
                        })
                    })
                }else{
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat', 'Peringatan');
                    
                }
            })
        })

    }

    render()
    {
        return (
            <Page name="kelolaSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kelola Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="50" desktopWidth="40">
                                        <Button className="bawahCiriBiru" raised fill onClick={()=>this.$f7router.navigate("/formSekolah/")}>
                                            <i className="icon f7-icons" style={{fontSize:'20px'}}>plus_rectangle</i>
                                            &nbsp;
                                            Tambah Sekolah Baru
                                        </Button>
                                    </Col>
                                    <Col width="50">
                                        
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        {this.state.sekolah.rows.map((option)=>{
                            return (
                                <Card className={(option.aktif === 1 ? "sekolahAktif" : "")}>
                                    <CardContent style={{padding:'8px', paddingRight:'16px'}}>
                                        <Row>
                                            <Col width="20" tabletWidth="15" desktopWidth="10" style={{overflow:'hidden'}}>
                                                <img src={"https://be.diskuis.id"+option.gambar_logo} className={"gambar_latar_kelola_sekolah"} />
                                            </Col>
                                            <Col width="65" tabletWidth="65" desktopWidth="70">
                                                <h2>{option.nama} {(option.npsn ? <>({option.npsn})</> : '')}</h2>
                                                {option.langganan_id &&
                                                <div className="hilangDiDesktop">
                                                    <Chip text="Premium" color="orange" style={{color:'#ffffff'}}>
                                                        <img slot="media" src="./static/icons/vip-round.png" />
                                                    </Chip>
                                                </div>
                                                }
                                                {!option.langganan_id &&
                                                <div className="hilangDiDesktop">
                                                    <Chip text="Standar" color="gray" style={{color:'#ffffff'}}>
                                                        <img slot="media" src="./static/icons/free-round.png" />
                                                    </Chip>
                                                </div>
                                                }
                                                <span>{option.keterangan}</span><br/>
                                                {option.aktif === 1 && <Button onClick={()=>this.aktifkanSekolah(option.sekolah_id)} small raised fill class className="color-theme-green" style={{width:'150px', marginTop:'8px', fontSize:'10px', height:'20px'}}>Sekolah Aktif</Button>}
                                                {option.aktif !== 1 && <Link onClick={()=>this.aktifkanSekolah(option.sekolah_id)}>Aktifkan Sekolah</Link>}
                                            </Col>
                                            <Col width="15" tabletWidth="20" desktopWidth="20" style={{textAlign:'right', fontSize:'12px'}}>
                                                {option.langganan_id &&
                                                <div className="hilangDiMobile">
                                                    <Chip text="Premium" color="orange" style={{color:'#ffffff'}}>
                                                        <img slot="media" src="./static/icons/vip-round.png" />
                                                    </Chip>
                                                    <br/>
                                                </div>
                                                }
                                                {!option.langganan_id &&
                                                <div className="hilangDiMobile">
                                                    <Chip text="Standar" color="gray" style={{color:'#ffffff'}}>
                                                        <img slot="media" src="./static/icons/free-round.png" />
                                                    </Chip>
                                                    <br/>
                                                </div>
                                                }
                                                <Link href={"/formSekolah/"+option.sekolah_id}>Edit</Link><br/>
                                                <Link onClick={()=>this.hapusSekolah(option.sekolah_id)}>Hapus</Link>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
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
      aktifkanSekolah: actions.aktifkanSekolah,
      simpanSekolah: actions.simpanSekolah,
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kelolaSekolah));
  