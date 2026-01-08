
import * as React from 'react';
import { TooltipHost, ITooltipHostStyles, Icon, PrimaryButton, IButtonStyles } from '@fluentui/react';

import styles from './TooltipButton.module.scss';

export interface ITooltipButtonProps {
	title: string;
	iconName: string;
	onClick?: () => void;
	className?: IButtonStyles;
}

const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

const TooltipButton: React.FunctionComponent<ITooltipButtonProps> = ({ title, iconName, onClick, className }) => (
	<TooltipHost content={title} styles={hostStyles}>
		<PrimaryButton
			text={title}
			iconProps={{ iconName: iconName }}
			onClick={onClick}
			styles={className}
		/>
	</TooltipHost>
);

export default TooltipButton;
