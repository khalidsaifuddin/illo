import React, {Component} from 'react';
import {
  App,
  Panel,
  Views,
  View,
  Statusbar,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  List,
  ListItem,
  Badge,
  Icon,
  AccordionItem,
  AccordionContent} from 'framework7-react';
import LoginPage from '../pages/login';
// import {Provider} from 'react-redux';
// import store from 'store';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

import cordovaApp from '../js/cordova-app';
import routes from '../js/routes';

import io from 'socket.io-client';

import 'framework7-icons';

import localForage from 'localforage';

class app extends Component {
  state = {
    // Framework7 Parameters
    f7params: {
      id: 'io.timkayu.diskuis', // App bundle ID
      name: 'Diskuis', // App name
      theme: 'ios', // Automatic theme detection
      // App root data
      data: function () {
        return {
          user: {
            firstName: 'Khalid',
            lastName: 'Saifuddin',
          },

        };
      },

      // App routes
      routes: routes,
      // Enable panel left visibility breakpoint
      panel: {
        leftBreakpoint: 960,
      },

      // Register service worker
      serviceWorker: this.$device.cordova ? {} : {
        path: '/service-worker.js',
      },
      // Input settings
      input: {
        scrollIntoViewOnFocus: this.$device.cordova && !this.$device.electron,
        scrollIntoViewCentered: this.$device.cordova && !this.$device.electron,
      },
      // Cordova Statusbar settings
      statusbar: {
        overlay: this.$device.cordova && this.$device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },
    },
    tabBar:{
      beranda: true,
      kategori: false,
      cari: false,
      materi: false,
      profil: false
    },
    // Login screen demo data
    username: '',
    password: '',
  };

    // this.onClickLinkTab = this.onClickLinkTab.bind(this);
    // this.onClickMenu = this.onClickMenu.bind(this);
  
  onClickLinkTab = (menu) => {
    // console.log(event);
    
    for (var property in this.props.tabBar) {
      // console.log(this.state.tabBar[property]);
      this.props.tabBar[property] = false;
    }
    
    this.props.tabBar[menu] = true;
    
    // console.log(this.props.tabBar);

    this.props.setTabActive(this.props.tabBar);
    // console.log(this.props.tabBar);

    // this.setState({
    //   ...this.state,
    //   tabBar: this.props.tabBar
    // });
  }

  onClickMenu(){
    console.log(this.props);
    // alert(menu);
  }

