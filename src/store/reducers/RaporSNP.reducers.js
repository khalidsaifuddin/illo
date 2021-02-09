import * as Actions from '../actions';

const initialState = {
    rapor_snp: {
        rows: [{
            kode_wilayah: '---',
            nama: '---',
            rapor_snp: 0
        }],
        total: 0
    }
};

const RaporSNPReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        
        case Actions.GET_RAPOR_SNP_WILAYAH:
        {
            return {
                ...state,
                rapor_snp: action.payload
            };
        }
        default:
        {
            return state;
        }
    }
}

export default RaporSNPReducer;