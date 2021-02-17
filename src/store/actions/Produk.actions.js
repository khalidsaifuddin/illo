import axios from 'axios/index';

export const GET_KATEGORI_PRODUK = '[PRODUK] GET_KATEGORI_PRODUK';
export const SIMPAN_KATEGORI_PRODUK = '[PRODUK] SIMPAN_KATEGORI_PRODUK';
export const GET_PRODUK = '[PRODUK] GET_PRODUK';
export const SIMPAN_PRODUK = '[PRODUK] SIMPAN_PRODUK';
export const GET_HARGA_PRODUK = '[PRODUK] GET_HARGA_PRODUK';
export const GET_GAMBAR_PRODUK = '[PRODUK] GET_GAMBAR_PRODUK';

export function getGambarProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getGambarProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_GAMBAR_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function getHargaProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getHargaProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_HARGA_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function getKategoriProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getKategoriProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KATEGORI_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKategoriProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/simpanKategoriProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KATEGORI_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function getProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/simpanProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}