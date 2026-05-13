import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import AuthorCreateController from './pages/authorsCreate/authorsCreateContoller';
import AuthorDetailController from './pages/authorsDetail/authorsDetailContoller';
import AuthorListController from './pages/authorsList/authorsListController';

export interface IAuthorsModuleContext {
	state?: string;
	id?: string;
}

export const AuthorsModuleContext = React.createContext<IAuthorsModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, authorId } = useParams();
	const state = screenState ?? props.screenState;
	const id = authorId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <AuthorListController />;
		if (state === 'create') return <AuthorCreateController />;
		return <AuthorDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <AuthorsModuleContext.Provider value={providerValue}>{renderPage()}</AuthorsModuleContext.Provider>;
};
