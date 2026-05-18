import React, { createContext, useCallback, useContext } from 'react';
import LoansCreateView from './loansCreateView';
import { useNavigate } from 'react-router-dom';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { Meteor } from 'meteor/meteor';

interface ILoansCreateControllerContext {
	closePage: () => void;
	document: ILoans;
	schema: ISchema<ILoans>;
	onSubmit: (doc: ILoans) => void;
}

export const LoansCreateControllerContext = createContext<ILoansCreateControllerContext>(
	{} as ILoansCreateControllerContext
);

const LoansCreateController = () => {
const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const closePage = useCallback(() => {
		navigate('/');
	}, []);

	const onSubmit = useCallback(
		(doc: ILoans) => {
			const user = Meteor.userId();
			const createdAt = new Date();
			const updatedAt = new Date();

			const enrichedDoc: ILoans = {
				...doc,
				createdBy: user,
				createdAt: createdAt,
				updatedAt: updatedAt
			};

			loansApi.insert(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Livro criado!',
						message: 'O livro foi cadastrado com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao criar livro!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<LoansCreateControllerContext.Provider
			value={{
				closePage,
				document: {} as ILoans,
				schema: loansApi.getSchema(),
				onSubmit
			}}>
			{<LoansCreateView />}
		</LoansCreateControllerContext.Provider>
	);
};

export default LoansCreateController;
