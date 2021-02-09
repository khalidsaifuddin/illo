import * as Actions from '../actions';

const initialState = {
    tugas: {
        rows: [],
        total: 0
    }
};

const TugasReducers = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_TUGAS:
        {
            return {
                ...state,
                tugas: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default TugasReducers;