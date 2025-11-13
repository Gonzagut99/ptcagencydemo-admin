import { Context } from 'runed';
import type { DynamicRouteDictionary } from './dynamic-routes-breadcrumb.types';

// export const dynamicRouteDictionaryContext = new Context<{
//     slug: string;
//     name: string;
// }[]>("<dynamic-route-dictionary-context>");

export class DynamicRouteDictionaryContext {
	#dynamicRoutes: DynamicRouteDictionary[] = $state([]);

	get dynamicRoutes() {
		return this.#dynamicRoutes;
	}

	set dynamicRoutes(routes: DynamicRouteDictionary[]) {
		this.#dynamicRoutes = routes;
	}

	clear() {
		this.#dynamicRoutes = [];
	}
}

const SYMBOL_KEY = 'scn-dynamic-route-dictionary-context';
export const dynamicRouteDictionaryContext = new Context<DynamicRouteDictionaryContext>(
	SYMBOL_KEY
);
