import React, { createContext, useCallback, useContext } from 'react';
import LoansDetailView from './loansDetailView';
import { useNavigate } from 'react-router-dom';
import { LoansModuleContext } from '../../loansContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface ILoansDetailControllerContext {
	closePage: () => void;
	document: ILoans;
	loading: boolean;
	schema: ISchema<ILoans>;
	onSubmit: (doc: ILoans) => void;
	onDelete: () => void;
}

export const LoansDetailControllerContext = createContext<ILoansDetailControllerContext>(
	{} as ILoansDetailControllerContext
);

const LoansDetailController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const { id } = useContext(LoansModuleContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? loansApi.subscribe('loans.detail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? loansApi.findOne({ _id: id }) : {};

		return {
			document: (document as ILoans) || ({} as ILoans),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate('/');
	}, []);

	const onDelete = useCallback(() => {
		if (id) {
			loansApi.remove({ _id: id }, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						message: 'O empréstimo foi excluido com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Operação não realizada!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		}
	}, [id, closePage, showNotification]);

	const onSubmit = useCallback(
		(doc: ILoans) => {
			const updatedAt = new Date();

			const enrichedDoc: ILoans = {
				...doc,
				_id: id,
				updatedAt: updatedAt
			};

			loansApi.update(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Empréstimo atualizado!',
						message: 'O empréstimo foi atualizado com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar empréstimo!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<LoansDetailControllerContext.Provider
			value={{
				closePage,
				document: {
					...document,
					_id: id
				} as ILoans,
				loading,
				schema: loansApi.getSchema(),
				onSubmit,
				onDelete
			}}>
			{<LoansDetailView />}
		</LoansDetailControllerContext.Provider>
	);
};

export default LoansDetailController;
