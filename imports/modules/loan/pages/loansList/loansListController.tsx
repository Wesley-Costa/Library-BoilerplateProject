import React, { createContext, useCallback, useContext, useMemo } from 'react';
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
	loansList: ILoans[];
	formatDate: (date: string | Date) => string;
	onEditLoan: (loan: ILoans) => void;
	onAddLoan: () => void;
	onDeleteLoan: (loan: ILoans) => void;
}

export const LoansListControllerContext = createContext<ILoansListContollerContext>({} as ILoansListContollerContext);

const LoansListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const formatDate = (date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	};

	const {
		loans: loansList,
		loading: loadingLoans,
		total: loansTotal
	} = useTracker(() => {
		const subHandle = loansApi.subscribe('loans.list') ?? null;
		const isReady = !!subHandle && subHandle.ready();
		const loans = isReady ? loansApi.find({}).fetch() : [];
		const totalLoans = loansApi.counts.findOne({ _id: 'loans.loansTotal' })?.count ?? 0;

		return {
			loans,
			loading: !isReady,
			total: totalLoans
		};
	}, []);

	const onEditLoan = useCallback(
		(loan: ILoans) => {
			navigate(`/loans/edit/${loan._id}`);
		},
		[navigate]
	);

	const onAddLoan = useCallback(() => {
		navigate('/loans/create');
	}, [navigate]);

	const onDeleteLoan = useCallback(
		(loan: ILoans) => {
			if (!loan?._id) return;

			loansApi.remove({ _id: loan._id }, (e: IMeteorError, r: any) => {
				if (e) {
					showNotification({
						type: 'error',
						title: 'Erro ao excluir',
						message: e.reason || 'Falha ao excluir o autor',
						showCloseButton: true
					});
					return;
				}
				showNotification({
					type: 'success',
					title: 'Autor excluído',
					message: (r && (r.message || r.reason)) || 'Autor removido com sucesso',
					showCloseButton: true
				});
			});
		},
		[showNotification]
	);

	const providerValues: ILoansListContollerContext = useMemo(
		() => ({
			loans: loansList,
			loading: loadingLoans,
			loansTotal,
			loadingLoans,
			loansList,
			onEditLoan,
			onAddLoan,
			onDeleteLoan,
			formatDate
		}),
		[loansList, loadingLoans, loansTotal, onEditLoan, onAddLoan, onDeleteLoan]
	);

	return (
		<LoansListControllerContext.Provider value={providerValues}>
			<LoansListView />
		</LoansListControllerContext.Provider>
	);
};

export default LoansListController;
