import React, { createContext, useCallback, useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import AuthorsCreateView from './authorsCreateView';
import { useNavigate } from 'react-router-dom';
import { authorsApi } from '../../api/authorsApi';
import { IAuthors } from '../../api/authorsSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IAuthorsCreateContollerContext {
	closePage: () => void;
	document: IAuthors;
	schema: ISchema<IAuthors>;
	onSubmit: (doc: IAuthors) => void;
}

export const AuthorsCreateControllerContext = createContext<IAuthorsCreateContollerContext>(
	{} as IAuthorsCreateContollerContext
);

const AuthorsCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const closePage = useCallback(() => {
		navigate('/');
	}, []);

	const onSubmit = useCallback(
		(doc: IAuthors) => {
			const user = Meteor.userId();
			const createdAt = new Date();
			const updatedAt = new Date();

			const enrichedDoc: IAuthors = {
				...doc,
				createdBy: user,
				createdAt: createdAt,
				updatedAt: updatedAt,
				birthDate: doc.birthDate ? new Date(doc.birthDate) : undefined
			};

			authorsApi.insert(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Autor criado!',
						message: 'O autor foi cadastrado com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao criar autor!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<AuthorsCreateControllerContext.Provider
			value={{
				closePage,
				document: {} as IAuthors,
				schema: authorsApi.getSchema(),
				onSubmit
			}}>
			{<AuthorsCreateView />}
		</AuthorsCreateControllerContext.Provider>
	);
};

export default AuthorsCreateController;
