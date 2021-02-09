import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Block, Link, Icon, Button, Card, CardContent, List, ListInput, Row, Col
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';

class gabungRuang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            ruang_id: this.$f7route.params['ruang_id']
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
            // this.props.getRuang(this.state.routeParams).then((result)=>{
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

    prosesgabungRuang = () =>{
        this.$f7router.navigate('/praTampilRuang/'+this.state.routeParams.kode_ruang);
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
            <Page name="gabungRuang" hideBarsOnScroll>
                <Row noGap>
                    <Col width="0" tabletWidth="15"></Col>
                    <Col width="100" tabletWidth="70">
                        <Card>
                            <CardContent style={{textAlign:'center'}}>
                                {/* <i className="icon f7-icons" style={{fontSize:'120px', color:'#F27121'}}>circle_grid_hex_fill</i> */}
                                <img src="./static/icons/5539.jpg" className="gambarGabungKuis" style={{width:'80%'}} />
                                <h3>Ikuti Ruang Sekarang!</h3>
                                <h4>Masukkan kode ruang:</h4>
                                <List>
                                    <ListInput
                                        // label={"Kode Kuis"}
                                        outline
                                        floatingLabel
                                        clearButton
                                        type="text"
                                        // resizable
                                        placeholder={"Kode Ruang"}
                                        style={{width:'100%'}}
                                        onChange={this.setStateValue('kode_ruang')}
                                        // defaultValue={element.teks}
                                        >
                                    </ListInput>
                                </List>
                                <br/>
                                <Button className="bawahCiriBiru cardBorder-20" raised large fill onClick={this.prosesgabungRuang}>
                                Bergabung ke Ruang
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
      getRuang: Actions.getRuang
    }, dispatch);
}

function mapStateToProps({ App, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        ruang: Ruang.ruang
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(gabungRuang));
  