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
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    Icon,
    MenuItem,
    MenuDropdown,
    MenuDropdownItem,
    Tabs,
    Tab,
    Segmented,
    ListInput,
    Progressbar,
    ListItemContent
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import Dropzone from 'react-dropzone';

class ProfilPengguna extends Component {
    state = {
        error: null,
        loading: true,
        show: {
            provinsi: 'block',
            kabupaten: 'none'
        },
        pengguna: {
            rows: [{
                pengguna_id: '---'
            }],
            total: 0
        },
        data: {},
        // routeParams:{
        //     data: {}
        // },
        set_password: false,
        set_peran_id: false,
        file_gambar_ktp: '',
        file_gambar_sk: '',
        gambar_ktp: '',
        gambar_sk: ''
    }

    componentDidMount = () => {
        this.setState({
            data: {},
            routeParams:{
                // data: {},
                pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : JSON.parse( localStorage.getItem('user') ).pengguna_id,
                id_level_wilayah: 1
            }
        },()=>{
            this.props.getPengguna(this.state.routeParams).then((result)=>{
                // console.log(this.props.pengguna);
                this.setState({
                    ...this.state,
                    loading: false,
                    pengguna:  this.props.pengguna,
                    set_password: (this.props.pengguna.rows[0].password === null ? false : true),
                    set_peran_id: (this.props.pengguna.rows[0].peran_id === null ? false : true)
                });
            },()=>{
                console.log(this.state.pengguna);
            });

            this.props.getProvinsi(this.state.routeParams).then((result)=>{
                // this.setState({
                //     loading: false,
                //     show: {
                //         ...this.state.show,
                //         kecamatan: 'block',
                //         kabupaten: 'block',
                //         provinsi: 'block'
                //     }
                // });
            });
        });
    }

    gantiTab = (kode) => {
        
    }

    setValue = (kolom) => (e) => {
        // console.log(e.target.value);
        // console.log(kolom);
        if(!this.$f7route.params['pengguna_id']){
            
            this.setState({
                ...this.state,
                pengguna:{
                    ...this.state.pengguna,
                    rows: [{
                        ...this.state.pengguna.rows[0],
                        [kolom]: e.target.value
                    }]
                },
                data:{
                    ...this.state.data,
                    [kolom]: e.target.value
                }
            },()=>{
                console.log(this.state);
            });
        }
    }

    cancelConfirm = () => {
        alert('nggak jadi');
    }

    simpanPengguna = () => {
        console.log(this.state.data);

        // if((this.state.data.password && this.state.data.password_ulang) && this.state.data.password !== this.state.data.password_ulang){
        //     this.$f7.dialog.alert('Password ulang tidak sama!', 'Peringatan');
        //     return true;
        // }

        // if(this.state.data.password_ulang){
        //     this.state.data.password_ulang = null;
        // }

        // if(parseInt(this.props.pengguna.rows[0].verified) === 0){
        //     if(this.state.gambar_ktp === '' && this.state.gambar_sk === ''){
        //         this.$f7.dialog.alert('Mohon lengkapi upload berkas verifikasi sebelum melanjutkan!', 'Peringatan');
        //         return true;
        //     }
        // }

        if(typeof(this.state.data.peran_id) !== 'undefined'){

            this.$f7.dialog.confirm('Pastikan peran dan wilayah Anda telah sesuai. Isian Anda tidak akan bisa diubah setelah tersimpan', 'Perhatian', () => {
                // app.dialog.alert('Great!');
                this.setState({
                    loading: true,
                    routeParams:{
                        ...this.state.routeParams,
                        pengguna_id: this.state.pengguna.rows[0].pengguna_id,
                        data: this.state.data
                    }
                },()=>{
                    this.props.setPengguna(this.state.routeParams).then((result)=>{
                        this.setState({
                            loading:false
                        },()=>{
                            // console.log(result.payload.status);
        
                            if(result.payload.status === 'berhasil'){
                                this.$f7.dialog.alert('Perubahan berhasil disimpan!', 'Berhasil');
                                let sp = false;
                                let spi = false;

                                if(this.state.data.password){
                                    sp = true;
                                }

                                if(this.state.data.peran_id && this.state.data.kode_wilayah){
                                    spi = true;
                                }

                                this.setState({
                                    ...this.state,
                                    set_password: sp,
                                    set_peran_id: spi
                                });

                            }else{
                                this.$f7.dialog.alert('Perubahan gagal disimpan! Silakan coba beberapa saat lagi', 'Gagal');
                            }
        
                        })
                    })
                });
            });
        }else{
            this.setState({
                loading: true,
                routeParams:{
                    ...this.state.routeParams,
                    pengguna_id: this.state.pengguna.rows[0].pengguna_id,
                    data: this.state.data
                }
            },()=>{
                this.props.setPengguna(this.state.routeParams).then((result)=>{
                    this.setState({
                        loading:false
                    },()=>{
                        // console.log(result.payload.status);
    
                        if(result.payload.status === 'berhasil'){
                            this.$f7.dialog.alert('Perubahan berhasil disimpan!', 'Berhasil');
                        }else{
                            this.$f7.dialog.alert('Perubahan gagal disimpan! Silakan coba beberapa saat lagi', 'Gagal');
                        }
    
                    })
                })
            });
        }

        // console.log(this.state.data);
    }

