import * as Actions from '../actions';

const initialState = {
    simpan_ruang: {
        sukses  : false,
        rows: []
    },
    ruang: {
        rows: [],
        total: 0
    },
    pengguna_ruang: {
        rows: [],
        total: 0
    },
    ruang_diikuti: {
        rows: [],
        total: 0
    }
};

const RuangReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SIMPAN_RUANG:
        {
            return {
                ...state,
                simpan_ruang: action.payload
            };
        }
        case Actions.GET_RUANG:
        {
            return {
                ...state,
                ruang: action.payload
            };
        }
        case Actions.GET_PENGGUNA_RUANG:
        {
            return {
                ...state,
                pengguna_ruang: action.payload
            };
        }
        case Actions.GET_RUANG_DIIKUTI:
        {
            return {
                ...state,
                ruang_diikuti: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RuangReducer;