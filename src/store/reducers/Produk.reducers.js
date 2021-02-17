import * as Actions from '../actions';

const initialState = {
    kategori_produk: {
        rows:[],
        total: 0
    }
};

const ProdukReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_KATEGORI_PRODUK:
        {
            return {
                ...state,
                kategori_produk: action.payload
            };
        }
        
        default:
        {
            return state;
        }
    }
}

export default ProdukReducer;