import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/lists/web';
import '@pnp/sp/files/web';
import '@pnp/sp/items';
import '@pnp/sp/items/types';
import '@pnp/sp/fields';
import '@pnp/sp/batching';
import '@pnp/sp/site-groups';
import '@pnp/sp/site-groups/web';
import '@pnp/sp/site-users';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import '@pnp/sp/sputilities';
import '@pnp/sp/security';

let _sp: SPFI;

export const getSP = (context?: WebPartContext): SPFI => {
  if (context != null) {
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    //_sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));

    //Creating a new sp object to include caching behavior. This way our original object is unchanged.
    //_sp = spfi().using(SPFx(context)).using(Caching({ store: "session" }));

    _sp = spfi().using(SPFx(context));
  }
  return _sp;
};
