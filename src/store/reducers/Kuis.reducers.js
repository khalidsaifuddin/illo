import * as Actions from '../actions';

const initialState = {
    kuis: {
        rows: [],
        total: 0
    },
    pengguna_kuis: {
        rows: [],
        total: 0
    },
    kuis_diikuti: {
        rows: [],
        total: 0
    },
    kuis_ruang: {
        rows: [],
        total: 0
    },
    jawaban_kuis: {
        rows: [],
        total: 0
    },
    pertanyaan_kuis: {
        rows: [{
            file_audio: null
        }],
        total: 0
    },
    fe_kuis: {
        rows: [],
        total: 0,
        jenjang_id: 0
    },
    sesi_kuis: {
        rows: [],
        total: 0
    },
    kuis_trending: {
        rows: [],
        total: 0
    },
    laporan_hasil_kuis: {
        rows: [],
        total: 0
    },
    aktivitas_kuis: {
        rows: [],
        total: 0
    },
    uuid_kuis: '',
    stat_kuis: {},
    count_kuis_umum: {},
    sesi_kuis_pengguna: {
        rows: [],
        total: 0
    },
    kolaborasi_kuis: {
        rows: [],
        total: 0
    },
    aspek: {
        rows: [],
        total: 0
    },
    aspek_reversed: {
        rows: [],
        total: 0
    },
    jawaban_pengguna_kuis: {
        rows: [],
        total: 0
    }
};

const KuisReducers = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GENERATE_UUID:
        {
            return {
                ...state,
                uuid_kuis: action.payload
            };
        }
        case Actions.SIMPAN_KUIS:
        {
            return {
                ...state,
                kuis: action.payload
            };
        }
        case Actions.GET_KUIS:
        {
            return {
                ...state,
                kuis: action.payload
            };
        }
        case Actions.GET_PENGGUNA_KUIS:
        {
            return {
                ...state,
                pengguna_kuis: action.payload
            };
        }
        case Actions.GET_PERTANYAAN_KUIS:
        {
            return {
                ...state,
                pertanyaan_kuis: action.payload
            };
        }
        case Actions.SET_KUIS:
        {
            return {
                ...state,
                fe_kuis: action.payload
            };
        }
        case Actions.GET_KUIS_DIIKUTI:
        {
            return {
                ...state,
                kuis_diikuti: action.payload
            };
        }
        case Actions.GET_KUIS_RUANG:
        {
            return {
                ...state,
                kuis_ruang: action.payload
            };
        }
        case Actions.GET_SESI_KUIS:
        {
            return {
                ...state,
                sesi_kuis: action.payload
            };
        }
        case Actions.GET_KUIS_TRENDING:
        {
            return {
                ...state,
                kuis_trending: action.payload
            };
        }
        case Actions.GET_LAPORAN_HASIL:
        {
            return {
                ...state,
                laporan_hasil_kuis: action.payload
            };
        }
        case Actions.AKTIVITAS_KUIS:
        {
            return {
                ...state,
                aktivitas_kuis: action.payload
            };
        }
        case Actions.GET_STAT_KUIS:
        {
            return {
                ...state,
                stat_kuis: action.payload[0]
            };
        }
        case Actions.GET_COUNT_KUIS_UMUM:
        {
            return {
                ...state,
                count_kuis_umum: action.payload[0]
            };
        }
        case Actions.GET_SESI_KUIS_PENGGUNA:
        {
            return {
                ...state,
                sesi_kuis_pengguna: action.payload
            };
        }
        case Actions.GET_KOLABORASI_KUIS:
        {
            return {
                ...state,
                kolaborasi_kuis: action.payload
            };
        }
        case Actions.GET_ASPEK:
        {
            return {
                ...state,
                aspek: action.payload
            };
        }
        case Actions.GET_ASPEK_REVERSED:
        {
            return {
                ...state,
                aspek_reversed: action.payload
            };
        }
        case Actions.GET_JAWABAN_PENGGUNA_KUIS:
        {
            return {
                ...state,
                jawaban_pengguna_kuis: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default KuisReducers;