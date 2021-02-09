import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class tambahSiswa extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {},
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
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0]
            });
        });

    }

    cariGuru = () => {
        // console.log(this.state.routeParams);
        this.setState({
            loading: true,
            display: true,
            routeParams: {
                ...this.state.routeParams,
                // sekolah_id: null,
                sekolah_pengguna: 1
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

    simpanPenggunaSekolah = (pengguna_id) => {
        this.$f7.dialog.preloader();
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                sekolah_id: this.$f7route.params['sekolah_id'],
                pengguna_id: pengguna_id,
                jabatan_sekolah_id: 2,
                valid: 1
            }
        },()=>{
            this.props.simpanSekolahPengguna(this.state.routeParams).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Proses Berhasil!','Informasi');
                    setTimeout(() => {
                        this.$f7router.navigate("/daftarSiswa/"+this.$f7route.params['sekolah_id']);
                    }, 1000);

                }else{
                    //gagal
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon dicoba kembali dalam beberapa saat','Peringatan');
                }
            })
        });
    }

    render()
    {
        return (
            <Page name="tambahSiswa" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Siswa</NavTitle>
                </Navbar>
                <Row noGap>
                    <Col tabletWidth="15" width="0"></Col>
                    <Col tabletWidth="70" width="100">
                        <Card>
                            <CardContent>
                                Cari siswa yang akan ditambahkan ke <b>{this.state.sekolah.nama}</b> menggunakan nama atau email
                                <br/>
                                <List noHairlinesMd style={{marginTop:'16px'}}>
                                    <ListInput
                                    outline
                                    large
                                    // label="Cari Kuis"
                                    floatingLabel
                                    type="text"
                                    placeholder="Nama/Email Siswa ..."
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
                                            <Col width={option.cek_pilih ? '30' : '20'} style={{textAlign:'right'}} onClick={()=>this.simpanPenggunaSekolah(option.pengguna_id)}>
                                                <Button disabled={option.cek_pilih ? true : false} raised fill>{option.cek_pilih ? 'Sudah Masuk' : 'Pilih'}</Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Col>
                    <Col tabletWidth="15" width="0"></Col>
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
      getPengguna: actions.getPengguna,
      simpanSekolahPengguna: actions.simpanSekolahPengguna
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahSiswa));
  