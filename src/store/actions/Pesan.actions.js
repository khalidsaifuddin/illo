import axios from 'axios/index';

export const SIMPAN_KELOMPOK_PESAN = '[PESAN] SIMPAN_KELOMPOK_PESAN';
export const GET_KELOMPOK_PESAN = '[PESAN] GET_KELOMPOK_PESAN';
export const SIMPAN_PESAN = '[PESAN] SIMPAN_PESAN';
export const GET_PESAN = '[PESAN] GET_PESAN';
export const GET_DAFTAR_PESAN = '[PESAN] GET_DAFTAR_PESAN';
export const SIMPAN_PESAN_DIBACA = '[PESAN] SIMPAN_PESAN_DIBACA';

export function simpanKelompokPesan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/simpanKelompokPesan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KELOMPOK_PESAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getKelompokPesan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/getKelompokPesan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KELOMPOK_PESAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPesan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/simpanPesan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PESAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/getPesan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getDaftarPesan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/getDaftarPesan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DAFTAR_PESAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPesanDibaca(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pesan/simpanPesanDibaca', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PESAN_DIBACA,
                payload: response.data,
                routeParams
            })
        );
}

