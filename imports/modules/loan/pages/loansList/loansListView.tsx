import React, { useContext } from 'react';
import { LoansListControllerContext } from './loansListController';
import { ILoans } from '../../api/loansSch';
import LoanListStyles from './loansListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { Box, Typography, Stack, Tooltip, IconButton, CircularProgress } from '@mui/material';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';

const LoanListView = () => {
	const controller = useContext(LoansListControllerContext);
	const { Container, Header, Body, Footer } = LoanListStyles;

	const renderLoanCard = (loan: ILoans) => (
		<Box
			key={loan._id}
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				padding: 2,
				borderRadius: 3,
				marginBottom: 2,
				backgroundColor: '#ffffff',
				boxShadow: 1
			}}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography variant="h6" fontWeight={600}>
					Data de Registro: {controller.formatDate(loan.loanDate)}
				</Typography>
				<Stack>
					<Typography variant="body2" color="textSecondary">
						Quantidade de livros: {loan.borrowedVolumes}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						Data de Devolução: {controller.formatDate(loan.returnDate)}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						Livro: {controller.getBookTitle(loan)}
					</Typography>
				</Stack>
			</Box>

			<Stack direction="row" spacing={1}>
				<Tooltip title="Editar">
					<SysButton
						variant="contained"
						startIcon={<SysIcon name="edit" />}
						color="primary"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							controller.onEditLoan(loan);
						}}
					/>
				</Tooltip>

				<Tooltip title="Excluir">
					<SysButton
						variant="outlined"
						startIcon={<SysIcon name="delete" color="error" />}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							controller.onDeleteLoan(loan);
						}}
					/>
				</Tooltip>
			</Stack>
		</Box>
	);

	const renderPagination = () => {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<IconButton onClick={controller.onPrevPage} disabled={controller.loansPage === 1}>
					<SysIcon name="chevronLeft" />
				</IconButton>

				<Typography variant="body2">
					Página {controller.loansPage} de {controller.totalPages}
				</Typography>

				<IconButton onClick={controller.onNextPage} disabled={controller.loansPage === controller.totalPages}>
					<SysIcon name="chevronRight" />
				</IconButton>
			</Box>
		);
	};

	return (
		<Container>
			<Header>
				<Typography variant="h5" fontWeight={600}>
					Empréstimos
				</Typography>
				<SysFab
					variant="extended"
					startIcon={<SysIcon name="add" />}
					text="Registrar Empréstimo"
					onClick={controller.onAddLoan}
				/>
			</Header>

			<Body>
				{controller.loading && controller.loansList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
						<CircularProgress size={24} />
						<Typography variant="body1">Carregando empréstimos...</Typography>
					</Box>
				) : controller.loansList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4}>
						<Typography variant="body1">Nenhum empréstimo encontrado.</Typography>
					</Box>
				) : (
					controller.loansList.map(renderLoanCard)
				)}
			</Body>
			<Footer>
				{controller.totalPages > 1 && renderPagination()}
			</Footer>
		</Container>
	);
};

export default LoanListView;
