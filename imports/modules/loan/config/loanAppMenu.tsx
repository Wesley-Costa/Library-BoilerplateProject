import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const loansMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/loans/list',
		name: 'Empréstimo de Livros',
		icon: <SysIcon name={'shoppingCart'} />,
		resources: [Recurso.LOAN_VIEW]
	}
];
