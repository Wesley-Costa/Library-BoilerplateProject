import { bookRouterList } from './bookRouters';
import { bookMenuItemList } from './bookAppMenu';
import { IModuleHub } from '../../modulesTypings';

const Book: IModuleHub = {
	pagesRouterList: bookRouterList,
	pagesMenuItemList: bookMenuItemList
};

export default Book;
