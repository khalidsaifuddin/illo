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

// class CardKanban extends Component {
    
//     hapus = (crm_id, status_crm_id) => {
//         this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi', ()=>{

//             console.log(this)

//             // this.$f7.dialog.preloader()
//             // this.props.simpanCrm({
//             //     crm_id: crm_id,
//             //     soft_delete: 1
//             // }).then((result)=>{
//             //     this.$f7.dialog.close()
//             //     if(result.payload.sukses){
//             //         //berhasil
//             //         this.$f7.dialog.alert('Berhasil menghapus data!', 'Berhasil')
                    
//             //         this.props.getCrm({
//             //             status_crm_id: status_crm_id
//             //         }).then((result)=>{
//             //             this.setState({
//             //                 crm_kanban: {
//             //                     ...this.state.crm_kanban,
//             //                     [status_crm_id]: result.payload
//             //                 }
//             //             },()=>{
//             //                 // console.log(this.state.crm_kanban)
//             //             })
//             //         })

//             //     }else{
//             //         //gagal
//             //         this.$f7.dialog.alert('Ada kesalahan pada aplikasi. Mohon coba kembali dalam beberapa saat ke depan!', 'Gagal')
//             //     }
//             // }).catch(()=>{
//             //     //gagal exception
//             //     this.$f7.dialog.close()
//             //     this.$f7.dialog.alert('Ada kesalahan pada aplikasi. Mohon coba kembali dalam beberapa saat ke depan!', 'Gagal')
//             // })
//         })
//     }

//     render () {
//         return (
//             <Card key={option.crm_id} style={{marginLeft:'0px', marginRight:'0px'}}>
//                 <CardContent style={{padding:'8px'}}>
//                     <Row>
//                         <Col width="100" tabletWidth="100" desktopWidth="100" style={{display:'inline-flex'}}>
//                             {/* <img src={option.gambar_pembuat} style={{height:'45px', width:'45px', borderRadius:'50%', marginLeft:'4px'}} /> */}
//                             <img src={'/static/icons/illo-logo-icon.png'} style={{height:'30px', width:'30px', borderRadius:'50%', marginLeft:'4px'}} />
//                             <Row noGap style={{width:'100%', marginLeft:'8px'}}>

//                                 <Col width="80" tabletWidth="80" desktopWidth="80">
//                                     <Link href={"/TampilTiket/"+option.crm_id}><b>{option.judul}</b></Link>
//                                     <div style={{fontSize:'10px', marginTop:'0px'}}>
//                                         {option.pembuat &&
//                                         <>
//                                         Oleh <b>{option.pembuat}</b>&nbsp;&bull;&nbsp;
//                                         </>
//                                         }
//                                         {this.props.last_update}
//                                     </div>
//                                     <div style={{fontSize:'10px'}}>
//                                         <b>{option.nama_customer}</b>
//                                     </div>
//                                 </Col>
//                                 <Col width="20" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}}>
//                                     <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+option.crm_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
//                                     <Popover className={"popover-menu-"+option.crm_id} style={{minWidth:'200px'}}>
//                                         <List>
//                                             <ListItem link="#" popoverClose title="Detail" onClick={()=>this.edit(option.crm_id)} />
//                                             <ListItem link="#" popoverClose title="Ubah Status" onClick={()=>this.ubahStatus(option.crm_id)} />
//                                             <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.crm_id, option.status_crm_id)} />
//                                         </List>
//                                     </Popover>
//                                 </Col>
//                                 <Col width="100">
//                                     {/* <div className="kotakKontenTiket" style={{fontSize:'10px', width:'100%', overflow:'hidden', marginBottom:'8px', borderTop:'0px solid #eee', borderBottom:'0px solid #eee', marginTop:'4px'}}>
//                                         {option.konten_strip && option.konten_strip.substring(0,200)} {option.konten_strip && option.konten_strip.length > 200 && <span>...</span>}
//                                     </div> */}
//                                     <div style={{fontSize:'10px', marginBottom:'8px'}}>
//                                         {option.keterangan &&
//                                         <>
//                                         {option.keterangan}&nbsp;&bull;&nbsp;
//                                         </>
//                                         }
//                                     </div>
//                                 </Col>
//                                 <Col width="100" style={{textAlign:'right'}}>
//                                     <Button className={"color-theme-"+this.props.warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginBottom:'4px'}}>
//                                         <i className='f7-icons' style={{fontSize:'12px'}}>speedometer</i>&nbsp;
//                                         {option.prioritas_crm}
//                                     </Button>
//                                     <Button className={"color-theme-"+(parseInt(option.status_crm_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginLeft:'4px', marginBottom:'4px'}}>
//                                         <i className='f7-icons' style={{fontSize:'12px'}}>ticket</i>&nbsp;
//                                         {option.status_crm}
//                                     </Button>
//                                 </Col>
//                                 <Col width="100" className="hilangDiDesktop">
//                                     <Button className={"color-theme-"+this.props.warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px'}}>
//                                         <i className='f7-icons' style={{fontSize:'15px'}}>speedometer</i>&nbsp;
//                                         {option.prioritas_crm}
//                                     </Button>
//                                     <Button className={"color-theme-"+(parseInt(option.status_crm_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginLeft:'4px', marginBottom:'4px'}}>
//                                         <i className='f7-icons' style={{fontSize:'15px'}}>ticket</i>&nbsp;
//                                         {option.status_crm}
//                                     </Button>
//                                 </Col>
//                             </Row>
//                         </Col>
//                     </Row>
//                 </CardContent>
//             </Card>
//         )
//     }
// }

