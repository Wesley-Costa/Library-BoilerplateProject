import { authorMenuItemList } from './authorAppMenu';
import { authorRouterList } from './authorRouters';
import { IModuleHub } from '../../../modules/modulesTypings';

const authorModule: IModuleHub = {
	pagesRouterList: authorRouterList,
	pagesMenuItemList: authorMenuItemList
};

export default authorModule;
