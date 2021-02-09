import * as Actions from '../actions';

const initialState = {
    guru: {
        rows:{},
        total: 0
    }
    ,kehadiran_guru: {
        rows:{},
        total: 0
    }
    ,kehadiran_harian_guru: []
    ,kehadiran_rekap_guru: []
    ,kehadiran_siswa: {
        rows:{},
        total: 0
    }
    ,kehadiran_harian_siswa: []
    ,kehadiran_rekap_siswa: []
};

const GuruReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_GURU:
        {
            return {
                ...state,
                guru: action.payload
            };
        }
        case Actions.GET_KEHADIRAN_GURU:
        {
            return {
                ...state,
                kehadiran_guru: action.payload
            };
        }
        case Actions.GET_KEHADIRAN_HARIAN_GURU:
        {
            return {
                ...state,
                kehadiran_harian_guru: action.payload
            };
        }
        case Actions.GET_KEHADIRAN_REKAP_GURU:
        {
            return {
                ...state,
                kehadiran_rekap_guru: action.payload
            };
        }

        case Actions.GET_KEHADIRAN_SISWA:
        {
            return {
                ...state,
                kehadiran_siswa: action.payload
            };
        }
        case Actions.GET_KEHADIRAN_HARIAN_SISWA:
        {
            return {
                ...state,
                kehadiran_harian_siswa: action.payload
            };
        }
        case Actions.GET_KEHADIRAN_REKAP_SISWA:
        {
            return {
                ...state,
                kehadiran_rekap_siswa: action.payload
            };
        }

        default:
        {
            return state;
        }
    }
}

export default GuruReducer;