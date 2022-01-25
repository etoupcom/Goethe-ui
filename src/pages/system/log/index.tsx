import { Button, Modal, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListParams, OptionParams, TreeSelectParams } from './data.d'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { list, options, deleted } from './service';
import ProjectSelect from './components/ProjectSelect'
import DepartmentSelect from './components/DepartmentSelect'
import Detail from './components/Detail';

const TableList: React.FC = () => {
    const [showDetail, handleShowDetail] = useState<boolean>(false);

    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<TableListParams>();
    const [projectList, setProjectList] = useState<OptionParams[]>([]);
    const [departmentList, setDepartmentList] = useState<TreeSelectParams[]>([]);
    const [selectedRowsState, setSelectedRows] = useState<TableListParams[]>([]);
    const access = useAccess();

    useEffect(() => {
        let isUnmounted = false;
        options().then((res: any) => {
            if (res.status === 'success') {
                if (!isUnmounted) {
                    setProjectList(res.data.project)
                    setDepartmentList(res.data.department)
                }

            }
        })
        return () => {
            isUnmounted = true;
        }
    }, []);

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

    const DeletedButton = () => {
        const { canLogDeleted } = access
        return canLogDeleted ? <Button
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
            title: '账号',
            dataIndex: 'username',
            key: 'username',
            tip: '点击查看详情',
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            handleShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '姓名',
            dataIndex: 'real_name',
            key: 'real_name',
            width: 100,
        },
        {
            title: '项目',
            dataIndex: 'project_name',
            key: 'project_name',
            width: 100,
            ellipsis: true,
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '部门',
            dataIndex: 'department_name',
            key: 'department_name',
            width: 100,
            ellipsis: true,
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 100,
        },
        {
            title: '操作',
            dataIndex: 'remark',
            key: 'remark',
            width: 245,
            ellipsis: true
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
            title: '操作时间',
            dataIndex: 'created_at',
            key: 'created_at',
            valueType: 'dateTime',
            hideInSearch: true,
            sorter: (a, b) => a.created_at - b.created_at,
        },
        {
            title: '操作时间',
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
            width: 100,
            render: (_, record) => [
                <a key='a' onClick={() => {
                    setCurrentRow(record);
                    handleShowDetail(true);
                }}>
                    详情
                </a>,
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
                request={list}
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
            {
                currentRow && (
                    <Detail
                        fields={currentRow}
                        visible={showDetail}
                        onCancel={() => handleShowDetail(false)}
                    />
                )
            }
        </PageContainer>
    );
};

export default TableList;
