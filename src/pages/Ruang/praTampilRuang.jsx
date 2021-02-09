import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, CardHeader, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class praTampilRuang extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            ruang_id: this.$f7route.params['ruang_id'],
            kode_ruang: this.$f7route.params['kode_ruang'],
            jabatan_ruang_id: 1
        },
        loading:true,
        ruang: {
            rows: [{
                ruang_id: '',
                nama: '-'
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

    componentDidMount = () => {
        
        this.props.getRuang(this.state.routeParams).then((result)=>{
            if(result.payload.result < 1){
                //tidak ada ruang
                this.$f7.dialog.confirm('Ruang tidak ditemukan! Silakan cek kembali kode ruang yang Anda gunakan dan pastikan tidak ada yang salah!', 'Peringatan', ()=>{
                    this.$f7router.navigate("/gabungRuang/");
                    return false;
                });

            }else{

                this.setState({
                    loading:false,
                    ruang_id: this.props.ruang.rows[0].ruang_id, 
                    ruang: this.props.ruang,
                    routeParams: {
                        ...this.state.routeParams,
                        ruang_id: this.props.ruang.rows[0].ruang_id,
                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                    }
                },()=>{
                    this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
                        // this.setState({
                        //     ...this.state,
                        //     routeParams:{
                        //         ...this.state.routeParams,
                        //         pengguna_id: null
                        //     }
                        // },()=>{
            
                        //     this.props.getRuang(this.state.routeParams).then((result)=>{
                        //         this.setState({
                        //             loading:false,
                        //             ruang_id: this.props.ruang.rows[0].ruang_id, 
                        //             kuis: this.props.ruang
                        //         },()=>{
                                    
                        //         });
                        //     });
            
                        // });
                    });
                });

            }
        });
        // this.setState({
        //     routeParams: {
        //         ...this.state.routeParams
        //     }
        // },()=>{
        //     // this.props.getRuang(this.state.routeParams).then((result)=>{
        //     //     this.setState({
        //     //         loading:false
        //     //     });
        //     // });
        // });
        // this.setState({
        //     ...this.state,
        //     routeParams: {
        //         ...this.state.routeParams,
        //         ruang_id: this.state.ruang_id
        //     }
        // },()=>{
        // this.props.getPenggunaRuang(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         ...this.state,
        //         routeParams:{
        //             ...this.state.routeParams,
        //             pengguna_id: null
        //         }
        //     },()=>{

        //         this.props.getRuang(this.state.routeParams).then((result)=>{
        //             this.setState({
        //                 loading:false,
        //                 ruang_id: this.props.ruang.rows[0].ruang_id, 
        //                 kuis: this.props.ruang
        //             },()=>{
                        
        //             });
        //         });

        //     });
        // });
        // });


    }

    tampilRuang = () => {
        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                ruang_id: this.state.ruang_id,
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
            }
        },()=>{

            this.props.simpanPenggunaRuang(this.state.routeParams).then((result)=>{
                this.$f7router.navigate('/tampilRuang/'+this.state.routeParams.ruang_id);
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
            <Page name="praTampilRuang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    {/* <NavTitle sliding>Kuis</NavTitle>
                    <NavTitleLarge>
                        Kuis
                    </NavTitleLarge> */}
                </Navbar>
                <Row noGap>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                    {this.state.ruang.rows.map((option)=>{
                        let waktu_mulai = '';
                        let tgl_waktu_mulai = new Date(option.waktu_mulai);
                        waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY') + ', pukul ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');
                        
                        let waktu_selesai = '';
                        let tgl_waktu_selesai = new Date(option.waktu_selesai);
                        waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY') + ', pukul ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                        return (
                            <Card className={this.state.loading ? "skeleton-text skeleton-text-blink" : ""}>
                                <CardHeader style={{height:'200px', backgroundImage:'url('+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_ruang+')', backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat', borderRadius:'20px 20px 0px 0px'}}>
                                    <div className="mantab" style={{
                                        backgroundColor:'rgba(0, 0, 0, 0.6)',
                                        width:'1000%',
                                        marginLeft:'-15px',
                                        marginRight:'-15px',
                                        paddingLeft:'10px',
                                        marginBottom:'-35px',
                                        color:'white',
                                        paddingBottom:'0px',
                                        height:'55px',
                                        paddingTop:'10px',
                                        paddingLeft: '16px'
                                    }}>
                                        <Link href={""} style={{color:'white'}}>
                                            <h2 style={{marginTop:'0px',marginBottom:'0px'}}>
                                                {option.nama}
                                            </h2>
                                        </Link>
                                        <div style={{marginTop:'0px', fontSize:'12px', color: '#cccccc'}}>Oleh <b>{option.pengguna}</b></div><br/>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h4>{option.keterangan}</h4>
                                    <div style={{borderBottom:'1px solid #cccccc', marginBottom:'16px'}}></div>

                                    <List>
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

                                            {/* {this.state.tahun_ajaran.rows.map((option)=>{
                                                return (
                                                    <option value={option.tahun_ajaran_id}>{option.nama}</option>
                                                    )
                                            })} */}
                                        </ListInput>
                                    </List>
                                    <br/>

                                    <Button raised fill large onClick={this.tampilRuang}>
                                        <i className="icons f7-icons" style={{fontSize:'20px'}}>checkmark_circle_fill</i>&nbsp;
                                        Bergabung ke Ruang
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                    </Col>
                    <Col width="0" tabletWidth="15"></Col>
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
      getPenggunaRuang: Actions.getPenggunaRuang,
      simpanPenggunaRuang: Actions.simpanPenggunaRuang
    }, dispatch);
}

function mapStateToProps({ App, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(praTampilRuang));