class daftarCrm extends Component {
    state = {
        error: null,
        loading: false,
        status_crm: {
            total: 0,
            rows: []
        },
        crm_kanban: {
            1:{
                rows: [],
                total: 0
            },
            2:{
                rows: [],
                total: 0
            },
            3:{
                rows: [],
                total: 0
            },
            4:{
                rows: [],
                total: 0
            }
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
        this.props.getStatusCrm(this.state.routeParams).then((result)=>{
            this.setState({
                status_crm: result.payload
            },()=>{

                for (let index = 0; index < this.state.status_crm.rows.length; index++) {
                    const element = this.state.status_crm.rows[index];
                    this.props.getCrm({...this.state.routeParams, status_crm_id: element.status_crm_id}).then((resultCRM)=>{
                        this.setState({
                            crm_kanban: {
                                ...this.state.crm_kanban,
                                [element.status_crm_id]: resultCRM.payload
                            }
                        },()=>{
                            // console.log(this.state.crm_kanban)
                        })
                    })
                    
                }

            })
        })
    }

    hapus = (crm_id, status_crm_id) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data ini?', 'Konfirmasi', ()=>{

            // console.log(this)

            this.$f7.dialog.preloader()
            this.props.simpanCrm({
                crm_id: crm_id,
                soft_delete: 1
            }).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Berhasil menghapus data!', 'Berhasil')
                    
                    this.props.getCrm({
                        status_crm_id: status_crm_id
                    }).then((result)=>{
                        this.setState({
                            crm_kanban: {
                                ...this.state.crm_kanban,
                                [status_crm_id]: result.payload
                            }
                        },()=>{
                            // console.log(this.state.crm_kanban)
                        })
                    })

                }else{
                    //gagal
                    this.$f7.dialog.alert('Ada kesalahan pada aplikasi. Mohon coba kembali dalam beberapa saat ke depan!', 'Gagal')
                }
            }).catch(()=>{
                //gagal exception
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan pada aplikasi. Mohon coba kembali dalam beberapa saat ke depan!', 'Gagal')
            })
        })
    }

    render()
    {
        return (
            <Page name="daftarCrm" className="daftarCrm" hideBarsOnScroll style={{paddingBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>CRM</NavTitle>
                </Navbar>

                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card noShadow noBorder style={{marginBottom:'8px', background: 'transparent'}}>
                            <CardContent style={{padding:'4px', display:'inline-flex', width:'100%', overflow:'scroll', minHeight:'700px'}}>
                                {this.state.status_crm.rows.map((optionStatus)=>{
                                    return (
                                        <Card className="kotakKanban">
                                            <CardHeader style={{fontWeight:'bold', minHeight:'48px'}}>
                                                {optionStatus.nama}
                                                {optionStatus.status_crm_id === 1 &&
                                                <Button raised fill onClick={()=>this.$f7router.navigate('/formCRM')}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>
                                                    Tambah
                                                </Button>
                                                }
                                            </CardHeader>
                                            <CardContent className="isiKanban">
                                                {this.state.crm_kanban[optionStatus.status_crm_id].total < 1 &&
                                                <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                                    Belum ada data
                                                </div>
                                                }

                                                {this.state.crm_kanban[optionStatus.status_crm_id].rows.map((option)=>{
                                                    let last_update = '';
                                                    let warna_prioritas = 'blue'
    
                                                    last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
    
                                                    if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                        last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                                    }
    
                                                    switch (parseInt(option.prioritas_crm_id)) {
                                                        case 1:
                                                            warna_prioritas = 'black'
                                                            break;
                                                        case 2:
                                                            warna_prioritas = 'red'
                                                            break;
                                                        case 3:
                                                            warna_prioritas = 'deeporange'
                                                            break;
                                                        case 4:
                                                            warna_prioritas = 'yellow'
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                    
                                                    return (
                                                        <Card key={option.crm_id} style={{marginLeft:'0px', marginRight:'0px'}}>
                                                            <CardContent style={{padding:'8px'}}>
                                                                <Row>
                                                                    <Col width="100" tabletWidth="100" desktopWidth="100" style={{display:'inline-flex'}}>
                                                                        {/* <img src={option.gambar_pembuat} style={{height:'45px', width:'45px', borderRadius:'50%', marginLeft:'4px'}} /> */}
                                                                        <img src={'/static/icons/illo-logo-icon.png'} style={{height:'30px', width:'30px', borderRadius:'50%', marginLeft:'4px'}} />
                                                                        <Row noGap style={{width:'100%', marginLeft:'8px'}}>

                                                                            <Col width="80" tabletWidth="80" desktopWidth="80">
                                                                                <Link href={"/TampilTiket/"+option.crm_id}><b>{option.judul}</b></Link>
                                                                                <div style={{fontSize:'10px', marginTop:'0px'}}>
                                                                                    {option.pembuat &&
                                                                                    <>
                                                                                    Oleh <b>{option.pembuat}</b>&nbsp;&bull;&nbsp;
                                                                                    </>
                                                                                    }
                                                                                    {last_update}
                                                                                </div>
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    <b>{option.nama_customer}</b>
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="20" tabletWidth="20" desktopWidth="20" style={{textAlign:'right'}}>
                                                                                <Button style={{display:'inline-flex'}} popoverOpen={".popover-menu-"+option.crm_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                                                <Popover className={"popover-menu-"+option.crm_id} style={{minWidth:'200px'}}>
                                                                                    <List>
                                                                                        <ListItem link="#" popoverClose title="Detail" onClick={()=>this.edit(option.crm_id)} />
                                                                                        <ListItem link="#" popoverClose title="Ubah Status" onClick={()=>this.ubahStatus(option.crm_id)} />
                                                                                        <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option.crm_id, option.status_crm_id)} />
                                                                                    </List>
                                                                                </Popover>
                                                                            </Col>
                                                                            <Col width="100">
                                                                                {/* <div className="kotakKontenTiket" style={{fontSize:'10px', width:'100%', overflow:'hidden', marginBottom:'8px', borderTop:'0px solid #eee', borderBottom:'0px solid #eee', marginTop:'4px'}}>
                                                                                    {option.konten_strip && option.konten_strip.substring(0,200)} {option.konten_strip && option.konten_strip.length > 200 && <span>...</span>}
                                                                                </div> */}
                                                                                <div style={{fontSize:'10px', marginBottom:'8px'}}>
                                                                                    {option.keterangan &&
                                                                                    <>
                                                                                    {option.keterangan}&nbsp;&bull;&nbsp;
                                                                                    </>
                                                                                    }
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="100" style={{textAlign:'right'}}>
                                                                                <Button className={"color-theme-"+warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginBottom:'4px'}}>
                                                                                    <i className='f7-icons' style={{fontSize:'12px'}}>speedometer</i>&nbsp;
                                                                                    {option.prioritas_crm}
                                                                                </Button>
                                                                                <Button className={"color-theme-"+(parseInt(option.status_crm_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'8px', padding:'4px', height:'17px', marginLeft:'4px', marginBottom:'4px'}}>
                                                                                    <i className='f7-icons' style={{fontSize:'12px'}}>ticket</i>&nbsp;
                                                                                    {option.status_crm}
                                                                                </Button>
                                                                            </Col>
                                                                            <Col width="100" className="hilangDiDesktop">
                                                                                <Button className={"color-theme-"+this.props.warna_prioritas} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginBottom:'4px'}}>
                                                                                    <i className='f7-icons' style={{fontSize:'15px'}}>speedometer</i>&nbsp;
                                                                                    {option.prioritas_crm}
                                                                                </Button>
                                                                                <Button className={"color-theme-"+(parseInt(option.status_crm_id) === 2 ? 'teal' : 'gray')} raised fill small style={{display:'inline-flex', fontSize:'10px', padding:'4px', height:'20px', marginLeft:'4px', marginBottom:'4px'}}>
                                                                                    <i className='f7-icons' style={{fontSize:'15px'}}>ticket</i>&nbsp;
                                                                                    {option.status_crm}
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </CardContent>
                                                        </Card>
                                                        // <CardKanban 
                                                        //     option={option} 
                                                        //     warna_prioritas={warna_prioritas} 
                                                        //     last_update={last_update}
                                                        //     // simpanCrm={getStatusCrm}
                                                        //     // getCrm={this.props.getCrm} 
                                                        // />
                                                    )
                                                })}

                                            </CardContent>
                                        </Card>
                                    )
                                })}
                                {/* <Card className="kotakKanban">
                                        <CardHeader style={{fontWeight:'bold'}}>
                                            Open
                                        </CardHeader>
                                        <CardContent className="isiKanban">
                                            {this.state.crm_kanban[1].total < 1 &&
                                            <div className="aktivitasKosong" style={{minHeight:'50px'}}>
                                                Belum ada data
                                            </div>
                                            }
                                            {this.state.crm_kanban[1].rows.map((option)=>{
                                                let last_update = '';
                                                let warna_prioritas = 'blue'

                                                last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                                if(moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') === moment().format('D') + ' ' + this.bulan_singkat[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                                    last_update = 'Hari ini, ' + moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');
                                                }

                                                switch (parseInt(option.prioritas_crm_id)) {
                                                    case 1:
                                                        warna_prioritas = 'black'
                                                        break;
                                                    case 2:
                                                        warna_prioritas = 'red'
                                                        break;
                                                    case 3:
                                                        warna_prioritas = 'deeporange'
                                                        break;
                                                    case 4:
                                                        warna_prioritas = 'yellow'
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                if(parseInt(option.status_crm_id) === 1){

                                                    return (
                                                        <CardKanban option={option} warna_prioritas={warna_prioritas} last_update={last_update} />
                                                    )
                                                }
                                            })}
                                        </CardContent>
                                    </Card> */}
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
      getStatusCrm: Actions.getStatusCrm,
      simpanCrm: Actions.simpanCrm,
      getCrm: Actions.getCrm
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftarCrm));
  