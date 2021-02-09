import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';


class formPlaylist extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        pengguna: {},
        playlist: {
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id,
            playlist_id: this.$f7route.params['playlist_id'] ? this.$f7route.params['playlist_id'] : null,
            status_privasi:2,
            kolaboratif: 0
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
        
        if(this.$f7route.params['playlist_id']){
            this.props.getPlaylist({playlist_id: this.$f7route.params['playlist_id']}).then((result)=>{
                this.setState({
                    playlist: result.payload.rows[0]
                })
            })
        }
    
    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;
        
        this.setState({
            playlist: {
                ...this.state.playlist,
                [key]: value
            }
        },()=>{
            //after effect
        });

    }

    changeToggle = (tipe, key) => (e) => {
        // console.log(e);
        this.setState({
            [tipe]: {
                ...this.state[tipe],
                [key] : (e ? '0' : 1)
            }
        },()=>{
            // console.log(this.state);
        });
    }

    gantiStatusPrivasi = (b) => {
        
        this.setState({
            ...this.state,
            playlist: {
                ...this.state.playlist,
                status_privasi: b.target.value
            }
        });
    }

    simpanPlaylist = () => {
        this.$f7.dialog.preloader()
        // console.log('oke')
        // console.log(this.state.playlist)
        this.props.simpanPlaylist(this.state.playlist).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Playlist berhasil disimpan', 'Berhasil', ()=>{
                    this.$f7router.navigate('/Playlist/')
                })
            }else{
                //gagal
                this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat', 'Gagal')
            }
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="formPlaylist" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['playlist_id'] ? 'Edit' : 'Tambah'} Playlist Kuis</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <Card>
                            <CardContent>
                                <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListInput
                                        label="Nama Playlist"
                                        type="textarea"
                                        resizable
                                        placeholder="Nama Playlist"
                                        clearButton
                                        onChange={this.setStateValue('nama')}
                                        defaultValue={this.state.playlist.nama}
                                    >
                                    </ListInput>
                                    <ListInput
                                        label="Status Privasi"
                                        type="select"
                                        placeholder="Pilih Status Privasi Playlist Kuis..."
                                        name="status_privasi" 
                                        value={this.state.playlist.status_privasi} 
                                        // defaultValue={2}
                                        onChange={this.gantiStatusPrivasi}
                                    >
                                        <option value="1">Publik</option>
                                        <option value="2">Privat</option>    
                                    </ListInput>
                                    <ListItem title="Kolaboratif" footer="Pengguna lain bisa menambahkan kuis ke dalam playlist ini">
                                        <Toggle slot="after" checked={this.state.playlist ? (parseInt(this.state.playlist.kolaboratif) === 1 ? true : false) : false} value={1} onToggleChange={this.changeToggle('playlist', 'kolaboratif')} />
                                    </ListItem>
                                </List>
                                <br/>
                                {!this.$f7route.params['playlist_id'] &&
                                <Button raised fill className="bawahCiriBiru" onClick={this.simpanPlaylist}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                                    Buat Playlist
                                </Button>
                                }
                                {this.$f7route.params['playlist_id'] &&
                                <Button raised fill className="bawahCiriBiru" onClick={this.simpanPlaylist}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan Playlist
                                </Button>
                                }
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
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
      simpanPlaylist: actions.simpanPlaylist,
      getPlaylist: actions.getPlaylist
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(formPlaylist));
  