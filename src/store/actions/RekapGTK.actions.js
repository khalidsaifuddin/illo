import axios from 'axios/index';

export const GET_REKAP_GTK_RINGKASAN = '[REKAP GTK] GET REKAP GTK RINGKASAN';
export const GET_REKAP_GTK_RINGKASAN_SP = '[REKAP GTK] GET REKAP GTK RINGKASAN SP';
export const GET_REKAP_GTK_AGAMA = '[REKAP GTK] GET REKAP GTK AGAMA';
export const GET_REKAP_GTK_AGAMA_SP = '[REKAP GTK] GET REKAP GTK AGAMA SP';

// ringkasan
export function getRekapGTKRingkasan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/GTK/getRekapGTKRingkasan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_GTK_RINGKASAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapGTKRingkasanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/GTK/getRekapGTKRingkasanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_GTK_RINGKASAN_SP,
            payload: response.data,
            routeParams
        })
    });

}


// agama
export function getRekapGTKAgama(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/GTK/getRekapGTKAgama', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_GTK_AGAMA,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapGTKAgamaSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/GTK/getRekapGTKAgamaSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_GTK_AGAMA_SP,
            payload: response.data,
            routeParams
        })
    });

}