import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, Button, Card, CardContent, List, ListInput, Row, Col, ListItem, BlockTitle, Toggle, Subnavbar, Segmented, NavRight, Block
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import { Bar, Line } from 'react-chartjs-2';

import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Dropzone from 'react-dropzone';

class FormTentang extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            start: 0,
            limit: 20,
            konten: '',
            jenis_artikel_id: 4,
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        }
    }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

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

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {
        this.props.getArtikel(this.state.routeParams).then((result)=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    ...result.payload.rows[0]
                }
            })
        })
    }

    setStateValue = (key) => (e) => {
        let value = e.currentTarget.value;

        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                [key]: value
            }
        })

    }

    editorChange = (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                konten: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    simpan = () => {
        // alert('oke')
        this.$f7.dialog.preloader()
        
        this.props.simpanArtikel(this.state.routeParams).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                
                this.$f7.dialog.alert('Artikel berhasil disimpan', 'Berhasil',()=>{
                    
                })

            }else{
                //gagal
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon dicoba kembali dalam beberapa saat', 'Gagal')
            
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon dicoba kembali dalam beberapa saat', 'Gagal')
        })
    }

    simpanArtikel = () => {
        this.$f7.dialog.preloader()
        
        this.props.simpanArtikel(this.state.routeParams).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                
                this.$f7.dialog.alert('Artikel berhasil disimpan', 'Berhasil',()=>{
                    // this.$f7router.navigate("/kelola-blog/");
                })

            }else{
                //gagal
                this.$f7.dialog.alert('Terjadi kesalahan pada sistem atau jaringan Anda. Mohon dicoba kembali dalam beberapa saat', 'Gagal')
            
            }
        })
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="FormTentang" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Kelola Tentang</NavTitle>
                </Navbar>

                <Row>
                    <Col width="100" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent>
                                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                                    <div style={{marginBottom:'8px'}}>
                                        Tentang Illo
                                    </div>
                                    <ReactQuill 
                                        className={"kontenArtikel"}
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.routeParams.konten}
                                        on
                                    />
                                </Block>
                                <Block strong style={{marginTop:'0px'}}>
                                    <Button 
                                    raised 
                                    fill 
                                    onClick={this.simpanArtikel} 
                                    style={{marginBottom:'8px', backgroundColor:'green', display:'inline-flex'}}
                                    >
                                        <i className="f7-icons" style={{fontSize:'20px'}}>paperplane_fill</i>&nbsp;Simpan
                                    </Button>
                                </Block>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="100" tabletWidth="0" desktopWidth="10"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getArtikel: Actions.getArtikel,
      simpanArtikel: Actions.simpanArtikel
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,  
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormTentang));
  