  componentDidMount = () => {
    
    // console.log('tes mantab')
    this.$f7ready((f7) => {

      // Init cordova APIs (see cordova-app.js)
      if (f7.device.cordova) {
        cordovaApp.init(f7)  
        // console.log(localStorage.getItem('device'));
        // console.log(parseInt(localStorage.getItem('sudah_login')));
      }

      // alert('tes mantab')

      
      if(parseInt(localStorage.getItem('sudah_login')) === 1){
        
        let socket = io(localStorage.getItem('socket_url'),{transports: ['websocket'], upgrade: false})
        socket.on('updateNotifikasi', (pengguna_id) => {
          
          if(JSON.parse(localStorage.getItem('user')).pengguna_id === pengguna_id){
  
            this.props.getNotifikasiRedisBelumDibaca({
              pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
              tipe: 'belum_dibaca'
            }).then((result)=>{
  
              document.title = '(' + result.payload.total + ') Diskuis - Pendidikan Digital'
  
              this.setState({
                notifikasi: result.payload
              })
            })
  
          }
  
        })
        
        socket.on('adaPesanBaru', (pengguna_id, kelompok_pesan_id) => {

          
          if(pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id){
            
            console.log('ada yang pengen chat nih: '+pengguna_id+' - '+kelompok_pesan_id)

            socket.emit('masukPesanBaru', pengguna_id, kelompok_pesan_id, (err) => {
                if (err) {
                    //gagal
                }
            })

            // this.props.getDaftarPesan({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
            //   this.props.daftar_pesan.rows.map((option)=>{
            //     socket.emit('tampilPesan', null, option.kelompok_pesan_id, JSON.parse(localStorage.getItem('user')), (err) => {
            //         if (err) {
            //             //gagal
            //         }
            //     })
            //   })
            // })

          }
          
          // if(pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id){
          //   this.props.getDaftarPesan({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          //     this.props.daftar_pesan.rows.map((option)=>{
          //       socket.emit('tampilPesan', null, option.kelompok_pesan_id, JSON.parse(localStorage.getItem('user')), (err) => {
          //           if (err) {
          //               //gagal
          //           }
          //       })
          //     })
          //   })
          // }

        })

        socket.on('updatePesan', (pengguna_id) => {
        
          this.props.getDaftarPesan({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
              // this.setState({
              //     daftar_pesan: result.payload
              // })
          })
  
        })

        this.props.getDaftarPesan({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          this.props.daftar_pesan.rows.map((option)=>{
            socket.emit('tampilPesan', null, option.kelompok_pesan_id, JSON.parse(localStorage.getItem('user')), (err) => {
                if (err) {
                    //gagal
                }
            })
          })
        })



      }
      // Call F7 APIs here
      if(parseInt(localStorage.getItem('sudah_login')) === 1){

        this.props.getAnggotaUnit({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          if(result.payload.total > 0){
            //ada
            localStorage.setItem('unit_layanan', JSON.stringify(result.payload))
          }else{
            //tidak ada
            localStorage.setItem('unit_layanan', '')
          }
        })
        
        this.props.getAnggotaMitra({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          if(result.payload.total > 0){
            //ada
            localStorage.setItem('mitra', JSON.stringify(result.payload))
          }else{
            //tidak ada
            localStorage.setItem('mitra', '')
          }
        })

      }


    })

    // console.log(this);
    // console.log(this);
    // this.$f7route.navigate(localStorage.getItem('initial_route'));

    // let socket = io(localStorage.getItem('socket_url'));
    // let params = {};

    // // console.log(localStorage.getItem('device'));
    // // console.log(parseInt(localStorage.getItem('sudah_login')));

    // // if(parseInt(localStorage.getItem('sudah_login')) === 1){
    // //   console.log(this.$f7router);
    // // }

    // // console.log(params);
    // socket.emit('online', params, function (err) {
    //   if (err) {
    //       this.props.history.push('/');
    //   }
    // });
    
    // let socket = io(localStorage.getItem('socket_url'));

    // socket.on('updateNotifikasi', (users) => {
    //   this.props.getNotifikasiRedisBelumDibaca({
    //     pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
    //     tipe: 'belum_dibaca'
    //   }).then((result)=>{
    //     this.setState({
    //       notifikasi: result.payload
    //     })
    //   })
    // })
    
  }

  gantiSemester = (b) => {
    localStorage.setItem('semester_id_aplikasi', b.target.value);
    console.log(localStorage.getItem('semester_id_aplikasi'));
  }

