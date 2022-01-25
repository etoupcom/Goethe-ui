export interface TableListParams {
    id?: number;
    key?: number;
    value?: number;
    user_id?: number;
    project_id?: number;
    department_id?: number;
    username?: string;
    real_name?: string;
    mobile?: string;
    project_name?: string;
    department_name?: string;
    role?: any[];
    years?: string;
    first_duty_date?: string;
    sex?: string;
    age?: string;
    telephone?: string;
    email?: string;
    host?: string;
    title?: string;
    remark?: string;
    type?: number;
    status?: number;
    created_at?: Date
}

export interface ProjectParams {
    id?: number;
    name?: string;
}

export interface DetailParams {
    id?: number;
    title?: string;
    content?: string;
    files: any[];
    type: number;
    status: number;
    created_at?: Date
}

export interface OptionParams {
    value: number;
    label: React.ReactNode;
}

export interface TreeSelectParams {
    value: number;
    title: React.ReactNode;
    children: TreeSelectParams[]
}

export interface CreatedFormItem {
    name: string;
    description: string;
}

export interface UpdatedFormItem {
    id?: number;
    username?: string;
    birthday?: any;
    roles?: any;
}

export interface OptionParams {
    value: number;
    label: React.ReactNode;
}

export interface TreeSelectParams {
    value: number;
    title: React.ReactNode;
    children: TreeSelectParams[]
}

export interface RoleItem {
    id: number;
    name: string;
}

export interface InfoItem {
    department: any[];
    project: any[];
    role: any[];
}
