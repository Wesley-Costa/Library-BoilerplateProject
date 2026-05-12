import React, { createContext, useCallback, useContext } from 'react';
import AuthorCreateView from './authorCreateView';
import { useNavigate } from 'react-router-dom';
import { AuthorModuleContext } from '../../authorContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { authorApi } from '../../api/authorApi';
import { IAuthor } from '../../api/authorSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IAuthorCreateContollerContext {
	closePage: () => void;
	document: IAuthor;
	loading: boolean;
	schema: ISchema<IAuthor>;
	onSubmit: (doc: IAuthor) => void;
	changeToEdit: (id: string) => void;
}

export const AuthorCreateControllerContext = createContext<IAuthorCreateContollerContext>(
	{} as IAuthorCreateContollerContext
);

const AuthorCreateController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(AuthorModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? authorApi.subscribe('authorCreate', { _id: id }) : null;
		const document = id && subHandle?.ready() ? authorApi.findOne({ _id: id }) : {};
		return {
			document: (document as IAuthor) ?? ({ _id: id } as IAuthor),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/author/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: IAuthor) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		authorApi[selectedAction](doc, (e: IMeteorError) => {
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
		<AuthorCreateControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: authorApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<AuthorCreateView />}
		</AuthorCreateControllerContext.Provider>
	);
};

export default AuthorCreateController;
