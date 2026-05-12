import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import AuthorListController from '../../modules/author/pages/authorList/authorListController';
import AuthorDetailController from '../../modules/author/pages/authorDetail/authorDetailContoller';
import AuthorCreateController from '../../modules/author/pages/authorCreate/authorCreateContoller';

export interface IAuthorModuleContext {
	state?: string;
	id?: string;
}

export const AuthorModuleContext = React.createContext<IAuthorModuleContext>({});

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
	return <AuthorModuleContext.Provider value={providerValue}>{renderPage()}</AuthorModuleContext.Provider>;
};
