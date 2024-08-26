import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// custom requests
const _get = (url: string) => {
    return apiClient.get(url)
}

const _getWithToken = (url: string, accessToken: string) => {
    return apiClient.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const _post = (url: string, data = {}) => {
    return apiClient.post(url, data)
}

const _postWithToken = (url: string, data = {}, accessToken: string) => {
    return apiClient.post(url, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const _patchWithToken = (url: string, data = {}, accessToken: string) => {
    return apiClient.patch(url, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const _deleteWithToken = (url: string, accessToken: string) => {
    return apiClient.delete(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const useApiClient = {
    _get,
    _getWithToken,
    _post,
    _postWithToken,
    _patchWithToken,
    _deleteWithToken
}

export default useApiClient