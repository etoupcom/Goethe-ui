import http from '@/utils/http';
import { TableListParams, CreatedFormItem, UpdatedFormItem } from './data.d';

export async function list(params?: TableListParams) {
    return http('/system/permission/list', {
        params,
    });
}

export async function items(params?: TableListParams) {
    return http('/system/permission/items', {
        params,
    });
}

export async function created(params: CreatedFormItem) {
    return http('/system/permission/created', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function updated(params: UpdatedFormItem) {
    return http('/system/permission/updated', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function deleted(params: TableListParams) {
    return http('/system/permission/deleted', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
