import sp from './sp.json';

// Solo el español va dentro del bundle principal. Los demás idiomas
// (~55 KB cada uno) se descargan recién cuando alguien los selecciona:
// antes los 8 archivos viajaban siempre, se usaran o no.
const loaded = { sp };

export const getFiles = () => ({ ...loaded });

export const loadLocale = (name) => {
    if (!name || loaded[name]) {
        return Promise.resolve(loaded[name]);
    }

    return import(/* webpackChunkName: "locale-[request]" */ `./${name}.json`)
        .then((module) => {
            loaded[name] = module.default ?? module;
            return loaded[name];
        })
        .catch(() => undefined);
};
