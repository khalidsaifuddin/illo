import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Preloader, Radio
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

class vervalSiswa extends Component {
    state = {
        error: null,
        loading: true,
        loadingKuis: true,
        routeParams:{
            sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        sekolah: {},
        sekolah_pengguna_record: {},
        sekolah_pengguna: {
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

        //what to do after mount
        this.props.getSekolah(this.state.routeParams).then((result)=>{
            this.setState({
                sekolah: this.props.sekolah.rows[0],
                routeParams: {
                    ...this.state.routeParams
                    // pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
                }
            },()=>{
                this.props.getSekolahPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        sekolah_pengguna: this.props.sekolah_pengguna,
                        sekolah_pengguna_record: this.props.sekolah_pengguna.rows[0],
                        loading: false
                    });
                });
            });
        });

    }

    verifikasi = () => {
        
        
        if(parseInt(this.state.sekolah_pengguna_record.valid) === 3){
            this.$f7.dialog.confirm('Apabila siswa ini ditolak, maka yang bersangkutan akan langsung dihapus dari daftar siswa di sekolah Anda. Apakah Anda yakin ingin menolak guru ini?', 'Peringatan', ()=>{
                // alert('ditolak!');
                this.setState({
                    loading: true,
                    sekolah_pengguna_record: {
                        ...this.state.sekolah_pengguna_record,
                        soft_delete: 1
                    }
                },()=>{
                    this.props.simpanSekolahPengguna(this.state.sekolah_pengguna_record).then((result)=>{
                        if(result.payload.sukses){
                            //berhasil
                            this.$f7router.navigate('/daftarSiswa/'+this.state.sekolah_pengguna_record.sekolah_id);
                            
                        }else{
                            //gagal
                            this.$f7.dialog.alert('Ada kesalahan pada jaringan atau sistem Anda. Mohon coba kembali dalam beberapa saat!', 'Peringatan');
                            return false;

                        }
                    })
                });
            })
        }else{
            this.$f7.dialog.preloader();
            this.props.simpanSekolahPengguna(this.state.sekolah_pengguna_record).then((result)=>{
                this.$f7.dialog.close();
                if(result.payload.sukses){
                    //berhasil
                    this.$f7.dialog.alert('Verval berhasil!','Berhasil');
                    this.$f7router.navigate("/daftarSiswa/"+this.state.sekolah_pengguna_record.sekolah_id);
                }else{
                    //gagal
                    this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan. Silakan coba kembali dalam beberapa saat!','Peringatan');
                    return false;
                }
            });

        }
    }

    klikVerval = (valid) => {
        // this.$f7.dialog.preloader();
        this.setState({
            ...this.state,
            sekolah_pengguna_record: {
                ...this.state.sekolah_pengguna_record,
                valid: valid
            }
        }); 
    }

    render()
    {
        return (
            <Page name="vervalSiswa" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Verifikasi Siswa</NavTitle>
                </Navbar>
                {this.state.sekolah_pengguna.rows.map((option)=>{
                    return (
                        <>
                        {/* // <>{option.pengguna_id}</> */}
                        <Card>
                            <CardContent>
                                <h1>{option.nama}</h1>
                                <List className={this.state.loading ? "skeleton-text skeleton-effect-blink" : ""}>
                                    <ListItem title="Terverifikasi">
                                        <Radio 
                                            name={"valid"} 
                                            value={1} 
                                            slot="media"
                                            onChange={()=>this.klikVerval(1)}
                                            disabled={this.state.loading}
                                            // onChange={()=>this.klikPilihSekolah(option.sekolah_id, option.nama, option.npsn, (option.alamat_jalan + ", " + option.kecamatan + ", " + option.kabupaten + ", " + option.provinsi), option.bentuk_pendidikan_id, option.status_sekolah, option.jarak)}
                                        />
                                    </ListItem>
                                    {/* <ListItem title="Dalam Proses Verifikasi">
                                        <Radio 
                                            name={"valid"} 
                                            value={2} 
                                            slot="media"
                                            onChange={()=>this.klikVerval(2)}
                                            disabled={this.state.loading}
                                            // onChange={()=>this.klikPilihSekolah(option.sekolah_id, option.nama, option.npsn, (option.alamat_jalan + ", " + option.kecamatan + ", " + option.kabupaten + ", " + option.provinsi), option.bentuk_pendidikan_id, option.status_sekolah, option.jarak)}
                                        />
                                    </ListItem> */}
                                    <ListItem title="Ditolak">
                                        <Radio 
                                            name={"valid"} 
                                            value={3} 
                                            slot="media"
                                            onChange={()=>this.klikVerval(3)}
                                            disabled={this.state.loading}
                                            // onChange={()=>this.klikPilihSekolah(option.sekolah_id, option.nama, option.npsn, (option.alamat_jalan + ", " + option.kecamatan + ", " + option.kabupaten + ", " + option.provinsi), option.bentuk_pendidikan_id, option.status_sekolah, option.jarak)}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                            <Button disabled={(this.state.loading ? true : (this.state.sekolah_pengguna_record.valid === null ? true : false))} raised fill large onClick={this.verifikasi}>
                                {this.state.loading && <Preloader color="white"></Preloader>}&nbsp;Simpan
                            </Button>
                            </CardContent>
                        </Card>
                        </>
                    )
                })}
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
      simpanSekolahPengguna: actions.simpanSekolahPengguna
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        sekolah_pengguna: Sekolah.sekolah_pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(vervalSiswa));
  