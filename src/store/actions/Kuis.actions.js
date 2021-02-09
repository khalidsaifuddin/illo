import axios from 'axios/index';

export const GENERATE_UUID = '[KUIS] GENERATE UUID';
export const SIMPAN_KUIS = '[KUIS] SIMPAN KUIS';
export const GET_KUIS = '[KUIS] GET KUIS';
export const GET_PERTANYAAN_KUIS = '[KUIS] GET PERTANYAAN KUIS';
export const SET_KUIS = '[KUIS] SET KUIS';
export const GET_PENGGUNA_KUIS = '[KUIS] GET PENGGUNA KUIS';
export const SIMPAN_PENGGUNA_KUIS = '[KUIS] SIMPAN PENGGUNA KUIS';
export const SIMPAN_JAWABAN_KUIS = '[KUIS] SIMPAN JAWABAN KUIS';
export const SIMPAN_JAWABAN_KUIS_ISIAN = '[KUIS] SIMPAN_JAWABAN_KUIS_ISIAN';
export const SIMPAN_JAWABAN_KUIS_CHECKBOX = '[KUIS] SIMPAN_JAWABAN_KUIS_CHECKBOX';
export const GET_KUIS_DIIKUTI = '[KUIS] GET KUIS DIIKUTI';
export const GET_KUIS_RUANG = '[KUIS] GET KUIS RUANG';
export const GET_SESI_KUIS = '[KUIS] GET SESI KUIS';
export const SET_SESI_KUIS = '[KUIS] SET SESI KUIS';
export const GET_KUIS_TRENDING = '[KUIS] GET KUIS TRENDING';
export const GET_LAPORAN_HASIL = '[KUIS] GET LAPORAN HASIL';
export const HAPUS_SESI_KUIS = '[KUIS] HAPUS SESI KUIS';
export const HAPUS_KUIS = '[KUIS] HAPUS KUIS';
export const AKTIVITAS_KUIS = '[KUIS] AKTIVITAS KUIS';
export const SIMPAN_PERTANYAAN_KUIS = '[KUIS] SIMPAN_PERTANYAAN_KUIS';
export const GET_STAT_KUIS = '[KUIS] GET_STAT_KUIS';
export const GET_COUNT_KUIS_UMUM = '[KUIS] GET_COUNT_KUIS_UMUM';
export const GET_SESI_KUIS_PENGGUNA = '[KUIS] GET_SESI_KUIS_PENGGUNA';
export const GET_KOLABORASI_KUIS = '[KUIS] GET_KOLABORASI_KUIS';
export const SIMPAN_KOLABORASI_KUIS = '[KUIS] SIMPAN_KOLABORASI_KUIS';
export const SIMPAN_ASPEK = '[KUIS] SIMPAN_ASPEK';
export const GET_ASPEK = '[KUIS] GET_ASPEK';
export const GET_ASPEK_REVERSED = '[KUIS] GET_ASPEK_REVERSED';
export const GET_JAWABAN_PENGGUNA_KUIS = '[KUIS] GET_JAWABAN_PENGGUNA_KUIS';

export function generateUUID(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/generateUUID', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GENERATE_UUID,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function getKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaanKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getPertanyaanKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function setKuis(routeParams)
{

    return (dispatch) => {
        return dispatch ({
            type: SET_KUIS,
            payload: routeParams
        })
    }
}

export function getPenggunaKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getPenggunaKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PENGGUNA_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPenggunaKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanPenggunaKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PENGGUNA_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanJawabanKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanJawabanKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_JAWABAN_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanJawabanKuisIsian(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanJawabanKuisIsian', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_JAWABAN_KUIS_ISIAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanJawabanKuisCheckbox(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanJawabanKuisCheckbox', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_JAWABAN_KUIS_CHECKBOX,
                payload: response.data,
                routeParams
            })
        );
}

export function getKuisDiikuti(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getKuisDiikuti', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KUIS_DIIKUTI,
                payload: response.data,
                routeParams
            })
        );
}

export function getKuisRuang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getKuisRuang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KUIS_RUANG,
                payload: response.data,
                routeParams
            })
        );
}

export function getSesiKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getSesiKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SESI_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function setSesiKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/setSesiKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SET_SESI_KUIS,
                payload: response.data,
                routeParams
            })
        );
}


export function getKuisTrending(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getKuisTrending', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KUIS_TRENDING,
                payload: response.data,
                routeParams
            })
        );
}

export function getLaporanHasilKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getLaporanHasilKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_LAPORAN_HASIL,
                payload: response.data,
                routeParams
            })
        );
}


export function hapusSesiKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/hapusSesiKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : HAPUS_SESI_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function hapusKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/hapusKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : HAPUS_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function aktivitasKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/aktivitasKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : AKTIVITAS_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPertanyaanKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanPertanyaanKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PERTANYAAN_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function getStatKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getStatKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_STAT_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function getCountKuisUmum(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getCountKuisUmum', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_COUNT_KUIS_UMUM,
                payload: response.data,
                routeParams
            })
        );
}

export function getSesiKuisPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getSesiKuisPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SESI_KUIS_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function getKolaborasiKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getKolaborasiKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KOLABORASI_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKolaborasiKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanKolaborasiKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KOLABORASI_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanAspek(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/simpanAspek', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_ASPEK,
                payload: response.data,
                routeParams
            })
        );
}

export function getAspek(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getAspek', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_ASPEK,
                payload: response.data,
                routeParams
            })
        );
}

export function getAspekReversed(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getAspekReversed', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_ASPEK_REVERSED,
                payload: response.data,
                routeParams
            })
        );
}

export function getJawabanPenggunaKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Kuis/getJawabanPenggunaKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JAWABAN_PENGGUNA_KUIS,
                payload: response.data,
                routeParams
            })
        );
}