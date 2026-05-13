import { authorMenuItemList } from './authorAppMenu';
import { authorRouterList } from './authorRouters';
import { IModuleHub } from '../../../modules/modulesTypings';

const Author: IModuleHub = {
	pagesRouterList: authorRouterList,
	pagesMenuItemList: authorMenuItemList
};

export default Author;
