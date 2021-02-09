import * as Actions from '../actions';

const initialState = {
    peserta_didik_jenis_kelamin_tabel: [],
    peserta_didik_jenis_kelamin_chart: {
        labels  : [
            'Laki-laki',
            'Perempuan'
        ],
        datasets: [
            {
                data                : [300, 50],
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
    peserta_didik_tingkat_kelas_tabel : [],
    peserta_didik_tingkat_kelas_pie : {},
    peserta_didik_tingkat_kelas_chart : {
        labels  : ['Kelas 10', 'Kelas 11', 'Kelas 12'],
        datasets: [
            {
                label               : 'Laki-laki',
                backgroundColor     : 'rgba(255,99,132,0.2)',
                borderColor         : 'rgba(255,99,132,1)',
                borderWidth         : 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor    : 'rgba(255,99,132,1)',
                data                : [65, 59, 80]
            }
            ,{
                label               : 'Perempuan',
                backgroundColor     : 'rgba(0,99,132,0.2)',
                borderColor         : 'rgba(0,99,132,1)',
                borderWidth         : 1,
                hoverBackgroundColor: 'rgba(0,99,132,0.4)',
                hoverBorderColor    : 'rgba(0,99,132,1)',
                data                : [65, 59, 80]
            }
        ]
    },
    peserta_didik_usia_tabel : [],
    peserta_didik_usia_chart : {
        labels  : ['Kelas 10', 'Kelas 11', 'Kelas 12'],
        datasets: [
            {
                label               : 'Laki-laki',
                backgroundColor     : 'rgba(255,99,132,0.2)',
                borderColor         : 'rgba(255,99,132,1)',
                borderWidth         : 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor    : 'rgba(255,99,132,1)',
                data                : [65, 59, 80]
            }
            ,{
                label               : 'Perempuan',
                backgroundColor     : 'rgba(0,99,132,0.2)',
                borderColor         : 'rgba(0,99,132,1)',
                borderWidth         : 1,
                hoverBackgroundColor: 'rgba(0,99,132,0.4)',
                hoverBorderColor    : 'rgba(0,99,132,1)',
                data                : [65, 59, 80]
            }
        ]
    }
};

const PesertaDidikReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_PESERTA_DIDIK_JENIS_KELAMIN_CHART:
        {
            return {
                ...state,
                peserta_didik_jenis_kelamin_chart: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_TINGKAT_KELAS_CHART:
        {
            return {
                ...state,
                peserta_didik_tingkat_kelas_chart: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_TINGKAT_KELAS_PIE:
        {
            return {
                ...state,
                peserta_didik_tingkat_kelas_pie: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_USIA_CHART:
        {
            return {
                ...state,
                peserta_didik_usia_chart: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_JENIS_KELAMIN_TABEL:
        {
            return {
                ...state,
                peserta_didik_jenis_kelamin_tabel: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_TINGKAT_KELAS_TABEL:
        {
            return {
                ...state,
                peserta_didik_tingkat_kelas_tabel: action.payload
            };
        }
        case Actions.GET_PESERTA_DIDIK_USIA_TABEL:
        {
            return {
                ...state,
                peserta_didik_usia_tabel: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default PesertaDidikReducer;