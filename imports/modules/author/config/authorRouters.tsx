import AuthorContainer from '../authorContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const authorRouterList: (IRoute | null)[] = [
	{
		path: '/author',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_VIEW]
	},
	{
		path: '/author/edit/:authorId',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_UPDATE]
	},
	{
		path: '/author/create',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_CREATE]
	},
	{
		path: '/author/delete/:authorId',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_REMOVE]
	}
];
