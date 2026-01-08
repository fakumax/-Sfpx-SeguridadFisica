import * as React from 'react';
import { Icon } from '@fluentui/react';

import styles from './Footer.module.scss';

export interface IFooterProps {
	version: string;
	className?: string;
}

const Footer: React.FunctionComponent<IFooterProps> = ({ version, className }) => (
	<div className={`${styles.footer} ${className}`}>
		<span className={styles.AppVersion}>
			<Icon iconName="CloudUpload" className={styles.AppVersion_Icon} />
			<span className={styles.AppVersion_Txt}>{version}</span>
		</span>
	</div>
);

export default Footer;
