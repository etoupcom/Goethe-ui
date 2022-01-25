import http from '@/utils/http';
import { CreatedFormItem, UpdatedFormItem, BindItem } from './data.d';

export async function list(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
) {
    return http('/system/role/list', {
        method: 'GET',
        params: {
            ...params,
        },
    })
}

export async function created(params: CreatedFormItem) {
    return http('/system/role/created', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}

export async function updated(params: UpdatedFormItem) {
    return http('/system/role/updated', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}

export async function deleted(params: any) {
    return http('/system/role/deleted', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}

export async function project() {
    return http('/system/role/project');
}

export async function permission(params: any) {
    return http('/system/role/permission', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function bind(params: BindItem) {
    return http('/system/role/bind', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}

export async function clear(params: BindItem) {
    return http('/system/role/clear', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}







