import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


import moment from 'moment';

class cariKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            jawaban_diacak: 0,
            tampilkan_jawaban_benar: 0,
            tanggal_mulai: '',
            tanggal_selesai: '',
            jumlah_percobaan: 1
        },
        loading:true,
        kuis: {
            kuis_id: '',
            nama: '-'
        },
        pengguna_kuis: {
            kuis_id: '',
            pengguna_id: '',
            create_date: '2000-01-02 00:00:00'
        },
        ruang: {
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
        // this.props.getKuis(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         kuis: this.props.kuis.rows[0]
        //     })
        // });

        // this.props.getRuang(this.state.routeParams).then((result)=>{
        //     this.setState({
        //         ruang: this.props.ruang
        //     })
        // });

    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key]: value
            }
        },()=>{
            console.log(this.state);
        });

    }

    changeToggle = (key) => (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : (e ? '1' : '0')
            }
        },()=>{
            console.log(this.state);
        });
    }

    render()
    {
        let tgl = new Date();


        return (
            <Page name="cariKuis" hideBarsOnScroll className="halamanKuis">
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Cari</NavTitle>
                    <NavTitleLarge>
                        Cari
                    </NavTitleLarge>
                </Navbar>
                
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getKuis: Actions.getKuis,
      getPenggunaKuis: Actions.getPenggunaKuis,
      simpanPenggunaKuis: Actions.simpanPenggunaKuis,
      getSesiKuis: Actions.getSesiKuis,
      setSesiKuis: Actions.setSesiKuis,
      getRuang: Actions.getRuang
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

export default (connect(mapStateToProps, mapDispatchToProps)(cariKuis));
  