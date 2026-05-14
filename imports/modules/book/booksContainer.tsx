import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import BooksCreateController from './pages/booksCreate/booksCreateController';
import BooksDetailController from './pages/booksDetail/booksDetailController';
import BooksListController from './pages/booksList/bookListController';

export interface IBooksModuleContext {
	state?: string;
	id?: string;
}

export const BooksModuleContext = React.createContext<IBooksModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, bookId } = useParams();
	const state = screenState ?? props.screenState;
	const id = bookId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	console.log('BooksContainer - screenState:', state, 'bookId:', id);

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <BooksListController />;
		if (state === 'create') return <BooksCreateController />;
		return <BooksDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <BooksModuleContext.Provider value={providerValue}>{renderPage()}</BooksModuleContext.Provider>;
};
