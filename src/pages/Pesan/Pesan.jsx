import React, {Component} from 'react';
import {
    Page, Popup, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader, Badge
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';

import io from 'socket.io-client';

class Pesan extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        pengguna: {},
        popupOpened: false,
        daftar_pesan: {
            rows:  [],
            total: 0
        }
    }

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    bulan = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    componentDidMount = () => {

        this.props.getDaftarPesan(this.state.routeParams).then((result)=>{
            this.setState({
                daftar_pesan: result.payload
            },()=>{
                this.props.daftar_pesan.rows.map((option)=>{
                    socket.emit('tampilPesan', null, option.kelompok_pesan_id, JSON.parse(localStorage.getItem('user')), (err) => {
                        if (err) {
                            //gagal
                        }
                    })
                })
            })
        })

        let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
        socket.on('updatePesan', (pengguna_id) => {
        
            this.props.getDaftarPesan(this.state.routeParams).then((result)=>{
                this.setState({
                    daftar_pesan: result.payload
                })
            })
    
        })
        
    }

    bukaPopup = (params) => {
        // this.setState({
        //     popupOpened: !this.state.popupOpened
        // },()=>{
        //     this.scrollToBottom()
        // })

        this.$f7router.navigate("/TampilPesan/"+params)
    }

    setPopupOpened = () => {
        this.setState({
            popupOpened: false
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    render()
    {

        return (
            <Page name="Pesan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pesan (Beta)</NavTitle>
                    {/* <NavRight>
                        <Button>
                            <i className="f7-icons">plus</i>
                        </Button>
                    </NavRight> */}
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        <Card style={{margin:'0px', borderRadius:'0px'}}>
                            <CardContent style={{padding:'16px'}}>
                                <List mediaList>
                                    {this.props.daftar_pesan.rows.map((option)=>{
                                        let tgl = new Date(option.waktu_pesan_terakhir);
                                        let tanggal = moment(option.waktu_pesan_terakhir).format('D') + ' ' + this.bulan[(moment(option.waktu_pesan_terakhir).format('M')-1)] + ' ' + moment(option.waktu_pesan_terakhir).format('YYYY');
                                        let waktu = moment(option.waktu_pesan_terakhir).format('H') + ':' + moment(option.waktu_pesan_terakhir).format('mm');
                                        
                                        if(tanggal === moment().format('D') + ' ' + this.bulan[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                            tanggal = 'Hari ini';
                                        }

                                        return (
                                            <ListItem 
                                                className="daftarPesan" 
                                                style={{cursor:'pointer'}} 
                                                onClick={()=>this.bukaPopup(option.kelompok_pesan_id)} 
                                                title={(option.pengguna_id_1 !== JSON.parse(localStorage.getItem('user')).pengguna_id ? option.nama_1 : option.nama_2)} 
                                                subtitle={<>
                                                {option.pengguna_id_pengirim === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                                <>
                                                {parseInt(option.sudah_dibaca) !== 1 &&
                                                <i className="f7-icons" style={{fontSize:'15px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#bababa')}}>checkmark_alt_circle</i>
                                                }
                                                {parseInt(option.sudah_dibaca) === 1 &&
                                                <i className="f7-icons" style={{fontSize:'15px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#bababa')}}>checkmark_alt_circle_fill</i>
                                                }
                                                &nbsp;
                                                </>
                                                }
                                                <span style={{fontSize:'12px'}}>
                                                    {option.konten}
                                                </span>
                                                </>}
                                            >
                                                <img
                                                slot="media"
                                                src={(option.pengguna_id_1 !== JSON.parse(localStorage.getItem('user')).pengguna_id ? option.gambar_1 : option.gambar_2)}
                                                width="44"
                                                style={{borderRadius:'50%'}}
                                            />
                                                {option.belum_dibaca > 0 && <Badge slot="after" color="red">{option.belum_dibaca}</Badge>}
                                                <div className="tanggal_pesan_terakhir">{tanggal}, {waktu}</div>
                                            </ListItem>
                                        )
                                    })}
                                    {/* <ListItem style={{cursor:'pointer'}} onClick={()=>this.bukaPopup('params')} title="Yellow Submarine" subtitle="Isi pesannya....">
                                        <img
                                        slot="media"
                                        src="https://cdn.framework7.io/placeholder/fashion-88x88-1.jpg"
                                        width="44"
                                        style={{borderRadius:'50%'}}
                                        />
                                    </ListItem>
                                    <ListItem style={{cursor:'pointer'}} onClick={()=>this.bukaPopup('params')} title="Don't Stop Me Now" subtitle="Isi pesannya lagi...">
                                        <img
                                        slot="media"
                                        src="https://cdn.framework7.io/placeholder/fashion-88x88-2.jpg"
                                        width="44"
                                        style={{borderRadius:'50%'}}
                                        />
                                    </ListItem>
                                    <ListItem style={{cursor:'pointer'}} onClick={()=>this.bukaPopup('params')} title="Billie Jean" subtitle="Mantab jaya...">
                                        <img
                                        slot="media"
                                        src="https://cdn.framework7.io/placeholder/fashion-88x88-3.jpg"
                                        width="44"
                                        style={{borderRadius:'50%'}}
                                        />
                                    </ListItem> */}
                                </List>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna,
      getDaftarPesan: actions.getDaftarPesan
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Pesan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        daftar_pesan: Pesan.daftar_pesan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Pesan));
  