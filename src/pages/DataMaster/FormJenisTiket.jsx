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

class FormJenisTiket extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            jenis_tiket_id: this.$f7route.params['jenis_tiket_id'],
            induk_jenis_tiket_id: this.$f7route.params['induk_jenis_tiket_id'],
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        } ,
        unit:{
            rows: [],
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

        if(this.$f7route.params['jenis_tiket_id'] && this.$f7route.params['jenis_tiket_id'] !== '-'){
            this.props.getJenisTiket(this.state.routeParams).then((result)=>{
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
                        jenis_tiket_id: result.payload
                    }
                })
            })
        }

        this.props.getUnit(this.state.routeParams).then((result)=>{
            this.setState({
                unit: result.payload
            })
        })
    }

    setValue = (type) => (e) => {

        console.log(type)

        // alert('tes')
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanJenisTiket(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/JenisTiket/")
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
            <Page name="FormJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.jenis_tiket_id ? "Edit" : "Tambah"} Jenis Tiket</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="Nama Jenis Tiket"
                                        type="text"
                                        placeholder="Nama Jenis Tiket"
                                        clearButton
                                        value={this.state.routeParams.nama}
                                        onChange={this.setValue('nama')}
                                    />   
                                    <ListInput
                                        label="Keterangan Jenis Tiket"
                                        type="text"
                                        placeholder="Keterangan Jenis Tiket"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    />
                                    <ListInput
                                        label="Unit"
                                        type="select"
                                        value={this.state.routeParams.unit_id}
                                        placeholder="Pilih Unit..."
                                        onChange={this.setValue('unit_id')}
                                    >
                                        <option value={null} disabled selected={(this.state.routeParams.unit_id ? false : true)}>-</option>
                                        {this.state.unit.rows.map((option)=>{
                                            return (
                                                <option value={option.unit_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
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
      getUnit: Actions.getUnit,
      getJenisTiket: Actions.getJenisTiket,
      simpanJenisTiket: Actions.simpanJenisTiket,
      generateUUID: Actions.generateUUID
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormJenisTiket));
  