import React, { createContext, useCallback, useContext } from 'react';
import BookListView from './bookCreateView';
import { useNavigate } from 'react-router-dom';
import { BookModuleContext } from '../../bookContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { bookApi } from '../../api/bookApi';
import { IBook } from '../../api/bookSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IBookListContollerContext {
	closePage: () => void;
	document: IBook;
	loading: boolean;
	schema: ISchema<IBook>;
	onSubmit: (doc: IBook) => void;
	changeToEdit: (id: string) => void;
}

export const BookListControllerContext = createContext<IBookListContollerContext>(
	{} as IBookListContollerContext
);

const BookListController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(BookModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? bookApi.subscribe('bookList', { _id: id }) : null;
		const document = id && subHandle?.ready() ? bookApi.findOne({ _id: id }) : {};
		return {
			document: (document as IBook) ?? ({ _id: id } as IBook),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	const changeToEdit = useCallback((id: string) => {
		navigate(`/book/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: IBook) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		bookApi[selectedAction](doc, (e: IMeteorError) => {
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
		<BookListControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: bookApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			{<BookListView />}
		</BookListControllerContext.Provider>
	);
};

export default BookListController;
