// region Imports
import { Recurso } from '../config/recursos';
import { authorsSch, IAuthors } from './authorsSch';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

const PROJECTION_AUTHOR = {
	name: 1,
	nationality: 1,
	birthDate: 1,
	biography: 1,
	createdBy: 1,
	createdAt: 1,
	updatedAt: 1
}
class AuthorsServerApi extends ProductServerBase<IAuthors> {
	constructor() {
		super('authors', authorsSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('authors.list', function (this: any, filter = {}) {
			return self.defaultListCollectionPublication(filter, {
				limit: 5,
				sort: { updatedAt: -1 },
				projection: PROJECTION_AUTHOR
			});
		});

		this.addPublication('authors.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_AUTHOR
			});
		});
	}
}

export const authorsServerApi = new AuthorsServerApi();
