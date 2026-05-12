// region Imports
import { ProductBase } from '../../../api/productBase';
import { authorSch, IAuthor  } from './authorSch';

class AuthorApi extends ProductBase<IAuthor> {
	constructor() {
		super('author', authorSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const authorApi = new AuthorApi();
