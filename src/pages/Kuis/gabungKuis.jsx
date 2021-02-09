import React, {Component} from 'react';
import {
    Page, Button, Card, CardContent, List, ListInput, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';


class gabungKuis extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id']
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

    prosesGabungKuis = () =>{
        this.$f7router.navigate('/praTampilKuis/'+this.state.routeParams.kode_kuis);
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

    render()
    {
        return (
            <Page name="gabungKuis" className="backgroundGame" hideBarsOnScroll>
                <Row>
                <Col width="0" tabletWidth="15"></Col>
                <Col width="100" tabletWidth="70">
                <Card>
                    <CardContent style={{textAlign:'center'}}>
                        {/* <i className="icon f7-icons" style={{fontSize:'120px', color:'#F27121'}}>gamecontroller_alt_fill</i> */}
                        <img src="./static/icons/37168.jpg" className="gambarGabungKuis" />
                        <h3>Ikut Kuis Sekarang!</h3>
                        <h4>Masukkan kode sesi kuis:</h4>
                        <List>
                            <ListInput
                                // label={"Kode Kuis"}
                                outline
                                floatingLabel
                                clearButton
                                type="text"
                                // resizable
                                placeholder={"Kode Kuis"}
                                style={{width:'100%'}}
                                onChange={this.setStateValue('kode_kuis')}
                                // defaultValue={element.teks}
                                >
                            </ListInput>
                        </List>
                        <br/>
                        <Button className="bawahCiriBiru cardBorder-20" raised large fill onClick={this.prosesGabungKuis}>
                            <i className="icon f7-icons" style={{fontSize:'30px'}}>gamecontroller_alt_fill</i>&nbsp;
                            Ikuti Kuis Sekarang
                        </Button>
                    </CardContent>
                </Card>
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
      getKuis: Actions.getKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        kuis: Kuis.kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(gabungKuis));
  