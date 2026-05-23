import React, { createContext, useCallback, useContext } from 'react';
import LoansCreateView from './loansCreateView';
import { useNavigate } from 'react-router-dom';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { booksApi } from '../../../book/api/booksApi';

interface ILoansCreateControllerContext {
	closePage: () => void;
	document: ILoans;
	schema: ISchema<ILoans>;
	onSubmit: (doc: ILoans) => void;
	optionsBooks: { value: string; label: string }[];
	loadingBooks: boolean;
	selectedBook: string;
	setSelectedBook: (id: string) => void;
	availableVolumes: number | null;
}

export const LoansCreateControllerContext = createContext<ILoansCreateControllerContext>(
	{} as ILoansCreateControllerContext
);

const LoansCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [selectedBook, setSelectedBook] = React.useState<string>('');

	const { optionsBooks, loadingBooks, availableVolumes } = useTracker(() => {
		const booksHandle = booksApi.subscribe('books.list') ?? null;
		const loansHandle = loansApi.subscribe('loans.list') ?? null;

		const booksReady = !!booksHandle && booksHandle.ready();
		const loansReady = !!loansHandle && loansHandle.ready();

		const books = booksReady ? booksApi.find({}, { sort: { title: 1 } }).fetch() : [];
		
		const selectedBookData = selectedBook ? (booksApi.findOne({ _id: selectedBook }) ?? null) : null;

		return {
			optionsBooks: books.map((b) => ({ value: b._id!, label: b.title })),
			loadingBooks: !booksReady || !loansReady,
			availableVolumes: selectedBookData?.volumes ?? null
		};
	}, [selectedBook]);

	const closePage = useCallback(() => {
		navigate('/loans/view');
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: ILoans) => {
			const borrowedVolumes = Number(doc.borrowedVolumes);

			const currentBookData = booksApi.findOne({ _id: doc.bookId });
			const currentAvailableVolumes = currentBookData?.volumes ?? null;

			if (!currentBookData) {
				showNotification({
					type: 'error',
					title: 'Livro não encontrado!',
					message: 'Não foi possível localizar o livro selecionado.',
					showCloseButton: true
				});
				return;
			}

			if (currentAvailableVolumes === 0) {
				showNotification({
					type: 'error',
					title: 'Sem volumes disponíveis!',
					message: 'Todos os volumes deste livro já estão emprestados.',
					showCloseButton: true
				});
				return;
			}

			if (borrowedVolumes > (currentAvailableVolumes ?? 0)) {
				showNotification({
					type: 'error',
					title: 'Volumes insuficientes!',
					message: `Existem apenas ${currentAvailableVolumes} volume(s) disponível(is). Você tentou emprestar ${borrowedVolumes}.`,
					showCloseButton: true
				});
				return;
			}

			const originalBook = { ...currentBookData };
			const updatedBook = { ...currentBookData, volumes: currentBookData.volumes - borrowedVolumes };

			booksApi.update(updatedBook, (bookError: IMeteorError) => {
				if (bookError) {
					showNotification({
						type: 'error',
						title: 'Erro ao atualizar livro!',
						message: `Erro ao realizar a operação: ${bookError.reason}`,
						showCloseButton: true
					});
					return;
				}

				const now = new Date();
				const enrichedDoc: ILoans = {
					...doc,
					borrowedVolumes,
					createdBy: Meteor.userId(),
					createdAt: now,
					updatedAt: now,
					loanDate: new Date(doc.loanDate),
					returnDate: new Date(doc.returnDate)
				};

				loansApi.insert(enrichedDoc, (insertError: IMeteorError) => {
					if (insertError) {
						booksApi.update(originalBook, (_revertError: IMeteorError) => {
							showNotification({
								type: 'error',
								title: 'Erro ao criar empréstimo!',
								message: `Erro ao realizar a operação: ${insertError.reason}`,
								showCloseButton: true
							});
						});
						return;
					}

					showNotification({
						type: 'success',
						title: 'Empréstimo criado!',
						message: 'O empréstimo foi cadastrado com sucesso!',
						showCloseButton: true
					});
					closePage();
				});
			});
		},
		[closePage, showNotification]
	);

	return (
		<LoansCreateControllerContext.Provider
			value={{
				document: {} as ILoans,
				schema: loansApi.getSchema(),
				optionsBooks,
				loadingBooks,
				selectedBook,
				setSelectedBook,
				availableVolumes,
				onSubmit,
				closePage
			}}>
			<LoansCreateView />
		</LoansCreateControllerContext.Provider>
	);
};

export default LoansCreateController;