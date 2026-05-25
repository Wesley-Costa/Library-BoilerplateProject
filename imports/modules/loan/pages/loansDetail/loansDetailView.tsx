import React, { useContext } from 'react';
import { LoansDetailControllerContext } from './loansDetailController';
import ILoansDetailStyles from './loansDetailStyles';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import Typography from '@mui/material/Typography';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { Stack, Select } from '@mui/material';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import { LoansModuleContext } from '../../loansContainer';

const LoansDetailView = () => {
	const controller = useContext(LoansDetailControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = ILoansDetailStyles;

	const { state } = useContext(LoansModuleContext);
	const isExtension = state === 'extension';
	const isReturn = state === 'return';

	const titleHeader = isExtension ? 'Prorrogação de Empréstimo' : isReturn ? 'Devolução de Empréstimo': 'Editar Empréstimo';

	return (
		<Container>
			<Header>
				<Typography variant="h6">{titleHeader}</Typography>
			</Header>

			<SysForm
				mode="edit"
				schema={controller.schema}
				doc={controller.document}
				onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysTextField
							name="bookId"
							label="Livro"
							disabled= {isExtension || isReturn}
							InputLabelProps={{ shrink: true }}
						/>

						<SysTextField
							name="assignedUser"
							placeholder="Usuário que realizou o empréstimo"
							type="text"
							disabled= {isExtension || isReturn}
						/>

						<SysSelectField name="status" placeholder="Status do empréstimo" disabled= {isExtension}/>

						<Stack direction="row" width="100%" spacing={3}>
							<SysTextField
								name="loanDate"
								placeholder="Data de empréstimo"
								type="date"
								InputLabelProps={{ shrink: true }}
								disabled= {isExtension || isReturn}
							/>
							<SysTextField
								name="returnDate"
								placeholder="Data de devolução"
								type="date"
								InputLabelProps={{ shrink: true }}
								disabled= {isReturn}

							/>
							<SysTextField
								name="borrowedVolumes"
								placeholder="Volumes emprestados"
								type="number"
								disabled= {isExtension || isReturn}
							/>
						</Stack>

						<SysTextField
							name="observation"
							placeholder="Observação"
							type="text"
							multiline
							rows={4}
						/>
					</FormColumn>
				</Body>

				<Footer>
					<SysButton
						variant="contained"
						color="error"
						startIcon={<SysIcon name="delete" />}
						onClick={controller.onDelete}>
						Deletar
					</SysButton>
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

export default LoansDetailView;