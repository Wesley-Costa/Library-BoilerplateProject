import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface IAuthors extends IDoc {
    name: string;
    nationality: string;
    birthDate: Date;
    biography: string;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const authorsSch: ISchema<IAuthors> = {
    name: {
        type: String,
        label: 'Nome',
        defaultValue: '',
        optional: false
    },
    nationality: {
        type: String,
        label: 'Nacionalidade',
        defaultValue: '',
        optional: false
    },
    birthDate: {
        type: Date,
        label: 'Data de Nascimento',
        defaultValue: '',
        optional: false
    },
    biography: {
        type: String,
        label: 'Biografia',
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
