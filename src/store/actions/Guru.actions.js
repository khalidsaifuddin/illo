import axios from 'axios/index';

export const GET_GURU = '[GURU] GET GET_GURU';
export const SIMPAN_GURU = '[GURU] SIMPAN_GURU';
export const GET_KEHADIRAN_GURU = '[GURU] GET_KEHADIRAN_GURU';
export const SIMPAN_KEHADIRAN_GURU = '[GURU] SIMPAN_KEHADIRAN_GURU';
export const GET_KEHADIRAN_HARIAN_GURU = '[GURU] GET_KEHADIRAN_HARIAN_GURU';
export const GET_KEHADIRAN_REKAP_GURU = '[GURU] GET_KEHADIRAN_REKAP_GURU';
export const GET_KEHADIRAN_SISWA = '[SISWA] GET_KEHADIRAN_SISWA';
export const SIMPAN_KEHADIRAN_SISWA = '[SISWA] SIMPAN_KEHADIRAN_SISWA';
export const GET_KEHADIRAN_HARIAN_SISWA = '[SISWA] GET_KEHADIRAN_HARIAN_SISWA';
export const GET_KEHADIRAN_REKAP_SISWA = '[SISWA] GET_KEHADIRAN_REKAP_SISWA';

export function getGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function getKehadiranGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getKehadiranGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKehadiranGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanKehadiranGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KEHADIRAN_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function kehadiranHarianGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/kehadiranHarianGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_HARIAN_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function kehadiranRekapGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/kehadiranRekapGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_REKAP_GURU,
                payload: response.data,
                routeParams
            })
        );
}


//siswa
export function getKehadiranSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getKehadiranSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_SISWA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKehadiranSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanKehadiranSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KEHADIRAN_SISWA,
                payload: response.data,
                routeParams
            })
        );
}

export function kehadiranHarianSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/kehadiranHarianSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_HARIAN_SISWA,
                payload: response.data,
                routeParams
            })
        );
}

export function kehadiranRekapSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/kehadiranRekapSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_REKAP_SISWA,
                payload: response.data,
                routeParams
            })
        );
}