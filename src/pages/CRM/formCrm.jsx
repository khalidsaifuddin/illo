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

class formCrm extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            status_crm_id: 1,
            prioritas_crm_id: 1
        },
        status_crm: {
            total: 0,
            rows: []
        },
        prioritas_crm: {
            total: 0,
            rows: []
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

        this.props.getStatusCrm(this.state.routeParams).then((result)=>{
            this.setState({
                status_crm: result.payload
            })
        })
        
        this.props.getPrioritasCrm(this.state.routeParams).then((result)=>{
            this.setState({
                prioritas_crm: result.payload
            })
        })
        
    }

    simpan = () => {

        this.$f7.dialog.preloader()
        this.props.simpanCrm(this.state.routeParams).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Berhasil menyimpan data!', 'Berhasil', ()=>{
                    this.$f7router.navigate('/CRM/')
                })
            }else{
                //gagal
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Terjadi kesalahan pada aplikasi. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
            }
        }).catch(()=>{
            //gagal exception
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Terjadi kesalahan pada sistem. Silakan coba kembali dalam beberapa waktu ke depan', 'Gagal')
        })

    }

    setValue = (tipe) => (e) => {

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [tipe]: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.routeParams)
        })

    }

    render()
    {
        return (
            <Page name="formCrm" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.crm_id ? "Edit" : "Tambah"} CRM</NavTitle>
                </Navbar>
                
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">
                        
                        <Card>
                            <CardContent>
                                <List>
                                    <ListInput
                                        label="Judul"
                                        type="text"
                                        placeholder="Judul"
                                        clearButton
                                        value={this.state.routeParams.judul}
                                        onChange={this.setValue('judul')}
                                    />   
                                    <ListInput
                                        label="Keterangan"
                                        type="text"
                                        placeholder="Keterangan"
                                        clearButton
                                        value={this.state.routeParams.keterangan}
                                        onChange={this.setValue('keterangan')}
                                    />
                                    <ListInput
                                        label="Nama Customer"
                                        type="text"
                                        placeholder="Nama Customer"
                                        clearButton
                                        value={this.state.routeParams.nama_customer}
                                        onChange={this.setValue('nama_customer')}
                                    />
                                    <ListInput
                                        label="Keterangan Customer"
                                        type="text"
                                        placeholder="Keterangan Customer"
                                        clearButton
                                        value={this.state.routeParams.keterangan_customer}
                                        onChange={this.setValue('keterangan_customer')}
                                    />
                                    <ListInput
                                        label="No Telepon Customer"
                                        type="text"
                                        placeholder="No Telepon Customer"
                                        clearButton
                                        value={this.state.routeParams.no_telepon_customer}
                                        onChange={this.setValue('no_telepon_customer')}
                                    />
                                    <ListInput
                                        label="Email Customer"
                                        type="text"
                                        placeholder="Email Customer"
                                        clearButton
                                        value={this.state.routeParams.email_customer}
                                        onChange={this.setValue('email_customer')}
                                    />
                                    <ListInput
                                        label="Tanggal"
                                        type="date"
                                        placeholder="Tanggal"
                                        value={this.state.routeParams.tanggal || ''}
                                        onChange={this.setValue('tanggal')}
                                        style={{maxWidth:'100%'}}
                                        className="tanggalan"
                                    />
                                    <ListInput
                                        label="Status CRM"
                                        type="select"
                                        placeholder="Status CRM"
                                        value={this.state.routeParams.status_crm_id}
                                        onChange={this.setValue('status_crm_id')}
                                    >
                                        {this.state.status_crm.rows.map((option)=>{
                                            return (
                                                <option value={option.status_crm_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>  
                                    <ListInput
                                        label="Prioritas CRM"
                                        type="select"
                                        placeholder="Prioritas CRM"
                                        value={this.state.routeParams.prioritas_crm_id}
                                        onChange={this.setValue('prioritas_crm_id')}
                                    >
                                        {this.state.prioritas_crm.rows.map((option)=>{
                                            return (
                                                <option value={option.prioritas_crm_id}>{option.nama}</option>
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
      getStatusCrm: Actions.getStatusCrm,
      getPrioritasCrm: Actions.getPrioritasCrm,
      simpanCrm: Actions.simpanCrm
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(formCrm));
  