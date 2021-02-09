import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class tambahKolaborasiKuis extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            kuis_id: this.$f7route.params['kuis_id'] ? this.$f7route.params['kuis_id'] : null
        },
        pengguna: {
            rows: [],
            total: 0
        },
        kolaborasi_kuis: {
            rows: [{
                nama: '*********'
            },{
                nama: '*********'
            },{
                nama: '*********'
            }],
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

        //what to do after mount

    }

    cariGuru = () => {
        // console.log(this.state.routeParams);
        this.setState({
            loading: true,
            display: true,
            routeParams: {
                ...this.state.routeParams,
                // sekolah_id: null,
                // sekolah_pengguna: 1
            },
            pengguna: {
                rows: [{
                    nama: '*********'
                },{
                    nama: '*********'
                },{
                    nama: '*********'
                }],
                total: 0
            }
        },()=>{
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    loading: false,
                    pengguna: this.props.pengguna
                })
            });
        });
    }

    simpanKolaborasiKuis = (pengguna_id) => {
        // alert(pengguna_id);
        this.$f7.dialog.preloader();
        this.setState({
            routeParamsSimpan: {
                pengguna_id: pengguna_id,
                kuis_id: this.$f7route.params['kuis_id']
            }
        },()=>{
            this.props.simpanKolaborasiKuis(this.state.routeParamsSimpan).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Proses Berhasil!','Informasi');
                    setTimeout(() => {
                        this.$f7router.navigate("/kolaborasiKuis/"+this.$f7route.params['kuis_id']);
                    }, 1000);

                }else{
                    //gagal
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon dicoba kembali dalam beberapa saat','Peringatan');
                }
            })
        })
    }

    render()
    {
        return (
            <Page name="tambahKolaborasiKuis" hideBarsOnScroll style={{paddingBottom:'100px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Kolaborator</NavTitle>
                </Navbar>
                <Card>
                    <CardContent>
                        Kolaborator adalah pengguna yang Anda ajak untuk mengelola kuis bersama-sama. Bila pengguna yang Anda pilih menjadi kolaborator, maka pengguna tersebut akan memiliki hak akses untuk mengedit kuis, membuat sesi, dan mengecek peringkat kuis.
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        Cari pengguna yang akan diajak untuk berkolaborasi
                        <br/>
                        <List noHairlinesMd style={{marginTop:'16px'}}>
                            <ListInput
                              outline
                              large
                              // label="Cari Kuis"
                              floatingLabel
                              type="text"
                              placeholder="Nama/Email Pengguna ..."
                              clearButton
                              onChange={(e)=>this.setState({routeParams:{...this.state.routeParams,keyword:e.target.value}})}
                            ></ListInput>
                            <ListItem>
                              <Button className={"bawahCiriBiru cardBorder-20"} fill raised style={{width:'100%'}} onClick={this.cariGuru}>
                                <i className="icons f7-icons" style={{fontSize:'18px'}}>search</i>&nbsp;
                                Cari
                              </Button>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
                <BlockTitle>Hasil Pencarian</BlockTitle>
                {this.state.pengguna.rows.map((option)=>{
                    return (
                        <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""} style={{display:(this.state.display ? 'block' : 'none')}}>
                            <CardContent>
                                <Row>
                                    <Col width="20">
                                        <img src={option.gambar} style={{width:'40px', borderRadius:'50%', marginRight:'16px'}} />
                                    </Col>
                                    <Col width={option.cek_pilih ? '50' : '60'}>
                                        {option.nama}
                                        <br/>{option.username}
                                    </Col>
                                    <Col width={option.cek_pilih ? '30' : '20'} style={{textAlign:'right'}} onClick={()=>this.simpanKolaborasiKuis(option.pengguna_id)}>
                                        <Button disabled={option.cek_pilih ? true : false} raised fill>{option.cek_pilih ? 'Sudah Terpilih' : 'Pilih'}</Button>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                    )
                })}
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah,
      getPengguna: actions.getPengguna,
      simpanKolaborasiKuis: actions.simpanKolaborasiKuis
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        pengguna: App.pengguna,
        kolaborasi_kuis: Kuis.kolaborasi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahKolaborasiKuis));
  