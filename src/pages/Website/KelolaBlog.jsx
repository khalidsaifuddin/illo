import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle, Subnavbar, Segmented, NavRight, Link, Chip
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import { Bar, Line } from 'react-chartjs-2';

import moment from 'moment';

class KelolaBlog extends Component {
    state = {
        error: null,
        loading: false,
        artikel: {
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
        this.props.getArtikel(this.state.routeParams).then((result)=>{
            this.setState({
                artikel: result.payload
            })
        })
    }

    hapusArtikel = (artikel) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus artikel ini?', 'Konfirmasi', ()=>{
            this.props.simpanArtikel({...artikel, soft_delete: 1}).then((result)=>{
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Artikel berhasil dihapus', 'Berhasil',()=>{
                        // this.$f7router.navigate("/kelola-blog/");
                        this.props.getArtikel(this.state.routeParams).then((result)=>{
                            this.setState({
                                artikel: result.payload
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

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="KelolaBlog" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kelola Blog</NavTitle>
                    {/* <NavTitleLarge>
                        Kelola Blog
                    </NavTitleLarge> */}
                    {/* <NavRight>
                        <Button raised fill className="bawahCiriBiru" onClick={()=>this.$f7router.navigate('/tambah-artikel/')}>
                            <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                            Tambah Artikel
                        </Button>
                    </NavRight> */}
                </Navbar>

                <Row>
                    <Col width="0" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent>
                                <div style={{width:'100%', textAlign:'right'}}>
                                    <Button style={{display:'inline-flex', marginBottom:'4px'}} raised fill onClick={()=>this.$f7router.navigate('/tambah-artikel/')}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                                        Tambah Artikel
                                    </Button>
                                </div>
                                <div className="data-table" style={{overflowY:'hidden'}}>
                                    <div className="data-table-footer" style={{display:'block'}}>
                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                            <i className="icon icon-prev color-gray"></i>
                                            </a>
                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.artikel.total) ? "disabled" : "" )}>
                                                <i className="icon icon-next color-gray"></i>
                                            </a>
                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.artikel.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.artikel.total)} dari {this.formatAngka(this.state.artikel.total)} artikel</span>
                                        </div>
                                    </div>
                                </div>

                                {/* artikelnya */}
                                {this.state.artikel.rows.map((option)=>{
                                    return (
                                        <Card>
                                            <CardContent>
                                                <Row>
                                                    <Col width="20" style={{background:'url(https://be.diskuis.id'+option.gambar+')', backgroundrepeat:'none', backgroundSize:'cover', minHeight:'100px'}}>&nbsp;</Col>
                                                    <Col width="70">
                                                        <h4 style={{marginTop:'0px', marginBottom:'8px'}}>{option.judul}</h4>
                                                        <div style={{marginTop:'-8px', width:'100%', overflowX:'hidden'}}>
                                                            <div style={{fontSize:'11px'}} dangerouslySetInnerHTML={{ __html: (option.konten ? option.konten.replace(/noreferrer/g, 'noreferrer" class="link external').replace(/(<([^>]+)>)/gi, "").substring(0,200)+"..." : "<p></p>")}} />
                                                        </div>
                                                        {parseInt(option.publikasi) === 1 &&
                                                        <Chip text="Draft" color="gray" />
                                                        }
                                                        {parseInt(option.publikasi) === 2 &&
                                                        <Chip text="Rilis" color="blue" />
                                                        }
                                                    </Col>
                                                    <Col width="10" style={{textAlign:'right'}}>
                                                        <Link href={"/tambah-artikel/"+option.artikel_id}>
                                                            Edit    
                                                        </Link>
                                                        <br/>
                                                        <Link onClick={()=>this.hapusArtikel(option)}>
                                                            Hapus    
                                                        </Link>
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
      getArtikel: Actions.getArtikel,
      simpanArtikel: Actions.simpanArtikel,
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

export default (connect(mapStateToProps, mapDispatchToProps)(KelolaBlog));
  