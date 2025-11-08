import { Context } from "runed";

export const dynamicRouteDictionaryContext = new Context<{
    slug: string;
    name: string;
}[]>("<dynamic-route-dictionary-context>");