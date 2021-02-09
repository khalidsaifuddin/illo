import axios from 'axios/index';

export const GET_AKTIVITAS = '[NOTIFIKASI] GET AKTIVITAS';

export function getAktivitas(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Aktivitas/getAktivitas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_AKTIVITAS,
                payload: response.data,
                routeParams
            })
        );
}