import axios from 'axios/index';

export const GET_REKAP_SARPRAS_RINGKASAN = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK RINGKASAN';
export const GET_REKAP_SARPRAS_RINGKASAN_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK RINGKASAN SP';
export const GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK TINGKAT KERUSAKAN';
export const GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK TINGKAT KERUSAKAN SP';

// ringkasan
export function getRekapSarprasRingkasan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSarprasRingkasan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SARPRAS_RINGKASAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSarprasRingkasanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSarprasRingkasanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SARPRAS_RINGKASAN_SP,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSarprasTingkatKerusakan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSarprasTingkatKerusakan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSarprasTingkatKerusakanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSarprasTingkatKerusakanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SARPRAS_TINGKAT_KERUSAKAN_SP,
            payload: response.data,
            routeParams
        })
    });

}