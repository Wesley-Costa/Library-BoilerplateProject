import React, { createContext, useCallback, useContext } from 'react';
import BooksDetailView from './booksDetailView';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { booksApi } from '../../api/booksApi';
import { IBooks } from '../../api/booksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { useTracker } from 'meteor/react-meteor-data';
import { BooksModuleContext } from '../../booksContainer';
import { authorsApi } from '../../../author/api/authorsApi';

interface IBooksDetailControllerContext {
	closePage: () => void;
	document: IBooks;
	loading: boolean;
	schema: ISchema<IBooks>;
	onSubmit: (doc: IBooks) => void;
	onDelete: () => void;
    optionsAuthors: { value: string; label: string }[];
    loadingAuthors: boolean;
}

export const BooksDetailControllerContext = createContext<IBooksDetailControllerContext>(
	{} as IBooksDetailControllerContext
);

const BooksDetailController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const { id } = useContext(BooksModuleContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? booksApi.subscribe('books.detail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? booksApi.findOne({ _id: id }) : {};

		return {
			document: (document as IBooks) || ({} as IBooks),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const { optionsAuthors, loadingAuthors } = useTracker(() => {
			const subHandle = authorsApi.subscribe('authors.list') ?? null;
			const isReady = !!subHandle && subHandle.ready();
	
			const authors = isReady
				? authorsApi.find({}, { sort: { name: 1 } }).fetch()
				: [];
	
			const optionsAuthors = authors.map((author) => ({
				value: author._id,
				label: author.name
			}));
	
			return { optionsAuthors, loadingAuthors: !isReady };
		}, []);

	const closePage = useCallback(() => {
		navigate('/books/view');
	}, []);

	const onDelete = useCallback(() => {
		if (id) {
			booksApi.remove({ _id: id }, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Operação realizada!',
						message: 'O livro foi deletado com sucesso!',
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
		(doc: IBooks) => {
			const updatedAt = new Date();

			const enrichedDoc: IBooks = {
				...doc,
				_id: id,
				updatedAt: updatedAt,
			};

			booksApi.update(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Livro atualizado!',
						message: 'O livro foi atualizado com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar livro!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<BooksDetailControllerContext.Provider
			value={{
				document: {
					...document,
					_id: id
				} as IBooks,
				loading,
				schema: booksApi.getSchema(),
                loadingAuthors,
                optionsAuthors,
				onSubmit,
				onDelete,
				closePage
				
			}}>
			{<BooksDetailView />}
		</BooksDetailControllerContext.Provider>
	);
};

export default BooksDetailController;
