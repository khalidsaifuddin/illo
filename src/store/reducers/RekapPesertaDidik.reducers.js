import * as Actions from '../actions';

const initialState = {
    rekap_peserta_didik_ringkasan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_ringkasan_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_nisn: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_nisn_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_tingkat: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_tingkat_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_agama: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_peserta_didik_agama_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    }
};


const RekapPesertaDidikReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REKAP_PESERTA_DIDIK_RINGKASAN:
        {
            return {
                ...state,
                rekap_peserta_didik_ringkasan: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_RINGKASAN_SP:
        {
            return {
                ...state,
                rekap_peserta_didik_ringkasan_sp: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_NISN:
        {
            return {
                ...state,
                rekap_peserta_didik_nisn: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_NISN_SP:
        {
            return {
                ...state,
                rekap_peserta_didik_nisn_sp: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_TINGKAT:
        {
            return {
                ...state,
                rekap_peserta_didik_tingkat: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_TINGKAT_SP:
        {
            return {
                ...state,
                rekap_peserta_didik_tingkat_sp: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_AGAMA:
        {
            return {
                ...state,
                rekap_peserta_didik_agama: action.payload
            };
        }
        case Actions.GET_REKAP_PESERTA_DIDIK_AGAMA_SP:
        {
            return {
                ...state,
                rekap_peserta_didik_agama_sp: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RekapPesertaDidikReducer;