// region Imports
import { ProductBase } from '../../../api/productBase';
import { booksSch, IBooks } from './booksSch';

class BooksApi extends ProductBase<IBooks> {
	constructor() {
		super('books', booksSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const booksApi = new BooksApi();
