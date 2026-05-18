import booksContainer from '../booksContainer';
import { Recurso } from './recursos';
import { IRoute } from '../../modulesTypings';

export const booksRouterList: (IRoute | null)[] = [
	{
		path: '/books/:screenState',
		component: booksContainer,
		isProtected: true,
		resources: [Recurso.BOOK_VIEW, Recurso.BOOK_CREATE]
	},
	{
		path: '/books/:screenState/:bookId',
		component: booksContainer,
		isProtected: true,
		resources: [Recurso.BOOK_UPDATE, Recurso.BOOK_REMOVE]
	}
];
