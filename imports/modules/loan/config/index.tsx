import { loanRouterList } from './loanRouters';
import { loanMenuItemList } from './loanAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Loan: IModuleHub = {
	pagesRouterList: loanRouterList,
	pagesMenuItemList: loanMenuItemList
};

export default Loan;
