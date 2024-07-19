import { type Plugin } from '@envelop/core';

import {Logger} from '../utils/logger'


export default () => {
  return <Plugin>{
    onFetch({ context, info }) {

      if (!info) {
        return;
      }
//rawSource.rawSource.handler.config.source
//info.parentType._fields.getFeatureToggles_v1.description
//info.variableValues
      const start = Date.now();
      let rawSource=context[info.sourceName]
      console.log("rawSource", rawSource)
      let endpoint=rawSource.rawSource.handler.config.endpoint
      let operation=info.operation.name
      let description=info.parentType._fields[info.path.key].description
      return (tt) => {
        const duration = Date.now() - start;
        let response=tt.response
        let status=response.options.status
        let url=response.options.url
        //const timing = `${info.fieldName};desc="${info.fieldName} (${info.sourceName})";dur=${duration}`;
        Logger.onFetch(context.request,info.fieldName,info.sourceName,info.path.key,endpoint,operation,info.variableValues,description,duration)
      };
    },

    onExecute() {
      return {
        onExecuteDone({ args }) {
          // @ts-ignore
          const { timings } = args.contextValue;
          if (!timings) {
            return;
          }

          // @ts-ignore
          args.contextValue.res.setHeader?.(
            'Server-Timing',
            timings.join(', ')
          );
        },
      };
    },

  };
};
