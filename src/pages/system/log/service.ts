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
    return http('/system/log/list', {
        method: 'GET',
        params: {
            ...params,
        },
    });
}

export async function options() {
    return http('/system/log/options');
}

export async function deleted(params: any) {
    return http('/system/log/deleted', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