  keluar = () =>{
    // this.$f7.dialog.alert('oke');
    localStorage.setItem('sudah_login', '0');
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    localStorage.setItem('sekolah_id_beranda', '');
    localStorage.setItem('custom_logo_sekolah', '');
    // localStorage.setItem('google_api', null);

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  render() {
    // console.log(this.props.tabBar.beranda);
    // const {classes} = this.props;
    
    // console.log(classes);

    return (
      <App params={ this.state.f7params } hideToolbarOnScroll>
      {/* <Provider store={store}> */}
        {/* Status bar overlay for fullscreen mode*/}
        <Statusbar></Statusbar>

        {/* Left panel with cover effect when hidden */}
        {parseInt(localStorage.getItem('sudah_login')) === 1 &&
        <Panel left cover>
        {/* <Panel left cover themeDark> */}
          <View>
            <Page>
              {localStorage.getItem('custom_logo_sekolah') === null &&
              <div className="navbarLogoUtama">
                <img src={"./static/icons/illo-logo.png"}  style={{height:'50px', margin:'auto', marginTop:'10px'}} />
              </div>
              }
              {localStorage.getItem('custom_logo_sekolah') === '' &&
              <div className="navbarLogoUtama">
                <img src={"./static/icons/illo-logo.png"}  style={{height:'50px', margin:'auto', marginTop:'10px'}} />
              </div>
              }
              {localStorage.getItem('custom_logo_sekolah') !== '' && localStorage.getItem('custom_logo_sekolah') !== null &&
              <>
              <div className="navbarLogoUtama" style={{display:'inline-flex', marginLeft:'10%'}}>
                <img src={localStorage.getItem('api_base')+localStorage.getItem('custom_logo_sekolah')}  style={{height:'40px', margin:'auto', marginTop:'10px'}} />
                &nbsp;<span style={{textAlign:'left', marginTop:'10px', fontSize:'15px', fontWeight:'bold', marginLeft:'8px'}}>{localStorage.getItem('custom_logo_sekolah_nama')}</span>
              </div>
              <div style={{marginTop:'15px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px', display:'inline-flex', paddingLeft:'20%', marginTop:'-10px'}}>
                <span style={{marginTop:'12px', marginRight:'8px'}}>powered by</span>
                <img src={"./static/icons/illo-logo.png"}  style={{height:'15px', margin:'auto', marginTop:'10px'}} />
              </div>
              </>
              }
              <div style={{textAlign:'center', fontSize:'11px'}}>
                versi {localStorage.getItem('versi')}
              </div>
              {/* <Navbar className="navbarLogoUtama"> */}
              {/* </Navbar> */}
              {/* <Navbar title={localStorage.getItem('judul_aplikasi')}/> */}
              

              {/* {localStorage.getItem('sekolah_id_beranda') !== '' && localStorage.getItem('sekolah_id_beranda') !== null && */}
              {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
              <BlockTitle>Menu</BlockTitle>
              }
              {/* } */}
              {/* {localStorage.getItem('sekolah_id_beranda') === '' && localStorage.getItem('sekolah_id_beranda') === null &&
              <BlockTitle>Menu Guru</BlockTitle>
              } */}
              {localStorage.getItem('kode_aplikasi') !== 'MEJA-EMPU' &&
              <List noHairlinesBetween className="menuUtama">
                
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) &&
                <ListItem noChevron link="/" view=".view-main" panelClose panel-close title="Beranda">
                  {/* <Icon slot="media" ios="f7:rocket"></Icon> */}
                  <i slot="media" className="f7-icons">rocket</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) &&
                <ListItem noChevron link="/CariProduk" view=".view-main" panelClose panel-close title="Cari Produk">
                  <i slot="media" className="f7-icons">search</i>
                </ListItem>
                }
                {(localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') && (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) &&
                <ListItem noChevron link="/TampilKategoriProduk" view=".view-main" panelClose panel-close title="Kategori Produk">
                  <i slot="media" className="f7-icons">circle_grid_hex_fill</i>
                </ListItem>
                }
                {
                (localStorage.getItem('user') !== null && 
                localStorage.getItem('user') !== '') && 
                (
                  localStorage.getItem('sekolah_id_beranda') === '' || 
                  localStorage.getItem('sekolah_id_beranda') === null
                ) &&
                parseInt(JSON.parse(localStorage.getItem('user')).a_admin) ===  1 &&
                <ListItem view=".view-main" accordionItem title="Data Master">
                  <i slot="media" className="f7-icons">cube_box</i>
                  <AccordionContent>
                    <ListItem noChevron link="/DataMaster/" view=".view-main" panelClose panel-close title="Semua" className="itemSub">
                      <i slot="media" className="f7-icons">cube_box</i>
                    </ListItem>
                    <ListItem noChevron link="/KategoriProduk/" view=".view-main" panelClose panel-close title="Kategori Produk" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/Produk/" view=".view-main" panelClose panel-close title="Produk" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/Pengguna/" view=".view-main" panelClose panel-close title="Pengguna" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/Mitra/" view=".view-main" panelClose panel-close title="Mitra" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/UnitPenjualan/" view=".view-main" panelClose panel-close title="Unit Penjualan" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/Unit/" view=".view-main" panelClose panel-close title="Unit Dukungan" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                    <ListItem noChevron link="/JenisTiket/" view=".view-main" panelClose panel-close title="Jenis Tiket" className="itemSub">
                      <i slot="media" className="f7-icons">doc_text</i>
                    </ListItem>
                  </AccordionContent>
                </ListItem>
                }
                {
                (
                  localStorage.getItem('user') !== null && 
                  localStorage.getItem('user') !== ''
                ) && 
                (
                  localStorage.getItem('sekolah_id_beranda') === '' || 
                  localStorage.getItem('sekolah_id_beranda') === null
                ) &&
                <ListItem view=".view-main" accordionItem title="Transaksi">
                  <i slot="media" className="f7-icons">money_dollar_circle</i>
                  <AccordionContent>
                    <ListItem noChevron link="/Penjualan/" view=".view-main" panelClose panel-close title="Penjualan" className="itemSub">
                      <i slot="media" className="f7-icons">tray_arrow_up</i>
                    </ListItem>
                    <ListItem noChevron link="/Pembelian/" view=".view-main" panelClose panel-close title="Pembelian" className="itemSub">
                      <i slot="media" className="f7-icons">tray_arrow_down</i>
                    </ListItem>
                  </AccordionContent>
                </ListItem>
                // <ListItem noChevron link="/Penjualan/" view=".view-main" panelClose panel-close title="Transaksi">
                //   <i slot="media" className="f7-icons">money_dollar_circle</i>
                // </ListItem>
                }
                {localStorage.getItem('unit_layanan') === '' &&
                <ListItem noChevron link="/DaftarTiket/" view=".view-main" panelClose panel-close title="Tiket dan Dukungan">
                  <i slot="media" className="f7-icons">smallcircle_fill_circle_fill</i>
                </ListItem>
                }
                {(((localStorage.getItem('unit_layanan') && localStorage.getItem('unit_layanan') !== '') && parseInt(JSON.parse(localStorage.getItem('unit_layanan')).total) > 0) || parseInt(JSON.parse(localStorage.getItem('user')).a_admin) === 1) &&
                <ListItem noChevron link="/KelolaTiket/" view=".view-main" panelClose panel-close title="Kelola Tiket">
                  <i slot="media" className="f7-icons">smallcircle_fill_circle</i>
                </ListItem>
                }
                {/* <ListItem noChevron link="/JenisTiket/" view=".view-main" panelClose panel-close title="Jenis Tiket" className="itemSub">
                  <i slot="media" className="f7-icons">doc_text</i>
                </ListItem> */}
              </List>
              }
              
              {localStorage.getItem('sudah_login') === '0' && 
              <List>
                <ListItem link="/login" view=".view-main" panelClose panel-close title="Login/Masuk">
                  <i slot="media" className="f7-icons">square_arrow_right</i>
                </ListItem>
              </List>
              }
              
              {localStorage.getItem('sudah_login') === '1' && 
              <>
              <List noHairlinesBetween className="menuUtama">
                  {/* <ListItem noChevron link="/Pricing" view=".view-main" panelClose panel-close title="Berlangganan">
                    <i slot="media" className="f7-icons">money_dollar_circle_fill</i>
                  </ListItem> */}
                  <ListItem noChevron link="/ProfilPengguna" view=".view-main" panelClose panel-close title="Profil Pengguna">
                    <i slot="media" className="f7-icons">person_crop_square_fill</i>
                  </ListItem>
                  <ListItem noChevron link="/Notifikasi" view=".view-main" panelClose panel-close title="Notifikasi">
                    {this.props.notifikasi_belum_dibaca.total > 0 &&
                    <div slot="after" className="badgeNotif">{this.props.notifikasi_belum_dibaca.total}</div>
                    }
                    {this.props.notifikasi_belum_dibaca.total < 1 &&
                    <div slot="after" className="badgeNotifKosong">0</div>
                    }
                    <i slot="media" className="f7-icons">bell_fill</i>
                  </ListItem>
                  <ListItem noChevron link="/Pesan" view=".view-main" panelClose panel-close title="Pesan">
                    {this.props.daftar_pesan.belum_dibaca > 0 &&
                    <div slot="after" className="badgeNotif">{this.props.daftar_pesan.belum_dibaca}</div>
                    }
                    {this.props.daftar_pesan.belum_dibaca < 1 &&
                    <div slot="after" className="badgeNotifKosong">0</div>
                    }
                    <i slot="media" className="f7-icons">chat_bubble_2_fill</i>
                  </ListItem>
                  {/* <ListItem noChevron link="/pengaturanPengguna" view=".view-main" panelClose panel-close title="Pengaturan Pengguna">
                    <i slot="media" className="f7-icons">gear_alt_fill</i>
                  </ListItem> */}                  
              </List>
              <List style={{marginTop:'0px'}}>
                  <ListItem noChevron onClick={this.keluar} panelClose panel-close title="Keluar" style={{background:'#470128', color:'white', cursor: 'pointer'}}>
                      <i slot="media" className="f7-icons">square_arrow_left</i>
                  </ListItem>
              </List>
              </>
              }
            </Page>
          </View>
        </Panel>
        }


        {/* Right panel with reveal effect*/}
        <Panel right cover themeDark style={{width:'280px'}}>
            <View>
                <Page>
                    <Navbar title={this.props.judul_panel_kanan}/>
                    <Block style={{paddingLeft:'0px', paddingRight:'0px'}}>
                      {this.props.isi_panel_kanan}
                    </Block>
                </Page>
            </View>
        </Panel>


        {/* Your main view, should have "view-main" class */}
        {/* <View main className="safe-areas" url="/" /> */}

        {/* Views/Tabs container */}
        
        <Views tabs className="safe-areas" hideToolbarOnScroll>
          {/* Tabbar for switching views-tabs */}
          {localStorage.getItem('sudah_login') === '1' &&
          <Toolbar labels bottom className="mobileTab" hideToolbarOnScroll>
            {localStorage.getItem('sudah_login') === '1' &&
            <>
            <Link 
              href="/" 
              // onClick={()=>{this.onClickLinkTab('beranda')}} 
              tabLinkActive={this.props.tabBar.beranda} 
              iconIos="f7:rocket" 
              iconAurora="f7:rocket" 
              iconMd="f7:rocket" 
              text="Beranda" 
              className="fontMobileTab"
              style={{fontSize:'10px'}} 
            />
            </>
            }
            {localStorage.getItem('kode_aplikasi') !== 'SPM' &&
            <>
            {localStorage.getItem('sudah_login') === '0' &&
              <Link 
                href="/login" 
                // onClick={()=>{this.onClickLinkTab('beranda')}} 
                tabLinkActive={this.props.tabBar.beranda} 
                iconIos="f7:square_arrow_right" 
                iconAurora="f7:square_arrow_right" 
                iconMd="material:square_arrow_right" 
                text="Login" 
                style={{fontSize:'10px'}} 
              />
            }
            </>
            }
            
            {/* color:'#962C1F' */}
            <Link href="/notifikasi" style={{marginLeft:'0px', fontSize:'10px', fontWeight:'bold', color:'#F27121'}}> 
              <Icon className="f7-icons" ios={this.props.notifikasi_belum_dibaca.total > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.props.notifikasi_belum_dibaca.total > 0 ? "f7:bell_fill" : "f7:bell"} md={this.props.notifikasi_belum_dibaca.total > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                {this.props.notifikasi_belum_dibaca.total > 0 && <Badge style={{color:'white', width:'20px', height:'20px'}} color="red">{this.props.notifikasi_belum_dibaca.total}</Badge>}
              </Icon>
              Notifikasi
            </Link>
            <Link 
              // className="f7-icons"
              iconIos="f7:ellipsis_vertical_circle" 
              iconAurora="f7:ellipsis_vertical_circle" 
              iconMd="material:ellipsis_vertical_circle" 
              text="More"
              panelOpen="left" 
              // loginScreenOpen="#my-login-screen" 
              style={{fontSize:'10px'}}
            />
            {/* <Link link="/" view=".view-main" tabLinkActive iconIos="f7:home_fil" iconAurora="f7:home_fil" iconMd="material:home" text="Home" />
            <Link link="/catalog/" view=".view-main" iconIos="f7:list_fill" iconAurora="f7:list_fill" iconMd="material:view_list" text="Catalog" />
            <Link link="/form/" view=".view-main" iconIos="f7:settings_fill" iconAurora="f7:settings_fill" iconMd="material:settings" text="About" /> */}
          </Toolbar>
          }

          {/* Your main view/tab, should have "view-main" class. It also has "tabActive" prop */}
          <View id="view-beranda" main tab tabActive url="/" pushState={localStorage.getItem('device') === 'android' ? false : true} />

          {/* Catalog View */}
          {/* <View id="view-kategori" name="kategori" tab url="/kategori/" /> */}

          {/* Settings View */}
          {/* <View id="view-cari" name="cari" tab url="/cari/" /> */}

          {/* Settings View */}
          {/* <View id="view-settings" name="About" tab url="/settings/" /> */}

        </Views>

        {/* loading screen */}
        


        {/* Popup */}
        <Popup id="my-popup">
          <View>
            <Page>
              <Navbar title="Popup">
                <NavRight>
                  <Link popupClose>Close</Link>
                </NavRight>
              </Navbar>
              <Block>
                <p>Popup content goes here.</p>
              </Block>
            </Page>
          </View>
        </Popup>

        <LoginScreen id="my-login-screen">
          <LoginPage/>
          {/* <View>
            <Page loginScreen>
              <LoginScreenTitle>Masuk Aplikasi</LoginScreenTitle>
              <List form>
                <ListInput
                  type="text"
                  name="username"
                  placeholder="Your username"
                  value={this.state.username}
                  onInput={(e) => this.setState({username: e.target.value})}
                ></ListInput>
                <ListInput
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={this.state.password}
                  onInput={(e) => this.setState({password: e.target.value})}
                ></ListInput>
              </List>
              <List>
                <ListButton title="Sign In" loginScreenClose onClick={() => this.alertLoginData()} />
                <BlockFooter>
                  Some text about login information.<br />Click "Sign In" to close Login Screen
                </BlockFooter>
              </List>
            </Page>
          </View> */}
        </LoginScreen>
      {/* </Provider> */}
      </App>
    )
  }
  alertLoginData() {
    this.$f7.dialog.alert('Username: ' + this.state.username + '<br>Password: ' + this.state.password);
  }
  componentDidMount() {
    // console.log(this.props);
    // this.$f7.preloader.show();
    // this.$f7.dialog.preloader();
    setTimeout(() => {
      // this.$f7.preloader.hide();
      // this.$f7.dialog.close();

    }, 3000);

    // this.$f7ready((f7) => {
    //   // Init cordova APIs (see cordova-app.js)
    //   if (f7.device.cordova) {
    //     cordovaApp.init(f7);
        
    //     // console.log(localStorage.getItem('device'));
    //     // console.log(parseInt(localStorage.getItem('sudah_login')));
    //   }

    //   alert('tes mantab')

    //   let socket = io(localStorage.getItem('socket_url'))
    //   socket.on('updateNotifikasi', (users) => {
    //     this.props.getNotifikasiRedisBelumDibaca({
    //       pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, 
    //       tipe: 'belum_dibaca'
    //     }).then((result)=>{
    //       this.setState({
    //         notifikasi: result.payload
    //       })
    //     })
    //   })
    //   // Call F7 APIs here


    // })
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getNotifikasi: Actions.getNotifikasi,
    getNotifikasiRedisBelumDibaca: Actions.getNotifikasiRedisBelumDibaca,
    getDaftarPesan: Actions.getDaftarPesan,
    getAnggotaUnit: Actions.getAnggotaUnit,
    getAnggotaMitra: Actions.getAnggotaMitra
  }, dispatch);
}

function mapStateToProps({ App, Notifikasi, Pesan }) {
  // console.log(App.tabBar);

  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      judul_panel_kanan: App.judul_panel_kanan,
      isi_panel_kanan: App.isi_panel_kanan,
      notifikasi_belum_dibaca: Notifikasi.notifikasi_belum_dibaca,
      pesan_belum_dibaca: Pesan.pesan_belum_dibaca,
      daftar_pesan: Pesan.daftar_pesan
  }
}

export default (connect(mapStateToProps, mapDispatchToProps)(app));