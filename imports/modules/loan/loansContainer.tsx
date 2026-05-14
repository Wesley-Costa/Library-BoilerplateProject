import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import LoansListController from './pages/loanList/loanListController';
import LoansDetailController from './pages/loanDetail/loansDetailController';
import LoansCreateController from './pages/loanCreate/loanCreateController';

export interface ILoansModuleContext {
	state?: string;
	id?: string;
}

export const LoansModuleContext = React.createContext<ILoansModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, loanId } = useParams();
	const state = screenState ?? props.screenState;
	const id = loanId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <LoansListController />;
		if (state === 'create') return <LoansCreateController />;
		return <LoansDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <LoansModuleContext.Provider value={providerValue}>{renderPage()}</LoansModuleContext.Provider>;
};
