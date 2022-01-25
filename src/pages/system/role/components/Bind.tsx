import React, { useState, useEffect } from 'react';
import { Drawer, Button, Row, Col, Tree, Empty, message } from 'antd';
import { permission, bind } from '../service'

interface BindProps {
    fields: any;
    visible: boolean;
    onCancel: () => void;
}

const Bind: React.FC<BindProps> = (props) => {
    const { fields, visible, onCancel } = props;
    const [list, setList] = useState<any[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    useEffect(() => {
        if (fields && Object.keys(fields).length > 0) {
            permission({ code: fields.code }).then((res: any) => {
                if (res.status === 'success') {
                    const { list, keys, info } = res.data
                    setList(list)
                    setExpandedKeys(keys)
                    setCheckedKeys(info)
                }
            })
        }
    }, [fields]);

    const onFinish = () => {
        if (checkedKeys.length === 0) {
            message.error('请选择菜单权限')
            return
        }
        bind({ id: fields.id, permissions: checkedKeys }).then((res: any) => {
            if (res.status === 'success') {
                onCancel()
            }
        })
    }

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue);
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue: any, info: any) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    return (
        <Drawer
            title="绑定菜单"
            width={550}
            visible={visible}
            onClose={onCancel}
            maskClosable={false}
            footer={
                <div
                    style={{
                        textAlign: 'right',
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
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {
                        list && list.length > 0 ? (
                            <Tree
                                checkable
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                checkedKeys={checkedKeys}
                                selectedKeys={selectedKeys}
                                treeData={list}
                                onSelect={onSelect}
                                onCheck={onCheck}
                                onExpand={onExpand}
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
                </Col>
            </Row>
        </Drawer>
    );
};

export default Bind;
