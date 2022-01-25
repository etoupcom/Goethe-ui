import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { Button, Modal, Popconfirm, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { TableListParams, CreatedFormItem, DetailParams } from './data.d'
import { list, deleted, created, withdraw } from './service';
import Created from './components/Created';
import Detail from './components/Detail';

const TableList: React.FC = () => {
    const [showDetail, handleShowDetail] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<DetailParams>();
    const [selectedRowsState, setSelectedRows] = useState<TableListParams[]>([]);
    const [createdVisible, handleCreatedVisible] = useState<boolean>(false);
    const access = useAccess();

    const handleRemove = async (items: TableListParams[]) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '删除后无法显示，确定要批量删除选择项？',
            onOk() {
                deleted({ key: items.map((v: TableListParams) => v.id) }).then((res: any): void => {
                    if (res.status === 'success') {
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                        message.success('操作成功');
                    }
                })
            },
        });
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

    const handleWithdraw = async (id: number) => {
        if (id) {
            const res = await withdraw({ id })
            if (res.status === 'success') {
                actionRef.current?.reloadAndRest?.();
                message.success('操作成功');
            }
        }
    }

    const CreatedButton = () => {
        const { canNoticeCreated } = access
        return canNoticeCreated ? <Button type="primary" onClick={() => handleCreatedVisible(true)}>新增</Button> : null
    }

    const DeletedButton = () => {
        const { canNoticeDeleted } = access
        return canNoticeDeleted ? <Button
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

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */
    const intl = useIntl();

    const columns: ProColumns[] = [

        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            ellipsis: true,
        },
        {
            title: '详情',
            dataIndex: 'content',
            key: 'content',
            width: 200,
            hideInSearch: true,
            ellipsis: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            filters: true,
            onFilter: true,
            width: 150,
            valueType: 'select',
            valueEnum: {
                10: {
                    text: '全员通知',
                },
                20: {
                    text: '部门通知',
                },
                30: {
                    text: '人员通知',
                },
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: true,
            onFilter: true,
            width: 150,
            valueType: 'select',
            valueEnum: {
                10: {
                    text: '待发布',
                    status: 'Processing',
                },
                40: {
                    text: '已撤回',
                    status: 'Error',
                },
                80: {
                    text: '已发布',
                    status: 'Success',
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
                <a key='a' onClick={() => {
                    setCurrentRow(record);
                    handleShowDetail(true);
                }}>
                    详情
                </a>,
                <Access key='b' accessible={access.canNoticeWithdraw} fallback={
                    <a
                        style={{ padding: 0 }}
                        onClick={() => message.error('您没有权限')}
                    >
                        -
                    </a>
                }>
                    <Popconfirm
                        title="确认要撤回该通知?"
                        onConfirm={() => handleWithdraw(record.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <a
                            style={{ padding: 0 }}
                        >
                            撤回
                        </a>
                    </Popconfirm>
                </Access>,

            ],
        },
    ];

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
            <Created
                visible={createdVisible}
                onCreated={handleCreated}
                onCancel={(form: FormInstance) => {
                    handleCreatedVisible(false)
                    form.resetFields()
                }}
            />
            <Detail
                fields={currentRow}
                visible={showDetail}
                onCancel={() => handleShowDetail(false)}
            />
        </PageContainer>
    );
};

export default TableList;
