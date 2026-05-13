import React, { createContext, useCallback, useContext } from 'react';
import AuthorDetailView from './authorsDetailView';
import { useNavigate } from 'react-router-dom';
import { AuthorsModuleContext } from '../../authorsContainer';
import { authorsApi } from '../../api/authorsApi';
import { IAuthors } from '../../api/authorsSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { useTracker } from 'meteor/react-meteor-data';

interface IAuthorsDetailContollerContext {
	closePage: () => void;
	document: IAuthors;
	loading: boolean;
	schema: ISchema<IAuthors>;
	onSubmit: (doc: IAuthors) => void;
	onDelete: () => void;
}

export const AuthorsDetailControllerContext = createContext<IAuthorsDetailContollerContext>(
	{} as IAuthorsDetailContollerContext
);

const AuthorsDetailController = () => {
	const navigate = useNavigate();
	const { id } = useContext(AuthorsModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? authorsApi.subscribe('authors.detail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? authorsApi.findOne({ _id: id }) : {};

		return {
			document: (document as IAuthors) || ({} as IAuthors),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate('/');
	}, []);

	const onDelete = useCallback(() => {
		if (id) {
			authorsApi.remove({ _id: id }, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						message: 'O autor foi deletado com sucesso!',
						showCloseButton: true
					});
				}
				else {
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
		(doc: IAuthors) => {
			const updatedAt = new Date();

			const updatedDoc: IAuthors = {
				...doc,
				_id: id,
				updatedAt: updatedAt,
				birthDate: doc.birthDate ? new Date(doc.birthDate) : undefined
			};
			authorsApi.update(updatedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						message: 'O autor foi atualizado com sucesso!',
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
		},
		[id, closePage, showNotification]
	);

	return (
		<AuthorsDetailControllerContext.Provider
			value={{
				closePage,
				document: {
					...document,
					_id: id,
					birthDate: document.birthDate 
						? new Date(document.birthDate).toISOString().split('T')[0] 
						: undefined
				} as IAuthors,
				loading,
				schema: authorsApi.getSchema(),
				onSubmit,
				onDelete
			}}>
			{<AuthorDetailView />}
		</AuthorsDetailControllerContext.Provider>
	);
};

export default AuthorsDetailController;
