import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const booksMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/books/view',
		name: 'Livros',
		icon: <SysIcon name={'book'} />,
		resources: [Recurso.BOOK_VIEW]
	}
];
