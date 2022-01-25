import http from '@/utils/http';

export interface LoginParamsType {
    username?: string;
    password?: string;
    mobile?: string;
    captcha?: string;
    type?: string
}

export async function login(params: LoginParamsType) {
    return http('/user/guard/login', {
        method: 'POST',
        data: params,
    });
}

export async function currentUser() {
    return http('/user/index/index');
}

export async function permission(): Promise<any> {
    return http('/user/index/permission');
}
