import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface IBook extends IDoc {
    title: string;
	description: string;
    authorId: string;
    isbn: string;
    publisher: string;
    yearPublication: number;
    category: string;
    volumes: number;
}

export const bookSch: ISchema<IBook> = {
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
        optional: true,
        mask: '###-##-####-###-#'
    },
    publisher: {
        type: String,
        label: 'Editora',
        defaultValue: '',
        optional: true
    },
    yearPublication: {
        type: Number,
        label: 'Ano de Publicação',
        defaultValue: '',
        optional: true
    },
    category: {
        type: String,
        label: 'Categoria',
        defaultValue: '',
        optional: true,
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
        min: 1
    },
};
