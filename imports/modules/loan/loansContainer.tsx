import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import LoansListController from './pages/loansList/loansListController';
import LoansDetailController from './pages/loansDetail/loansDetailController';
import LoansCreateController from './pages/loansCreate/loansCreateController';

export interface ILoansModuleContext {
	state?: string;
	id?: string;
}

export const LoansModuleContext = React.createContext<ILoansModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, loanId } = useParams();
	const state = screenState ?? props.screenState;
	const id = loanId ?? props.id;

	const validState = ['view', 'return', 'extension', 'edit', 'create'];

	const renderPage = () => {
        if (state === 'create' && validState.includes(state)) return <LoansCreateController />;
        if ((state === 'return' || state === 'extension' || state === 'edit') && validState.includes(state)) return <LoansDetailController />;
        return <LoansListController />;
    };

	const providerValue = {
		state,
		id
	};
	return <LoansModuleContext.Provider value={providerValue}>{renderPage()}</LoansModuleContext.Provider>;
};
