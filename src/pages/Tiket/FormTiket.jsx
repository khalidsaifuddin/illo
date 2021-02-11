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

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class FormTiket extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            konten: ''
        },
        induk_unit: {},
        jenis_tiket: {
            rows: [],
            total: 0
        },
        unit: {
            rows: [],
            total: 0
        },
        prioritas_tiket: {
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

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    componentDidMount = () => {
        this.props.getUnit(this.state.routeParams).then((result)=>{
            this.setState({
                unit: result.payload
            },()=>{
                
                this.props.getPrioritasTiket(this.state.routeParams).then((result)=>{
                    this.setState({
                        prioritas_tiket: result.payload
                    })
                })

            })
        })
    }

    setValue = (type) => (e) => {

        // console.log(e.currentTarget.value);return true;
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }
        },()=>{

            if(type === 'unit_id'){

                this.props.getJenisTiket({unit_id: this.state.routeParams.unit_id}).then((result)=>{
                    this.setState({
                        jenis_tiket: result.payload
                    })
                })

            }

            console.log(this.state)
        })
    }

    simpan = () => {
        this.$f7.dialog.preloader('Menyimpan...')
        this.props.simpanTiket(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                    this.$f7router.navigate("/DaftarTiket/")
                })
            }else{
                this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert("Saat ini kami belum dapat menyimpan data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
        })
    }

    editorChange = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                konten: e
            }
        },()=>{
            
        });
    }

    render()
    {
        return (
            <Page name="FormTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.unit_id ? "Edit" : "Buat"} Tiket</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Unit"
                                        type="select"
                                        value={this.state.routeParams.unit_id}
                                        placeholder="Unit..."
                                        onChange={this.setValue('unit_id')}
                                    >
                                        <option value={99} disabled selected={(this.state.routeParams.unit_id ? false : true)}>-</option>
                                        {this.state.unit.rows.map((option)=>{   
                                            return (
                                                <option value={option.unit_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Jenis Tiket"
                                        type="select"
                                        value={this.state.routeParams.jenis_tiket_id}
                                        placeholder="Jenis Tiket..."
                                        onChange={this.setValue('jenis_tiket_id')}
                                    >
                                        <option value={99} disabled selected={(this.state.routeParams.jenis_tiket_id ? false : true)}>-</option>
                                        {this.state.jenis_tiket.rows.map((option)=>{
                                            return (
                                                <option value={option.jenis_tiket_id}>{option.nama} ({option.unit})</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Judul"
                                        type="text"
                                        placeholder="Judul"
                                        clearButton
                                        value={this.state.routeParams.judul}
                                        onChange={this.setValue('judul')}
                                    />
                                    <ListItem>
                                        <ReactQuill 
                                            theme="snow" 
                                            onChange={this.editorChange} 
                                            modules={this.modules}
                                            formats={this.formats}
                                            value={this.state.routeParams.konten}
                                            on
                                            style={{width:'100%'}}
                                        />
                                    </ListItem>    
                                    <ListInput
                                        label="Prioritas"
                                        type="select"
                                        value={this.state.routeParams.prioritas_tiket_id}
                                        placeholder="Prioritas..."
                                        onChange={this.setValue('prioritas_tiket_id')}
                                    >
                                        <option value={99} disabled selected={(this.state.routeParams.prioritas_tiket_id ? false : true)}>-</option>
                                        {this.state.prioritas_tiket.rows.map((option)=>{   
                                            return (
                                                <option value={option.prioritas_tiket_id}>{option.nama}</option>
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
      generateUUID: Actions.generateUUID,
      simpanTiket: Actions.simpanTiket,
      getJenisTiket: Actions.getJenisTiket,
      getUnit: Actions.getUnit,
      getPrioritasTiket: Actions.getPrioritasTiket,
      getTiket: Actions.getTiket,
      simpanTiket: Actions.simpanTiket
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormTiket));
  