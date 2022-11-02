/*
export function fetch(endpoint) {
    const response = ref()

    const request = async () => {
        const res = await fetch(url, options)
        response.value = await res.json()
    }

    return {response, request}
}
*/

export const options =   {
                auth: {
                    username: "",
                    password: ""
                },
                validateStatus: function (status) {
                    return status < 500;
                }
            }

export function fetch(endpoint, withOptions = true) {
    if(withOptions)
        return axios.get(HOST + endpoint, options)
    else
        return axios.get(HOST + endpoint)
}

export function set(endpoint, body) {
    return axios.put(HOST + endpoint, body, options)
}