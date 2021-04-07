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

class login extends Component {
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
                let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false});
                    
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
                                    localStorage.setItem('baru_login',  '1');

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
                                    if(localStorage.getItem('device') === 'android'){
                                        window.location.reload(true);
                                    }else{
                                        if(this.$f7route.params['param_1']){
                                            //ada param 1
                                            window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                            window.location.reload(true);
                                        }else{
                                            window.location.href="/";
                                        }
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
                            localStorage.setItem('baru_login',  '1');

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
                            if(localStorage.getItem('device') === 'android'){
                                window.location.reload(true);
                            }else{
                                if(this.$f7route.params['param_1']){
                                    //ada param 1
                                    window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                    window.location.reload(true);
                                }else{
                                    window.location.href="/";
                                }
                            }
                        });
                    }

                });
            });
        }
    }

    doLogin = () => {
        this.setState({
            loading:true
        },()=>{
            this.props.login(this.state.routeParams).then((result)=>{
                
                this.setState({
                    loading:false
                },()=>{
                    // if(typeof(result) !== 'undefined'){
                        if(typeof(result.payload.token) !== 'undefined'){
                            localStorage.setItem('token', result.payload.token);
                            localStorage.setItem('user', JSON.stringify(result.payload.user));
                            localStorage.setItem('sudah_login',  '1');
                            localStorage.setItem('baru_login',  '1');

                            this.$f7.dialog.alert('Selamat datang, '+JSON.parse(localStorage.getItem('user')).nama, 'Berhasil');
                            
                            let params = {
                                nama: JSON.parse(localStorage.getItem('user')).nama,
                                id: JSON.parse(localStorage.getItem('user')).pengguna_id
                            };
                            
                            // socket.emit('login', params, (err) => {
                            //     if (err) {
                            //         //gagal
                            //     }
        
                            // });
                            
                            if(localStorage.getItem('device') === 'android'){
                                window.location.reload(true);
                            }else{
                                if(this.$f7route.params['param_1']){
                                    //ada param 1
                                    window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                    window.location.reload(true);
                                }else{
                                    window.location.href="/";
                                }
                            }

                        }else{
                            localStorage.setItem('sudah_login',  '0');
                            this.$f7.dialog.alert(result.payload.error, 'Peringatan');
                            // alert('gagal broh');
                            // console.log(result);
                            // this.$f7.dialog.alert('Username: ' + this.state.routeParams.username + '<br>Password: ' + this.state.password);
                        }
                    // }else{
                    //     this.$f7.dialog.alert('Gagal login');
                    // }

                })
    
            });
        });
    }

    componentDidMount = () => {
        // this.$f7.dialog.alert('tes');
        // console.log(this.$f7);
        // console.log(this.Framework7.device.ios);
        // if(localStorage.getItem('device') === 'android'){
        //     console.log
        // }
        // console.log(localStorage.getItem('device'));
        // console.log(parseInt(localStorage.getItem('sudah_login')));

        if(parseInt(localStorage.getItem('sudah_login')) ===  1){
        //     // this.$f7router.navigate('/');
        //     if(localStorage.getItem('device') === 'android'){
        //         window.location.reload(true);
        //     }else{
        //         window.location.href="/";
        //     }
            // this.$f7.dialog.alert('Anda sudah login. Silakan kembali ke beranda','Peringatan',()=>{
            //     alert('balik ke beranda');
            // });
        }
    }

    bukaGoogleLogin = () => {
        window.plugins.googleplus.login(
            {
              'webClientId': localStorage.getItem('google_api'), // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
              'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            },
            (obj) => {
                //   alert(JSON.stringify(obj)); // do something useful instead of alerting
                if(typeof(obj.email) !== 'undefined'){
                    this.setState({
                        ...this.state,
                        loading:true,
                        googleCheck: {
                            username: obj.email
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
                                            username: obj.email,
                                            nama: obj.displayName,
                                            gambar: obj.imageUrl
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
        
        
                                            socket.emit('login', params, (err) => {
                                                if (err) {
                                                    //gagal
                                                }
                        
                                            });
                                            
                                            // window.location.href="/";
                                            if(localStorage.getItem('device') === 'android'){
                                                window.location.reload(true);
                                            }else{
                                                if(this.$f7route.params['param_1']){
                                                    //ada param 1
                                                    window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                                    window.location.reload(true);
                                                }else{
                                                    window.location.href="/";
                                                }
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
                                    if(localStorage.getItem('device') === 'android'){
                                        window.location.reload(true);
                                    }else{
                                        if(this.$f7route.params['param_1']){
                                            //ada param 1
                                            window.location.href="/#!/"+this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'];
                                            window.location.reload(true);
                                        }else{

                                            window.location.href="/";
                                        }
                                    }
                                });
                            }
        
                        });
                    });
                }
            },
            (msg) => {
              alert('error: ' + msg);
            }
        );
    }

    render()
    {
        return (
            // <View>
                // <Page loginScreen>
                <Page loginScreen name="login" hideBarsOnScroll className="loginPage">
                    <div className="backgroundback"></div>
                    {this.state.loading &&
                    <Progressbar style={{height:'10px'}} infinite color="multi"></Progressbar>
                    }
                    <Row>
                        <Col width="0" tabletWidth="0" desktopWidth="15"></Col>
                        <Col width="100" tabletWidth="100" desktopWidth="70">

                            <Card style={{background:'rgba(0, 0, 0, 0.2)'}}>
                                <CardContent style={{padding:'8px',background:'transparent', color:'white'}}>

                                    <Row>
                                        <Col width="100">
                                            <div style={{width:'100%',  textAlign:'center'}}>
                                                {localStorage.getItem('custom_logo_sekolah') === '' &&
                                                <>
                                                <img src={"./static/icons/illo-logo-white.png"} style={{height:'80px', marginTop:'16px', marginBottom:'8px'}}/>
                                                {/* <LoginScreenTitle style={{fontSize:'20px', marginTop:'0px'}}>Masuk {localStorage.getItem('judul_aplikasi')}</LoginScreenTitle> */}
                                                <div style={{fontSize:'16px', marginBottom:'16px', marginTop:'-10px'}}>{localStorage.getItem('sub_judul_aplikasi')}</div>
                                                </>
                                                }
                                                {localStorage.getItem('custom_logo_sekolah') === null &&
                                                <>
                                                <img src={"./static/icons/illo-logo-white.png"} style={{height:'80px', marginTop:'16px', marginBottom:'-16px'}}/>
                                                <LoginScreenTitle style={{fontSize:'20px'}}>Masuk {localStorage.getItem('judul_aplikasi')}</LoginScreenTitle>
                                                <div style={{fontSize:'16px', marginBottom:'16px', marginTop:'-30px'}}>{localStorage.getItem('sub_judul_aplikasi')}</div>
                                                </>
                                                }
                                                {localStorage.getItem('custom_logo_sekolah') !== '' && localStorage.getItem('custom_logo_sekolah') !== null &&
                                                <>
                                                <img src={localStorage.getItem('api_base')+localStorage.getItem('custom_logo_sekolah')} style={{width:'12vh'}}/>
                                                <LoginScreenTitle style={{fontSize:'20px', marginBottom:'0px'}}>{localStorage.getItem('custom_logo_sekolah_nama')}</LoginScreenTitle>
                                                <div style={{marginTop:'15px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px', display:'inline-flex', paddingLeft:'0%', marginTop:'-10px', marginBottom:'0px'}}>
                                                    <span style={{marginTop:'12px', marginRight:'8px'}}>powered by</span>
                                                    <img src={"./static/icons/illo-logo-white.png"}  style={{height:'15px', margin:'auto', marginTop:'10px'}} />
                                                </div>
                                                </>
                                                }
                                            </div>
                                        </Col>
                                        <Col width="100" tabletWidth="50">
                                            <Card style={{background:'rgba(0, 0, 0, 0.2)', margin:'4px', minHeight:'512px'}}>
                                                <CardContent style={{padding:'16px',background:'transparent', color:'white', textAlign:'center'}}>
                                                    <img src="./static/icons/11399.png" style={{width:'60%', marginTop:'5%'}} />
                                                    <br/>
                                                    <div style={{marginTop:'32px', fontSize:'20px'}}>
                                                        Gunakan aplikasi <b>Illo Retail Integrated System</b> untuk meningkatkan pengalaman berbelanja dan menggunakan produk Illo!
                                                    </div>
                                                    <div style={{marginTop:'32px', fontSize:'12px'}}>
                                                        Illo Retail Integrated System adalah sistem terintegrasi tempat berkumpulnya agen, distributor, reseller, dan pelanggan illo dalam menikmati pengalaman menggunakan produk-produk illo
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Col>
                                        <Col width="100" tabletWidth="50">
                                            <Card style={{background:'rgba(0, 0, 0, 0.2)', margin:'4px', minHeight:'512px'}}>
                                                <CardContent style={{padding:'32px',background:'transparent', color:'white'}}>
                                            
                                                    <List form style={{minWidth:'100%'}} noHairlines noHairlinesBetweenIos>
                                                        <ListInput
                                                            type="text"
                                                            name="email"
                                                            placeholder="Email/No HP Anda ...."
                                                            label= 'Email/No HP'
                                                            noHairlines
                                                            className="inputLogin"
                                                            disabled={(this.state.loading ? true : false)}
                                                            value={this.state.routeParams.username}
                                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,username: e.target.value}})}
                                                        ></ListInput>
                                                        <ListInput
                                                            label= 'Password'
                                                            type="password"
                                                            noHairlines
                                                            name="password"
                                                            className="inputLogin"
                                                            disabled={(this.state.loading ? true : false)}
                                                            placeholder="Password Anda ...."
                                                            value={this.state.routeParams.password}
                                                            onInput={(e) => this.setState({routeParams:{...this.state.routeParams,password: e.target.value}})}
                                                        ></ListInput>
                                                    </List>
                                                    <br/>
                                                    <br/>
                                                    <List style={{padding:16, minWidth:'100%'}}>
                                                        <Button raised fill 
                                                            iconIos="f7:square_arrow_right" 
                                                            iconAurora="f7:square_arrow_right" 
                                                            iconMd="material:enter"  
                                                            title="Masuk" 
                                                            disabled={(this.state.loading ? true : false)}
                                                            // loginScreenClose 
                                                            // onClick={() => this.alertLoginData()}
                                                            onClick={this.doLogin}
                                                            style={{height:'40px', width:'100%', marginBottom:'8px', display:'inline-flex'}}
                                                            className="bawahCiriBiru cardBorder-20"
                                                        >
                                                            &nbsp;&nbsp;Masuk Aplikasi
                                                        </Button>
                                                        {/* <hr/> */}
                                                        <div style={{textAlign:'center', width:'100%', marginTop:'16px', marginBottom:'8px'}}>Belum punya akun?</div>
                                                        <br/>
                                                        <Button raised fill 
                                                            iconIos="f7:person_alt_circle" 
                                                            iconAurora="f7:person_alt_circle" 
                                                            iconMd="material:person_alt_circle"  
                                                            title="Daftar" 
                                                            disabled={(this.state.loading ? true : false)}
                                                            // loginScreenClose 
                                                            // onClick={() => this.alertLoginData()}
                                                            onClick={()=>this.$f7router.navigate("/daftar/"+(this.$f7route.params['param_1'] ? this.$f7route.params['param_1']+"/"+this.$f7route.params['param_2'] : ""))}
                                                            style={{height:'40px', width:'100%', background:'#7CB342', display:'inline-flex'}}
                                                            className="bawahCiriHijau cardBorder-20"
                                                        >
                                                            &nbsp;&nbsp;Daftar
                                                        </Button>
                                                        <div style={{textAlign:'center', width:'100%', marginTop:'16px', marginBottom:'8px', fontSize:'13px'}}>Atau</div>
                                                        {localStorage.getItem('device') === 'web' &&
                                                        <GoogleLogin
                                                            className="bawahCiri googleLogin"   
                                                            clientId={localStorage.getItem('google_api')}
                                                            buttonText="Daftar/Masuk dengan Google"
                                                            onSuccess={this.responseGoogle}
                                                            onFailure={this.responseGoogle}
                                                            cookiePolicy={'single_host_origin'}
                                                            style={{textAlign:'center', width:'100%', borderRadius:'20px'}}
                                                        />
                                                        }
                                                        {localStorage.getItem('device') === 'android' &&
                                                        <Button raised fill 
                                                            onClick={this.bukaGoogleLogin}
                                                            className="bawahCiriBiru cardBorder-20 loginGoogle"
                                                        >
                                                            <i className="icons f7-icons logoGoogle">logo_google</i>&nbsp;
                                                            Daftar/Masuk dengan Google
                                                        </Button>
                                                        }
                                                    </List>
                                                </CardContent>
                                            </Card>
                                        </Col>
                                    </Row>

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
                        <Col width="0" tabletWidth="0" desktopWidth="15"></Col>
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

export default (connect(mapStateToProps, mapDispatchToProps)(login));
  