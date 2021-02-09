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
import Dropzone from 'react-dropzone';


class gantiGambar extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        pengguna: {},
        gambar_pengguna: '',
        file_gambar_pengguna: ''
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
        this.$f7.dialog.preloader()
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                pengguna: this.props.pengguna.rows[0],
                file_gambar_pengguna: this.props.pengguna.rows[0].gambar
            },()=>{
                this.$f7.dialog.close()
            });
        });
        
    }

    acceptedFile = (file) => {
        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){
            
            this.props.generateUUID(this.state.routeParams).then((result)=>{

                this.setState({
                    gambar_pengguna: file[0].name,
                    guid_gambar: this.props.uuid_kuis,
                    routeParams:{
                        ...this.state.routeParams,
                        gambar_pengguna: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    },
                    pengguna:{
                        ...this.state.pengguna,
                        gambar: 'https://be.diskuis.id/assets/berkas/'+this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                    }
                },()=>{

                    return new Promise(
                        (resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            // xhr.open('POST', localStorage.getItem('api_base') + '/api/Ruang/upload');
                            xhr.open('POST', 'https://be.diskuis.id' + '/api/Ruang/upload');
                            xhr.onload = this.uploadBerhasil;
                            xhr.onerror = this.uploadGagal;
                            const data = new FormData();
                            data.append('image', file[0]);
                            data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                            data.append('guid', this.state.guid_gambar);
                            data.append('jenis', 'gambar_pengguna');
                            xhr.send(data);
                        }
                    )
                })

            })

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
            return true;
        }

    }

    uploadBerhasil = (xhr) => {
        // console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_pengguna: response.filename,
                loading: false,
                pengguna: {
                    ...this.state.pengguna,
                    gambar: 'https://be.diskuis.id'+response.filename
                }
            },()=>{
                console.log(this.state.pengguna)
            })
        }
    }

    simpanPengguna = () => {
        this.props.setPengguna({...this.state.routeParams, data:this.state.pengguna}).then((result)=> {
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                localStorage.setItem('user', JSON.stringify(result.payload.rows[0]))

                this.$f7router.navigate('/ProfilPengguna')
            })
        })
    }

    render()
    {
        const position = [this.state.lintang, this.state.bujur];

        return (
            <Page name="gantiGambar" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Ganti Gambar Pengguna</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <Card>
                            <CardContent>
                                    
                                <Dropzone className="droping" onDrop={this.acceptedFile}>
                                {({getRootProps, getInputProps}) => (
                                    <section>
                                        <div {...getRootProps()} style={{minHeight:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_pengguna !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                            <input {...getInputProps()} />
                                            {this.state.file_gambar_pengguna === '' &&
                                            <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                            }
                                            {this.state.file_gambar_pengguna !== '' &&
                                            <>
                                            {/* <img style={{height:'150px'}} src={this.state.file_gambar_pengguna.search("http") < 0 ? localStorage.getItem('api_base')+this.state.file_gambar_pengguna : this.state.file_gambar_pengguna} /> */}
                                            <img style={{height:'150px'}} src={this.state.file_gambar_pengguna.search("http") < 0 ? 'https://be.diskuis.id'+this.state.file_gambar_pengguna : this.state.file_gambar_pengguna} />
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_pengguna === '' &&
                                            <>
                                            <p>Tarik dan seret gambar pilihan Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                            {this.state.gambar_pengguna !== '' && this.state.file_gambar_pengguna === '' &&
                                            <>
                                            <p style={{fontSize:'20px'}}>{this.state.gambar_pengguna}</p>
                                            <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                            </>
                                            }
                                        </div>
                                    </section>
                                )}
                                </Dropzone>
                                <Button raised fill large className="bawahCiriBiru" style={{marginTop:'8px'}} onClick={this.simpanPengguna}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
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
      generateUUID: actions.generateUUID,
      setPengguna: actions.setPengguna
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        uuid_kuis: Kuis.uuid_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(gantiGambar));
  