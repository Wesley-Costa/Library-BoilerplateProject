import React from 'react';
import Typography from '@mui/material/Typography';
import HomeStyles from './homeStyle';

const Home: React.FC = () => {
	const { Container, Header } = HomeStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h3">Biblioteca Synergia</Typography>
				<Typography variant="body1" textAlign={'justify'}>
					Sistema de biblioteca desenvolvido para exemplificar a estrutura de um projeto moderno utilizando React,
					TypeScript, MongoDB e Meteor. Este projeto serve como um ponto de partida para desenvolvedores que desejam
					criar aplicações web escaláveis e de alta performance, seguindo as melhores práticas do mercado.
				</Typography>
			</Header>
		</Container>
	);
};

export default Home;
