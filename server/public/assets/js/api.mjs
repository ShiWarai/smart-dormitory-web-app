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

export function fetch(endpoint, options) {
    return axios.get(HOST + endpoint, options)
}

export function set(endpoint, body, options) {
    return axios.put(HOST + endpoint, body, options)
}