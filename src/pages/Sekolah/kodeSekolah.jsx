import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Icon, Button
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


class kodeSekolah extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            sekolah_id: this.$f7route.params['sekolah_id'],
            undangan_sekolah_id: this.$f7route.params['undangan_sekolah_id']
        },
        loading:true,
        sekolah: {}
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
            this.props.getSekolah(this.state.routeParams).then((result)=>{
                this.setState({
                    sekolah: this.props.sekolah.rows[0]
                },()=>{
                    this.props.getUndanganSekolah(this.state.routeParams).then((result)=>{
                        this.setState({
                            loading: false
                        });
                    });
                });
            });
        });

    }

    copyCodeToClipboard = () => {
        // console.log(this.textArea);
        const el = this.textArea;
        el.select();
        document.execCommand("copy");
    }

    render()
    {
        return (
            <Page name="kodeSekolah" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kode Sekolah</NavTitle>
                    <NavTitleLarge>
                        Kode Sekolah
                    </NavTitleLarge>
                </Navbar>
                {this.state.loading ? 
                <>
                    <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}}>
                        <span style={{fontSize:'20px'}} className="skeleton-text skeleton-effect-blink">Kode Kuis</span>
                        <br/>
                        <b className="skeleton-text skeleton-effect-blink">xxxxxxxxxxxxxxxxxxxxx</b>
                        <br/>
                        <textarea
                            className="skeleton-text skeleton-effect-blink"
                            style={{textAlign:'center', width:'100%', fontSize:'45px', fontWeight:'bold', marginTop:'40px', color:'#fdd835'}}
                            ref={(textarea) => this.textArea = textarea}
                            value="xxxxxxxxxxxxxxxxxxxxx"
                        />
                        {/* <h1 style={{fontSize:'45px', color:'#fdd835'}}>{option.kode_sesi}</h1> */}
                        <Button raised fill large onClick={this.copyCodeToClipboard} className="skeleton-text skeleton-effect-blink">
                            <Icon ios={"f7:doc_on_doc"} aurora={"f7:doc_on_doc"} md={"material:doc_on_doc"} tooltip="Salin Kode Kuis"/>
                            &nbsp;Salin Kode
                        </Button>
                    </Block>
                    <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}} className="skeleton-text skeleton-effect-blink">
                        Silakan bagikan kode sekolah diatas kepada guru/siswa di sekolah Anda untuk bergabung
                        <br/>
                        <br/>
                        <Button style={{width:'100px', margin:'auto', background:'#cccccc', color:'#434343'}} raised fill onClick={()=>this.$f7router.navigate('/kuisAnda/'+JSON.parse(localStorage.getItem('user')).pengguna_id)}>
                            Tutup
                        </Button>
                    </Block>
                </>
                :
                <>
                {this.props.undangan_sekolah.rows.map((option)=>{
                    return (
                        <>
                            <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}}>
                                <span style={{fontSize:'20px'}}>Kode Sekolah</span>
                                <br/>
                                <b>{this.state.sekolah.nama}</b>
                                <br/>
                                <textarea
                                    style={{textAlign:'center', width:'100%', fontSize:'45px', fontWeight:'bold', marginTop:'40px', color:'#fdd835'}}
                                    ref={(textarea) => this.textArea = textarea}
                                    value={option.kode_sekolah}
                                />
                                {/* <h1 style={{fontSize:'45px', color:'#fdd835'}}>{option.kode_sesi}</h1> */}
                                <Button raised fill large onClick={this.copyCodeToClipboard}>
                                    <Icon ios={"f7:doc_on_doc"} aurora={"f7:doc_on_doc"} md={"material:doc_on_doc"} tooltip="Salin Kode Kuis"/>
                                    &nbsp;Salin Kode
                                </Button>
                            </Block>
                            <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}}>
                                Silakan bagikan kode sekolah diatas kepada guru/siswa di sekolah Anda untuk bergabung
                                <br/>
                                <br/>
                                <Button style={{width:'100px', margin:'auto', background:'#cccccc', color:'#434343'}} raised fill onClick={()=>this.$f7router.navigate('/berandaSekolah/')}>
                                    Tutup
                                </Button>
                            </Block>
                        </>
                    )
                })}
                </>
                }
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getSekolah: Actions.getSekolah,
      getUndanganSekolah: Actions.getUndanganSekolah
    }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        sekolah: Sekolah.sekolah,
        undangan_sekolah: Sekolah.undangan_sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kodeSekolah));
  