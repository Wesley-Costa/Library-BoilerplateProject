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
import { Stack } from '@mui/material';

const BooksCreateView = () => {
	const controller = useContext(BooksCreateControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = BooksCreateStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h6">Adicionar Livro</Typography>
			</Header>

			<SysForm mode="create" schema={controller.schema} doc={controller.document} onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysTextField name="title" placeholder="Título do livro" />

						<SysSelectField
							name="authorId"
							label="Autor"
							placeholder="Selecione o autor"
							options={controller.optionsAuthors}
							loading={controller.loadingAuthors}
							onChange={(e: any) => {
								const value =
									e?.target?.value !== undefined
										? e.target.value
										: e;
								controller.setAuthorSelected(value);
							}}
						/>

						<SysTextField name="description" placeholder="Descrição do livro" multiline rows={4} />
						<Stack direction="row" width="100%" spacing={2}>
							<SysTextField name="isbn" placeholder="ISBN do livro" type="text" />
							<SysTextField name="publisher" placeholder="Editora do livro" />
						</Stack>

						<Stack direction="row" width="100%" spacing={3}>
							<SysTextField name="yearPublication" placeholder="Ano de publicação" type="number" />
							<SysSelectField name="category" placeholder="Categoria do livro" />
							<SysTextField name="volumes" placeholder="Número de volumes" type="number" />
						</Stack>
					</FormColumn>
				</Body>

				<Footer>
					<SysButton variant="outlined" startIcon={<SysIcon name="close" />} onClick={controller.closePage}>
						Cancelar
					</SysButton>
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};

export default BooksCreateView;
