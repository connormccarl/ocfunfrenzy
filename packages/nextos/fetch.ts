export const fetch = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method: string) {
    return (url: string, body?: any): Promise<any> => {
        const requestOptions: { [key: string]: any } = {
            method,
            headers: {
                'Content-Type': undefined
            }
        };
        if (body) {
            if(!(body instanceof FormData)){
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            } else {
                requestOptions.body = body;
            }
        }
        return globalThis.fetch(url, requestOptions).then(handleResponse);
    }
}

async function handleResponse(response: any) {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    // check for error response
    if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}