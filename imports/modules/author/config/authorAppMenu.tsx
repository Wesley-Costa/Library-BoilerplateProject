import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const authorMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/authors/create',
		name: 'Criar Autor',
		icon: <SysIcon name={'person'} />,
		resources: [Recurso.AUTHOR_CREATE]
	}
];
