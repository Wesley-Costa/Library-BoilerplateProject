import { authorsMenuItemList } from './authorAppMenu';
import { authorsRouterList } from './authorRouters';
import { IModuleHub } from '../../../modules/modulesTypings';

const Author: IModuleHub = {
	pagesRouterList: authorsRouterList,
	pagesMenuItemList: authorsMenuItemList
};

export default Author;
