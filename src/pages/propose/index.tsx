import { useRef, useState, useEffect } from 'react';
import { Button, Modal, Popconfirm, message } from 'antd';
import { useIntl, FormattedMessage, useAccess, Access } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TableListParams, DetailFormItem, SelectParams } from './data.d';
import { list, freeze, unfreeze, generate, excel, items } from './service';
import Detail from './components/Detail';
import DepartmentSelect from './components/DepartmentSelect'
import JobSelect from './components/JobSelect'
import TypeSelect from './components/TypeSelect'

const TableList: React.FC = () => {
    const [detailVisible, handleDetailVisible] = useState<boolean>(false);
    const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
    const [formValues, setFormValues] = useState<Partial<DetailFormItem>>({});
    const [showExport, setShowExport] = useState<boolean>(false);
    const [department, setDepartment] = useState<SelectParams[]>([]);
    const [job, setJob] = useState<SelectParams[]>([]);
    const [options, setOptions] = useState<SelectParams[]>([]);
    const actionRef = useRef<ActionType>();
    const access = useAccess();
    const intl = useIntl();

    useEffect(() => {
        let isUnmounted = false;
        items().then((res: any) => {
            if (res.status === 'success') {
                if (!isUnmounted) {
                    setDepartment(res.data.department)
                    setJob(res.data.job)
                    setOptions(res.data.type)
                }
            }
        })
        return () => {
            isUnmounted = true;
        }
    }, []);

    const columns: ProColumns<any>[] = [
        {
            title: '姓名',
            dataIndex: 'real_name',
        },
        {
            title: '部门',
            dataIndex: 'department_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '岗位',
            dataIndex: 'job_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '项目名称',
            dataIndex: 'project_name',
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
                        department={department}
                    />
                );
            },
        },
        {
            title: '岗位',
            key: 'job_id',
            hideInTable: true,
            dataIndex: 'job_id',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null;
                }
                const job_id = form.getFieldValue('job_id')
                return (
                    <JobSelect
                        value={job_id}
                        job={job}
                    />
                );
            },
        },
        {
            title: '类型',
            key: 'type',
            hideInTable: true,
            dataIndex: 'type',
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
                if (type === 'form') {
                    return null;
                }
                const type_id = form.getFieldValue('type_id')
                return (
                    <TypeSelect
                        value={type_id}
                        options={options}
                    />
                );
            },
        },
        {
            title: '建议类型',
            dataIndex: 'type_name',
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                10: {
                    text: '待阅',
                    status: 'Processing',
                },
                20: {
                    text: '已阅',
                    status: 'Success',
                },
                40: {
                    text: '冻结',
                    status: 'Error',
                },
                80: {
                    text: '采纳',
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
                <Access key='a' accessible={access.canProposeDetail} fallback={
                    <a
                        onClick={() => message.error('没有权限')}
                    >
                        -
                    </a>
                }>
                    <a
                        onClick={() => {
                            setFormValues(record)
                            handleDetailVisible(true)
                        }}
                    >
                        详情
                    </a>
                </Access>,
            ],
        },
    ];

    const GenerateButton = () => {
        const { canProposeGenerate } = access
        return canProposeGenerate ?
            <Popconfirm
                title="确定要生成Excel文档?"
                onConfirm={handleGenerate}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <Button
                    type="primary"
                    key="primary"
                >
                    生成表格
                </Button>
            </Popconfirm> : null
    }

    const ExportButton = () => {
        const { canProposeExport } = access
        return canProposeExport ? <Button
            type="link"
            key="link"
            onClick={handleExport}
        >
            导出表格
        </Button> : null
    }


    const FreezeButton = () => {
        const { canProposeFreeze } = access
        return canProposeFreeze ? <Button
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
        const { canProposeUnfreeze } = access
        return canProposeUnfreeze ? <Button
            type="primary"
            onClick={async () => {
                await handleUnfreeze(selectedRowsState);
            }}
        >
            批量解冻
        </Button> : null
    }

    const handleFreeze = async (selectedRows: any) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: '提示',
            content: '冻结后无法使用，确定要批量冻结选择项？',
            async onOk() {
                const res = await freeze({ key: selectedRows.map((v: any) => v.id) })
                if (res.status === 'success') {
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
                    actionRef.current?.reloadAndRest?.();
                    message.success('操作成功');
                }
            },
        });

    }

    async function handleGenerate() {
        const res: any = await generate()
        if (res.status === 'success') {
            setShowExport(true)
            message.success('生成成功，请点击导出表格')
        } else {
            message.error(res.message)
        }
    }

    async function handleExport() {
        const res: any = await excel()
        if (res.status === 'success') {
            const link = document.createElement('a');
            const evt = document.createEvent('MouseEvents');
            link.style.display = 'none';
            link.href = res.data.path;
            link.download = res.data.filename;
            document.body.appendChild(link); // 此写法兼容可火狐浏览器
            evt.initEvent('click', false, false);
            link.dispatchEvent(evt);
            document.body.removeChild(link);
            message.success('导出成功')
        } else {
            message.error(res.message)
        }
    }

    const cancel = (e: any) => {
        message.error('Click on No');
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
                toolBarRender={() => showExport ?
                    [
                        <GenerateButton />,
                        <ExportButton />,
                    ] : [
                        <GenerateButton />,
                    ]
                }
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
            <Detail
                visible={detailVisible}
                fields={formValues}
                onCancel={() => handleDetailVisible(false)}
            />
        </PageContainer>
    );
};

export default TableList;