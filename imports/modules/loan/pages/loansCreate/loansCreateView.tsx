import React, { useContext } from 'react';
import { LoansCreateControllerContext } from './loansCreateController';
import LoanListStyles from './loansCreateStyles';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysButton } from '../../../../ui/components/SimpleFormFields/SysButton/SysButton';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';
import { Stack, Typography } from '@mui/material';

const LoansCreateView = () => {
	const controller = useContext(LoansCreateControllerContext);
	const { Container, Body, Header, Footer, FormColumn } = LoanListStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h6">Registrar Empréstimo</Typography>
			</Header>

			<SysForm mode="create" schema={controller.schema} doc={controller.document} onSubmit={controller.onSubmit}>
				<Body>
					<FormColumn>
						<SysSelectField
							name="bookId"
							options={controller.optionsBooks}
							loading={controller.loadingBooks}
							placeholder="Selecione um livro"
							onChange={(e: any) => {
								const value = e?.target?.value !== undefined ? e.target.value : e;
								controller.setSelectedBook(value);
							}}
						/>

						<SysTextField name="assignedUser" placeholder="Nome completo" type="text" />

						<SysSelectField name="status" placeholder="Status do empréstimo" />

						<Stack direction="row" width="100%" spacing={3}>
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
							<SysTextField
								name="borrowedVolumes"
								placeholder="Volumes emprestados"
								type="number"
								disabled={!!controller.selectedBook && controller.availableVolumes === 0}
								max={controller.availableVolumes ?? undefined}
								helperText={
									controller.selectedBook && controller.availableVolumes !== null
										? `Máximo: ${controller.availableVolumes} volume(s)`
										: ''
								}
							/>
						</Stack>

						<SysTextField name="observation" placeholder="Observação" type="text" multiline rows={4} />
					</FormColumn>
				</Body>

				<Footer>
					<SysButton variant="outlined" startIcon={<SysIcon name="close" />} onClick={controller.closePage}>
						Cancelar
					</SysButton>
					<SysFormButton disabled={!!controller.selectedBook && controller.availableVolumes === 0}>
						Salvar
					</SysFormButton>
				</Footer>
			</SysForm>
		</Container>
	);
};

export default LoansCreateView;