import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import Loan from './loan/config';
import Book from './book/config';
import Author from './author/config';
import UserProfile from './userprofile/config';

const pages: Array<IRoute | null> = [
	...Loan.pagesRouterList,
	...Book.pagesRouterList,
	...Author.pagesRouterList,
	...UserProfile.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...Loan.pagesMenuItemList,
	...Book.pagesMenuItemList,
	...Author.pagesMenuItemList,
	...UserProfile.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
