import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface IBooks extends IDoc {
    title: string;
    description: string;
    authorId: string;
    isbn: string;
    publisher: string;
    yearPublication: number;
    category: string;
    volumes: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export const booksSch: ISchema<IBooks> = {
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: false
    },
    authorId: {
        type: String,
        label: 'Autor',
        defaultValue: '',
        optional: false
    },
    isbn: {
        type: String,
        label: 'ISBN',
        defaultValue: '',
        optional: false,
        mask: '###-##-####-###-#'
    },
    publisher: {
        type: String,
        label: 'Editora',
        defaultValue: '',
        optional: false
    },
    yearPublication: {
        type: Number,
        label: 'Ano de Publicação',
        defaultValue: new Date().getFullYear(),
        optional: false,
        min: 1700,
        max: new Date().getFullYear()
    },
    category: {
        type: String,
        label: 'Categoria',
        defaultValue: '',
        optional: false,
        options: () => [
            { value: 'ficcao', label: 'Ficção' },
            { value: 'nao-ficcao', label: 'Não Ficção' },
            { value: 'tecnico', label: 'Técnico' },
            { value: 'didatico', label: 'Didático' },
            { value: 'infantil', label: 'Infantil' },
            { value: 'biografia', label: 'Biografia' },
            { value: 'outro', label: 'Outro' }
        ]
    },
    volumes: {
        type: Number,
        label: 'Quantidade de Volumes',
        defaultValue: 1,
        optional: false,
        min: 0
    },
    createdBy: {
        type: String,
        label: 'Criado por',
        defaultValue: null,
        optional: true
    },
    createdAt: {
        type: Date,
        label: 'Data de Criação',
        defaultValue: new Date(),
        optional: true
    },
    updatedAt: {
        type: Date,
        label: 'Data de Atualização',
        defaultValue: new Date(),
        optional: true
    }
};