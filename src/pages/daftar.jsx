import React, {Component} from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    NavTitleLarge,
    NavRight,
    Link,
    Toolbar,
    Block,
    BlockTitle,
    List,
    ListItem,
    Row,
    Col,
    Button,
    Searchbar,
    View,
    LoginScreenTitle,
    ListInput,
    ListButton,
    BlockFooter,
    Progressbar,
    CardContent,
    Card
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

import GoogleLogin from 'react-google-login';

import io from 'socket.io-client';

class daftar extends Component {
    state = {
        error: null,
        loading: false,
        routeParams:{
            username: '',
            password: ''
        }
    }

    backClick = () => {

        let properti = 'beranda';
        
        for (var property in this.props.tabBar) {
            // console.log(this.state.tabBar[property]);
            this.props.tabBar[property] = false;
        }
        if(this.props.f7router.url.replace("/","").replace("/","") !== ""){
            properti = this.props.f7router.url.replace("/","").replace("/","");
        }
        this.props.tabBar[properti] = true;

        this.props.setTabActive(this.props.tabBar);
        console.log(this.props.tabBar.beranda);
    }

    alertLoginData = () => {
        this.$f7.dialog.alert('Username: ' + this.state.username + '<br>Password: ' + this.state.password);
    }

    responseGoogle = (response) => {
        // alert('berhasil');
        // console.log(response.profileObj.email);
        // console.log(response.profileObj.imageUrl);
        // console.log(response.profileObj.name);

        if(typeof(response.profileObj.email) !== 'undefined'){
            this.setState({
                ...this.state,
                loading:true,
                googleCheck: {
                    username: response.profileObj.email
                }
            },()=>{
                let socket = io(localStorage.getItem('socket_url'));
                    
                this.props.getPengguna(this.state.googleCheck).then((result)=>{
                    if(this.props.pengguna.total < 1){
                        //belum ada
                        this.setState({
                            loading:true,
                            routeParams:{
                                ...this.state.routeParams,
                                data: {
                                    username: response.profileObj.email,
                                    nama: response.profileObj.name,
                                    gambar: response.profileObj.imageUrl
                                }
                            }
                        },()=>{
                            this.props.buatPengguna(this.state.routeParams).then((result)=>{
                                this.setState({
                                    loading: false
                                },()=>{
                                    localStorage.setItem('user', JSON.stringify(this.props.pengguna.rows[0]));
                                    localStorage.setItem('sudah_login',  '1');

                                    this.$f7.dialog.alert('Selamat datang, '+JSON.parse(localStorage.getItem('user')).nama, 'Berhasil');
                                    
                                    let params = {
                                        nama: JSON.parse(localStorage.getItem('user')).nama,
                                        id: JSON.parse(localStorage.getItem('user')).pengguna_id
                                    };

                                    // let socket = io(localStorage.getItem('socket_url'));

                                    // socket.emit('login', params, (err) => {
                                    //     if (err) {
                                    //         //gagal
                                    //     }
                
                                    // });
                                    
                                    // window.location.href="/";
                                    if(this.$f7route.params['param_1']){
                                        //ada param 1
                                        window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                        window.location.reload(true);
                                    }else{

                                        window.location.href="/";
                                    }
                                    
                                })
                            });
                        });
                    }else{
                        //sudah ada
                        this.setState({
                            loading: false
                        },()=>{
                            localStorage.setItem('user', JSON.stringify(this.props.pengguna.rows[0]));
                            localStorage.setItem('sudah_login',  '1');

                            this.$f7.dialog.alert('Selamat datang, '+JSON.parse(localStorage.getItem('user')).nama, 'Berhasil');
                            
                            let params = {
                                nama: JSON.parse(localStorage.getItem('user')).nama,
                                id: JSON.parse(localStorage.getItem('user')).pengguna_id
                            };

                            socket.emit('login', params, (err) => {
                                if (err) {
                                    //gagal
                                }
        
                            });
                            
                            // window.location.href="/";
                            if(this.$f7route.params['param_1']){
                                //ada param 1
                                window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                window.location.reload(true);
                            }else{

                                window.location.href="/";
                            }
                        });
                    }

                });
            });
        }
    }

