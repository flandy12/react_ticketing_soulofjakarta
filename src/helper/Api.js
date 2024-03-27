export const GetKey = process.env.REACT_APP_ENVIRONMENT === 'development' ? process.env.REACT_APP_KEY_DEV : process.env.REACT_APP_KEY;
export const GetUrl = process.env.REACT_APP_ENVIRONMENT === 'development' ? process.env.REACT_APP_URL_DEV : process.env.REACT_APP_URL;
export async function CallApi(url, method, data = {}) {
    let headers = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    }

    Object.keys(data).map((value, key) => {
        headers[key] = value
    })

    let respon = await fetch(`${GetUrl}${url}`, method, headers)
    return await respon.json();
}


