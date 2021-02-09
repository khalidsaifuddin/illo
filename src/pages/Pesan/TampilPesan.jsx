import React, {Component} from 'react';
import {
    Page, Popup, Navbar, NavTitle, NavTitleLarge, List, ListInput, ListItem, ListItemContent, Block, Button, CardHeader, Row, Col, Card, CardContent, CardFooter, Link, NavRight, BlockTitle, Tabs, Tab, Toolbar, Segmented, Actions, ActionsGroup, ActionsButton, ActionsLabel, Chip, Icon, Popover, Toggle, Searchbar, BlockHeader, Messagebar, MessagebarAttachment, MessagebarSheet, MessagebarAttachments, Preloader
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

import moment from 'moment';

import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';
import Routing from 'leaflet-routing-machine';
import ExtraMarkers from 'leaflet-extra-markers';

import io from 'socket.io-client';

class TampilPesan extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            kelompok_pesan_id: this.$f7route.params['kelompok_pesan_id'] ? this.$f7route.params['kelompok_pesan_id'] : null
        },
        pengguna: {},
        popupOpened: true,
        kelompok_pesan: {},
        konten: '',
        pesan: {
            rows: [],
            total: 0
        }
    }

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    bulan = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    componentDidMount = () => {

        let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
        // socket.configure(function () { 
        //     io.set("transports", ["xhr-polling"]); 
        //     io.set("polling duration", 10); 
        // });

        socket.emit('tampilPesan', null, this.$f7route.params['kelompok_pesan_id'], JSON.parse(localStorage.getItem('user')), (err) => {
            if (err) {
                //gagal
            }
        })
        
        // socket.on('updatePesanDibaca', (pengguna_id) => {
        //     this.props.getPesan(this.state.routeParams).then((result)=>{
        //         this.setState({
        //             pesan: result.payload
        //         })
        //     })
        // })

        socket.on('updatePesan', (pengguna_id) => {
        
            this.props.getPesan(this.state.routeParams).then((result)=>{
                this.setState({
                    pesan: result.payload
                },()=>{
                    
                    this.scrollToBottom()

                    setTimeout(() => {
                        this.props.simpanPesanDibaca({
                            pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
                            kelompok_pesan_id: this.$f7route.params['kelompok_pesan_id']
                        }).then((result)=>{
                            this.props.getDaftarPesan({pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id})
                            
                            // socket.emit('kirimPesanDibaca', this.$f7route.params['kelompok_pesan_id'], (err) => {
                            //     if (err) {
                            //         //gagal
                            //     }
                            // })
                        })
                    }, 2000);

                })
            })
    
        })

        this.props.getKelompokPesan(this.state.routeParams).then((result)=>{
            if(result.payload.total > 0){
                this.setState({
                    kelompok_pesan: result.payload.rows[0]
                },()=>{
                    

                    this.props.getPesan(this.state.routeParams).then((result)=>{

                        if(result.payload.total < 1){
                            //baru mulai percakapan nih

                            let pengguna_id_lawan = null;

                            if(JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.kelompok_pesan.pengguna_id_1){
                                pengguna_id_lawan = this.state.kelompok_pesan.pengguna_id_1
                            }else{
                                pengguna_id_lawan = this.state.kelompok_pesan.pengguna_id_2
                            }

                            // console.log(pengguna_id_lawan)

                            socket.emit('tampilPesan', pengguna_id_lawan, this.$f7route.params['kelompok_pesan_id'], JSON.parse(localStorage.getItem('user')), (err) => {
                                if (err) {
                                    //gagal
                                }
                            })
                        }else{
                            //lanjutin yang udah ada
                        }

                        this.setState({
                            pesan: result.payload,
                            loading: false
                        },()=>{
                            this.scrollToBottom()

                            setTimeout(() => {
                                this.props.simpanPesanDibaca({
                                    pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
                                    kelompok_pesan_id: this.$f7route.params['kelompok_pesan_id']
                                }).then((result)=>{
                                    this.props.getDaftarPesan({pengguna_id:JSON.parse(localStorage.getItem('user')).pengguna_id})
                                
                                    // socket.emit('kirimPesanDibaca', this.$f7route.params['kelompok_pesan_id'], (err) => {
                                    //     if (err) {
                                    //         //gagal
                                    //     }
                                    // })
                                })
                            }, 2000);
                        })
                    })
                })
            }
        })
        
    }

    bukaPopup = (params) => {
        this.setState({
            popupOpened: !this.state.popupOpened
        },()=>{
            this.scrollToBottom()
        })
    }

    setPopupOpened = () => {
        this.setState({
            popupOpened: false
        })
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    kirimPesan = () => {
        // alert('tes')
        // this.$f7.dialog.preloader()

        this.props.simpanPesan({
            pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
            konten: this.state.konten,
            kelompok_pesan_id: this.$f7route.params['kelompok_pesan_id']
        }).then((result)=>{
            this.setState({
                konten: ''
            },()=>{
                this.props.getPesan(this.state.routeParams).then((result)=>{
                    this.setState({
                        pesan: result.payload
                    },()=>{
                        // this.$f7.dialog.close()
                        this.scrollToBottom()
                        
                        let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
                        socket.emit('kirimPesan', this.$f7route.params['kelompok_pesan_id'], JSON.parse(localStorage.getItem('user')), (err) => {
                            if (err) {
                                //gagal bos
                            }
                        })
                    })
                })
            })
        })
    }

    setPesan = (e) => {

        // console.log(e.nativeEvent.inputType)

        // if(e.keyCode == 13 && e.shiftKey == false) {
        if(e.nativeEvent.inputType === 'insertLineBreak'){
            e.preventDefault();
            // this.myFormRef.submit();
            // alert('oke')
            // return true
            this.props.simpanPesan({
                pengguna_id_pengirim: JSON.parse(localStorage.getItem('user')).pengguna_id,
                konten: this.state.konten,
                kelompok_pesan_id: this.$f7route.params['kelompok_pesan_id']
            }).then((result)=>{
                this.setState({
                    konten: ''
                },()=>{
                    this.props.getPesan(this.state.routeParams).then((result)=>{
                        this.setState({
                            pesan: result.payload
                        },()=>{
                            // this.$f7.dialog.close()
                            this.scrollToBottom()
                            
                            let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
                            socket.emit('kirimPesan', this.$f7route.params['kelompok_pesan_id'], JSON.parse(localStorage.getItem('user')), (err) => {
                                if (err) {
                                    //gagal bos
                                }
                            })
                        })
                    })
                })
            })
        }else{

            this.setState({
                konten: e.currentTarget.value
            },()=>{
                // console.log(this.state.konten)
            })  

        }
        
    }

    render()
    {

        return (
            <Page name="TampilPesan" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>
                        {this.state.kelompok_pesan.pengguna_id_1 !== JSON.parse(localStorage.getItem('user')).pengguna_id && <>{this.state.kelompok_pesan.nama_1}</>}
                        {this.state.kelompok_pesan.pengguna_id_2 !== JSON.parse(localStorage.getItem('user')).pengguna_id && <>{this.state.kelompok_pesan.nama_2}</>}
                    </NavTitle>
                </Navbar>
                <Card style={{margin:'0px', borderRadius:'0px', height:'100%', overflow:'scroll', background: 'url(/static/icons/tiny_grid.png)'}}>
                    <CardContent style={{padding:'0px', marginBottom:'65px'}}>
                        {this.state.loading &&
                        <div style={{width:'100%', textAlign:'center', marginTop:'16px'}}>
                            <Preloader size="36" />
                        </div>
                        }
                        <div className="toolbar messagebar hilangDiDesktop" style={{position:'fixed', width:'100%', bottom:'65px'}}>
                            <div className="toolbar-inner">
                                {/* <div className="messagebar-area">
                                    <textarea onChange={this.setPesan} className="resizable" placeholder="Pesan Anda"></textarea>
                                </div>
                                <Button raised disabled={(this.state.konten ? false : true)} onClick={()=>this.kirimPesan()}>Kirim</Button> */}
                                <Messagebar
                                    placeholder={"Pesan Anda..."}
                                    // attachmentsVisible={attachmentsVisible()}
                                    // sheetVisible={sheetVisible}
                                    value={this.state.konten}
                                    onInput={this.setPesan}
                                    // onInput={(e) => setMessageText(e.target.value)}
                                >
                                    {/* <Link
                                    iconIos="f7:camera_fill"
                                    iconAurora="f7:camera_fill"
                                    iconMd="material:camera_alt"
                                    slot="inner-start"
                                    onClick={() => {
                                        setSheetVisible(!sheetVisible);
                                    }}
                                    /> */}
                                    <Link
                                    iconIos="f7:arrow_up_circle_fill"
                                    iconAurora="f7:arrow_up_circle_fill"
                                    iconMd="material:send"
                                    slot="inner-end"
                                    onClick={()=>this.kirimPesan()}
                                    />
                                    {/* <MessagebarAttachments>
                                    {attachments.map((image, index) => (
                                        <MessagebarAttachment
                                        key={index}
                                        image={image}
                                        onAttachmentDelete={() => deleteAttachment(image)}
                                        />
                                    ))}
                                    </MessagebarAttachments> */}
                                    {/* <MessagebarSheet>
                                    {images.map((image, index) => (
                                        <MessagebarSheetImage
                                        key={index}
                                        image={image}
                                        checked={attachments.indexOf(image) >= 0}
                                        onChange={handleAttachment}
                                        />
                                    ))}
                                    </MessagebarSheet> */}
                                </Messagebar>
                            </div>
                        </div>
                        <div className="toolbar messagebar hilangDiMobile" style={{position:'fixed', marginLeft:'260px', width:'calc(100% - 260px)'}}>
                            <div className="toolbar-inner">
                                {/* <div className="messagebar-area">
                                    <textarea value={this.state.konten} className="resizable" placeholder="Pesan Anda"></textarea>
                                </div> */}
                                {/* <Button raised disabled={(this.state.konten ? false : true)} onClick={()=>this.kirimPesan()}>Kirim</Button> */}
                                <Messagebar
                                    placeholder={"Pesan Anda..."}
                                    // attachmentsVisible={attachmentsVisible()}
                                    // sheetVisible={sheetVisible}
                                    value={this.state.konten}
                                    onInput={this.setPesan}
                                    // onInput={(e) => setMessageText(e.target.value)}
                                >
                                    {/* <Link
                                    iconIos="f7:camera_fill"
                                    iconAurora="f7:camera_fill"
                                    iconMd="material:camera_alt"
                                    slot="inner-start"
                                    onClick={() => {
                                        setSheetVisible(!sheetVisible);
                                    }}
                                    /> */}
                                    <Link
                                    iconIos="f7:arrow_up_circle_fill"
                                    iconAurora="f7:arrow_up_circle_fill"
                                    iconMd="material:send"
                                    slot="inner-end"
                                    disabled={this.state.loading ? true : false}
                                    onClick={()=>this.kirimPesan()}
                                    />
                                    {/* <MessagebarAttachments>
                                    {attachments.map((image, index) => (
                                        <MessagebarAttachment
                                        key={index}
                                        image={image}
                                        onAttachmentDelete={() => deleteAttachment(image)}
                                        />
                                    ))}
                                    </MessagebarAttachments> */}
                                    {/* <MessagebarSheet>
                                    {images.map((image, index) => (
                                        <MessagebarSheetImage
                                        key={index}
                                        image={image}
                                        checked={attachments.indexOf(image) >= 0}
                                        onChange={handleAttachment}
                                        />
                                    ))}
                                    </MessagebarSheet> */}
                                </Messagebar>
                            </div>
                        </div>
                        <div className="page-content messages-content" style={{padding:'0px', background:'transparent'}}>
                            <div className="messages" style={{border:'0px solid #ccc', background:'transparent'}}>
                                {this.state.pesan.rows.map((option)=>{
                                    
                                    let tgl = new Date(option.create_date);
                                    let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                    let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');
                                    
                                    if(tanggal === moment().format('D') + ' ' + this.bulan[(moment().format('M')-1)] + ' ' + moment().format('YYYY')){
                                        tanggal = 'Hari ini';
                                    }

                                    return (
                                        <>
                                        {JSON.parse(localStorage.getItem('user')).pengguna_id === option.pengguna_id_pengirim &&
                                        <div className="message message-sent">
                                            <div className="message-content">
                                                {/* <div className="message-name">John Doe</div> */}
                                                {/* <div className="message-header">Message header</div> */}
                                                <div className="message-bubble" style={{marginRight:'-5px', '-webkit-mask-box-image':'none', borderRadius:'10px'}}>
                                                    {/* <div className="message-text-header">Text header</div> */}
                                                    <div className="message-text" style={{textAlign:'left', fontSize:'15px'}}>
                                                        {option.konten}
                                                    </div>
                                                    <div style={{fontSize:'10px', marginBottom:'4px', marginRight:'0px', marginTop:'8px'}}>
                                                        {tanggal}, {waktu}&nbsp;
                                                        {parseInt(option.sudah_dibaca) !== 1 &&
                                                        <i className="f7-icons" style={{fontSize:'13px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#ffffff')}}>checkmark_alt_circle</i>
                                                        }
                                                        {parseInt(option.sudah_dibaca) === 1 &&
                                                        <i className="f7-icons" style={{fontSize:'13px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#ffffff')}}>checkmark_alt_circle_fill</i>
                                                        }
                                                    </div>
                                                    {/* <div className="message-text-footer" style={{fontSize:'8px'}}>{tanggal}, {waktu}</div> */}
                                                </div>
                                                {/* <div className="message-footer" style={{fontSize:'8px', marginBottom:'4px', marginRight:'0px'}}>
                                                    {tanggal}, {waktu}&nbsp;
                                                    {parseInt(option.sudah_dibaca) !== 1 &&
                                                    <i className="f7-icons" style={{fontSize:'13px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#bababa')}}>checkmark_alt_circle</i>
                                                    }
                                                    {parseInt(option.sudah_dibaca) === 1 &&
                                                    <i className="f7-icons" style={{fontSize:'13px', color:(parseInt(option.sudah_dibaca) === 1 ? '#04bcea' : '#bababa')}}>checkmark_alt_circle_fill</i>
                                                    }
                                                </div> */}
                                            </div>
                                        </div>
                                        }
                                        {JSON.parse(localStorage.getItem('user')).pengguna_id !== option.pengguna_id_pengirim &&
                                        <div className="message message-received">
                                            <div className="message-content">
                                                <div className="message-bubble" style={{marginLeft:'-5px', '-webkit-mask-box-image':'none', borderRadius:'10px'}}>
                                                    <div className="message-text" style={{textAlign:'left', fontSize:'13px'}}>{option.konten}</div>
                                                    <div style={{fontSize:'10px', marginBottom:'4px', marginLeft:'0px', marginTop:'8px'}}>{tanggal}, {waktu}</div>
                                                </div>
                                                {/* <div className="message-footer" style={{fontSize:'8px', marginBottom:'4px', marginLeft:'0px'}}>{tanggal}, {waktu}</div> */}
                                            </div>
                                        </div>
                                        }
                                        </>
                                    )
                                })}
                                {/* <div className="messages-title"><b>Sunday, Feb 9,</b> 12:58</div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-name">John Doe</div>
                                    <div className="message-header">Message header</div>
                                    <div className="message-bubble">
                                    <div className="message-text-header">Text header</div>
                                    <div className="message-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                                    <div className="message-text-footer">Text footer</div>
                                    </div>
                                    <div className="message-footer">Message footer</div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">John Doe</div>
                                    <div className="message-header">Message header</div>
                                    <div className="message-bubble">
                                    <div className="message-text-header">Text header</div>
                                    <div className="message-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
                                    <div className="message-text-footer">Text footer</div>
                                    </div>
                                    <div className="message-footer">Message footer</div>
                                </div>
                                </div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-bubble">
                                    <div className="message-text">Hi, Kate</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-bubble">
                                    <div className="message-text">How are you?</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">Kate</div>
                                    <div className="message-bubble">
                                    <div className="message-text">Hi, I am good!</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">Blue Ninja</div>
                                    <div className="message-bubble">
                                    <div className="message-text">Hi there, I am also fine, thanks! And how are you?</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-bubble">
                                    <div className="message-text">Hey, Blue Ninja! Glad to see you ;)</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-bubble">
                                    <div className="message-text">Hey, look, cutest kitten ever!</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-sent">
                                <div className="message-content">
                                    <div className="message-bubble">
                                    <div className="message-image">
                                        <img src="https://cdn.framework7.io/placeholder/cats-200x260-4.jpg"
                                        style={{width:"200px", height: "260px"}} />
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">Kate</div>
                                    <div className="message-bubble">
                                    <div className="message-text">Nice!</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">Kate</div>
                                    <div className="message-bubble">
                                    <div className="message-text">Like it very much!</div>
                                    </div>
                                </div>
                                </div>
                                <div className="message message-received">
                                <div className="message-content">
                                    <div className="message-name">Blue Ninja</div>
                                    <div className="message-bubble">
                                    <div className="message-text">Awesome!</div>
                                    </div>
                                </div>
                                </div> */}
                                <div style={{ float:"left", clear: "both" }}
                                    ref={(el) => { this.messagesEnd = el }}>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* <Row style={{marginBottom:'50px'}}>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="100" tabletWidth="80" desktopWidth="70">
                        <Card style={{margin:'0px', borderRadius:'0px'}}>
                            <CardContent style={{padding:'16px'}}>
                                
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row> */}
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: actions.updateWindowDimension,
      setLoading: actions.setLoading,
      getPengguna: actions.getPengguna,
      getKelompokPesan: actions.getKelompokPesan,
      simpanPesan: actions.simpanPesan,
      getPesan: actions.getPesan,
      simpanPesanDibaca: actions.simpanPesanDibaca,
      getDaftarPesan: actions.getDaftarPesan
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, Pesan }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        daftar_pesan: Pesan.daftar_pesan
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(TampilPesan));
  