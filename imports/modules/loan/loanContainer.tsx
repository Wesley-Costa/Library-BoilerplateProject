import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import LoanListController from '../loan/pages/loanList/loanListController';
import LoanDetailController from '../loan/pages/loanDetail/loanDetailController';
import LoanCreateController from '../loan/pages/loanCreate/loanCreateController';

export interface ILoanModuleContext {
	state?: string;
	id?: string;
}

export const LoanModuleContext = React.createContext<ILoanModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, loanId } = useParams();
	const state = screenState ?? props.screenState;
	const id = loanId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <LoanListController />;
		if (state === 'create') return <LoanCreateController />;
		return <LoanDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <LoanModuleContext.Provider value={providerValue}>{renderPage()}</LoanModuleContext.Provider>;
};
