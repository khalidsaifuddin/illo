import React, {Component} from 'react';
import {
    Card, CardHeader, CardContent, List, ListIndex, ListInput, Button, Icon, Radio, CardFooter, Checkbox, ListItem
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class panelPertanyaan extends Component {
    state = {
        error: null,
        loading: false,
        // routeParams:{
        //     pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id
        // },
        routeParams: this.props.fe_kuis,
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
        // routeParams: this.props.kuis.rows[0]
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
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}, { 'script': 'sub'}, { 'script': 'super' }],
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

    componentDidMount = () => {

        console.log(this.props);

        if(this.props.pertanyaan_kuis_id){
        // if(this.props.pertanyaan_kuis_id !== '' && this.props.pertanyaan_kuis_id !== null){

            this.setState({
                routeParamsPertanyaanKuis: {
                    pertanyaan_kuis_id: this.props.pertanyaan_kuis_id
                },
                routeParamsKuis: {
                    kuis_id: this.props.kuis_id
                }
            },()=>{
                this.props.getKuis(this.state.routeParamsKuis).then((result)=>{

                    this.setState({
                        ...this.state,
                        routeParams: this.props.kuis.rows[0]
                    },()=>{
                        // console.log(this.state.routeParams);

                        this.props.getPertanyaanKuis(this.state.routeParamsPertanyaanKuis).then((result)=>{
                            this.setState({
                                fieldDisabled: false,
                                pertanyaan_kuis_id: this.props.pertanyaan_kuis_id,
                                pertanyaan_kuis: this.props.pertanyaan_kuis
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
                                // console.log(this.state.routeParams);
                                // this.props.setKuis(this.state.routeParams);
        
                                //set pilihan
                                let pilihan = [];
                                let nPilihan = 0;
        
                                for (const key in this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis) {
                                    if (this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis.hasOwnProperty(key)) {
                                        const element = this.state.pertanyaan_kuis.rows[0].pilihan_pertanyaan_kuis[key];
                                        nPilihan++;
                                        
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
                                                >
                                                    <Radio 
                                                        style={{marginTop:'15px'}} 
                                                        name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                                        value={key} 
                                                        slot="media"
                                                        onChange={this.klikJawabanBenar(this.state.pertanyaan_kuis_id)}
                                                        defaultChecked={(element.jawaban_benar  === 1 ? true : false)}
                                                    />
                                                </ListInput>
                                            )
                                        ];
                                        
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
                                pilihan_pertanyaan_kuis: {}
                            }
                        }
                    }
                },()=>{
                    console.log(this.state.routeParams);
                    this.props.setKuis(this.state.routeParams);
                });
    
            });

        }



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
        
        let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    pertanyaan_kuis: {
                        ...this.state.routeParams.pertanyaan_kuis,
                        [this.state.pertanyaan_kuis_id]: {
                            ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id],
                            pilihan_pertanyaan_kuis: {
                                ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis,
                                [uuid]: {
                                    ...this.state.routeParams.pertanyaan_kuis[this.state.pertanyaan_kuis_id].pilihan_pertanyaan_kuis[uuid],
                                    pilihan_pertanyaan_kuis_id: uuid,
                                    [key]: value,
                                    jawaban_benar: 0
                                }
                            }
                        }
                    }
                }
            },()=>{
                console.log(this.state.routeParams);
                this.props.setKuis(this.state.routeParams);
            });

        });


    }

    klikJawabanBenar = (pertanyaan_kuis_id) => (e) => {
        // console.log(pertanyaan_kuis_id);
        // console.log(e.currentTarget.value);
        // console.log(this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis);
        // this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis
        let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

            for (var prop in this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis) {
                this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[prop].jawaban_benar = 0;
            }
    
            this.state.routeParams.pertanyaan_kuis[pertanyaan_kuis_id].pilihan_pertanyaan_kuis[value].jawaban_benar = 1;
    
            this.props.setKuis(this.state.routeParams);
            setTimeout(() => {
                console.log(this.props.fe_kuis);
            }, 100);

        });
    }

    tambahPilihan = (pertanyaan_kuis_id) => {
        this.props.generateUUID(this.state.routeParams).then((result)=>{

            this.setState({
                sekuen_pilihan: (this.state.sekuen_pilihan+1),
                listPilihan: [
                    ...this.state.listPilihan,
                    (
                        <ListInput
                            label={"Pilihan "+this.state.sekuen_pilihan}
                            outline
                            floatingLabel
                            clearButton
                            type="textarea"
                            resizable
                            placeholder={"Pilihan "+this.state.sekuen_pilihan}
                            style={{width:'70%'}}
                            key={this.props.uuid_kuis}
                            onChange={this.setStateValuePilihan(this.props.uuid_kuis, 'teks')}
                        >
                            <Radio 
                                style={{marginTop:'15px'}} 
                                name={"jawaban-benar-"+this.state.pertanyaan_kuis_id} 
                                value={this.props.uuid_kuis} 
                                slot="media"
                                onChange={this.klikJawabanBenar(this.state.pertanyaan_kuis_id)}
                            />
                            {/* <Checkbox name="checkbox-1" slot="media">Jawaban benar</Checkbox> */}
                            {/* <Radio name={this.props.id+"-"+this.state.sekuen_pilihan+1} value={this.props.id+"-"+this.state.sekuen_pilihan+1}/>&nbsp;  */}
                        </ListInput>
                    )
                ]
            });

        });
        
    }

    editorChange = (e, delta, source, editor) => {
        console.log('yeye');
        console.log(e);
        console.log(delta);
        console.log(source);
        console.log(editor);

        this.state.pertanyaan_kuis.rows[0].teks = e;

        let value = e;
        // let value = e.currentTarget.value;

        this.setState({
            routeParams: this.props.fe_kuis
        },()=>{

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
                            teks: value
                        }
                    }
                }
            },()=>{
                console.log(this.state.routeParams);
                this.props.setKuis(this.state.routeParams);
            });

        })

        // this.setState({
        //     routeParams: {
        //         ...this.state.routeParams,
        //         deskripsi: e
        //     }
        // },()=>{
        //     // console.log(this.state.routeParams);
        // });
    }
    
    render()
    {
        // console.log(this.state.pertanyaan_kuis.rows[0].teks);

        // let textValue = String(this.state.pertanyaan_kuis.rows[0].teks);

        return (
            <Card style={{borderBottom:'5px solid #81d4fa'}}>
                <CardHeader
                    className="no-border"
                    valign="bottom"
                    style={{paddingLeft:'0px', paddingRight:'0px'}}
                >
                    <List noHairlinesMd style={{marginBottom:'0px', width:'100%'}}>
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
                        <ListItem>
                            {"Pertanyaan " + this.props.id}
                        </ListItem>
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
                    <div>
                        Pilihan Jawaban (Ceklis kunci jawaban yang benar)
                    </div>
                    <br/>
                    <List noHairlinesMd style={{marginBottom:'0px', width:'100%'}}>
                        {this.state.listPilihan}
                        <ListItem style={{paddingLeft:'37px'}}>
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
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      setKuis: Actions.setKuis,
      generateUUID: Actions.generateUUID,
      getPertanyaanKuis: Actions.getPertanyaanKuis,
      getKuis: Actions.getKuis
    }, dispatch);
}

function mapStateToProps({ App, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        fe_kuis: Kuis.fe_kuis,
        uuid_kuis: Kuis.uuid_kuis,
        pertanyaan_kuis: Kuis.pertanyaan_kuis,
        kuis: Kuis.kuis
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(panelPertanyaan));
  