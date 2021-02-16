import axios from 'axios/index';

export const GET_KATEGORI_PRODUK = '[PRODUK] GET_KATEGORI_PRODUK';
export const SIMPAN_KATEGORI_PRODUK = '[PRODUK] SIMPAN_KATEGORI_PRODUK';



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