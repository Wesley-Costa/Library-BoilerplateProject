import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
	loadingAuthorsPage: boolean;
	authorsList: IAuthors[];
	authorsPage: number;
	totalPages: number;
	formatDate: (date: string | Date) => string;
	onEditAuthor: (author: IAuthors) => void;
	onAddAuthor: () => void;
	onDeleteAuthor: (author: IAuthors) => void;
	onNextPage: () => void;
	onPrevPage: () => void;
	translateNacionality: (nationality: string) => String;
}

export const AuthorsListControllerContext = createContext<IAuthorsListContollerContext>(
	{} as IAuthorsListContollerContext
);

const AuthorsListController = () => {
	const PAGE_SIZE = 5;
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [authorsPage, setAuthorsPage] = useState(1);
	const [visibleAuthors, setVisibleAuthors] = useState<IAuthors[]>([]);

	const formatDate = useCallback((date: string | Date) => {
		if (!date) return '-';
		const d = new Date(date);
		return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
	}, []);

	const {
		authors: authorsList,
		loading: loadingAuthors,
		total: authorsTotal
	} = useTracker(() => {
		const skip = (authorsPage - 1) * PAGE_SIZE;
		const filter = {};

		const subHandle = authorsApi.subscribe('authors.list', filter, { skip: skip, limit: PAGE_SIZE }) ?? null;
		const isReady = !!subHandle && subHandle.ready();

		const authors = isReady ? authorsApi.find(filter, { sort: { name: 1 } }).fetch() : [];

		const totalAuthors = authorsApi.counts.findOne({ _id: 'authors.listTotal' })?.count ?? 0;

		return {
			authors,
			loading: !isReady,
			total: totalAuthors
		};
	}, [authorsPage]);

	const translateNacionality = useCallback((nationality = '') => {
		return nationality === 'nacional' ? 'Nacional' : nationality === 'international' ? 'Internacional' : ""
	}, []);

	useEffect(() => {
		if (!loadingAuthors) {
			setVisibleAuthors(authorsList);
		}
	}, [loadingAuthors, authorsList]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil((authorsTotal || 0) / PAGE_SIZE));
		if (authorsPage > totalPages && totalPages > 0) {
			setAuthorsPage(totalPages);
		}
	}, [authorsPage, authorsTotal]);

	const totalPages = Math.max(1, Math.ceil((authorsTotal || 0) / PAGE_SIZE));

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

	const onNextPage = useCallback(() => {
		if (authorsPage < totalPages) {
			setAuthorsPage(authorsPage + 1);
		}
	}, [authorsPage, totalPages]);

	const onPrevPage = useCallback(() => {
		if (authorsPage > 1) {
			setAuthorsPage(authorsPage - 1);
		}
	}, [authorsPage]);

	const providerValues: IAuthorsListContollerContext = useMemo(
		() => ({
			authors: visibleAuthors,
			loading: loadingAuthors && visibleAuthors.length === 0,
			authorsTotal,
			loadingAuthors,
			loadingAuthorsPage: loadingAuthors,
			authorsList: visibleAuthors,
			authorsPage,
			totalPages,
			onEditAuthor,
			onAddAuthor,
			onDeleteAuthor,
			onNextPage,
			onPrevPage,
			formatDate,
			translateNacionality
		}),
		[
			visibleAuthors,
			loadingAuthors,
			authorsTotal,
			totalPages,
			authorsPage,
			onEditAuthor,
			onAddAuthor,
			onDeleteAuthor,
			onNextPage,
			onPrevPage,
			formatDate,
			translateNacionality
		]
	);

	return (
		<AuthorsListControllerContext.Provider value={providerValues}>
			<AuthorsListView />
		</AuthorsListControllerContext.Provider>
	);
};

export default AuthorsListController;
