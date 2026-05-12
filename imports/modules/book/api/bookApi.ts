// region Imports
import { ProductBase } from '../../../api/productBase';
import { bookSch, IBook } from './bookSch';

class BookApi extends ProductBase<IBook> {
	constructor() {
		super('book', bookSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const bookApi = new BookApi();
