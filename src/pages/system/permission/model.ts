import { Effect, Reducer } from 'umi';
import { TableListItem } from './data.d';
import { list, created, updated, deleted } from './service';

export interface PermissionState {
    list: TableListItem[];
    success: boolean;
    key: number[];
}

export interface ModelType {
    namespace: string;
    state: PermissionState;
    effects: {
        fetch: Effect;
        created: Effect;
        updated: Effect;
        deleted: Effect;
    };
    reducers: {
        queryList: Reducer<PermissionState>;
    };
}

const Model: ModelType = {
    namespace: 'permission',

    state: {
        key: [],
        list: [],
        success: false,
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(list, payload);
            yield put({
                type: 'queryList',
                payload: response,
            });
        },
        *created({ payload, callback }, { call }) {
            const res = yield call(created, payload);
            callback(res)
        },
        *updated({ payload, callback }, { call }) {
            const res = yield call(updated, payload);
            callback(res)
        },
        *deleted({ payload, callback }, { call }) {
            const res = yield call(deleted, payload);
            callback(res)
        },
    },
    reducers: {
        queryList(state, action) {
            const { data, success, key } = action.payload
            return {
                ...state,
                list: data,
                success,
                key
            };
        }
    },
};

export default Model;