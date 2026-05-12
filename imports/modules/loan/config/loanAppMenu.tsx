import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const loanMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/loan',
		name: 'Empréstimos',
		icon: <SysIcon name={'dashboard'} />
	}
];
