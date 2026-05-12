import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const authorMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/author',
		name: 'Autor',
		icon: <SysIcon name={'person'} />
	}
];
