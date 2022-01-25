import http from '@/utils/http';
import { TableListParams, CreatedFormItem, UpdatedFormItem, FormValueType } from './data.d';

export async function list(params?: TableListParams) {
    return http('/project/index/list', {
        params,
    });
}

export async function created(params: CreatedFormItem) {
    return http('/project/index/created', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function updated(params: UpdatedFormItem) {
    return http('/project/index/updated', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function freeze(params: FormValueType) {
    return http('/project/index/freeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function unfreeze(params: FormValueType) {
    return http('/project/index/unfreeze', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}