import http from '@/utils/http';
import { TableListParams, CreatedFormItem, UpdatedFormItem } from './data.d';

export async function list(params?: TableListParams) {
    return http('/system/department/list', {
        params,
    });
}

export async function created(params: CreatedFormItem) {
    return http('/system/department/created', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function updated(params: UpdatedFormItem) {
    return http('/system/department/updated', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function deleted(params: TableListParams) {
    return http('/system/department/deleted', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function project() {
    return http('/system/department/project');
}
