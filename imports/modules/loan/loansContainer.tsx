import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import LoansListController from './pages/loansList/loansListController';
import LoansDetailController from './pages/loansDetail/loansDetailController';
import LoansCreateController from './pages/loansCreate/loansCreateController';
import { useTracker } from 'meteor/react-meteor-data';
import { userprofileApi } from '../../modules/userprofile/api/userProfileApi';
import { Meteor } from 'meteor/meteor';

export interface ILoansModuleContext {
	state?: string;
	id?: string;
}

export const LoansModuleContext = React.createContext<ILoansModuleContext>({});

export default (props: IDefaultContainerProps) => {
	const { screenState, loanId } = useParams<{ screenState?: string; loanId?: string }>();
	const state = screenState ?? props.screenState;
	const id = loanId ?? props.id;

	const validState = ['view', 'return', 'extension', 'edit', 'create'];

	const { isAdmin } = useTracker(() => {
		const meteorUserId = Meteor.userId();
		const subHandle = userprofileApi.subscribe('userProfileDetail', { _id: meteorUserId });
		const loggedUserProfile = subHandle?.ready()
			? userprofileApi.findOne({ _id: meteorUserId })
			: null;
		return {
			isAdmin: loggedUserProfile?.roles?.includes('Administrador') ?? false
		};
	}, []);

	const renderPage = () => {
		if (state === 'create') return <LoansCreateController />;
		if (validState.includes(state!)) {
			if (state === 'edit' && !isAdmin) return <LoansListController />;
			return <LoansDetailController />;
		}
		return <LoansListController />;
	};

	const providerValue = { state, id };

	return (
		<LoansModuleContext.Provider value={providerValue}>
			{renderPage()}
		</LoansModuleContext.Provider>
	);
};