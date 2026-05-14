import { booksRouterList } from './bookRouters';
import { booksMenuItemList } from './bookAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Book: IModuleHub = {
	pagesRouterList: booksRouterList,
	pagesMenuItemList: booksMenuItemList
};

export default Book;
