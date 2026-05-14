import React, { useContext } from 'react';
import { AuthorsDetailControllerContext } from './authorsDetailContoller';
import AuthorsDetailStyles from './authorsDetailStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import { Typography } from '@mui/material';


const AuthorsDetailView = () => {
	const controller = useContext(AuthorsDetailControllerContext);
	const { Container, Header, Body, FormColumn, Footer } = AuthorsDetailStyles;

	return (
		<Container>
			<Header>
				<Typography>Edição do Autor</Typography>
			</Header>

			<SysForm
				mode="edit"
				schema={controller.schema}
				doc={controller.document}
				onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysTextField name="name" placeholder="Nome do autor" />
						<SysTextField name="nationality" placeholder="Nacionalidade do autor" />
						<SysTextField name="biography" placeholder="Biografia do autor" multiline rows={4} />
						<SysTextField name="birthDate" placeholder="Data de nascimento do autor" type="date" InputLabelProps={{ shrink: true }} />
					</FormColumn>
				</Body>

				<Footer>
					<SysButton variant="contained" color="error" startIcon={<SysIcon name="delete" />} onClick={controller.onDelete}>
						Deletar
					</SysButton>
					<SysButton variant="outlined" startIcon={<SysIcon name="close" />} onClick={controller.closePage}>
						Cancelar
					</SysButton>
					<SysFormButton>Salvar</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};

export default AuthorsDetailView;
