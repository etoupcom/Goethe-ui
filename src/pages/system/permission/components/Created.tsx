import React, { useState } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { CreatedFormItem, UpdatedFormItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface CreatedFormProps {
    parent?: UpdatedFormItem | undefined;
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { parent, visible, onCancel, onCreated } = props;
    const [type, setType] = useState<string>('10');
    const [form] = Form.useForm();

    const onClose = () => {
        onCancel(form)
    }

    const onFinish = () => {
        form.validateFields().then((fields: any) => {
            parent ? onCreated({ ...fields, parent_id: parent.id }, form) : onCreated(fields, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const onChange = (v: string) => {
        setType(v)
    }

    return (
        <Drawer
            title="新建菜单"
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
            <Form initialValues={{ type }} layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    {
                        parent && (
                            <Col span={24}>
                                <Form.Item
                                    label="上级菜单"
                                >
                                    <Input value={parent.title} disabled placeholder="请选择上级菜单" />
                                </Form.Item>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Form.Item
                            name="type"
                            label="选择类型"
                            rules={[{ required: true, message: '请选择菜单类型' }]}
                        >
                            <Select allowClear style={{ width: '100%' }} onChange={onChange}>
                                <Select.Option value="10">路由菜单</Select.Option>
                                <Select.Option value="20">接口菜单</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {
                        type === '10' ? (
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

export default CreatedForm;
