import axios from 'axios/index';

export const GET_REKAP_SEKOLAH_SARPRAS              = '[PESERTA DIDIK] GET REKAP SEKOLAH SARPRAS';
export const GET_REKAP_SEKOLAH_SARPRAS_WILAYAH      = '[PESERTA DIDIK] GET REKAP SEKOLAH SARPRAS WILAYAH';
export const GET_SARPRAS_KERUSAKAN_WILAYAH          = '[PESERTA DIDIK] GET SARPRAS KERUSAKAN WILAYAH';
export const GET_SARPRAS_KERUSAKAN_WILAYAH_TABEL    = '[PESERTA DIDIK] GET SARPRAS KERUSAKAN WILAYAH TABEL';
export const GET_SARPRAS_JENIS_WILAYAH              = '[PESERTA DIDIK] GET SARPRAS JENIS WILAYAH';
export const GET_SARPRAS_JENIS_WILAYAH_TABEL        = '[PESERTA DIDIK] GET SARPRAS JENIS WILAYAH TABEL';
export const GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH      = '[PESERTA DIDIK] GET SARPRAS KEBUTUHAN RKB';
export const GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH_TABEL= '[PESERTA DIDIK] GET SARPRAS KEBUTUHAN RKB TABEL';

export function getRekapSekolahSarpras(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSekolahSarpras', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_REKAP_SEKOLAH_SARPRAS,
                payload: response.data,
                routeParams
            })
        );
}

export function getRekapSekolahSarprasWilayah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getRekapSekolahSarprasWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_REKAP_SEKOLAH_SARPRAS_WILAYAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasKerusakanWilayah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasKerusakanWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_KERUSAKAN_WILAYAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasKerusakanWilayahTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasKerusakanWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_KERUSAKAN_WILAYAH_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasJenisWilayah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasJenisWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_JENIS_WILAYAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasJenisWilayahTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasJenisWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_JENIS_WILAYAH_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasKebutuhanRkbWilayah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasKebutuhanRkbWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSarprasKebutuhanRkbWilayahTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sarpras/getSarprasKebutuhanRkbWilayah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SARPRAS_KEBUTUHAN_RKB_WILAYAH_TABEL,
                payload: response.data,
                routeParams
            })
        );
}