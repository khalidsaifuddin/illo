import * as Actions from '../actions';

const initialState = {
    simpan_pertanyaan: {
        sukses  : false,
        rows: []
    },
    pertanyaan: {
        rows: [],
        total: 0
    },
    pertanyaan_pantauan: {
        rows: [],
        total: 0
    },
    jawaban: {
        rows: [],
        total: 0
    }
};

const PertanyaanReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.SIMPAN_PERTANYAAN:
        {
            return {
                ...state,
                simpan_pertanyaan: action.payload
            };
        }
        case Actions.GET_PERTANYAAN:
        {
            return {
                ...state,
                pertanyaan: action.payload
            };
        }
        case Actions.GET_PERTANYAAN_PANTAUAN:
        {
            return {
                ...state,
                pertanyaan_pantauan: action.payload
            };
        }
        case Actions.GET_JAWABAN:
        {
            return {
                ...state,
                jawaban: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default PertanyaanReducer;