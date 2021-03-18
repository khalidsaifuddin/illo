import axios from 'axios/index';

export const GET_ALAMAT_PENGGUNA = '[PENGGUNA] GET_ALAMAT_PENGGUNA';
export const SIMPAN_ALAMAT_PENGGUNA = '[PENGGUNA] SIMPAN_ALAMAT_PENGGUNA';
export const GET_MITRA_TERDEKAT = '[PENGGUNA] GET_MITRA_TERDEKAT';

export function getMitraTerdekat(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengguna/getMitraTerdekat', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_MITRA_TERDEKAT,
                payload: response.data,
                routeParams
            })
        );
}

export function getAlamatPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengguna/getAlamatPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_ALAMAT_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanAlamatPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengguna/simpanAlamatPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_ALAMAT_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

