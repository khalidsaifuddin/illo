import axios from 'axios/index';

export const GET_JENIS_TIKET = '[SPM] GET_JENIS_TIKET';
export const GET_UNIT = '[SPM] GET_UNIT';
export const SIMPAN_UNIT = '[SPM] SIMPAN_UNIT';

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
