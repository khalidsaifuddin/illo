import React, {Component} from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class BentukSmartSelect extends Component {
    state = {
        error: null,
        loading: true,
    }

    componentDidMount = () => {
        this.setState({
            ...this.state,
            loading: false
        });
    }

    change = () => {
        console.log('tes');
    }

    render()
    {
        return (
            <select onChange={this.change} name="bentuk_pendidikan_id" defaultValue={localStorage.getItem('jenjang_aplikasi')}>
                {localStorage.getItem('jenjang_aplikasi').includes('-') && <option value="5-6-13-15-29">Semua</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('5') && <option value="5">SD</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('6') && <option value="6">SMP</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('5-6') && <option value="5-6">SD/SMP</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('13') && <option value="13">SMA</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('15') && <option value="15">SMK</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('13-15') && <option value="13-15">SMA/SMK</option>}
                {localStorage.getItem('jenjang_aplikasi').includes('29') && <option value="29">SLB</option>}
            </select>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      setTabActive: Actions.setTabActive
    }, dispatch);
}

function mapStateToProps({ App, PesertaDidik, Gtk, RaporDapodik }) {

    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        sekolah: App.sekolah
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(BentukSmartSelect));