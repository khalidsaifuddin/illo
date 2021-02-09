import * as Actions from '../actions';

const initialState = {
    aktivitas: {
        rows: [],
        total: 0
    }
};

const AktivitasReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_AKTIVITAS:
        {
            return {
                ...state,
                aktivitas: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default AktivitasReducer;