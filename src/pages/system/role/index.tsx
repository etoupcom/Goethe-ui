import { Button, Modal, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';
import { TableListParams, CreatedFormItem, UpdatedFormItem, OptionParams, TableListItem } from './data.d'
import { list, created, updated, deleted, project, clear } from './service';
import ProjectSelect from './components/ProjectSelect';
import Created from './components/Created';
import Updated from './components/Updated';
import Bind from './components/Bind';

const TableList: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [visible, handleVisible] = useState<boolean>(false);
    const [createdVisible, handleCreatedVisible] = useState<boolean>(false);
    const [updatedVisible, handleUpdatedVisible] = useState<boolean>(false);
    const [selectedRowsState, setSelectedRows] = useState<TableListParams[]>([]);
    const [formValues, setFormValues] = useState<Partial<UpdatedFormItem>>({});
    const [projectList, setProjectList] = useState<OptionParams[]>([]);
    const [item, setItem] = useState<TableListItem>();
    const access = useAccess();

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */
    const intl = useIntl();

    const columns: ProColumns[] = [
        {
            title: '标识',
            dataIndex: 'code',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '所属项目',
            dataIndex: 'project_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '所属项目',
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
            title: '状态',
            dataIndex: 'status',
            filters: true,
            onFilter: true,
            valueType: 'select',
            valueEnum: {
                40: {
                    text: '冻结',
                    status: 'Error',
                },
                80: {
                    text: '正常',
                    status: 'Success',
                    disabled: true,
                },
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
                <Access key='a' accessible={access.canRoleUpdated} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a key='a' onClick={() => {
                        setFormValues(record)
                        handleUpdatedVisible(true)
                    }}>
                        更新
                    </a>
                </Access>,
                <Access key='b' accessible={access.canRoleBind} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a onClick={() => {
                        handleVisible(true);
                        setItem(record)
                    }}>
                        授权
                    </a>
                </Access>,
                <Access key='c' accessible={access.canRoleClear} fallback={
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


            ],
        },
    ];

    useEffect(() => {
        let isUnmounted = false;
        project().then((res: any) => {
            if (res.status === 'success') {
                if (!isUnmounted) {
                    setProjectList(res.data.map((v: any) => { return { value: v.id, label: v.name } }))
                }
            }
        })
        return () => {
            isUnmounted = true;
        }
    }, []);

    const CreatedButton = () => {
        const { canRoleCreated } = access
        return canRoleCreated ? <Button
            type="primary"
            key="primary"
            onClick={() => handleCreatedVisible(true)}
        >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
        </Button> : null
    }

    const DeletedButton = () => {
        const { canRoleDeleted } = access
        return canRoleDeleted ? <Button
            danger
            type="primary"
            onClick={async () => {
                await handleRemove(selectedRowsState);

            }}
        >
            <FormattedMessage
                id="pages.searchTable.batchDeletion"
                defaultMessage="Batch deletion"
            />
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

    const handleRemove = async (items: TableListParams[]) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '删除后无法显示，确定要批量删除选择项？',
            onOk() {
                deleted({ key: items.map((v: any) => v.id) }).then((res: any): void => {
                    if (res.status === 'success') {
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                        message.success('操作成功');
                    }
                })
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
                            <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
                            <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                            <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
                        </div>
                    }
                >
                    <DeletedButton />
                </FooterToolbar>
            )}
            <Bind
                fields={item}
                visible={visible}
                onCancel={() => handleVisible(false)}
            />
            <Created
                options={projectList}
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
                        options={projectList}
                        visible={updatedVisible}
                        fields={formValues}
                        onUpdated={handleUpdated}
                        onCancel={() => handleUpdatedVisible(false)}
                    />
                )
            }
        </PageContainer>
    );
};

export default TableList;
