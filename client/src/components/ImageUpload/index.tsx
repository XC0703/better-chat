import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useEffect, useState } from 'react';

import { uploadImage } from './api';
import styles from './index.module.less';
import { IImageUploadProps } from './type';

import ImageLoad from '@/components/ImageLoad';
import useShowMessage from '@/hooks/useShowMessage';
import { HttpStatus } from '@/utils/constant';

export const ImageUpload = (props: IImageUploadProps) => {
	const { onUploadSuccess, initialImageUrl } = props;
	const showMessage = useShowMessage();
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleUpload = (options: any) => {
		const file = options.file;
		const reader = new FileReader();
		setLoading(true);
		if (file.size <= 2 * 1024 * 1024) {
			// 判断文件大小是否超过 2m
			reader.readAsDataURL(file);
			reader.onload = async event => {
				// 当读取操作成功完成时调用
				const base64 = event.target!.result; // 获取文件的 Base64 编码
				try {
					const res = await uploadImage({ base64: base64 as string });
					if (res.code === HttpStatus.SUCCESS && res.data) {
						const { filePath } = res.data;
						setImageUrl(filePath);
						setLoading(false);
						// 执行传递过来的回调
						onUploadSuccess(filePath);
					} else {
						showMessage('error', '图片上传失败，请重试');
						setLoading(false);
					}
				} catch {
					showMessage('error', '图片上传失败，请重试');
					setLoading(false);
				}
			};
		} else {
			showMessage('error', '图片文件不能超过 2M');
			setLoading(false);
		}
	};

	// 上传按钮
	const uploadButton = (
		<div>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>上传图片</div>
		</div>
	);

	useEffect(() => {
		if (initialImageUrl) {
			setImageUrl(initialImageUrl);
		}
	}, []);

	return (
		<>
			<Upload
				listType="picture-card"
				showUploadList={false}
				customRequest={handleUpload}
				accept="image/*"
				maxCount={1}
				className={styles.avatarUploader}
			>
				{imageUrl ? <ImageLoad src={imageUrl} /> : uploadButton}
			</Upload>
		</>
	);
};
