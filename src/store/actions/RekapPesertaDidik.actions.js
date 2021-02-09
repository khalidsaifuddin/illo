import axios from 'axios/index';

export const GET_REKAP_PESERTA_DIDIK_RINGKASAN = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK RINGKASAN';
export const GET_REKAP_PESERTA_DIDIK_RINGKASAN_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK RINGKASAN SP';
export const GET_REKAP_PESERTA_DIDIK_NISN = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK NISN';
export const GET_REKAP_PESERTA_DIDIK_NISN_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK NISN SP';
export const GET_REKAP_PESERTA_DIDIK_TINGKAT = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK TINGKAT';
export const GET_REKAP_PESERTA_DIDIK_TINGKAT_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK TINGKAT SP';
export const GET_REKAP_PESERTA_DIDIK_AGAMA = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK AGAMA';
export const GET_REKAP_PESERTA_DIDIK_AGAMA_SP = '[REKAP PESERTA DIDIK] GET REKAP PESERTA DIDIK AGAMA SP';

// ringkasan
export function getRekapPesertaDidikRingkasan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikRingkasan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_RINGKASAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapPesertaDidikRingkasanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikRingkasanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_RINGKASAN_SP,
            payload: response.data,
            routeParams
        })
    });

}

// NISN
export function getRekapPesertaDidikNISN(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikNISN', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_NISN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapPesertaDidikNISNSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikNISNSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_NISN_SP,
            payload: response.data,
            routeParams
        })
    });

}

// tingkat
export function getRekapPesertaDidikTingkat(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikTingkat', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_TINGKAT,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapPesertaDidikTingkatSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikTingkatSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_TINGKAT_SP,
            payload: response.data,
            routeParams
        })
    });

}

// agama
export function getRekapPesertaDidikAgama(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikAgama', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_AGAMA,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapPesertaDidikAgamaSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getRekapPesertaDidikAgamaSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_PESERTA_DIDIK_AGAMA_SP,
            payload: response.data,
            routeParams
        })
    });

}