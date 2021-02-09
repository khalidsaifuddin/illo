import axios from 'axios/index';

export const GET_SPM_KABUPATEN = '[SPM] GET SPM KABUPATEN';
export const GET_SPM_KABUPATEN_PER_KECAMATAN = '[SPM] GET SPM KABUPATEN PER KECAMATAN';
export const GET_SPM_KABUPATEN_PER_SEKOLAH = '[SPM] GET SPM KABUPATEN PER SEKOLAH';

export function getSPMKabupaten(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/SPM/getSPMKabupaten', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SPM_KABUPATEN,
                payload: response.data,
                routeParams
            })
        );
}

export function getSPMKabupatenPerKecamatan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/SPM/getSPMKabupatenPerKecamatan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SPM_KABUPATEN_PER_KECAMATAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getSPMKabupatenPerSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/SPM/getSPMKabupatenPerSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SPM_KABUPATEN_PER_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}
