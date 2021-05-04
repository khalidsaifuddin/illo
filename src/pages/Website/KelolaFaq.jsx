import React, {Component} from 'react';
import {
    Popover, Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle, Subnavbar, Segmented, NavRight, Link, Chip, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import { Bar, Line } from 'react-chartjs-2';

import moment from 'moment';

class KelolaFaq extends Component {
    state = {
        error: null,
        loading: false,
        faq: {
            rows: [],
            total: 0
        },
        routeParams: {
            start: 0,
            limit: 20
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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        this.props.getFaq(this.state.routeParams).then((result)=>{
            this.setState({
                faq: result.payload
            })
        })
    }

    hapusArtikel = (faq) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus FAQ ini?', 'Konfirmasi', ()=>{
            this.props.simpanFaq({...faq, soft_delete: 1}).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Artikel berhasil dihapus', 'Berhasil',()=>{
                        // this.$f7router.navigate("/kelola-blog/");
                        this.props.getFaq(this.state.routeParams).then((result)=>{
                            this.setState({
                                faq: result.payload
                            })
                        })
                    })
    
                }else{
                    //gagal
                    this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon dicoba kembali dalam beberapa saat', 'Gagal')
                
                }
            })
        })
    }

    edit = (faq_id) => {
        this.$f7router.navigate("/tambah-faq/"+faq_id)
    }

    hapus = (faq) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus FAQ ini?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader('Menghapus...')
            this.props.simpanFaq({...faq, soft_delete: 1}).then((result)=>{
                this.$f7.dialog.close()
                if(result.payload.sukses){
                    this.$f7.dialog.alert("Berhasil menghapus data!", "Berhasil", ()=> {
                        this.props.getFaq(this.state.routeParams).then((result)=>{
                            this.setState({
                                faq: result.payload
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
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="KelolaFaq" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kelola FAQ</NavTitle>
                </Navbar>

                <Row>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent>
                                <div style={{width:'100%', textAlign:'right'}}>
                                    <Button style={{display:'inline-flex', marginBottom:'4px'}} raised fill onClick={()=>this.$f7router.navigate('/tambah-faq/')}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                                        Tambah FAQ
                                    </Button>
                                </div>
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i className="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.faq.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.faq.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.faq.total)} dari {this.formatAngka(this.state.faq.total)} FAQ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* artikelnya */}
                                {this.state.faq.rows.map((option)=>{

                                    let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY') + ' ' + moment(option.create_date).format('HH') + ':' + moment(option.create_date).format('ss');
                                    let last_update = moment(option.last_update).format('D') + ' ' + this.bulan[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ' ' + moment(option.last_update).format('HH') + ':' + moment(option.last_update).format('ss');

                                    return (
                                        <Card>
                                            <CardContent>
                                                <Row>
                                                    <Col width="90">
                                                        {parseInt(option.aktif) === 1 && <div style={{fontSize:'10px', color:'green', fontWeight:'bold'}}><i style={{fontSize:'12px'}} className="f7-icons">checkmark_circle</i>&nbsp;Aktif</div>}
                                                        {parseInt(option.aktif) !== 1 && <div style={{fontSize:'10px', color:'red', fontWeight:'bold'}}><i style={{fontSize:'12px'}} className="f7-icons">circle</i>&nbsp;Tidak Aktif</div>}
                                                        <BlockHeader style={{fontSize:'18px', marginLeft:'0px', paddingLeft:'0px', fontWeight:'bold', marginBottom:'16px'}}>
                                                            {option.pertanyaan}
                                                        </BlockHeader>
                                                        <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}}>
                                                            <div style={{fontSize:'11px'}} dangerouslySetInnerHTML={{ __html: (option.jawaban ? option.jawaban.replace(/noreferrer/g, 'noreferrer" class="link external').replace(/(<([^>]+)>)/gi, "").substring(0,200)+"..." : "<p></p>")}} />
                                                        </div>
                                                        <div style={{borderTop:'1px solid #eee', marginTop:'16px', fontSize:'10px'}}>
                                                            Ditambahkan pada {tanggal} | Terakhir Diedit {last_update}
                                                        </div>
                                                    </Col>
                                                    <Col width="10">
                                                        <Button popoverOpen={".popover-menu-"+option.faq_id}><i className="icons f7-icons" style={{fontSize:'20px'}}>ellipsis_vertical</i></Button>
                                                        <Popover className={"popover-menu-"+option.faq_id} style={{minWidth:'300px'}}>
                                                            <List>
                                                                <ListItem link="#" popoverClose title="Edit" onClick={()=>this.edit(option.faq_id)} />
                                                                <ListItem link="#" popoverClose title="Hapus" onClick={()=>this.hapus(option)} />
                                                            </List>
                                                        </Popover>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getFaq: Actions.getFaq,
      simpanFaq: Actions.simpanFaq
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(KelolaFaq));
  