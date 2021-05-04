import axios from 'axios/index';

export const GET_FAQ = '[FAQ] GET_FAQ';
export const SIMPAN_FAQ = '[FAQ] SIMPAN_FAQ';

export function getFaq(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Faq/getFaq', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_FAQ,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanFaq(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Faq/simpanFaq', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_FAQ,
                payload: response.data,
                routeParams
            })
        );
}