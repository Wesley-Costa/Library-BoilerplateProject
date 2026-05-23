import React, { useContext } from 'react';
import { BooksListControllerContext } from './booksListController';
import BookListStyles from './booksListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { IBooks } from '../../api/booksSch';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { Box, Typography, Stack, Tooltip, IconButton, CircularProgress } from '@mui/material';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';

const BooksListView = () => {
	const controller = useContext(BooksListControllerContext);
	const { Container, Header, Body, Footer } = BookListStyles;
	const styleButton = {
		minWidth: 0,
		p: '8px',
		'& .MuiButton-startIcon': {
			margin: 0
		}
	};

	const renderBookCard = (book: IBooks) => (
		<Box
			key={book._id}
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
					{book.title}
				</Typography>
				<Stack direction="column">
					<Typography variant="body2" color="textSecondary">
						Categoria: {book.category}
					</Typography>
					<Typography variant="body2" color="textSecondary">
						Volumes: {book.volumes}
					</Typography>
				</Stack>
			</Box>

			<Stack direction="row" spacing={1}>
				<SysButton
					variant="contained"
					startIcon={<SysIcon name="edit" />}
					color="primary"
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						controller.onEditBook(book);
					}}
					title="Editar"
					sx={styleButton}
				/>

				<SysButton
					variant="contained"
					startIcon={<SysIcon name="delete" />}
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						controller.onDeleteBook(book);
					}}
					title="Excluir"
					sx={styleButton}
				/>
			</Stack>
		</Box>
	);

	const renderPagination = () => {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<IconButton onClick={controller.onPrevPage} disabled={controller.booksPage === 1}>
					<SysIcon name="chevronLeft" />
				</IconButton>

				<Typography variant="body2">
					Página {controller.booksPage} de {controller.totalPages}
				</Typography>

				<IconButton onClick={controller.onNextPage} disabled={controller.booksPage === controller.totalPages}>
					<SysIcon name="chevronRight" />
				</IconButton>
			</Box>
		);
	};

	return (
		<Container>
			<Header>
				<Typography variant="h5" fontWeight={600}>
					Livros
				</Typography>
				<SysFab
					variant="extended"
					startIcon={<SysIcon name="add" />}
					text="Registrar Livro"
					onClick={controller.onAddBook}
				/>
			</Header>

			<Body>
				{controller.loading && controller.booksList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
						<CircularProgress size={24} />
						<Typography variant="body1">Carregando livros...</Typography>
					</Box>
				) : controller.booksList.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4}>
						<Typography variant="body1">Nenhum livro encontrado.</Typography>
					</Box>
				) : (
					controller.booksList.map(renderBookCard)
				)}
			</Body>
			<Footer>{controller.totalPages > 1 && renderPagination()}</Footer>
		</Container>
	);
};

export default BooksListView;
