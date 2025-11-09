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
export const dynamicRouteDictionaryContext = new Context<DynamicRouteDictionaryContext>(
	'<dynamic-route-dictionary-context>'
);
