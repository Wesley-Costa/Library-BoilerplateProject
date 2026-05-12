import bookContainer from '../bookContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const bookRouterList: (IRoute | null)[] = [
	{
		path: '/book',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_VIEW]
	},
	{
		path: '/book/create',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_CREATE]
	},
	{
		path: '/book/edit/:bookId',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_UPDATE]
	},
	{
		path: '/book/delete/:bookId',
		component: bookContainer,
		isProtected: true,
		resources: [Recurso.BOOK_REMOVE]
	}
];
