import axios from 'axios/index';

export const SIMPAN_PLAYLIST = '[TUGAS] SIMPAN_PLAYLIST';
export const GET_PLAYLIST = '[TUGAS] GET_PLAYLIST';
export const GET_PLAYLIST_KUIS = '[TUGAS] GET_PLAYLIST_KUIS';
export const SIMPAN_PLAYLIST_KUIS = '[TUGAS] SIMPAN_PLAYLIST_KUIS';

export function simpanPlaylist(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Playlist/simpanPlaylist', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PLAYLIST,
                payload: response.data,
                routeParams
            })
        );
}

export function getPlaylist(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Playlist/getPlaylist', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PLAYLIST,
                payload: response.data,
                routeParams
            })
        );
}

export function getPlaylistKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Playlist/getPlaylistKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PLAYLIST_KUIS,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanPlaylistKuis(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Playlist/simpanPlaylistKuis', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PLAYLIST_KUIS,
                payload: response.data,
                routeParams
            })
        );
}