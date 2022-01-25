import { useRef, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TableListParams, CreatedFormItem, UpdatedFormItem } from './data.d';
import { list, created, updated, freeze, unfreeze } from './service';
import Created from './components/Created';
import Updated from './components/Updated';

const TableList: React.FC = () => {
    const [createdVisible, handleCreatedVisible] = useState<boolean>(false);
    const [updatedVisible, handleUpdatedVisible] = useState<boolean>(false);
    const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<Partial<UpdatedFormItem>>({});
    const actionRef = useRef<ActionType>();
    const access = useAccess();
    const intl = useIntl();

    const columns: ProColumns<any>[] = [
        {
            title: '项目名称',
            dataIndex: 'name',
        },
        {
            title: '项目描述',
            dataIndex: 'description',
            valueType: 'textarea',
        },
        {
            title: '链接地址',
            dataIndex: 'path',
            width: 120,
            renderText: (v: string) => {
                return (
                    <a href={v} target='_blank'>{v}</a>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                40: {
                    text: '已冻结',
                    status: 'Error',
                },
                44: {
                    text: '已到期',
                    status: 'Error',
                },
                80: {
                    text: '正常',
                    status: 'Success',
                }
            },
        },
        {
            title: '到期时间',
            dataIndex: 'expire_at',
            sorter: true,
            valueType: 'dateTime',
            hideInForm: true,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            sorter: true,
            valueType: 'dateTime',
            hideInForm: true,
        },
        {
            title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Access key='a' accessible={access.canProjectUpdated} fallback={
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
            ],
        },
    ];

    const CreatedButton = () => {
        console.log('access:', access)
        const { canProjectCreated } = access
        return canProjectCreated ? <Button
            type="primary"
            key="primary"
            onClick={() => handleCreatedVisible(true)}
        >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
        </Button> : null
    }

    const FreezeButton = () => {
        console.log('access:', access)
        const { canProjectFreeze } = access
        return canProjectFreeze ? <Button
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
        console.log('access:', access)
        const { canProjectUnfreeze } = access
        return canProjectUnfreeze ? <Button
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
            content: '冻结后无法使用，确定要批量冻结选择项？',
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
            content: '解冻后恢复使用，确定要批量解冻选择项？',
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
                        setSelectedRows(selectedRows)
                    },
                }}
            />
            {
                selectedRowsState?.length > 0 && (
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
                )
            }
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