export function setToken(token: object) {
    return localStorage.setItem('antd-pro-token', JSON.stringify(token));
}

export function getToken() {
    return localStorage.getItem('antd-pro-token');
}