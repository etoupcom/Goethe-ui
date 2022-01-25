import React, { useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, message } from 'antd';
import { UpdatedFormItem, OptionParams } from '../data.d';
import { FormInstance } from 'antd/lib/form';

interface UpdatedFormProps {
    options: OptionParams[];
    fields: UpdatedFormItem;
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onUpdated: (values: UpdatedFormItem, form: FormInstance) => void;
}

const UpdatedForm: React.FC<UpdatedFormProps> = (props) => {
    const { options, fields, visible, onCancel, onUpdated } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (fields && Object.keys(fields).length > 0) {
            form.setFieldsValue({ ...fields, project_id: fields.project_id ? fields.project_id : undefined, sort: fields.sort ? fields.sort : undefined })
        }
    }, [props.fields]);

    const onClose = () => {
        onCancel(form)
    }

    const onFinish = () => {
        form.validateFields().then((item: any) => {
            onUpdated({ ...item, id: fields.id }, form)
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    return (
        <Drawer
            title="更新部门"
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

export default UpdatedForm;
