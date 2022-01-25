import React, { useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { UpdatedFormItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface UpdatedFormProps {
    visible: boolean;
    fields: UpdatedFormItem;
    onCancel: () => void;
    onUpdated: (values: UpdatedFormItem, form: FormInstance) => void;
}

const UpdatedForm: React.FC<UpdatedFormProps> = (props) => {
    const { visible, fields, onCancel, onUpdated } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (Object.keys(fields).length > 0) {
            form.setFieldsValue(fields)
        }
    }, [props.fields]);

    const onFinish = () => {
        form.validateFields().then((item: any) => {
            onUpdated({ ...fields, ...item }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const onChange = () => {

    }

    return (
        <Drawer
            title="更新项目"
            width={450}
            visible={visible}
            onClose={onCancel}
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
                            onClick={onCancel}
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
                            name="name"
                            label="项目名称"
                            rules={[{ required: true, message: '请填写项目名称' }]}
                        >
                            <Input allowClear placeholder="请填写项目名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="path"
                            label="链接地址"
                        >
                            <Input allowClear placeholder="请填写项目后台管理链接地址" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="项目简介"
                        >
                            <Input.TextArea allowClear rows={4} placeholder="请填写项目简介" />
                        </Form.Item>
                    </Col>
                    {
                        fields.expire_at && (
                            <Col span={24}>
                                <Form.Item
                                    name="duration"
                                    label="延长使用时长"
                                >
                                    <Select allowClear style={{ width: '100%' }} placeholder='请选择延长使用时长' onChange={onChange}>
                                        <Select.Option value="365">延长一年</Select.Option>
                                        <Select.Option value="0">永久使用</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        )
                    }

                </Row>
            </Form>
        </Drawer>
    );
};

export default UpdatedForm;
