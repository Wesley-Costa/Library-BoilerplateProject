import React, { useContext } from 'react';
import { AuthorsCreateControllerContext } from './authorsCreateContoller';
import AuthorsCreateStyles from './authorsCreateStyles';
import { Typography, Box } from '@mui/material';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';

const AuthorsCreateView = () => {
	const controller = useContext(AuthorsCreateControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = AuthorsCreateStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h5" fontWeight={600}>
					Adicionar Autor
				</Typography>
			</Header>

			<SysForm mode="create" schema={controller.schema} doc={controller.document} onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysTextField name="name" placeholder="Nome do autor" />
						<SysTextField name="nationality" placeholder="Nacionalidade do autor" />
						<SysTextField name="biography" placeholder="Biografia do autor" multiline rows={4} />
						<SysTextField
							name="birthDate"
							placeholder="Data de nascimento do autor"
							type="date"
							InputLabelProps={{ shrink: true }}
						/>
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

export default AuthorsCreateView;
