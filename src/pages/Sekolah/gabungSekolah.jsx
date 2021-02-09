import React, {Component} from 'react';
import {
    Page, Button, Card, CardContent, List, ListInput, Row, Col, BlockTitle
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import SekolahReducer from '../../store/reducers/Sekolah.reducers';


class gabungSekolah extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        },
        loading:true,
        undangan_sekolah: {
            rows: [],
            total: 0
        },
        undangan_sekolah_record: {}
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
        this.setState({
            routeParams: {
                ...this.state.routeParams
            }
        },()=>{
            // this.props.getKuis(this.state.routeParams).then((result)=>{
            //     this.setState({
            //         loading:false
            //     });
            // });
        });

    }

    copyCodeToClipboard = () => {
        // console.log(this.textArea);
        const el = this.textArea;
        el.select();
        document.execCommand("copy");
    }

    setStateValue = (key) => (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: e.currentTarget.value
            }
        },()=>{

        });

    }

    tampilkanSekolah = () => {
        this.$f7.dialog.preloader();

        this.props.getUndanganSekolah(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close();

            this.setState({
                ...this.state,
                undangan_sekolah: this.props.undangan_sekolah,
                undangan_sekolah_record: this.props.undangan_sekolah.rows[0]
            },()=>{
                if(this.state.undangan_sekolah.total < 1){
                    this.$f7.dialog.alert('Sekolah tidak ditemukan! Silakan coba kembali menggunakan kode sekolah lain, atau pastikan kode sekolah yang diketikkan benar', 'Peringatan');
                }
            });
        });

    }

    prosesGabungSekolah = (sekolah_id, jabatan_sekolah_id) => {
        // this.$f7.dialog.alert(sekolah_id);
        this.$f7.dialog.preloader();

        this.setState({
            routeParamsSimpan: {
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                sekolah_id: sekolah_id,
                jabatan_sekolah_id: jabatan_sekolah_id,
                undangan: 'Y'
            }
        },()=>{
            this.props.simpanSekolahPengguna(this.state.routeParamsSimpan).then((result)=>{
                this.$f7.dialog.close();

                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Selamat bergabung!','Berhasil');
                    this.$f7router.navigate('/'+(parseInt(jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+this.state.routeParamsSimpan.sekolah_id);
                }else{
                    //gagal
                    if(result.payload.pesan === 'pengguna_sudah_terdaftar'){
                        //sudah terdaftar
                        this.$f7.dialog.alert('Anda telah bergabung sebelumnya ke sekolah ini!','Peringatan');
                        return false;
                    }else{
                        //gagal aja
                        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Silakan coba kembali dalam beberapa saat!','Peringatan');
                        return false;
                    }
                }
            });
        });
        // this.props.simpanSekolahPengguna()
    }

    render()
    {
        return (
            <Page name="gabungSekolah" hideBarsOnScroll>
                <Row>
                <Col width="0" tabletWidth="15"></Col>
                <Col width="100" tabletWidth="70">
                    <Card>
                        <CardContent style={{textAlign:'center'}}>
                            {/* <i className="icon f7-icons" style={{fontSize:'120px', color:'#F27121'}}>building_2_fill</i> */}
                            <img src="./static/icons/sekolah.png" style={{width:'60%', maxWidth:'400px', marginBottom:'-50px'}} />
                            <h3>Gabung Sekolah Sekarang!</h3>
                            <h4>Masukkan kode undangan sekolah:</h4>
                            <List>
                                <ListInput
                                    // label={"Kode Kuis"}
                                    outline
                                    floatingLabel
                                    clearButton
                                    type="text"
                                    // resizable
                                    placeholder={"Kode Sekolah"}
                                    style={{width:'100%'}}
                                    onChange={this.setStateValue('kode_sekolah')}
                                    // defaultValue={element.teks}
                                    >
                                </ListInput>
                            </List>
                            <br/>
                            <Button className="bawahCiriBiru cardBorder-20" raised large fill onClick={this.tampilkanSekolah}>
                                <i className="icon f7-icons" style={{fontSize:'30px'}}>person_badge_plus_fill</i>&nbsp;
                                Tampilkan Sekolah
                            </Button>
                        </CardContent>
                    </Card>
                    {this.state.undangan_sekolah.total > 0 &&
                    <>
                    <BlockTitle>Sekolah</BlockTitle>
                    <Card>
                        <CardContent>
                            <div style={{width:'100%',display:'inline-flex'}}>
                                <div style={{width:'60px',border:'0px solid #ccc'}}>
                                <img src={"https://be.diskuis.id"+this.state.undangan_sekolah_record.gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/>
                                {/* <img src={localStorage.getItem('api_base')+this.state.undangan_sekolah_record.gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/> */}
                                </div>
                                <div style={{marginLeft:'16px'}}>
                                    <b>{this.state.undangan_sekolah_record.nama} {this.state.undangan_sekolah_record.npsn ? <>({this.state.undangan_sekolah_record.npsn})</> : <></>}</b><br/>
                                    <div style={{marginBottom:'8px'}}>{this.state.undangan_sekolah_record.keterangan}</div>
                                    {/* <br/> */}
                                    Anda diundang untuk bergabung sebagai <b>{this.state.undangan_sekolah_record.jabatan_sekolah}</b> oleh <b>{this.state.undangan_sekolah_record.nama_pengguna}</b>
                                </div>
                            </div>
                            <div>
                                <Button raised fill className="bawahCiriHijau color-theme-teal" style={{marginTop:'8px'}} onClick={()=>this.prosesGabungSekolah(this.state.undangan_sekolah_record.sekolah_id, this.state.undangan_sekolah_record.jabatan_sekolah_id)}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>paperplane</i>&nbsp;
                                    Bergabung ke Sekolah
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    </>
                    }
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
      getUndanganSekolah: Actions.getUndanganSekolah,
      simpanSekolahPengguna: Actions.simpanSekolahPengguna,
      getSekolahPengguna: Actions.getSekolahPengguna
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        undangan_sekolah: Sekolah.undangan_sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(gabungSekolah));
  