import * as Actions from '../actions';

const initialState = {
    rekap_gtk_ringkasan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_gtk_ringkasan_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_gtk_agama: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_gtk_agama_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    }
};


const RekapGTKReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REKAP_GTK_RINGKASAN:
        {
            return {
                ...state,
                rekap_gtk_ringkasan: action.payload
            };
        }
        case Actions.GET_REKAP_GTK_RINGKASAN_SP:
        {
            return {
                ...state,
                rekap_gtk_ringkasan_sp: action.payload
            };
        }
        case Actions.GET_REKAP_GTK_AGAMA:
        {
            return {
                ...state,
                rekap_gtk_agama: action.payload
            };
        }
        case Actions.GET_REKAP_GTK_AGAMA_SP:
        {
            return {
                ...state,
                rekap_gtk_agama_sp: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RekapGTKReducer;