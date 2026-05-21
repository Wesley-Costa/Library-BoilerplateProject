import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface ILoans extends IDoc {
    bookId: string;
    borrowedVolumes: number;
    assignedUser: string;
    status: 'borrowed' | 'returned';
    loanDate: Date;
    returnDate: Date;
    observation: string;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const loansSch: ISchema<ILoans> = {
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
		optional: false,
        min: 1
	},
    assignedUser: {
        type: String,
        label: 'Usuário que realizou o empréstimo',
        defaultValue: '',
        optional: false
    },
    status: {
        type: String,
        label: 'Status',
        defaultValue: '',
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
        optional: false
    },
    observation: {
        type: String,
        label: 'Observação',
        defaultValue: '',
        optional: false
    },
    createdBy: {
        type: String,
        label: 'Criado por',
        defaultValue: '',
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Data de Criação',
        defaultValue: '',
        optional: true
    },
    updatedAt: {
        type: Date,
        label: 'Data de Atualização',
        defaultValue: '',
        optional: true
    }
};