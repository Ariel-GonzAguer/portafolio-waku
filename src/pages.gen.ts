// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_About_getConfig } from './pages/about';
// prettier-ignore
import type { getConfig as File_Contacto_getConfig } from './pages/contacto';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_Proyectos_getConfig } from './pages/proyectos';
// prettier-ignore
import type { getConfig as File_Servicios_getConfig } from './pages/servicios';

// prettier-ignore
type Page =
| ({ path: '/about' } & GetConfigResponse<typeof File_About_getConfig>)
| ({ path: '/contacto' } & GetConfigResponse<typeof File_Contacto_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/proyectos' } & GetConfigResponse<typeof File_Proyectos_getConfig>)
| ({ path: '/servicios' } & GetConfigResponse<typeof File_Servicios_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
