import axios from 'axios/index';

export const SIMPAN_NOTIFIKASI = '[NOTIFIKASI] SIMPAN NOTIFIKASI';
export const GET_NOTIFIKASI = '[NOTIFIKASI] GET NOTIFIKASI';
export const GET_LINIMASA = '[NOTIFIKASI] GET LINIMASA';
export const SIMPAN_PENGIKUT = '[NOTIFIKASI] SIMPAN PENGIKUT';
export const GET_PENGIKUT = '[NOTIFIKASI] GET PENGIKUT';
export const CEK_MENGIKUTI = '[NOTIFIKASI] CEK MENGIKUTI';
export const SIMPAN_NOTIFIKASI_KOMENTAR = '[NOTIFIKASI] SIMPAN_NOTIFIKASI_KOMENTAR';
export const SIMPAN_NOTIFIKASI_RUANG = '[NOTIFIKASI] SIMPAN_NOTIFIKASI_RUANG';
export const SIMPAN_NOTIFIKASI_SEKOLAH = '[NOTIFIKASI] SIMPAN_NOTIFIKASI_SEKOLAH';
export const GET_NOTIFIKASI_REDIS = '[NOTIFIKASI] GET_NOTIFIKASI_REDIS';
export const GET_NOTIFIKASI_REDIS_BELUM_DIBACA = '[NOTIFIKASI] GET_NOTIFIKASI_REDIS_BELUM_DIBACA';
export const BACA_NOTIFIKASI = '[NOTIFIKASI] BACA_NOTIFIKASI';

export function bacaNotifikasi(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/bacaNotifikasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : BACA_NOTIFIKASI,
                payload: response.data,
                routeParams
            })
        );
}

export function getNotifikasiRedisBelumDibaca(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/getNotifikasiRedis', {
        ...routeParams,
        tipe: 'belum_dibaca'
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_NOTIFIKASI_REDIS_BELUM_DIBACA,
                payload: response.data,
                routeParams
            })
        );
}

export function getNotifikasiRedis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/getNotifikasiRedis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_NOTIFIKASI_REDIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanNotifikasiSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/simpanNotifikasiSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_NOTIFIKASI_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanNotifikasiRuang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/simpanNotifikasiRuang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_NOTIFIKASI_RUANG,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanNotifikasiKomentar(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/simpanNotifikasiKomentar', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_NOTIFIKASI_KOMENTAR,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanNotifikasi(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/simpanNotifikasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_NOTIFIKASI,
                payload: response.data,
                routeParams
            })
        );
}

export function getNotifikasi(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Notifikasi/getNotifikasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_NOTIFIKASI,
                payload: response.data,
                routeParams
            })
        );
}

export function getLinimasa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Linimasa/getLinimasa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_LINIMASA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPengikut(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengikut/simpanPengikut', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PENGIKUT,
                payload: response.data,
                routeParams
            })
        );
}

export function getPengikut(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengikut/getPengikut', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PENGIKUT,
                payload: response.data,
                routeParams
            })
        );
}

export function cekMengikuti(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pengikut/cekMengikuti', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : CEK_MENGIKUTI,
                payload: response.data,
                routeParams
            })
        );
}