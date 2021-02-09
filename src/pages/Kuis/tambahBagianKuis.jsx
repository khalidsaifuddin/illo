import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, CardContent, Card, Row, Col, Button, CardHeader, List, ListItem, BlockTitle, ListInput
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import moment from 'moment';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class tambahBagianKuis extends Component {
    state = {
        error: null,
        loading: true,
        routeParams: {
            kuis_id: this.$f7route.params['kuis_id'] ? this.$f7route.params['kuis_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse(localStorage.getItem('user')).pengguna_id,
            bagian_kuis_id: (this.$f7route.params['bagian_kuis_id'] !== '-' && this.$f7route.params['bagian_kuis_id'] !== null) ? this.$f7route.params['bagian_kuis_id'] : null,
            induk_bagian_kuis_id: this.$f7route.params['induk_bagian_kuis_id'] ? this.$f7route.params['induk_bagian_kuis_id'] : null,
            nama: ''
        },
        sesi_kuis: {},
        pengguna_kuis: {},
        induk_aspek: {},
        aspek: {}
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

        console.log(this.$f7route.params['bagian_kuis_id'])

        if(this.$f7route.params['induk_bagian_kuis_id']){
            this.props.getAspek({bagian_kuis_id: this.$f7route.params['induk_bagian_kuis_id']}).then((result)=>{
                this.setState({
                    induk_aspek: this.props.aspek.rows[0]
                })
            })
        }

        if(this.$f7route.params['bagian_kuis_id'] && this.$f7route.params['bagian_kuis_id'] !== '-'){
            this.props.getAspek({bagian_kuis_id: this.$f7route.params['bagian_kuis_id']}).then((result)=>{
                this.setState({
                    aspek: this.props.aspek.rows[0],
                    routeParams: {...this.state.routeParams, ...this.props.aspek.rows[0]}
                })
            })
        }

    }

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

    editorChange = (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                isi: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    simpanAspek = () => {
        this.$f7.dialog.preloader();

        this.setState({
            routeParams: {
                ...this.state.routeParams
                // induk_bagian_kuis_id: this.$f7route.params['bagian_kuis_id'] ? this.$f7route.params['bagian_kuis_id'] : null
            }
        },()=>[
            
            this.props.simpanAspek(this.state.routeParams).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.close();
                    // this.$f7.dialog.alert('Simpan berhasil!', 'Berhasil');
                    this.$f7router.navigate('/tambahKuis/'+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['kuis_id']);
                }else{
                    //gagal
                    this.$f7.dialog.close();
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
                }
            })

        ])        
    }

    setRouteParams = (key) => (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        })
    }

    render()
    {
        return (
            <Page name="tambahBagianKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Bagian</NavTitle>
                    {/* <NavTitle sliding>Tambah {(this.$f7route.params['bagian_kuis_id'] && this.$f7route.params['bagian_kuis_id'] !== '-') ? "Sub Bagian" : "Bagian"}</NavTitle> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        {/* {(this.$f7route.params['bagian_kuis_id'] && this.$f7route.params['bagian_kuis_id'] !== '-') &&
                        <Card>
                            <CardContent>
                                Bagian: <b>{this.state.induk_aspek.nama}</b>
                            </CardContent>
                        </Card>
                        } */}
                        <Card>
                            <CardContent>

                                <List>
                                    <ListInput
                                        label={"Kode Bagian"}
                                        type="text"
                                        placeholder={"Kode Bagian"}
                                        clearButton
                                        outline
                                        onChange={this.setRouteParams('kode_bagian')}
                                        defaultValue={this.state.routeParams.kode_bagian}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                    </ListInput>
                                    <ListInput
                                        label={(this.$f7route.params['bagian_kuis_id'] && this.$f7route.params['bagian_kuis_id'] !== '-') ? "Nama Sub Bagian" : "Nama Bagian"}
                                        type="textarea"
                                        placeholder={(this.$f7route.params['bagian_kuis_id'] && this.$f7route.params['bagian_kuis_id'] !== '-') ? "Nama Sub Bagian" : "Nama Bagian"}
                                        clearButton
                                        outline
                                        onChange={this.setRouteParams('nama')}
                                        defaultValue={this.state.routeParams.nama}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                    </ListInput>
                                </List>
                                <br/>
                                <br/>
                                <Button className="bawahCiriBiru" raised fill onClick={this.simpanAspek}>
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
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getSesiKuis: Actions.getSesiKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanTugas: Actions.simpanTugas,
      getTugas: Actions.getTugas,
      simpanAspek: Actions.simpanAspek,
      getAspek: Actions.getAspek
    }, dispatch);
}

function mapStateToProps({ App, Pengawas, Kuis, Tugas }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sesi_kuis: Kuis.sesi_kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        Tugas: Tugas.tugas,
        aspek: Kuis.aspek
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahBagianKuis));
  