import * as Actions from '../actions';

const initialState = {
    leaderboard_pengguna: {
        rows: [],
        total: 0
    }
};

const PoinReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_LEADERBOARD_PENGGUNA:
        {
            return {
                ...state,
                leaderboard_pengguna: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default PoinReducer;