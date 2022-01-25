import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
    <Result
        status="403"
        title="403"
        subTitle="权限不够"
        extra={
            <Button type="primary" onClick={() => history.push('/')}>
                返回首页
            </Button>
        }
    />
);

export default NoFoundPage;
