import React, {Component} from 'react';
import {
    Searchbar, Radio, Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Toolbar, Tabs, Tab, Segmented, Icon
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class FormTimPenjualan extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 10
        },
        pengguna: {
            rows: [],
            total: 0
        },
        tim_penjualan: {
            rows: [],
            total: 0
        },
        popupOpen: false
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
        
        clearInterval()

    }

    setValue = (key) => (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        },()=>{

        })
    }

    ketikCari = (e) => {
        // console.log(e.currentTarget.value);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    cariPengguna = () => {
        this.$f7.dialog.preloader()
        // alert('tes')
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: result.payload,
                sudah_cari: 1
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    pilihPengguna = (pengguna) => {

        console.log(pengguna)
        // console.log(this.props.klien)

        this.$f7.dialog.preloader()

        this.props.simpanTimPenjualan({
            pengguna_id: pengguna.pengguna_id,
            aktif: 1,
            soft_delete: 0
        }).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Berhasil menambahkan Tim Penjualan', 'Berhasil', ()=>{
                    this.$f7router.navigate('/TimPenjualan/')
                })
            }else{
                //gagal
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
        })
    }

    render()
    {
        return (
            <Page name="FormTimPenjualan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Tim Penjualan</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Row noGap>
                            <Col width="100">

                                <Card noBorder noShadow style={{marginBottom:'16px'}}>
                                    <CardContent>
                                        
                                    <Searchbar
                                            className="searchbar-demo"
                                            placeholder="Cari Nama/Email Pengguna..."
                                            searchContainer=".search-list"
                                            searchIn=".item-title"
                                            customSearch={true}
                                            backdrop={false}
                                            onChange={this.ketikCari}
                                            value={this.state.routeParams.keyword}
                                        ></Searchbar>
                                        <Button raised fill style={{display:'inline-flex', marginTop:'8px', paddingLeft:'16px', paddingRight:'16px'}} onClick={this.cariPengguna}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>search</i>&nbsp;Cari
                                        </Button>

                                        <BlockTitle style={{marginLeft:'0px'}}>Hasil Pencarian ({this.state.pengguna.total > 0 ? this.state.pengguna.total : '0'} pengguna ditemukan)</BlockTitle>
                                        {this.state.pengguna.total < 1 && this.state.sudah_cari > 0 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Pengguna tidak ditemukan
                                        </div>
                                        }
                                        {this.state.pengguna.rows.map((option)=>{
                                            return (
                                                <Card key={option.tim_helpdesk_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            <Col width="60" tabletWidth="60" desktopWidth="60" style={{display:'inline-flex'}}>
                                                                <div style={{
                                                                    backgroundColor: '#434343',
                                                                    backgroundImage: 'url('+(option.gambar ? option.gambar : 'https://be.diskuis.id/assets/img/boy.jpg')+')',
                                                                    backgroundSize: 'cover',
                                                                    backgroundRepeat: 'no-repeat',
                                                                    backgroundPosition: 'center',
                                                                    minHeight:'45px',
                                                                    minWidth:'45px',
                                                                    maxHeight:'45px',
                                                                    maxWidth:'45px',
                                                                    borderRadius:'50%'
                                                                }}>&nbsp;</div>
                                                                <div style={{marginLeft:'16px'}}>
                                                                    
                                                                    <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                                    <div style={{fontSize:'10px'}}>
                                                                        {option.username &&
                                                                        <>
                                                                        {option.username}
                                                                        </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col width="40" tabletWidth="40" desktopWidth="10" style={{textAlign:'right'}}>
                                                                <Button raised onClick={()=>this.pilihPengguna(option)}>
                                                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>checkmark_circle</i>&nbsp;Pilih Pengguna
                                                                </Button>
                                                                
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}

                                    </CardContent>
                                </Card>
                                
                            </Col>
                        </Row>
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getPengguna: Actions.getPengguna,
      simpanTimPenjualan: Actions.simpanTimPenjualan
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormTimPenjualan));
  