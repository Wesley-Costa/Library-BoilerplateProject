import LoanContainer from '../loanContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../../modules/modulesTypings';

export const loanRouterList: (IRoute | null)[] = [
	{
		path: '/loan',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_VIEW]
	},
	{
		path: '/loan/create',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_CREATE]
	},
	{
		path: '/loan/edit/:loanId',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_UPDATE]
	},
	{
		path: '/loan/delete/:loanId',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_REMOVE]
	}
];
