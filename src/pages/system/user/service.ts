import http from '@/utils/http';
import { TableListParams, CreatedFormItem, UpdatedFormItem, BindItem, FormValueType } from './data.d';

export async function list(params?: TableListParams) {
    return http('/system/user/list', {
        params,
    });
}

export async function created(params: CreatedFormItem) {
    return http('/system/user/created', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function updated(params: UpdatedFormItem) {
    return http('/system/user/updated', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function info() {
    return http('/system/user/info');
}

export async function freeze(params: FormValueType) {
    return http('/system/user/freeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function unfreeze(params: FormValueType) {
    return http('/system/user/unfreeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function permission(params: any) {
    return http('/system/user/permission', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function bind(params: BindItem) {
    return http('/system/user/bind', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function clear(params: BindItem) {
    return http('/system/user/clear', {
        method: 'POST',
        data: {
            ...params,
        },
    })
}


