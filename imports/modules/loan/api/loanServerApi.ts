// region Imports
import { Recurso } from '../config/recursos';
import { loanSch, ILoan } from './loanSch';
import { userprofileServerApi } from '../../userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

const PROJECTION_LOAN = {
	bookId: 1,
	userId: 1,
	status: 1,
	borrowedVolumes: 1,
	loanDate: 1,
	returnDate: 1,
	observation: 1
}

class LoanServerApi extends ProductServerBase<ILoan> {
	constructor() {
		super('loan', loanSch, {
			resources: Recurso
		});

		const self = this;

		this.addTransformedPublication(
			'loanList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: PROJECTION_LOAN
				});
			},
			async (doc: ILoan & { nomeUsuario: string }) => {
				const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
				return { ...doc };
			}
		);

		this.addPublication('loanDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_LOAN
			});
		});
	}
}

export const loanServerApi = new LoanServerApi();
