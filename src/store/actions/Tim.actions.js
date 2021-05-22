import axios from 'axios/index';

export const GET_TIM_MARKETING = '[TIM] GET_TIM_MARKETING';
export const SIMPAN_TIM_MARKETING = '[TIM] SIMPAN_TIM_MARKETING';
export const GET_TIM_PENJUALAN = '[TIM] GET_TIM_PENJUALAN';
export const SIMPAN_TIM_PENJUALAN = '[TIM] SIMPAN_TIM_PENJUALAN';

export function getTimMarketing(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tim/getTimMarketing', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TIM_MARKETING,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanTimMarketing(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tim/simpanTimMarketing', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_TIM_MARKETING,
                payload: response.data,
                routeParams
            })
        );
}

export function getTimPenjualan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tim/getTimPenjualan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TIM_PENJUALAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanTimPenjualan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tim/simpanTimPenjualan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_TIM_PENJUALAN,
                payload: response.data,
                routeParams
            })
        );
}
