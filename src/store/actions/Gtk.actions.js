import axios from 'axios/index';

export const GET_GTK_JENIS_KELAMIN_CHART = '[GTK] GET GTK JENIS KELAMIN CHART';
export const GET_GTK_JENIS_KELAMIN_TABEL = '[GTK] GET GTK JENIS KELAMIN TABEL';
export const GET_GTK_KUALIFIKASI_CHART = '[GTK] GET GTK KUALIFIKASI CHART';
export const GET_GTK_KUALIFIKASI_TABEL = '[GTK] GET GTK KUALIFIKASI TABEL';
export const GET_GTK_NUPTK_CHART = '[GTK] GET GTK NUPTK CHART';
export const GET_GTK_JENIS_PIE = '[GTK] GET GTK JENIS PIE';
export const GET_GTK_NUPTK_TABEL = '[GTK] GET GTK NUPTK TABEL';

export function getGtkJenisPie(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGTKJenisPie', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_JENIS_PIE,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkJenisKelaminChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkJenisKelamin', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_JENIS_KELAMIN_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkJenisKelaminTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkJenisKelamin', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_JENIS_KELAMIN_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkKualifikasiChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkKualifikasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_KUALIFIKASI_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkKualifikasiTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkKualifikasi', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_KUALIFIKASI_TABEL,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkNUPTKChart(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkNUPTK', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_NUPTK_CHART,
                payload: response.data,
                routeParams
            })
        );
}

export function getGtkNUPTKTabel(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Gtk/getGtkNUPTK', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GTK_NUPTK_TABEL,
                payload: response.data,
                routeParams
            })
        );
}