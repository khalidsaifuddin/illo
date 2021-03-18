import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';
import Produk from '../DataMaster/Produk';

class Keranjang extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        keranjang: {
            rows: [],
            total: 0
        },
        mitra_terdekat: (localStorage.getItem('mitra_terdekat') && localStorage.getItem('mitra_terdekat') !== '' ? JSON.parse(localStorage.getItem('mitra_terdekat')) : {thi})
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
    
    bulan_singkat = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Ags',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        setTimeout(() => {
            
            this.$f7.dialog.preloader()
            this.props.getKeranjang(this.state.routeParams).then((result)=>{
                this.setState({
                    keranjang: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        }, 1000);
    }

    kurangJumlah = (keranjang_id) => {
        
        let keranjangRows = []

        this.state.keranjang.rows.map((option)=>{
            if(option.keranjang_id === keranjang_id){
                option.jumlah--

                this.props.simpanKeranjang(option)

            }

            keranjangRows.push(option)
        })

        this.setState({
            keranjang: {
                ...this.state.keranjang,
                rows: [...keranjangRows]
            }
        })
    }

    tambahJumlah = (keranjang_id) => {
        // let jumlah = 0;
        let keranjangRows = []

        this.state.keranjang.rows.map((option)=>{
            if(option.keranjang_id === keranjang_id){
                option.jumlah++

                this.props.simpanKeranjang(option)

                // this.setState({
                //     keranjang: {
                //         ...this.state.keranjang,
                //         rows: [
                //             ...this.state.keranjang.rows,
                //             option
                //         ]
                //     }
                // })
            }

            keranjangRows.push(option)
        })

        this.setState({
            keranjang: {
                ...this.state.keranjang,
                rows: [...keranjangRows]
            }
        })
    }

    hapus = (option) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang Anda?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader()

            option.soft_delete = 1

            this.props.simpanKeranjang(option).then((result)=>{
                // this.$f7.dialog.close()
                this.props.getKeranjang(this.state.routeParams).then((result)=>{
                    this.setState({
                        keranjang: result.payload
                    },()=>{
                        this.$f7.dialog.close()
                    })
                })
            })
        })
    }
    
    render()
    {
        return (
            <Page name="Keranjang" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Keranjang</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card noShadow noBorder style={{background: 'transparent'}}>
                            <CardContent style={{paddingLeft:'8px', paddingRight:'0px', paddingBottom:'0px', paddingTop:'0px'}}>
                                <div style={{display:'inline-flex', marginTop:'8px'}}>
                                    <img src={this.state.mitra_terdekat[0].gambar ? this.state.mitra_terdekat[0].gambar : '/static/icons/illo-logo-icon.png'} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                    <div style={{marginLeft:'8px'}}>
                                        {this.state.mitra_terdekat.length > 0 &&
                                        <div>
                                            <b style={{fontSize:'14px'}}>{this.state.mitra_terdekat[0].pengguna}</b>
                                            <br/>
                                            <span style={{fontSize:'12px'}}>
                                                {this.state.mitra_terdekat[0].jenis_mitra} - {parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 5 ? <>{this.state.mitra_terdekat[0].provinsi}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 4 ? <>{this.state.mitra_terdekat[0].kabupaten}</> : (parseInt(this.state.mitra_terdekat[0].jenis_mitra_id) === 3 ? <>{this.state.mitra_terdekat[0].kecamatan}</> : <></>))}
                                            </span>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'0px'}}>
                                {this.state.keranjang.rows.map((option)=>{
                                    return (
                                        <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <CardContent>
                                                <Row>
                                                    <Col width="80" tabletWidth="90">
                                                        <div style={{display:'inline-flex'}}>
                                                            <div className="kotakProdukKeranjang" style={{
                                                                backgroundImage:'url('+localStorage.getItem('api_base')+(option.gambar_produk.length > 0 ? option.gambar_produk[0].nama_file : '/assets/berkas/3577232-1.jpg')+')', 
                                                                backgroundSize:'cover',
                                                                backgroundPosition:'center'
                                                            }}></div>
                                                            <div style={{marginLeft:'8px'}}>
                                                                <b style={{fontSize:'14px'}}>{option.nama}</b>
                                                                <br/>
                                                                <div style={{display:'inline-flex', marginTop:'8px'}}>
                                                                    <Button onClick={()=>this.kurangJumlah(option.keranjang_id)} raised style={{display:'inline-flex', maxWidth:'25px', height:'25px', borderRadius:'0px'}}>
                                                                        <i className="f7-icons" style={{fontSize:'15px'}}>minus</i>
                                                                    </Button>
                                                                    <div style={{width:'40px', height:'25px', textAlign:'center', borderBottom:'1px solid #ccc', marginLeft:'8px', marginRight:'8px'}}>
                                                                        {option.jumlah}
                                                                    </div>
                                                                    <Button onClick={()=>this.tambahJumlah(option.keranjang_id)} raised style={{display:'inline-flex', maxWidth:'25px', height:'25px', borderRadius:'0px'}}>
                                                                        <i className="f7-icons" style={{fontSize:'15px'}}>plus</i>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col width="20" tabletWidth="10" style={{textAlign:'right'}}>
                                                        <Link onClick={()=>this.hapus(option)}>
                                                            <i className="f7-icons" style={{fontSize:'15px'}}>trash</i>&nbsp;Hapus
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    
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
      generateUUID: Actions.generateUUID,
      getKeranjang: Actions.getKeranjang,
      simpanKeranjang: Actions.simpanKeranjang
    }, dispatch);
}

function mapStateToProps({ App, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        keranjang: Produk.keranjang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Keranjang));
  