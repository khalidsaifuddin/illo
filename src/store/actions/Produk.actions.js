import axios from 'axios/index';

export const GET_KATEGORI_PRODUK = '[PRODUK] GET_KATEGORI_PRODUK';
export const SIMPAN_KATEGORI_PRODUK = '[PRODUK] SIMPAN_KATEGORI_PRODUK';
export const GET_PRODUK = '[PRODUK] GET_PRODUK';
export const SIMPAN_PRODUK = '[PRODUK] SIMPAN_PRODUK';
export const GET_HARGA_PRODUK = '[PRODUK] GET_HARGA_PRODUK';
export const GET_GAMBAR_PRODUK = '[PRODUK] GET_GAMBAR_PRODUK';
export const GET_BATCH = '[PRODUK] GET_BATCH';
export const GET_STOK_TOTAL = '[PRODUK] GET_STOK_TOTAL';
export const SIMPAN_BATCH = '[PRODUK] SIMPAN_BATCH';
export const GET_KERANJANG = '[PRODUK] GET_KERANJANG';
export const SIMPAN_KERANJANG = '[PRODUK] SIMPAN_KERANJANG';
export const GET_VARIAN = '[PRODUK] GET_VARIAN';
export const SIMPAN_VARIAN = '[PRODUK] SIMPAN_VARIAN';
export const GENERATE_KODE_PRODUK = '[PRODUK] GENERATE_KODE_PRODUK';
export const GET_KODE_PRODUK = '[PRODUK] GET_KODE_PRODUK';

//fungsinya

export function getKodeProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getKodeProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KODE_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function generateKodeProduk(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/generateKodeProduk', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GENERATE_KODE_PRODUK,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanVarian(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/simpanVarian', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_VARIAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getVarian(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getVarian', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_VARIAN,
                payload: response.data,
                routeParams
            })
        );
}

export function getKeranjang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getKeranjang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_KERANJANG,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanKeranjang(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/simpanKeranjang', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : SIMPAN_KERANJANG,
                payload: response.data,
                routeParams
            })
        );
}

export function getStokTotal(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getStokTotal', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_STOK_TOTAL,
                payload: response.data,
                routeParams
            })
        );
}

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

export function getBatch(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/getBatch', {
        ...routeParams
    });

    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_BATCH,
                payload: response.data,
                routeParams
            })
        );
}

export function simpanBatch(routeParams)
{
    const request = axios.post(localStorage.getItem('api_base')+'/api/Produk/simpanBatch', {
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