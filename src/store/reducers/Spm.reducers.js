import * as Actions from '../actions';
import React, {Component} from 'react';

const initialState = {
    foo: 'bar',
    spm_kabupaten: [{
        persen: 0,
        tanggal_rekap_terakhir: '-'
    }],
    spm_kabupaten_per_kecamatan: [{
        persen: 0,
        tanggal_rekap_terakhir: '-'
    }],
    spm_kabupaten_per_sekolah: [{
        persen: 0,
        tanggal_rekap_terakhir: '-'
    }]
};

const SpmReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_SPM_KABUPATEN:
        {
            return {
                ...state,
                spm_kabupaten: action.payload
            };
        }
        case Actions.GET_SPM_KABUPATEN_PER_KECAMATAN:
        {
            return {
                ...state,
                spm_kabupaten_per_kecamatan: action.payload
            };
        }
        case Actions.GET_SPM_KABUPATEN_PER_SEKOLAH:
        {
            return {
                ...state,
                spm_kabupaten_per_sekolah: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default SpmReducer;