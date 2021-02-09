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
    Subnavbar
} from 'framework7-react';

// import ReactDOM from "react-dom";
import Pagination from "react-js-pagination";

import { Doughnut, Bar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as L1 from 'leaflet.markercluster';

// import 'framework7-icons';

class Transisi extends Component {
    state = {
        error: null,
        loading: true
    }

    componentDidMount = () => {
        // console.log(this.$f7route.params['url']);
        
        setTimeout(() => {
            let url = this.$f7route.params['url'];
            url = url.split("-");
    
            let urlStr = '/';
    
            for (let index = 0; index < url.length; index++) {
                const element = url[index];
    
                urlStr += element + "/";
            }

            console.log(urlStr);
            
            this.$f7router.navigate(urlStr.substring(0,(urlStr.length-1)));
        }, 500);

        // console.log(urlStr);

    }

    render()
    {
        const position = [this.state.lat, this.state.lng];

        return (
            <Page name="Peta" hideBarsOnScroll>
                <Navbar sliding={false} onBackClick={this.backClick}>
                    <NavTitle>Memuat ...</NavTitle>
                </Navbar>
                <Row noGap>
                    <Col width="100" style={{padding:'8px'}}>
                        Memuat ...
                    </Col>
                </Row>
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
      getRekapSekolah: Actions.getRekapSekolah,
      getSekolahIndividu: Actions.getSekolahIndividu,
      getRaporDapodikWilayah: Actions.getRaporDapodikWilayah,
      setRaporDapodikWilayah: Actions.setRaporDapodikWilayah,
      getWilayah: Actions.getWilayah,
      getRaporDapodikSekolah: Actions.getRaporDapodikSekolah,
      getGeoJsonBasic: Actions.getGeoJsonBasic
    }, dispatch);
}

function mapStateToProps({ App, PesertaDidik, Gtk, RaporDapodik }) {

    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        sekolah: App.sekolah,
        rekap_sekolah: App.rekap_sekolah,
        sekolah_individu: App.sekolah_individu,
        rapor_dapodik_wilayah: RaporDapodik.rapor_dapodik_wilayah,
        rapor_dapodik_sekolah: RaporDapodik.rapor_dapodik_sekolah,
        wilayah: App.wilayah,
        dummy_rows: App.dummy_rows,
        geojson_basic: App.geojson_basic
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(Transisi));