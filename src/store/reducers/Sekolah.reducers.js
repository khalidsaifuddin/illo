import * as Actions from '../actions';

const initialState = {
    sekolah: {
        total: 0,
        rows: []
    },
    sekolah_pengguna: {
        total: 0,
        rows: []
    },
    undangan_sekolah: {
        rows: [],
        total: 0
    },
    pengaturan_sekolah: {
        rows: [],
        total: 0
    },
    jarak_sekolah: {
        km: 0,
        m: 0
    }
    // guru: {
    //     rows: [],
    //     total: 0
    // }
};

const SekolahReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_SEKOLAH:
        {
            return {
                ...state,
                sekolah: action.payload
            };
        }
        case Actions.GET_SEKOLAH_PENGGUNA:
        {
            return {
                ...state,
                sekolah_pengguna: action.payload
            };
        }
        case Actions.GET_UNDANGAN_SEKOLAH:
        {
            return {
                ...state,
                undangan_sekolah: action.payload
            };
        }
        case Actions.GET_PENGATURAN_SEKOLAH:
        {
            return {
                ...state,
                pengaturan_sekolah: action.payload
            };
        }
        case Actions.GET_JARAK_SEKOLAH:
        {
            return {
                ...state,
                jarak_sekolah: action.payload
            };
        }
        // case Actions.GET_GURU:
        // {
        //     return {
        //         ...state,
        //         guru: action.payload
        //     };
        // }
        default:
        {
            return state;
        }
    }
}

export default SekolahReducer;