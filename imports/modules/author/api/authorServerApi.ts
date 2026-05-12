// region Imports
import { Recurso } from '../config/recursos';
import { authorSch, IAuthor } from './authorSch';
import { userprofileServerApi } from '../../userprofile/api/userProfileServerApi';
import { ProductServerBase } from '../../../api/productServerBase';

// endregion

const PROJECTION_AUTHOR = {
	name: 1,
	nationality: 1,
	birthDate: 1,
	biography: 1
}
class AuthorServerApi extends ProductServerBase<IAuthor> {
	constructor() {
		super('author', authorSch, {
			resources: Recurso
		});

		const self = this;

		this.addTransformedPublication(
			'authorList',
			(filter = {}) => {
				return this.defaultListCollectionPublication(filter, {
					projection: PROJECTION_AUTHOR
				});
			},
			async (doc: IAuthor & { nomeUsuario: string }) => {
				const userProfileDoc = await userprofileServerApi.getCollectionInstance().findOneAsync({ _id: doc.createdby });
				return { ...doc };
			}
		);

		this.addPublication('authorDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_AUTHOR
			});
		});
	}
}

export const authorServerApi = new AuthorServerApi();
