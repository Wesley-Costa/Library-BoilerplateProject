import React, { createContext, useCallback, useContext, useMemo } from 'react';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { booksApi } from '../../api/booksApi';
import { IBooks } from '../../api/booksSch';
import BooksListView from './booksListView';

interface IBooksListContollerContext {
	books: IBooks[];
	loading: boolean;
	booksTotal: number;
	loadingBooks: boolean;
	booksList: IBooks[];
	formatDate: (date: string | Date) => string;
	onEditBook: (book: IBooks) => void;
	onAddBook: () => void;
	onDeleteBook: (book: IBooks) => void;
}

export const BooksListControllerContext = createContext<IBooksListContollerContext>(
	{} as IBooksListContollerContext
);

const BooksListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const formatDate = (date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	};

	const {
		books: booksList,
		loading: loadingBooks,
		total: booksTotal
	} = useTracker(() => {
		const subHandle = booksApi.subscribe('books.list') ?? null;
		const isReady = !!subHandle && subHandle.ready();
		const books = isReady ? booksApi.find({}).fetch() : [];
		const totalBooks = booksApi.counts.findOne({ _id: 'books.booksTotal' })?.count ?? 0;

		return {
			books,
			loading: !isReady,
			total: totalBooks
		};
	}, []);

	const onEditBook = useCallback(
		(book: IBooks) => {
			navigate(`/books/edit/${book._id}`);
		},
		[navigate]
	);

	const onAddBook = useCallback(() => {
		navigate('/books/create');
	}, [navigate]);

	const onDeleteBook = useCallback(
		(book: IBooks) => {
			if (!book?._id) return;

			booksApi.remove({ _id: book._id }, (e: IMeteorError, r: any) => {
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao excluir',
						message: e.reason || 'Falha ao excluir o livro',
						showCloseButton: true
					});
					return;
				}
				showNotification({
					type: 'success',
					title: 'Livro excluído',
					message: (r && (r.message || r.reason)) || 'Livro removido com sucesso',
					showCloseButton: true
				});
			});
		},
		[showNotification]
	);

	const providerValues: IBooksListContollerContext = useMemo(
		() => ({
			books: booksList,
			loading: loadingBooks,
			booksTotal,
			loadingBooks,
			booksList,
			onEditBook,
			onAddBook,
			onDeleteBook,
			formatDate
		}),
		[booksList, loadingBooks, booksTotal, onEditBook, onAddBook, onDeleteBook]
	);

	return (
		<BooksListControllerContext.Provider value={providerValues}>
			<BooksListView />
		</BooksListControllerContext.Provider>
	);
};

export default BooksListController;