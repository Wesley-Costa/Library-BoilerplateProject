// region Imports
import { ProductBase } from '../../../api/productBase';
import { authorsSch, IAuthors  } from './authorsSch';

class AuthorsApi extends ProductBase<IAuthors> {
	constructor() {
		super('authors', authorsSch, {
			enableCallMethodObserver: true,
			enableSubscribeObserver: true
		});
	}
}

export const authorsApi = new AuthorsApi();
