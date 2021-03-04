import axios from 'axios/index';

export const GET_ALAMAT_PENGGUNA = '[NOTIFIKASI] GET_ALAMAT_PENGGUNA';
export const SIMPAN_ALAMAT_PENGGUNA = '[NOTIFIKASI] SIMPAN_ALAMAT_PENGGUNA';

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

