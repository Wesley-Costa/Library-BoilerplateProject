import LoanContainer from '../loanContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../../modules/modulesTypings';

export const loanRouterList: (IRoute | null)[] = [
	{
		path: '/loan/:loanId',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_VIEW]
	},
	{
		path: '/loan',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_CREATE]
	},
	{
		path: '/loan/:loanId',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_UPDATE]
	},
	{
		path: '/loan/:loanId',
		component: LoanContainer,
		isProtected: true,
		resources: [Recurso.LOAN_REMOVE]
	}
];
