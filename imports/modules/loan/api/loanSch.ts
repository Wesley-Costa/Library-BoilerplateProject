import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface ILoan extends IDoc {
    bookId: string;
    userId: string;
    status: 'borrowed' | 'returned';
    borrowedVolumes: number;
    loanDate: Date;
    returnDate: Date;
    observation: string;
}

export const loanSch: ISchema<ILoan> = {
    bookId: {
        type: String,
        label: 'Livro',
        defaultValue: '',
        optional: false
    },
	borrowedVolumes: {
		type: Number,
		label: 'Quantidade de Volumes Emprestados',
		defaultValue: 1,
		optional: false
	},
    userId: {
        type: String,
        label: 'Usuário que Emprestou',
        defaultValue: '',
        optional: false
    },
    status: {
        type: String,
        label: 'Status',
        defaultValue: 'borrowed',
        optional: false,
        options: () => [
            { value: 'borrowed', label: 'Emprestado' },
            { value: 'returned', label: 'Devolvido' }
        ]
    },
    loanDate: {
        type: Date,
        label: 'Data do Empréstimo',
        defaultValue: '',
        optional: false
    },
    returnDate: {
        type: Date,
        label: 'Data da Devolução',
        defaultValue: '',
        optional: true
    },
    observation: {
        type: String,
        label: 'Observação',
        defaultValue: '',
        optional: true
    }
};