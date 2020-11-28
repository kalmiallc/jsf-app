import { EditorInterfaceLayoutFactory } from '@kalmia/jsf-common-es2015';

export const propKeyJsfSchema = (allKeys: string[]): any => ({
  schema: {
    type: 'object',
    properties: {
      key: {
        type: 'string',
        required: true,
        handler: {
          type: 'common/dropdown',
          values: allKeys,
        }
      }
    }
  },
  layout: {
    type: 'div',
    items: [
      ... EditorInterfaceLayoutFactory.outputKey('key', 'Form control key', {
        handlerPreferences: {
          searchable: true
        }
      })
    ]
  }
});
