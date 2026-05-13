import React, { createContext, useCallback, useContext } from 'react';
import AuthorsListView from './authorsListView';
import { useNavigate } from 'react-router-dom';
import { AuthorsModuleContext } from '../../authorsContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { authorsApi } from '../../api/authorsApi';
import { IAuthors } from '../../api/authorsSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IAuthorsListContollerContext {
	closePage: () => void;
	document: IAuthors;
	loading: boolean;
	schema: ISchema<IAuthors>;
	onSubmit: (doc: IAuthors) => void;
	changeToEdit: (id: string) => void;
}

export const AuthorsListControllerContext = createContext<IAuthorsListContollerContext>(
	{} as IAuthorsListContollerContext
);

const AuthorsListController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(AuthorsModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? authorsApi.subscribe('authors.list', { _id: id }) : null;
		const document = id && subHandle?.ready() ? authorsApi.findOne({ _id: id }) : {};
		return {
			document: (document as IAuthors) ?? ({ _id: id } as IAuthors),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate('/');
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/author/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: IAuthors) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		authorsApi[selectedAction](doc, (e: IMeteorError) => {
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
		<AuthorsListControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: authorsApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<AuthorsListView />}
		</AuthorsListControllerContext.Provider>
	);
};

export default AuthorsListController;
