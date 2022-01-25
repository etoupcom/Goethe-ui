import { FC } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchOSSUploadToken, TokenParams, ItemParams } from '@/services/upload'
import ImgCrop from 'antd-img-crop';
interface OssUploadProps {
    onDone: (e: any) => void;
    onRemove: (e: any) => void;
    fileList: ItemParams[];
}

let uploadItem: TokenParams = {
    host: '',
    accessId: '',
    signature: '',
    policy: '',
    key: ''
}

const OssUpload: FC<OssUploadProps> = props => {
    const { onDone, onRemove, fileList } = props;

    const uploadProps: any = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        listType: 'picture',
        accept: '.png, .jpg, .jpeg',
        fileList,
        data: () => setData(),
        beforeUpload,
        onRemove,
        onChange: (res: any) => onChange(res)
    };

    const onChange = (res: any) => {
        onDone(res)
    }

    async function beforeUpload(file: File) {
        return new Promise((resolve, reject) => {
            if (fileList.length === 1) {
                message.error('最多上传一张图片');
                reject('最多上传一张图片')
            }
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('只能上传 JPG/PNG 图片');
                reject('只能上传 JPG/PNG 图片')
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('只能上传小于 2M 图片');
                reject('只能上传小于 2M 图片')
            }
            const params = {
                documentType: 3,
                key: String(Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + 1)
            }
            fetchOSSUploadToken(params).then((res: any) => {
                if (res.status === 'success') {
                    const { accessId, signature, policy } = res.data
                    uploadItem.accessId = accessId
                    uploadItem.signature = signature
                    uploadItem.policy = policy
                    uploadItem.key = params.key
                    resolve('上传中...')
                }
                if (res.status === 'fail') {
                    reject(res.message)
                }
            })
        });
    }

    function setData() {
        return {
            accessId: uploadItem.accessId,
            signature: uploadItem.signature,
            policy: uploadItem.policy,
            key: uploadItem.key
        }
    }

    return (
        <ImgCrop rotate>
            <Upload {...uploadProps}>
                <Button>
                    <UploadOutlined /> 上传图片
                </Button>
            </Upload>
        </ImgCrop>
    )
}
export default OssUpload;