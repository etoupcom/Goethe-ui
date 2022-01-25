/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';
import { message, notification } from 'antd';
import { getToken } from '@/utils/token';
import { history } from 'umi';

const { NODE_ENV } = process.env;
let path = 'https://feedback.etoup.com'
if (NODE_ENV === 'development') {
    path = 'http://0.0.0.0:9502'
}

const codeMessage: { [status: number]: string } = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/** 异常处理程序 */
const errorHandler = (error: { response: Response }): Response => {
    const { response } = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;
        switch (status) {
            case 401:
                history.push('/401')
                break;
            case 403:
                history.push('/403')
                break;
            case 500:
                notification.error({
                    message: `请求错误 ${status}: ${url}`,
                    description: errorText,
                });
                history.push('/500')
                break;
            default:
                notification.error({
                    message: `请求错误 ${status}: ${url}`,
                    description: errorText,
                });
        }

    } else if (!response) {
        notification.error({
            description: '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }
    return response;
};

/**
 * 配置request请求时的默认参数
 */
const http = extend({
    errorHandler, // 默认错误处理
    mode: 'cors',
    credentials: 'same-origin', // same-origin include
    prefix: 'v1/console',
    maxCache: 10,
    timeout: 5000,
});

http.interceptors.request.use((url, options) => {
    const { prefix } = options
    let antdProToken: any = getToken()
    antdProToken = JSON.parse(antdProToken)
    if (antdProToken && antdProToken !== 'undefined') {
        const { token } = antdProToken
        if (token) {
            options.headers = { Authorization: `Bearer ${token}` }
        }
    }
    return (
        {
            url: prefix ? `${path}/${url}` : url,
            options
        }
    )
});

http.interceptors.response.use(async (response) => {
    const res = await response.clone().json()
    if (res.status === 'fail') {
        message.error(res.message)
    }
    switch (response.status) {
        case 400:
        case 401:
        case 403:
        case 404:
        case 406:
        case 410:
        case 422:
        case 500:
        case 502:
        case 503:
        case 504:
            break;
        default: break
    }

    return response;
});

export default http;
