import { LoadErrorImage } from '@/assets/images';
import { serverURL } from '@/config';

interface ImageProps {
	src: string;
	alt?: string;
	className?: string;
}
const ImageLoad = (props: ImageProps) => {
	const { src, alt, className } = props;

	// 传入的加载图片src，可能是'https://ui-avatars.com/api/?name=xcgogogo'这种，也可能是'/uploads/group/8ewU4rs77Ky2uRmwzpgien3sI0l0XuIY.jpeg'这种
	return (
		<img
			src={
				src
					? src.startsWith('http') || src.startsWith('https')
						? `${src}`
						: `${serverURL}${src}`
					: `${LoadErrorImage.AVATAR}`
			}
			onError={e => {
				if (e.currentTarget.src !== `${LoadErrorImage.AVATAR}`) {
					e.currentTarget.src = `${LoadErrorImage.AVATAR}`;
				}
			}}
			alt={alt ? alt : ''}
			className={className}
			draggable="false"
		/>
	);
};

export default ImageLoad;
