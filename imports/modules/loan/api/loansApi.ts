// region Imports
import { ProductBase } from '../../../api/productBase';
import { loansSch, ILoans } from './loansSch';

class LoansApi extends ProductBase<ILoans> {
	constructor() {
		super('loans', loansSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const loansApi = new LoansApi();
