import axios from 'axios/index';

export const SIMPAN_PERTANYAAN = '[PERTANYAAN] SIMPAN PERTANYAAN';
export const SIMPAN_PERTANYAAN_SEKOLAH = '[PERTANYAAN] SIMPAN_PERTANYAAN_SEKOLAH';
export const GET_PERTANYAAN_SEKOLAH = '[PERTANYAAN] GET_PERTANYAAN_SEKOLAH';
export const GET_PERTANYAAN_RUANG = '[PERTANYAAN] GET_PERTANYAAN_RUANG';
export const GET_PERTANYAAN_PUBLIK = '[PERTANYAAN] GET_PERTANYAAN_PUBLIK';
export const GET_PERTANYAAN = '[PERTANYAAN] GET PERTANYAAN';
export const GET_PERTANYAAN_PANTAUAN = '[PERTANYAAN] GET PERTANYAAN PANTAUAN';
export const SIMPAN_JAWABAN = '[PERTANYAAN] SIMPAN JAWABAN';
export const HAPUS_JAWABAN = '[PERTANYAAN] HAPUS_JAWABAN';
export const HAPUS_PERTANYAAN = '[PERTANYAAN] HAPUS_PERTANYAAN';
export const GET_JAWABAN = '[PERTANYAAN] GET JAWABAN';
export const SIMPAN_KOMENTAR = '[PERTANYAAN] SIMPAN KOMENTAR';
export const SIMPAN_DUKUNGAN = '[PERTANYAAN] SIMPAN DUKUNGAN';
export const SIMPAN_PANTAUAN = '[PERTANYAAN] SIMPAN PANTAUAN';

export function simpanPantauan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanPantauan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PANTAUAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPertanyaan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanPertanyaan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PERTANYAAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPertanyaanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanPertanyaanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PERTANYAAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getPertanyaanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaanRuang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getPertanyaanRuang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN_RUANG,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaanPublik(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getPertanyaanPublik', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN_PUBLIK,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getPertanyaan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getPertanyaanPantauan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getPertanyaanPantauan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PERTANYAAN_PANTAUAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanJawaban(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanJawaban', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_JAWABAN,
                payload: response.data,
                routeParams
            })
        );
}

export function hapusJawaban(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/hapusJawaban', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : HAPUS_JAWABAN,
                payload: response.data,
                routeParams
            })
        );
}

export function hapusPertanyaan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/hapusPertanyaan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : HAPUS_PERTANYAAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getJawaban(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/getJawaban', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JAWABAN,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKomentar(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanKomentar', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KOMENTAR,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanDukungan(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Pertanyaan/simpanDukungan', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_DUKUNGAN,
                payload: response.data,
                routeParams
            })
        );
}
