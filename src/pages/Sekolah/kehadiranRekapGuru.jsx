import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Preloader, Radio, Gauge
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

class kehadiranRekapGuru extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
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
        kehadiran_guru_total: 0,
        kehadiran_guru_record: {
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null
        },
        sekolah: {},
        tanggal_hari_ini: moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD'),
        arrBulanGabungan: [],
        arrMinggu: [],
        bulan: (parseInt(moment().month())+1),
        tahun: moment().year(),
        persen_bulanan: 0,
        total_guru: 0,
        pengaturan_sekolah: {}
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
        'Minggu',
        'Senin',
        'Selasa',
        'Rabu',
        'Kamis',
        'Jumat',
        'Sabtu'
    ]

    loadData = () => {
        this.$f7.dialog.preloader();

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                bulan: this.state.bulan,
                tanggal_terakhir: parseInt(this.state.bulan) !== 2 ? this.daysInMonth(parseInt(this.state.bulan),moment().year()) : 28,
                tahun: this.state.tahun
            }
        },()=>{
            let arrBulanGabungan = [];
            
            for (let index = 0; index < parseInt(moment(this.state.tahun+"-"+this.state.bulan+"-01").day()); index++) {
                arrBulanGabungan.push(index);
            }
            
            this.props.kehadiranRekapGuru(this.state.routeParams).then((result)=>{

                let sumPersen = 0;
                let totalPersen = 0;
                let totalGuru = 0;
                
                console.log(this.props.kehadiran_rekap_guru)

                this.props.kehadiran_rekap_guru.map((option)=>{

                    // console.log(parseInt(this.state.pengaturan_sekolah['masuk_0'+option.urut_hari]))
                    // console.log('masuk_0'+option.urut_hari)

                    // console.log(option)
                    
                    arrBulanGabungan.push(option)

                    if(parseInt(this.state.pengaturan_sekolah['masuk_0'+option.urut_hari]) === 1){
                        
                        sumPersen = sumPersen + (option.persen ? (parseInt(option.total)/parseInt(option.total_guru)*100) : 0);
                        
                        if(option.sekolah_id){
                            totalPersen++;
                        }                        

                        if(option.total_guru){
                            totalGuru = option.total_guru;
                        }

                    }else{

                        console.log('masuk_0'+option.urut_hari+' libur')

                    }


                })

                // console.log(totalPersen)

                console.log(sumPersen);
                console.log(totalPersen);

                let persen = sumPersen/totalPersen;

                console.log(persen);

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
                    loading: false,
                    persen_bulanan: persen,
                    total_guru: totalGuru
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
        console.log(this.state);

        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0]
            },()=>{
                this.props.getPengaturanSekolah(this.state.routeParams).then((result)=>{
                    // console.log(this.props.pengaturan_sekolah)

                    if(result.payload.total > 0){

                        this.setState({
                            pengaturan_sekolah: this.props.pengaturan_sekolah.rows[0]
                        },()=>{
    
                            this.loadData()
    
                        })
                    }else{
                        // this.$f7.dialog.alert('tes')
                        // this.$f7.dialog.alert('Rekap kehadiran Anda belum dapat ditampilkan karena sekolah Anda belum melakukan pengaturan kehadiran. Mohon hubungi administrator sekolah Anda untuk dapat menggunakan menu ini', 'Peringatan', ()=>{
                        this.$f7.dialog.alert('Sebelum membuka rekap kehadiran guru, mohon tentukan pengaturan kehadiran di pengaturan sekolah terlebih dahulu', 'Peringatan', ()=>{
                            // alert('oke')
                            this.$f7router.navigate("/pengaturanPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.$f7route.params['sekolah_id'])
                        })  
                    }

                })
            });
        });
        

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

    unduhLaporan = (bulan) => {
        // alert(bulan)
        window.open(localStorage.getItem('api_base')+"/api/Sekolah/unduhLaporanKehadiranGuru?sekolah_id="+this.$f7route.params['sekolah_id']+"&bulan="+bulan+"&tahun="+this.state.tahun)
    }

    render()
    {
        return (
            <Page name="kehadiranRekapGuru" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Rekap Kehadiran Harian Guru</NavTitle>
                </Navbar>
                <Card>
                    <CardContent style={{display:'inline-flex', padding:'8px'}} className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                        <img src={"https://be.diskuis.id"+this.state.sekolah.gambar_logo} style={{width:'20px', marginRight:'0px', height:'20px', border:'1px solid #ccc', borderRadius:'10px'}} />&nbsp;
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
                <Card style={{margin:'0px',borderRadius:'0px'}}>
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
                        <div style={{overflow:'hidden',borderRadius:'0px'}}>
                        {this.state.arrMinggu.map((optionMinggu)=>{
                            return (
                                <div className="kotakMinggu">
                                    {optionMinggu.map((optionHari)=>{
                                        
                                        // console.log("masuk_"+(parseInt(moment(optionHari.tanggal_bulan).day())+1))
                                        // console.log( parseInt(this.days.indexOf(moment(optionHari.tanggal_bulan).format('dddd'))) )

                                        return (
                                            <>
                                            <div 
                                                className="kotakHari" 
                                                style={{
                                                    background: (optionHari ? (parseInt(this.state.pengaturan_sekolah["masuk_0"+(parseInt(moment(optionHari.tanggal_bulan).day())+1)]) === 1 ? 'white' : '#FFEBEE') : 'white'),
                                                //     background: (optionHari ? (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).day()) === 0 || parseInt(moment(optionHari.tanggal_bulan).day()) === 6) ? '#FFEBEE' : 'white') : 'white') : 'white') : '#eeeeee') : '#eeeeee'),
                                                    border:(optionHari && (optionHari.tanggal_bulan === this.state.tanggal_hari_ini) ? '1px solid teal' : '1px solid #eeeeee')
                                                }}
                                            >
                                                {(optionHari ? (optionHari.tanggal_bulan ? moment(optionHari.tanggal_bulan).format('DD') : <></>) : <></>)}<br/>
                                                {(optionHari ? (optionHari.tanggal_bulan ? 
                                                ((parseInt(this.state.pengaturan_sekolah["masuk_0"+(parseInt(moment(optionHari.tanggal_bulan).day())+1)]) !== 1) ? <><div style={{marginTop:'40%'}}>Hari Libur</div></> : 
                                                // ((parseInt(moment(optionHari.tanggal_bulan).day()) === 0 || parseInt(moment(optionHari.tanggal_bulan).day()) === 6) ? <></> : 
                                                <>
                                                <Gauge
                                                    style={{padding:'8px'}}
                                                    type="circle"
                                                    value={(optionHari.total ? ((optionHari.total)/parseFloat(optionHari.total_guru)) : 0)}
                                                    size={250}
                                                    borderColor="#2196f3"
                                                    // borderWidth={10}
                                                    valueText={`${parseFloat((optionHari.total ? (parseFloat(optionHari.total)/parseFloat(optionHari.total_guru)) : 0) * 100).toFixed(0)}%`}
                                                    valueFontSize={80}
                                                    valueTextColor="#2196f3"
                                                    // labelText="Guau"
                                                    labelFontWeight={800}
                                                    labelFontSize={12}
                                                    borderWidth={30}
                                                /> 
                                                {optionHari.total &&
                                                <div style={{fontSize:'10px'}}>
                                                    {optionHari.total} dari {optionHari.total_guru} guru
                                                </div>
                                                }
                                                {!optionHari.total &&
                                                <div style={{fontSize:'10px'}}>
                                                    -
                                                </div>
                                                }
                                                </>
                                                )
                                                : (optionHari.tanggal_bulan ? (optionHari ? (optionHari.tanggal_bulan ? ((parseInt(moment(optionHari.tanggal_bulan).day()) === 0 || parseInt(moment(optionHari.tanggal_bulan).day()) === 6) ? <></> : 
                                                // <Gauge
                                                //     style={{padding:'4px'}}
                                                //     type="circle"
                                                //     value={(optionHari.total ? (parseFloat(optionHari.total)/parseFloat(optionHari.total_guru)) : '0')}
                                                //     size={250}
                                                //     borderColor="#2196f3"
                                                //     // borderWidth={10}
                                                //     valueText={`${(optionHari.total ? (parseFloat(optionHari.total)/parseFloat(optionHari.total_guru)) : 0) * 100}%`}
                                                //     valueFontSize={80}
                                                //     valueTextColor="#2196f3"
                                                //     // labelText="Guau"
                                                //     labelFontWeight={800}
                                                //     labelFontSize={12}
                                                //     borderWidth={30}
                                                // />
                                                <></>
                                                ) : <></>) : <></>) : <></>)) : <></>)}<br/>
                                                {/* <Gauge
                                                    style={{padding:'4px'}}
                                                    type="circle"
                                                    value={0.5}
                                                    size={250}
                                                    borderColor="#2196f3"
                                                    // borderWidth={10}
                                                    valueText={`${0.5 * 100}%`}
                                                    valueFontSize={80}
                                                    valueTextColor="#2196f3"
                                                    // labelText="Guau"
                                                    labelFontWeight={800}
                                                    labelFontSize={12}
                                                    borderWidth={30}
                                                /> */}
                                            </div>
                                            </>
                                        )
                                    })}

                                </div>
                            )
                        })}
                        </div>
                        <Row noGap>
                            {/* <Col width="50">
                                
                            </Col> */}
                            <Col width="50">
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                                    <CardHeader>
                                        Persentase Kehadiran Rata-rata
                                    </CardHeader>
                                    <CardContent style={{minHeight:'65px'}}>
                                        <b style={{fontSize:'30px'}}>{parseFloat(this.state.persen_bulanan).toFixed(2)}</b>%<br/>
                                        dari total {this.state.total_guru} guru
                                    </CardContent>
                                </Card>
                            </Col>
                            <Col width="50">
                                <Card className={this.state.loading ? "skeleton-text skeleton-effect-blink label-cell" : ""}>
                                    <CardHeader>
                                        Laporan Kehadiran {this.bulan[(parseInt(this.state.bulan)-1)]} {this.state.tahun}
                                    </CardHeader>
                                    <CardContent style={{minHeight:'65px'}}>
                                        <Button raised fill className="color-theme-teal bawahCiriHijau" onClick={()=>this.unduhLaporan(parseInt(this.state.bulan))}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>cloud_download</i>&nbsp;
                                            Unduh File Xls
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Col>
                        </Row>
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
      kehadiranRekapGuru: actions.kehadiranRekapGuru,
      getPengaturanSekolah: actions.getPengaturanSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Guru }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna,
        kehadiran_rekap_guru: Guru.kehadiran_rekap_guru,
        pengaturan_sekolah: Sekolah.pengaturan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kehadiranRekapGuru));
  