    doDaftar = () => {
        this.setState({
            loading:true
        },()=>{
            if(!this.state.routeParams.username || !this.state.routeParams.password || !this.state.routeParams.nama){
                this.$f7.dialog.alert('Mohon lengkapi semua data sebelum mendaftar!','Peringatan');

                this.setState({
                    loading: false
                },()=>{
                    return false;
                });
            }else{

                // console.log()

                if(this.state.routeParams.password !== this.state.routeParams.ulang_password){
                    this.$f7.dialog.alert('Ulangi password tidak sama! Mohon perbaiki sebelum melanjutkan mendaftar','Peringatan');
    
                    this.setState({
                        loading: false
                    },()=>{
                        return false;
                    });
                }else{

                    this.props.daftar(this.state.routeParams).then((result)=>{
        
                        if(result.payload.sukses){
                            //berhasil
                            this.setState({
                                routeParamsLogin: {
                                    username: result.payload.username,
                                    password: result.payload.password
                                }
                            },()=>{
        
                                this.props.login(this.state.routeParamsLogin).then((result)=>{
            
                                    this.setState({
                                        loading:false
                                    },()=>{
                                        if(typeof(result.payload.token) !== 'undefined'){
                                            localStorage.setItem('token', result.payload.token);
                                            localStorage.setItem('user', JSON.stringify(result.payload.user));
                                            localStorage.setItem('sudah_login',  '1');
                
                                            this.$f7.dialog.alert('Selamat datang, '+JSON.parse(localStorage.getItem('user')).nama, 'Berhasil');
                                            
                                            let params = {
                                                nama: JSON.parse(localStorage.getItem('user')).nama,
                                                id: JSON.parse(localStorage.getItem('user')).pengguna_id
                                            };

                                            // let socket = io(localStorage.getItem('socket_url'));
                                            
                                            // socket.emit('login', params, (err) => {
                                            //     if (err) {
                                            //         //gagal
                                            //     }
                                            // });
                                            
                                            // window.location.href="/";
                                            if(this.$f7route.params['param_1']){
                                            //ada param 1
                                            window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                            window.location.reload(true);
                                        }else{

                                            window.location.href="/";
                                        }
                
                                        }else{
                                            localStorage.setItem('sudah_login',  '0');
                                            this.$f7.dialog.alert(result.payload.error, 'Peringatan');
                                        }
                                    });
                                });
                            
                            });
        
        
                        }else{
                            //gagal
                            this.setState({
                                loading:false,
                                pesan_gagal: result.payload.pesan
                            },()=>{
                                
                                this.$f7.dialog.alert(this.state.pesan_gagal,'Mohon Maaf!');
                                return false;
                                
                            })
                        }
                        
            
                    });

                }
            }
            

        });
    }

