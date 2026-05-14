import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface ILoans extends IDoc {
    bookId: string;
    borrowedVolumes: number;
    userId: string;
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
        optional: true
    },
	borrowedVolumes: {
		type: Number,
		label: 'Quantidade de Volumes Emprestados',
		defaultValue: 1,
		optional: true,
        min: 1
	},
    userId: {
        type: String,
        label: 'Usuário que Emprestou',
        defaultValue: '',
        optional: true
    },
    status: {
        type: String,
        label: 'Status',
        defaultValue: 'borrowed',
        optional: true,
        options: () => [
            { value: 'borrowed', label: 'Emprestado' },
            { value: 'returned', label: 'Devolvido' }
        ]
    },
    loanDate: {
        type: Date,
        label: 'Data do Empréstimo',
        defaultValue: '',
        optional: true
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