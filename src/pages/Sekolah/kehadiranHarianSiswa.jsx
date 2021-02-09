import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Preloader, Radio
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';

class kehadiranHarianSiswa extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        routeParamsSekolah:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah_pengguna: {
            rows: [],
            total: 0
        },
        sekolah_pengguna_record: {},
        geolocation: false,
        zoom: 17,
        lintang: -8.109038,
        bujur: 113.141552,
        kehadiran_siswa_total: 0,
        kehadiran_siswa_record: {
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        sekolah: {},
        tanggal_hari_ini: moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD'),
        arrBulanGabungan: [],
        arrMinggu: [],
        bulan: (parseInt(moment().month())+1),
        tahun: moment().year()
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
    
    hari = [
        // 'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu',
        'Minggu'
    ]
    
    days = [
        // 'Minggu',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]

    loadData = () => {
        
        this.$f7.dialog.preloader();

        console.log(this.state.tanggal_hari_ini);
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                bulan: this.state.bulan,
                tanggal_terakhir: this.daysInMonth(parseInt(this.state.bulan),moment().year()),
                tahun: this.state.tahun
            }
        },()=>{
            console.log(parseInt(moment(this.state.tahun+"-"+this.state.bulan+"-01").isoWeekday()));
            console.log(moment(this.state.tahun+"-"+this.state.bulan+"-01").format('dddd'));
            console.log(this.days.indexOf(moment(this.state.tahun+"-"+this.state.bulan+"-01").format('dddd')));

            let arrBulanGabungan = [];
            
            // for (let index = 0; index < parseInt(moment(this.state.tahun+"-"+this.state.bulan+"-01").isoWeekday()); index++) {
            for (let index = 0; index <= this.days.indexOf(moment(this.state.tahun+"-"+this.state.bulan+"-01").format('dddd')); index++) {
                arrBulanGabungan.push(index);   
            }
            
            this.props.kehadiranHarianSiswa(this.state.routeParams).then((result)=>{
                
                let hariKerja = 0;
                let hariKerjaMasuk = 0;
                let sumPersen = 0;
                let totalPersen = 0;
                let totalGuru = 0;
                
                this.props.kehadiran_harian_siswa.map((option)=>{
                    
                    arrBulanGabungan.push(option);

                    // console.log(parseInt(moment(option.tanggal_bulan).format('D')));
                    // console.log(parseInt(moment().format('D')));

                    // if(moment(option.tanggal_bulan).format('M') === moment().format('M')){
                    //     // bulan ini
                    //     if(parseInt(moment(option.tanggal_bulan).format('D')) <= parseInt(moment().format('D'))){
                    //         // console.log('masih_masuk');
                    //         // console.log(parseInt(moment(option.tanggal_bulan).isoWeekday()));
                    //         // if(parseInt(moment(option.tanggal_bulan).isoWeekday()) !== 6 && parseInt(moment(option.tanggal_bulan).isoWeekday()) !== 7){
                    //         if(parseInt(this.days.indexOf(moment(option.tanggal_bulan).format('dddd'))) !== 5 && parseInt(this.days.indexOf(moment(option.tanggal_bulan).format('dddd'))) !== 6){
                    //             hariKerja++;
    
                    //             if(option.waktu_datang){
                    //                 hariKerjaMasuk++;
                    //             }
    
                    //         }
                    //     }
                    // }else{
                    //     // bulan lain
                    //     if(parseInt(this.days.indexOf(moment(option.tanggal_bulan).format('dddd'))) !== 5 && parseInt(this.days.indexOf(moment(option.tanggal_bulan).format('dddd'))) !== 6){
                    //         hariKerja++;

                    //         if(option.waktu_datang){
                    //             hariKerjaMasuk++;
                    //         }

                    //     }
                    // }

                    if(parseInt(this.state.pengaturan_sekolah['masuk_0'+option.urut_hari]) === 1){
                        
                        sumPersen = sumPersen + (option.persen ? (parseInt(option.total)/parseInt(option.total_guru)*100) : 0);
                        
                        if(option.sekolah_id){
                            totalPersen++;
                        }                        

                        if(option.total_guru){
                            totalGuru = option.total_guru;
                        }

                        hariKerja++;

                        if(option.waktu_datang){
                            hariKerjaMasuk++;
                        }

                    }else{

                        console.log('masuk_0'+option.urut_hari+' libur')

                    }


                });

                // console.log(hariKerja);

                let arrMinggu = [];

                for (let indexMinggu = 0; indexMinggu < Math.ceil(arrBulanGabungan.length/7); indexMinggu++) {
                    // arrMinggu.push((parseInt(indexMinggu)+1));
                    let arrTmpHari = [];
                    for (let indexHari = (parseInt(indexMinggu)*7); indexHari < ((parseInt(indexMinggu)*7)+7); indexHari++) {
                        // const element = array[indexHari];
                        arrTmpHari.push(arrBulanGabungan[indexHari]);
                    }

                    arrMinggu.push(arrTmpHari);
                }
                
                this.setState({
                    arrBulanGabungan: arrBulanGabungan,
                    arrMinggu: arrMinggu,
                    jumlah_minggu: Math.ceil(arrBulanGabungan.length/7),
                    hariKerja: hariKerja,
                    hariKerjaMasuk: hariKerjaMasuk,
                    loading: false
                },()=>{
                    //after
                    console.log(this.state.arrMinggu);
                    console.log(this.state.hariKerja);

                    this.$f7.dialog.close();
                });
            });
            

        });
    }

    componentDidMount = () => {
        this.props.getSekolah(this.state.routeParamsSekolah).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0]
            },()=>{
                this.props.getPengaturanSekolah(this.state.routeParams).then((result)=>{
                    // console.log(this.props.pengaturan_sekolah)
                    this.setState({
                        pengaturan_sekolah: this.props.pengaturan_sekolah.rows[0]
                    },()=>{

                        this.loadData()

                    })
                })
            });
        });
        
        // this.loadData();

        // console.log(arrBulanSebelumnya);
    }

    daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    }

    prevMonth = () => {
        this.setState({
            ...this.state,
            bulan: ((this.state.bulan-1) > 0 ? (this.state.bulan-1) : 12),
            tahun: ((this.state.bulan-1) > 0 ? this.state.tahun : (parseInt(this.state.tahun)-1)),
            tanggal_terakhir: this.daysInMonth(parseInt(this.state.bulan),moment().year())
        },()=>{
            this.loadData();
            // console.log(this.state.bulan + " " + this.state.tahun); 
            // console.log(this.daysInMonth(parseInt(this.state.bulan),moment().year()));
        });
    }

    nextMonth = () => {
        this.setState({
            ...this.state,
            bulan: ((this.state.bulan+1) <= 12 ? (this.state.bulan+1) : 1),
            tahun: ((this.state.bulan+1) <= 12 ? this.state.tahun : (parseInt(this.state.tahun)+1)),
            tanggal_terakhir: this.daysInMonth(parseInt(this.state.bulan),moment().year())
        },()=>{
            // alert(this.state.bulan + " " + this.state.tahun); 
            this.loadData();
            // console.log(this.state.bulan + " " + this.state.tahun); 
            // console.log(this.daysInMonth(parseInt(this.state.bulan),moment().year()));
        });
    }

    render()
    {
        return (
            <Page name="kehadiranHarianSiswa" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kehadiran Harian Siswa</NavTitle>
                </Navbar>
                <Card>
                    <CardContent style={{display:'inline-flex', padding:'8px'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                        <img src={"https://be.diskuis.id"+this.state.sekolah.gambar_logo} style={{width:'20px', height:'20px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} />&nbsp;
                        {/* <img src={localStorage.getItem('api_base')+this.state.sekolah.gambar_logo} style={{width:'20px', marginRight:'0px', border:'1px solid #ccc', borderRadius:'10px'}} />&nbsp; */}
                        <span style={{marginTop:'4px'}}>{this.state.sekolah.nama}</span>
                    </CardContent>
                </Card>
                <Row style={{marginTop:'8px'}}>
                    <Col width="15" style={{textAlign:'center'}}>
                        <Button onClick={this.prevMonth}>
                            <i className="icons f7-icons" style={{color:'#cccccc'}}>chevron_left_square_fill</i>
                        </Button>
                    </Col>
                    <Col width="70">
                        <BlockTitle style={{marginTop:'8px', textAlign:'center'}}>{this.bulan[(parseInt(this.state.bulan)-1)]} {this.state.tahun}</BlockTitle>
                    </Col>
                    <Col width="15" style={{textAlign:'center'}}>
                        <Button onClick={this.nextMonth}>
                            <i className="icons f7-icons" style={{color:'#cccccc'}}>chevron_right_square_fill</i>
                        </Button>
                    </Col>
                </Row>
                <Card style={{margin:'0px', borderRadius:'0px'}}>
                    <CardContent>
                        <Row>
                            <Col width="15" style={{textAlign:'center'}}>Minggu</Col>
                            <Col width="15" style={{textAlign:'center'}}>Senin</Col>
                            <Col width="15" style={{textAlign:'center'}}>Selasa</Col>
                            <Col width="15" style={{textAlign:'center'}}>Rabu</Col>
                            <Col width="15" style={{textAlign:'center'}}>Kamis</Col>
                            <Col width="15" style={{textAlign:'center'}}>Jumat</Col> 
                            <Col width="15" style={{textAlign:'center'}}>Sabtu</Col>
                        </Row>
                    </CardContent>
                </Card>
                <Card style={{padding:'0px', overflow:'hidden', borderRadius:'0px', margin:'0px'}}>
                    <CardContent style={{padding:'0px', overflow:'hidden', borderRadius:'0px'}}>
                        {/* awal bulan hari ke: {moment(moment().year()+"-"+moment().format('MM')+"-01").isoWeekday()}<br/>
                        hari ini hari ke: {moment().isoWeekday()}<br/>
                        hari: {this.hari[moment().isoWeekday()]}<br/>
                        bulan ke: {parseInt(moment().month())+1}<br/>
                        tahun ini: {moment().year()}<br/>
                        bulan ini: {this.daysInMonth(parseInt(moment().month())+1,moment().year())} hari<br/>

                        {Math.ceil(this.state.arrBulanGabungan.length/7)}<br/>
                        {(this.state.arrBulanGabungan.length%7)} */}

                        <div style={{overflow:'hidden',borderRadius:'0px'}}>
                        {/* {this.state.arrBulanSebelumnya.map((optionSebelumnya)=>{
                            return (
                                <div className="kotakHari" style={{background:'#ccc'}}>
                                    {optionSebelumnya}
                                </div>
                            )
                        })}
                        {this.props.kehadiran_harian_siswa.map((option)=>{
                            return (
                                <div className="kotakHari">
                                    {option.tanggal_bulan}
                                </div>

                            )
                        })} */}
                        {/* {this.state.tanggal_hari_ini}<br/> */}
                        {this.state.arrMinggu.map((optionMinggu)=>{
                            return (
                                <div className="kotakMinggu">
                                    {/* {optionMinggu.tanggal_bulan} */}
                                    {/* tes */}
                                    {optionMinggu.map((optionHari)=>{

                                        return (
                                            <>
                                            {/* {optionHari && optionHari.tanggal_bulan === this.state.tanggal_hari_ini && */}
                                            <div 
                                                className="kotakHari" 
                                                style={{
                                                    background: (optionHari ? (parseInt(this.state.pengaturan_sekolah["masuk_0"+(parseInt(moment(optionHari.tanggal_bulan).day())+1)]) === 1 ? 'white' : '#FFEBEE') : 'white'),
                                                    // background: (optionHari ? (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(this.days.indexOf(moment(optionHari.tanggal_bulan).format('dddd'))) === 5 || parseInt(this.days.indexOf(moment(optionHari.tanggal_bulan).format('dddd'))) === 6) ? '#FFEBEE' : 'white') : 'white') : 'white') : '#eeeeee') : '#eeeeee'),
                                                    border:(optionHari && (optionHari.tanggal_bulan === this.state.tanggal_hari_ini) ? '1px solid teal' : '1px solid #eeeeee')
                                                }}
                                            >
                                                {/* {(optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 7 || parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 6) ? 'Libur' : 'Masuk') : <></>) : <></>)}<br/> */}
                                                {(optionHari ? (optionHari.tanggal_bulan ? moment(optionHari.tanggal_bulan).format('DD') : <></>) : <></>)}<br/>
                                                {/* {(optionHari ? (optionHari.waktu_datang ? <i className="icons f7-icons" style={{color:'teal'}}>checkmark_circle_fill</i> : (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 7 || parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 6) ? <></> : <i className="icons f7-icons" style={{color:'#eeeeee'}}>circle</i>) : <></>) : <></>) : <></>)) : <></>)}<br/>
                                                <div style={{fontSize:'9px'}}>
                                                    {(optionHari ? (optionHari.waktu_datang ? (moment(optionHari.waktu_datang).format('H') + ':' + moment(optionHari.waktu_datang).format('mm')) : <></> ): <></>)} -  
                                                    {(optionHari ? (optionHari.waktu_pulang ? (moment(optionHari.waktu_pulang).format('H') + ':' + moment(optionHari.waktu_pulang).format('mm')) : <></> ): <></>)}
                                                </div> */}

                                                {(optionHari ? (optionHari.tanggal_bulan ? 
                                                ((parseInt(this.state.pengaturan_sekolah["masuk_0"+(parseInt(moment(optionHari.tanggal_bulan).day())+1)]) !== 1) ? <><div style={{marginTop:'10%'}}>Hari Libur</div></> : 
                                                // ((parseInt(moment(optionHari.tanggal_bulan).day()) === 0 || parseInt(moment(optionHari.tanggal_bulan).day()) === 6) ? <></> : 
                                                <>
                                                {(optionHari ? (optionHari.waktu_datang ? <i className="icons f7-icons" style={{color:'teal'}}>checkmark_circle_fill</i> : (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 7 || parseInt(moment(optionHari.tanggal_bulan).isoWeekday()) === 6) ? <></> : <i className="icons f7-icons" style={{color:'#eeeeee'}}>circle</i>) : <></>) : <></>) : <></>)) : <></>)}<br/>
                                                <div style={{fontSize:'9px'}}>
                                                    {(optionHari ? (optionHari.waktu_datang ? (moment(optionHari.waktu_datang).format('H') + ':' + moment(optionHari.waktu_datang).format('mm')) : <></> ): <></>)} -  
                                                    {(optionHari ? (optionHari.waktu_pulang ? (moment(optionHari.waktu_pulang).format('H') + ':' + moment(optionHari.waktu_pulang).format('mm')) : <></> ): <></>)}
                                                </div>
                                                </>
                                                )
                                                : (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).day()) === 0 || parseInt(moment(optionHari.tanggal_bulan).day()) === 6) ? <></> : 
                                                <></>
                                                ) : <></>) : <></>) : <></>)) : <></>)}

                                            </div>
                                            {/* } */}
                                            {/* {optionHari && optionHari.tanggal_bulan !== this.state.tanggal_hari_ini &&
                                            <div className="kotakHari">
                                                {(optionHari ? (optionHari.tanggal_bulan ? moment(optionHari.tanggal_bulan).format('DD') : <></>) : <></>)}
                                            </div>
                                            } */}
                                            </>
                                        )
                                    })}

                                </div>
                            )
                        })}
                        {/* {this.state.arrBulanGabungan.map((option)=>{
                            return (
                                <div className="kotakHari">
                                    {(option.tanggal_bulan ? option.tanggal_bulan : option)}
                                </div>

                            )
                        })} */}
                        </div>
                        <Row noGap>
                            <Col width="50">
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                                    <CardHeader>
                                        Jumlah Kehadiran
                                    </CardHeader>
                                    <CardContent style={{minHeight:'65px'}}>
                                        <b style={{fontSize:'30px'}}>{parseFloat(this.state.hariKerjaMasuk)}</b> / {parseFloat(this.state.hariKerja)}<br/>
                                        hari kerja
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="50">
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                                    <CardHeader>
                                        Persentase
                                    </CardHeader>
                                    <CardContent style={{minHeight:'65px'}}>
                                        <b style={{fontSize:'30px'}}>{parseFloat(parseFloat(this.state.hariKerjaMasuk)/parseFloat(this.state.hariKerja)*100).toFixed(2)}</b>%
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>

                        {/* {parseFloat(parseFloat(this.state.hariKerjaMasuk)/parseFloat(this.state.hariKerja)*100).toFixed(2)} */}

                        {/* {this.state.hariKerjaMasuk}/{this.state.hariKerja}*100<br/> */}

                    </CardContent>
                </Card>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getSekolah: actions.getSekolah,
      getSekolahPengguna: actions.getSekolahPengguna,
      simpanSekolahPengguna: actions.simpanSekolahPengguna,
      kehadiranHarianSiswa: actions.kehadiranHarianSiswa,
      getPengaturanSekolah: actions.getPengaturanSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Guru }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna,
        kehadiran_harian_siswa: Guru.kehadiran_harian_siswa,
        pengaturan_sekolah: Sekolah.pengaturan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kehadiranHarianSiswa));
  