import * as React from 'react';
import { PivotItem, Pivot } from '@fluentui/react';
import { groupBy } from '@microsoft/sp-lodash-subset';

import { Item } from '../../../entities';
import { List, PreviewLink } from '..';
import styles from './Tabs.module.scss';

export interface ITabsProps {
	items: Array<Item>;
	headerProperty: keyof Item;
	onItemSelected?: (selectedItem?: Item) => void;
}

const Tabs: React.FunctionComponent<ITabsProps> = ({ items, headerProperty, onItemSelected }) => {
	const itemsPerTab = groupBy(items, (item) => item[headerProperty].toString());
	const headers: Array<string> = Object.keys(itemsPerTab);
	const [lastHeader, setHeader] = React.useState<string>();

	React.useEffect(() => {
		setHeader(headers[0] ? headers[0].toUpperCase() : undefined);
	}, [items]);

	const changeSelection = (pivotItem?: PivotItem) => {
		const newHeader: string = pivotItem ? pivotItem.props.headerText : undefined;
		if(lastHeader !== newHeader.toUpperCase()) {
			setHeader(newHeader);
			onItemSelected();
		}
	};
	return (
		(items.length > 0) ?
			<Pivot className={styles.tabs} onLinkClick={changeSelection}>
				{
					headers.map(header => {
						const tabItems = itemsPerTab[header];
						return (
							<PivotItem
								headerText={header.toUpperCase()}
								itemCount={tabItems.length}
								key={header.toUpperCase()}
							>
								<List items={tabItems} onItemSelected={onItemSelected} key={header} />
							</PivotItem>
						);
					})
				}
			</Pivot> :
			<PreviewLink />
	);
};

export default Tabs;
