export const options =   {
                auth: {
                    username: null,
                    password: null
                },
                validateStatus: function (status) {
                    return status <= 500;
                }
            }

export function fetch(endpoint, withOptions = true) {
    if(withOptions)
        return axios.get(HOST + endpoint, options)
    else
        return axios.get(HOST + endpoint)
}

export function set(endpoint, body, isJson = false) {
    if(isJson) {
        options.headers = {'Content-Type': "application/json"};
    }
    
    return axios.put(HOST + endpoint, body, options)
}

export function create(endpoint, body) {
    return axios.post(HOST + endpoint, body, options)
}

export function remove(endpoint, withOptions = true) {
    if(withOptions)
        return axios.delete(HOST + endpoint, options)
    else
        return axios.delete(HOST + endpoint)
}