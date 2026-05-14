import React, { createContext, useCallback, useContext } from 'react';
import LoanListView from './loanListView';
import { useNavigate } from 'react-router-dom';
import { LoansModuleContext } from '../../loansContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface ILoansListContollerContext {
	closePage: () => void;
	document: ILoans;
	loading: boolean;
	schema: ISchema<ILoans>;
	onSubmit: (doc: ILoans) => void;
	changeToEdit: (id: string) => void;
}

export const LoansListControllerContext = createContext<ILoansListContollerContext>(
	{} as ILoansListContollerContext
);

const LoansListController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(LoansModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? loansApi.subscribe('loans.list', { _id: id }) : null;
		const document = id && subHandle?.ready() ? loansApi.findOne({ _id: id }) : {};
		return {
			document: (document as ILoans) ?? ({ _id: id } as ILoans),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/loan/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ILoans) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		loansApi[selectedAction](doc, (e: IMeteorError) => {
			if (!e) {
				closePage();
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					message: `O exemplo foi ${selectedAction === 'update' ? 'atualizado' : 'cadastrado'} com sucesso!`
				});
			} else {
				showNotification({
					type: 'error',
					title: 'Operação não realizada!',
					message: `Erro ao realizar a operação: ${e.reason}`
				});
			}
		});
	}, []);

	return (
		<LoansListControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: loansApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<LoanListView />}
		</LoansListControllerContext.Provider>
	);
};

export default LoansListController;
