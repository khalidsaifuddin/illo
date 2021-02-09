import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class buatKodeSekolah extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        sekolah: {},
        pengguna: {
            rows: [{
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

    setSelectValue = (key) => (b) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: b.target.value
            }
        });
    }

    setStateValue = (key) => (b) => {
        // console.log(key);
        // console.log(b);

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: b.target.value
            }
        });
    }

    simpan = () => {
        // console.log(this.state.routeParams);

        if(!this.state.routeParams.jabatan_sekolah_id){
            this.$f7.dialog.alert('Mohon isi tujuan undangan sekolah!', 'Peringatan');
            return false;
        }

        if(!this.state.routeParams.waktu_mulai){
            this.$f7.dialog.alert('Mohon isi waktu aktif undangan!', 'Peringatan');
            return false;
        }

        if(!this.state.routeParams.waktu_selesai){
            this.$f7.dialog.alert('Mohon isi waktu akhir undangan!', 'Peringatan');
            return false;
        }

        this.$f7.dialog.preloader();

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                waktu_mulai: this.state.routeParams.waktu_mulai.replace("T"," ") + ":00",
                waktu_selesai: this.state.routeParams.waktu_selesai.replace("T"," ") + ":00"
            }
        },()=>{

            this.props.simpanUndanganSekolah(this.state.routeParams).then((result)=>{
                this.$f7.dialog.close();
    
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Berhasil membuat undangan sekolah!', 'Berhasil');
                    this.$f7router.navigate("/kodeSekolah/"+this.state.routeParams.sekolah_id+"/"+result.payload.rows[0].undangan_sekolah_id);

                }else{
                    //gagal
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
                }
            });

        });


    }

    render()
    {
        return (
            <Page name="buatKodeSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Buat Kode Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <Card>
                            <CardContent>
                                Kode sekolah digunakan untuk mengundang guru atau siswa bergabung dengan <b>{this.state.sekolah.nama}</b>. Bagikan kode sekolah yang dihasilkan dari form ini ke guru atau siswa yang akan diundang.
                                <br/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <List>
                                    <ListItem
                                        title="Undangan ini untuk"
                                        smartSelect
                                    >
                                        <select onChange={this.setSelectValue('jabatan_sekolah_id')} name="jabatan_sekolah_id" defaultValue={"-"}>
                                            <option value="-" disabled>Pilih Jabatan Sekolah</option>
                                            <option value="1">Guru</option>
                                            <option value="2">Siswa</option>
                                        </select>
                                    </ListItem>
                                    <ListInput
                                        label="Aktif Sejak"
                                        type="datetime-local"
                                        // style={{width:'100%'}}
                                        placeholder="Pilih waktu mulai..."
                                        onChange={this.setStateValue('waktu_mulai')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Aktif hingga"
                                        type="datetime-local"
                                        placeholder="Pilih waktu selesai..."
                                        onChange={this.setStateValue('waktu_selesai')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Keterangan"
                                        type="text"
                                        // style={{width:'100%'}}
                                        placeholder="Keterangan..."
                                        onChange={this.setStateValue('keterangan')}
                                        style={{maxWidth:'100%'}}
                                    />
                                </List>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Button raised fill className="bawahCiriBiru cardBorder-20" style={{display:'inline-flex', width:'100%'}} onClick={this.simpan}>
                                    <i className="f7-icons icons">floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
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
      simpanUndanganSekolah: actions.simpanUndanganSekolah,
      getUndanganSekolah: actions.getUndanganSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        undangan_sekolah: Sekolah.undangan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(buatKodeSekolah));
  