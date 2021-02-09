import * as Actions from '../actions';

const initialState = {
    rekap_sarpras_ringkasan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sarpras_ringkasan_sp: {
        rows: [{
            sarpras_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sarpras_tingkat_kerusakan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sarpras_tingkat_kerusakan_sp: {
        rows: [{
            sarpras_id: '---',
            nama: '---'
        }],
        total: 0
    }
};


const RekapSarprasReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REKAP_SARPRAS_RINGKASAN:
        {
            return {
                ...state,
                rekap_sarpras_ringkasan: action.payload
            };
        }
        case Actions.GET_REKAP_SARPRAS_RINGKASAN_SP:
        {
            return {
                ...state,
                rekap_sarpras_ringkasan_sp: action.payload
            };
        }
        case Actions.GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN:
        {
            return {
                ...state,
                rekap_sarpras_tingkat_kerusakan: action.payload
            };
        }
        case Actions.GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN_SP:
        {
            return {
                ...state,
                rekap_sarpras_tingkat_kerusakan_sp: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RekapSarprasReducer;