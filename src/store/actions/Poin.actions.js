import axios from 'axios/index';

export const GET_LEADERBOARD_PENGGUNA = '[NOTIFIKASI] GET_LEADERBOARD_PENGGUNA';
export const GET_LEADERBOARD_GLOBAL = '[NOTIFIKASI] GET_LEADERBOARD_GLOBAL';



export function getLeaderboardPengguna(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Poin/getLeaderboardPengguna', {
        ...routeParams,
        tipe: 'belum_dibaca'
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_LEADERBOARD_PENGGUNA,
                payload: response.data,
                routeParams
            })
        );
}

export function getLeaderboardGlobal(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Poin/getLeaderboardGlobal', {
        ...routeParams,
        tipe: 'belum_dibaca'
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_LEADERBOARD_GLOBAL,
                payload: response.data,
                routeParams
            })
        );
}