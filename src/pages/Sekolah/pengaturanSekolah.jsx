import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class pengaturanSekolah extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null,
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {}
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

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0]
            });
        });
        
    }

    setValue = (kolom) => (e) => {
        this.setState({
            ...this.state,
            guru: {
                ...this.state.guru,
                [kolom]: e.target.value
            }
          }, ()=> {
            console.log(this.state.guru);
        });
    }

    render()
    {
        return (
            <Page name="pengaturanSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Pengaturan Sekolah</NavTitle>
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">

                        <BlockTitle>Pengaturan di {this.state.sekolah.nama}</BlockTitle>
                        <Card>
                            <CardContent>
                                <List>
                                    {/* <ListItem title="Tampilkan Beranda Sekolah setelah login" footer="Beranda akan langsung menampilkan sekolah yang sedang aktif">
                                        <Toggle slot="after" defaultChecked />
                                    </ListItem>
                                    <ListItem title="Sembunyikan daftar sekolah yang lain" footer="Tombol tambah/ubah sekolah akan disembunyikan">
                                        <Toggle slot="after" defaultChecked />
                                    </ListItem> */}
                                    <ListItem title="Sabtu masuk sekolah" footer="Rekap kehadiran akan memasukkan hari sabtu sebagai hari kerja">
                                        {/* <span>Sabtu Masuk Sekolah</span> */}
                                        <Toggle slot="after" defaultChecked />
                                    </ListItem>
                                    <ListInput
                                        label="Jam Masuk"
                                        type="time"
                                        placeholder="Contoh: 08:00"
                                        clearButton
                                        // value={this.state.pengguna.rows[0].nama || ''}
                                        onChange={this.setValue('jam_masuk')}
                                        info="Batas jam masuk kerja/sekolah"
                                    >
                                        {/* <i slot="media" className="f7-icons">person_fill</i> */}
                                    </ListInput>
                                    <ListInput
                                        label="Jam Pulang"
                                        type="time"
                                        placeholder="Contoh: 17:00"
                                        clearButton
                                        // value={this.state.pengguna.rows[0].nama || ''}
                                        onChange={this.setValue('jam_pulang')}
                                        info="Batas jam masuk kerja/sekolah"
                                    >
                                        {/* <i slot="media" className="f7-icons">person_fill</i> */}
                                    </ListInput>
                                </List>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Button raised fill className="bawahCiriBiru cardBorder-20">
                                    <i className="icons f7-icons iconNormal" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
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
      getSekolah: actions.getSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Guru }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(pengaturanSekolah));
  