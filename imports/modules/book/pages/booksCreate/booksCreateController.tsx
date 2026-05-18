import React, { createContext, useCallback, useContext } from 'react';
import BooksCreateView from './booksCreateView';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { booksApi } from '../../api/booksApi';
import { IBooks } from '../../api/booksSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface IBooksCreateControllerContext {
	closePage: () => void;
	document: IBooks;
	schema: ISchema<IBooks>;
	onSubmit: (doc: IBooks) => void;
}

export const BooksCreateControllerContext = createContext<IBooksCreateControllerContext>({} as IBooksCreateControllerContext);

const BooksCreateController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const closePage = useCallback(() => {
		navigate('/books/view');
	}, []);

	const onSubmit = useCallback(
		(doc: IBooks) => {
			const user = Meteor.userId();
			const createdAt = new Date();
			const updatedAt = new Date();

			const enrichedDoc: IBooks = {
				...doc,
				createdBy: user,
				createdAt: createdAt,
				updatedAt: updatedAt
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
				onSubmit
			}}>
			{<BooksCreateView />}
		</BooksCreateControllerContext.Provider>
	);
};

export default BooksCreateController;
