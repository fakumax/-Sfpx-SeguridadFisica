import * as React from 'react';
import { Icon } from '@fluentui/react';

import styles from './PreviewLink.module.scss';

const PreviewLink: React.FunctionComponent = () => (
	<Icon className={styles.previewLink} iconName="PreviewLink" />
);

export default PreviewLink;
