import axios from 'axios/index';

export const GET_STATUS_CRM = '[CRM] GET_STATUS_CRM';
export const GET_PRIORITAS_CRM = '[CRM] GET_PRIORITAS_CRM';
export const GET_CRM = '[CRM] GET_CRM';
export const SIMPAN_CRM = '[CRM] SIMPAN_CRM';

export function getStatusCrm(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/CRM/getStatusCrm', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_STATUS_CRM,
                payload: response.data,
                routeParams
            })
        );
}

export function getPrioritasCrm(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/CRM/getPrioritasCrm', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PRIORITAS_CRM,
                payload: response.data,
                routeParams
            })
        );
}

export function getCrm(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/CRM/getCrm', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_CRM,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanCrm(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/CRM/simpanCrm', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_CRM,
                payload: response.data,
                routeParams
            })
        );
}