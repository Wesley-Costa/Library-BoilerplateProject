import React, { createContext, useCallback, useContext, useMemo } from 'react';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import AuthorsListView from './authorsListView';
import { authorsApi } from '../../api/authorsApi';
import { IAuthors } from '../../api/authorsSch';

interface IAuthorsListContollerContext {
	authors: IAuthors[];
	loading: boolean;
	authorsTotal: number;
	loadingAuthors: boolean;
	authorsList: IAuthors[];
	formatDate: (date: string | Date) => string;
	onEditAuthor: (author: IAuthors) => void;
	onAddAuthor: () => void;
	onDeleteAuthor: (author: IAuthors) => void;
}

export const AuthorsListControllerContext = createContext<IAuthorsListContollerContext>(
	{} as IAuthorsListContollerContext
);

const AuthorsListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const formatDate = (date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	};

	const {
		authors: authorsList,
		loading: loadingAuthors,
		total: authorsTotal
	} = useTracker(() => {
		const subHandle = authorsApi.subscribe('authors.list') ?? null;
		const isReady = !!subHandle && subHandle.ready();
		const authors = isReady ? authorsApi.find({}).fetch() : [];
		const totalAuthors = authorsApi.counts.findOne({ _id: 'authors.authorsTotal' })?.count ?? 0;

		return {
			authors,
			loading: !isReady,
			total: totalAuthors
		};
	}, []);

	const onEditAuthor = useCallback(
		(author: IAuthors) => {
			navigate(`/authors/edit/${author._id}`);
		},
		[navigate]
	);

	const onAddAuthor = useCallback(() => {
		navigate('/authors/create');
	}, [navigate]);

	const onDeleteAuthor = useCallback(
		(author: IAuthors) => {
			if (!author?._id) return;

			authorsApi.remove({ _id: author._id }, (e: IMeteorError, r: any) => {
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

	const providerValues: IAuthorsListContollerContext = useMemo(
		() => ({
			authors: authorsList,
			loading: loadingAuthors,
			authorsTotal,
			loadingAuthors,
			authorsList,
			onEditAuthor,
			onAddAuthor,
			onDeleteAuthor,
			formatDate
		}),
		[authorsList, loadingAuthors, authorsTotal, onEditAuthor, onAddAuthor, onDeleteAuthor]
	);

	return (
		<AuthorsListControllerContext.Provider value={providerValues}>
			<AuthorsListView />
		</AuthorsListControllerContext.Provider>
	);
};

export default AuthorsListController;