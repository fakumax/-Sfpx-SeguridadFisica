import * as React from 'react';

import backgroundImage280 from '../../img/backgroundImage280.jpg';//'../../../img/backgroundImage280.jpg';
import styles from './Banner.module.scss';

export interface IBannerProps {
	backgroundSrc?: string;
	title?: string;
	description?: string;
}

const Banner: React.FunctionComponent<IBannerProps> = ({ backgroundSrc, title, description }) => (
	<div className={styles.banner}>
		<img
			src={backgroundSrc || backgroundImage280}
			className={styles.image}
			alt="Image main page"
		/>
		<div className={styles.container}>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.caption}>{description}</p>
		</div>
	</div>
);

export default Banner;
