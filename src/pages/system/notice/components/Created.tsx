import React, { useState, useEffect } from 'react';
import { Drawer, Button, Row, Col, Form, Input, Select, TreeSelect, message } from 'antd';
import { useAccess, Access } from 'umi';
import { CreatedFormItem } from '../data.d';
import { FormInstance } from 'antd/lib/form';
import Upload from '@/components/Upload/file'

import { department, user } from '../service'

interface CreatedFormProps {
    visible: boolean;
    onCancel: (form: FormInstance) => void;
    onCreated: (values: CreatedFormItem, form: FormInstance) => void;
}

const CreatedForm: React.FC<CreatedFormProps> = (props) => {
    const { visible, onCancel, onCreated } = props;
    const [departmentList, setDepartmentList] = useState<any>();
    const [fileList, setFileList] = useState<any>([]);
    const [userList, setUserList] = useState<any>([]);
    const [type, setType] = useState<number>(10);
    const access = useAccess();
    const [form] = Form.useForm();

    const onFinish = () => {
        form.validateFields().then((fields: any) => {
            onCreated({ ...fields }, form)
            setFileList([])
        }).catch(err => {
            const { errorFields } = err
            if (errorFields.length > 0) {
                message.error('请完成必填项内容')
            }
        })
    }

    const handleDone = (e: any) => {
        let { file, fileList } = e
        if (file.status === 'done') {
            fileList = fileList.map((file: any) => {
                console.log(file)
                if (file.response) {
                    file.url = file.response.url
                    file.thumbUrl = file.response.thumbUrl
                }
                return file;
            })
            let files = fileList.map((v: any) => v.url)
            form.setFieldsValue({
                ...form,
                files,
                path: files[0]
            });
        }
        setFileList(fileList)
    }

    const handleRemove = (e: any) => {
        let files = form.getFieldValue('files')
        files.splice(files.findIndex((item: string) => item === e.url), 1)
        form.setFieldsValue({
            ...form,
            files,
            path: ''
        })
    }

    const onChange = async (v: number) => {
        switch (v) {
            case 20:
                const res = await department()
                if (res.status === 'success') {
                    setType(v)
                    setDepartmentList(res.data)
                }
                break
            case 30:
                const result = await user()
                if (result.status === 'success') {
                    setType(v)
                    setUserList(result.data)
                }
                break
            default:
                setType(v)
        }

    }

    const options = [
        {
            value: 10,
            label: '全部通知'
        },
        {
            value: 20,
            label: '根据部门'
        },
        {
            value: 30,
            label: '根据人员'
        },
    ]

    return (
        <Drawer
            title="新建公告"
            width={650}
            visible={visible}
            onClose={() => onCancel(form)}
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
                            onClick={() => onCancel(form)}
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
                            label="通知类型"
                            rules={[{ required: true, message: '请选择通知类型' }]}
                        >
                            <Select allowClear placeholder='请选择通知类型' options={options} onChange={onChange} />
                        </Form.Item>
                    </Col>
                    {
                        (type === 20) && (
                            <Col span={24}>
                                <Form.Item
                                    name="key"
                                    label="选择部门"
                                    rules={[{ required: true, message: '请选择通知部门' }]}
                                >
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={departmentList}
                                        placeholder="请选择通知部门"
                                        treeDefaultExpandAll
                                        multiple
                                        showSearch
                                    />
                                </Form.Item>
                            </Col>
                        )
                    }
                    {
                        (type === 30) && (
                            <Col span={24}>
                                <Form.Item
                                    name="key"
                                    label="选择人员"
                                    rules={[{ required: true, message: '请选择通知人员' }]}
                                >
                                    <Select allowClear placeholder='请选择通知人员' options={userList} mode="multiple" />
                                </Form.Item>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="标题"
                            rules={[{ required: true, message: '请填写标题' }]}
                        >
                            <Input allowClear placeholder="请填写标题" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="content"
                            label="内容"
                            rules={[{ required: true, message: '请填写内容' }]}
                        >
                            <Input.TextArea rows={4} placeholder="请填写内容" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="files"
                            label="上传图片"
                        >

                            <Upload
                                fileList={fileList}
                                onDone={handleDone}
                                onRemove={handleRemove}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer >
    );
};

export default CreatedForm;
