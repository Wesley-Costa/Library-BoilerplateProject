import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import UserProfile from './userprofile/config';
import Author from './author/config';
import Book from './book/config';
import Loan from './loan/config';

const pages: Array<IRoute | null> = [
	...Author.pagesRouterList,
	...Book.pagesRouterList,
	...Loan.pagesRouterList,
	...UserProfile.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...Author.pagesMenuItemList,
	...Book.pagesMenuItemList,
	...Loan.pagesMenuItemList,
	...UserProfile.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
