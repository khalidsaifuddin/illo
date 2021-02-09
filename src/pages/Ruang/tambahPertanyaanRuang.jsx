import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, BlockTitle, Card, Searchbar, Subnavbar, CardHeader, CardContent, Row, Col, Link, CardFooter, Checkbox
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
// import SunEditor from 'suneditor-react';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import Dropzone from 'react-dropzone';
import moment from 'moment';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class tambahPertanyaanRuang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            ruang_id: this.$f7route.params['ruang_id'],
            keyword: null
        },
        ruang: {
            rows: [],
            total: 0
        },
        pertanyaan: {
            rows: [],
            total: 0
        },
        checkPertanyaan: {}
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

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    componentDidMount = () => {
        this.props.getRuang(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                ruang: this.props.ruang
            },()=>{
                // console.log(this.state.ruang);
                this.setState({
                    routeParamsPertanyaan: {
                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                    }
                },()=>{

                    this.props.getPertanyaan(this.state.routeParamsPertanyaan).then((result)=>{
                        this.setState({
                            loading: false,
                            pertanyaan: this.props.pertanyaan
                        },()=>{
                            let arrPertanyaan = {};
        
                            for (let indexPertanyaan = 0; indexPertanyaan < this.state.pertanyaan.rows.length; indexPertanyaan++) {
                                const element = this.state.pertanyaan.rows[indexPertanyaan];
        
                                arrPertanyaan[element.pertanyaan_id] = false;
                                
                            }
        
                            this.setState({
                                ...this.state,
                                checkPertanyaan: arrPertanyaan
                            });
        
                            // console.log(arrPertanyaan);
                        });
                    });

                });
            });
        });
    }

    cariPertanyaan = () => {
        // alert('tes');
        this.setState({
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                keyword: event.target[0].value,
                ruang_id: null
            }
        },()=>{

            this.props.getPertanyaan(this.state.routeParams).then((result)=>{
                this.setState({
                    loading: false,
                    pertanyaan: this.props.pertanyaan
                },()=>{
                    let arrPertanyaan = {};

                    for (let indexPertanyaan = 0; indexPertanyaan < this.state.pertanyaan.rows.length; indexPertanyaan++) {
                        const element = this.state.pertanyaan.rows[indexPertanyaan];

                        arrPertanyaan[element.pertanyaan_id] = false;
                        
                    }

                    this.setState({
                        ...this.state,
                        checkPertanyaan: arrPertanyaan
                    });

                    // console.log(arrPertanyaan);
                });
            });

        })
    }

    ketikCari = (e) => {
        // console.log(e.currentTarget.value);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    pilihPertanyaan = (pertanyaan_id) => (e, b) => {
        console.log(e.target);
        console.log(pertanyaan_id);
        // console.log(b);

        this.setState({
            ...this.state,
            checkPertanyaan: {
                ...this.state.checkPertanyaan,
                [pertanyaan_id]: !this.state.checkPertanyaan[pertanyaan_id] 
            }
        })
    }

    simpanPertanyaanRuang = () => {
        // console.log(this.state.checkPertanyaan);
        let arrAll = [];
        let n = 0;

        for (var key in this.state.checkPertanyaan) {
            // arrAll[n].pertanyaan_id = key;
            // arrAll[n].status = this.state.checkPertanyaan[key];
            arrAll.push({pertanyaan_id:key,status:this.state.checkPertanyaan[key]});
        }

        console.log(arrAll);

        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                arrPertanyaan: JSON.stringify(arrAll),
                ruang_id: this.$f7route.params['ruang_id']
            }
        },()=>{
            this.props.simpanPertanyaanRuang(this.state.routeParams).then((result)=>{
                this.$f7router.navigate('/tampilRuang/'+this.$f7route.params['ruang_id']);
            });
        });
    }

    render()
    {
        return (
            <Page name="tambahPertanyaanRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>
                        {this.state.ruang.rows.map((option)=>{
                            return (
                                <b>Tambah Pertanyaan Ruang "{option.nama}"</b>
                            )
                        })}
                    </NavTitle>
                    {/* <NavTitleLarge>
                        Tambah Pertanyaan Ruang
                    </NavTitleLarge> */}
                    <Subnavbar>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            placeholder="Cari pertanyaan..."
                            searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariPertanyaan}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                        ></Searchbar>
                    </Subnavbar>
                </Navbar>
                <Block strong style={{marginTop:'0px'}}>
                    <Button large fill raised color="blue" onClick={this.simpanPertanyaanRuang}>
                        <i className="f7-icons">checkmark_alt_circle_fill</i>&nbsp;Pilih Pertanyaan
                    </Button>
                    <BlockTitle>Centang pertanyaan yang akan ditambahkan</BlockTitle>
                    <Row>
                        {this.state.pertanyaan.rows.map((option)=>{

                            let tanggal = '';
                            let tgl = new Date(option.create_date);

                            tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                            // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();

                            return(
                                <Col width="100">
                                    <Row noGap>
                                        <Col width="10" style={{textAlign:'center', marginTop:'30px'}}>
                                            <Checkbox name={option.pertanyaan_id} onChange={this.pilihPertanyaan(option.pertanyaan_id)} value={this.state.checkPertanyaan[option.pertanyaan_id]}></Checkbox>
                                        </Col>
                                        <Col width="90">
                                            <Card>
                                                <CardHeader>
                                                    <b style={{fontSize:'23px'}}>{option.judul}</b>
                                                </CardHeader>
                                                <CardContent style={{paddingTop:'8px'}}>
                                                    {/* {option.konten} */}
                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                                                    <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                    <hr style={{borderTop:'1px solid #eeeeee'}} />
                                                    {/* <div style={{marginTop:'-8px', maxHeight:'100px', width:'100%',overflowX:'hidden',overflowY:'hidden'}}>
                                                        <div dangerouslySetInnerHTML={{ __html: option.konten }} />
                                                        <p className="read-more" style={{textAlign:'center'}}>
                                                        </p>
                                                    </div>
                                                    <Link style={{width:'100%', marginTop:'8px'}} href={"/tampilPertanyaan/"+option.pertanyaan_id}>Baca Selengkapnya</Link> */}
                                                </CardContent>
                                                {/* <CardFooter>
                                                    <Link iconIos="f7:bubble_right" iconAurora="f7:bubble_right" iconMd="material:bubble_right" href={"/tampilPertanyaan/"+option.pertanyaan_id}>&nbsp; {option.jumlah_jawaban} Jawaban</Link>
                                                    <Link iconIos="f7:bell_circle" iconAurora="f7:bell_circle" iconMd="material:bell_circle" onClick={()=>this.simpanPantauan(option.pertanyaan_id)}>&nbsp; {option.jumlah_pantauan} Pantauan</Link>
                                                    <Link iconIos="f7:pencil_ellipsis_rectangle" iconAurora="f7:pencil_ellipsis_rectangle" iconMd="material:pencil_ellipsis_rectangle">&nbsp; Jawab</Link>
                                                </CardFooter> */}
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        })}
                        <Col width="100">

                        </Col>
                    </Row>
                </Block>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getRuang: Actions.getRuang,
      getPertanyaan: Actions.getPertanyaan,
      simpanPertanyaanRuang: Actions.simpanPertanyaanRuang
    }, dispatch);
}

function mapStateToProps({ App, Ruang, Pertanyaan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang,
        pertanyaan: Pertanyaan.pertanyaan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahPertanyaanRuang));
  