// region Imports
import { Recurso } from '../config/recursos';
import { authorsSch, IAuthors } from './authorsSch';
import { ProductServerBase } from '../../../api/productServerBase';
import { IContext } from '/imports/typings/IContext';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// endregion

const PROJECTION_AUTHOR = {
	name: 1,
	nationality: 1,
	birthDate: 1,
	biography: 1,
	createdBy: 1,
	createdAt: 1,
	updatedAt: 1
}
class AuthorsServerApi extends ProductServerBase<IAuthors> {
	constructor() {
		super('authors', authorsSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('authors.list', function (this: any, filter = {}, options = {}) {
			const defOptions = {
				sort: { name: 1 },
				projection: PROJECTION_AUTHOR
			};

			const finalOptions = { ...defOptions, ...options };

			return self.defaultListCollectionPublication(filter, finalOptions);
		});

		this.addPublication('authors.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_AUTHOR
			});
		});
	}

	async beforeInsert(_doc: IAuthors, _context: IContext) {
		if(!(_context.user?._id) || !(Meteor.userId())){
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		check(_doc.birthDate, Date)
		check(_doc.name, String)
		check(_doc.nationality, String)
		check(_doc.biography, String)

		const minDate = new Date('1700-01-01');
		const now = new Date();

		if (_doc.birthDate > now || _doc.birthDate < minDate) {
			throw new Meteor.Error('invalid-date', 'Insira uma data de nascimento válida');
		}

		_doc.createdAt = now;
		_doc.createdBy = _context.user?._id;
		_doc.updatedAt = now;
		
		return super.beforeInsert(_doc, _context);
	}

	async beforeUpdate(_doc: Partial<IAuthors>, _context: IContext) {
		check(_doc.birthDate, Date)
		check(_doc._id, String)
		check(_doc.name, String)
		check(_doc.nationality, String)
		check(_doc.biography, String)

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador de tarefa inválido.');
		}

		if(!(_context.user?._id) || !(Meteor.userId())){
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const minDate = new Date('1700-01-01');
		const now = new Date();

		if (_doc.birthDate > now || _doc.birthDate < minDate) {
			throw new Meteor.Error('invalid-date', 'Insira uma data de nascimento válida');
		}

		_doc.updatedAt = now;
		
		return super.beforeUpdate(_doc, _context);
	}

	async beforeRemove(_doc: IAuthors, _context: IContext) {
		if(!(_context.user?._id) || !(Meteor.userId())){
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const isAdmin = _context.user?.roles?.includes('Administrador') ?? false;
		if (!isAdmin) {
			throw new Meteor.Error('forbidden', 'Apenas administradores podem excluir autores.');
		}

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador de autor inválido.');
		}

		const existingDoc = await this.getCollectionInstance().findOneAsync({ _id: _doc._id });
		if (!existingDoc) {
			throw new Meteor.Error('not-found', 'Registro do autor não encontrado.');
		}

		
		return super.beforeRemove(_doc, _context);
	}
}

export const authorsServerApi = new AuthorsServerApi();
