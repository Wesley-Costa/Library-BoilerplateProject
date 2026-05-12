import bookContainer from '../bookContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const bookRouterList: (IRoute | null)[] = [
	{
		path: '/book/:screenState/:bookId',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_VIEW]
	},
	{
		path: '/book/:screenState',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_CREATE]
	},
	{
		path: '/book',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_VIEW]
	}
];
