import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const loansMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/loans/create',
		name: 'Registrar Empréstimo de Livro',
		icon: <SysIcon name={'shoppingCart'} />,
		resources: [Recurso.LOAN_CREATE]
	}
];
