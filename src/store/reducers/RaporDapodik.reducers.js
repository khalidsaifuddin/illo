import * as Actions from '../actions';

const initialState = {
    rapor_dapodik_wilayah: {
        rows: [{
            kode_wilayah: '---',
            nama: '---',
            rapor_akhir: 0
        }],
        total: 0
    },
    rapor_dapodik_sekolah: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rapor_dapodik_pd: {
        rows: [{
            peserta_didik_id: '---',
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rapor_dapodik_ptk: {
        rows: [{
            ptk_id: '---',
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rapor_dapodik_rombel: {
        rows: [{
            rombongan_belajar_id: '---',
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rapor_dapodik_sarpras: {
        rows: [{
            id_ruang: '---',
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    rapor_dapodik_identitas: {
        rows: [{
            sekolah_id: '---',
            nama: '---'
        }],
        total: 0
    },
    ref_rapor_dapodik: {
        rows: [{
            rapor_dapodik_id: '---',
            nama: '---',
            keterangan: '---'
        }],
        total: 0
    },
    rapor_dapodik_radar: [],
    rapor_dapodik_akurat_radar: [],
    rapor_dapodik_mutakhir_radar: [],
};

const RaporDapodikReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REF_RAPOR_DAPODIK:
        {
            return {
                ...state,
                ref_rapor_dapodik: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_SARPRAS:
        {
            return {
                ...state,
                rapor_dapodik_sarpras: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_ROMBEL:
        {
            return {
                ...state,
                rapor_dapodik_rombel: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_PTK:
        {
            return {
                ...state,
                rapor_dapodik_ptk: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_PD:
        {
            return {
                ...state,
                rapor_dapodik_pd: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_IDENTITAS:
        {
            return {
                ...state,
                rapor_dapodik_identitas: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_SEKOLAH:
        {
            return {
                ...state,
                rapor_dapodik_sekolah: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_WILAYAH:
        {
            return {
                ...state,
                rapor_dapodik_wilayah: action.payload
            };
        }
        case Actions.SET_RAPOR_DAPODIK_WILAYAH:
        {
            return {
                ...state,
                rapor_dapodik_wilayah: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_RADAR:
        {
            return {
                ...state,
                rapor_dapodik_radar: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_AKURAT_RADAR:
        {
            return {
                ...state,
                rapor_dapodik_akurat_radar: action.payload
            };
        }
        case Actions.GET_RAPOR_DAPODIK_MUTAKHIR_RADAR:
        {
            return {
                ...state,
                rapor_dapodik_mutakhir_radar: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RaporDapodikReducer;