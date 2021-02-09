import * as Actions from '../actions';

const initialState = {
    rekap_sekolah_sarpras: [],
    rekap_sekolah_sarpras_wilayah: [],
    sarpras_kerusakan_wilayah_tabel: [],
    sarpras_kerusakan_wilayah: {
        labels  : [
            '-',
            '-'
        ],
        datasets: [
            {
                data                : [10, 10],
                backgroundColor     : [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }
        ]
    },
    sarpras_jenis_wilayah_tabel: [],
    sarpras_jenis_wilayah: {
        labels  : [
            '-',
            '-'
        ],
        datasets: [
            {
                data                : [10, 10],
                backgroundColor     : [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }
        ]
    },
    sarpras_kebutuhan_rkb_wilayah_tabel: [],
    sarpras_kebutuhan_rkb_wilayah: {
        labels  : [
            '-',
            '-'
        ],
        datasets: [
            {
                data                : [10, 10],
                backgroundColor     : [
                    '#FF6384',
                    '#36A2EB'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB'
                ]
            }
        ]
    }
};

const SarprasReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_REKAP_SEKOLAH_SARPRAS:
        {
            return {
                ...state,
                rekap_sekolah_sarpras: action.payload
            };
        }
        case Actions.GET_REKAP_SEKOLAH_SARPRAS_WILAYAH:
        {
            return {
                ...state,
                rekap_sekolah_sarpras_wilayah: action.payload
            };
        }
        case Actions.GET_SARPRAS_KERUSAKAN_WILAYAH:
        {
            return {
                ...state,
                sarpras_kerusakan_wilayah: action.payload
            };
        }
        case Actions.GET_SARPRAS_KERUSAKAN_WILAYAH_TABEL:
        {
            return {
                ...state,
                sarpras_kerusakan_wilayah_tabel: action.payload
            };
        }
        case Actions.GET_SARPRAS_JENIS_WILAYAH:
        {
            return {
                ...state,
                sarpras_jenis_wilayah: action.payload
            };
        }
        case Actions.GET_SARPRAS_JENIS_WILAYAH_TABEL:
        {
            return {
                ...state,
                sarpras_jenis_wilayah_tabel: action.payload
            };
        }
        case Actions.GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH:
        {
            return {
                ...state,
                sarpras_kebutuhan_rkb_wilayah: action.payload
            };
        }
        case Actions.GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH_TABEL:
        {
            return {
                ...state,
                sarpras_kebutuhan_rkb_wilayah_tabel: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default SarprasReducer;