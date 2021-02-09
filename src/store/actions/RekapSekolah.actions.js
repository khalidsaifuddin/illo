import axios from 'axios/index';

export const GET_REKAP_SEKOLAH_RINGKASAN = '[REKAP SEKOLAH] GET REKAP SEKOLAH RINGKASAN';
export const GET_REKAP_SEKOLAH_RINGKASAN_SP = '[REKAP SEKOLAH] GET REKAP SEKOLAH RINGKASAN SP';
export const GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN = '[REKAP SEKOLAH] GET REKAP SEKOLAH WAKTU PENYELENGGARAAN';
export const GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN_SP = '[REKAP SEKOLAH] GET REKAP SEKOLAH WAKTU PENYELENGGARAAN SP';
export const GET_REKAP_SEKOLAH_KURIKULUM = '[REKAP SEKOLAH] GET REKAP SEKOLAH KURIKULUM';
export const GET_REKAP_SEKOLAH_KURIKULUM_SP = '[REKAP SEKOLAH] GET REKAP SEKOLAH KURIKULUM SP';
export const GET_REKAP_SEKOLAH_AKREDITASI = '[REKAP SEKOLAH] GET REKAP SEKOLAH AKREDITASI';
export const GET_REKAP_SEKOLAH_AKREDITASI_SP = '[REKAP SEKOLAH] GET REKAP SEKOLAH AKREDITASI SP';
export const GET_REKAP_SEKOLAH_TOTAL = '[REKAP SEKOLAH] GET REKAP SEKOLAH TOTAL';



export function getRekapSekolahTotal(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahTotal', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_TOTAL,
            payload: response.data,
            routeParams
        })
    });

}

// ringkasan
export function getRekapSekolahRingkasan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahRingkasan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_RINGKASAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSekolahRingkasanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahRingkasanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_RINGKASAN_SP,
            payload: response.data,
            routeParams
        })
    });

}

// waktu penyelenggaraan
export function getRekapSekolahWaktuPenyelenggaraan(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahWaktuPenyelenggaraan', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSekolahWaktuPenyelenggaraanSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahWaktuPenyelenggaraanSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_WAKTU_PENYELENGGARAAN_SP,
            payload: response.data,
            routeParams
        })
    });

}


// kurikulum
export function getRekapSekolahKurikulum(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahKurikulum', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_KURIKULUM,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSekolahKurikulumSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahKurikulumSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_KURIKULUM_SP,
            payload: response.data,
            routeParams
        })
    });

}


// akreditasi
export function getRekapSekolahAkreditasi(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahAkreditasi', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_AKREDITASI,
            payload: response.data,
            routeParams
        })
    });

}

export function getRekapSekolahAkreditasiSp(routeParams)
{

    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRekapSekolahAkreditasiSp', {
        ...routeParams
    });
    
    return (dispatch) =>
    request.then((response) =>
    {
        dispatch({
            type   : GET_REKAP_SEKOLAH_AKREDITASI_SP,
            payload: response.data,
            routeParams
        })
    });

}