// region Imports
import { ProductBase } from '../../../api/productBase';
import { loanSch, ILoan } from './loanSch';

class LoanApi extends ProductBase<ILoan> {
	constructor() {
		super('loan', loanSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const loanApi = new LoanApi();
