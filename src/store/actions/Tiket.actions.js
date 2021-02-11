import axios from 'axios/index';

export const GET_JENIS_TIKET = '[TIKET] GET_JENIS_TIKET';
export const GET_UNIT = '[TIKET] GET_UNIT';
export const GET_PRIORITAS_TIKET = '[TIKET] GET_PRIORITAS_TIKET';
export const SIMPAN_UNIT = '[TIKET] SIMPAN_UNIT';
export const SIMPAN_JENIS_TIKET = '[TIKET] SIMPAN_JENIS_TIKET';
export const GET_TIKET = '[TIKET] GET_TIKET';
export const SIMPAN_TIKET = '[TIKET] SIMPAN_TIKET';
export const GET_PESAN_TIKET = '[TIKET] GET_PESAN_TIKET';
export const SIMPAN_PESAN_TIKET = '[TIKET] SIMPAN_PESAN_TIKET';
export const GET_STATUS_TIKET = '[TIKET] GET_STATUS_TIKET';
export const GET_ANGGOTA_UNIT = '[TIKET] GET_ANGGOTA_UNIT';
export const SIMPAN_ANGGOTA_UNIT = '[TIKET] SIMPAN_ANGGOTA_UNIT';

export function getJenisTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getJenisTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JENIS_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getUnit(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getUnit', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_UNIT,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanUnit(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/simpanUnit', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_UNIT,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanJenisTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/simpanJenisTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_JENIS_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/simpanTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getPrioritasTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getPrioritasTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PRIORITAS_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesanTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getPesanTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESAN_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPesanTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/simpanPesanTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PESAN_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getStatusTiket(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getStatusTiket', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_STATUS_TIKET,
                payload: response.data,
                routeParams
            })
        );
}

export function getAnggotaUnit(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/getAnggotaUnit', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_ANGGOTA_UNIT,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanAnggotaUnit(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tiket/simpanAnggotaUnit', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_ANGGOTA_UNIT,
                payload: response.data,
                routeParams
            })
        );
}
