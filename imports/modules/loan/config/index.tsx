import { loansRouterList } from './loansRouters';
import { loansMenuItemList } from './loanAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Loan: IModuleHub = {
	pagesRouterList: loansRouterList,
	pagesMenuItemList: loansMenuItemList
};

export default Loan;
