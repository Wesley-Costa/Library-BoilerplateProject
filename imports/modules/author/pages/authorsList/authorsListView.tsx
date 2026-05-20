import React, { useContext } from 'react';
import { AuthorsListControllerContext } from './authorsListController';
import AuthorListStyles from './authorsListStyles';
import { IAuthors } from '../../api/authorsSch';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { Box, Typography, Stack, Tooltip, IconButton, CircularProgress } from '@mui/material';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';

const AuthorsListView = () => {
	const controller = useContext(AuthorsListControllerContext);
	const { Container, Header, Body, Footer } = AuthorListStyles;

	const renderAuthorCard = (author: IAuthors) => (
		<Box
			key={author._id}
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
					{author.name}
				</Typography>
				<Stack>
					<Typography variant="body2" color="textSecondary">
						Nacionalidade: {author.nationality}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						Data de Nascimento: {controller.formatDate(author.birthDate)}
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
							controller.onEditAuthor(author);
						}}
					/>
				</Tooltip>

				<Tooltip title="Excluir">
					<SysButton
						variant="outlined"
						startIcon={<SysIcon name="delete" color="error" />}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							controller.onDeleteAuthor(author);
						}}
					/>
				</Tooltip>
			</Stack>
		</Box>
	);

	const renderPagination = () => {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<IconButton onClick={controller.onPrevPage} disabled={controller.authorsPage === 1}>
					<SysIcon name="chevronLeft" />
				</IconButton>

				<Typography variant="body2">
					Página {controller.authorsPage} de {controller.totalPages}
				</Typography>

				<IconButton onClick={controller.onNextPage} disabled={controller.authorsPage === controller.totalPages}>
					<SysIcon name="chevronRight" />
				</IconButton>
			</Box>
		);
	};

	return (
		<Container>
			<Header>
				<Typography variant="h5" fontWeight={600}>
					Autores
				</Typography>
				<SysFab
					variant="extended"
					startIcon={<SysIcon name="add" />}
					text="Registrar Autor"
					onClick={controller.onAddAuthor}
				/>
			</Header>

			<Body>
				{controller.loading && controller.authorsList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
						<CircularProgress size={24} />
						<Typography variant="body1">Carregando autores...</Typography>
					</Box>
				) : controller.authorsList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4}>
						<Typography variant="body1">Nenhum autor encontrado.</Typography>
					</Box>
				) : (
					controller.authorsList.map(renderAuthorCard)
				)}
			</Body>

			<Footer>
				{controller.totalPages > 1 && renderPagination()}
			</Footer>
		</Container>
	);
};

export default AuthorsListView;
