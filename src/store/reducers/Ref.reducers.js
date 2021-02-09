import * as Actions from '../actions';

const initialState = {
    jenjang: {
        rows: [],
        total: 0
    },
    tingkat_pendidikan: {
        rows: [],
        total: 0
    },
    mata_pelajaran: {
        rows: [],
        total: 0
    }
};

const RefReducers = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_JENJANG:
        {
            return {
                ...state,
                jenjang: action.payload
            };
        }
        case Actions.GET_TINGKAT_PENDIDIKAN:
        {
            return {
                ...state,
                tingkat_pendidikan: action.payload
            };
        }
        case Actions.GET_MATA_PELAJARAN:
        {
            return {
                ...state,
                mata_pelajaran: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RefReducers;