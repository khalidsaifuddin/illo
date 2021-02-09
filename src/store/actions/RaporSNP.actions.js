import axios from 'axios/index';

export const GET_RAPOR_SNP_WILAYAH = '[RAPOR SNP] GET RAPOR SNP WILAYAH';

export function getRaporSNP(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PMP/getRaporSNP', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_SNP_WILAYAH,
            payload: response.data,
            routeParams
        })
    });

}