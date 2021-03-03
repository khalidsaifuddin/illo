import React, {Component} from 'react';
import {
    Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class CardKanban extends Component {
    render () {
        return (
            <Card key={this.props.option.tiket_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                <CardContent style={{padding:'8px'}}>
                    <Row>
                        <Col width="100" tabletWidth="100" desktopWidth="100" style={{display:'inline-flex'}}>
                            <img src={this.props.option.gambar_pembuat} style={{height:'45px', width:'45px', borderRadius:'50%', marginLeft:'4px'}} />
                            <Row noGap style={{width:'100%', marginLeft:'8px'}}>

                                <Col width="80" tabletWidth="80" desktopWidth="80">
                                    <Link href={"/TampilTiket/"+this.props.option.tiket_id}><b>{this.props.option.judul}</b></Link>
                                    <div style={{fontSize:'10px', marginTop:'8px'}}>
                                        {this.props.option.pembuat &&
                                        <>
                                        Oleh <b>{this.props.option.pembuat}</b>&nbsp;&bull;&nbsp;
                                        </>
                                        }
                                        {this.props.last_update}
                                    </div>
                                </Col>
                                <Col width="20" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}}>
                                    <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+this.props.option.tiket_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                    <Popover className={"popover-menu-"+this.props.option.tiket_id} style={{minWidth:'200px'}}>
                                        <List>
                                            <ListItem link="#" popoverClose title="Rincian" onClick={()=>this.edit(this.props.option.tiket_id)} />
                                            <ListItem link="#" popoverClose title="Ubah Status" onClick={()=>this.ubahStatus(this.props.option.tiket_id)} />
                                        </List>
                                    </Popover>
                                </Col>
                                <Col width="100">
                                    <div className="kotakKontenTiket" style={{fontSize:'10px', width:'100%', overflow:'hidden', marginBottom:'8px', borderTop:'0px solid #eee', borderBottom:'0px solid #eee', marginTop:'4px'}}>
                                        {this.props.option.konten_strip.substring(0,200)} {this.props.option.konten_strip.length > 200 && <span>...</span>}
                                    </div>
                                    <div style={{fontSize:'10px'}}>
                                        {this.props.option.keterangan &&
                                        <>
                                        {this.props.option.keterangan}&nbsp;&bull;&nbsp;
                                        </>
                                        }
                                    </div>
                                </Col>
                                <Col width="100" style={{textAlign:'right'}}>
                                    <Button className={"color-theme-"+this.props.warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginBottom:'4px'}}>
                                        <i className='f7-icons' style={{fontSize:'12px'}}>speedometer</i>&nbsp;
                                        {this.props.option.prioritas_tiket}
                                    </Button>
                                    <Button className={"color-theme-"+(parseInt(this.props.option.status_tiket_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginLeft:'4px', marginBottom:'4px'}}>
                                        <i className='f7-icons' style={{fontSize:'12px'}}>ticket</i>&nbsp;
                                        {this.props.option.status_tiket}
                                    </Button>
                                </Col>
                                <Col width="100" className="hilangDiDesktop">
                                    <Button className={"color-theme-"+this.props.warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px'}}>
                                        <i className='f7-icons' style={{fontSize:'15px'}}>speedometer</i>&nbsp;
                                        {this.props.option.prioritas_tiket}
                                    </Button>
                                    <Button className={"color-theme-"+(parseInt(this.props.option.status_tiket_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginLeft:'4px', marginBottom:'4px'}}>
                                        <i className='f7-icons' style={{fontSize:'15px'}}>ticket</i>&nbsp;
                                        {this.props.option.status_tiket}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardContent>
            </Card>
        )
    }
}

class DaftarTiket extends Component {
    state = {
        error: null,
        loadingKuis: false,
        tiket: {
            rows: [],
            total: 0
        },
        routeParams: {
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            start: 0,
            limit: 20
        },
        tiket: {
            rows: [],
            total: 0
        },
        popupFilter: false,
        popupTampilan: false,
        status_tiket: {
            rows: [],
            total: 0
        },
        prioritas_tiket: {
            rows: [],
            total: 0
        },
        tampilan: 'kanban',
        tiket_kanban: {
            1:{
                rows: [],
                total: 0
            },
            2:{
                rows: [],
                total: 0
            },
            3:{
                rows: [],
                total: 0
            },
            4:{
                rows: [],
                total: 0
            }
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

        if(this.state.tampilan === 'list'){
            
            this.props.getTiket({...this.state.routeParams, limit: 20, status_tiket_id: null}).then((result)=>{
                this.setState({
                    tiket: result.payload
                },()=>{
                    this.props.getStatusTiket(this.state.routeParams).then((result)=>{
                        this.setState({
                            status_tiket: result.payload
                        },()=>{
                            this.props.getPrioritasTiket(this.state.routeParams).then((result)=>{
                                this.setState({
                                    prioritas_tiket: result.payload
                                })
                            })
                        })
                    })
                })
            })

        }else{
            this.props.getStatusTiket({...this.state.routeParams}).then((result)=>{
                this.setState({
                    status_tiket: result.payload
                },()=>{

                    this.state.status_tiket.rows.map((option)=>{
                        this.props.getTiket({...this.state.routeParams, status_tiket_id: option.status_tiket_id}).then((result)=>{
                            this.setState({
                                tiket_kanban: {
                                    ...this.state.tiket_kanban,
                                    [option.status_tiket_id]: result.payload
                                }
                            })
                        })
                    })

                    setTimeout(() => {
                        console.log(this.state)

                        this.props.getPrioritasTiket(this.state.routeParams).then((result)=>{
                            this.setState({
                                prioritas_tiket: result.payload
                            })
                        })
                    }, 3000);

                })
            })
        }

    }

    tambah = () => {
        this.$f7router.navigate("/FormTiket/")
    }

    edit = (tiket_id) => {
        this.$f7router.navigate('/TampilTiket/'+tiket_id)
    }

    filter = () => {
        this.setState({popupFilter:!this.state.popupFilter})
    }
    
    tampilan = () => {
        this.setState({popupTampilan:!this.state.popupTampilan})
    }

    tampilFilter = () => {
        this.$f7.dialog.preloader()
        this.props.getTiket(this.state.routeParams).then((result)=>{
            this.setState({
                tiket: result.payload,
                popupFilter: !this.state.popupFilter
            },()=>{
                this.$f7.dialog.close()
            })
        })
    }

    resetFilter = () => {
        this.$f7.dialog.preloader()

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: null,
                status_tiket_id: null,
                prioritas_tiket_id: null
            }
        },()=>{

            this.props.getTiket(this.state.routeParams).then((result)=>{
                this.setState({
                    tiket: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    setValue = (type) => (e) => {

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.target.value
            }
        },()=>{
            console.log(this.state)
        })
    }

    ubahTampilan = (tipe) => {
        this.setState({
            tampilan:tipe, 
            popupTampilan:false
        },()=>{
            this.componentDidMount()
        })
    }
    
    render()
    {
        return (
            <Page className="kelolaTiket" name="DaftarTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Daftar Tiket</NavTitle>
                </Navbar>

                <Popup className="demo-popup" opened={this.state.popupTampilan} onPopupClosed={() => this.setState({popupTampilan : false})}>
                    <Page>
                        <Navbar title="Pengaturan Tampilan">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <Row noGap>
                                <Col width="50" style={{textAlign:'right'}}>
                                    <Link onClick={()=>this.ubahTampilan('kanban')}>
                                        <Card>
                                            <CardContent style={{textAlign:'center'}}>
                                                <img src="./static/icons/kanban.png" style={{height:'100px'}} />
                                                <br/>
                                                <BlockTitle className="blocktitle_netral">Kanban</BlockTitle>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Col>
                                <Col width="50">
                                    <Link onClick={()=>this.ubahTampilan('list')}>
                                        <Card>
                                            <CardContent style={{textAlign:'center'}}>
                                                <img src="./static/icons/list.png" style={{height:'100px'}} />
                                                <br/>
                                                <BlockTitle className="blocktitle_netral">Daftar</BlockTitle>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>

                <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                    <Page>
                        <Navbar title="Filter Daftar Tiket">
                            <NavRight>
                                <Link popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                            <List>
                                <Searchbar
                                    className="searchbar-demo"
                                    // expandable
                                    placeholder="Judul Tiket"
                                    searchContainer=".search-list"
                                    searchIn=".item-title"
                                    onChange={this.cariKeyword}
                                ></Searchbar>
                                <ListInput
                                    label="Status"
                                    type="select"
                                    value={this.state.routeParams.status_tiket_id}
                                    placeholder="Pilih Status..."
                                    onChange={this.setValue('status_tiket_id')}
                                >
                                    <option value={null} disabled selected={(this.state.routeParams.status_tiket_id ? false : true)}>-</option>
                                    {this.state.status_tiket.rows.map((option)=>{
                                        return (
                                            <option value={option.status_tiket_id}>{option.nama}</option>
                                        )
                                    })}
                                </ListInput>
                                <ListInput
                                    label="Prioritas"
                                    type="select"
                                    value={this.state.routeParams.prioritas_tiket_id}
                                    placeholder="Pilih Prioritas..."
                                    onChange={this.setValue('prioritas_tiket_id')}
                                >
                                    <option value={null} disabled selected={(this.state.routeParams.prioritas_tiket_id ? false : true)}>-</option>
                                    {this.state.prioritas_tiket.rows.map((option)=>{
                                        return (
                                            <option value={option.prioritas_tiket_id}>{option.nama}</option>
                                        )
                                    })}
                                </ListInput>
                            </List>
                        </Block>
                        <Block>
                            <Row>
                                <Col width="50">
                                    <Button raised onClick={this.resetFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                        Reset Filter
                                    </Button>
                                </Col>
                                <Col width="50">
                                    <Button raised fill onClick={this.tampilFilter}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                        Tampilkan Data
                                    </Button>
                                </Col>
                            </Row>
                        </Block>
                    </Page>
                </Popup>
                {this.state.tampilan === 'list' &&
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                <Row>
                                    {/* <Col width="100" tabletWidth="100">
                                        <Card>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="10" style={{textAlign:'center'}}>
                                                        <i className="icons f7-icons" style={{fontSize:'40px', color:'#434343'}}>info_circle</i>
                                                    </Col>
                                                    <Col width="90" style={{color:'#434343', fontSize:'10px', paddingLeft:'8px'}}>
                                                        Tiket adalah laporan permasalahan/kendala yang membutuhkan penanganan dari tim support. Silakan buat tiket baru jika Anda mengalami kendala dan ingin mendapat solusi dari kendala tersebut
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    </Col> */}
                                    <Col width="100" tabletWidth="100">
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.tiket.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.tiket.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.tiket.total)} dari {this.formatAngka(this.state.tiket.total)} tiket</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right'}}>
                                        <Button style={{display:'inline-flex' , marginTop:'0px', marginRight:'4px'}} onClick={this.tampilan}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>rectangle_grid_1x2</i>&nbsp;
                                            Tampilan
                                        </Button>
                                        <Button style={{display:'inline-flex' , marginTop:'0px'}} onClick={this.filter}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                        </Button>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.tiket.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.tiket.rows.map((option)=>{
                                            let last_update = '';
                                            let warna_prioritas = 'blue'

                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            switch (parseInt(option.prioritas_tiket_id)) {
                                                case 1:
                                                    warna_prioritas = 'black'
                                                    break;
                                                case 2:
                                                    warna_prioritas = 'red'
                                                    break;
                                                case 3:
                                                    warna_prioritas = 'deeporange'
                                                    break;
                                                case 4:
                                                    warna_prioritas = 'yellow'
                                                    break;
                                                default:
                                                    break;
                                            }

                                            return (
                                                <Card key={option.tiket_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            {/* <Col width="20" tabletWidth="15" desktopWidth="10" style={{textAlign:'center'}}> */}
                                                            {/* </Col> */}
                                                            <Col width="100" tabletWidth="100" desktopWidth="100" style={{display:'inline-flex'}}>
                                                                <img src={option.gambar_pembuat} style={{height:'45px', width:'45px', borderRadius:'50%', marginLeft:'4px'}} />
                                                                <Row noGap style={{width:'100%', marginLeft:'8px'}}>

                                                                    <Col width="90" tabletWidth="60" desktopWidth="65">
                                                                        <Link href={"/TampilTiket/"+option.tiket_id}><b>{option.judul}</b></Link>
                                                                        <div style={{fontSize:'10px', marginTop:'8px'}}>
                                                                            {option.pembuat &&
                                                                            <>
                                                                            Oleh <b>{option.pembuat}</b>&nbsp;&bull;&nbsp;
                                                                            </>
                                                                            }
                                                                            {last_update}
                                                                        </div>
                                                                    </Col>
                                                                    <Col width="0" tabletWidth="30" desktopWidth="30" style={{textAlign:'right'}} className="hilangDiMobile">
                                                                        <Button className={"color-theme-"+warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginBottom:'4px'}}>
                                                                            <i className='f7-icons' style={{fontSize:'12px'}}>speedometer</i>&nbsp;
                                                                            {option.prioritas_tiket}
                                                                        </Button>
                                                                        <Button className={"color-theme-"+(parseInt(option.status_tiket_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginLeft:'4px', marginBottom:'4px'}}>
                                                                            <i className='f7-icons' style={{fontSize:'12px'}}>ticket</i>&nbsp;
                                                                            {option.status_tiket}
                                                                        </Button>
                                                                    </Col>
                                                                    <Col width="10" tabletWidth="10" desktopWidth="5" style={{textAlign:'right'}}>
                                                                        <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+option.tiket_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                        <Popover className={"popover-menu-"+option.tiket_id} style={{minWidth:'200px'}}>
                                                                            <List>
                                                                                <ListItem link="#" popoverClose title="Rincian" onClick={()=>this.edit(option.tiket_id)} />
                                                                            </List>
                                                                        </Popover>
                                                                    </Col>
                                                                    <Col width="100">
                                                                        <div className="kotakKontenTiket" style={{fontSize:'10px', width:'100%', overflow:'hidden', marginBottom:'8px', borderTop:'0px solid #eee', borderBottom:'0px solid #eee', marginTop:'4px'}}>
                                                                            {option.konten_strip.substring(0,200)} {option.konten_strip.length > 200 && <span>...</span>}
                                                                        </div>
                                                                        <div style={{fontSize:'10px'}}>
                                                                            {option.keterangan &&
                                                                            <>
                                                                            {option.keterangan}&nbsp;&bull;&nbsp;
                                                                            </>
                                                                            }
                                                                        </div>
                                                                    </Col>
                                                                    <Col width="100" className="hilangDiDesktop">
                                                                        <Button className={"color-theme-"+warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px'}}>
                                                                            <i className='f7-icons' style={{fontSize:'15px'}}>speedometer</i>&nbsp;
                                                                            {option.prioritas_tiket}
                                                                        </Button>
                                                                        <Button className={"color-theme-"+(parseInt(option.status_tiket_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginLeft:'4px', marginBottom:'4px'}}>
                                                                            <i className='f7-icons' style={{fontSize:'15px'}}>ticket</i>&nbsp;
                                                                            {option.status_tiket}
                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                    
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
                }
                {this.state.tampilan === 'kanban' &&
                <Row>
                    <Col width="100">
                        <Card>
                            <CardContent style={{padding:'4px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right'}}>
                                        <Button style={{display:'inline-flex', marginRight:'4px'}} onClick={this.tampilan}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>rectangle_grid_1x2</i>&nbsp;
                                            Tampilan
                                        </Button>
                                        <Button style={{display:'inline-flex'}} onClick={this.filter}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                        </Button>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px', display:'inline-flex', width:'100%', overflow:'scroll', minHeight:'700px'}}>  

                                <Card className="kotakKanban">
                                    <CardHeader style={{fontWeight:'bold'}}>
                                        Open
                                    </CardHeader>
                                    {/* <CardKanban testing="ini isinya" /> */}
                                    <CardContent className="isiKanban">
                                        {this.state.tiket_kanban[1].total < 1 &&
                                        <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                            Belum ada data
                                        </div>
                                        }
                                        {this.state.tiket_kanban[1].rows.map((option)=>{
                                            let last_update = '';
                                            let warna_prioritas = 'blue'

                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            switch (parseInt(option.prioritas_tiket_id)) {
                                                case 1:
                                                    warna_prioritas = 'black'
                                                    break;
                                                case 2:
                                                    warna_prioritas = 'red'
                                                    break;
                                                case 3:
                                                    warna_prioritas = 'deeporange'
                                                    break;
                                                case 4:
                                                    warna_prioritas = 'yellow'
                                                    break;
                                                default:
                                                    break;
                                            }

                                            if(parseInt(option.status_tiket_id) === 1){

                                                return (
                                                    <CardKanban option={option} warna_prioritas={warna_prioritas} last_update={last_update} />
                                                )
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                <Card className="kotakKanban">
                                    <CardHeader style={{fontWeight:'bold'}}>
                                        Dalam Penanganan
                                    </CardHeader>
                                    <CardContent className="isiKanban">
                                        {this.state.tiket_kanban[4].total < 1 &&
                                        <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                            Belum ada data
                                        </div>
                                        }
                                        {this.state.tiket_kanban[4].rows.map((option)=>{
                                            let last_update = '';
                                            let warna_prioritas = 'blue'

                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            switch (parseInt(option.prioritas_tiket_id)) {
                                                case 1:
                                                    warna_prioritas = 'black'
                                                    break;
                                                case 2:
                                                    warna_prioritas = 'red'
                                                    break;
                                                case 3:
                                                    warna_prioritas = 'deeporange'
                                                    break;
                                                case 4:
                                                    warna_prioritas = 'yellow'
                                                    break;
                                                default:
                                                    break;
                                            }

                                            if(parseInt(option.status_tiket_id) === 4){

                                                return (
                                                    <CardKanban option={option} warna_prioritas={warna_prioritas} last_update={last_update} />
                                                )
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                <Card className="kotakKanban">
                                    <CardHeader style={{fontWeight:'bold'}}>
                                        Solved
                                    </CardHeader>
                                    <CardContent className="isiKanban">
                                        {this.state.tiket_kanban[2].total < 1 &&
                                        <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                            Belum ada data
                                        </div>
                                        }
                                        {this.state.tiket_kanban[2].rows.map((option)=>{
                                            let last_update = '';
                                            let warna_prioritas = 'blue'

                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            switch (parseInt(option.prioritas_tiket_id)) {
                                                case 1:
                                                    warna_prioritas = 'black'
                                                    break;
                                                case 2:
                                                    warna_prioritas = 'red'
                                                    break;
                                                case 3:
                                                    warna_prioritas = 'deeporange'
                                                    break;
                                                case 4:
                                                    warna_prioritas = 'yellow'
                                                    break;
                                                default:
                                                    break;
                                            }

                                            if(parseInt(option.status_tiket_id) === 2){

                                                return (
                                                    <CardKanban option={option} warna_prioritas={warna_prioritas} last_update={last_update} />
                                                )
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                <Card className="kotakKanban">
                                    <CardHeader style={{fontWeight:'bold'}}>
                                        Pending
                                    </CardHeader>
                                    <CardContent className="isiKanban">
                                        {this.state.tiket_kanban[3].total < 1 &&
                                        <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                            Belum ada data
                                        </div>
                                        }
                                        {this.state.tiket_kanban[3].rows.map((option)=>{
                                            let last_update = '';
                                            let warna_prioritas = 'blue'

                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                            }

                                            switch (parseInt(option.prioritas_tiket_id)) {
                                                case 1:
                                                    warna_prioritas = 'black'
                                                    break;
                                                case 2:
                                                    warna_prioritas = 'red'
                                                    break;
                                                case 3:
                                                    warna_prioritas = 'deeporange'
                                                    break;
                                                case 4:
                                                    warna_prioritas = 'yellow'
                                                    break;
                                                default:
                                                    break;
                                            }

                                            if(parseInt(option.status_tiket_id) === 3){

                                                return (
                                                    <CardKanban option={option} warna_prioritas={warna_prioritas} last_update={last_update} />
                                                )
                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent', maxWidth:'0px'}}>
                                    <CardContent style={{padding:'4px', display:'inline-flex', width:'100%', overflow:'scroll'}}>  
                                        &nbsp;
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
                }
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getTiket: Actions.getTiket,
      getStatusTiket: Actions.getStatusTiket,
      getPrioritasTiket: Actions.getPrioritasTiket
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(DaftarTiket));
  