import * as Actions from '../actions';

const initialState = {
    pesan_belum_dibaca: {
        total: 0,
        rows: []
    },
    daftar_pesan: {
        total: 0,
        rows: []
    }
};

const PesanReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.PESAN_BELUM_DIBACA:
        {
            return {
                ...state,
                pesan_belum_dibaca: action.payload
            };
        }
        case Actions.GET_DAFTAR_PESAN:
        {
            return {
                ...state,
                daftar_pesan: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default PesanReducer;