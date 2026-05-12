import React, { createContext, useCallback, useContext } from 'react';
import LoanListView from './loanListView';
import { useNavigate } from 'react-router-dom';
import { LoanModuleContext } from '../../loanContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { loanApi } from '../../api/loanApi';
import { ILoan } from '../../api/loanSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface ILoanListContollerContext {
	closePage: () => void;
	document: ILoan;
	loading: boolean;
	schema: ISchema<ILoan>;
	onSubmit: (doc: ILoan) => void;
	changeToEdit: (id: string) => void;
}

export const LoanListControllerContext = createContext<ILoanListContollerContext>(
	{} as ILoanListContollerContext
);

const LoanListController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(LoanModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? loanApi.subscribe('loanList', { _id: id }) : null;
		const document = id && subHandle?.ready() ? loanApi.findOne({ _id: id }) : {};
		return {
			document: (document as ILoan) ?? ({ _id: id } as ILoan),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/loan/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ILoan) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		loanApi[selectedAction](doc, (e: IMeteorError) => {
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
		<LoanListControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: loanApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<LoanListView />}
		</LoanListControllerContext.Provider>
	);
};

export default LoanListController;
