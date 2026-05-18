import React, { useContext } from 'react';
import { BooksCreateControllerContext } from './booksCreateController';
import BooksCreateStyles from './booksCreateStyles';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { Typography } from '@mui/material';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';

const BooksCreateView = () => {
	const controller = useContext(BooksCreateControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = BooksCreateStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h6">Adicionar Livro</Typography>
			</Header>

			<SysForm
				mode="create"
				schema={controller.schema}
				doc={controller.document}
				onSubmit={controller.onSubmit}>

				<Body>
					<FormColumn>
						<SysTextField name="title" placeholder="Título do livro" />
						<SysTextField name="description" placeholder="Descrição do livro" />
						<SysSelectField name="authorId" placeholder="Autor" />
						<SysTextField name="isbn" placeholder="ISBN do livro" type="text" />
						<SysTextField name="publisher" placeholder="Editora do livro" />
						<SysTextField name="yearPublication" placeholder="Ano de publicação" type="number" />
						<SysTextField name="category" placeholder="Categoria do livro" />
						<SysTextField name="volumes" placeholder="Número de volumes" type="number" />
					</FormColumn>
				</Body>

				<Footer>
					<SysButton
						variant="outlined"
						startIcon={<SysIcon name="close" />}
						onClick={controller.closePage}>
						Cancelar
					</SysButton>
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};

export default BooksCreateView;