import React from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { CreatedFormItem, UpdatedFormItem, OptionParams } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface CreatedFormProps {
    options: OptionParams[];
    parent?: UpdatedFormItem | undefined;
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { options, parent, visible, onCancel, onCreated } = props;

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

    return (
        <Drawer
            title="新建部门"
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
                            style={{
                                marginRight: 10
                            }}
                        >
                            保存
                        </Button>
                    </>
                </div>
            }
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    {
                        parent && (
                            <Col span={24}>
                                <Form.Item
                                    label="上级部门"
                                >
                                    <Input value={parent.name} disabled placeholder="请选择上级部门" />
                                </Form.Item>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="部门名称"
                            rules={[{ required: true, message: '请填写部门名称' }]}
                        >
                            <Input allowClear placeholder="请填写部门名称" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="contact"
                            label="部门电话"
                            rules={[{ required: true, message: '请填写部门电话' }]}
                        >
                            <Input allowClear placeholder="请填写部门电话" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="部门描述"
                        >
                            <Input allowClear placeholder="请填写部门描述" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="project_id"
                            label="所属项目"
                        >
                            <Select allowClear placeholder='请选择所属项目' options={options} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="sort"
                            label="排序"
                        >
                            <Input allowClear placeholder="请填写排序 正序排序" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default CreatedForm;
