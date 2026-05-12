import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import BookListController from '../../modules/book/pages/bookList/bookListController';
import BookDetailController from '../../modules/book/pages/bookDetail/bookDetailController';
import BookCreateController from '../../modules/book/pages/bookCreate/bookCreateController';

export interface IBookModuleContext {
	state?: string;
	id?: string;
}

export const BookModuleContext = React.createContext<IBookModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, bookId } = useParams();
	const state = screenState ?? props.screenState;
	const id = bookId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <BookListController />;
		if (state === 'create') return <BookCreateController />;
		return <BookDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <BookModuleContext.Provider value={providerValue}>{renderPage()}</BookModuleContext.Provider>;
};
