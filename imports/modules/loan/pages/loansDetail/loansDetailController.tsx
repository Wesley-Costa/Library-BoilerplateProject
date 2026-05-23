import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
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
	closePage: () => void;
	document: ILoans;
	loading: boolean;
	schema: ISchema<ILoans>;
	onSubmit: (doc: ILoans) => void;
	onDelete: () => void;
}

export const LoansDetailControllerContext = createContext<ILoansDetailControllerContext>(
	{} as ILoansDetailControllerContext
);

const LoansDetailController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const { id } = useContext(LoansModuleContext);

	const { document, currentBook, loading } = useTracker(() => {
		const loanHandle = id ? loansApi.subscribe('loans.detail', { _id: id }) : null;
		const loanReady = !!loanHandle && loanHandle.ready();

		const doc = id && loanReady ? loansApi.findOne({ _id: id }) : ({} as ILoans);

		const bookHandle = doc?.bookId ? booksApi.subscribe('books.detail', { _id: doc.bookId }) : null;
		const bookReady = !!bookHandle && bookHandle.ready();

		const book = bookReady && doc?.bookId ? booksApi.findOne({ _id: doc.bookId }) : undefined;

		return {
			document: doc,
			currentBook: book,
			loading: !loanReady || (doc?.bookId ? !bookReady : false)
		};
	}, [id]);

	const currentBookRef = useRef(currentBook);

	const closePage = useCallback(() => {
		navigate('/loans/view');
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

	useEffect(() => {
		currentBookRef.current = currentBook;
	}, [currentBook]);

	const onSubmit = useCallback(
		(doc: ILoans) => {
			const book = currentBookRef.current;

			const isReturned = doc.status === 'returned' && document.status !== 'returned';

			const enrichedDoc: ILoans = {
				...doc,
				updatedAt: new Date(),
				loanDate: new Date(doc.loanDate),
				returnDate: new Date(doc.returnDate)
			};

			if (!isReturned) {
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
				return;
			}

			if (!book) {
				showNotification({
					type: 'error',
					title: 'Livro não encontrado!',
					message: 'Não foi possível localizar o livro para restaurar os volumes.',
					showCloseButton: true
				});
				return;
			}

			const updateBook: IBooks = {
				...book,
				volumes: book.volumes + doc.borrowedVolumes
			};

			console.log(updateBook);

			booksApi.update(updateBook, (e: IMeteorError) => {
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao restaurar volumes do livro!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
					return;
				}

				loansApi.update(enrichedDoc, (e: IMeteorError) => {
					if (e) {
						showNotification({
							type: 'error',
							title: 'Erro ao registrar devolução!',
							message: `Erro ao realizar a operação: ${e.reason}`,
							showCloseButton: true
						});
						return;
					}

					showNotification({
						type: 'success',
						title: 'Devolução realizada!',
						message: `${doc.borrowedVolumes} volume(s) devolvido(s) com sucesso!`,
						showCloseButton: true
					});
					closePage();
				});
			});
		},
		[document, closePage, showNotification]
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
				closePage,
				onSubmit,
				onDelete
			}}>
			<LoansDetailView />
		</LoansDetailControllerContext.Provider>
	);
};

export default LoansDetailController;
