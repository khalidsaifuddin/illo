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
        // sekolah: {
        //     rows: [],
        //     total: 0
        // },
        deposit_siswa: {
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        this.props.getPengguna(this.state.routeParams).then((result)=>{
            if(result.payload.total > 0){
                
                this.setState({
                    pengguna: result.payload.rows[0]
                },()=>{
                    this.props.getDepositSiswa(this.state.routeParams).then((result)=>{
                        this.setState({
                            deposit_siswa: result.payload
                        },()=>{
                            this.props.getSekolahIndividu(this.state.routeParams).then((result)=>{
                                if(result.payload.total > 0){
                                    this.setState({
                                        sekolah: result.payload.rows[0]
                                    })

                                }
                            })
                        })
                    })
                })

            }
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
            this.props.getDepositSiswa(this.state.routeParams).then((result)=>{
                this.setState({
                    deposit_siswa: result.payload
                },()=>{

                    this.$f7.dialog.close()

                })
            });
        });
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
            this.props.getDepositSiswa(this.state.routeParams).then((result)=>{
                this.setState({
                    deposit_siswa: result.payload
                },()=>{

                    this.$f7.dialog.close()

                })
            });
        });
    }

    render()
    {
        return (
            <Page name="TopUpDeposit" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Riwayat Transaksi Saku Siswa</NavTitle>
                    <NavRight>
                        <Button raised onClick={()=>this.$f7router.navigate("/TopUp/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>
                            < i className="f7-icons" style={{fontSize:'20px'}}>plus</i>
                            Top Up
                        </Button>
                    </NavRight>
                </Navbar>
                <Row style={{marginBottom:'40px'}}>
                    <Col tabletWidth="10" desktopWidth="15" width="0"></Col>
                    <Col tabletWidth="80" desktopWidth="70" width="100">

                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                
                                <Link href={"/tampilPengguna/"+this.state.pengguna.pengguna_id}><h2 style={{marginTop:'8px', fontSize:'20px'}}>{this.state.pengguna.nama}</h2></Link>
                                <br/>
                                <Link href={"/sekolah"+this.state.sekolah.sekolah_id}><h4 style={{marginTop:'0px'}}>{this.state.sekolah.nama}</h4></Link>
                                
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i class="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.deposit_siswa.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.deposit_siswa.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.deposit_siswa.total)} dari {this.formatAngka(this.state.deposit_siswa.total)} record</span>
                                        </div>
                                    </div>
                                </div>
                                {this.state.deposit_siswa.rows.map((option)=>{

                                    let tgl = new Date(option.create_date);
                                    let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                    let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                    return (
                                        <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="100" tabletWidth="60">
                                                        ID transaksi:
                                                        <br/><b>{option.pengguna_id}</b>
                                                        <br/>
                                                        {/* Penginput:
                                                        <br/> */}
                                                    </Col>
                                                    <Col width="100" tabletWidth="20">
                                                        Tanggal Transaksi:<br/>
                                                        <b>{tanggal}, {waktu}</b>
                                                    </Col>
                                                    <Col width="100" tabletWidth="20" style={{textAlign:'right', fontWeight:'bold', fontSize:'15px'}}>
                                                        <span style={{fontSize:'10px'}}>Rp</span>&nbsp;<b>{this.formatAngka(option.nominal)}</b>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                                
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
      getDepositSiswa: actions.getDepositSiswa,
      simpanDepositSiswa: actions.simpanDepositSiswa,
      getSekolahIndividu: actions.getSekolahIndividu
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TopUpDeposit));
  