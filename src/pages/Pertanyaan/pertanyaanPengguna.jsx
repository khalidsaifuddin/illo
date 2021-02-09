import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

class pertanyaanPengguna extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            jenis_pertanyaan_aktivitas_id: 2
        },
        pertanyaan: {
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
        this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
                pertanyaan: this.props.pertanyaan
            });
        });
    }

    simpanPantauan = (pertanyaan_id) => {
        // alert(pertanyaan_id);
        this.setState({
          routeParamsPantauan: {
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            pertanyaan_id: pertanyaan_id
          }
        },()=>{
          this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{
    
            this.props.getPertanyaan(this.state.routeParams).then((result)=>{
              this.setState({
                pertanyaan: this.props.pertanyaan,
                notifikasi: this.props.notifikasi,
                loadingPertanyaan: false,
              });
            });
    
          })
        });
    }

    render()
    {
        return (
            <Page name="pertanyaanPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Diskusi</NavTitle>
                    {/* <NavTitleLarge>
                        Materi & Diskusi
                    </NavTitleLarge> */}
                    <NavRight>
                        <Button fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/tambahPertanyaan/')}>
                            <i className="icon f7-icons" style={{fontSize:'30px'}}>plus_app</i>&nbsp;
                            Diskusi Baru
                        </Button>
                        {/* <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Diskusi Baru" href="/tambahPertanyaan">&nbsp; Materi & Diskusi Baru</Link> */}
                    </NavRight>
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="10" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="80">

                        <BlockTitle style={{marginTop:'8px'}}>
                            Materi dan Diskusi yang Anda buat
                        </BlockTitle>
                        <Row noGap style={{justifyContent:'flex-start'}}>
                            {this.state.pertanyaan.rows.map((option)=>{
                                let tanggal = '';
                                let tgl = new Date(option.create_date);

                                tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                                return (
                                    <Col width="100" tabletWidth="50" desktopWidth="50">
                                        <Card>
                                            <CardHeader style={{display:'inline-flex', paddingTop:'8px',paddingBottom:'0px',minHeight:'0px',fontSize:'12px'}}>
                                                {option.ruang.map((optionRuang)=>{
                                                return (
                                                    <Link href={"/tampilRuang/"+optionRuang.ruang_id}>
                                                    <span>&nbsp;/ {optionRuang.nama}</span>
                                                    </Link>
                                                )
                                                })}
                                            </CardHeader>
                                            <CardHeader style={{minHeight:'90px', overflow: 'hidden', display:'flow-root'}}>
                                                <Link href={"/tampilPertanyaan/"+option.pertanyaan_id}>
                                                    <b style={{fontSize:'23px'}}>{option.judul}</b>
                                                </Link>
                                            </CardHeader>
                                            <CardContent style={{paddingTop:'8px'}}>
                                                {/* {option.konten} */}
                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Sejak tanggal <b>{tanggal}</b></span><br/>
                                                <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                <hr style={{borderTop:'1px solid #eeeeee'}}/>
                                                <div style={{marginTop:'-8px', minHeight:'100px', maxHeight:'100px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                    <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                                                    <p className="read-more" style={{textAlign:'center'}}>
                                                    </p>
                                                </div>
                                                <Link style={{width:'100%', marginTop:'8px'}} href={"/tampilPertanyaan/"+option.pertanyaan_id}>Baca Selengkapnya</Link>
                                            </CardContent>
                                            <CardFooter>
                                                {/* <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right" href={"/tampilPertanyaan/"+option.pertanyaan_id}>&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                                                <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle" onClick={()=>this.simpanPantauan(option.pertanyaan_id)}>&nbsp; {option.jumlah_pantauan} Pantauan</Link>
                                                <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle">&nbsp; Jawab</Link> */}
                                                <Link href={"/editPertanyaan/"+option.pertanyaan_id} iconIos="f7:square_pencil" iconAurora="f7:square_pencil" iconMd="material:square_pencil">&nbsp; Ubah</Link>
                                                <Link iconIos="f7:trash" iconAurora="f7:trash" iconMd="material:trash">&nbsp; Hapus</Link>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
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
      getPertanyaan: Actions.getPertanyaan,
      simpanPantauan: Actions.simpanPantauan
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pertanyaan: Pertanyaan.pertanyaan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(pertanyaanPengguna));
  