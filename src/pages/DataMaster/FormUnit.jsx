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

class FormUnit extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            unit_id: (this.$f7route.params['unit_id'] && this.$f7route.params['unit_id'] !== '-') ? this.$f7route.params['unit_id'] : null,
            induk_unit_id: this.$f7route.params['induk_unit_id'] ? this.$f7route.params['induk_unit_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        induk_unit: {}
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
        if(this.$f7route.params['unit_id'] && this.$f7route.params['unit_id'] !== '-'){
            this.props.getUnit(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        routeParams: {
                            ...result.payload.rows[0]
                        }
                    })

                }
            })
            
        }else{
            this.props.generateUUID(this.state.routeParams).then((result)=>{
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        unit_id: result.payload
                    }
                })
            })

            if(this.$f7route.params['induk_unit_id']){
                this.props.getUnit({unit_id: this.$f7route.params['induk_unit_id']}).then((result)=>{
                    if(result.payload.total > 0){
                        this.setState({
                            induk_unit: result.payload.rows[0]
                        })
                    }
                })
            }
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
        this.props.simpanUnit(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/Unit/")
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
            <Page name="FormUnit" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.unit_id ? "Edit" : "Tambah"} Unit</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            {this.$f7route.params['induk_unit_id'] &&
                            <CardHeader>
                                Induk Unit: <b>{this.state.induk_unit.nama}</b>
                            </CardHeader>
                            }
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Nama Unit"
                                        type="text"
                                        placeholder="Nama Unit"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                    />
                                    <ListInput
                                        label="Keterangan Unit"
                                        type="text"
                                        placeholder="Keterangan Unit"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    />
                                    <ListInput
                                        label="Alamat Unit"
                                        type="text"
                                        placeholder="Alamat Unit"
                                        clearButton
                                        value={this.state.routeParams.alamat}
                                        onChange={this.setValue('alamat')}
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
      simpanUnit: Actions.simpanUnit,
      getUnit: Actions.getUnit
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormUnit));
  