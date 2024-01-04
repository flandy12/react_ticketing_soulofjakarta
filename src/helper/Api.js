async function CallApi(url, method, data = {}) {
    // 1. Create a new instance of the API client (you can use one shared instance for all requests)

    const GetUrl = process.env.REACT_APP_ENVIRONMENT === 'development' ? process.env.REACT_APP_URL_DEV : process.env.REACT_APP_URL;

    const GetKey = process.env.REACT_APP_ENVIRONMENT === 'development' ? process.env.REACT_APP_KEY_DEV : process.env.REACT_APP_KEY;

    let headers = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
            'x-client-token': GetKey,
        },
    }

    Object.keys(data).map((value, key) => {
        Headers[key] = value
    });

    const ressponse = await fetch(`${GetUrl}${url}`, headers);
    return ressponse.json();
     
}

export default CallApi;