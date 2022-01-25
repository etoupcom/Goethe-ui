import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
    <Result
        status="500"
        title="500"
        subTitle="Sorry, the server is reporting an error."
        extra={
            <Button type="primary" onClick={() => history.push('/')}>
                返回首页
            </Button>
        }
    />
);

export default NoFoundPage;
