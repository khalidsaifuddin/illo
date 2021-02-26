import * as Actions from '../actions';
import React, {Component} from 'react';

const initialState = {
    foo: 'bar',
    anggota_mitra: [{
        rows: [],
        total: 0
    }]
};

const MitraReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_ANGGOTA_MITRA:
        {
            return {
                ...state,
                anggota_mitra: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default MitraReducer;