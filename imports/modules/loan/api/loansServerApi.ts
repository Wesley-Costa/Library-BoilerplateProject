// region Imports
import { Recurso } from '../config/recursos';
import { loansSch, ILoans } from './loansSch';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

const PROJECTION_LOAN = {
    bookId: 1,
    borrowedVolumes: 1,
    assignedUser: 1,
    status: 1,
    loanDate: 1,
    returnDate: 1,
    observation:1,
    createdBy:1,
    createdAt: 1,
    updatedAt: 1
}

class LoanServerApi extends ProductServerBase<ILoans> {
	constructor() {
		super('loans', loansSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('loans.list', function (this: any, filter = {}, options = {}) {
			const defOptions = {
				sort: { returnDate: -1 },
				projection: PROJECTION_LOAN
			};

			const finalOptions = { ...defOptions, ...options };

			return self.defaultListCollectionPublication(filter, finalOptions);
		});

		this.addPublication('loans.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_LOAN
			});
		});			
	}
}

export const loanServerApi = new LoanServerApi();
