import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Row, Col, BlockHeader, Preloader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

import moment from 'moment';

class notifikasi extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        notifikasi: {
            total: 0,
            rows: []
        },
        notifikasi_sudah_dibaca: {
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

    componentDidMount = () => {
        let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
        socket.on('updateNotifikasi', (pengguna_id) => {
        
            if(JSON.parse(localStorage.getItem('user')).pengguna_id === pengguna_id){
    
              this.props.getNotifikasiRedisBelumDibaca({
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
                tipe: 'belum_dibaca'
              }).then((result)=>{
                this.setState({
                  notifikasi: result.payload
                })
              })
    
            }
    
        })

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                dibaca: null
            }
        },()=>{
            this.props.getNotifikasiRedis({...this.state.routeParams, tipe:'belum_dibaca'}).then((result)=>{
                this.setState({
                    notifikasi: result.payload,
                    loading: false
                },()=>{
                    this.props.getNotifikasiRedis({...this.state.routeParams, tipe:'sudah_dibaca'}).then((result)=>{
                        this.setState({
                            notifikasi_sudah_dibaca: result.payload
                        })
                    })
                })
            })
        });

    }

    klikNotifikasi = (notifikasi_id, tautan) => {
        // alert('oke');
        // this.setState({
        //     ...this.state,
        //     routeParamsBaca:{
        //         notifikasi_id: notifikasi_id,
        //         dibaca: "2"
        //     }
        // },()=>{
        //     this.props.simpanNotifikasi(this.state.routeParamsBaca).then((result)=>{
        //         // this.props.getNotifikasi(this.state.routeParams);
        //         this.$f7router.navigate(tautan);
        //     });
        // });
        this.$f7.dialog.preloader()

        this.props.bacaNotifikasi({
            notifikasi_id: notifikasi_id,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        }).then((result)=>{
            
            this.$f7.dialog.close()
            this.$f7router.navigate(tautan);

            // this.props.getNotifikasiRedis({...this.state.routeParams, tipe:'belum_dibaca'}).then((result)=>{
            //     this.setState({
            //         notifikasi: result.payload
            //     },()=>{ 
            //         // this.$f7.dialog.close()
    
            //         // this.$f7router.navigate(tautan);
            //         this.props.getNotifikasiRedis({...this.state.routeParams, tipe:'sudah_dibaca'}).then((result)=>{
            //             this.setState({
            //                 notifikasi: result.payload
            //             },()=>{ 
            //                 this.$f7.dialog.close()
            
            //                 this.$f7router.navigate(tautan);
            //             })
            //         })
            //     })
            // })
        })

    }
    klikNotifikasiDibaca = (notifikasi_id, tautan) => {
        
        this.$f7router.navigate(tautan);
        
    }

    render()
    {
        return (
            <Page name="notifikasi" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Notifikasi</NavTitle>
                    {/* <NavTitleLarge>
                        Notifikasi
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">
                        {this.state.loading &&
                        <div style={{width:'100%', textAlign:'center', paddingTop:'16px'}}>
                            <Preloader size={42} />
                        </div>
                        }
                        {!this.state.loading &&
                        <>
                        <Block strong style={{marginTop:'0px', marginBottom:'8px'}}>
                            {this.state.notifikasi.total > 0 &&
                                <span>Ada {this.state.notifikasi.total} notifikasi baru untuk Anda</span>
                            }
                            {this.state.notifikasi.total < 1 &&
                                <span>Belum ada notifikasi baru untuk Anda</span>
                            }
                        </Block>
                        {this.state.notifikasi.rows.map((option)=>{
                            if(option){
                                
                                // let tanggal = '';
                                // let tgl = new Date(option.create_date);
    
                                // tanggal = tgl.getDate() + ' ' + this.bulan[tgl.getMonth()] + ' ' + tgl.getFullYear();
                                
                                let tanggal = '';
                                tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                return(
                                    // <Link style={{width:'100%'}} onClick={()=>this.klikNotifikasi(option.notifikasi_id, option.tautan)}>
                                    //     <Block strong style={{marginTop:'0px', marginBottom:'0px', backgroundColor:parseInt(option.dibaca) === 2 ? '#ffffff' : '#dfdfdf', fontWeight:parseInt(option.dibaca) === 2 ? 'none' : 'bold', width:'100%'}}>
                                            
                                    //         <p style={{color:'#007AFF'}}>
                                    //             <Icon style={{fontSize:'15px', color:'#ff0000'}} ios={parseInt(option.dibaca) === 1 ? "f7:circle_fill" : "f7:circle"} aurora={parseInt(option.dibaca) === 1 ? "f7:circle_fill" : "f7:circle"} md={parseInt(option.dibaca) === 1 ? "material:circle_fill" : "material:circle"} tooltip="Notifikasi"/>&nbsp;&nbsp;
                                    //             {option.judul}<br/>
                                    //         </p>
                                    //         Tanggal {tanggal} pukul {option.create_date.substring(11,16)}
                                    //     </Block>
                                    // </Link>
                                    <Link style={{width:'100%', color:'#434343'}} onClick={()=>this.klikNotifikasi(option.notifikasi_id, (option.notifikasi_tipe === 'komentar_aktivitas' ? "/aktivitas/"+option.aktivitas_pertanyaan_id : (option.notifikasi_tipe === 'aktivitas_ruang' ? "/aktivitas/"+option.aktivitas_pertanyaan_id : (option.notifikasi_tipe === 'aktivitas_sekolah' ? "/aktivitas/"+option.aktivitas_pertanyaan_id : null))))}>
                                        <Block strong style={{marginTop:'0px', marginBottom:'0px', backgroundColor:'#ffffff', fontWeight:'none', width:'100%'}}>
                                            {/* <p style={{color:'#434343'}}> */}
                                            <Row>
                                                <Col width="5">
                                                    <Icon style={{fontSize:'15px', color:'#ff0000'}} ios={"f7:circle_fill"} aurora={"f7:circle_fill"} md={"f7:circle_fill"} tooltip="Notifikasi"/>&nbsp;&nbsp;
                                                </Col>
                                                <Col width="95">
                                                    {option.notifikasi_tipe === 'komentar_aktivitas' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> memberikan komentar pada aktivitas <b>{option.pemilik_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    {option.notifikasi_tipe === 'aktivitas_ruang' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> menambahkan aktivitas di ruang <b>{option.ruang_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    {option.notifikasi_tipe === 'aktivitas_sekolah' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> menambahkan aktivitas di <b>{option.sekolah_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    <br/>
                                                    {/* </p> */}
                                                    <span style={{fontSize:'10px'}}>
                                                        {tanggal}, {option.create_date.substring(11,16)}
                                                    </span>
                                                </Col>
                                            </Row>
                                        </Block>
                                    </Link>
                                )
                            }
                        })}

                        <BlockHeader>Notifikasi yang sudah dibaca</BlockHeader>
                        {this.state.notifikasi_sudah_dibaca.rows.reverse().map((option)=>{

                            if(option){
                                
                                let tanggal = '';
                                tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');

                                return(
                                    <Link style={{width:'100%', color:'#434343'}} onClick={()=>this.klikNotifikasiDibaca(option.notifikasi_id, (option.notifikasi_tipe === 'komentar_aktivitas' ? "/aktivitas/"+option.aktivitas_pertanyaan_id : "/aktivitas/"+option.aktivitas_pertanyaan_id))}>
                                        <Block strong style={{marginTop:'0px', marginBottom:'0px', backgroundColor:'#efefef', fontWeight:'none', width:'100%'}}>
                                            <Row>
                                                <Col width="5">
                                                    <Icon style={{fontSize:'15px', color:'#ff0000'}} ios={"f7:circle"} aurora={"f7:circle"} md={"f7:circle"} tooltip="Notifikasi"/>&nbsp;&nbsp;
                                                </Col>
                                                <Col width="95">
                                                    {option.notifikasi_tipe === 'komentar_aktivitas' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> memberikan komentar pada aktivitas <b>{option.pemilik_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    {option.notifikasi_tipe === 'aktivitas_ruang' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> menambahkan aktivitas di ruang <b>{option.ruang_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    {option.notifikasi_tipe === 'aktivitas_sekolah' &&
                                                    <>
                                                    <b>{option.pelaku_nama}</b> menambahkan aktivitas di <b>{option.sekolah_nama}</b> "{option.aktivitas_teks}"&nbsp;
                                                    </>
                                                    }
                                                    <br/>
                                                    <span style={{fontSize:'10px'}}>
                                                        {tanggal}, {option.create_date.substring(11,16)}
                                                    </span>
                                                </Col>
                                            </Row>
                                        </Block>
                                    </Link>
                                )
                                
                            }
                        
                        })}
                        </>
                        }
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
      getNotifikasi: Actions.getNotifikasi,
      simpanNotifikasi: Actions.simpanNotifikasi,
      getNotifikasiRedis: Actions.getNotifikasiRedis,
      bacaNotifikasi: Actions.bacaNotifikasi,
      getNotifikasiRedisBelumDibaca: Actions.getNotifikasiRedisBelumDibaca
    }, dispatch);
}

function mapStateToProps({ App, Notifikasi }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        notifikasi: Notifikasi.notifikasi,
        notifikasi_belum_dibaca: Notifikasi.notifikasi_belum_dibaca
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(notifikasi));
  