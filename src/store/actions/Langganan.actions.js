import axios from 'axios/index';

export const GET_LANGGANAN = '[LANGGANAN] GET_LANGGANAN';

export function getLangganan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Langganan/getLangganan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_LANGGANAN,
                payload: response.data,
                routeParams
            })
        );
}