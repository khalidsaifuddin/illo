import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class kolaborasiKuis extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            kuis_id: this.$f7route.params['kuis_id'] ? this.$f7route.params['kuis_id'] : null
        },
        pengguna: {
            rows: {},
            total: 0
        },
        kolaborasi_kuis: {
            total: 0,
            rows: []
        },
        kuis: {
            total: 0,
            rows: []
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

        this.props.getKuis(this.state.routeParams).then((result)=>{
            
            if(this.props.kuis.total > 0){

                this.setState({
                    ...this.state,
                    kuis: this.props.kuis.rows[0]
                })

            }

        });

        this.props.getKolaborasiKuis(this.state.routeParams).then((result)=>{
            
            if(this.props.kolaborasi_kuis.total > 0){

                this.setState({
                    ...this.state,
                    kolaborasi_kuis: this.props.kolaborasi_kuis
                })

            }

        })

    }

    hapusKolaborator = (pengguna_id) => {
        this.$f7.dialog.confirm('Apakah Ada yakin ingin menghapus kolaborator ini?','Konfirmasi', ()=>{

            this.$f7.dialog.preloader();
            this.setState({
                routeParamsSimpan: {
                    pengguna_id: pengguna_id,
                    kuis_id: this.$f7route.params['kuis_id'],
                    soft_delete: '1'
                }
            },()=>{
                this.props.simpanKolaborasiKuis(this.state.routeParamsSimpan).then((result)=>{
                    if(result.payload.sukses){
                        //berhasil
                        this.$f7.dialog.close();
                        this.$f7.dialog.alert('Proses Berhasil!','Informasi');
                        // setTimeout(() => {
                        //     // this.$f7router.navigate("/kolaborasiKuis/"+this.$f7route.params['kuis_id']);
                        // }, 1000);
                        this.props.getKolaborasiKuis(this.state.routeParams).then((result)=>{
            
                            // if(this.props.kolaborasi_kuis.total > 0){
                
                            this.setState({
                                ...this.state,
                                kolaborasi_kuis: this.props.kolaborasi_kuis
                            })
                
                            // }
                
                        })
    
                    }else{
                        //gagal
                        this.$f7.dialog.close();
                        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon dicoba kembali dalam beberapa saat','Peringatan');
                    }
                })
            })

        })
        
    }

    render()
    {
        return (
            <Page name="kolaborasiKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Kolaborator Kuis</NavTitle>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        <Card>
                            <CardContent style={{padding:'8px', textAlign:'center'}}>
                                <b style={{fontSize:'15px'}}>{this.state.kuis.judul}</b>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="50" tabletWidth="25">
                                        <Button className="color-theme-deeporange bawahCiri" raised fill onClick={()=>this.$f7router.navigate("/tambahKolaborasiKuis/"+this.$f7route.params['kuis_id'])}>
                                            <i className="f7-icons icons">plus</i>&nbsp;
                                            Tambah Kolaborator
                                        </Button>
                                    </Col>
                                    <Col width="50">
                                        {/* <Button className="color-theme-red bawahCiri" raised fill onClick={()=>this.$f7router.navigate("#")}>
                                            Bagikan Kode Sekolah
                                        </Button> */}
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        {this.state.kolaborasi_kuis.rows.map((option)=>{
                            return (
                                <Card>
                                    <CardContent>
                                        {/* {option.nama} */}
                                        <Row>
                                            <Col width="15" tabletWidth="10">
                                                <img src={option.gambar} style={{width:'40px', borderRadius:'50%', marginRight:'0px'}} />
                                            </Col>
                                            <Col width="50" tabletWidth="55">
                                                <b><Link href={"/tampilPengguna/"+option.pengguna_id}>{option.nama}</Link></b>
                                                <br/>{option.username}
                                            </Col>
                                            <Col width="25" tabletWidth="25" style={{textAlign:'right'}}>
                                                
                                            </Col>
                                            <Col width="10" tabletWidth="10" style={{textAlign:'right'}}>
                                                <Button popoverOpen={".popover-menu-"+option.pengguna_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                <Popover className={"popover-menu-"+option.pengguna_id}>
                                                    <List>
                                                        <ListItem onClick={()=>this.hapusKolaborator(option.pengguna_id)} link="#" popoverClose title="Hapus Kolaborator" />
                                                    </List>
                                                </Popover>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getKuis: actions.getKuis,
      getSekolahPengguna: actions.getSekolahPengguna,
      simpanAdministrator: actions.simpanAdministrator,
      getKolaborasiKuis: actions.getKolaborasiKuis,
      simpanKolaborasiKuis: actions.simpanKolaborasiKuis
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        sekolah_pengguna: Sekolah.sekolah_pengguna,
        kolaborasi_kuis: Kuis.kolaborasi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kolaborasiKuis));
  