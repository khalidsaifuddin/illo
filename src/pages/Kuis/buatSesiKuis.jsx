import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


import moment from 'moment';

class buatSesiKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: (!this.$f7route.params['kuis_orang_lain'] ? JSON.parse(localStorage.getItem('user')).pengguna_id : null),
            pengguna_id_orang_lain: (this.$f7route.params['kuis_orang_lain'] ? JSON.parse(localStorage.getItem('user')).pengguna_id : null),
            kuis_id: this.$f7route.params['kuis_id'],
            jawaban_diacak: 0,
            tampilkan_jawaban_benar: 0,
            tanggal_mulai: '',
            tanggal_selesai: '',
            jumlah_percobaan: 1
        },
        loading:true,
        kuis: {
            kuis_id: '',
            nama: '-'
        },
        pengguna_kuis: {
            kuis_id: '',
            pengguna_id: '',
            create_date: '2000-01-02 00:00:00'
        },
        ruang: {
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
        this.props.getKuis(this.state.routeParams).then(()=>{
            this.setState({
                kuis: this.props.kuis.rows[0]
            })
        });

        this.props.getRuang(this.state.routeParams).then(()=>{
            this.setState({
                ruang: this.props.ruang
            })
        });

    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: value
            }
        },()=>{
            console.log(this.state);
        });

    }

    changeToggle = (key) => (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state);
        });
    }

    setSesiKuis = () => {
        // if(this.state.routeParams.tanggal_mulai){
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                tanggal_mulai: this.state.routeParams.tanggal_mulai.replace("T", " "),
                tanggal_selesai: this.state.routeParams.tanggal_selesai.replace("T", " "),
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{
            this.props.setSesiKuis(this.state.routeParams).then((result)=>{
                if(result.payload.success){
                    this.$f7router.navigate('/KodeKuis/'+result.payload.rows[0].sesi_kuis_id);
                }else{
                    this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon tunggu beberapa saat lagi dan coba kembali!','Peringatan');
                }
            });
        });    
        // }

    }

    assignRuang = (b) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                ruang_id: b.target.value
            }
        });
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="buatSesiKuis" hideBarsOnScroll className="halamanKuis">
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Buat Sesi Kuis</NavTitle>
                    <NavTitleLarge>
                        Buat Sesi Kuis
                    </NavTitleLarge>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <Card>
                            <CardContent>
                                <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListItem className="judul_sesi_kuis">
                                        Sesi Kuis <b>{this.state.kuis.judul}</b> oleh {JSON.parse(localStorage.getItem('user')).nama}
                                    </ListItem>
                                    <ListItem>
                                        Tanggal {tanggal}
                                    </ListItem>
                                    <ListInput
                                        label="Keterangan Sesi"
                                        type="textarea"
                                        resizable
                                        placeholder="Keterangan Sesi Kuis ini (Contoh: Kuis MTK XII IPA 1)"
                                        clearButton
                                        onChange={this.setStateValue('keterangan')}
                                        // defaultValue={this.props.sesi_kuis.keterangan}
                                    ></ListInput>
                                    <ListItem
                                        title="Assign ke Ruang"
                                        info="Kosongkan bila tidak di assign ke ruang manapun"
                                        smartSelect
                                        smartSelectParams={{openIn: 'sheet'}}
                                    >
                                        <select name="ruang_id" defaultValue={99} onChange={this.assignRuang}>
                                            {/* <option value="mac">Mac</option>
                                            <option value="windows">Windows</option> */}
                                            <option value={99}>Tidak di assign ke ruang</option>
                                            {this.state.ruang.rows.map((option)=>{
                                                return (
                                                    <option value={option.ruang_id}>{option.nama}</option>
                                                )
                                            })}
                                        </select>
                                    </ListItem>
                                    <ListItem className="infoRuangSesi">
                                        * Kosongkan ruang bila tidak di assign ke ruang manapun
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        
                        <BlockTitle style={{color:'white'}}>Pengaturan</BlockTitle>
                        <Card>
                            <CardContent>
                                <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListItem>
                                        <span>Jawaban Diacak</span>
                                        <Toggle value={1} onToggleChange={this.changeToggle('jawaban_diacak')} />
                                    </ListItem>
                                    <ListItem>
                                        <span>Tampilkan Jawaban yang benar</span>
                                        <Toggle value={1} onToggleChange={this.changeToggle('tampilkan_jawaban_benar')} />
                                    </ListItem>
                                    <ListInput
                                        label="Waktu Mulai"
                                        type="datetime-local"
                                        // style={{width:'100%'}}
                                        placeholder="Pilih waktu mulai..."
                                        onChange={this.setStateValue('waktu_mulai')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Waktu Selesai"
                                        type="datetime-local"
                                        placeholder="Pilih waktu selesai..."
                                        onChange={this.setStateValue('waktu_selesai')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Jumlah maksimal pengerjaan per orang"
                                        type="text"
                                        resizable
                                        placeholder="Isi dengan jumlah angka"
                                        clearButton
                                        onChange={this.setStateValue('jumlah_percobaan')}
                                        defaultValue={this.state.routeParams.jumlah_percobaan}
                                    ></ListInput>
                                </List>
                            </CardContent>
                        </Card>
                        <Card>
                            <Button raised fill large style={{background:'#43A047'}} onClick={this.setSesiKuis}>
                                <i className="icon f7-icons" style={{fontSize:'40px'}}>gamecontroller_alt_fill</i>&nbsp;
                                Mulai Sesi Kuis
                            </Button>
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
      getKuis: Actions.getKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getSesiKuis: Actions.getSesiKuis,
      setSesiKuis: Actions.setSesiKuis,
      getRuang: Actions.getRuang
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        pengguna_kuis: Kuis.pengguna_kuis,
        sesi_kuis: Kuis.sesi_kuis,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(buatSesiKuis));
  