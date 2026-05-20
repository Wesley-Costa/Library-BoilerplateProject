import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import LoansListView from './loansListView';
import { loansApi } from '../../api/loansApi';
import { ILoans } from '../../api/loansSch';

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
	onEditLoan: (author: ILoans) => void;
	onAddLoan: () => void;
	onDeleteLoan: (author: ILoans) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
}

export const LoansListControllerContext = createContext<ILoansListContollerContext>({} as ILoansListContollerContext);

const LoansListController = () => {
	const PAGE_SIZE = 5;
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [loansPage, setLoansPage] = useState(1);
	const [visibleLoans, setVisibleLoans] = useState<ILoans[]>([]);

	const formatDate = useCallback((date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	}, []);

	const {
		loans: loansList,
		loading: loadingLoans,
		total: loansTotal
	} = useTracker(() => {
		const skip = (loansPage - 1) * PAGE_SIZE;
		const filter = {};

		const subHandle = loansApi.subscribe('loans.list', filter, { skip: skip, limit: PAGE_SIZE }) ?? null;
		const isReady = !!subHandle && subHandle.ready();

		const loans = isReady ? loansApi.find(filter, { sort: { loanDate: 1 } }).fetch() : [];

		const totalLoans = loansApi.counts.findOne({ _id: 'loans.listTotal' })?.count ?? 0;

		return {
			loans,
			loading: !isReady,
			total: totalLoans
		};
	}, [loansPage]);

	useEffect(() => {
		if (!loadingLoans) {
			setVisibleLoans(loansList);
		}
	}, [loadingLoans, loansList]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil((loansTotal || 0) / PAGE_SIZE));
		if (loansPage > totalPages && totalPages > 0) {
			setLoansPage(totalPages);
		}
	}, [loansPage, loansTotal]);

	const totalPages = Math.max(1, Math.ceil((loansTotal || 0) / PAGE_SIZE));

	const onEditLoan = useCallback(
		(author: ILoans) => {
			navigate(`/loans/edit/${author._id}`);
		},
		[navigate]
	);

	const onAddLoan = useCallback(() => {
		navigate('/loans/create');
	}, [navigate]);

	const onDeleteLoan = useCallback(
		(author: ILoans) => {
			if (!author?._id) return;

			loansApi.remove({ _id: author._id }, (e: IMeteorError, r: any) => {
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
		if (loansPage < totalPages) {
			setLoansPage(loansPage + 1);
		}
	}, [loansPage, totalPages]);

	const onPrevPage = useCallback(() => {
		if (loansPage > 1) {
			setLoansPage(loansPage - 1);
		}
	}, [loansPage]);

	const providerValues: ILoansListContollerContext = useMemo(
		() => ({
			loans: visibleLoans,
			loading: loadingLoans && visibleLoans.length === 0,
			loansTotal,
			loadingLoans,
			loadingLoansPage: loadingLoans,
			loansList: visibleLoans,
			loansPage,
			totalPages,
			onEditLoan,
			onAddLoan,
			onDeleteLoan,
			onNextPage,
			onPrevPage,
			formatDate
		}),
		[
			visibleLoans,
			loadingLoans,
			loansTotal,
			totalPages,
			loansPage,
			onEditLoan,
			onAddLoan,
			onDeleteLoan,
			onNextPage,
			onPrevPage,
			formatDate
		]
	);

	return (
		<LoansListControllerContext.Provider value={providerValues}>
			<LoansListView />
		</LoansListControllerContext.Provider>
	);
};

export default LoansListController;
