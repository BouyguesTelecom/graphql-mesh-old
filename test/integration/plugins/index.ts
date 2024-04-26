import { type Plugin } from '@envelop/core';

/**
 * This plugin auto-populates the Server-Timing header to the response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
 */
export default () => {
  return <Plugin>{
    onFetch({ context, info }) {
      if (!info) {
        return;
      }

      const start = Date.now();

      return () => {
        const duration = Date.now() - start;
        const timing = `${info.fieldName};desc="${info.fieldName} (${info.sourceName})";dur=${duration}`;
        if (!context.timings) {
          context.timings = [];
        }
        context.timings.push(timing);
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
