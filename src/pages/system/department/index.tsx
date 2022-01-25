import { useState, useEffect } from 'react';
import { Button, Divider, Card, Table, Empty, Popconfirm, message } from 'antd';
import { DepartmentState, ConnectRC, Loading, connect, useAccess, Access } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { FormInstance } from 'antd/lib/form';
import { CreatedFormItem, UpdatedFormItem, OptionParams } from './data.d';
import ProjectSelect from './components/ProjectSelect';
import Created from './components/Created'
import Updated from './components/Updated';

interface PageProps {
    department: DepartmentState;
    loading: boolean;
}

const TableList: ConnectRC<PageProps> = props => {
    const {
        loading,
        dispatch,
        department: { list },
    } = props;

    const [parent, setParent] = useState<UpdatedFormItem>();
    const [expandable] = useState<any>({ defaultExpandAllRows: true });
    const [createdVisible, handleCreatedVisible] = useState<boolean>(false);
    const [updatedVisible, handleUpdatedVisible] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<Partial<UpdatedFormItem>>({});
    const [projectList, setProjectList] = useState<OptionParams[]>([]);
    const access = useAccess();

    useEffect(() => {
        handleFetch()
    }, []);

    useEffect(() => {
        let isUnmounted = false;
        dispatch({
            type: 'department/project',
            callback: (res: any) => {
                if (res.status === 'success') {
                    if (!isUnmounted) {
                        setProjectList(res.data.map((v: any) => { return { value: v.id, label: v.name } }))
                    }
                }
                if (res.status === 'fail') {
                    message.error(res.message)
                }
            }
        });
        return () => {
            isUnmounted = true;
        }
    }, []);

    const handleFetch = () => {
        dispatch({
            type: 'department/fetch',
        });
    };

    const handleCreated = (fields: CreatedFormItem, form: FormInstance) => {
        dispatch({
            type: 'department/created',
            payload: { ...fields },
            callback: (res: any) => {
                if (res.status === 'success') {
                    handleCreatedVisible(false)
                    handleFetch()
                    form.resetFields()
                }
                if (res.status === 'fail') {
                    message.error(res.message)
                }
            }
        });
    }

    const handleUpdated = (fields: UpdatedFormItem, form: FormInstance) => {
        dispatch({
            type: 'department/updated',
            payload: { ...fields },
            callback: (res: any) => {
                if (res.status === 'success') {
                    handleUpdatedVisible(false)
                    handleFetch()
                }
                if (res.status === 'fail') {
                    message.error(res.message)
                }
            }
        });
    }

    const handleDeleted = (id: number) => {
        console.log(id)
        if (id) {
            dispatch({
                type: 'department/deleted',
                payload: { id },
                callback: (res: any) => {
                    if (res.status === 'success') {
                        handleFetch()
                    }
                    if (res.status === 'fail') {
                        message.error(res.message)
                    }
                }
            });
        }
    }

    const CreatedButton = () => {
        const { canDepartmentCreated } = access
        return canDepartmentCreated ? <Button type="primary" onClick={() => handleCreatedVisible(true)}>新增</Button> : null
    }

    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            rules: [
                {
                    required: true,
                    message: '标题为必填项',
                },
            ],
        },
        {
            title: '部门描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '部门电话',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: '所属项目',
            dataIndex: 'project_name',
            key: 'project_name',
            render: (v: any) => v ? v : '-'
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            sorter: true,
            valueType: 'dateTime',
            hideInForm: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_: string, record: any, index: number) => (
                <>
                    <Access key='a' accessible={access.canDepartmentCreated} fallback={
                        <a
                            style={{ padding: 0 }}
                            onClick={() => message.error('您没有权限')}
                        >
                            -
                        </a>
                    }>
                        <a
                            style={{ padding: 0 }}
                            onClick={() => {
                                setParent(record)
                                handleCreatedVisible(true)
                            }}
                        >
                            新增
                        </a>
                    </Access>
                    <Divider type="vertical" />
                    <Access key='b' accessible={access.canDepartmentUpdated} fallback={
                        <a
                            style={{ padding: 0 }}
                            onClick={() => message.error('您没有权限')}
                        >
                            -
                        </a>
                    }>
                        <a
                            style={{ padding: 0 }}
                            onClick={() => {
                                setFormValues(record)
                                handleUpdatedVisible(true)
                            }}
                        >
                            更新
                        </a>
                    </Access>
                    <Divider type="vertical" />
                    <Access key='c' accessible={access.canDepartmentDeleted} fallback={
                        <a
                            style={{ padding: 0 }}
                            onClick={() => message.error('您没有权限')}
                        >
                            -
                        </a>
                    }>
                        <Popconfirm
                            title="确认要删除该信息?"
                            onConfirm={() => handleDeleted(record.id)}
                            okText="确认"
                            cancelText="取消"
                        >
                            <a
                                style={{ padding: 0 }}
                            >
                                删除
                            </a>
                        </Popconfirm>
                    </Access>
                </>
            ),
        },
    ];

    return (
        <PageContainer>
            <Card title="列表" extra={<><CreatedButton /></>}>
                {
                    list && list.length > 0 ? (
                        <Table
                            rowKey='id'
                            pagination={false}
                            loading={loading}
                            columns={columns}
                            dataSource={list}
                            expandable={expandable}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    暂无数据
                                </span>
                            }
                        >
                        </Empty>
                    )
                }
                {
                    parent ? (
                        <Created
                            visible={createdVisible}
                            options={projectList}
                            parent={parent}
                            onCreated={handleCreated}
                            onCancel={(form: FormInstance) => {
                                handleCreatedVisible(false)
                                setParent(undefined)
                                form.resetFields()
                            }}
                        />
                    ) : (
                        <Created
                            visible={createdVisible}
                            options={projectList}
                            onCreated={handleCreated}
                            onCancel={(form: FormInstance) => {
                                handleCreatedVisible(false)
                                form.resetFields()
                            }}
                        />
                    )
                }
                {
                    formValues && (
                        <Updated
                            visible={updatedVisible}
                            options={projectList}
                            fields={formValues}
                            onUpdated={handleUpdated}
                            onCancel={(form: FormInstance) => {
                                handleUpdatedVisible(false)
                                setParent(undefined)
                                form.resetFields()
                            }}
                        />
                    )
                }
            </Card>
        </PageContainer>
    )
};

export default connect(
    ({ department, loading }: { department: DepartmentState; loading: Loading }) => ({
        department,
        loading: loading.models.department,
    }),
)(TableList);