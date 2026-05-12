import AuthorContainer from '../authorContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const authorRouterList: (IRoute | null)[] = [
	{
		path: '/author/:screenState/:exampleId',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_VIEW]
	},
	{
		path: '/author/:screenState',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_UPDATE]
	},
	{
		path: '/author',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_CREATE]
	},
	{
		path: '/author/:screenState',
		component: AuthorContainer,
		isProtected: true,
		resources: [Recurso.AUTHOR_REMOVE]
	}
];
