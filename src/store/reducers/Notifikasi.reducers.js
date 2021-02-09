import * as Actions from '../actions';

const initialState = {
    notifikasi: {
        rows: [],
        total: 0
    },
    notifikasi_belum_dibaca: {
        rows: [],
        total: 0
    },
    linimasa: {
        rows: [],
        total: 0
    },
    pengikut:[],
    simpan_notifikasi: {}
};

const NotifikasiReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SIMPAN_NOTIFIKASI:
        {
            return {
                ...state,
                simpan_notifikasi: action.payload
            };
        }
        case Actions.GET_NOTIFIKASI:
        {
            return {
                ...state,
                notifikasi: action.payload
            };
        }
        case Actions.GET_NOTIFIKASI_REDIS:
        {
            return {
                ...state,
                notifikasi: action.payload
            };
        }
        case Actions.GET_NOTIFIKASI_REDIS_BELUM_DIBACA:
        {
            return {
                ...state,
                notifikasi_belum_dibaca: action.payload
            };
        }
        case Actions.GET_LINIMASA:
        {
            return {
                ...state,
                linimasa: action.payload
            };
        }
        case Actions.GET_PENGIKUT:
        {
            return {
                ...state,
                pengikut: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default NotifikasiReducer;