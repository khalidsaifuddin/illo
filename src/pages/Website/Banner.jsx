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

class Banner extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            start: 0,
            limit: 20,
            jenis: this.$f7route.params['jenis'] ? this.$f7route.params['jenis'] : 'utama',
            jenis_banner_id: this.$f7route.params['jenis'] === 'utama' ? 1 : (this.$f7route.params['jenis'] === 'samping' ? 2 : (this.$f7route.params['jenis'] === 'bawah' ? 3 : 1))
        },
        banner: {
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

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    componentDidMount = () => {
        this.$f7.dialog.preloader('Memuat data...')
        
        this.props.getBanner(this.state.routeParams).then((result)=>{

            this.setState({
                banner: result.payload
            })

            this.$f7.dialog.close()
            
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Terdapat kesalahan teknis. Silakan dicoba kembali dalam beberapa saat ke depan!')
        })
    }

    tambah = (jenis_banner_id) => {
        this.$f7router.navigate("/FormBanner/"+jenis_banner_id)
    }

    edit = (banner_id) => {
        this.$f7router.navigate('/FormBanner/'+this.state.routeParams.jenis_banner_id+'/'+banner_id)
    }

    hapus = (banner) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus banner ini?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menghapus...')
            this.props.simpanBanner({...banner, soft_delete: 1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    this.$f7.dialog.alert("Berhasil menghapus data!", "Berhasil", ()=> {
                        // this.$f7router.navigate("/Banner/"+this.state.routeParams.jenis)
                        this.props.getBanner(this.state.routeParams).then((result)=>{
                            this.setState({
                                banner: result.payload
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

    aktif = (banner) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin '+(parseInt(banner.aktif) === 1 ? 'menonaktifkan' : 'mengaktifkan' )+' banner ini?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menyimpan...')
            this.props.simpanBanner({...banner, aktif: (parseInt(banner.aktif) === 1 ? '0' : '1')}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    this.$f7.dialog.alert("Berhasil menyimpan data!", "Berhasil", ()=> {
                        // this.$f7router.navigate("/Banner/"+this.state.routeParams.jenis)
                        this.props.getBanner(this.state.routeParams).then((result)=>{
                            this.setState({
                                banner: result.payload
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

    render()
    {
        return (
            <Page name="Banner" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Banner {this.capitalizeFirstLetter(this.state.routeParams.jenis)}</NavTitle>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'right', marginBottom:'8px'}}>
                                        <Button raised fill style={{display:'inline-flex' , marginTop:'0px'}} onClick={()=>this.tambah(this.state.routeParams.jenis_banner_id)}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                            Tambah
                                        </Button>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        <div className="data-table" style={{overflowY:'hidden'}}>
                                            <div className="data-table-footer" style={{display:'block'}}>
                                                <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                    <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                    <i className="icon icon-prev color-gray"></i>
                                                    </a>
                                                    <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.banner.total) ? "disabled" : "" )}>
                                                        <i className="icon icon-next color-gray"></i>
                                                    </a>
                                                    <span className="data-table-pagination-label">
                                                        {parseInt(this.state.banner.total) > 0 ? (this.state.routeParams.start+1) : '0'}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.banner.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.banner.total)} dari {this.formatAngka(this.state.banner.total)} Banner {this.capitalizeFirstLetter(this.state.routeParams.jenis)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                        {this.state.banner.total < 1 &&
                                        <div style={{width:'100%', textAlign:'center', marginBottom:'50px'}}>
                                            <img src="./static/icons/189.jpg" style={{width:'60%'}} /> 
                                            <br/>
                                            Data belum tersedia<br/>
                                            Silakan klik tombol tambah diatas untuk membuat data baru   
                                        </div>
                                        }
                                        {this.state.banner.total > 0 &&
                                        <Row>    
                                        {this.state.banner.rows.map((option)=>{
                                            let create_date = '';
                                            create_date = moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ', ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                            let mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');
                                            let selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                                            if(moment(option.create_date).format('D') + ' ' + this.bulan_singkat[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                create_date = 'Hari ini, ' + moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
                                            }
                                            
                                            if(moment(option.waktu_mulai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                mulai = 'Hari ini, ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');
                                            }
                                            
                                            if(moment(option.waktu_selesai).format('D') + ' ' + this.bulan_singkat[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                selesai = 'Hari ini, ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');
                                            }

                                            return (
                                                // <Col width={this.state.banner.total === 1 ? "100" : "50"}>
                                                <Col width={"50"}>
                                                    <Card key={option.anggota_unit_id} style={{marginLeft:'4px', marginRight:'4px', marginBottom:'4px', marginTop:'4px'}}>
                                                        <div style={{
                                                            borderRadius:'20px 20px 0px 0px', 
                                                            backgroundColor:'#434343', 
                                                            backgroundImage: 'url(' + localStorage.getItem('api_base') + option.nama_file + ')',
                                                            backgroundSize: this.state.routeParams.jenis !== 'samping' ? 'cover' : 'contain',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'center',
                                                            width:'100%', 
                                                            height:'150px'
                                                        }}>&nbsp;</div>
                                                        <CardContent style={{padding:'8px', paddingBottom:'16px', minHeight:'96px'}}>
                                                            <Row>
                                                                <Col width="100">
                                                                    <Row noGap>
                                                                        <Col width="90" style={{minHeight:'36px'}}>
                                                                            {option.keterangan}
                                                                        </Col>
                                                                        <Col width="10">                                                                        
                                                                            <Button small style={{display:'inline-flex', fontSize:'20px', color:'#434343'}} popoverOpen={".popover-menu-"+option.banner_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                            <Popover className={"popover-menu-"+option.banner_id} style={{minWidth:'200px'}}>
                                                                                <List>
                                                                                    <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.banner_id)} />
                                                                                    <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option)} />
                                                                                    <ListItem link="#" popoverClose title={parseInt(option.aktif) === 1 ? 'Nonaktifkan Banner' : 'Aktifkan Banner'} onClick={()=>this.aktif(option)} />
                                                                                </List>
                                                                            </Popover>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col width="50">
                                                                    <div style={{fontSize:'10px'}}>Waktu Tampi:</div>
                                                                    <div>{mulai} - {selesai}</div>
                                                                </Col>
                                                                <Col width="50">
                                                                    <div style={{fontSize:'10px'}}>Tautan Banner:</div>
                                                                    <div><Link className="external" href={option.tautan} target="_blank">{option.tautan}</Link></div>
                                                                    <div style={{fontSize:'10px'}}>Status: {option.aktif === 1 ? <b style={{color:'green'}}>Aktif</b> : <b style={{color:'red'}}>Tidak Aktif</b>}</div>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                        </Row>
                                        }
                                    </Col>
                                </Row>
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
      getBanner: Actions.getBanner,
      simpanBanner: Actions.simpanBanner
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Banner));
  