import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
	booksPage: number;
	totalPages: number;

	onEditBook: (book: IBooks) => void;
	onAddBook: () => void;
	onDeleteBook: (book: IBooks) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
}

export const BooksListControllerContext = createContext<IBooksListContollerContext>({} as IBooksListContollerContext);

const BooksListController = () => {
	const PAGE_SIZE = 5;
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [booksPage, setBooksPage] = useState(1);
	const [visibleBooks, setVisibleBooks] = useState<IBooks[]>([]);

	const {
		books: booksList,
		loading: loadingBooks,
		total: booksTotal
	} = useTracker(() => {
		const skip = (booksPage - 1) * PAGE_SIZE;
		const limit = PAGE_SIZE;
		const filter = {};

		const subHandle = booksApi.subscribe('books.list', filter, { skip: skip, limit: limit }) ?? null;
		const isReady = !!subHandle && subHandle.ready();
		const books = isReady ? booksApi.find({}, { sort: { name: 1 } }).fetch() : [];
		const totalBooks = booksApi.counts.findOne({ _id: 'books.listTotal' })?.count ?? 0;

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

	useEffect(() => {
		if (!loadingBooks) {
			setVisibleBooks(booksList);
		}
	}, [loadingBooks, booksList]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil((booksTotal || 0) / PAGE_SIZE));
		if (booksPage > totalPages && totalPages > 0) {
			setBooksPage(totalPages);
		}
	}, [booksPage, booksTotal]);

	const totalPages = Math.max(1, Math.ceil(booksTotal || 0) / PAGE_SIZE);

	const onNextPage = useCallback(() => {
		if (booksPage < totalPages) {
			setBooksPage(booksPage + 1);
		}
	}, [booksPage, totalPages]);

	const onPrevPage = useCallback(() => {
		if (booksPage > 1) {
			setBooksPage(booksPage - 1);
		}
	}, [booksPage]);

	const providerValues: IBooksListContollerContext = useMemo(
		() => ({
			books: visibleBooks,
			loading: loadingBooks && visibleBooks.length === 0,
			booksTotal,
			loadingBooks,
			loadingBooksPage: loadingBooks,
			booksList: visibleBooks,
			booksPage,
			totalPages,
			onEditBook,
			onAddBook,
			onDeleteBook,
			onNextPage,
			onPrevPage
		}),
		[
			visibleBooks,
			loadingBooks,
			booksTotal,
			totalPages,
			booksPage,
			onEditBook,
			onAddBook,
			onDeleteBook,
			onNextPage,
			onPrevPage
		]
	);

	return (
		<BooksListControllerContext.Provider value={providerValues}>
			<BooksListView />
		</BooksListControllerContext.Provider>
	);
};

export default BooksListController;
