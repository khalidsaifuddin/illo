import axios from 'axios/index';

export const SIMPAN_SEKOLAH = '[SEKOLAH] SIMPAN_SEKOLAH';
export const GET_SEKOLAH = '[SEKOLAH] GET_SEKOLAH';
export const GET_SEKOLAH_INDIVIDU = '[SEKOLAH] GET_SEKOLAH_INDIVIDU';
export const GET_SEKOLAH_PENGGUNA = '[SEKOLAH] GET_SEKOLAH_PENGGUNA';
export const AKTIFKAN_SEKOLAH = '[SEKOLAH] AKTIFKAN_SEKOLAH';
export const SIMPAN_SEKOLAH_PENGGUNA = '[SEKOLAH] SIMPAN_SEKOLAH_PENGGUNA';
export const SIMPAN_UNDANGAN_SEKOLAH = '[SEKOLAH] SIMPAN_UNDANGAN_SEKOLAH';
export const GET_UNDANGAN_SEKOLAH = '[SEKOLAH] GET_UNDANGAN_SEKOLAH';
export const GET_GURUS = '[SEKOLAH] GET_GURUS';
export const SIMPAN_PENGATURAN_SEKOLAH = '[SEKOLAH] SIMPAN_PENGATURAN_SEKOLAH';
export const GET_PENGATURAN_SEKOLAH = '[SEKOLAH] GET_PENGATURAN_SEKOLAH';
export const SIMPAN_SEKOLAH_UTAMA = '[SEKOLAH] SIMPAN_SEKOLAH_UTAMA';
export const SIMPAN_ADMINISTRATOR = '[SEKOLAH] SIMPAN_ADMINISTRATOR';
export const GET_SESI_KUIS_PENGGUNA = '[SEKOLAH] GET_SESI_KUIS_PENGGUNA';
export const GET_JARAK_SEKOLAH = '[SEKOLAH] GET_JARAK_SEKOLAH';
export const UPLOAD_DOKUMEN_GURU = '[SEKOLAH] UPLOAD_DOKUMEN_GURU';
export const GET_DOKUMEN_GURU = '[SEKOLAH] GET_DOKUMEN_GURU';
export const SIMPAN_RUANG_SEKOLAH = '[SEKOLAH] SIMPAN_RUANG_SEKOLAH';
export const GET_TAHUN_AJARAN = '[SEKOLAH] GET_TAHUN_AJARAN';
export const GET_RUANG_SEKOLAH = '[SEKOLAH] GET_RUANG_SEKOLAH';
export const GET_SISWA_SEKOLAH = '[SEKOLAH] GET_SISWA_SEKOLAH';
export const GET_DEPOSIT_SISWA_SEKOLAH = '[SEKOLAH] GET_DEPOSIT_SISWA_SEKOLAH';
export const SIMPAN_DEPOSIT_SISWA = '[SEKOLAH] SIMPAN_DEPOSIT_SISWA';
export const GET_DEPOSIT_SISWA = '[SEKOLAH] GET_DEPOSIT_SISWA';
export const GET_KEHADIRAN_RUANG = '[SEKOLAH] GET_KEHADIRAN_RUANG';
export const SIMPAN_KEHADIRAN_RUANG = '[SEKOLAH] SIMPAN_KEHADIRAN_RUANG';

export function getKehadiranRuang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/getKehadiranRuang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KEHADIRAN_RUANG,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKehadiranRuang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/simpanKehadiranRuang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KEHADIRAN_RUANG,
                payload: response.data,
                routeParams
            })
        );
}

export function getSiswaSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/getSiswaSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SISWA_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getDepositSiswaSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/getDepositSiswaSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DEPOSIT_SISWA_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanDepositSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/simpanDepositSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_DEPOSIT_SISWA,
                payload: response.data,
                routeParams
            })
        );
}

export function getDepositSiswa(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Siswa/getDepositSiswa', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DEPOSIT_SISWA,
                payload: response.data,
                routeParams
            })
        );
}

export function getTahunAjaran(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getTahunAjaran', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_TAHUN_AJARAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getRuangSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getRuangSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_RUANG_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanRuangSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanRuangSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_RUANG_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getSekolahIndividu2(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getSekolahIndividu', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SEKOLAH_INDIVIDU,
                payload: response.data,
                routeParams
            })
        );
}

export function aktifkanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/aktifkanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : AKTIFKAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanSekolahPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanSekolahPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_SEKOLAH_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function getSekolahPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getSekolahPengguna', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_SEKOLAH_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanUndanganSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanUndanganSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_UNDANGAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getUndanganSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getUndanganSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_UNDANGAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getGuruSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GURUS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPengaturanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanPengaturanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PENGATURAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function getPengaturanSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getPengaturanSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PENGATURAN_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanSekolahUtama(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanSekolahUtama', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_SEKOLAH_UTAMA,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanAdministrator(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/simpanAdministrator', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_ADMINISTRATOR,
                payload: response.data,
                routeParams
            })
        );
}

export function getJarakSekolah(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getJarakSekolah', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_JARAK_SEKOLAH,
                payload: response.data,
                routeParams
            })
        );
}

export function uploadDokumenGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/uploadDokumenGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : UPLOAD_DOKUMEN_GURU,
                payload: response.data,
                routeParams
            })
        );
}

export function getDokumenGuru(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Sekolah/getDokumenGuru', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_DOKUMEN_GURU,
                payload: response.data,
                routeParams
            })
        );
}