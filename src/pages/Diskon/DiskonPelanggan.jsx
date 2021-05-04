import React, {Component} from 'react';
import {
    Popup, Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, Subnavbar, BlockTitle, Searchbar, Segmented, Tabs, Tab, Chip, Icon, Popover, Progressbar
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import QRCode from 'qrcode.react'

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class DiskonPelanggan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            start:0,
            limit:20
        },
        diskon_pelanggan: {
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        this.$f7.dialog.preloader()
        this.props.getDiskonPelanggan(this.state.routeParams).then((result)=>{
            this.setState({
                diskon_pelanggan: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
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
            this.props.getDiskonPelanggan(this.state.routeParams).then((result)=>{
                this.setState({
                    diskon_pelanggan: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                })
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
            })
        })
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
            this.props.getDiskonPelanggan(this.state.routeParams).then((result)=>{
                this.setState({
                    diskon_pelanggan: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                })
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
            })
        })
    }

    edit = (diskon_pelanggan_id) => {
        this.$f7router.navigate("/FormDiskonPelanggan/"+diskon_pelanggan_id)
    }

    hapus = (diskon_pelanggan) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus diskon ini?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menghapus...')
            this.props.simpanDiskonPelanggan({...diskon_pelanggan, soft_delete: 1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    this.$f7.dialog.alert("Berhasil menghapus data!", "Berhasil", ()=> {
                        this.props.getDiskonPelanggan(this.state.routeParams).then((result)=>{
                            this.setState({
                                diskon_pelanggan: result.payload
                            })
                
                            this.$f7.dialog.close()
                        }).catch(()=>{
                            this.$f7.dialog.close()
                            this.$f7.dialog.alert('Terdapat kesalahan teknis. Silakan dicoba kembali dalam beberapa saat ke depan!')
                        })
                    })
                }else{
                    this.$f7.dialog.alert("Terdapat kesalahan pada sistem atau jaringan Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
                }
            }).catch(()=>{
                this.$f7.dialog.close()
                this.$f7.dialog.alert("Saat ini kami belum dapat menghapus data Anda. Mohon coba kembali dalam beberapa saat!", "Gagal")
            })
        })
    }

    penggunaDiskon = (option) => {
        // alert(option)
        this.$f7router.navigate('/DaftarPenggunaDiskon/'+option.diskon_pelanggan_id)
    }

    render()
    {
        return (
            <Page name="DiskonPelanggan" className="halamanJenisTiket" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Diskon Pelanggan</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card noShadow noBorder style={{marginBottom:'50px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px'}}>
                                <div style={{width:'100%', textAlign:'right'}}>
                                    <Button onClick={()=>this.$f7router.navigate('/FormDiskonPelanggan/')} raised fill style={{display:'inline-flex', marginBottom:'4px'}}>
                                        <i className="f7-icons">plus</i>&nbsp;
                                        Tambah
                                    </Button>
                                </div>
                                <div className="data-table" style={{overflowY:'hidden', paddingBottom:'32px'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                <i className="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.diskon_pelanggan.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.diskon_pelanggan.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.diskon_pelanggan.total)} dari {this.formatAngka(this.state.diskon_pelanggan.total)} Diskon Pelanggan</span>
                                        </div>
                                    </div>
                                    <table>
                                        <thead style={{background:'#eeeeee'}}>
                                            <tr>
                                                <th className="label-cell" style={{minWidth:'40px'}}>&nbsp;</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px'}}>Keterangan</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px'}}>Deskripsi</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px'}}>Jenis Diskon</th>
                                                <th className="label-cell" style={{minWidth:'150px', color:'#434343', fontSize:'13px'}}>Jenis Perhitungan<br/>Diskon</th>
                                                <th className="numeric-cell" style={{minWidth:'150px', color:'#434343', fontSize:'13px'}}>Persentase/<br/>Nominal</th>
                                                <th className="label-cell" style={{minWidth:'300px', color:'#434343', fontSize:'13px'}}>Periode</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px', textAlign:'center'}}>Aktif</th>
                                                <th className="label-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px'}}>Kode Diskon</th>
                                                <th className="numeric-cell" style={{minWidth:'200px', color:'#434343', fontSize:'13px'}}>Pengguna Diskon</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.diskon_pelanggan.rows.map((option)=>{
                                            
                                            let mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');
                                            let selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                                            return(
                                                <tr key={option.diskon_pelanggan_id}>
                                                    <td className="label-cell">
                                                        <Button popoverOpen={".popover-menu-"+option.diskon_pelanggan_id}><i className="icons f7-icons" style={{fontSize:'20px'}}>ellipsis_vertical</i></Button>
                                                        <Popover className={"popover-menu-"+option.diskon_pelanggan_id} style={{minWidth:'300px'}}>
                                                            <List>
                                                                <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.diskon_pelanggan_id)} />
                                                                <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option)} />
                                                                <ListItem link="#" popoverClose title="Daftar Pengguna Diskon" onClick={()=>this.penggunaDiskon(option)} />
                                                            </List>
                                                        </Popover>
                                                    </td>
                                                    <td className="label-cell">
                                                        {option.keterangan}
                                                    </td>
                                                    <td className="label-cell">
                                                        {option.deskripsi}
                                                    </td>
                                                    <td className="label-cell">
                                                        {option.jenis_diskon}
                                                    </td>
                                                    <td className="label-cell">
                                                        {option.jenis_hitung_diskon}
                                                    </td>
                                                    <td className="numeric-cell">
                                                        {parseFloat(option.jenis_hitung_diskon_id) === 1 ? option.persen_diskon + '%' : 'Rp ' + option.nominal_diskon}
                                                    </td>
                                                    <td className="label-cell">
                                                        {mulai}
                                                        &nbsp;s/d&nbsp;
                                                        {selesai}
                                                    </td>
                                                    <td className="label-cell" style={{textAlign:'center'}}>
                                                        {parseInt(option.aktif) === 1  && <i className="f7-icons" style={{fontSize:'20px', color: 'green'}}>checkmark_circle</i>}
                                                        {parseInt(option.aktif) !== 1  && <i className="f7-icons" style={{fontSize:'20px', color: 'red'}}>circle</i>}
                                                    </td>
                                                    <td className="label-cell">
                                                        {option.kode_diskon}
                                                    </td>
                                                    <td className="numeric-cell">
                                                        {parseInt(option.pengguna_diskon) > 0 ? parseInt(option.pengguna_diskon) : '0'}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                
                            </CardContent>
                        </Card>

                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                </Row>

            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getDiskonPelanggan: Actions.getDiskonPelanggan,
      simpanDiskonPelanggan: Actions.simpanDiskonPelanggan
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis, Produk }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(DiskonPelanggan));
  