    gantiPeran = (b) => {
        // localStorage.setItem('semester_id_aplikasi', b.target.value);

        // alert(b.target.value);return true;

        let tampilKab = 'block';

        if(parseInt(b.target.value) === 6){
            tampilKab = 'none';
        }else if(parseInt(b.target.value) === 54){
            tampilKab = 'none';
        }else if(parseInt(b.target.value) === 8){
            tampilKab = 'block';
        }else if(parseInt(b.target.value) === 1){
            tampilKab = 'none';
        }

        this.setState({
            ...this.state,
            show:{
                ...this.state.show,
                kabupaten: tampilKab
            },
            pengguna:{
                ...this.state.pengguna,
                rows: [{
                    ...this.state.pengguna.rows[0],
                    peran_id: b.target.value
                }]
            },
            data:{
                ...this.state.data,
                peran_id: b.target.value
            }
        },()=>{
            //after this
        });

        // this.setState({
        //     ...this.state,
        //     pengguna:{
        //         ...this.state.pengguna,
        //         rows: [{
        //             ...this.state.pengguna.rows[0],
        //             [kolom]: e.target.value
        //         }]
        //     },
        //     data:{
        //         ...this.state.data,
        //         [kolom]: e.target.value
        //     }
        // });

    }

    setParamValue = (b) => {
        this.setState({
            ...this.state,
            routeParams: {
                ...this.state.routeParams,
                params_wilayah: b.target.getAttribute('name'),
                [b.target.getAttribute('name')]: b.target.value
            },
            pengguna:{
                ...this.state.pengguna,
                rows: [{
                    ...this.state.pengguna.rows[0],
                    kode_wilayah: b.target.value.trim()
                }]
            },
            data:{
                ...this.state.data,
                kode_wilayah: b.target.value.trim()
            }
        },()=>{
            console.log(this.state);
            
            if(this.state.routeParams.params_wilayah === 'propinsi'){
                this.setState({
                    ...this.state,
                    routeParams: {
                        // ...this.state.routeParams,
                        id_level_wilayah: 2,
                        mst_kode_wilayah: this.state.routeParams.propinsi.trim()
                    }
                },()=>{
                    this.props.getKabupaten(this.state.routeParams).then((result)=>{
                        console.log(this.state);
                    });
                });
            }
        });
    }

