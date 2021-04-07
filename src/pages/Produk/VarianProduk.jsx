import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar, NavLeft
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class VarianProduk extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            produk_id: this.$f7route.params['produk_id'] ? this.$f7route.params['produk_id'] : null
        },
        jenis_tiket: {
            rows: [],
            total: 0
        },
        varian_produk: {
            rows: [],
            total: 0
        },
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
        this.props.getVarian(this.state.routeParams).then((result)=>{
            this.setState({
                varian_produk: result.payload
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

    klikNext = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getVarian(this.state.routeParams).then((result)=>{
                this.setState({
                    varian_produk: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }
    
    klikPrev = () => {
        // alert('tes');
        this.$f7.dialog.preloader()
        
        this.setState({
            ...this.state,
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
            }
        },()=>{
            this.props.getVarian(this.state.routeParams).then((result)=>{
                this.setState({
                    varian_produk: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                })
            })
        })
    }

    backClick = (e) => {
        e.preventDefault()
        this.$f7router.navigate("/Produk/")
    }

    edit = (varian_produk_id) => {
        this.$f7router.navigate('/FormVarianProduk/'+this.$f7route.params['produk_id']+'/'+varian_produk_id)
    }
    
    render()
    {
        return (
            <Page name="VarianProduk" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false}>
                    <NavLeft>
                        <Link onClick={this.backClick}>
                            <i className="f7-icons">chevron_left</i>
                            Produk
                        </Link>
                    </NavLeft>
                    <NavTitle sliding>Varian Produk</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" style={{textAlign:'left', marginBottom:'-40px', marginTop:'-8px', marginLeft:'8px'}}>
                                        <span style={{fontSize:'10px'}}>Nama Produk:</span><br/>
                                        <b>{this.state.produk.nama} {this.state.produk.kode_produk ? (<>{this.state.produk.kode_produk}</>) : ''}</b>
                                    </Col>
                                    <Col width="100" style={{textAlign:'right'}}>
                                        {/* <Button onClick={this.filter} raised style={{display:'inline-flex' , marginTop:'0px', marginRight:'4px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                        </Button> */}
                                        <Button raised fill style={{display:'inline-flex' , marginTop:'0px'}} onClick={()=>this.$f7router.navigate('/FormVarianProduk/'+this.state.routeParams.produk_id)}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                            Tambah
                                        </Button>
                                        
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>

                        <Card style={{marginBottom:'50px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="100">
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.varian_produk.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.varian_produk.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.varian_produk.total)} dari {this.formatAngka(this.state.varian_produk.total)} Varian Produk</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        <Row noGap>
                                            {this.state.varian_produk.rows.map((option)=>{
                                                return(
                                                    <Col width="100">
                                                        <Card style={{margin:'4px'}}>
                                                            <CardContent>
                                                                <div>
                                                                    {option.nama}
                                                                </div>
                                                                <Button style={{display:'inline-flex', float:'right', marginTop:'-25px', marginRight:'-16px'}} popoverOpen={".popover-menu-"+option.varian_produk_id}><i className="icons f7-icons" style={{fontSize:'20px'}}>ellipsis_vertical</i></Button>
                                                                <Popover className={"popover-menu-"+option.varian_produk_id} style={{minWidth:'300px'}}>
                                                                    <List>
                                                                        <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.varian_produk_id)} />
                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.varian_produk_id)} />
                                                                    </List>
                                                                </Popover>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Col>
                                </Row>
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

export default (connect(mapStateToProps, mapDispatchToProps)(VarianProduk));
  