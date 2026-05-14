import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const authorsMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/authors/create',
		name: 'Registrar Autor',
		icon: <SysIcon name={'person'} />,
		resources: [Recurso.AUTHOR_CREATE]
	}
];
