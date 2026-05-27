import React, { createContext, useCallback, useContext } from 'react';
import BooksCreateView from './booksCreateView';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { booksApi } from '../../api/booksApi';
import { IBooks } from '../../api/booksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { useTracker } from 'meteor/react-meteor-data';
import { authorsApi } from '../../../author/api/authorsApi';

interface IBooksCreateControllerContext {
	closePage: () => void;
	document: IBooks;
	schema: ISchema<IBooks>;
	onSubmit: (doc: IBooks) => void;
	optionsAuthors: { value: string; label: string }[];
	loadingAuthors: boolean;
	setAuthorSelected: (id: string) => void;
}

export const BooksCreateControllerContext = createContext<IBooksCreateControllerContext>(
	{} as IBooksCreateControllerContext
);

const BooksCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
	const [auhtorSelected, setAuthorSelected] = React.useState<string>('');

	const { optionsAuthors, loadingAuthors } = useTracker(() => {
		const subHandle = authorsApi.subscribe('authors.list') ?? null;
		const isReady = !!subHandle && subHandle.ready();

		const authors = isReady ? authorsApi.find({}, { sort: { name: 1 } }).fetch() : [];

		const optionsAuthors = authors.map((author) => ({
			value: author._id,
			label: author.name
		}));

		return { optionsAuthors, loadingAuthors: !isReady };
	}, []);

	const closePage = useCallback(() => {
		navigate('/books/view');
	}, [navigate]);

	const onSubmit = useCallback(
		(doc: IBooks) => {
			const user = Meteor.userId();
			const now = new Date();

			const enrichedDoc: IBooks = {
				...doc,
				createdBy: user,
				createdAt: now,
				updatedAt: now,
				yearPublication: Number(doc.yearPublication),
				volumes: Number(doc.volumes)
			};

			booksApi.insert(enrichedDoc, (e: IMeteorError) => {
				if (!e) {
					closePage();
					showNotification({
						type: 'success',
						title: 'Livro criado!',
						message: 'O livro foi cadastrado com sucesso!',
						showCloseButton: true
					});
				} else {
					showNotification({
						type: 'error',
						title: 'Erro ao criar livro!',
						message: `Erro ao realizar a operação: ${e.reason}`,
						showCloseButton: true
					});
				}
			});
		},
		[closePage, showNotification]
	);

	return (
		<BooksCreateControllerContext.Provider
			value={{
				closePage,
				document: {} as IBooks,
				schema: booksApi.getSchema(),
				onSubmit,
				optionsAuthors,
				loadingAuthors,
				setAuthorSelected
			}}>
			<BooksCreateView />
		</BooksCreateControllerContext.Provider>
	);
};

export default BooksCreateController;
