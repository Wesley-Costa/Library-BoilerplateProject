import React, { useContext } from 'react';
import { BooksListControllerContext } from './booksListController';
import BookListStyles from './booksListStyles';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { IBooks } from '../../api/booksSch';
import { SysFab } from '../../../../ui/components/sysFab/sysFab';
import { Box, Typography, Stack, Tooltip } from '@mui/material';
import { SysButton } from '/imports/ui/components/SimpleFormFields/SysButton/SysButton';


const BooksListView = () => {
	const controller = useContext(BooksListControllerContext);
	const { Container, Header, Body, Footer } = BookListStyles;

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
				borderRadius: 2,
				backgroundColor: '#ffffff',
				boxShadow: 1
			}}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography variant="h6" fontWeight={600}>
					{book.title}
				</Typography>
				<Stack>
					<Typography variant="body2" color="textSecondary">
						Categoria: {book.category}
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
							controller.onEditBook(book);
						}}
					/>
				</Tooltip>

				<Tooltip title="Excluir">
					<SysButton
						variant="outlined"
						startIcon={<SysIcon name="delete" color="error" />}
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							controller.onDeleteBook(book);
						}}
					/>
				</Tooltip>
			</Stack>
		</Box>
	);

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
				{controller.booksList.map(renderBookCard)}
			</Body>

			<Footer />
		</Container>
	);
};

export default BooksListView;
