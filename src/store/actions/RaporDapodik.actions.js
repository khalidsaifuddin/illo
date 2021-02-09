import axios from 'axios/index';

export const GET_RAPOR_DAPODIK_WILAYAH = '[RAPOR DAPODIK] GET RAPOR DAPODIK WILAYAH';
export const SET_RAPOR_DAPODIK_WILAYAH = '[RAPOR DAPODIK] SET RAPOR DAPODIK WILAYAH';
export const GET_RAPOR_DAPODIK_SEKOLAH = '[RAPOR DAPODIK] GET RAPOR DAPODIK SEKOLAH';
export const GET_RAPOR_DAPODIK_IDENTITAS = '[RAPOR DAPODIK] GET RAPOR DAPODIK IDENTITAS';
export const GET_RAPOR_DAPODIK_PD = '[RAPOR DAPODIK] GET RAPOR DAPODIK PD';
export const GET_RAPOR_DAPODIK_PTK = '[RAPOR DAPODIK] GET RAPOR DAPODIK PTK';
export const GET_RAPOR_DAPODIK_ROMBEL = '[RAPOR DAPODIK] GET RAPOR DAPODIK ROMBEL';
export const GET_RAPOR_DAPODIK_SARPRAS = '[RAPOR DAPODIK] GET RAPOR DAPODIK SARPRAS';
export const GET_REF_RAPOR_DAPODIK = '[RAPOR DAPODIK] GET REF RAPOR DAPODIK PTK';
export const GET_RAPOR_DAPODIK_RADAR = '[RAPOR DAPODIK] GET RAPOR DAPODIK RADAR';
export const GET_RAPOR_DAPODIK_AKURAT_RADAR = '[RAPOR DAPODIK] GET RAPOR DAPODIK AKURAT RADAR';
export const GET_RAPOR_DAPODIK_MUTAKHIR_RADAR = '[RAPOR DAPODIK] GET RAPOR DAPODIK MUTAKHIR RADAR';

export function setRaporDapodikWilayah(){
    return (dispatch) => {
        return dispatch ({
            type: SET_RAPOR_DAPODIK_WILAYAH,
            payload: JSON.parse(localStorage.getItem('rapor_dapodik_wilayah'))
        })
    }
}

export function getRaporDapodikWilayah(routeParams)
{
    // console.log(localStorage.getItem('rapor_dapodik_wilayah'));

    // if(localStorage.getItem('rapor_dapodik_wilayah') !== null && localStorage.getItem('rapor_dapodik_wilayah') !== ''){

    //     return (dispatch) => {
    //         return dispatch ({
    //             type: GET_RAPOR_DAPODIK_WILAYAH,
    //             payload: JSON.parse(localStorage.getItem('rapor_dapodik_wilayah')),
    //             routeParams
    //         })
    //     }

    // }else{

        const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodik', {
            ...routeParams
        });
        
        return (dispatch) =>
        request.then((response) =>
        {
            // console.log(response);
            localStorage.setItem('rapor_dapodik_wilayah', JSON.stringify(response.data));

            dispatch({
                type   : GET_RAPOR_DAPODIK_WILAYAH,
                payload: response.data,
                routeParams
            })
        });

    // }
}

export function getRaporDapodikSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikSekolah', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        // console.log(response);
        localStorage.setItem('rapor_dapodik_sekolah', JSON.stringify(response.data));

        dispatch({
            type   : GET_RAPOR_DAPODIK_SEKOLAH,
            payload: response.data,
            routeParams
        })
    });
}

export function getRaporDapodikIdentitas(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikIdentitas', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_IDENTITAS,
            payload: response.data,
            routeParams
        })
    });
}

export function getRaporDapodikPD(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikPD', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_PD,
            payload: response.data,
            routeParams
        })
    });
}

export function getRaporDapodikPTK(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikPTK', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_PTK,
            payload: response.data,
            routeParams
        })
    });
}

export function getRaporDapodikRombel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikRombel', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_ROMBEL,
            payload: response.data,
            routeParams
        })
    });
}

export function getRaporDapodikSarpras(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikSarpras', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_SARPRAS,
            payload: response.data,
            routeParams
        })
    });
}


export function getRefRaporDapodik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRefRaporDapodik', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REF_RAPOR_DAPODIK,
            payload: response.data,
            routeParams
        })
    });
}


export function getRaporDapodikRadar(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikRadar', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_RADAR,
            payload: response.data,
            routeParams
        })
    });
}


export function getRaporDapodikAkuratRadar(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikAkuratRadar', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_AKURAT_RADAR,
            payload: response.data,
            routeParams
        })
    });
}


export function getRaporDapodikMutakhirRadar(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/RaporDapodik/getRaporDapodikMutakhirRadar', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_RAPOR_DAPODIK_MUTAKHIR_RADAR,
            payload: response.data,
            routeParams
        })
    });
}