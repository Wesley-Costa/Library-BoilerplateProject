import React, { useContext } from 'react';
import { LoansCreateControllerContext } from './loansCreateController';
import LoanListStyles from './loansCreateStyles';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import Typography from '@mui/material/Typography';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import { Stack } from '@mui/material';

const LoansCreateView = () => {
	const controller = useContext(LoansCreateControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = LoanListStyles;

	return (
		<Container>
			<Header>
				<Typography>Registrar Empréstimo</Typography>
			</Header>

			<SysForm mode="create" schema={controller.schema} doc={controller.document} onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysSelectField
							name="bookId"
							placeholder="Livro emprestado"
							options={controller.optionsBooks}
							loading={controller.loadingBooks}
						/>
						<SysTextField name="borrowedVolumes" placeholder="Número de volumes emprestados" type="number" />
						<SysTextField name="assignedUser" placeholder="Usuário que realizou o empréstimo" type="text" />
						<SysSelectField name="status" placeholder="Status do empréstimo" />
						<Stack direction="row" width="100%" spacing={2}>
							<SysTextField
								name="loanDate"
								placeholder="Data de empréstimo"
								type="date"
								InputLabelProps={{ shrink: true }}
							/>
							<SysTextField
								name="returnDate"
								placeholder="Data de devolução"
								type="date"
								InputLabelProps={{ shrink: true }}
							/>
						</Stack>
						<SysTextField name="observation" placeholder="Descrição do livro" type="text" multiline />
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

export default LoansCreateView;
