import React, {Component} from 'react';
import {
    Card, CardHeader, CardContent, List, ListIndex, ListInput, Button, Icon, Radio, CardFooter, Checkbox, ListItem, Page, Navbar, NavTitle, NavTitleLarge, Row, Col, Link, Actions, BlockTitle, ListItemCell, ListItemContent, BlockHeader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Dropzone from 'react-dropzone';

import ReactAudioPlayer from 'react-audio-player';
import YouTube from 'react-youtube';

class formPertanyaan extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
            kuis_id: this.$f7route.params['kuis_id'],
            pertanyaan_kuis_id: this.$f7route.params['pertanyaan_kuis_id']
        },
        listPilihan: [],
        sekuen_pilihan: 1,
        fieldDisabled: true,
        pertanyaan_kuis: {
            rows: [{
                pertanyaan_kuis_id: '',
                teks: ''
            }],
            total: 0
        },
        kuis: {},
        actionAudioTrue: false,
        actionVideoTrue: false,
        audio: '',
        video: '',
        file_video: null,
        file_audio: '',
        tipe_pertanyaan_id_lama: 0,
        tipe_pertanyaan_id: 1,
        aspek_reversed: {
            rows: [],
            total: 0
        },
        pertanyaan: {}
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

    modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, { 'script': 'sub'}, { 'script': 'super' }],
          ['link', 'image'],
          ['clean']
        ],
    }
    
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'script',
        'link', 'image'
    ]

    hapusPilihan = (pilihan_pertanyaan_kuis_id) => {
        // console.log(this.state.listPilihan);

        for (let index = 0; index < this.state.listPilihan.length; index++) {
            const element = this.state.listPilihan[index];

            // console.log(element.key);
            if(element.key === pilihan_pertanyaan_kuis_id){
                // ini dia yang mau dihapus
                this.state.listPilihan.splice(index,1);
            }else{
                // skip aja
            }
            
        }

        this.setState({
            ...this.state,
            sekuen_pilihan: parseInt(this.state.sekuen_pilihan)-1,
            // displayPilihan: {
            //     ...this.state.displayPilihan,
            //     [pilihan_pertanyaan_kuis_id]: 'none'
            // },
            routeParams: {
                ...this.state.routeParams,
                pertanyaan_kuis: {
                    ...this.state.routeParams.pertanyaan_kuis,
                    [this.state.pertanyaan_kuis_id]: {
                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                        pilihan_pertanyaan_kuis: {
                            ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                            [pilihan_pertanyaan_kuis_id]: {
                                ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[pilihan_pertanyaan_kuis_id],
                                soft_delete: 1
                            }
                        }
                    }
                }
            }
        });
    }

    componentDidMount = () => {

        this.$f7.dialog.preloader('Memuat pertanyaan...');

        if(this.state.routeParams.pertanyaan_kuis_id){
        // if(this.props.pertanyaan_kuis_id !== '' && this.props.pertanyaan_kuis_id !== null){

            this.setState({
                routeParamsPertanyaanKuis: {
                    pertanyaan_kuis_id: this.state.routeParams.pertanyaan_kuis_id
                },
                routeParamsKuis: {
                    kuis_id: this.state.routeParams.kuis_id
                }
            },()=>{
                this.props.getKuis(this.state.routeParamsKuis).then((result)=>{

                    this.setState({
                        ...this.state,
                        routeParams: this.props.kuis.rows[0],
                        kuis: this.props.kuis.rows[0]
                    },()=>{
                        // console.log(this.state.routeParams);

                        this.props.getPertanyaanKuis(this.state.routeParamsPertanyaanKuis).then((result)=>{
                            this.setState({
                                fieldDisabled: false,
                                pertanyaan_kuis_id: this.props.pertanyaan_kuis_id,
                                pertanyaan_kuis: this.props.pertanyaan_kuis,
                                pertanyaan: this.props.pertanyaan_kuis.rows[0],
                                tipe_pertanyaan_id: (this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan_id ? this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan_id : 1),
                                tipe_pertanyaan: (this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan ? this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan : 'Pilihan Ganda'),
                                file_audio: this.props.pertanyaan_kuis.rows[0].file_audio
                                // routeParams: {
                                //     ...this.state.routeParams,
                                //     pertanyaan_kuis: {
                                //         ...this.state.routeParams.pertanyaan_kuis,
                                //         [this.props.uuid_kuis]: {
                                //             ...this.state.routeParams.pertanyaan_kuis[this.props.uuid_kuis],
                                //             pertanyaan_kuis_id: this.props.uuid_kuis,
                                //             pilihan_pertanyaan_kuis: {}
                                //         }
                                //     }
                                // }
                            },()=>{

                                this.$f7.dialog.close();
                                console.log(this.state.pertanyaan);
                                // this.props.setKuis(this.state.routeParams);
        
                                //set pilihan
                                let pilihan = [];
                                let nPilihan = 0;
        
                                for (const key in this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis) {
                                    if (this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                        const element = this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis[key];
                                        nPilihan++;
                                        
                                        if(parseInt(this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan_id) === 1){

                                            pilihan = [
                                                ...pilihan,
                                                (
                                                    <ListInput
                                                        label={"Pilihan "+nPilihan}
                                                        outline
                                                        floatingLabel
                                                        clearButton
                                                        type="textarea"
                                                        resizable
                                                        placeholder={"Pilihan "+nPilihan}
                                                        style={{width:'70%'}}
                                                        key={key}
                                                        onChange={this.setStateValuePilihan(key, 'teks')}
                                                        defaultValue={element.teks}
                                                        // onInput={(e)=>console.log(e)}
                                                        // onOnKeyPress={()=>console.log('keypress')}
                                                    >
                                                        <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button>
                                                        {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                                                        <Radio 
                                                            style={{marginTop:'15px'}} 
                                                            name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                                            value={key} 
                                                            slot="media"
                                                            onChange={this.klikJawabanBenar(this.state.pertanyaan_kuis_id)}
                                                            defaultChecked={(element.jawaban_benar  === 1 ? true : false)}
                                                        />
                                                        }
                                                        {/* <Button fill slot="after" onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button> */}
                                                    </ListInput>
                                                )
                                            ];

                                        }else if(parseInt(this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan_id) === 2){
                                            pilihan = [
                                                ...pilihan,
                                                (
                                                    <div className="kurungInputPilihan">
                                                        <ListInput
                                                            label={"Pilihan "+nPilihan}
                                                            outline
                                                            floatingLabel
                                                            clearButton
                                                            type="textarea"
                                                            resizable
                                                            placeholder={"Pilihan "+nPilihan}
                                                            style={{ width:'100%', listStyleType:'none' }}
                                                            // disabled={(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuids].soft_delete === '0' ? false : true)}
                                                            key={key}
                                                            defaultValue={element.teks}
                                                            onChange={this.setStateValuePilihan(key, 'teks')}
                                                            // onKeyDown={()=>console.log('keydown')}
                                                            // onOnKeyPress={()=>console.log('keypress')}
                                                        >
                                                            <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button>
                                                            {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                                                            <Checkbox 
                                                                style={{marginTop:'15px'}} 
                                                                name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                                                value={key} 
                                                                slot="media"
                                                                onChange={this.klikJawabanBenarCheckbox(this.state.pertanyaan_kuis_id)}
                                                                defaultChecked={(element.jawaban_benar  === 1 ? true : false)}
                                                            />
                                                            }
                                                            {/* <Checkbox name="checkbox-1" slot="media">Jawaban benar</Checkbox> */}
                                                            {/* <Radio name={this.props.id+"-"+this.state.sekuen_pilihan+1} value={this.props.id+"-"+this.state.sekuen_pilihan+1}/>&nbsp;  */}
                                                        </ListInput>
                                                    </div>
                                                    // <ListInput
                                                    //     label={"Pilihan "+nPilihan}
                                                    //     outline
                                                    //     floatingLabel
                                                    //     clearButton
                                                    //     type="textarea"
                                                    //     resizable
                                                    //     placeholder={"Pilihan "+nPilihan}
                                                    //     style={{width:'70%'}}
                                                    //     key={key}
                                                    //     onChange={this.setStateValuePilihan(key, 'teks')}
                                                    //     defaultValue={element.teks}
                                                    //     // onInput={(e)=>console.log(e)}
                                                    //     // onOnKeyPress={()=>console.log('keypress')}
                                                    // >
                                                    //     <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button>
                                                    //     <Checkbox 
                                                    //         style={{marginTop:'15px'}} 
                                                    //         name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                                    //         value={key} 
                                                    //         slot="media"
                                                    //         onChange={this.klikJawabanBenar(this.state.pertanyaan_kuis_id)}
                                                    //         defaultChecked={(element.jawaban_benar  === 1 ? true : false)}
                                                    //     />
                                                    //     {/* <Button fill slot="after" onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button> */}
                                                    // </ListInput>
                                                )
                                            ];
                                        }else if(parseInt(this.props.pertanyaan_kuis.rows[0].tipe_pertanyaan_id) === 3){
                                            pilihan = [
                                                ...pilihan,
                                                (
                                                    <div className="kurungInputPilihan">
                                                        <ListInput
                                                            label={"Kata Kunci "+nPilihan}
                                                            outline
                                                            floatingLabel
                                                            clearButton
                                                            type="textarea"
                                                            resizable
                                                            placeholder={"Kata Kunci "+nPilihan}
                                                            style={{ width:'100%', listStyleType:'none' }}
                                                            key={key}
                                                            defaultValue={element.teks}
                                                            onChange={this.setStateValuePilihan(key, 'teks')}
                                                        >
                                                            <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(element.pilihan_pertanyaan_kuis_id)}>Hapus</Button>
                                                        </ListInput>
                                                    </div>
                                                )
                                            ];
                                        }
                                        
                                    }
                                }
        
                                this.setState({
                                    ...this.state,
                                    sekuen_pilihan: (this.state.sekuen_pilihan+1),
                                    listPilihan: pilihan
                                },()=>{
                                    
                                });
        
                            });
                        });
                    });

                })

            });

        }else{

            this.props.generateUUID(this.state.routeParams).then((result)=>{
    
                this.setState({
                    fieldDisabled: false,
                    pertanyaan_kuis_id: this.props.uuid_kuis,
                    routeParams: {
                        ...this.state.routeParams,
                        pertanyaan_kuis: {
                            ...this.state.routeParams.pertanyaan_kuis,
                            [this.props.uuid_kuis]: {
                                // ...this.state.routeParams.pertanyaan_kuis[this.props.uuid_kuis],
                                pertanyaan_kuis_id: this.props.uuid_kuis,
                                kuis_id: this.$f7route.params['kuis_id'],
                                pilihan_pertanyaan_kuis: {}
                            }
                        }
                    }
                },()=>{
                    console.log(this.state);
                    console.log(this.state.routeParams);
                    // this.props.setKuis(this.state.routeParams);

                    // this.props.getKuis({kuis_id:this.$f7route.params['kuis_id']}).then((result)=>{

                    //     this.setState({
                    //         ...this.state,
                    //         routeParams: this.props.kuis.rows[0],
                    //         kuis: this.props.kuis.rows[0]
                    //     },()=>{
                    //         //what to do?
                    //     })
                    // })

                    this.$f7.dialog.close();
                });
    
            });

        }

        this.props.getAspekReversed({kuis_id: this.$f7route.params['kuis_id']}).then((result)=>{
            this.setState({
                aspek_reversed: this.props.aspek_reversed
            })
        })
    }

    setStateValue = (key) => (e) => {
        // console.log(this.state.routeParams);
        // console.log(this.props.fe_kuis);

        let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    pertanyaan_kuis: {
                        ...this.state.routeParams.pertanyaan_kuis,
                        kuis_id: this.$f7route.params['kuis_id'],
                        [this.state.pertanyaan_kuis_id]: {
                            ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                            [key]: value
                        }
                    }
                }
            },()=>{
                console.log(this.state.routeParams);
                this.props.setKuis(this.state.routeParams);
            });

        })


    }
    
    setStateValuePilihan = (uuid, key) => (e) => {
        // console.log(e);
        
        let value = e.currentTarget.value;

        // this.setState({
        //     routeParams: this.props.fe_kuis
        // },()=>{

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pertanyaan_kuis: {
                    ...this.state.routeParams.pertanyaan_kuis,
                    [this.state.pertanyaan_kuis_id]: {
                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                        kuis_id: this.$f7route.params['kuis_id'],
                        pilihan_pertanyaan_kuis: {
                            ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                            [uuid]: {
                                ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuid],
                                pilihan_pertanyaan_kuis_id: uuid,
                                [key]: value,
                                jawaban_benar: this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuid].jawaban_benar ? this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuid].jawaban_benar : (parseInt(this.state.tipe_pertanyaan_id) === 3 ? 1 : 0),
                                // jawaban_benar: 0,
                                soft_delete: 0
                            }
                        }
                    }
                }
            }
        },()=>{
            console.log(this.state.routeParams);
            // this.props.setKuis(this.state.routeParams);

            // console.log(this.state.routeParams.pertanyaan_kuis[this.$f7route.params['pertanyaan_kuis_id']]);
        });

        // });


    }

    klikJawabanBenar = (pertanyaan_kuis_id) => (e) => {
        // console.log(pertanyaan_kuis_id);
        // console.log(e.currentTarget.value);
        // console.log(this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis);
        // this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis
        let value = e.currentTarget.value;

        // this.setState({
        //     routeParams: this.props.fe_kuis
        // },()=>{

        for (var prop in this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis) {
            this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[prop].jawaban_benar = 0;
        }

        this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value].jawaban_benar = 1;
    
        // this.props.setKuis(this.state.routeParams);
        // setTimeout(() => {
        //     console.log(this.props.fe_kuis);
        // }, 100);

        // });
        console.log(this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value]);
        // console.log(this.state.routeParams.pertanyaan_kuis[this.$f7route.params['pertanyaan_kuis_id']]);
    }

    klikJawabanBenarCheckbox = (pertanyaan_kuis_id) => (e) => {
        let value = e.currentTarget.value;

        // console.log(checked);
        this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value].jawaban_benar = (parseInt(this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value].jawaban_benar) === 1 ? 0 : 1);
    
        console.log(this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value]);
    }

    tambahPilihan = (pertanyaan_kuis_id) => {
        this.$f7.dialog.preloader('Memuat...');

        this.props.generateUUID(this.state.routeParams).then((result)=>{

            let uuids = this.props.uuid_kuis;

            this.setState({
                ...this.state,
                displayPilihan: {
                    ...this.state.displayPilihan,
                    [uuids]: 'block'
                }
            },()=>{

                this.$f7.dialog.close();

                if(parseInt(this.state.tipe_pertanyaan_id) === 1){

                    this.setState({
                        sekuen_pilihan: (this.state.sekuen_pilihan+1),
                        // routeParams: {
                        //     ...this.state.routeParams,
                        //     pertanyaan_kuis: {
                        //         ...this.state.routeParams.pertanyaan_kuis,
                        //         [this.state.pertanyaan_kuis_id]: {
                        //             ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                        //             kuis_id: this.$f7route.params['kuis_id'],
                        //             pilihan_pertanyaan_kuis: {
                        //                 ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
        
                        //             }
                        //         }
                        //     }
                        // },
                        routeParams: {
                            ...this.state.routeParams,
                            pertanyaan_kuis: {
                                ...this.state.routeParams.pertanyaan_kuis,
                                [this.state.pertanyaan_kuis_id]: {
                                    ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                                    kuis_id: this.$f7route.params['kuis_id'],
                                    pilihan_pertanyaan_kuis: {
                                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                                        [uuids]: {
                                            pilihan_pertanyaan_kuis_id: uuids,
                                            jawaban_benar: 0,
                                            soft_delete: '0'
                                        }
                                    }
                                }
                            }
                        },
                        listPilihan: [
                            ...this.state.listPilihan,
                            (
                                <div className="kurungInputPilihan">
                                    <ListInput
                                        label={"Pilihan "+this.state.sekuen_pilihan}
                                        outline
                                        floatingLabel
                                        clearButton
                                        type="textarea"
                                        resizable
                                        placeholder={"Pilihan "+this.state.sekuen_pilihan}
                                        style={{ width:'100%', display: this.state.displayPilihan[uuids] }}
                                        // disabled={(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuids].soft_delete === '0' ? false : true)}
                                        key={this.props.uuid_kuis}
                                        onChange={this.setStateValuePilihan(this.props.uuid_kuis, 'teks')}
                                        onKeyDown={()=>console.log('keydown')}
                                        // onOnKeyPress={()=>console.log('keypress')}
                                    >
                                        <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(uuids)}>Hapus</Button>
                                        {parseInt(this.state.kuis.jenis_kuis_id) !== 2 &&
                                        <Radio 
                                            style={{marginTop:'15px'}} 
                                            name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                            value={this.props.uuid_kuis} 
                                            slot="media"
                                            onChange={this.klikJawabanBenar(this.state.pertanyaan_kuis_id)}
                                        />
                                        }
                                        {/* <Checkbox name="checkbox-1" slot="media">Jawaban benar</Checkbox> */}
                                        {/* <Radio name={this.props.id+"-"+this.state.sekuen_pilihan+1} value={this.props.id+"-"+this.state.sekuen_pilihan+1}/>&nbsp;  */}
                                    </ListInput>
                                </div>
                            )
                        ]
                    });

                }else if(parseInt(this.state.tipe_pertanyaan_id) === 2){
                    //checkbox
                    this.setState({
                        sekuen_pilihan: (this.state.sekuen_pilihan+1),
                        routeParams: {
                            ...this.state.routeParams,
                            pertanyaan_kuis: {
                                ...this.state.routeParams.pertanyaan_kuis,
                                [this.state.pertanyaan_kuis_id]: {
                                    ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                                    kuis_id: this.$f7route.params['kuis_id'],
                                    pilihan_pertanyaan_kuis: {
                                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                                        [uuids]: {
                                            pilihan_pertanyaan_kuis_id: uuids,
                                            jawaban_benar: 0,
                                            soft_delete: '0'
                                        }
                                    }
                                }
                            }
                        },
                        listPilihan: [
                            ...this.state.listPilihan,
                            (
                                <div className="kurungInputPilihan">
                                    <ListInput
                                        label={"Teks Pilihan "+this.state.sekuen_pilihan}
                                        outline
                                        floatingLabel
                                        clearButton
                                        type="textarea"
                                        resizable
                                        placeholder={"Teks Pilihan "+this.state.sekuen_pilihan}
                                        style={{ width:'100%', display: this.state.displayPilihan[uuids] }}
                                        // disabled={(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuids].soft_delete === '0' ? false : true)}
                                        key={this.props.uuid_kuis}
                                        onChange={this.setStateValuePilihan(this.props.uuid_kuis, 'teks')}
                                        onKeyDown={()=>console.log('keydown')}
                                        >
                                        <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(uuids)}>Hapus</Button>
                                        {/* <input type="number" slot="after" /> */}
                                        {parseInt(this.state.kuis.jenis_kuis_id) !== 2 &&
                                        <Checkbox 
                                            style={{marginTop:'15px'}} 
                                            name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                            value={this.props.uuid_kuis} 
                                            slot="media"
                                            onChange={this.klikJawabanBenarCheckbox(this.state.pertanyaan_kuis_id)}
                                        />
                                        }
                                    </ListInput>
                                    {/* <ListInput
                                        label={"Bobot "+this.state.sekuen_pilihan}
                                        outline
                                        floatingLabel
                                        clearButton
                                        className="inputBobot"
                                        // style={{width: 'calc( 100% - 70px )'}}
                                        type="number"
                                        placeholder={"Bobot "+this.state.sekuen_pilihan}
                                        style={{ width: '40%', display: this.state.displayPilihan[uuids] }}
                                        // style={{ width: 'calc( 100% - 72px )', display: this.state.displayPilihan[uuids] }}
                                        // disabled={(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuids].soft_delete === '0' ? false : true)}
                                        key={this.props.uuid_kuis}
                                        onChange={this.setStateValuePilihan(this.props.uuid_kuis, 'bobot')}
                                        >
                                    </ListInput>
                                    <ListItem style={{listStyleType:'none', marginLeft:'56px', marginTop:'-20px'}}>
                                        <ListItemContent>
                                            <div style={{fontStyle:'italic', fontSize:'10px'}}>
                                                * Bobot pilihan adalah penentuan nilai untuk masing-masing pilihan yang dipilih, dengan menggunakan total keseluruhan nilai bobot pilihan sebagai pembagi 
                                            </div>
                                        </ListItemContent>
                                    </ListItem> */}
                                </div>
                            )
                        ]
                    });

                }else if(parseInt(this.state.tipe_pertanyaan_id) === 3){
                    //isian
                    this.setState({
                        sekuen_pilihan: (this.state.sekuen_pilihan+1),
                        routeParams: {
                            ...this.state.routeParams,
                            pertanyaan_kuis: {
                                ...this.state.routeParams.pertanyaan_kuis,
                                [this.state.pertanyaan_kuis_id]: {
                                    ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                                    kuis_id: this.$f7route.params['kuis_id'],
                                    pilihan_pertanyaan_kuis: {
                                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                                        [uuids]: {
                                            pilihan_pertanyaan_kuis_id: uuids,
                                            jawaban_benar: 0,
                                            soft_delete: '0'
                                        }
                                    }
                                }
                            }
                        },
                        listPilihan: [
                            ...this.state.listPilihan,
                            (
                                <div className="kurungInputPilihan">
                                    <ListInput
                                        label={"Kata Kunci "+this.state.sekuen_pilihan}
                                        outline
                                        floatingLabel
                                        clearButton
                                        type="textarea"
                                        resizable
                                        placeholder={"Kata Kunci "+this.state.sekuen_pilihan}
                                        style={{ width:'100%', display: this.state.displayPilihan[uuids] }}
                                        key={this.props.uuid_kuis}
                                        onChange={this.setStateValuePilihan(this.props.uuid_kuis, 'teks')}
                                        onKeyDown={()=>console.log('keydown')}
                                        >
                                        <Button slot="media" style={{marginTop:'12px',marginRight:'2px', fontSize:'12px'}} onClick={()=>this.hapusPilihan(uuids)}>Hapus</Button>
                                    </ListInput>
                                </div>
                            )
                        ]
                    });
                }


            });


        });
        
    }

    editorChange = (e, delta, source, editor) => {
        // console.log('yeye');
        // console.log(e);
        // console.log(delta);
        // console.log(source);
        // console.log(editor);
        console.log(this.state.routeParams);
        // return false;

        this.state.pertanyaan_kuis.rows[0].teks = e;

        let value = e;
        // let value = e.currentTarget.value;

        // this.setState({
        //     routeParams: this.props.fe_kuis
        // },()=>{

            this.setState({
                // pertanyaan_kuis: {
                //     ...this.state.pertanyaan_kuis,
                //     rows: [{
                //         ...this.state.pertanyaan_kuis.rows[0],
                //         teks: e
                //     }] 
                // },
                routeParams: {
                    ...this.state.routeParams,
                    pertanyaan_kuis: {
                        ...this.state.routeParams.pertanyaan_kuis,
                        [this.state.pertanyaan_kuis_id]: {
                            ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                            kuis_id: this.$f7route.params['kuis_id'],
                            teks: value
                        }
                    }
                }
            },()=>{
                // console.log(this.state.routeParams);
                this.props.setKuis(this.state.routeParams);

                // console.log(this.state.routeParams.pertanyaan_kuis[this.$f7route.params['pertanyaan_kuis_id']]);
            });

        // })

        // this.setState({
        //     routeParams: {
        //         ...this.state.routeParams,
        //         deskripsi: e
        //     }
        // },()=>{
        //     // console.log(this.state.routeParams);
        // });
    }

    simpanPertanyaan = () => {

        // console.log(this.state.tipe_pertanyaan_id);
        // return false;

        this.$f7.dialog.preloader('Menyimpan pertanyaan...');

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                pertanyaan_kuis: {
                    [this.state.pertanyaan_kuis_id]: {
                        ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                        bagian_kuis_id: this.state.pertanyaan.bagian_kuis_id,
                        // tipe_pertanyaan_id: this.state.tipe_pertanyaan_id,
                        tipe_pertanyaan_id: this.state.tipe_pertanyaan_id,
                        kode_pertanyaan: this.state.pertanyaan.kode_pertanyaan,
                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        file_audio: (this.state.file_audio ? this.state.file_audio : null),
                        file_video: (this.state.file_video ? this.state.file_video : null)
                    }
                }
            }
        },()=>{
            console.log(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id]);
            this.props.simpanPertanyaanKuis(this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id]).then((result)=>{
                this.$f7.dialog.close();
                if(result.payload.success === true){
                    this.$f7router.navigate('/tambahKuis/'+result.payload.rows_kuis[0].pengguna_id+'/'+result.payload.kuis_id);
                }else{
                    this.$f7.dialog.alert('Ada kesalahan jaringan atau sistem. Mohon dicoba kembali beberapa saat lagi', 'Peringatan');
                }
            });
        });

    }

    acceptedFile = (file) => {
        // console.log(file[0]);

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

            if(file[0].size >= 11000000){ //10MB
                this.$f7.dialog.alert('Ukuran berkas audio tidak boleh melebihi 10MB!', 'Peringatan');
                return true;
            }
    
            if(file[0].name.substr(file[0].name.length - 3) === 'mp3' || file[0].name.substr(file[0].name.length - 4) === 'ogg'){
                
                this.props.generateUUID(this.state.routeParams).then((result)=>{

                    this.setState({
                        audio: file[0].name,
                        // loading: true,
                        guid_audio: this.props.uuid_kuis,
                        routeParams:{
                            ...this.state.routeParams,
                            // audio: file[0].name
                            audio: this.props.uuid_kuis+'.'+file[0].name.substring((file[0].name.length-3),file[0].name.length)
                        }
                    },()=>{
        
                        this.props.setKuis(this.state.routeParams);
                        //uploading
                        // const formData = new FormData();
                        console.log(this.state.routeParams);
    
                        return new Promise(
                            (resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', localStorage.getItem('api_base') + '/api/Kuis/uploadAudio');
                                xhr.onload = this.uploadBerhasil;
                                xhr.onerror = this.uploadGagal;
                                const data = new FormData();
                                data.append('file_audio', file[0]);
                                data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                                data.append('guid', this.state.guid_audio);
                                data.append('jenis', 'audio');
                                xhr.send(data);
                            }
                        );
    
                        // });
                        // formData.append('avatar',file[0]);
                        // console.log(localStorage.getItem('api_base') + '/api/Ruang/upload');
                    });

                });
    
            }else{
                this.$f7.dialog.alert('Hanya dapat mengupload file audio dengan format .mp3 atau .ogg!', 'Peringatan');
                return true;
            }
            
        });


    }

    uploadBerhasil = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_audio: response.filename,
                loading: false
            },()=>{
                console.log(this.state);
            });
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    setAudio = (e) => {
        this.setState({
            file_audio: e.target.value
        },()=>{
            console.log(this.state);
        });
    }

    setVideo = (e) => {
        this.setState({
            file_video: e.target.value
        },()=>{
            console.log(this.state);
        });
    }

    tipeChange = (e) => {
        e.preventDefault();

        this.setState({
            tipe_pertanyaan_id_lama: this.state.tipe_pertanyaan_id,
            tipe_pertanyaan_id: e.target.value
        },()=>{

            this.$f7.dialog.confirm('Mengubah tipe pertanyaan akan menghapus teks pertanyaan dan pilihan jawaban yang telah diisi. Apakah Anda yakin ingin mengubah tipe pertanyaan?','Konfirmasi', () => {
                // console.log(e.target.value);
                console.log(this.state.tipe_pertanyaan_id)

                this.setState({
                    listPilihan: [],
                    sekuen_pilihan: 1,
                    routeParams: {
                        ...this.state.routeParams,
                        pertanyaan_kuis: {
                            ...this.state.routeParams.pertanyaan_kuis,
                            [this.state.pertanyaan_kuis_id]: {
                                ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                                kuis_id: this.$f7route.params['kuis_id'],
                                pilihan_pertanyaan_kuis: {}
                            }
                        }
                    }
                })

            },()=>{
                this.setState({
                    tipe_pertanyaan_id: this.state.tipe_pertanyaan_id_lama
                },()=>{
                    console.log(this.state.tipe_pertanyaan_id)
                })
            })
        })
    }

    bagianChange = (e) => {
        // e.preventDefault();

        this.setState({
            pertanyaan: {
                ...this.state.pertanyaan,
                bagian_kuis_id: e.target.value
            }
        },()=>{
            // empty slot
            console.log(this.state.pertanyaan)
            
        })
    }
    
    setValue = (key) => (e) => {
        // this.setState({
        //     routeParams: {
        //         [key] : e.target.value
        //     }
        // },()=>{
        //     console.log(this.state.routeParams)
        // })

        this.setState({
            pertanyaan: {
                ...this.state.pertanyaan,
                [key]: e.target.value
            }
        },()=>{
            // empty slot
            console.log(this.state.pertanyaan)
            
        })
    }

    render()
    {
        // console.log(this.state.pertanyaan_kuis.rows[0].teks);

        // let textValue = String(this.state.pertanyaan_kuis.rows[0].teks);

        return (
            <Page name="tambahKuis" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.$f7route.params['pertanyaan_kuis_id'] ? <>Edit Pertanyaan</> : <>Tambah Pertanyaan</>}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.$f7route.params['pertanyaan_kuis_id'] ? <>Edit Pertanyaan</> : <>Tambah Pertanyaan</>}
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        {this.state.kuis.judul &&
                        <Card style={{borderBottom:'5px solid #81d4fa'}}>
                            <CardContent>
                                <b>{this.state.kuis.judul}</b><br/>
                                {this.state.kuis.keterangan}
                            </CardContent>
                        </Card>
                        }
                        <Card>
                            <CardContent>
                                <div style={{width:'100%', textAlign:'center', marginBottom:'16px'}}>Tipe Pertanyaan</div>
                                {this.$f7route.params['pertanyaan_kuis_id'] &&
                                    <Card style={{margin:'0px'}}>
                                        <CardContent style={{display:'inline-flex', padding:'8px'}}>
                                            <img src={localStorage.getItem('api_base')+"/assets/img/"+(parseInt(this.state.tipe_pertanyaan_id) === 1 ? 'radio.png' : (parseInt(this.state.tipe_pertanyaan_id) === 2 ? 'checkbox.png' : 'input.png'))} style={{width:'30px'}} />&nbsp;&nbsp;
                                            <span style={{marginTop:'6px'}}>{this.state.tipe_pertanyaan}</span>
                                        </CardContent>
                                    </Card>
                                }
                                {!this.$f7route.params['pertanyaan_kuis_id'] &&
                                <List>
                                    <ListInput
                                        // label="Tipe Pertanyaan"
                                        type="select"
                                        value={this.state.tipe_pertanyaan_id}
                                        placeholder="Pilih Tipe Pertanyaan..."
                                        // onChange={this.tipeChange}
                                        onInput={this.tipeChange}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                        <img src={localStorage.getItem('api_base')+"/assets/img/"+(parseInt(this.state.tipe_pertanyaan_id) === 1 ? 'radio.png' : (parseInt(this.state.tipe_pertanyaan_id) === 2 ? 'checkbox.png' : 'input.png'))} style={{width:'30px'}} slot="media" />
                                        <option value={1}>Pilihan Ganda</option>
                                        <option value={2}>Checkbox (Pilihan lebih dari satu)</option>
                                        <option value={3}>Isian</option>
                                        {/* <option disabled value={"-"}>--</option>
                                        <option value={4}>Isian (survey/tanpa skor otomatis)</option>
                                        <option value={5}>Checkbox (survey/tanpa skor otomatis)</option>
                                        <option value={6}>Pilihan Ganda (survey/tanpa skor otomatis)</option> */}
                                    </ListInput>
                                </List>
                                }
                                {/* <Row style={{justifyContent:'center'}}>
                                    <Col width="33">
                                        <Card style={{margin:'0px'}}>
                                            <CardContent style={{display:'inline-flex', padding:'8px'}}>
                                                <img src={localStorage.getItem('api_base')+"/assets/img/radio.png"} style={{width:'30px'}} />&nbsp;
                                                <span style={{marginTop:'6px'}}>Pilihan Ganda</span>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="33">
                                        <Card style={{margin:'0px'}}>
                                            <CardContent style={{display:'inline-flex', padding:'8px'}}>
                                                <img src={localStorage.getItem('api_base')+"/assets/img/checkbox.png"} style={{width:'30px'}} />&nbsp;
                                                <span style={{marginTop:'6px'}}>Checkbox</span>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="33">
                                        <Card style={{margin:'0px'}}>
                                            <CardContent style={{display:'inline-flex', padding:'8px'}}>
                                                <img src={localStorage.getItem('api_base')+"/assets/img/input.png"} style={{width:'30px'}} />&nbsp;
                                                <span style={{marginTop:'6px'}}>Isian</span>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                </Row> */}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <BlockTitle style={{margin:'0px'}}>
                                    Bagian
                                </BlockTitle>
                                <br/>
                                <List>
                                    <ListInput
                                        type="select"
                                        value={this.state.pertanyaan.bagian_kuis_id}
                                        // defaultValue={0}
                                        placeholder="Pilih Bagian ..."
                                        onChange={this.bagianChange}
                                    >
                                        <option value={null}>-</option>
                                        {this.state.aspek_reversed.rows.map((option)=>{
                                            return (
                                                <option value={option.bagian_kuis_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                </List>
                            </CardContent>
                        </Card>
                        {parseInt(this.state.tipe_pertanyaan_id) === 3 &&
                        <Card>
                            <CardHeader
                                className="no-border"
                                valign="bottom"
                                style={{paddingLeft:'0px', paddingRight:'0px', display:'inline-block'}}
                            >
                                <List noHairlinesMd style={{marginBottom:'0px', padding:'0px'}}>
                                    <ListInput
                                        label="Kode Pertanyaan"
                                        type="text"
                                        placeholder="Kode Pertanyaan ..."
                                        clearButton
                                        outline
                                        defaultValue={this.state.pertanyaan.kode_pertanyaan}
                                        onChange={this.setValue('kode_pertanyaan')}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                    </ListInput>
                                </List>
                                <BlockHeader style={{marginTop:'8px', marginBottom:'0px'}}>Konten Pertanyaan</BlockHeader>
                                <List noHairlinesMd style={{marginBottom:'0px', width:'100%', padding:'8px'}}>
                                    <ReactQuill 
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        // onChange={this.setStateValue('teks')} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.pertanyaan_kuis.rows[0].teks}
                                        on
                                        // value={this.state.pertanyaan_kuis.rows[0].teks}
                                    />
                                </List>
                            </CardHeader>
                            <CardContent style={{display:'inline-grid', width:'100%'}}>
                            <Row style={{width:'95%', marginBottom:'32px'}}>
                                    {this.state.file_audio &&
                                    <Col width="100">
                                        <ReactAudioPlayer
                                            src={this.state.file_audio}
                                            autoPlay={false}
                                            controls
                                            style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                        />
                                    </Col> 
                                    }
                                    <Col width={this.state.file_audio ? "80" : "100"}> 
                                        <Button raised onClick={()=>this.setState({actionAudioTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:hifispeaker_fill"} aurora={"f7:hifispeaker_fill"} md={"material:hifispeaker_fill"} tooltip="Tambah Link Audio" />
                                            &nbsp;
                                            {!this.state.file_audio ? 'Tambah' : 'Ganti'} Link Audio
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_audio ? "20" : "0"} style={{display:(this.state.file_audio ? 'block' : 'none')}}>
                                        <Button raised onClick={()=>this.setState({file_audio:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Audio" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    {this.state.file_video !== null &&
                                    <Col width="100" style={{textAlign:'center',paddingTop:'16px'}}>
                                        <YouTube
                                            videoId={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                            id={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                        />
                                    </Col>
                                    }
                                    <Col width={this.state.file_video ? "80" : "100"}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({actionVideoTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:videocam_fill"} aurora={"f7:videocam_fill"} md={"material:videocam_fill"} tooltip="Tambah Video" />
                                            &nbsp;
                                            {!this.state.file_video ? 'Tambah' : 'Ganti'} Video dari Youtube
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_video ? "20" : "0"} style={{display:(this.state.file_video ? 'block' : 'none')}}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({file_video:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Video" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    <Col width="100">
                                    </Col>
                                </Row>
                                {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                                <>
                                    <div>
                                        Kata Kunci Jawaban yang benar (Bisa lebih dari satu)
                                    </div>
                                    <div style={{width:'95%', fontSize:'12px', fontStyle:'italic', borderTop:'1px solid #ccc', paddingTop:'16px'}}>
                                        Pastikan kata kunci jawaban dalam format yang paling sederhana untuk meningkatkan probabilitas jawaban benar dari peserta kuis
                                    </div>
                                    <br/>
                                    <List noHairlinesMd style={{marginBottom:'0px', width:'100%'}}>
                                        {this.state.listPilihan}
                                        <ListItem>
                                        {/* <ListItem style={{paddingLeft:'37px'}}> */}
                                            <Button raised onClick={()=>this.tambahPilihan(this.props.id)}>
                                                <Icon style={{fontSize:'20px'}} ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Kata Kunci Jawaban" />
                                                &nbsp;
                                                Tambah Kata Kunci Jawaban
                                            </Button>
                                        </ListItem>
                                    </List>
                                </>
                                }
                            </CardContent>
                        </Card>
                        }
                        {parseInt(this.state.tipe_pertanyaan_id) === 2 &&
                        <Card>
                            <CardHeader
                                className="no-border"
                                valign="bottom"
                                style={{paddingLeft:'0px', paddingRight:'0px', display:'inline-block'}}
                            >
                                {/* <BlockHeader style={{marginTop:'8px', marginBottom:'0px'}}>
                                    Kode Pertanyaan
                                </BlockHeader> */}
                                <List noHairlinesMd style={{marginBottom:'0px', padding:'0px'}}>
                                    <ListInput
                                        label="Kode Pertanyaan"
                                        type="text"
                                        placeholder="Kode Pertanyaan ..."
                                        clearButton
                                        outline
                                        defaultValue={this.state.pertanyaan.kode_pertanyaan}
                                        onChange={this.setValue('kode_pertanyaan')}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                    </ListInput>
                                </List>
                                <BlockHeader style={{marginTop:'8px', marginBottom:'0px'}}>
                                    Konten Pertanyaan
                                </BlockHeader>
                                <List noHairlinesMd style={{marginBottom:'0px', padding:'8px'}}>
                                    <ReactQuill 
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        // onChange={this.setStateValue('teks')} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.pertanyaan_kuis.rows[0].teks}
                                        on
                                        // value={this.state.pertanyaan_kuis.rows[0].teks}
                                    />

                                </List>
                            </CardHeader>
                            <CardContent style={{display:'inline-grid', width:'100%'}}>
                                <Row style={{width:'95%', marginBottom:'32px'}}>
                                    {this.state.file_audio &&
                                    <Col width="100">
                                        <ReactAudioPlayer
                                            src={this.state.file_audio}
                                            autoPlay={false}
                                            controls
                                            style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                        />
                                    </Col> 
                                    }
                                    <Col width={this.state.file_audio ? "80" : "100"}> 
                                        <Button raised onClick={()=>this.setState({actionAudioTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:hifispeaker_fill"} aurora={"f7:hifispeaker_fill"} md={"material:hifispeaker_fill"} tooltip="Tambah Link Audio" />
                                            &nbsp;
                                            {!this.state.file_audio ? 'Tambah' : 'Ganti'} Link Audio
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_audio ? "20" : "0"} style={{display:(this.state.file_audio ? 'block' : 'none')}}>
                                        <Button raised onClick={()=>this.setState({file_audio:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Audio" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    {this.state.file_video !== null &&
                                    <Col width="100" style={{textAlign:'center',paddingTop:'16px'}}>
                                        <YouTube
                                            videoId={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                            id={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                        />
                                    </Col>
                                    }
                                    <Col width={this.state.file_video ? "80" : "100"}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({actionVideoTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:videocam_fill"} aurora={"f7:videocam_fill"} md={"material:videocam_fill"} tooltip="Tambah Video" />
                                            &nbsp;
                                            {!this.state.file_video ? 'Tambah' : 'Ganti'} Video dari Youtube
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_video ? "20" : "0"} style={{display:(this.state.file_video ? 'block' : 'none')}}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({file_video:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Video" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    <Col width="100">
                                    </Col>
                                </Row>
                                <div style={{display:'inline-block'}}>
                                    Pilihan Jawaban<br/>
                                    {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                                    <>(Jawaban benar dapat lebih dari satu)</>
                                    }
                                </div>
                                <br/>
                                <List noHairlinesMd style={{marginBottom:'0px', width:'100%'}}>
                                    {this.state.listPilihan}
                                    <ListItem>
                                    {/* <ListItem style={{paddingLeft:'37px'}}> */}
                                        <Button raised onClick={()=>this.tambahPilihan(this.props.id)}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Pilihan Jawaban" />
                                            &nbsp;
                                            Tambah Pilihan Jawaban
                                        </Button>
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                        }
                        {parseInt(this.state.tipe_pertanyaan_id) === 1 &&
                        <Card>
                            <CardHeader
                                className="no-border"
                                valign="bottom"
                                style={{paddingLeft:'0px', paddingRight:'0px', display:'inline-block'}}
                            >
                                <List noHairlinesMd style={{marginBottom:'0px', padding:'0px'}}>
                                    <ListInput
                                        label="Kode Pertanyaan"
                                        type="text"
                                        placeholder="Kode Pertanyaan ..."
                                        clearButton
                                        outline
                                        defaultValue={this.state.pertanyaan.kode_pertanyaan}
                                        onChange={this.setValue('kode_pertanyaan')}
                                    >
                                        {/* <Icon icon="demo-list-icon" slot="media"/> */}
                                    </ListInput>
                                </List>
                                <BlockHeader style={{marginTop:'8px', marginBottom:'0px'}}>Konten Pertanyaan</BlockHeader>
                                <List noHairlinesMd style={{marginBottom:'0px', width:'100%', padding:'8px'}}>
                                    {/* <ListInput
                                        label={"Pertanyaan " + this.props.id}
                                        outline
                                        floatingLabel
                                        clearButton
                                        type="textarea"
                                        resizable
                                        placeholder="Pertanyaan"
                                        onChange={this.setStateValue('teks')}
                                        disabled={this.state.fieldDisabled}
                                        defaultValue={this.state.pertanyaan_kuis.rows[0].teks}
                                    >
                                    </ListInput> */}
                                    {/* <ListItem>
                                        {"Pertanyaan " + this.props.id}
                                    </ListItem> */}
                                    <ReactQuill 
                                        theme="snow" 
                                        onChange={this.editorChange} 
                                        // onChange={this.setStateValue('teks')} 
                                        modules={this.modules}
                                        formats={this.formats}
                                        value={this.state.pertanyaan_kuis.rows[0].teks}
                                        on
                                        // value={this.state.pertanyaan_kuis.rows[0].teks}
                                    />

                                </List>
                            </CardHeader>
                            <CardContent style={{display:'inline-grid', width:'100%'}}>
                                <Row style={{width:'95%', marginBottom:'32px'}}>
                                    {this.state.file_audio &&
                                    <Col width="100">
                                        <ReactAudioPlayer
                                            src={this.state.file_audio}
                                            autoPlay={false}
                                            controls
                                            style={{marginBottom:'16px', width:'100%', height:'30px', border:'1px solid #cccccc'}}
                                        />
                                    </Col> 
                                    }
                                    <Col width={this.state.file_audio ? "80" : "100"}> 
                                        <Button raised onClick={()=>this.setState({actionAudioTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:hifispeaker_fill"} aurora={"f7:hifispeaker_fill"} md={"material:hifispeaker_fill"} tooltip="Tambah Link Audio" />
                                            &nbsp;
                                            {!this.state.file_audio ? 'Tambah' : 'Ganti'} Link Audio
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_audio ? "20" : "0"} style={{display:(this.state.file_audio ? 'block' : 'none')}}>
                                        <Button raised onClick={()=>this.setState({file_audio:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Audio" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    {this.state.file_video !== null &&
                                    <Col width="100" style={{textAlign:'center',paddingTop:'16px'}}>
                                        <YouTube
                                            videoId={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                                            id={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                                        />
                                    </Col>
                                    }
                                    <Col width={this.state.file_video ? "80" : "100"}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({actionVideoTrue:true})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:videocam_fill"} aurora={"f7:videocam_fill"} md={"material:videocam_fill"} tooltip="Tambah Video" />
                                            &nbsp;
                                            {!this.state.file_video ? 'Tambah' : 'Ganti'} Video dari Youtube
                                        </Button>
                                    </Col>
                                    <Col width={this.state.file_video ? "20" : "0"} style={{display:(this.state.file_video ? 'block' : 'none')}}>
                                        <Button raised style={{marginTop:'16px'}} onClick={()=>this.setState({file_video:null})}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:clear"} aurora={"f7:clear"} md={"material:clear"} tooltip="Hapus Video" />
                                            &nbsp;
                                            Hapus
                                        </Button>
                                    </Col>
                                    <Col width="100">
                                    </Col>
                                </Row>
                                <div>
                                    Pilihan Jawaban<br/>
                                    {parseInt(this.state.kuis.jenis_kuis_id) === 1 &&
                                    <>
                                    (Ceklis kunci jawaban yang benar)
                                    </>
                                    }
                                </div>
                                <br/>
                                <List noHairlinesMd style={{marginBottom:'0px', width:'100%'}}>
                                    {this.state.listPilihan}
                                    <ListItem>
                                    {/* <ListItem style={{paddingLeft:'37px'}}> */}
                                        <Button raised onClick={()=>this.tambahPilihan(this.props.id)}>
                                            <Icon style={{fontSize:'20px'}} ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Pilihan Jawaban" />
                                            &nbsp;
                                            Tambah Pilihan Jawaban
                                        </Button>
                                    </ListItem>
                                </List>
                            </CardContent>
                            {/* <CardFooter>
                                <Button raised onClick={()=>this.tambahPilihan(this.props.id)}>
                                    <Icon style={{fontSize:'20px'}} ios={"f7:plus_app"} aurora={"f7:plus_app"} md={"material:plus_app"} tooltip="Tambah Pilihan Jawaban" />
                                    &nbsp;
                                    Tambah Pilihan Jawaban
                                </Button>
                            </CardFooter> */}
                        </Card>
                        }
                        <Card><CardContent>
                            <Button large fill raised style={{background:'#8bc34a'}} onClick={this.simpanPertanyaan}>
                                <Icon ios={"f7:paperplane_fill"} aurora={"f7:paperplane_fill"} md={"material:paperplane_fill"} tooltip="Simpan Pertanyaan"/>
                                &nbsp;
                                Simpan Pertanyaan
                            </Button>
                        </CardContent></Card>
                        <br/>
                        <br/>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
                <Actions onActionsClosed={()=>this.setState({actionAudioTrue:false})} onActionsClose={()=>this.setState({actionAudioTrue:false})} ref="actionsOneGroup" opened={this.state.actionAudioTrue} style={{background:'#ffffff', padding:'0px', marginBottom:'16px', borderRadius:'10px'}}>
                    <BlockTitle>Upload Link Berkas Audio</BlockTitle>
                    <div style={{paddingLeft:'16px', fontStyle:'italic',fontSize:'10px'}}>
                        Link Berkas audio ini berguna bila pertanyaan kuis yang Anda buat memerlukan bantuan audio seperti listening pada kuis bahasa inggris, dll
                    </div>
                    <Card>
                        <List>
                            <ListInput
                                label={"Link berkas audio"}
                                outline
                                floatingLabel
                                clearButton
                                type="text"
                                placeholder={"Link berkas audio... "}
                                key={'link-berkas-audio'}
                                onChange={this.setAudio}
                            />
                            <ListItem>
                                {this.state.file_audio !== '' &&
                                <ReactAudioPlayer
                                    src={this.state.file_audio}
                                    autoPlay={false}
                                    controls    
                                />
                                }
                            </ListItem>
                            <ListItem>
                                <Button raised fill onClick={()=>this.setState({actionAudioTrue:false})}>
                                    Simpan
                                </Button>
                            </ListItem>
                        </List>
                        {/* <Dropzone className="droping" onDrop={this.acceptedFile}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.audio !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                    <input {...getInputProps()} />
                                    {this.state.audio === '' &&
                                    <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                    }
                                    {this.state.audio !== '' &&
                                    <>
                                    <ReactAudioPlayer
                                        src={this.state.file_audio}
                                        autoPlay={false}
                                        controls    
                                    />
                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas audio. Ukuran maksimal berkas adalah 5MB, dan hanya dalam format .mp3, atau .ogg</p>
                                    </>
                                    }
                                    {this.state.audio === '' &&
                                    <>
                                    <p>Tarik dan seret berkas audio pilihan Anda ke sini, atau klik/Sentuh untuk cari berkas audio</p>
                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 5MB, dan hanya dalam format .mp3, atau .ogg</p>
                                    </>
                                    }
                                    {this.state.audio !== '' && this.state.audio === '' &&
                                    <>
                                    <p style={{fontSize:'20px'}}>{this.state.audio}</p>
                                    <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti berkas audio. Ukuran maksimal berkas adalah 5MB, dan hanya dalam format .mp3, atau .ogg</p>
                                    </>
                                    }
                                </div>
                            </section>
                        )}
                        </Dropzone> */}

                    </Card>
                </Actions>

                <Actions onActionsClosed={()=>this.setState({actionVideoTrue:false})} onActionsClose={()=>this.setState({actionVideoTrue:false})} ref="actionsOneGroup" opened={this.state.actionVideoTrue} style={{background:'#ffffff', padding:'0px', marginBottom:'16px', borderRadius:'10px'}}>
                    <BlockTitle>Upload Link Video Youtube</BlockTitle>
                    <div style={{paddingLeft:'16px', fontStyle:'italic',fontSize:'10px'}}>
                        Link Berkas video ini berguna bila pertanyaan kuis yang Anda buat memerlukan bantuan video 
                    </div>
                    <div className="youtube-wrapper">
                        {this.state.file_video !== '' &&
                        <YouTube
                            videoId={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                  // defaults -> null
                            id={(this.state.file_video ? (typeof this.state.file_video.split("?")[1] !== 'undefined' ? this.state.file_video.split("?")[1].split("=")[1] : null) : null)}                       // defaults -> null
                            style={{width:'143%'}}
                        />
                        }
                    </div>
                    <Card>
                        <List>
                            <ListInput
                                label={"Link video youtube"}
                                outline
                                floatingLabel
                                clearButton
                                type="text"
                                placeholder={"Link video youtube... "}
                                key={'link-berkas-video'}
                                onChange={this.setVideo}
                            />
                            <ListItem>
                                <Button raised fill onClick={()=>this.setState({actionVideoTrue:false})}>
                                    Simpan
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                </Actions>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      setKuis: actions.setKuis,
      generateUUID: actions.generateUUID,
      getPertanyaanKuis: actions.getPertanyaanKuis,
      getKuis: actions.getKuis,
      simpanPertanyaanKuis: actions.simpanPertanyaanKuis,
      getAspek: actions.getAspek,
      getAspekReversed: actions.getAspekReversed
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        fe_kuis: Kuis.fe_kuis,
        uuid_kuis: Kuis.uuid_kuis,
        pertanyaan_kuis: Kuis.pertanyaan_kuis,
        kuis: Kuis.kuis,
        aspek_reversed: Kuis.aspek_reversed
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(formPertanyaan));
  