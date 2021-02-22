import axios from 'axios/index';

export const GET_JENIS_MITRA = '[NOTIFIKASI] GET_JENIS_MITRA';
export const GET_ANGGOTA_MITRA = '[NOTIFIKASI] GET_ANGGOTA_MITRA';
export const SIMPAN_MITRA = '[NOTIFIKASI] SIMPAN_MITRA';

export function getJenisMitra(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Mitra/getJenisMitra', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JENIS_MITRA,
                payload: response.data,
                routeParams
            })
        );
}

export function getAnggotaMitra(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Mitra/getAnggotaMitra', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_ANGGOTA_MITRA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanMitra(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Mitra/simpanMitra', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_MITRA,
                payload: response.data,
                routeParams
            })
        );
}