import * as Actions from '../actions';

const initialState = {
    gtk_jenis_pie: [],
    gtk_jenis_kelamin_tabel: [],
    gtk_jenis_kelamin_chart: {
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
    gtk_kualifikasi_tabel : [],
    gtk_kualifikasi_chart : {
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
    gtk_nuptk_tabel : [],
    gtk_nuptk_chart : {
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

const GtkReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_GTK_JENIS_PIE:
        {
            return {
                ...state,
                gtk_jenis_pie: action.payload
            };
        }
        case Actions.GET_GTK_JENIS_KELAMIN_CHART:
        {
            return {
                ...state,
                gtk_jenis_kelamin_chart: action.payload
            };
        }
        case Actions.GET_GTK_KUALIFIKASI_CHART:
        {
            return {
                ...state,
                gtk_kualifikasi_chart: action.payload
            };
        }
        case Actions.GET_GTK_NUPTK_CHART:
        {
            return {
                ...state,
                gtk_nuptk_chart: action.payload
            };
        }
        case Actions.GET_GTK_JENIS_KELAMIN_TABEL:
        {
            return {
                ...state,
                gtk_jenis_kelamin_tabel: action.payload
            };
        }
        case Actions.GET_GTK_KUALIFIKASI_TABEL:
        {
            return {
                ...state,
                gtk_kualifikasi_tabel: action.payload
            };
        }
        case Actions.GET_GTK_NUPTK_TABEL:
        {
            return {
                ...state,
                gtk_nuptk_tabel: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default GtkReducer;