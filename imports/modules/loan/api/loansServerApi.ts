// region Imports
import { Recurso } from '../config/recursos';
import { loansSch, ILoans } from './loansSch';
import { ProductServerBase } from '../../../api/productServerBase';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { IContext } from '../../../typings/IContext';

// endregion

const PROJECTION_LOAN = {
	bookId: 1,
	borrowedVolumes: 1,
	assignedUser: 1,
	status: 1,
	loanDate: 1,
	returnDate: 1,
	observation: 1,
	createdBy: 1,
	createdAt: 1,
	updatedAt: 1
};

class LoanServerApi extends ProductServerBase<ILoans> {
	constructor() {
		super('loans', loansSch, {
			resources: Recurso
		});

		const self = this;

		this.addPublication('loans.list', function (this: any, filter = {}, options = {}) {
			const defOptions = {
				sort: { returnDate: -1 },
				projection: PROJECTION_LOAN
			};

			const finalOptions = { ...defOptions, ...options };

			return self.defaultListCollectionPublication(filter, finalOptions);
		});

		this.addPublication('loans.detail', function (this: any, filter = {}) {
			return self.defaultDetailCollectionPublication(filter, {
				projection: PROJECTION_LOAN
			});
		});
	}

	async beforeInsert(_doc: ILoans, _context: IContext) {
		if (!_context.user?._id) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		check(_doc.bookId, String);
		check(_doc.assignedUser, String);
		check(_doc.status, String);
		check(_doc.loanDate, Date);
		check(_doc.returnDate, Date);
		check(_doc.borrowedVolumes, Number);
		if (_doc.observation !== undefined) check(_doc.observation, String);

		const now = new Date();
		const maxDate = new Date();
		maxDate.setDate(now.getDate() + 15);

		if (_doc.loanDate!.toDateString() !== now.toDateString()) {
			throw new Meteor.Error('invalid-date', 'A data do empréstimo deve ser a data atual.');
		}

		if (_doc.returnDate! < now || _doc.returnDate! > maxDate) {
			throw new Meteor.Error(
				'invalid-date',
				'A data de devolução deve ser entre hoje e no máximo 15 dias após a data atual.'
			);
		}

		if (_doc.returnDate! < now || _doc.loanDate! > maxDate) {
			throw new Meteor.Error('invalid-date', 'A data do empréstimo deve ser a data atual.');
		}

		if (_doc.borrowedVolumes! < 1 || _doc.borrowedVolumes! > 3) {
			throw new Meteor.Error(
				'invalid-volumes',
				'O volume minimo de emprestimo é de 1 unidade do livro, e no máximo 3 unidades do livro.'
			);
		}

		_doc.createdAt = now;
		_doc.createdBy = _context.user?._id;
		_doc.updatedAt = now;

		return super.beforeInsert(_doc, _context);
	}

	async beforeUpdate(_doc: Partial<ILoans>, _context: IContext) {
		if (!_context.user?._id) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador do livro inválido.');
		}

		check(_doc.bookId, String);
		check(_doc.assignedUser, String);
		check(_doc.status, String);
		check(_doc.loanDate, Date);
		check(_doc.returnDate, Date);
		check(_doc.borrowedVolumes, Number);
		if (_doc.observation !== undefined) check(_doc.observation, String);

		const now = new Date();
		const maxDate = new Date();
		maxDate.setDate(now.getDate() + 15);

		if (_doc.loanDate!.toDateString() !== now.toDateString()) {
			throw new Meteor.Error('invalid-date', 'A data do empréstimo deve ser a data atual.');
		}

		if (_doc.returnDate! < now || _doc.returnDate! > maxDate) {
			throw new Meteor.Error(
				'invalid-date',
				'A data de devolução deve ser entre hoje e no máximo 15 dias após a data atual.'
			);
		}

		if (_doc.borrowedVolumes! < 1 || _doc.borrowedVolumes! > 3) {
			throw new Meteor.Error(
				'invalid-volumes',
				'O volume minimo de emprestimo é de 1 unidade do livro, e no máximo 3 unidades do livro.'
			);
		}

		_doc.updatedAt = now;

		return super.beforeUpdate(_doc, _context);
	}

	async beforeRemove(_doc: ILoans, _context: IContext) {
		if (!_context.user?._id) {
			throw new Meteor.Error('forbidden', 'Você precisa estar autenticado para realizar esta ação.');
		}

		const isAdmin = _context.user?.roles?.includes('Administrador') ?? false;
		if (!isAdmin) {
			throw new Meteor.Error('forbidden', 'Apenas administradores podem excluir empréstimos.');
		}

		if (!_doc._id) {
			throw new Meteor.Error('invalid-id', 'Identificador do empréstimo inválido.');
		}

		const existingDoc = await this.getCollectionInstance().findOneAsync({ _id: _doc._id });
		if (!existingDoc) {
			throw new Meteor.Error('not-found', 'Regristro de empréstimo não encontrado.');
		}

		return super.beforeRemove(_doc, _context);
	}
}

export const loanServerApi = new LoanServerApi();
