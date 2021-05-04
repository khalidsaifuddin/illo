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

class TambahFaq extends Component {
    state = {
        error: null,
        loading: false,
        routeParams: {
            start: 0,
            limit: 20,
            jawaban: '',
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            faq_id: this.$f7route.params['faq_id'] ? this.$f7route.params['faq_id'] : null
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
        if(this.$f7route.params['faq_id']){
            this.props.getFaq(this.state.routeParams).then((result)=>{
                if(parseInt(result.payload.total) > 0){
                    //ada
                    this.setState({
                        ...this.state,
                        routeParams: {
                            ...this.state.routeParams,
                            ...result.payload.rows[0]
                        }
                    })
                }else{
                    //tidak ada
                }
            })
        }
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

    gantiStatusPublikasi = (b) => {
        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                publikasi: b.target.value
            }
        });
    }

    editorChange = (e) => {
        // console.log(e);
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                jawaban: e
            }
        },()=>{
            // console.log(this.state.routeParams);
        });
    }

    simpanFaq = () => {
        // alert('oke')
        this.$f7.dialog.preloader()
        // // console.log('tes')
        // // console.log(this.state.routeParams)
        if(!this.state.routeParams.pertanyaan || !this.state.routeParams.jawaban){
            this.$f7.dialog.preloader()
            this.$f7.dialog.alert('Pertanyaan dan jawaban harus terisi lengkap sebelum menyimpan!')
            return true
        }

        this.props.simpanFaq(this.state.routeParams).then((result)=>{
            if(result.payload.sukses){
                //berhasil
                this.$f7.dialog.close()
                
                this.$f7.dialog.alert('FAQ berhasil disimpan', 'Berhasil',()=>{
                    this.$f7router.navigate("/kelola-faq/");
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

    changeToggle = (key) => (e) => {

        console.log(key)
        console.log(e)
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [key] : parseInt(this.state.routeParams.aktif) === 1 ? 0 : 1
            }
        },()=>{
            console.log(this.state.routeParams);
        });
    }

    render()
    {
        let tanggal = '';
        let tgl = new Date();

        tanggal = moment(tgl).format('D') + ' ' + this.bulan[(moment(tgl).format('M')-1)] + ' ' + moment(tgl).format('YYYY');

        return (
            <Page name="TambahFaq" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.routeParams.faq_id ? 'Edit' : 'Tambah'} FAQ</NavTitle>
                </Navbar>

                <Row>
                    <Col width="100" tabletWidth="0" desktopWidth="10"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="80">
                        <Card>
                            <CardContent>
                            <List noHairlinesMd style={{marginBottom:'0px'}}>
                                    <ListInput
                                        label="Pertanyaan"
                                        type="textarea"
                                        resizable
                                        placeholder="Pertanyaan FAQ"
                                        clearButton
                                        onChange={this.setStateValue('pertanyaan')}
                                        defaultValue={(this.$f7route.params['faq_id'] ? this.state.routeParams.pertanyaan : null)}
                                    >
                                    </ListInput>
                                </List>
                                <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                                    <div style={{marginBottom:'8px'}}>
                                        Jawaban FAQ
                                    </div>
                                    <ReactQuill 
                                        className={"kontenArtikel"}
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.routeParams.jawaban}
                                        on
                                    />
                                </Block>
                                <List style={{marginTop:'4px', marginBottom:'4px'}}>
                                    <ListItem>
                                        <span>Aktifkan FAQ</span>
                                        <Toggle defaultChecked={parseInt(this.state.routeParams.aktif) === 1 ? true : false} checked={parseInt(this.state.routeParams.aktif) === 1 ? true : false} value={1} onToggleChange={this.changeToggle('aktif')} />
                                    </ListItem>
                                </List>
                                <Block strong style={{marginTop:'0px'}}>
                                    <Button 
                                    raised 
                                    fill 
                                    large
                                    onClick={this.simpanFaq} 
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
      generateUUID: Actions.generateUUID,
      simpanFaq: Actions.simpanFaq,
      getFaq: Actions.getFaq
    }, dispatch);
}

function mapStateToProps({ App, Kuis, Ruang }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        uuid_kuis: Kuis.uuid_kuis,  
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TambahFaq));
  