    uploadBerhasil = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_ktp: response.filename,
                loading: false
            });
        }
    }
    
    uploadBerhasilSk = (xhr) => {
        console.log(JSON.parse(xhr.currentTarget.responseText));
        let response = JSON.parse(xhr.currentTarget.responseText);
        if(response.msg == 'sukses'){
            this.setState({
                file_gambar_sk: response.filename,
                loading: false
            });
        }
    }

    uploadGagal = (xhr) => {
        this.$f7.dialog.alert('Ada kesalahan pada sistema atau jaringan Anda, mohon cek kembali sebelum melakukan upload ulang', 'Mohon maaf');
    }

    acceptedFile = (file) => {
        // console.log(file[0]);

        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){

            this.setState({
                gambar_ktp: file[0].name,
                // loading: true,
                data:{
                    ...this.state.data,
                    verified: 10
                }
            },()=>{
                //uploading
                // const formData = new FormData();

                // formData.append('avatar',file[0]);
                console.log(localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                return new Promise(
                    (resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                        xhr.onload = this.uploadBerhasil;
                        xhr.onerror = this.uploadGagal;
                        const data = new FormData();
                        data.append('image', file[0]);
                        data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                        data.append('jenis', 'gambar_ktp');
                        xhr.send(data);
                    }
                );
            });

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
            return true;
        }

    }

    acceptedFileSk = (file) => {
        if(file[0].size >= 1000000){ //2Mb
            this.$f7.dialog.alert('Ukuran gambar tidak boleh melebihi 1MB!', 'Peringatan');
            return true;
        }

        if(file[0].name.substr(file[0].name.length - 3) === 'jpg' || file[0].name.substr(file[0].name.length - 4) === 'jpeg' || file[0].name.substr(file[0].name.length - 3) === 'png'){

            this.setState({
                gambar_sk: file[0].name,
                // loading: true,
                data:{
                    ...this.state.data,
                    verified: 10
                }
            },()=>{
                //uploading
                // const formData = new FormData();

                // formData.append('avatar',file[0]);
                console.log(localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                return new Promise(
                    (resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', localStorage.getItem('api_base') + '/api/Otentikasi/upload');
                        xhr.onload = this.uploadBerhasilSk;
                        xhr.onerror = this.uploadGagal;
                        const data = new FormData();
                        data.append('image', file[0]);
                        data.append('pengguna_id', JSON.parse(localStorage.getItem('user')).pengguna_id);
                        data.append('jenis', 'gambar_sk');
                        xhr.send(data);
                    }
                );
            });

        }else{
            this.$f7.dialog.alert('Hanya dapat mengupload file gambar dengan format .jpg atau .png!', 'Peringatan');
            return true;
        }
    }

    render()
    {
        // console.log(this.state.pengguna.rows[0].peran_id);
        return (
            <Page name="ProfilPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.pengguna.rows[0].nama}</NavTitle>
                    {/* <NavTitleLarge>
                        Profil Pengguna
                    </NavTitleLarge> */}
                </Navbar>
                {this.state.loading &&
                <Progressbar style={{height:'10px'}} infinite color="multi"></Progressbar>
                }
                {/* {parseInt(this.state.pengguna.rows[0].verified) === 0 && !this.$f7route.params['pengguna_id'] &&
                <>
                <Card
                style={{background:'#b71c1c', color:'white'}}
                content="Akun Anda belum terverifikasi. Untuk melakukan verifikasi akun, silakan lengkapi identitas Anda, dan tunggu hingga Administrator selesai memverifikasi Anda"
                ></Card>
                </>
                } */}
                {/* {parseInt(this.state.pengguna.rows[0].verified) === 10 && !this.$f7route.params['pengguna_id'] &&
                <>
                <Card
                style={{background:'#B9A43F', color:'white'}}
                content="Akun Anda sedang dalam proses verifikasi oleh Administator"
                ></Card>
                </>
                } */}
                {/* <Segmented raised style={{marginLeft:'8px', marginRight:'8px', marginTop: '8px', marginBottom: '8px'}}>
                    <Button tabLink="#tab-1" tabLinkActive>Identitas</Button>
                    <Button tabLink="#tab-2">Peran</Button>
                    {!this.$f7route.params['pengguna_id'] && <Button tabLink="#tab-3">Keamanan</Button>}
                    {!this.$f7route.params['pengguna_id'] && <Button tabLink="#tab-4">Verifikasi</Button>}
                </Segmented> */}
                <Row>
                    {/* <Col width="100" tabletWidth="100" style={{padding:'8px'}}>
                        {parseInt(this.state.pengguna.rows[0].verified) === 1 &&
                        <p style={{fontStyle:'italic'}}>Akun terverifikasi</p>
                        }
                    </Col> */}
                    {/* {!this.$f7route.params['pengguna_id'] && 
                    <Col width="100" tabletWidth="20" style={{padding:'8px', marginTop:'0px'}}>
                        <Button disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                    </Col>
                    } */}
                </Row>
                <Tabs animated style={{height:'initial'}}>
                    <Tab id="tab-1" className="page-content" tabActive style={{padding:'0px', overflow:'hidden'}}>
                        <>
                        <img style={{marginTop:'8px', marginLeft:'8px', height:'100px', borderRadius:'50%'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                        <Block strong style={{marginTop:'0px', marginBottom:'0px'}}>
                            <h1 style={{marginBottom:'0px'}}>{this.state.pengguna.rows[0].nama}</h1>
                            <span style={{marginTop:'-10px'}}>{this.state.pengguna.rows[0].username}</span>
                        </Block>
                        <List inlineLabels noHairlinesMd style={{marginBottom:'0px',marginTop:'0px'}}>
                            {/* <ListItem>
                                <ListItemContent>
                                    {parseInt(this.state.pengguna.rows[0].verified) === 1 &&
                                    <>
                                    <i className="f7-icons" style={{color:'green'}}>checkmark_shield</i>&nbsp;<span style={{fontStyle:'italic', color:'green'}}>Akun terverifikasi</span>
                                    </>
                                    }
                                    {parseInt(this.state.pengguna.rows[0].verified) === 10 &&
                                    <>
                                    <i className="f7-icons" style={{color:'#F48112'}}>shield_lefthalf_fill</i>&nbsp;<span style={{fontStyle:'italic', color:'#F48112'}}>Akun dalam proses verifikasi</span>
                                    </>
                                    }
                                    {parseInt(this.state.pengguna.rows[0].verified) === 0 &&
                                    <>
                                    <i className="f7-icons" style={{color:'red'}}>shield</i>&nbsp;<span style={{fontStyle:'italic', color:'red'}}>Akun belum terverifikasi</span>
                                    </>
                                    }
                                </ListItemContent>
                            </ListItem> */}
                            {/* <ListInput
                                label="Username"
                                type="text"
                                placeholder="Username"
                                clearButton
                                value={this.state.pengguna.rows[0].username}
                                // onChange={this.setValue('username')}
                            >
                                <i slot="media" className="f7-icons">person_alt</i>
                            </ListInput> */}
                            {/* <ListInput
                                label="Nama"
                                type="text"
                                placeholder="Nama"
                                clearButton
                                value={this.state.pengguna.rows[0].nama}
                                onChange={this.setValue('nama')}
                            >
                                <i slot="media" className="f7-icons">doc_person_fill</i>
                            </ListInput> */}
                            <ListInput
                                label="Alamat Rumah"
                                type="text"
                                placeholder="Alamat Rumah"
                                clearButton
                                value={this.state.pengguna.rows[0].alamat}
                                onChange={this.setValue('alamat')}
                            >
                                <i slot="media" className="f7-icons">house_alt_fill</i>
                            </ListInput>
                            <ListInput
                                label="Instansi/Sekolah"
                                type="text"
                                placeholder="Instansi/Sekolah"
                                clearButton
                                value={this.state.pengguna.rows[0].jabatan_lembaga}
                                onChange={this.setValue('jabatan_lembaga')}
                            >
                                <i slot="media" className="f7-icons">building_2_fill</i>
                            </ListInput>
                        </List>
                        <List inlineLabels noHairlinesMd>
                            <ListInput
                                label="Nomor HP"
                                type="text"
                                placeholder="Nomor HP"
                                clearButton
                                value={this.state.pengguna.rows[0].no_hp}
                                onChange={this.setValue('no_hp')}
                            >
                                <i slot="media" className="f7-icons">phone_circle_fill</i>
                            </ListInput>
                            <ListInput
                                label="Email"
                                type="text"
                                placeholder="Email"
                                clearButton
                                value={this.state.pengguna.rows[0].no_telepon}
                                onChange={this.setValue('no_telepon')}
                            >
                                <i slot="media" className="f7-icons">envelope_fill</i>
                            </ListInput>
                            <ListInput
                                label="Akun Twitter"
                                type="text"
                                placeholder="Twitter"
                                clearButton
                                value={this.state.pengguna.rows[0].ym}
                                onChange={this.setValue('ym')}
                            >
                                <i slot="media" className="f7-icons">logo_twitter</i>
                            </ListInput>
                            <ListInput
                                label="Akun Instagram"
                                type="text"
                                placeholder="Instagram"
                                clearButton
                                value={this.state.pengguna.rows[0].skype}
                                onChange={this.setValue('skype')}
                            >
                                <i slot="media" className="f7-icons">logo_instagram</i>
                            </ListInput>
                        </List>
                        <List>
                            <ListInput
                                label="Akun Google"
                                type="text"
                                placeholder="Akun Google"
                                clearButton
                                value={this.state.pengguna.rows[0].akun_google}
                                onChange={this.setValue('skype')}
                            >
                                <i slot="media" className="f7-icons">logo_google</i>
                            </ListInput>
                        </List>
                        {/* <Row>
                            <Col width="100" tabletWidth="20" style={{padding:'8px'}}>
                                <Button disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                            </Col>
                        </Row> */}
                        </>
                    </Tab>
                    <Tab id="tab-2" className="page-content" style={{padding:'0px', overflow:'hidden'}}>
                        {this.state.set_peran_id === false &&
                        <List style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                            <ListItem
                            title="Peran"
                            smartSelect
                            >
                                {/* {typeof(this.state.pengguna.rows[0].peran_id) === 'undefined' || this.state.pengguna.rows[0].peran_id === '' && */}
                                <select onChange={this.gantiPeran} name="peran_id" defaultValue={"-"}>
                                    <option value={"-"} disabled>Pilih Peran</option>
                                    <option value={"1"}>Administrator</option>
                                    <option value={"54"}>Operator LPMP</option>
                                    <option value={"6"}>Operator Disdik Provinsi</option>
                                    <option value={"8"}>Operator Disdik Kabupaten/Kota</option>
                                </select>
                                {/* } */}

                                {/* {typeof(this.state.pengguna.rows[0].peran_id) !== 'undefined' &&
                                <>
                                {this.state.pengguna.rows[0].peran_id}
                                </>
                                } */}
                            </ListItem>
                            <ListItem
                                title="Provinsi"
                                smartSelect
                                style={{display:this.state.show.provinsi}}
                                smartSelectParams={{searchbar: true, searchbarPlaceholder: 'Cari Provinsi'}}
                            >
                                <select onChange={this.setParamValue} name="propinsi" defaultValue={"-"}>
                                    <option value="-" disabled>Pilih Provinsi</option>
                                    {parseInt(this.state.data.peran_id) === 1 && <option value="000000">Indonesia</option>}
                                    {this.props.provinsi.rows.map((option)=>{
                                        return(
                                            <option value={option.kode_wilayah}>{option.nama}</option>
                                        )
                                    })}
                                </select>
                            </ListItem>
                            <ListItem
                                title="Kabupaten"
                                smartSelect
                                style={{display:this.state.show.kabupaten}}
                                // style={{display:this.state.show.kabupaten}}
                                smartSelectParams={{searchbar: true, searchbarPlaceholder: 'Cari Kabupaten'}}
                            >
                                <select onChange={this.setParamValue} name="kabupaten" defaultValue={"-"}>
                                    <option value="-">Pilih Kabupaten</option>
                                    {this.props.kabupaten.rows.map((option)=>{
                                        return(
                                            <option value={option.kode_wilayah}>{option.nama}</option>
                                        )
                                    })}
                                </select>
                            </ListItem>
                        </List>
                        }
                        {this.state.set_peran_id !== false &&
                        <List inlineLabels noHairlinesMd style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                            <ListInput
                                label="Peran"
                                type="text"
                                placeholder="Peran"
                                clearButton
                                value={this.state.pengguna.rows[0].peran}
                                // onChange={this.setValue('peran')}
                            >
                            </ListInput>
                            <ListInput
                                label="Wilayah"
                                type="text"
                                placeholder="Wilayah"
                                clearButton
                                value={this.state.pengguna.rows[0].wilayah}
                                // onChange={this.setValue('peran')}
                            >
                            </ListInput>
                        </List>
                        }
                    </Tab>
                    <Tab id="tab-3" className="page-content" style={{padding:'0px', overflow:'hidden'}}>
                        {this.state.set_password === false &&
                        <Card
                        style={{background:'#b71c1c', color:'white'}}
                        content="Anda belum mengatur password  untuk akun Anda. Demi keamanan, silakan atur password terlebih dahulu"
                        ></Card>
                        }
                        <List noHairlinesMd style={{width:'100%',marginBottom:'0px',marginTop:'0px'}}>
                            <ListInput
                                label="Password Baru"
                                type="password"
                                placeholder="Password Baru"
                                clearButton
                                // value={this.state.pengguna.rows[0].peran}
                                onChange={this.setValue('password')}
                            >
                            </ListInput>
                            <ListInput
                                label="Ulangi Password Baru"
                                type="password"
                                placeholder="Ulangi Password Baru"
                                clearButton
                                // value={this.state.pengguna.rows[0].wilayah}
                                onChange={this.setValue('password_ulang')}
                            >
                            </ListInput>
                        </List>    
                    </Tab>
                    <Tab id="tab-4" className="page-content" style={{padding:'0px', overflow:'hidden'}}>
                        <Row noGap>
                        {parseInt(this.state.pengguna.rows[0].verified) === 1 &&
                            <>
                            <Col width={100} tabletWidth={100}>
                                {/* checkmark_shield_fill */}

                                <Card
                                style={{background:'#7DB53F', color:'white'}}
                                // content="Akun Anda telah terverifikasi!"
                                >
                                    <CardContent>
                                        <i className="f7-icons" style={{fontSize:'60px', color:'white'}}>checkmark_shield</i>
                                        <h4>Akun Anda telah terverifikasi!</h4>
                                    </CardContent>
                                </Card>
                            </Col>
                            </>
                            }
                            {parseInt(this.state.pengguna.rows[0].verified) === 10 &&
                            <>
                            <Col width={100} tabletWidth={100}>
                                <Card
                                style={{background:'#B9A43F', color:'white'}}
                                content="Terima kasih telah mengupload berkas verifikasi! Silakan menunggu hingga Administrator memverifikasi akun Anda"
                                ></Card>
                            </Col>
                            </>
                            }
                            {parseInt(this.state.pengguna.rows[0].verified) === 0 &&
                            <>
                            <Col width={100} tabletWidth={50}>
                                <BlockTitle>Upload Gambar KTP</BlockTitle>
                                <Card>
                                    <Dropzone className="droping" onDrop={this.acceptedFile}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_ktp !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                <input {...getInputProps()} />
                                                {this.state.file_gambar_ktp === '' &&
                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                }
                                                {this.state.file_gambar_ktp !== '' &&
                                                <>
                                                <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_ktp} />
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_ktp === '' &&
                                                <>
                                                <p>Tarik dan seret gambar KTP Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_ktp !== '' && this.state.file_gambar_ktp === '' &&
                                                <>
                                                <p style={{fontSize:'20px'}}>{this.state.gambar_ktp}</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                            </div>
                                        </section>
                                    )}
                                    </Dropzone>
                                </Card>
                            </Col>
                            <Col width={100} tabletWidth={50}>
                                <BlockTitle>Upload Gambar SK Pengangkatan</BlockTitle>
                                <Card>
                                    <Dropzone className="droping" onDrop={this.acceptedFileSk}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()} style={{height:'250px',border:'4px dashed #ccc', textAlign: 'center', paddingTop:(this.state.file_gambar_ktp !== '' ? '16px' : '10%'), paddingLeft:'16px', paddingRight:'16px'}}>
                                                <input {...getInputProps()} />
                                                {this.state.file_gambar_sk === '' &&
                                                <i slot="media" className="f7-icons" style={{fontSize:'60px', color:'#434343'}}>square_arrow_up</i>
                                                }
                                                {this.state.file_gambar_sk !== '' &&
                                                <>
                                                <img style={{height:'150px'}} src={localStorage.getItem('api_base')+this.state.file_gambar_sk} />
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_sk === '' &&
                                                <>
                                                <p>Tarik dan seret gambar KTP Anda ke sini, atau klik/Sentuh untuk cari gambar</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                                {this.state.gambar_sk !== '' && this.state.file_gambar_sk === '' &&
                                                <>
                                                <p style={{fontSize:'20px'}}>{this.state.gambar_sk}</p>
                                                <p style={{fontSize:'12px', fontStyle:'italic'}}>Klik/Sentuh kembali untuk mengganti gambar. Ukuran maksimal berkas adalah 1MB, dan hanya dalam format .jpg, atau .png</p>
                                                </>
                                                }
                                            </div>
                                        </section>
                                    )}
                                    </Dropzone>
                                </Card>
                            </Col>
                            </>
                            }
                        </Row>
                            {/* <input 
                            accept=".pdf, .doc, .docx, .xls, .xlsx, .png, .jpeg"
                            inputlabelprops={{
                                shrink: true
                            }}
                            name="berkas_pendukung"
                            style={{ display: 'none' }}
                            id="berkas_pendukung"
                            onChange={this.file_dokumen_pendukung}
                            multiple
                            type="file"
                            /> */}
                        {/* <br/> */}
                    </Tab>
                </Tabs>
                {!this.$f7route.params['pengguna_id'] && 
                <Row>
                    <Col width="100" tabletWidth="20" style={{padding:'8px', marginTop:'0px'}}>
                        <Button disabled={(this.state.loading ? true : false)} raised fill onClick={this.simpanPengguna}><i className="f7-icons" style={{fontSize:'17px'}}>floppy_disk</i>&nbsp;Simpan</Button>
                    </Col>
                </Row>
                }
            </Page>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      setTabActive: Actions.setTabActive,
      getSekolah: Actions.getSekolah,
      getWilayah: Actions.getWilayah,
      getPengguna: Actions.getPengguna,
      setPengguna: Actions.setPengguna,
      getWilayah: Actions.getWilayah,
      getProvinsi: Actions.getProvinsi,
      getKabupaten: Actions.getKabupaten,
      getKecamatan: Actions.getKecamatan,
    }, dispatch);
}

function mapStateToProps({ App, PesertaDidik, Gtk, RaporDapodik }) {

    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        wilayah: App.wilayah,
        dummy_rows: App.dummy_rows,
        pengguna: App.pengguna,
        wilayah: App.wilayah,
        provinsi: App.provinsi,
        kabupaten: App.kabupaten,
        kecamatan: App.kecamatan,
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProfilPengguna));