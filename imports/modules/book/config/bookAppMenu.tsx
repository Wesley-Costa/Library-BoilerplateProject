import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const bookMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/book',
		name: 'Livro',
		icon: <SysIcon name={'dashboard'} />
	}
];
