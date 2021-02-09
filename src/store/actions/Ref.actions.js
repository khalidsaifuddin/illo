import axios from 'axios/index';

export const GET_JENJANG = '[REF] GET JENJANG';
export const GET_TINGKAT_PENDIDIKAN = '[REF] GET TINGKAT PENDIDIKAN';
export const GET_MATA_PELAJARAN = '[REF] GET MATA PELAJARAN';
export const GET_REF = '[APP] GET_REF';

export function getRef(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Ref/getRef', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_REF,
                payload: response.data,
                routeParams
            })
        );
}

export function getJenjang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Ref/getJenjang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JENJANG,
                payload: response.data,
                routeParams
            })
        );
}

export function getTingkatPendidikan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Ref/getTingkatPendidikan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TINGKAT_PENDIDIKAN,
                payload: response.data,
                routeParams
            })
        );
}


export function getMataPelajaran(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Ref/getMataPelajaran', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_MATA_PELAJARAN,
                payload: response.data,
                routeParams
            })
        );
}

