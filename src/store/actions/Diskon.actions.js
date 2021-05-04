import axios from 'axios/index';

export const SIMPAN_DISKON_PELANGGAN = '[BLOG] SIMPAN_DISKON_PELANGGAN';
export const GET_DISKON_PELANGGAN = '[DISKON] GET_DISKON_PELANGGAN';
export const SIMPAN_DISKON_PRODUK = '[BLOG] SIMPAN_DISKON_PRODUK';
export const GET_DISKON_PRODUK = '[DISKON] GET_DISKON_PRODUK';
export const GENERATE_KODE_DISKON = '[DISKON] GENERATE_KODE_DISKON';
export const SIMPAN_DISKON_PENGGUNA = '[BLOG] SIMPAN_DISKON_PENGGUNA';
export const GET_DISKON_PENGGUNA = '[DISKON] GET_DISKON_PENGGUNA';

export function simpanDiskonPelanggan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/simpanDiskonPelanggan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_DISKON_PELANGGAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getDiskonPelanggan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/getDiskonPelanggan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DISKON_PELANGGAN,
                payload: response.data,
                routeParams
            })
        );
}

export function generateKodeDiskon(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/generateKodeDiskon', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GENERATE_KODE_DISKON,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanDiskonProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/simpanDiskonProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_DISKON_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function getDiskonProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/getDiskonProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DISKON_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanDiskonPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/simpanDiskonPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_DISKON_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function getDiskonPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Diskon/getDiskonPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DISKON_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}