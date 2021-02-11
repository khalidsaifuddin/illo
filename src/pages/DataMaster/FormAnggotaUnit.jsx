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

class FormAnggotaUnit extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            unit_id: (this.$f7route.params['unit_id'] && this.$f7route.params['unit_id'] !== '-') ? this.$f7route.params['unit_id'] : null,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        induk_unit: {},
        pengguna: {
            rows: [],
            total: 0
        },
        unit: {},
        sudah_cari: 0
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

    componentDidMount = () => {
        if(this.$f7route.params['unit_id'] && this.$f7route.params['unit_id'] !== '-'){
            this.props.getUnit(this.state.routeParams).then((result)=>{
                if(result.payload.total > 0){

                    this.setState({
                        unit: result.payload.rows[0],
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

    cariKeyword = (e) => {
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    cari = () => {
        this.$f7.dialog.preloader()
        this.props.getPengguna({keyword: this.state.routeParams.keyword}).then((result)=>{
            this.setState({
                pengguna: result.payload,
                sudah_cari: 1
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    simpanAnggotaUnit = (pengguna_id) => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanAnggotaUnit({
            pengguna_id: pengguna_id,
            unit_id: this.$f7route.params['unit_id']
        }).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.alert('Berhasil menyimpan data', 'Berhasil', ()=>{
                    this.$f7router.navigate("/AnggotaUnit/"+this.$f7route.params['unit_id'])
                })
            }else{
                //gagal
                this.$f7.dialog.alert('Ada kesalahan pada saat menyimpan data. Mohon coba kembali dalam beberapa saat', 'Gagal')
            }
        })
    }

    render()
    {
        return (
            <Page name="FormAnggotaUnit" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Anggota Unit</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <BlockTitle style={{marginBottom:'4px', marginTop:'4px', fontWeight:'bold', fontSize:'15px'}}>
                                    Unit {this.state.unit.nama}
                                </BlockTitle>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <List style={{marginBottom:'8px', paddingTop:'16px'}}>
                                    <Searchbar
                                        className="searchbar-demo"
                                        // expandable
                                        placeholder="Cari Nama Pengguna..."
                                        searchContainer=".search-list"
                                        searchIn=".item-title"
                                        onChange={this.cariKeyword}
                                    ></Searchbar>
                                </List>
                                {/* <div style={{borderTop:'1px solid #ccc', marginTop:'16px', marginBottom:'8px'}}>&nbsp;</div> */}
                                <Button onClick={this.cari} style={{display:'inline-flex'}} raised fill className="color-theme-teal">
                                    <i className="f7-icons" style={{fontSize:'20px'}}>search</i>&nbsp;
                                    Cari Pengguna
                                </Button>
                                <BlockTitle style={{marginLeft:'0px'}}>
                                    Hasil Pencarian Pengguna ({this.state.pengguna.total > 0 ? this.state.pengguna.total : '0'})
                                </BlockTitle>
                                {parseInt(this.state.sudah_cari) === 0 &&
                                <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px'}}>
                                    <CardContent style={{padding:'8px', textAlign:'center'}}>
                                    <img src="/static/icons/cari_vector.png" style={{width:'60%'}} />
                                    <br/> 
                                    <span style={{color:'#4B75CB'}}>
                                        Mohon lakukan pencarian terlebih dahulu
                                    </span>
                                    </CardContent>
                                </Card>
                                }
                                {this.state.pengguna.rows.map((option)=>{

                                    let create_date = '';
                                    create_date = moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ', ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                    if(moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                        create_date = 'Hari ini, ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
                                    }

                                    return (
                                        <Card key={option.pengguna_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="15" tabletWidth="10" desktopWidth="10" style={{textAlign:'center'}}>
                                                        <img src={option.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                    </Col>
                                                    <Col width="60" tabletWidth="70" desktopWidth="80" style={{paddingLeft:'4px'}}>
                                                        <span className={"hilangDiDesktop"}><b>{option.nama}</b></span>
                                                        <span className={"hilangDiMobile"}><b>{option.nama}</b> ({option.username})</span>
                                                        <div style={{fontSize:'10px'}} className="hilangDiDesktop">
                                                            {option.username}
                                                        </div>
                                                        <div style={{fontSize:'10px'}}>
                                                            Daftar sejak {create_date}
                                                        </div>
                                                    </Col>
                                                    <Col width="25" tabletWidth="20" desktopWidth="10" style={{textAlign:'right'}}>
                                                        <Button raised fill style={{display:'inline-flex'}} onClick={()=>this.simpanAnggotaUnit(option.pengguna_id)}>
                                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                                            Pilih
                                                        </Button>
                                                        {/* <Button popoverOpen={".popover-menu-"+option.jenis_tiket_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                        <Popover className={"popover-menu-"+option.jenis_tiket_id} style={{minWidth:'300px'}}>
                                                            <List>
                                                                <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.jenis_tiket_id)} />
                                                                <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.jenis_tiket_id)} />
                                                            </List>
                                                        </Popover> */}
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
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
      getUnit: Actions.getUnit,
      getPengguna: Actions.getPengguna,
      simpanAnggotaUnit: Actions.simpanAnggotaUnit
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormAnggotaUnit));
  