import http from '@/utils/http';

export async function list(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
) {
    return http('/system/notice/list', {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function department() {
    return http('/system/notice/department');
}

export async function user() {
    return http('/system/notice/user');
}

export async function created(params: any) {
    return http('/system/notice/created', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function deleted(params: any) {
    return http('/system/notice/deleted', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function withdraw(params: any) {
    return http('/system/notice/withdraw', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

