import * as React from 'react';

export interface IShowPanelProps {
	show?: boolean;
}

const ShowPanel: React.FunctionComponent<IShowPanelProps> = ({ show, children }) => (
	<React.Fragment>
		{ show && children }
	</React.Fragment>
);

export default ShowPanel;
