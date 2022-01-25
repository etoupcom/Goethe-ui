export interface TableListItem {
    key: number;
    disabled?: boolean;
    href: string;
    avatar: string;
    name: string;
    owner: string;
    desc: string;
    callNo: number;
    status: number;
    updatedAt: Date;
    createdAt: Date;
    progress: number;
}

export interface CreatedFormItem {
    parent_id?: number;
    title: string;
    name: string;
    display_name: string;
    url?: string;
    icon?: string;
    guard_name?: string;
    sort?: number;
}

export interface UpdatedFormItem {
    id?: number;
    parent_id: number;
    value?: number;
    title?: string;
    name?: string;
    display_name?: string;
    url?: string;
    icon?: string;
    guard_name?: string;
    sort?: number;
    type?: number | string;
}

export interface TableListPagination {
    total: number;
    pageSize: number;
    current: number;
}

export interface TableListData {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
}

export interface TableListParams {
    id?: number;
    status?: string;
    name?: string;
    desc?: string;
    key?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
}
