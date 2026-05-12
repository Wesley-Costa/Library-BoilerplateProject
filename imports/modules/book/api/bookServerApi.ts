// region Imports
import { Recurso } from '../config/recursos';
import { bookSch, IBook } from './bookSch';
import { userprofileServerApi } from '../../userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

const PROJECTION_BOOK = {
	title: 1,
	description: 1,
	authorId: 1,
	isbn: 1,
	publisher: 1,
	yearPublication: 1,
	category: 1,
	volumes: 1
}
class BookServerApi extends ProductServerBase<IBook> {
	constructor() {
		super('book', bookSch, {
			resources: Recurso
		});

		const self = this;

		this.addTransformedPublication(
			'bookList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: PROJECTION_BOOK
				});
			},
			async (doc: IBook & { nomeUsuario: string }) => {
				const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
				return { ...doc };
			}
		);

		this.addPublication('bookDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_BOOK
			});
		});
	}
}

export const bookServerApi = new BookServerApi();
