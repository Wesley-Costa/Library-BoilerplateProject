import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const booksMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/books/create',
		name: 'Registrar Livro',
		icon: <SysIcon name={'book'} />,
		resources: [Recurso.BOOK_CREATE]
	}
];
