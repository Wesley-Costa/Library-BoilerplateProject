import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import BooksCreateController from './pages/booksCreate/booksCreateController';
import BooksDetailController from './pages/booksDetail/booksDetailController';
import BooksListController from './pages/booksList/booksListController';

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

	const renderPage = () => {
        if (state === 'create' && validState.includes(state)) return <BooksCreateController />;
        if (state === 'edit' && validState.includes(state)) return <BooksDetailController />;
        return <BooksListController />;
    };

	const providerValue = {
		state,
		id
	};
	return <BooksModuleContext.Provider value={providerValue}>{renderPage()}</BooksModuleContext.Provider>;
};
