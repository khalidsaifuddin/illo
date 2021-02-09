import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import { map } from 'leaflet';

class tambahRuangSekolah extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {},
        ruang: {
            rows: [{
                nama: '*********'
            },{
                nama: '*********'
            },{
                nama: '*********'
            }],
            total: 0
        },
        tahun_ajaran: {
            rows: [],
            total: 0
        },
        pilihTahunAjaran: false
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
            },()=>{
                this.props.getTahunAjaran(this.state.routeParams).then((result)=>{
                    this.setState({
                        tahun_ajaran: result.payload
                    })
                })
            });
        });

    }

    cariGuru = () => {
        
        this.setState({
            loading: true,
            display: true,
            routeParams: {
                ...this.state.routeParams
            },
            ruang: {
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
            this.props.getRuang(this.state.routeParams).then((result)=>{
                this.setState({
                    loading: false,
                    ruang: this.props.ruang
                })
            });
        });
    }

    simpanRuangSekolah = (ruang_id) => {
        // alert(ruang_id)

        // this.props.simpanRuangSekolah()
        this.setState({
            pilihTahunAjaran: !this.state.pilihTahunAjaran,
            ruang_id: ruang_id
        })

    }

    pilihTahun = (tahun_ajaran_id) => {
        // alert(tahun_ajaran_id)
        this.$f7.dialog.preloader()

        this.props.simpanRuangSekolah({...this.state.routeParams, tahun_ajaran_id: tahun_ajaran_id, ruang_id: this.state.ruang_id}).then((result)=>{
            
            if(result.payload.sukses){
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Proses Berhasil!','Informasi');
                setTimeout(() => {
                    this.$f7router.navigate("/daftarRuang/"+this.$f7route.params['sekolah_id']);
                }, 1000);
            }else{
                this.$f7.dialog.close();
                this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon dicoba kembali dalam beberapa saat','Peringatan');
            }
        })

    }

    render()
    {
        return (
            <Page name="tambahRuangSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Ruang</NavTitle>
                </Navbar>

                {/* One Group */}
                <Actions ref="actionsOneGroup" opened={this.state.pilihTahunAjaran}>
                    <ActionsGroup>
                        <ActionsLabel>Pilih Tahun Ajaran</ActionsLabel>
                        {this.state.tahun_ajaran.rows.map((option)=>{
                            return (
                                <ActionsButton onClick={()=>this.pilihTahun(option.tahun_ajaran_id)}>{option.nama}</ActionsButton>
                            )
                        })}

                        <ActionsButton color="red">Batal</ActionsButton>
                    </ActionsGroup>
                </Actions>

                <Row noGap>
                    <Col tabletWidth="15" width="0"></Col>
                    <Col tabletWidth="70" width="100">
                        <Card>
                            <CardContent>
                                Cari ruang yang akan ditambahkan ke <b>{this.state.sekolah.nama}</b> menggunakan kode ruang
                                <br/>
                                <List noHairlinesMd style={{marginTop:'16px'}}>
                                    <ListInput
                                    outline
                                    large
                                    // label="Cari Kuis"
                                    floatingLabel
                                    type="text"
                                    placeholder="Kode Ruang..."
                                    clearButton
                                    onChange={(e)=>this.setState({routeParams:{...this.state.routeParams,kode_ruang:e.target.value}})}
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
                        {this.state.ruang.rows.map((option)=>{
                            return (
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""} style={{display:(this.state.display ? 'block' : 'none')}}>
                                    <CardContent>
                                        <Row>
                                            <Col width="20">
                                                <div style={{height:'60px', width:'100%', overflow:'hidden'}}>
                                                    {option.gambar_ruang &&
                                                    <img src={"https://be.diskuis.id/assets/berkas/"+option.gambar_ruang} style={{width:'100px'}} />
                                                    }
                                                </div>
                                            </Col>
                                            <Col width={option.cek_pilih ? '50' : '60'}>
                                                <div style={{marginLeft:'8px'}}>
                                                    <b>{option.nama}</b>
                                                    {/* <br/>{option.keterangan} */}
                                                    <div style={{marginTop:'-10px', fontSize:'10px', fontStyle:'italic', height:'30px', overflow:'hidden'}} dangerouslySetInnerHTML={{ __html: option.deskripsi }} />
                                                    <div style={{fontSize:'12px'}}>{option.ruang ? option.ruang.total+" pengikut" : ""} | {option.sesi_kuis ? option.sesi_kuis.total+" kuis" : ""}</div>
                                                </div>
                                            </Col>
                                            <Col width={option.cek_pilih ? '30' : '20'} style={{textAlign:'right'}} onClick={()=>this.simpanRuangSekolah(option.ruang_id)}>
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
      getRuang: actions.getRuang,
      simpanSekolahPengguna: actions.simpanSekolahPengguna,
      simpanRuangSekolah: actions.simpanRuangSekolah,
      getTahunAjaran: actions.getTahunAjaran
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahRuangSekolah));
  