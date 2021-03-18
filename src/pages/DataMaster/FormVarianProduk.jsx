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

class FormVarianProduk extends Component {
    state = {
        error: null,
        routeParams: {
            produk_id: (this.$f7route.params['produk_id'] && this.$f7route.params['produk_id'] !== '-') ? this.$f7route.params['produk_id'] : null,
            varian_produk_id: (this.$f7route.params['varian_produk_id'] && this.$f7route.params['varian_produk_id'] !== '-') ? this.$f7route.params['varian_produk_id'] : null
        },
        varian_produk: {},
        produk: {}
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
        if(this.$f7route.params['varian_produk_id'] && this.$f7route.params['varian_produk_id'] !== '-'){
            this.props.getVarian(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    },()=>{
                        if(this.state.routeParams.produk_id){
                            this.props.getProduk({produk_id: this.$f7route.params['produk_id']}).then((result)=>{
                                this.setState({
                                    produk: result.payload.total > 0 ? result.payload.rows[0] : {}
                                })
                            })
                        }
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        varian_produk_id: result.payload
                    }
                },()=>{
                    if(this.state.routeParams.produk_id){
                        this.props.getProduk({produk_id: this.$f7route.params['produk_id']}).then((result)=>{
                            this.setState({
                                produk: result.payload.total > 0 ? result.payload.rows[0] : {}
                            })
                        })
                    }
                })
            })

        }

        
    }

    setValue = (type) => (e) => {
        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanVarian(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/VarianProduk/"+this.state.routeParams.produk_id)
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    render()
    {
        return (
            <Page name="FormVarianProduk" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.produk_id ? "Edit" : "Tambah"} Varian Produk</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        <Card>
                            <CardContent>
                                Nama Produk:<br/>
                                <b>{this.state.produk.nama} {this.state.produk.kode_produk ? (<>{this.state.produk.kode_produk}</>) : ''}</b>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Nama Varian"
                                        type="text"
                                        placeholder="Nama Varian"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                    />
                                </List>
                                <div style={{borderTop:'1px solid #ccc', marginTop:'16px', marginBottom:'8px'}}>&nbsp;</div>
                                <Button onClick={this.simpan} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
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
      simpanVarian: Actions.simpanVarian,
      getVarian: Actions.getVarian,
      getProduk: Actions.getProduk
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormVarianProduk));
  