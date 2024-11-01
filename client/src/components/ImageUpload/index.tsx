import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useEffect, useState } from 'react';

import styles from './index.module.less';
import { IImageUploadProps } from './type';

import ImageLoad from '@/components/ImageLoad';
import useShowMessage from '@/hooks/useShowMessage';
import { uploadFile } from '@/utils/file-upload';

export const ImageUpload = (props: IImageUploadProps) => {
	const { onUploadSuccess, initialImageUrl } = props;
	const showMessage = useShowMessage();
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleUpload = async (options: any) => {
		setLoading(true);
		const file = options.file;
		if (file.size > 10 * 1024 * 1024) {
			showMessage('error', '图片文件不能超过 10M');
			setLoading(false);
			return;
		}
		try {
			const res = await uploadFile(file, 5);
			if (res.success && res.filePath) {
				setImageUrl(res.filePath);
				// 执行传递过来的回调
				onUploadSuccess(res.filePath);
			} else {
				showMessage('error', '图片上传失败，请重试');
			}
		} catch {
			showMessage('error', '图片上传失败，请重试');
		} finally {
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
