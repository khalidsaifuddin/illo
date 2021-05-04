import axios from 'axios/index';

export const GET_BANNER = '[BANNER] GET_BANNER';
export const SIMPAN_BANNER = '[BANNER] SIMPAN_BANNER';

export function getBanner(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Banner/getBanner', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_BANNER,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanBanner(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Banner/simpanBanner', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_BANNER,
                payload: response.data,
                routeParams
            })
        );
}