import axios from 'axios/index';

export const GET_PESERTA_DIDIK_JENIS_KELAMIN_CHART = '[PESERTA DIDIK] GET PESERTA DIDIK JENIS KELAMIN CHART';
export const GET_PESERTA_DIDIK_JENIS_KELAMIN_TABEL = '[PESERTA DIDIK] GET PESERTA DIDIK JENIS KELAMIN TABEL';
export const GET_PESERTA_DIDIK_TINGKAT_KELAS_CHART = '[PESERTA DIDIK] GET PESERTA DIDIK TINGKAT KELAS CHART';
export const GET_PESERTA_DIDIK_TINGKAT_KELAS_PIE = '[PESERTA DIDIK] GET PESERTA DIDIK TINGKAT KELAS PIE';
export const GET_PESERTA_DIDIK_TINGKAT_KELAS_TABEL = '[PESERTA DIDIK] GET PESERTA DIDIK TINGKAT KELAS TABEL';
export const GET_PESERTA_DIDIK_USIA_CHART = '[PESERTA DIDIK] GET PESERTA DIDIK USIA CHART';
export const GET_PESERTA_DIDIK_USIA_TABEL = '[PESERTA DIDIK] GET PESERTA DIDIK USIA TABEL';

export function getPesertaDidikJenisKelaminChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikJenisKelamin', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_JENIS_KELAMIN_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikJenisKelaminTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikJenisKelamin', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_JENIS_KELAMIN_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikTingkatKelasPie(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikTingkatKelasPie', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_TINGKAT_KELAS_PIE,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikTingkatKelasChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikTingkatKelas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_TINGKAT_KELAS_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikTingkatKelasTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikTingkatKelas', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_TINGKAT_KELAS_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikUsiaChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikUsia', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_USIA_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getPesertaDidikUsiaTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/PesertaDidik/getPesertaDidikUsia', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PESERTA_DIDIK_USIA_TABEL,
                payload: response.data,
                routeParams
            })
        );
}