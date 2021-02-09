import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, BlockTitle, Card, Searchbar, Subnavbar, CardHeader, CardContent, Row, Col, Link, CardFooter, Checkbox, BlockHeader
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

import Ruang from './ruang';

class tambahAnggotaRuang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            ruang_id: this.$f7route.params['ruang_id'],
            sekolah_id: this.$f7route.params['sekolah_id'],
            keyword: null,
            jabatan_ruang_id: 1,
            start: 0,
            limit: 10
        },
        ruang: {
            rows: [],
            total: 0
        },
        pengguna: {
            rows: [],
            total: 0
        },
        checkPengguna: {}
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
        // console.log(Ruang)

        this.props.getRuang(this.state.routeParams).then((result)=>{
            this.setState({
                ...this.state,
                ruang: this.props.ruang
            },()=>{
                
            })
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

    cariPertanyaan = () => {

        this.$f7.dialog.preloader()
        
        this.setState({
            loading: true,
            routeParams: {
                ...this.state.routeParams,
                keyword: event.target[0].value,
                ruang_id: null
            }
        },()=>{

            this.props.getPengguna(this.state.routeParams).then((result)=>{
                this.setState({
                    pengguna: result.payload
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })
    }

    pilihPengguna = (pengguna_id) => (e, b) => {
        console.log(e.target);
        console.log(pengguna_id);
        // console.log(b);

        this.setState({
            ...this.state,
            checkPengguna: {
                ...this.state.checkPengguna,
                [pengguna_id]: !this.state.checkPengguna[pengguna_id] 
            }
        })
    }

    simpanPenggunaRuang = () => {

        this.$f7.dialog.preloader()
        
        let arrAll = [];
        let n = 0;

        for (var key in this.state.checkPengguna) {
            arrAll.push({pengguna_id:key,status:this.state.checkPengguna[key]});
            n++
        }

        console.log(arrAll);

        if(n < 1){
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Mohon cari atau pilih pengguna terlebih dahulu!', 'Peringatan')
            return true
        }

        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                arrPengguna: JSON.stringify(arrAll),
                ruang_id: this.$f7route.params['ruang_id']
            }
        },()=>{
            this.props.simpanPenggunaRuangBulk(this.state.routeParams).then((result)=>{
                // this.$f7router.navigate('/tampilRuang/'+this.$f7route.params['ruang_id']);
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Berhasil menyimpan anggota ruang', 'Berhasil', ()=>{
                    this.$f7router.navigate('/daftarRuang/'+this.$f7route.params['sekolah_id'])
                })
            });
        });
    }


    gantiJabatanRuang = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                jabatan_ruang_id: e.currentTarget.value
            }
        },()=>{
            console.log(this.state.routeParams)
        })
    }

    render()
    {
        return (
            <Page name="tambahAnggotaRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>
                        {this.state.ruang.rows.map((option)=>{
                            return (
                                <b>Tambah Anggota Ruang {option.nama}</b>
                            )
                        })}
                    </NavTitle>
                    <Subnavbar>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            placeholder="Cari pengguna..."
                            searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariPertanyaan}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                        ></Searchbar>
                    </Subnavbar>
                </Navbar>
                <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">
                        <Block strong style={{marginTop:'0px'}}>
                            <BlockTitle>Centang pengguna yang akan ditambahkan</BlockTitle>
                            
                            <div 
                                style={{
                                    padding:'8px', 
                                    borderRadius:'20px', 
                                    minHeight:'100px', 
                                    border:'1px solid #ccc', 
                                    marginBottom:'8px'
                                }}
                            >
                                {this.state.pengguna.total > 0 &&
                                <BlockHeader style={{marginTop:'0px', marginBottom:'4px', marginRight:'8px', textAlign:'right'}}>
                                    Menampilkan 10 dari {this.formatAngka(this.state.pengguna.total)} hasil pencarian
                                </BlockHeader>
                                }
                                {this.state.pengguna.rows.map((option)=>{
                                    let tanggal = '';
                                    let tgl = new Date(option.create_date);
        
                                    tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                    return (
                                        <Row>
                                            <Col width="10" style={{textAlign:'center', marginTop:'5%'}}>
                                                <Checkbox name={option.pengguna_id} onChange={this.pilihPengguna(option.pengguna_id)} value={this.state.checkPengguna[option.pengguna_id]}></Checkbox>
                                            </Col>
                                            <Col width="90">
                                                <Card style={{margin:'8px'}}>
                                                    <CardContent style={{paddingTop:'8px', padding:'8px'}}>
                                                        <Row>
                                                            <Col width="15" tabletWidth="10" style={{paddingTop:'8px'}}>
                                                                <img src={option.gambar} style={{width:'6vh', height:'6vh', borderRadius:'50%', marginRight:'8px', border:'1px solid #ccc'}} />
                                                            </Col>
                                                            <Col width="85" tabletWidth="90" style={{paddingLeft:'4px'}}>
                                                                <b>{option.nama}</b>
                                                                <br/>
                                                                <span style={{fontSize:'10px'}}>{option.username}</span>
                                                                <br/>
                                                                <span style={{fontSize:'10px'}}>Terdaftar sejak {tanggal}</span>
                                                            </Col>
                                                        </Row>
                                                        {/* <span style={{fontSize:'12px', color: '#8c8c8c'}}>Ditanyakan pada tanggal <b>{tanggal}</b></span><br/>
                                                        <span style={{fontSize:'12px', color: '#8c8c8c'}}>Oleh <b>{option.pengguna}</b></span>
                                                        <hr style={{borderTop:'1px solid #eeeeee'}} /> */}
                                                    </CardContent>
                                                </Card>
                                            </Col>
                                                
                                        </Row>
                                    )
                                })}
                            </div>

                            <List style={{marginTop:'0px', marginBottom:'8px'}}>
                                <ListInput
                                    type="select"
                                    label="Status di dalam ruang"
                                    // outline
                                    defaultValue={this.state.routeParams.jabatan_ruang_id}
                                    onChange={this.gantiJabatanRuang}
                                >
                                    <option value={0} disabled>-</option>
                                    <option value={1}>Guru</option>
                                    <option value={2}>Administrator</option>
                                    <option value={3}>Siswa</option>
                                    <option value={4}>Umum</option>

                                </ListInput>
                            </List>

                            <Button fill raised color="blue" className="bawahCiriBiru" onClick={this.simpanPenggunaRuang} style={{display:'inline-flex'}}>
                                <i className="f7-icons" style={{fontSize:'20px'}}>checkmark_alt_circle_fill</i>&nbsp;Pilih Pengguna
                            </Button>
                            {/* <span className="hilangDiMobile" style={{display:'inline-flex'}}> */}
                                {/* <Link href={"/tambahAnggotaRuangManual/"+this.$f7route.params['ruang_id']+"/"+this.$f7route.params['sekolah_id']}>Tambah anggota secara manual</Link> */}
                            {/* </span> */}
                            <div style={{marginTop:'16px'}}>
                                <Link href={"/tambahAnggotaRuangManual/"+this.$f7route.params['ruang_id']+"/"+this.$f7route.params['sekolah_id']}>Tambah anggota secara manual</Link>
                            </div>
                            {/* <Button color="blue" onClick={this.simpanPenggunaRuang} style={{display:'inline-flex'}}>
                                <i className="f7-icons" style={{fontSize:'20px'}}>plus_app</i>&nbsp;Tambah Pengguna secara manual
                            </Button> */}
                        </Block>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getRuang: Actions.getRuang,
      getPengguna: Actions.getPengguna,
      simpanPenggunaRuangBulk: Actions.simpanPenggunaRuangBulk
    }, dispatch);
}

function mapStateToProps({ App, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tambahAnggotaRuang));
  