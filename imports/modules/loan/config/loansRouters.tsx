import loansContainer from '../loansContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const loansRouterList: (IRoute | null)[] = [
	{
		path: '/loans',
		component: loansContainer,
		isProtected: true,
		resources: [Recurso.LOAN_VIEW]
	},
	{
		path: '/loans/:screenState',
		component: loansContainer,
		isProtected: true,
		resources: [Recurso.LOAN_CREATE]
	},
	{
		path: '/loans/:screenState/:loanId',
		component: loansContainer,
		isProtected: true,
		resources: [Recurso.LOAN_UPDATE, Recurso.LOAN_REMOVE]
	}
];
