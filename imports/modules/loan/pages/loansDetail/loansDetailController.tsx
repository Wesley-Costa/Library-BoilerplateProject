import React, { createContext, useCallback, useContext, useState } from 'react';
import LoansDetailView from './loansDetailView';
import { useNavigate } from 'react-router-dom';
import { LoansModuleContext } from '../../loansContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { loansApi } from '../../api/loansApi';
import { booksApi } from '../../../book/api/booksApi';
import { ILoans } from '../../api/loansSch';
import { IBooks } from '../../../book/api/booksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface ILoansDetailControllerContext {
	document: ILoans;
	loading: boolean;
	schema: ISchema<ILoans>;
	optionsBooks: { value: string; label: string }[];
	loadingBooks: boolean;
	selectedBook: string;
	availableVolumes: number | null;
	onSubmit: (doc: ILoans) => void;
	onDelete: () => void;
	setSelectedBook: (id: string) => void;
	closePage: () => void;
}

export const LoansDetailControllerContext = createContext<ILoansDetailControllerContext>(
	{} as ILoansDetailControllerContext
);

const LoansDetailController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const { id } = useContext(LoansModuleContext);
	const [selectedBook, setSelectedBook] = useState<string>('');

	const { optionsBooks, loadingBooks, availableVolumes } = useTracker(() => {
		const booksHandle = booksApi.subscribe('books.list') ?? null;
		const loansHandle = loansApi.subscribe('loans.list') ?? null;

		const booksReady = !!booksHandle && booksHandle.ready();
		const loansReady = !!loansHandle && loansHandle.ready();

		const books = booksReady ? booksApi.find({}, { sort: { title: 1 } }).fetch() : [];

		const selectedBookData = selectedBook ? booksApi.findOne({ _id: selectedBook }) : null;

		return {
			optionsBooks: books.map((b) => ({ value: b._id!, label: b.title })),
			loadingBooks: !booksReady || !loansReady,
			availableVolumes: selectedBookData?.volumes ?? null
		};
	}, [selectedBook]);

	const { document, loading } = useTracker(() => {
		const loanHandle = id ? loansApi.subscribe('loans.detail', { _id: id }) : null;
		const loanReady = !!loanHandle && loanHandle.ready();

		const doc = id && loanReady ? loansApi.findOne({ _id: id }) : ({} as ILoans);

		return {
			document: doc,
			loading: !loanReady
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate('/loans/list');
	}, [navigate]);

	const onDelete = useCallback(() => {
		if (!id) return;
		loansApi.remove({ _id: id }, (e: IMeteorError) => {
			if (!e) {
				closePage();
				showNotification({
					type: 'success',
					title: 'Operação realizada!',
					message: 'O empréstimo foi excluído com sucesso!',
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
	}, [id, closePage, showNotification]);

	const onSubmit = useCallback(
		(doc: ILoans) => {
			const book = booksApi.findOne({ _id: doc.bookId });
			const borrowedVolumes = Number(doc.borrowedVolumes);

			const savedLoan = loansApi.findOne({ _id: doc._id });
			const originalBorrowedVolumes = Number(savedLoan?.borrowedVolumes);

			const isReturned = doc.status === 'returned' && savedLoan?.status !== 'returned';
			const volumesChanged = doc.status === 'borrowed' && borrowedVolumes !== originalBorrowedVolumes;
			const volumeDiff = borrowedVolumes - originalBorrowedVolumes;

			const enrichedDoc: ILoans = {
				...doc,
				borrowedVolumes,
				updatedAt: new Date(),
				loanDate: new Date(doc.loanDate),
				returnDate: new Date(doc.returnDate)
			};

			if (isReturned) {
				if (!book) {
					showNotification({
						type: 'error',
						title: 'Livro não encontrado!',
						message: 'Não foi possível carregar os dados do livro. Tente novamente.',
						showCloseButton: true
					});
					return;
				}

				const updatedBook: IBooks = { ...book!, volumes: book!.volumes + originalBorrowedVolumes };

				booksApi.update(updatedBook, (e: IMeteorError) => {
					if (e) {
						showNotification({
							type: 'error',
							title: 'Erro ao restaurar volumes do livro!',
							message: `Erro ao realizar a operação: ${e.reason}`,
							showCloseButton: true
						});
						return;
					}

					loansApi.update(enrichedDoc, (updateError: IMeteorError) => {
						if (updateError) {
							booksApi.update(book!, () => {
								showNotification({
									type: 'error',
									title: 'Erro ao registrar devolução!',
									message: `Erro ao realizar a operação: ${updateError.reason}`,
									showCloseButton: true
								});
							});
							return;
						}

						showNotification({
							type: 'success',
							title: 'Devolução realizada!',
							message: `${originalBorrowedVolumes} volume(s) devolvido(s) com sucesso!`,
							showCloseButton: true
						});
						closePage();
					});
				});
				return;
			}

			if (volumesChanged) {
				if (!book) {
					showNotification({
						type: 'error',
						title: 'Livro não encontrado!',
						message: 'Não foi possível carregar os dados do livro. Tente novamente.',
						showCloseButton: true
					});
					return;
				}

				if (volumeDiff > 0 && book!.volumes < volumeDiff) {
					showNotification({
						type: 'error',
						title: 'Volumes insuficientes!',
						message: `Existem apenas ${book!.volumes} volume(s) disponível(is).`,
						showCloseButton: true
					});
					return;
				}

				const updatedBook: IBooks = { ...book!, volumes: book!.volumes - volumeDiff };

				booksApi.update(updatedBook, (e: IMeteorError) => {
					if (e) {
						showNotification({
							type: 'error',
							title: 'Erro ao ajustar volumes do livro!',
							message: `Erro ao realizar a operação: ${e.reason}`,
							showCloseButton: true
						});
						return;
					}

					loansApi.update(enrichedDoc, (updateError: IMeteorError) => {
						if (updateError) {
							booksApi.update(book!, () => {
								showNotification({
									type: 'error',
									title: 'Erro ao atualizar empréstimo!',
									message: `Erro ao realizar a operação: ${updateError.reason}`,
									showCloseButton: true
								});
							});
							return;
						}

						showNotification({
							type: 'success',
							title: 'Empréstimo atualizado!',
							message: 'O empréstimo foi atualizado com sucesso!',
							showCloseButton: true
						});
						closePage();
					});
				});
				return;
			}

			loansApi.update(enrichedDoc, (e: IMeteorError) => {
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar empréstimo!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
					return;
				}

				showNotification({
					type: 'success',
					title: 'Empréstimo atualizado!',
					message: 'O empréstimo foi atualizado com sucesso!',
					showCloseButton: true
				});
				closePage();
			});
		},
		[closePage, showNotification]
	);

	return (
		<LoansDetailControllerContext.Provider
			value={{
				document: {
					...document,
					_id: id,
					loanDate: document.loanDate ? new Date(document.loanDate).toISOString().split('T')[0] : '',
					returnDate: document.returnDate ? new Date(document.returnDate).toISOString().split('T')[0] : ''
				} as ILoans,
				loading,
				schema: loansApi.getSchema(),
				optionsBooks,
				loadingBooks,
				selectedBook,
				availableVolumes,
				closePage,
				onSubmit,
				onDelete,
				setSelectedBook
			}}>
			<LoansDetailView />
		</LoansDetailControllerContext.Provider>
	);
};

export default LoansDetailController;