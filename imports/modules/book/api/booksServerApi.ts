// region Imports
import { Recurso } from '../config/recursos';
import { booksSch, IBooks } from './booksSch';
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
class BooksServerApi extends ProductServerBase<IBooks> {
	constructor() {
		super('books', booksSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('books.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_BOOK
			});
		});
	}
}

export const booksServerApi = new BooksServerApi();
