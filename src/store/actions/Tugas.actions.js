import axios from 'axios/index';

export const SIMPAN_TUGAS = '[TUGAS] SIMPAN_TUGAS';
export const GET_TUGAS = '[TUGAS] GET_TUGAS';

export function simpanTugas(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tugas/simpanTugas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_TUGAS,
                payload: response.data,
                routeParams
            })
        );
}

export function getTugas(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Tugas/getTugas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TUGAS,
                payload: response.data,
                routeParams
            })
        );
}