import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Icon, Button, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


class kodeKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            sesi_kuis_id: this.$f7route.params['sesi_kuis_id']
        },
        loading:true
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
            this.props.getSesiKuis(this.state.routeParams).then(()=>{
                this.setState({
                    loading:false
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
    
    copyLinkToClipboard = (kode) => {
        var dummy = document.createElement("textarea");
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = 'https://app.diskuis.id/#!/ikutiKuis/'+kode;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    render()
    {
        return (
            <Page name="kodeKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kode Sesi Kuis</NavTitle>
                    {/* <NavTitleLarge>
                        Kode Sesi Kuis
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

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
                                Silakan bagikan kode sesi kuis diatas kepada calon peserta kuis ini
                                <br/>
                                <br/>
                                <Button style={{width:'100px', margin:'auto', background:'#cccccc', color:'#434343'}} raised fill onClick={()=>this.$f7router.navigate('/kuisAnda/'+JSON.parse(localStorage.getItem('user')).pengguna_id)}>
                                    Tutup
                                </Button>
                            </Block>
                        </>
                        :
                        <>
                        {this.props.sesi_kuis.rows.map((option)=>{
                            return (
                                <>
                                    <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}}>
                                        {/* <span style={{fontSize:'20px'}}>Kode Kuis</span> */}
                                        <br/>
                                        <b style={{fontSize:'20px'}}>{option.judul}</b>
                                        <br/>
                                        <textarea
                                            style={{border:'3px dashed #ccc', borderRadius:'20px', textAlign:'center', width:'100%', fontSize:'45px', fontWeight:'bold', marginTop:'40px', marginBottom:'16px', color:'#A93B1F', height:'75px'}}
                                            ref={(textarea) => this.textArea = textarea}
                                            value={option.kode_sesi}
                                        />
                                        {/* <h1 style={{fontSize:'45px', color:'#fdd835'}}>{option.kode_sesi}</h1> */}
                                        <Button raised fill large onClick={this.copyCodeToClipboard}>
                                            <Icon ios={"f7:doc_on_doc"} aurora={"f7:doc_on_doc"} md={"material:doc_on_doc"} tooltip="Salin Kode Kuis"/>
                                            &nbsp;Salin Kode
                                        </Button>
                                        <br/>
                                        <Button className="color-theme-teal" raised fill large onClick={()=>this.copyLinkToClipboard(option.kode_sesi)}>
                                            <Icon ios={"f7:link"} aurora={"f7:link"} md={"material:link"} tooltip="Salin Link Kuis"/>
                                            &nbsp;Salin Link Kuis
                                        </Button>
                                    </Block>
                                    <Block strong style={{marginTop:'0px', marginBottom:'8px', textAlign:'center'}}>
                                        Silakan bagikan kode sesi kuis/link kuis diatas kepada calon peserta kuis ini
                                        <br/>
                                        <br/>
                                        <Button style={{width:'100px', margin:'auto', background:'#cccccc', color:'#434343'}} raised fill onClick={()=>this.$f7router.navigate('/KuisAnda/'+JSON.parse(localStorage.getItem('user')).pengguna_id)}>
                                            Tutup
                                        </Button>
                                    </Block>
                                </>
                            )
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
      getKuis: Actions.getKuis,
      getSesiKuis: Actions.getSesiKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis,
        sesi_kuis: Kuis.sesi_kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(kodeKuis));
  