import React, {Component} from 'react';
import {
    Page,
    Navbar,
    NavTitle,
    NavTitleLarge,
    List,
    ListInput,
    ListItem,
    ListItemContent,
    Block,
    Button,
    CardHeader,
    Row,
    Col,
    Card,
    CardContent,
    CardFooter,
    Link,
    NavRight,
    Subnavbar,
    BlockTitle,
    Searchbar,
    Segmented,
    Tabs,
    Tab,
    Chip,
    Icon,
    Popover,
    Progressbar,
    Popup
} from 'framework7-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

import io from 'socket.io-client';
import moment from 'moment';

import localForage from 'localforage';

class FormPenjualan extends Component {
    state = {
        error: null,
        loadingKuis: false,
        loadingPengguna: false,
        routeParams: {
            start:0,
            limit:20,
            jumlah: 1,
            transaksi_id: this.$f7route.params['transaksi_id'] ? this.$f7route.params['transaksi_id'] : null,
            pengguna_id: this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : null
        },
        transaksi: {
            rows: [],
            total: 0
        },
        produk: {
            rows: [],
            total: 0
        },
        produk_transaksi: {
            rows: [],
            total: 0
        },
        metode_pembayaran: {
            rows: [],
            total: 0
        },
        transaksi_record: {},
        popupOpen: false,
        hideYangLain: false
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
    
    bulan_singkat = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Ags',
        'Sep',
        'Okt',
        'Nov',
        'Des'
    ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        // this.props.getTransaksi({...this.state.routeParams}).then((result)=>{
        //     this.setState({
        //         transaksi: result.payload,
        //         transaksi_record: result.payload.total > 0 ? result.payload.rows[0] : {}
        //     })
        // })
        if(this.state.routeParams.transaksi_id){

            this.props.getTransaksi(this.state.routeParams).then((result)=>{

                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        ...result.payload.rows[0]
                    }
                },()=>{

                    this.props.getProdukTransaksi(this.state.routeParams).then((result)=>{
            
                        this.setState({
                            produk_transaksi: result.payload
                        },()=>{
                            
                            this.props.getRef({nama_tabel:'metode_pembayaran'}).then((result)=>{
                                this.setState({
                                    metode_pembayaran: result.payload
                                })
                            })
                        
                        })
            
            
                    })

                })

            })

        }else{

            this.props.getRef({nama_tabel:'metode_pembayaran'}).then((result)=>{
                this.setState({
                    metode_pembayaran: result.payload
                })
            })

        }



    }

    setValue = (type) => (e) => {

        console.log(e.currentTarget.value)
        console.log(type)

        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [type]: e.currentTarget.value
            }        
        },()=>{
            console.log(this.state.routeParams)

            if(type === 'metode_pembayaran_id'){
                if(this.state.routeParams.metode_pembayaran_id === 1){
                    this.setState({
                        hideYangLain: true
                    })
                }
            }

            return true
        })
    }

    tambahProduk = () => {
        // alert('tes')
        this.setState({
            popupOpen: true
        },()=>{
            this.props.getProduk(this.state.routeParams).then((result)=>{
                this.setState({
                    produk: result.payload
                })
            })
        })
    }

    cariProduk = () => {

    }

    ketikCari = (e) => {
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                keyword: e.currentTarget.value
            }
        })
    }

    pilihProduk = (option) => {
        this.$f7.dialog.preloader()
        // alert(this.state.routeParams.jumlah)

        // this.props.getAnggotaMitra(this.state.routeParams)
        // return true

        if(!this.state.routeParams.transaksi_id){

            console.log('tidak ada transaksi')

            this.props.simpanTransaksi({
                ...this.state.routeParams, 
                produk_id: option.produk_id
            }).then((result)=>{
    
                this.setState({
                    routeParams: {
                        ...this.state.routeParams,
                        transaksi_id: result.payload.transaksi_id
                    }
                },()=>{
    
                    this.props.simpanProdukTransaksi({
                        ...this.state.routeParams,
                        produk_id: option.produk_id,
                        harga_final: (option.harga_produk.length > 0 ? option.harga_produk[0].nominal : 0), 
                        pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        mitra_id: '7efe511c-4c9a-4fd3-baa3-893e7093b372'
                        // transaksi_id: result.payload.transaksi_id
                    }).then((resultProduk)=>{

                        // console.log('tes')
                        
                        this.setState({
                            popupOpen: false
                        },()=>{

                            if(resultProduk.payload.sukses){
                                //berhasil
                                console.log('sukses')

                                this.$f7.dialog.close()

                                if(!this.$f7route.params['transaksi_id']){
                                    console.log('tidak ada transaksi')

                                    this.$f7router.navigate('/FormPenjualan/'+this.state.routeParams.pengguna_id+'/'+this.state.routeParams.transaksi_id)
                                }else{
                                    console.log('ada transaksi')
                                }
            
                            }else{
                                //gagal
                                this.$f7.dialog.close()
                                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
                            }
        
                        })

                    }).catch(()=>{
                        
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
                        
                    })
    
                })
    
            }).catch(()=>{
                
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')

            })

        }else{

            console.log('ada transaksi')

            this.props.simpanProdukTransaksi({
                ...this.state.routeParams,
                produk_id: option.produk_id,
                harga_final: (option.harga_produk.length > 0 ? option.harga_produk[0].nominal : 0), 
                pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                mitra_id: '7efe511c-4c9a-4fd3-baa3-893e7093b372'
                // transaksi_id: result.payload.transaksi_id
            }).then((resultProduk)=>{
                
                this.setState({
                    popupOpen: false
                },()=>{

                    if(resultProduk.payload.sukses){
                        //berhasil
                        
                        this.props.getProdukTransaksi({transaksi_id: this.state.routeParams.transaksi_id}).then((resultProdukTransaksi)=>{
                            this.setState({
                                produk_transaksi: resultProdukTransaksi.payload
                            })
                        })

                        this.$f7.dialog.close()
                        
                    }else{
                        
                        //gagal
                        this.$f7.dialog.close()
                        this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
                    }

                })


            }).catch(()=>{
                
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
                // this.setState({
                //     popupOpen: false
                // })
            })

        }

    }

    hapusProduk = (option) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus produk ini?', 'Konfirmasi', ()=>{
            
            this.$f7.dialog.preloader()

            this.props.simpanProdukTransaksi({
                produk_id: option.produk_id,
                transaksi_id: option.transaksi_id,
                jumlah: 0,
                soft_delete: 1
            }).then((resultProduk)=>{
                
                if(resultProduk.payload.sukses){
                    //berhasil
                    this.$f7.dialog.close()

                    this.props.getProdukTransaksi(this.state.routeParams).then((result)=>{
            
                        this.setState({
                            produk_transaksi: result.payload
                        })
            
                    })

                }else{
                    //gagal

                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
                }

            }).catch(()=>{
                
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')

            })

        })
    }

    simpanTransaksi = () => {
        // alert('tes')
        this.$f7.dialog.preloader()

        this.props.simpanTransaksi({
            ...this.state.routeParams,
            mitra_id: '7efe511c-4c9a-4fd3-baa3-893e7093b372',
            status_pembayaran_id: 1,
            status_konfirmasi_id: 1,
            status_pengiriman_id: 1,
            status_diterima_id: 1,
            status_selesai_id: 1,
            manual: 1
        }).then((result)=>{
            
            if(result.payload.sukses){
                this.$f7.dialog.close()
                this.$f7router.navigate('/Penjualan/')
            }else{
                this.$f7.dialog.close()
                this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
            }
        }).catch(()=>{
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Ada kesalahan teknis. Silakan coba kembali dalam beberapa saat ke depan', 'Gagal')
        })
    }
    
    render()
    {
        return (
            <Page name="FormPenjualan" className="halamanJenisTiket" hideBarsOnScroll style={{marginBottom:'100px', boxSizing:'content-box'}}>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>Tambah Penjualan</NavTitle>
                </Navbar>

                <Popup opened={this.state.popupOpen} className="demo-popup-swipe-handler popupLebar" swipeToClose swipeHandler=".swipe-handler" onPopupClosed={()=>this.setState({popupOpen:false})}>
                    <Page>
                        <Navbar className="swipe-handler" title={"Tambah Produk"}>
                            <NavRight>
                                <Link style={{color:'white'}} popupClose>Tutup</Link>
                            </NavRight>
                        </Navbar>
                        <Searchbar
                            className="searchbar-demo"
                            // expandable
                            backdrop={false}
                            placeholder="Cari Produk..."
                            // searchContainer=".search-list"
                            searchIn=".item-title"
                            onSubmit={this.cariProduk}
                            customSearch={true}
                            onChange={this.ketikCari}
                            value={this.state.routeParams.keyword}
                        ></Searchbar>
                        <Block strong style={{marginTop:'0px'}}>
                            {this.state.produk.rows.map((option)=>{
                                return (
                                    <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                        <CardContent style={{display:'inline-flex'}}>
                                            <div style={{
                                                height:'75px', 
                                                minWidth:'75px', 
                                                backgroundColor:'#434343',
                                                backgroundImage: 'url('+localStorage.getItem('api_base_gambar')+''+(option.gambar_produk.length > 0 ? option.gambar_produk[0].nama_file : '')+')',
                                                // backgroundImage: 'url('+localStorage.getItem('api_base')+''+option.gambar_produk+')',
                                                backgroundSize:'contain',
                                                backgroundRepeat:'no-repeat',
                                                backgroundPosition:'center'
                                            }}>
                                                &nbsp;
                                            </div>
                                            <div style={{paddingLeft:'8px', minWidth:'73%'}}>
                                                <h3 className="title" style={{marginTop:'0px', marginBottom:'8px', fontSize:'15px'}}>
                                                    {option.nama}
                                                </h3>
                                                <span style={{marginTop:'4px', fontSize:'18px'}}>
                                                    Rp {this.formatAngka(option.harga_produk.length > 0 ? option.harga_produk[0].nominal : 0)}
                                                </span>
                                                {/* <div style={{display:'inline-flex'}}> */}
                                                    {/* <List>
                                                        <ListInput
                                                            // label="Ongkos Kirim (Rp)"
                                                            type="number"
                                                            placeholder="Jumlah"
                                                            clearButton
                                                            value={this.state.routeParams.jumlah}
                                                            onChange={this.setValue('ongkos_kirim')}
                                                        />
                                                    </List>
                                                    <Button raised fill style={{display:'inline-flex'}}>
                                                        Pilih Produk
                                                    </Button> */}
                                                {/* </div> */}
                                            </div>
                                            <div style={{textAlign:'right'}}>
                                                <List style={{marginTop:'-8px', marginRight:'-8px'}}>
                                                    <ListInput
                                                        label="Jumlah"
                                                        type="number"
                                                        placeholder="Jumlah"
                                                        // clearButton
                                                        // outline
                                                        value={this.state.routeParams.jumlah}
                                                        onChange={this.setValue('jumlah')}
                                                    />
                                                </List>
                                                <Button raised fill style={{display:'inline-flex'}} onClick={()=>this.pilihProduk(option)}>
                                                    Pilih Produk
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </Block>
                    </Page>
                </Popup>
                
                <Row noGap>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
                    <Col width="100" tabletWidth="100" desktopWidth="100">
                        
                        <Card>
                            <CardContent>
                                <BlockTitle style={{marginBottom:'16px', fontWeight:'bold', marginTop:'8px', marginLeft:'0px'}}>
                                    Daftar Produk
                                </BlockTitle>
                                {this.state.produk_transaksi.total < 1 && <div>Belum ada produk yang ditambahkan</div>}
                                {this.state.produk_transaksi.total > 0 && 
                                <div>
                                    {this.state.produk_transaksi.rows.map((option)=>{
                                        return (
                                            <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                                <CardContent style={{display:'inline-flex'}}>
                                                    <div style={{
                                                        height:'75px', 
                                                        minWidth:'75px', 
                                                        backgroundColor:'#434343',
                                                        backgroundImage: 'url('+localStorage.getItem('api_base_gambar')+''+(option.gambar_produk)+')',
                                                        backgroundSize:'contain',
                                                        backgroundRepeat:'no-repeat',
                                                        backgroundPosition:'center',
                                                        borderRadius:'20px'
                                                    }}>
                                                        &nbsp;
                                                    </div>
                                                    <div style={{paddingLeft:'8px', minWidth:'100%'}}>
                                                        <h3 className="title" style={{marginTop:'0px', marginBottom:'0px', fontSize:'15px'}}>
                                                            {option.nama}
                                                        </h3>
                                                        <span style={{marginTop:'0px', fontSize:'13px'}}>
                                                            Rp {this.formatAngka(option.harga_final)}
                                                        </span>
                                                        <div>
                                                            Jumlah: {option.jumlah}
                                                        </div>
                                                    </div>
                                                    <div style={{textAlign:'right', minWidth:'40%'}}>
                                                        Total:<br/>
                                                        <div style={{fontSize:'18px', fontWeight:'bold'}}>
                                                            Rp {this.formatAngka(option.harga_final*option.jumlah)}
                                                        </div>
                                                        <div>
                                                            <Link onClick={()=>this.hapusProduk(option)}>Hapus</Link>
                                                        </div>
                                                        {/* <List style={{marginTop:'-8px', marginRight:'-8px'}}>
                                                            <ListInput
                                                                label="Jumlah"
                                                                type="number"
                                                                placeholder="Jumlah"
                                                                value={this.state.routeParams.jumlah}
                                                                onChange={this.setValue('jumlah')}
                                                            />
                                                        </List> */}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                                }
                                <Button raised fill style={{display:'inline-flex', marginTop:'8px'}} onClick={this.tambahProduk}>
                                    <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                    Tambah Produk
                                </Button>
                            </CardContent>
                        </Card>
                        <Card style={{marginBottom:'50px'}}>
                            <CardContent>
                                <BlockTitle style={{marginBottom:'32px', fontWeight:'bold', marginTop:'8px', marginLeft:'0px'}}>
                                    Rincian Transaksi
                                </BlockTitle>
                                <List noHairlinesBetweenIos>
                                    <ListInput
                                        label="Metode Pembayaran"
                                        type="select"
                                        defaultValue={"0"}
                                        placeholder="Pilih Metode Pembayaran..."
                                        onChange={this.setValue('metode_pembayaran_id')}
                                    >
                                        <option value={null} selected={this.state.routeParams.metode_pembayaran_id ? false : true}>-</option>
                                        {this.state.metode_pembayaran.rows.map((option)=>{
                                            return (
                                                <option value={option.metode_pembayaran_id}>{option.nama}</option>
                                            )
                                        })}
                                    </ListInput>
                                    <ListInput
                                        label="Bank Pengirim"
                                        type="text"
                                        placeholder="Bank Pengirim"
                                        clearButton
                                        style={{display: 'block'}}
                                        value={this.state.routeParams.bank_pengirim}
                                        onChange={this.setValue('bank_pengirim')}
                                    />   
                                    <ListInput
                                        label="Nama Rekening Pengirim"
                                        type="text"
                                        placeholder="Nama Rekening Pengirim"
                                        clearButton
                                        style={{display: 'block'}}
                                        value={this.state.routeParams.nama_rekening_pengirim}
                                        onChange={this.setValue('nama_rekening_pengirim')}
                                    />
                                    <ListInput
                                        label="No Rekening Pengirim"
                                        type="text"
                                        placeholder="No Rekening Pengirim"
                                        clearButton
                                        style={{display: 'block'}}
                                        value={this.state.routeParams.no_rekening_pengirim}
                                        onChange={this.setValue('no_rekening_pengirim')}
                                    />
                                    <ListInput
                                        label="Tanggal Transaksi"
                                        type="date"
                                        placeholder="Tanggal Transaksi"
                                        clearButton
                                        style={{display: 'block'}}
                                        value={this.state.routeParams.tanggal_transaksi}
                                        onChange={this.setValue('tanggal_transaksi')}
                                    />
                                    <ListInput
                                        label="Ongkos Kirim (Rp)"
                                        type="number"
                                        placeholder="Ongkos Kirim (Rp)"
                                        clearButton
                                        style={{display: 'block'}}
                                        value={this.state.routeParams.ongkos_kirim}
                                        onChange={this.setValue('ongkos_kirim')}
                                    />
                                </List>
                                <Button raised fill style={{display:'inline-flex', marginTop:'32px'}} onClick={this.simpanTransaksi}>
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan Transaksi
                                </Button>
                            </CardContent>
                        </Card>
                    
                    </Col>
                    <Col width="0" tabletWidth="0" desktopWidth="0"></Col>
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
      getTransaksi: Actions.getTransaksi,
      simpanVerifikasi: Actions.simpanVerifikasi,
      getRef: Actions.getRef,
      getProduk: Actions.getProduk,
      simpanTransaksi: Actions.simpanTransaksi,
      simpanProdukTransaksi: Actions.simpanProdukTransaksi,
      getAnggotaMitra: Actions.getAnggotaMitra,
      getProdukTransaksi: Actions.getProdukTransaksi,
      hapusProdukTransaksi: Actions.hapusProdukTransaksi
    }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(FormPenjualan));
  