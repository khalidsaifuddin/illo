import * as Actions from '../actions';

const initialState = {
    kategori_produk: {
        rows:[],
        total: 0
    },
    stok_total: [],
    produk: {
        rows: [],
        total: 0
    },
    keranjang: {
        rows: [],
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
        case Actions.GET_PRODUK:
        {
            return {
                ...state,
                produk: action.payload
            };
        }
        case Actions.GET_KERANJANG:
        {
            return {
                ...state,
                keranjang: action.payload
            };
        }
        case Actions.GET_STOK_TOTAL:
        {
            return {
                ...state,
                stok_total: action.payload.length > 0 ? action.payload[0] : {}
            };
        }
        
        default:
        {
            return state;
        }
    }
}

export default ProdukReducer;