import * as Actions from '../actions';

const initialState = {
    rekap_sekolah_ringkasan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_total: {
        rows: [{
            bentuk_pendidikan_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_ringkasan_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_waktu_penyelenggaraan: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_waktu_penyelenggaraan_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_kurikulum: {
        rows: [{
            kode_wilayah: '---',
            nama: '---'
        }],
        total: 0
    },
    rekap_sekolah_kurikulum_sp: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    }
};


const RekapSekolahReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REKAP_SEKOLAH_RINGKASAN:
        {
            return {
                ...state,
                rekap_sekolah_ringkasan: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_RINGKASAN_SP:
        {
            return {
                ...state,
                rekap_sekolah_ringkasan_sp: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN:
        {
            return {
                ...state,
                rekap_sekolah_waktu_penyelenggaraan: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN_SP:
        {
            return {
                ...state,
                rekap_sekolah_waktu_penyelenggaraan_sp: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_KURIKULUM:
        {
            return {
                ...state,
                rekap_sekolah_kurikulum: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_KURIKULUM_SP:
        {
            return {
                ...state,
                rekap_sekolah_kurikulum_sp: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_AKREDITASI:
        {
            return {
                ...state,
                rekap_sekolah_akreditasi: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_AKREDITASI_SP:
        {
            return {
                ...state,
                rekap_sekolah_akreditasi_sp: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_TOTAL:
        {
            return {
                ...state,
                rekap_sekolah_total: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RekapSekolahReducer;