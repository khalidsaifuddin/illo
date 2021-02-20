import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';
import { map } from 'leaflet';

class FormAnggotaMitraBaru extends Component {
    state = {
        error: null,
        loading: false,
        display: false,
        routeParams:{
            jenis_mitra_id: this.$f7route.params['jenis_mitra_id'] ? this.$f7route.params['jenis_mitra_id'] : null
        },
        pengguna: {
            rows: [{
                nama: '*********'
            },{
                nama: '*********'
            },{
                nama: '*********'
            }],
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

    componentDidMount = () => {

        //what to do after mount
        

    }

    cariPengguna = () => {
        
        this.setState({
            loading: true,
            display: true,
            routeParams: {
                ...this.state.routeParams
            },
            pengguna: {
                rows: [{
                    nama: '*********'
                },{
                    nama: '*********'
                },{
                    nama: '*********'
                }],
                total: 0
            }
        },()=>{
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    loading: false,
                    pengguna: result.payload
                })
            });
        });
    }

    
    render()
    {
        return (
            <Page name="FormAnggotaMitraBaru" hideBarsOnScroll style={{paddingBottom:'50px'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Anggota Mitra</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent>
                                Cari pengguna yang akan ditambahkan sebagai anggota mitra
                                <br/>
                                <List noHairlinesMd style={{marginTop:'16px'}}>
                                    <ListInput
                                    outline
                                    large
                                    floatingLabel
                                    type="text"
                                    placeholder="Nama/username pengguna..."
                                    clearButton
                                    onChange={(e)=>this.setState({routeParams:{...this.state.routeParams,keyword:e.target.value}})}
                                    ></ListInput>
                                    <ListItem>
                                        <Button className={"bawahCiriBiru cardBorder-20"} fill raised style={{marginBottom:'8px', display:'inline-flex'}} onClick={this.cariPengguna}>
                                            <i className="icons f7-icons" style={{fontSize:'18px'}}>search</i>&nbsp;
                                            Cari
                                        </Button>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <BlockTitle>Hasil Pencarian</BlockTitle>
                        {/* {this.state.pengguna.rows.map((option)=>{
                            return (
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""} style={{display:(this.state.display ? 'block' : 'none')}}>
                                    <CardContent>
                                        {option.nama}
                                    </CardContent>
                                </Card>
                            )
                        })} */}
                        {this.state.pengguna.rows.map((option)=>{
                            let last_update = '';
                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                            if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                            }

                            return (
                                <Card key={option.pengguna_id} className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""} style={{display:(this.state.display ? 'block' : 'none')}}>
                                    <CardContent style={{padding:'8px'}}>
                                        <Row>
                                            <Col width="80" tabletWidth="60" desktopWidth="60" style={{display:'inline-flex'}}>
                                                <img src={option.gambar} style={{height:'45px', width:'45px', borderRadius:'50%', marginRight:'0px'}} />
                                                <div style={{marginLeft:'16px'}}>
                                                    
                                                    <Link href={"/tampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                    <div style={{fontSize:'10px'}}>
                                                        {option.username &&
                                                        <>
                                                        {option.username}
                                                        </>
                                                        }
                                                        <div style={{fontSize:'10px'}}>
                                                            Update Terakhir: {last_update}
                                                        </div>
                                                    </div>
                                                    <div className="hilangDiDesktop" style={{fontSize:'10px'}}>
                                                        Customer Retail
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col width="0" tabletWidth="20" desktopWidth="20" style={{textAlign:'right', paddingRight:'8px'}} className="hilangDiMobile">
                                                <div style={{fontSize:'10px'}}>Customer Retail</div>
                                            </Col>
                                            <Col width="20" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}}>
                                                <Button raised fill className="bawahCiriBiru">
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>checkmark_alt</i>&nbsp;
                                                    Pilih
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormAnggotaMitraBaru));
  