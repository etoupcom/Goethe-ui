import React, { useEffect, useState } from 'react';
import { Drawer, Button, Row, Col, Form, Input, TreeSelect, Select, message } from 'antd';
import { UpdatedFormItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';
import { items } from '../service'

interface UpdatedFormProps {
    fields: UpdatedFormItem;
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onUpdated: (values: UpdatedFormItem, form: FormInstance) => void;
}

const UpdatedForm: React.FC<UpdatedFormProps> = (props) => {
    const { fields, visible, onCancel, onUpdated } = props;
    const [list, setList] = useState<UpdatedFormItem[]>([]);
    const [form] = Form.useForm();
    useEffect(() => {
        if (Object.keys(fields).length > 0) {
            form.setFieldsValue({ ...fields, type: String(fields.type), parent_id: fields.parent_id > 0 ? fields.parent_id : undefined })
            items({ id: fields.id }).then((res: any) => {
                if (res.status === 'success') {
                    setList(res.data.list)
                }
            })
        }
    }, [props.fields]);

    const onClose = () => {
        onCancel(form)
    }

    const onFinish = () => {
        form.validateFields().then((item: any) => {
            onUpdated({ ...item, id: fields.id, type: fields.type }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    return (
        <Drawer
            title="更新菜单"
            width={450}
            visible={visible}
            onClose={onClose}
            maskClosable={false}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                        marginRight: 10
                    }}
                >
                    <>
                        <Button
                            onClick={onClose}
                            style={{
                                marginRight: 10
                            }}
                        >
                            关闭
                        </Button>
                        <Button
                            type="primary"
                            onClick={onFinish}
                        >
                            保存
                        </Button>
                    </>
                </div>
            }
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            name="type"
                            label="选择类型"
                            rules={[{ required: true, message: '请选择菜单类型' }]}
                        >
                            <Select disabled style={{ width: '100%' }}>
                                <Select.Option value="10">路由菜单</Select.Option>
                                <Select.Option value="20">接口菜单</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {
                        list.length > 0 && (
                            <Col span={24}>
                                <Form.Item
                                    name="parent_id"
                                    label="所属上级"
                                >
                                    <TreeSelect
                                        allowClear
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={list}
                                        placeholder="请选择所属部门"
                                        treeDefaultExpandAll
                                    />
                                </Form.Item>
                            </Col>
                        )
                    }
                    {
                        fields && fields.type === 10 ? (
                            <>
                                <Col span={24}>
                                    <Form.Item
                                        name="title"
                                        label="路由标题"
                                        rules={[{ required: true, message: '请填写路由标题' }]}
                                    >
                                        <Input allowClear placeholder="请填写路由标题" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="name"
                                        label="路由名称"
                                        rules={[{ required: true, message: '请填写路由名称' }]}
                                    >
                                        <Input allowClear placeholder="请填写路由名称" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="path"
                                        label="路由地址"
                                        rules={[{ required: true, message: '请填写路由地址' }]}
                                    >
                                        <Input allowClear placeholder="请填写路由地址" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="component"
                                        label="组件地址"
                                    >
                                        <Input allowClear placeholder="请填写组件地址" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="icon"
                                        label="图标名称"
                                    >
                                        <Input allowClear placeholder="请填写图标名称" />
                                    </Form.Item>
                                </Col>
                            </>
                        ) : (
                            <>
                                <Col span={24}>
                                    <Form.Item
                                        name="title"
                                        label="接口标题"
                                        rules={[{ required: true, message: '请填写接口标题' }]}
                                    >
                                        <Input allowClear placeholder="请填写接口标题" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="path"
                                        label="接口地址"
                                        rules={[{ required: true, message: '请填写接口地址' }]}
                                    >
                                        <Input allowClear placeholder="请填写接口地址" />
                                    </Form.Item>
                                </Col>
                            </>
                        )
                    }
                    <Col span={24}>
                        <Form.Item
                            name="sort"
                            label="排序"
                        >
                            <Input allowClear placeholder="请填写排序" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default UpdatedForm;
