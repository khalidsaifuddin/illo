import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class menuSekolahGuru extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        sekolah: {},
        sekolah_pengguna_record: {},
        sekolah_pengguna: {
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

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0],
                routeParams: {
                    ...this.state.routeParams,
                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{
                this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        loading: false,
                        sekolah_pengguna: this.props.sekolah_pengguna,
                        sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0]
                    });
                });
            });
        });

    }

    setSekolahInduk =  () => {
        // this.$f7.dialog.alert('set!');
        this.$f7.dialog.preloader();
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                sekolah_utama: 1
            }
        },()=>{
            console.log(this.state.routeParams)
            this.props.simpanSekolahUtama(this.state.routeParams).then((result)=>{
                this.$f7.dialog.close()

                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Set sekolah induk berhasil!', 'Berhasil')

                    this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            loading: false,
                            sekolah_pengguna: this.props.sekolah_pengguna,
                            sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0]
                        })
                    })

                }else{
                    //gagal
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!', 'Peringatan')
                }
            })
        })
    }

    render()
    {
        return (
            <Page name="menuSekolahGuru" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Menu Sekolah</NavTitle>
                </Navbar>
                {parseInt(this.state.sekolah_pengguna_record.valid) !== 1 &&
                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                    <CardContent>
                        <div>
                            <i className="icons f7-icons">exclamationmark_octagon</i>
                        </div>
                        Anda masih dalam tahap verifikasi oleh administrator {this.state.sekolah.nama}. Selama belum terverifikasi, Anda belum dapat melakukan aktivitas di sekolah ini.
                    </CardContent>
                </Card>
                }

                <BlockTitle style={{marginTop:'8px', display:'inline-flex'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                    <img src={"https://be.diskuis.id"+this.state.sekolah.gambar_logo} style={{width:'20px', height:'20px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} />&nbsp;
                    {/* <img src={localStorage.getItem('api_base')+this.state.sekolah.gambar_logo} style={{width:'20px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} />&nbsp; */}
                    <span style={{marginTop:'4px'}}>{this.state.sekolah.nama}</span>
                </BlockTitle>
                <List>
                    <ListItem disabled={(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? true : false)} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)}  onClick={this.setSekolahInduk} style={{cursor:'pointer'}}>
                        {parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? <i className="icons f7-icons" slot="media">heart_fill</i> : <i className="icons f7-icons" slot="media">heart</i>}
                        {(parseInt(this.state.sekolah_pengguna_record.sekolah_utama) === 1 ? 'Sekolah Induk' : 'Set Sebagai Sekolah Induk')}
                    </ListItem>
                    <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                        <i className="icons f7-icons" slot="media">person_crop_rectangle</i>
                        Profil Guru
                    </ListItem>
                    <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                        <i className="icons f7-icons" slot="media">checkmark_rectangle</i>
                        Absensi Kehadiran Guru
                    </ListItem>
                    <ListItem className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""} disabled={(parseInt(this.state.sekolah_pengguna_record.valid) !== 1 ? true : false)} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.routeParams.sekolah_id}>
                        <i className="icons f7-icons" slot="media">calendar  </i>
                        Rekap Kehadiran Harian
                    </ListItem>
                </List>
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
      simpanSekolahUtama: actions.simpanSekolahUtama
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

export default (connect(mapStateToProps, mapDispatchToProps)(menuSekolahGuru));
  