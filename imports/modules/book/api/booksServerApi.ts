// region Imports
import { Recurso } from '../config/recursos';
import { booksSch, IBooks } from './booksSch';
import { ProductServerBase } from '../../../api/productServerBase';
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check';
import { IContext } from '../../../typings/IContext';

// endregion

const PROJECTION_BOOK = {
	title: 1,
	description: 1,
	authorId: 1,
	isbn: 1,
	publisher: 1,
	yearPublication: 1,
	category: 1,
	volumes: 1
}

class BooksServerApi extends ProductServerBase<IBooks> {
	constructor() {
		super('books', booksSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('books.list', function (this: any, filter = {}, options = {}) {

			const defOptions = {
				projection: PROJECTION_BOOK
			};

			const finalOptions = { ...defOptions, ...options };

			return self.defaultListCollectionPublication(filter, finalOptions);
		});

		this.addPublication('books.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_BOOK
			});
		});
	}

	async beforeInsert(_doc: IBooks, _context: IContext) {
		if (!(_context.user?._id)) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		check(_doc.title, String);
		check(_doc.description, String);
		check(_doc.authorId, String);
		check(_doc.isbn, String);
		check(_doc.publisher, String);
		check(_doc.category, String);
		check(_doc.yearPublication, Number);
		check(_doc.volumes, Number);

		const now = new Date();
		const currentYear = now.getFullYear();

		if (_doc.yearPublication! > currentYear || _doc.yearPublication! < 1700) {
			throw new Meteor.Error('invalid-year', 'O ano de publicação deve estar entre 1700 e o ano atual.');
		}

		if (_doc.volumes! < 1) {
			throw new Meteor.Error('invalid-volumes', 'O livro deve ter pelo menos 1 volume.');
		}

		_doc.createdAt = now;
		_doc.createdBy = _context.user?._id;
		_doc.updatedAt = now;

		return super.beforeInsert(_doc, _context);
	}

	async beforeUpdate(_doc: Partial<IBooks>, _context: IContext) {
		if (!(_context.user?._id)) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador do livro inválido.');
		}

		check(_doc.title, String);
		check(_doc.description, String);
		check(_doc.authorId, String);
		check(_doc.isbn, String);
		check(_doc.publisher, String);
		check(_doc.category, String);
		check(_doc.yearPublication, Number);
		check(_doc.volumes, Number);

		const now = new Date();
		const currentYear = now.getFullYear();

		if (_doc.yearPublication! > currentYear || _doc.yearPublication! < 1700) {
			throw new Meteor.Error('invalid-year', 'O ano de publicação deve estar entre 1700 e o ano atual.');
		}

		if (_doc.volumes! < 1) {
			throw new Meteor.Error('invalid-volumes', 'O livro deve ter pelo menos 1 volume.');
		}

		_doc.updatedAt = now;

		return super.beforeUpdate(_doc, _context);
	}

	async beforeRemove(_doc: IBooks, _context: IContext) {
		if (!(_context.user?._id)) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const isAdmin = _context.user?.roles?.includes('Administrador') ?? false;
		if (!isAdmin) {
			throw new Meteor.Error('forbidden', 'Apenas administradores podem excluir livros.');
		}

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador do livro inválido.');
		}

		const existingDoc = await this.getCollectionInstance().findOneAsync({ _id: _doc._id });
		if (!existingDoc) {
			throw new Meteor.Error('not-found', 'Livro não encontrado.');
		}

		return super.beforeRemove(_doc, _context);
	}
}

export const booksServerApi = new BooksServerApi();