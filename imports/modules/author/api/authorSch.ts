import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export interface IAuthor extends IDoc {
    name: string;
    nationality: string;
    birthDate: Date;
    biography: string;
}

export const authorSch: ISchema<IAuthor> = {
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
        optional: true
    },
    birthDate: {
        type: Date,
        label: 'Data de Nascimento',
        defaultValue: '',
        optional: true
    },
    biography: {
        type: String,
        label: 'Biografia',
        defaultValue: '',
        optional: true
    },
};
