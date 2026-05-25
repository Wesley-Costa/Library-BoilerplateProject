import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import LoansListView from './loansListView';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';
import { booksApi } from '/imports/modules/book/api/booksApi';

interface ILoansListContollerContext {
	loans: ILoans[];
	loading: boolean;
	loansTotal: number;
	loadingLoans: boolean;
	loadingLoansPage: boolean;
	loansList: ILoans[];
	loansPage: number;
	totalPages: number;
	formatDate: (date: string | Date) => string;
	onEditLoan: (loan: ILoans) => void;
	onAddLoan: () => void;
	onDeleteLoan: (loan: ILoans) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	getBookTitle: (loan: ILoans) => string;
	onExtensionLoan: (loan: ILoans) => void;
	onReturnLoan: (loan: ILoans) => void;
}

export const LoansListControllerContext = createContext<ILoansListContollerContext>({} as ILoansListContollerContext);

const LoansListController = () => {
	const PAGE_SIZE = 5;
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [loansPage, setLoansPage] = useState(1);

	const formatDate = useCallback((date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	}, []);

	const { loansList, loadingLoans, loansTotal } = useTracker(() => {
		const skip = (loansPage - 1) * PAGE_SIZE;
		const subHandle = loansApi.subscribe('loans.list', {}, { skip, limit: PAGE_SIZE }) ?? null;
		const isReady = !!subHandle && subHandle.ready();

		return {
			loansList: isReady ? loansApi.find({}, { sort: { loanDate: -1 } }).fetch() : [],
			loadingLoans: !isReady,
			loansTotal: loansApi.counts.findOne({ _id: 'loans.listTotal' })?.count ?? 0
		};
	}, [loansPage]);

	const { books } = useTracker(() => {
		const bookIds = loansList.map((l) => l.bookId).filter(Boolean);
		const subHandle = booksApi.subscribe('books.list', { _id: { $in: bookIds } });
		const isReady = !!subHandle && subHandle.ready();

		return {
			books: isReady ? booksApi.find({ _id: { $in: bookIds } }).fetch() : []
		};
	}, [loansList]);

	const getBookTitle = useCallback(
		(loan: ILoans) => {
			const book = books.find((b) => b._id === loan.bookId);
			return book ? book.title : 'Livro desconhecido';
		}, [books]);

	const totalPages = Math.max(1, Math.ceil(loansTotal / PAGE_SIZE));

	const onEditLoan = useCallback((loan: ILoans) => navigate(`/loans/edit/${loan._id}`), [navigate]);
	const onAddLoan = useCallback(() => navigate('/loans/create'), [navigate]);
	const onExtensionLoan = useCallback((loan: ILoans) => navigate(`/loans/extension/${loan._id}`), [navigate]);
	const onReturnLoan = useCallback((loan: ILoans) => navigate(`/loans/return/${loan._id}`), [navigate]);


	const onDeleteLoan = useCallback(
		(loan: ILoans) => {
			if (!loan?._id) return;
			loansApi.remove({ _id: loan._id }, (e: IMeteorError, r: any) => {
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao excluir',
						message: e.reason || 'Falha ao excluir o empréstimo',
						showCloseButton: true
					});
					return;
				}
				showNotification({
					type: 'success',
					title: 'Empréstimo excluído',
					message: (r && (r.message || r.reason)) || 'Empréstimo removido com sucesso',
					showCloseButton: true
				});
			});
		},
		[showNotification]
	);

	const onNextPage = useCallback(() => {
		if (loansPage < totalPages) setLoansPage(loansPage + 1);
	}, [loansPage, totalPages]);

	const onPrevPage = useCallback(() => {
		if (loansPage > 1) setLoansPage(loansPage - 1);
	}, [loansPage]);

	const providerValues: ILoansListContollerContext = useMemo(
		() => ({
			loans: loansList,
			loading: loadingLoans,
			loansTotal,
			loadingLoans,
			loadingLoansPage: loadingLoans,
			loansList,
			loansPage,
			totalPages,
			formatDate,
			onEditLoan,
			onExtensionLoan,
			onReturnLoan,
			onAddLoan,
			onDeleteLoan,
			onNextPage,
			onPrevPage,
			getBookTitle
		}),
		[
			loansList,
			loadingLoans,
			loansTotal,
			loansPage,
			totalPages,
			formatDate,
			onEditLoan,
			onReturnLoan,
			onExtensionLoan,
			onAddLoan,
			onDeleteLoan,
			onNextPage,
			onPrevPage,
			getBookTitle
		]
	);

	return (
		<LoansListControllerContext.Provider value={providerValues}>
			<LoansListView />
		</LoansListControllerContext.Provider>
	);
};

export default LoansListController;