    render()
    {
        return (
            // <View>
                // <Page loginScreen>
                <Page loginScreen name="daftar" hideBarsOnScroll className="loginPage">
                    <div className="backgroundback"></div>
                    {this.state.loading &&
                    <Progressbar style={{height:'10px'}} infinite color="multi"></Progressbar>
                    }
                    <Row>
                        <Col width="0" tabletWidth="25" desktopWidth="30"></Col>
                        <Col width="100" tabletWidth="50" desktopWidth="40">

                            <Card raised style={{background:'rgba(0, 0, 0, 0.2)'}}>
                                <CardContent style={{padding:'32px', background:'transparent', color:'white'}}>
                                    <div style={{width:'100%',  textAlign:'center'}}>
                                        {localStorage.getItem('custom_logo_sekolah') !== '' && localStorage.getItem('custom_logo_sekolah') !== null &&
                                        <>
                                            <img src={localStorage.getItem('api_base')+localStorage.getItem('custom_logo_sekolah')} style={{width:'12vh'}}/>
                                            <LoginScreenTitle style={{fontSize:'20px', marginBottom:'0px'}}>{localStorage.getItem('custom_logo_sekolah_nama')}</LoginScreenTitle>
                                            <div style={{marginTop:'15px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px', display:'inline-flex', paddingLeft:'0%', marginTop:'-10px', marginBottom:'32px'}}>
                                                <span style={{marginTop:'12px', marginRight:'8px'}}>powered by</span>
                                                <img src={"./static/icons/illo-logo-white.png"} style={{height:'80px', marginTop:'16px', marginBottom:'8px'}}/>
                                            </div>
                                        </>
                                        }
                                        {localStorage.getItem('custom_logo_sekolah') === null &&
                                        <>
                                            <img src={"./static/icons/illo-logo-white.png"} style={{height:'80px', marginTop:'16px', marginBottom:'8px'}}/>
                                            <LoginScreenTitle style={{fontSize:'20px'}}>Daftar Pengguna Baru</LoginScreenTitle>
                                        </>
                                        }
                                        {localStorage.getItem('custom_logo_sekolah') === '' &&
                                        <>
                                            <img src={"./static/icons/illo-logo-white.png"} style={{height:'80px', marginTop:'16px', marginBottom:'8px'}}/>
                                            <LoginScreenTitle style={{fontSize:'20px'}}>Daftar Pengguna Baru</LoginScreenTitle>
                                        </>
                                        }
                                    </div>
                                    <List form style={{minWidth:'100%'}} noHairlines noHairlinesBetweenIos>
                                        <ListInput
                                            type="text"
                                            name="nama"
                                            placeholder="Nama Anda ...."
                                            label='Nama'
                                            noHairlines
                                            className="inputLogin"
                                            disabled={(this.state.loading ? true : false)}
                                            defaultValue={this.state.routeParams.nama}
                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,nama: e.target.value}})}
                                        ></ListInput>
                                        <ListInput
                                            type="text"
                                            name="email"
                                            placeholder="Email Anda ...."
                                            label= 'Email'
                                            noHairlines
                                            className="inputLogin"
                                            disabled={(this.state.loading ? true : false)}
                                            defaultValue={this.state.routeParams.username}
                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,username: e.target.value}})}
                                        ></ListInput>
                                        <ListInput
                                            type="text"
                                            name="no_hp"
                                            placeholder="No HP Anda ...."
                                            label= 'No HP'
                                            noHairlines
                                            className="inputLogin"
                                            disabled={(this.state.loading ? true : false)}
                                            defaultValue={this.state.routeParams.username}
                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,no_hp: e.target.value}})}
                                        ></ListInput>
                                        <ListInput
                                            label= 'Password'
                                            type="password"
                                            noHairlines
                                            name="password"
                                            className="inputLogin"
                                            disabled={(this.state.loading ? true : false)}
                                            placeholder="Password Anda ...."
                                            defaultValue={this.state.routeParams.password}
                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,password: e.target.value}})}
                                        ></ListInput>
                                        <ListInput
                                            label= 'Ulangi Password'
                                            type="password"
                                            noHairlines
                                            name="ulang_password"
                                            className="inputLogin"
                                            disabled={(this.state.loading ? true : false)}
                                            placeholder="Ulangi Password Anda ...."
                                            defaultValue={this.state.routeParams.ulang_password}
                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,ulang_password: e.target.value}})}
                                        ></ListInput>
                                    </List>
                                    <br/>
                                    <br/>
                                    <List style={{padding:16, minWidth:'100%'}}>
                                        <Button fill 
                                            iconIos="f7:person_alt_circle" 
                                            iconAurora="f7:person_alt_circle" 
                                            iconMd="material:person_alt_circle"  
                                            title="Masuk" 
                                            disabled={(this.state.loading ? true : false)}
                                            // loginScreenClose 
                                            // onClick={() => this.alertLoginData()}
                                            onClick={this.doDaftar}
                                            style={{paddingTop:10,paddingBottom:10, height:50, width:'100%', background:'#7CB342', borderRadius:'20px'}}
                                            className="bawahCiriHijau"
                                        >
                                            &nbsp;&nbsp; Daftar sebagai Pengguna Baru
                                        </Button>
                                        <br/>
                                        <Button fill 
                                            title="Batal dan Kembali ke Halaman Login" 
                                            disabled={(this.state.loading ? true : false)}
                                            onClick={()=>this.$f7router.navigate("/Login/")}
                                            style={{paddingTop:10,paddingBottom:10, height:50, width:'100%', background:'#FF5252', borderRadius:'20px'}}
                                            className="bawahCiri"
                                        >
                                            Batal dan Kembali ke Halaman Login
                                        </Button>
                                    </List>
                                </CardContent>
                            </Card>
                            <div style={{marginTop:'8px', color:'white', textAlign:'center', marginBottom:'32px'}}>
                                Copyright 2021 © Illo
                                {/* <br/>
                                <div style={{marginTop:'8px', fontSize:'10px'}}>
                                    <Link style={{color:'white'}} href="https://diskuis.id" target="_blank" className="link external">Landing page</Link>&nbsp;|&nbsp;
                                    <Link style={{color:'white'}} href="https://diskuis.id/#about" target="_blank" className="link external">About</Link>&nbsp;|&nbsp;
                                    <Link style={{color:'white'}} href="https://diskuis.id/blog" target="_blank" className="link external">Blog</Link>
                                </div> */}
                            </div>
                        </Col>
                        <Col width="0" tabletWidth="25" desktopWidth="30"></Col>
                    </Row>
                    {/* <List style={{padding:16, textAlign:'center'}}>
                    </List> */}
                    {/* <List style={{padding:16}}>
                        <BlockTitle>
                            Belum punya akun?
                        </BlockTitle>
                        <Button fill 
                            iconIos="f7:person_crop_square_fill" 
                            iconAurora="f7:person_crop_square_fill" 
                            iconMd="material:enter"  
                            title="Masuk" 
                            color="green"
                            onClick={this.responseGoogle}
                            // loginScreenClose 
                            // onClick={() => this.alertLoginData()}
                            style={{paddingTop:10,paddingBottom:10, height:50}}
                        >
                            &nbsp;&nbsp; Daftar Pengguna Baru
                        </Button>
                    </List> */}
                </Page>
            // </View>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      setTabActive: Actions.setTabActive,
      login: Actions.login,
      daftar: Actions.daftar,
      getPengguna: Actions.getPengguna,
      buatPengguna: Actions.buatPengguna
    }, dispatch);
}

function mapStateToProps({ App }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        pengguna: App.pengguna
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(daftar));
  