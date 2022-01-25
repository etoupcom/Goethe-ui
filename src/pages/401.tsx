import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
    <Result
        status="403"
        title="403"
        subTitle="令牌错误或已过期，请重新登录"
        extra={
            <Button type="primary" onClick={() => history.push('/user/login')}>
                返回登录
            </Button>
        }
    />
);

export default NoFoundPage;
