import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

export const skipAuthContext = (): HttpContext => new HttpContext().set(SKIP_AUTH, true);

export const skipGlobalLoaderContext = (): HttpContext =>
  new HttpContext().set(SKIP_GLOBAL_LOADER, true);
