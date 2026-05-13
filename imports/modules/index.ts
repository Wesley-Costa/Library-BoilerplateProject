import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
// import Loan from './loan/config';
// import Book from './book/config';
import Author from './author/config';
import UserProfile from './userprofile/config';

const pages: Array<IRoute | null> = [
	...Author.pagesRouterList,
	...UserProfile.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...Author.pagesMenuItemList,
	...UserProfile.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
