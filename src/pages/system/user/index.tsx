import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Tag, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TableListItem, TableListParams, CreatedFormItem, UpdatedFormItem, OptionParams, TreeSelectParams } from './data.d';
import { list, info, created, updated, freeze, unfreeze, clear } from './service';
import RoleSelect from './components/RoleSelect';
import ProjectSelect from './components/ProjectSelect';
import DepartmentSelect from './components/DepartmentSelect';
import Bind from './components/Bind';
import Created from './components/Created';
import Updated from './components/Updated';

const TableList: React.FC = () => {
    const [visible, handleVisible] = useState<boolean>(false);
    const [fields, setFields] = useState<TableListItem>();
    const [createdVisible, handleCreatedVisible] = useState<boolean>(false);
    const [updatedVisible, handleUpdatedVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<TableListParams[]>([]);
    const [formValues, setFormValues] = useState<Partial<UpdatedFormItem>>({});
    const [roleList, setRoleList] = useState<OptionParams[]>([]);
    const [projectList, setProjectList] = useState<OptionParams[]>([]);
    const [departmentList, setDepartmentList] = useState<TreeSelectParams[]>([]);
    const access = useAccess();
    const intl = useIntl();

    const columns: ProColumns<any>[] = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '手机号码',
            dataIndex: 'mobile',
            copyable: true,
        },
        {
            title: '姓名',
            dataIndex: 'real_name',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            valueEnum: {
                10: {
                    text: '男',
                },

                20: {
                    text: '女',
                }
            },
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '部门',
            dataIndex: 'department_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '角色',
            dataIndex: 'role',
            hideInSearch: true,
            hideInForm: true,
            render: (_, record: any) => record.role && record.role.map((v: any) => <Tag key={v} color="#87d068">{v}</Tag>)
        },

        {
            title: '项目',
            key: 'project_id',
            hideInTable: true,
            dataIndex: 'project_id',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null;
                }
                const project_id = form.getFieldValue('project_id')
                return (
                    <ProjectSelect
                        value={project_id}
                        project={projectList}
                    />
                );
            },
        },
        {
            title: '部门',
            key: 'department_id',
            hideInTable: true,
            dataIndex: 'department_id',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null;
                }
                const department_id = form.getFieldValue('department_id')
                return (
                    <DepartmentSelect
                        value={department_id}
                        department={departmentList}
                    />
                );
            },
        },
        {
            title: '角色',
            key: 'role',
            hideInTable: true,
            dataIndex: 'role',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null
                }
                const role_id = form.getFieldValue('role_id')
                return (
                    <RoleSelect
                        value={role_id}
                        role={roleList}
                    />
                )
            },
        },

        {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                40: {
                    text: '冻结',
                    status: 'Error',
                },

                80: {
                    text: '正常',
                    status: 'Success',
                }
            },
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            valueType: 'dateTime',
            hideInSearch: true,
            sorter: (a, b) => a.created_at - b.created_at,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'dateRange',
            hideInTable: true,
            width: 200,
            search: {
                transform: (value) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                },
            },
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Access key='a' accessible={access.canUserUpdated} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a
                        onClick={() => {
                            setFormValues(record)
                            handleUpdatedVisible(true)
                        }}
                    >
                        更新
                    </a>
                </Access>,
                <Access key='b' accessible={access.canUserBind} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a
                        onClick={() => {
                            handleVisible(true);
                            setFields(record)
                        }}
                    >
                        授权
                    </a>
                </Access>,
                <Access key='c' accessible={access.canUserClear} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a onClick={() => {
                        handleClear(record.id)
                    }}>
                        清空权限
                    </a>
                </Access>,
            ]
        },
    ];

    useEffect(() => {
        let isUnmounted = false;
        info().then((res: any) => {
            if (res.status === 'success') {
                const { department, project, role } = res.data
                if (!isUnmounted) {
                    setRoleList(role)
                    setProjectList(project)
                    setDepartmentList(department)
                }
            }
        })
        return () => {
            isUnmounted = true;
        }
    }, []);

    const CreatedButton = () => {
        const { canUserCreated } = access
        return canUserCreated ? <Button
            type="primary"
            key="primary"
            onClick={() => handleCreatedVisible(true)}
        >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
        </Button> : null
    }

    const FreezeButton = () => {
        const { canUserFreeze } = access
        return canUserFreeze ? <Button
            danger
            type="primary"
            onClick={async () => {
                await handleFreeze(selectedRowsState);
            }}
        >
            批量冻结
        </Button> : null
    }

    const UnfreezeButton = () => {
        const { canUserUnfreeze } = access
        return canUserUnfreeze ? <Button
            type="primary"
            onClick={async () => {
                await handleUnfreeze(selectedRowsState);
            }}
        >
            批量解冻
        </Button> : null
    }

    const handleCreated = async (fields: CreatedFormItem, form: FormInstance) => {
        const res = await created(fields)
        if (res.status === 'success') {
            form.resetFields()
            handleCreatedVisible(false)
            actionRef.current?.reloadAndRest?.();
            message.success('操作成功');
        }
    }

    const handleUpdated = async (fields: UpdatedFormItem, form: FormInstance) => {
        const res = await updated(fields)
        if (res.status === 'success') {
            form.resetFields()
            handleUpdatedVisible(false)
            actionRef.current?.reloadAndRest?.();
            message.success('操作成功');
        }
    }

    const handleFreeze = async (selectedRows: any) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '冻结后无法登录，确定要批量冻结选择项？',
            async onOk() {
                const res = await freeze({ key: selectedRows.map((v: any) => v.id) })
                if (res.status === 'success') {
                    handleUpdatedVisible(false)
                    actionRef.current?.reloadAndRest?.();
                    message.success('操作成功');
                }
            },
        });

    }

    const handleUnfreeze = async (selectedRows: any) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '解冻后可以登录，确定要批量解冻选择项？',
            async onOk() {
                const res = await unfreeze({ key: selectedRows.map((v: any) => v.id) })
                if (res.status === 'success') {
                    handleUpdatedVisible(false)
                    actionRef.current?.reloadAndRest?.();
                    message.success('操作成功');
                }
            },
        });
    }

    const handleClear = async (id: number) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '清空权限后可重新授权，确定要清空权限？',
            async onOk() {
                const res = await clear({ id })
                if (res.status === 'success') {
                    actionRef.current?.reloadAndRest?.();
                    message.success('操作成功');
                }
            },
        });
    }

    return (
        <PageContainer>
            <ProTable<TableListParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: 'Enquiry form',
                })}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <CreatedButton />,
                ]}
                request={async (params, sort, filter) => {
                    return list({ ...params, ...sort });
                }}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
                            <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                            <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
                        </div>
                    }
                >
                    <UnfreezeButton />
                    <FreezeButton />
                </FooterToolbar>
            )}
            <Bind
                fields={fields}
                visible={visible}
                onCancel={() => handleVisible(false)}
            />
            <Created
                visible={createdVisible}
                onCreated={handleCreated}
                onCancel={(form: FormInstance) => {
                    handleCreatedVisible(false)
                    form.resetFields()
                }}
            />
            {
                formValues && (
                    <Updated
                        fields={formValues}
                        visible={updatedVisible}
                        onUpdated={handleUpdated}
                        onCancel={() => handleUpdatedVisible(false)}
                    />
                )
            }
        </PageContainer>
    );
};

export default TableList;