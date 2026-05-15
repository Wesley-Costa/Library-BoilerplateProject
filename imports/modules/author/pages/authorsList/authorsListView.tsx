import React, { useContext } from 'react';
import { AuthorsListControllerContext } from './authorsListController';
import AuthorListStyles from './authorsListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { IAuthors } from '../../api/authorsSch';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { Box, Typography, Stack, Tooltip } from '@mui/material';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';

const AuthorsListView = () => {
	const controller = useContext(AuthorsListControllerContext);
	const { Container, Header } = AuthorListStyles;

	const renderAuthorsList = (author: IAuthors) => {
		return (
			<Box
				key={author._id}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					padding: 2,
					borderRadius: 2,
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

			<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
				{controller.authorsList.map(renderAuthorsList)}
			</Box>
		</Container>
	);
};

export default AuthorsListView;
