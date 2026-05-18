import AuthorsContainer from '../authorsContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const authorsRouterList: (IRoute | null)[] = [
	{
		path: '/authors/:screenState',
		component: AuthorsContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_VIEW, Recurso.AUTHOR_CREATE]
	},
	{
		path: '/authors/:screenState/:authorId',
		component: AuthorsContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_UPDATE, Recurso.AUTHOR_REMOVE]
	}
];
