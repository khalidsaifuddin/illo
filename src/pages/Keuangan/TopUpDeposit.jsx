import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Popup, Searchbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import TambahKuisPlaylist from '../Playlist/TambahKuisPlaylist';

class TopUpDeposit extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
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
        pengguna: {},
        deposit_siswa: {
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        this.props.getPengguna(this.state.routeParams).then((result)=>{
            if(result.payload.total > 0){
                
                this.setState({
                    pengguna: result.payload.rows[0]
                })

            }
        })

    }

    setValue = (key) => (e) => {
        this.setState({
            deposit_siswa: {
                ...this.state.deposit_siswa,
                [key]: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.deposit_siswa)
        })
    }

    setValueTes = (nominal) => {
        this.setState({
            deposit_siswa: {
                ...this.state.deposit_siswa,
                nominal: nominal
            }
        },()=>{
            console.log(this.state.deposit_siswa)
        })
    }

    simpanDeposit = () => {
        this.$f7.dialog.preloader()

        this.props.simpanDepositSiswa(this.state.deposit_siswa).then((result)=>{
            this.$f7.dialog.close()

            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.alert('Berhasil topup!', 'Berhasil',()=>{
                    this.$f7router.navigate('/SakuSiswa/'+this.$f7route.params['sekolah_id'])
                })
            }else{
                //gagal
                this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon lakukan proses top kembali dan ulangi prosesnya', 'Peringatan')
            }
        }).catch(error => {
            // catch and handle error or do nothing
            // alert('gagal')
            this.$f7.dialog.close();
            this.$f7.dialog.alert('Anda sedang offline atau jaringan di tempat Anda sedang tidak stabil. Mohon lakukan proses top kembali dan ulangi prosesnya', 'Peringatan')
        })
    }

    render()
    {
        return (
            <Page name="TopUpDeposit" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Top Up Saku Siswa</NavTitle>
                </Navbar>

                <Row style={{marginBottom:'40px'}}>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                    <Col tabletWidth="80" desktopWidth="70" width="100">

                        <Card>
                            <CardContent style={{padding:'16px'}}>
                                
                                <h3>{this.state.pengguna.nama}</h3>
                                <div style={{marginBottom:'8px'}}>Pilih nominal Top Up</div>

                                <Button raised style={{display:'inline-flex', marginRight:'4px', marginTop:'4px', background: (this.state.deposit_siswa.nominal === 10000 ? '#434343' : '#ffffff'), color: (this.state.deposit_siswa.nominal === 10000 ? '#ffffff' : '#434343')}} onClick={()=>this.setValueTes(10000)}>Rp 10.000</Button>
                                <Button raised style={{display:'inline-flex', marginRight:'4px', marginTop:'4px', background: (this.state.deposit_siswa.nominal === 20000 ? '#434343' : '#ffffff'), color: (this.state.deposit_siswa.nominal === 20000 ? '#ffffff' : '#434343')}} onClick={()=>this.setValueTes(20000)}>Rp 20.000</Button>
                                <Button raised style={{display:'inline-flex', marginRight:'4px', marginTop:'4px', background: (this.state.deposit_siswa.nominal === 50000 ? '#434343' : '#ffffff'), color: (this.state.deposit_siswa.nominal === 50000 ? '#ffffff' : '#434343')}} onClick={()=>this.setValueTes(50000)}>Rp 50.000</Button>
                                <Button raised style={{display:'inline-flex', marginRight:'4px', marginTop:'4px', background: (this.state.deposit_siswa.nominal === 100000 ? '#434343' : '#ffffff'), color: (this.state.deposit_siswa.nominal === 100000 ? '#ffffff' : '#434343')}} onClick={()=>this.setValueTes(100000)}>Rp 100.000</Button>
                                <Button raised style={{display:'inline-flex', marginRight:'4px', marginTop:'4px', background: (this.state.deposit_siswa.nominal === 200000 ? '#434343' : '#ffffff'), color: (this.state.deposit_siswa.nominal === 200000 ? '#ffffff' : '#434343')}} onClick={()=>this.setValueTes(200000)}>Rp 200.000</Button>

                                <div style={{marginTop:'16px', marginBottom:'16px'}}>Atau isi nominal di bawah ini:</div>
                                <List>
                                    <ListInput
                                        // label="Nominal Top Up"
                                        type="number"
                                        placeholder="Nominal Top Up..."
                                        clearButton
                                        value={this.state.deposit_siswa.nominal || ''}
                                        onChange={this.setValue('nominal')}
                                    />
                                </List>
                                <br/>
                                <br/>
                                <Button raised fill style={{display:'inline-flex'}} onClick={this.simpanDeposit}>
                                    <i className="f7-icons" style={{fontSize:'20px'}}>arrow_up_circle_fill</i>&nbsp;
                                    Top Up Sekarang
                                </Button>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getDepositSiswaSekolah: actions.getDepositSiswaSekolah,
      getPengguna: actions.getPengguna,
      simpanDepositSiswa: actions.simpanDepositSiswa
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TopUpDeposit));
  