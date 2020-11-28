import { EditorInterfaceLayoutFactory, EditorInterfaceSchemaFactory, JsfDefinition, JsfRegister } from '@kalmia/jsf-common-es2015';

export const jsfConfigJsfDefinition = (): any => {
  return {
    schema: {
      type      : 'object',
      properties: {
        $thumbnail  : {
          type: 'string'
        },
        $key        : {
          type: 'string'
        },
        $dff        : {
          type      : 'object',
          properties: {
            key: {
              type: 'string'
            }
          }
        },
        $schema     : {
          type       : 'string',
          description: 'JSON Schema version identifier & location of JSON Schema resource.'
        },
        $description: {
          type       : 'string',
          multiline  : 5,
          description: 'Description intended for display to end users.'
        },
        $document   : {
          type       : 'string',
          description: 'Location of specific document on the web.'
        },
        $config     : {
          type      : 'object',
          properties: {},
          handler   : {
            type: 'any'
          }
        },
        $lifeCycle  : {
          type      : 'object',
          properties: {
            $beforeFormInit    : {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code before the document is initialized.'
                }
              }
            },
            $afterFormInit     : {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code after document is initialized and value is set.'
                }
              }
            },
            $beforeFormDestroy : {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code when the form is about to be destroyed.'
                }
              }
            },
            $afterFormDestroy  : {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code after the form has been destroyed.'
                }
              }
            },
            $onFormValueChange : {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code every time the form value changes.'
                }
              }
            },
            $onFormStatusChange: {
              type      : 'object',
              properties: {
                $eval: {
                  type       : 'string',
                  handler    : {
                    type   : 'common/code-editor',
                    options: {
                      language: 'javascript'
                    }
                  },
                  description: 'Execute code every time the form status changes.'
                }
              }
            }
          }
        },
        $services   : {
          type : 'array',
          items: {
            type      : 'object',
            properties: {
              name  : {
                type: 'string'
              },
              config: {
                type      : 'object',
                properties: {},
                handler   : {
                  type: 'any'
                }
              }
            }
          }
        },
        $indexes    : {
          type : 'array',
          items: {
            type      : 'object',
            properties: {
              fieldOrSpec: {
                type : 'string',
                title: 'Field or Spec'
              },
              options    : {
                type      : 'object',
                properties: {
                  unique: {
                    type : 'boolean',
                    title: 'Unique'
                  },
                  sparse: {
                    type : 'boolean',
                    title: 'Sparse'
                  }
                }
              }
            }
          }
        },
        $comment    : {
          type       : 'string',
          multiline  : 3,
          description: 'Comment intended for notes to schema maintainers.'
        },
        $theme      : {
          type       : 'string',
          description: 'Enter theme name, which will be used for general styling.'
        },
        $style      : {
          type       : 'string',
          handler    : {
            type   : 'common/code-editor',
            options: {
              language: 'css'
            }
          },
          description: 'Used for fine tuning branding. Inserted into <style> tag.'
        },
        $modes      : {
          type : 'array',
          items: {
            type: 'string'
          }
        },
        $stylesheets: {
          type : 'array',
          items: {
            type: 'string'
          }
        },
        $scripts    : {
          type : 'array',
          items: {
            type: 'string'
          }
        },
        $title      : {
          type       : 'string',
          description: 'Enter form title.'
        },
        $favicon    : {
          type       : 'string',
          description: 'Enter URL of preffered favicon.'
        },
        $evalObjects: {
          type : 'array',
          items: {
            type      : 'object',
            properties: {
              key  : {
                type : 'string',
                title: 'Key'
              },
              value: {
                type   : 'string',
                title  : '$eval',
                handler: {
                  type   : 'common/code-editor',
                  options: {
                    language: 'javascript'
                  }
                }
              }
            }
          }
        },
        $events     : {
          type      : 'object',
          properties: {
            listen: {
              type : 'array',
              items: {
                type      : 'object',
                properties: {
                  key   : {
                    type : 'string',
                    title: 'Key'
                  },
                  $title: {
                    type : 'string',
                    title: 'Title'
                  },
                  $eval : {
                    type   : 'string',
                    title  : '$eval',
                    handler: {
                      type   : 'common/code-editor',
                      options: {
                        language: 'json'
                      }
                    }
                  }
                }
              }
            }
          }
        },

        $providers: {
          type : 'array',
          items: {
            type      : 'object',
            properties: {

              key: {
                type : 'string',
                title: 'Key'
              },

              type: {
                type    : 'string',
                required: true,
                title   : 'Type',
                default : '$eval',
                handler : {
                  type  : 'common/dropdown',
                  values: [
                    ... (JsfRegister.getBuilderFeatureSet() !== 'basic' ? [
                      {
                        label: '$eval',
                        value: 'eval'
                      },
                      {
                        label: 'Entity',
                        value: 'entity'
                      },
                      {
                        label: 'Virtual event',
                        value: 'virtual-event'
                      },
                      {
                        label: 'API',
                        value: 'api'
                      },
                      {
                        label: 'Data source',
                        value: 'data-source'
                      }
                    ] : [
                      {
                        label: '$eval',
                        value: 'eval'
                      },
                      {
                        label: 'API',
                        value: 'api'
                      },
                      {
                        label: 'Data source',
                        value: 'data-source'
                      }
                    ])
                  ]
                }
              },

              /**
               * Where data should be provided from.
               * This can be either a virtual event (limited to the form's dff key), or the name of the entity (user,
               * customer, ...)
               */
              source: {
                type      : 'object',
                properties: {

                  // JsfProviderSourceVirtualEventInterface
                  /**
                   * Name of virtual event.
                   */
                  virtualEvent: {
                    type     : 'string',
                    title    : 'Name of virtual event',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'virtual-event'`,
                      dependencies: ['$providers[].type']
                    }
                  },

                  // JsfProviderSourceEntityInterface
                  /**
                   * Name of the entity to get data from.
                   *
                   * For DFF forms use value dff:<key>, for users use 'user' and for customers use 'customer'.
                   * Examples:
                   *  - dff:order
                   *  - user
                   *  - customer
                   */
                  entity: {
                    type     : 'string',
                    title    : 'Name of the entity to get data from',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'entity'`,
                      dependencies: ['$providers[].type']
                    }
                  },

                  // JsfProviderSourceEvalInterface {
                  /**
                   * The eval to run which should return a value to be provided.
                   */
                  $eval   : {
                    type     : 'string',
                    title    : '$eval',
                    handler  : {
                      type   : 'common/code-editor',
                      options: {
                        language: 'javascript'
                      }
                    },
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'eval'`,
                      dependencies: ['$providers[].type']
                    }
                  },
                  /**
                   * Whether the eval should be executed on the linked builder.
                   */
                  onLinked: {
                    type     : 'boolean',
                    title    : 'Run on linked builder',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'eval'`,
                      dependencies: ['$providers[].type']
                    }
                  },


                  // JsfProviderSourceApiInterface {
                  /**
                   * API route (or absolute URL) to fetch data from.
                   *
                   * Valid API option examples:
                   *  - { api: 'crm/customer/documents' }
                   *  - { api: 'dff/order/documents/virtual-event/abc' }
                   *  - { api: 'https://example.com/data.json' }
                   */
                  api: {
                    type      : 'object',
                    enabledIf : {
                      $eval       : `return $getPropValue('$providers[].type') === 'api'`,
                      dependencies: ['$providers[].type']
                    },
                    properties: {
                      $eval: {
                        type   : 'string',
                        title  : 'Eval',
                        handler: {
                          type   : 'common/code-editor',
                          options: {
                            language: 'javascript'
                          }
                        }
                      }
                    }
                  },


                  /**
                   * If not set GET will be used.
                   */
                  reqType: {
                    type     : 'string',
                    title    : 'Request type',
                    required : true,
                    default  : 'GET',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'api'`,
                      dependencies: ['$providers[].type']
                    },
                    handler  : {
                      type  : 'common/dropdown',
                      values: ['POST', 'GET']
                    }
                  },

                  // JsfProviderSourceDataSourceInterface {
                  /**
                   * API route (or absolute URL) to fetch data from.
                   *
                   * Valid API option examples:
                   *  - { api: 'crm/customer/documents' }
                   *  - { api: 'dff/order/documents/virtual-event/abc' }
                   *  - { api: 'https://example.com/data.json' }
                   */

                  dataSourceKey: {
                    type     : 'string',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'data-source'`,
                      dependencies: ['$providers[].type']
                    },
                    required : true
                  },


                  type: {
                    type     : 'string',
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'data-source'`,
                      dependencies: ['$providers[].type']
                    },
                    required : true,
                    handler  : {
                      type  : 'common/dropdown',
                      values: [
                        { label: 'Insert', value: 'insert' },
                        { label: 'Update', value: 'update' },
                        { label: 'Get', value: 'get' },
                        { label: 'Remove', value: 'remove' },
                        { label: 'List', value: 'List' }
                      ]
                    },
                    default  : 'list'
                  },

                  ...EditorInterfaceSchemaFactory.createJsfValueOptionsProperty('$providers[].source', 'data', 'any', {
                    enabledIf: {
                      $eval       : `return $getPropValue('$providers[].type') === 'data-source'`,
                      dependencies: ['$providers[].type']
                    }
                  })
                }
              },

              /**
               * Whether the provider should cache the requests based on the input data.
               * Defaults to true.
               */
              cache: {
                type : 'boolean',
                title: 'Cache responses'
              },

              /**
               * Optional eval which gets called once the provider receives the data. The eval should return the mapped
               * data. The eval context will contain a special variable `$response` which contains the data received
               * from the server.
               */
              mapResponseData: {
                type      : 'object',
                properties: {
                  $eval: {
                    type   : 'string',
                    title  : '$eval',
                    handler: {
                      type   : 'common/code-editor',
                      options: {
                        language: 'javascript'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        $dirtyList: {
          type : 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    layout: {
      type : 'div',
      items: [
        {
          type : 'tabset',
          items: [
            {
              type : 'tab',
              title: 'General',
              items: [
                {
                  type     : 'div',
                  htmlClass: 'p-5',
                  items    : [
                    {
                      type : 'row',
                      items: [
                        {
                          type : 'col',
                          xs   : 12,
                          md   : 6,
                          items: [
                            {
                              type : 'span',
                              title: 'Title'
                            },
                            {
                              key: '$title'
                            },
                            {
                              type : 'span',
                              title: 'Description'
                            },
                            {
                              key: '$description'
                            },
                            {
                              type     : 'div',
                              htmlClass: 'mt-5',
                              items    : [
                                {
                                  type : 'span',
                                  title: 'Modes'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Used for switching layouts.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  type : 'array',
                                  key  : '$modes',
                                  items: [
                                    {
                                      type : 'row',
                                      items: [
                                        {
                                          type : 'col',
                                          xs   : 'auto',
                                          items: [
                                            {
                                              key: '$modes[]'
                                            }
                                          ]
                                        },
                                        {
                                          type     : 'col',
                                          htmlClass: 'text-center',
                                          xs       : 'content',
                                          items    : [
                                            {
                                              type       : 'array-item-remove',
                                              icon       : 'delete',
                                              tooltip    : 'Remove mode',
                                              preferences: {
                                                variant: 'icon'
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  type     : 'array-item-add',
                                  path     : '$modes',
                                  title    : 'Add mode',
                                  htmlClass: 'mb-3'
                                }
                              ]
                            },
                            {
                              type     : 'div',
                              htmlClass: 'mt-5',
                              items    : [
                                {
                                  type : 'span',
                                  title: 'Dirty list'
                                },
                                {
                                  type     : 'span',
                                  title    : 'When the value in the watched field is changed, the form is marked as "dirty".',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  type : 'array',
                                  key  : '$dirtyList',
                                  items: [
                                    {
                                      type : 'row',
                                      items: [
                                        {
                                          type : 'col',
                                          xs   : 'auto',
                                          items: [
                                            {
                                              key: '$dirtyList[]'
                                            }
                                          ]
                                        },
                                        {
                                          type     : 'col',
                                          htmlClass: 'text-center',
                                          xs       : 'content',
                                          items    : [
                                            {
                                              type       : 'array-item-remove',
                                              icon       : 'delete',
                                              tooltip    : 'Remove from dirty list',
                                              preferences: {
                                                variant: 'icon'
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  type     : 'array-item-add',
                                  path     : 'dirtyList',
                                  title    : 'Add field',
                                  htmlClass: 'mb-3'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type : 'col',
                          xs   : 12,
                          md   : 6,
                          items: [
                            ...(JsfRegister.getBuilderFeatureSet() !== 'basic' ? [
                              {
                                type : 'span',
                                title: 'Theme'
                              },
                              {
                                key: '$theme'
                              },
                              {
                                type : 'span',
                                title: 'Favicon'
                              },
                              {
                                key: '$favicon'
                              },
                              {
                                type : 'span',
                                title: 'Schema'
                              },
                              {
                                key: '$schema'
                              },
                              {
                                type : 'span',
                                title: 'Document'
                              },
                              {
                                key: '$document'
                              }
                            ] : []),
                            {
                              type : 'span',
                              title: 'Comment'
                            },
                            {
                              key: '$comment'
                            }
                          ]
                        }
                      ]
                    }

                  ]
                }
              ]
            },
            {
              type : 'tab',
              title: 'Styles & scripts',
              items: [
                {
                  type     : 'div',
                  htmlClass: 'p-5',
                  items    : [
                    {
                      type : 'row',
                      items: [
                        {
                          type : 'col',
                          xs   : 12,
                          md   : 6,
                          items: [
                            {
                              type : 'span',
                              title: 'External Stylesheets'
                            },
                            {
                              type     : 'span',
                              title    : 'Includes css files before rendering form.',
                              htmlClass: 'ml-3 text-muted small'
                            },
                            {
                              type : 'array',
                              key  : '$stylesheets',
                              items: [
                                {
                                  type : 'row',
                                  items: [
                                    {
                                      type : 'col',
                                      xs   : 'auto',
                                      items: [
                                        {
                                          key: '$stylesheets[]'
                                        }
                                      ]
                                    },
                                    {
                                      type     : 'col',
                                      htmlClass: 'text-center',
                                      xs       : 'content',
                                      items    : [
                                        {
                                          type       : 'array-item-remove',
                                          icon       : 'delete',
                                          tooltip    : 'Remove stylesheet',
                                          preferences: {
                                            variant: 'icon'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type     : 'array-item-add',
                              path     : '$stylesheets',
                              title    : 'Add stylesheet',
                              htmlClass: 'mb-3'
                            }
                          ]
                        },
                        {
                          type : 'col',
                          xs   : 12,
                          md   : 6,
                          items: [
                            {
                              type : 'span',
                              title: 'External scripts'
                            },
                            {
                              type     : 'span',
                              title    : 'Includes script files before rendering form.',
                              htmlClass: 'ml-3 text-muted small'
                            },
                            {
                              type : 'array',
                              key  : '$scripts',
                              items: [
                                {
                                  type : 'row',
                                  items: [
                                    {
                                      type : 'col',
                                      xs   : 'auto',
                                      items: [
                                        {
                                          key: '$scripts[]'
                                        }
                                      ]
                                    },
                                    {
                                      type     : 'col',
                                      htmlClass: 'text-center',
                                      xs       : 'content',
                                      items    : [
                                        {
                                          type       : 'array-item-remove',
                                          icon       : 'delete',
                                          tooltip    : 'Remove script',
                                          preferences: {
                                            variant: 'icon'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type     : 'array-item-add',
                              path     : '$scripts',
                              title    : 'Add script',
                              htmlClass: 'mb-3'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      type : 'row',
                      items: [
                        {
                          type : 'col',
                          xs   : 6,
                          items: [
                            {
                              type : 'span',
                              title: 'Styles'
                            },
                            {
                              type     : 'span',
                              title    : 'Used for fine tuning branding. Inserted into <style> tag.',
                              htmlClass: 'ml-3 text-muted small'
                            },
                            {
                              key: '$style'
                            }
                          ]
                        },
                        {
                          type : 'col',
                          xs   : 6,
                          items: [
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: beforeFormInit'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code before the document is initialized.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$beforeFormInit.$eval'
                                }
                              ]
                            },
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: afterFormInit'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code after document is initialized and value is set.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$afterFormInit.$eval'
                                }
                              ]
                            },
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: beforeFormDestroy'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code when the form is about to be destroyed.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$beforeFormDestroy.$eval'
                                }
                              ]
                            },
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: afterFormDestroy'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code after the form has been destroyed',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$afterFormDestroy.$eval'
                                }
                              ]
                            },
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: onFormValueChange'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code every time the form value changes.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$onFormValueChange.$eval'
                                }
                              ]
                            },
                            {
                              type : 'div',
                              items: [
                                {
                                  type : 'span',
                                  title: 'Lifecycle hook: onFormStatusChange'
                                },
                                {
                                  type     : 'span',
                                  title    : 'Execute code every time the form status changes.',
                                  htmlClass: 'ml-3 text-muted small'
                                },
                                {
                                  key: '$lifeCycle.$onFormStatusChange.$eval'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type : 'tab',
              title: 'Providers',
              items: [
                {
                  type     : 'div',
                  htmlClass: 'p-5',
                  items    : [
                    {
                      type : 'div',
                      items: [
                        {
                          type     : 'expansion-panel',
                          key      : '$providers',
                          htmlClass: 'mb-5',
                          items    : [
                            {
                              type : 'expansion-panel-header',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'px-2 d-flex justify-content-between align-items-center',
                                  items    : [
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type        : 'span',
                                          title       : '{{ value }}',
                                          templateData: {
                                            $eval       : `return { value: $getItemValue('$providers[].key') || 'Untitled provider' }`,
                                            dependencies: ['$providers[].key']
                                          }
                                        }
                                      ]
                                    },
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type       : 'array-item-remove',
                                          icon       : 'delete',
                                          tooltip    : 'Remove provider',
                                          preferences: {
                                            variant: 'icon'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type : 'expansion-panel-content',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'p-4',
                                  items    : [
                                    {
                                      type : 'row',
                                      items: [
                                        {
                                          type : 'col',
                                          xs   : 'auto',
                                          items: [
                                            {
                                              key: '$providers[].key'
                                            },
                                            {
                                              key: '$providers[].type'
                                            },
                                            // JsfProviderSourceVirtualEventInterface
                                            {
                                              type     : 'div',
                                              visibleIf: {
                                                $eval       : `return $getItemValue('$providers[].type') === 'virtual-event'`,
                                                dependencies: ['$providers[].type']
                                              },
                                              items    : [
                                                {
                                                  key: '$providers[].source.virtualEvent'
                                                }
                                              ]
                                            },
                                            // JsfProviderSourceEntityInterface
                                            {
                                              type     : 'div',
                                              visibleIf: {
                                                $eval       : `return $getItemValue('$providers[].type') === 'entity'`,
                                                dependencies: ['$providers[].type']
                                              },
                                              items    : [
                                                {
                                                  key: '$providers[].source.entity'
                                                }
                                              ]
                                            },
                                            // JsfProviderSourceEvalInterface
                                            {
                                              type     : 'div',
                                              visibleIf: {
                                                $eval       : `return $getItemValue('$providers[].type') === 'eval'`,
                                                dependencies: ['$providers[].type']
                                              },
                                              items    : [
                                                {
                                                  type : 'span',
                                                  title: 'Eval script'
                                                },
                                                {
                                                  key      : '$providers[].source.$eval',
                                                  htmlClass: 'mb-1'
                                                },
                                                {
                                                  key: '$providers[].source.onLinked'
                                                }
                                              ]
                                            },
                                            // JsfProviderSourceApiInterface
                                            {
                                              type     : 'div',
                                              visibleIf: {
                                                $eval       : `return $getItemValue('$providers[].type') === 'api'`,
                                                dependencies: ['$providers[].type']
                                              },
                                              items    : [
                                                {
                                                  type : 'span',
                                                  title: 'API url'
                                                },
                                                {
                                                  key      : '$providers[].source.api.$eval',
                                                  htmlClass: 'mb-1'
                                                },
                                                {
                                                  key: '$providers[].source.reqType'
                                                }
                                              ]
                                            },
                                            // JsfProviderSourceDataSourceInterface
                                            {
                                              type     : 'div',
                                              visibleIf: {
                                                $eval       : `return $getItemValue('$providers[].type') === 'data-source'`,
                                                dependencies: ['$providers[].type']
                                              },
                                              items    : [
                                                {
                                                  type : 'span',
                                                  title: 'Data source key'
                                                },
                                                {
                                                  key      : '$providers[].source.dataSourceKey',
                                                  htmlClass: 'mb-1'
                                                },
                                                {
                                                  type : 'span',
                                                  title: 'Request type'
                                                },
                                                {
                                                  key      : '$providers[].source.type',
                                                  htmlClass: 'mb-1'
                                                },

                                                ...EditorInterfaceLayoutFactory.outputJsfValueOptionsProperty('$providers[].source', 'data', 'Request data (body)')
                                              ]
                                            },
                                            {
                                              key: '$providers[].cache'
                                            },
                                            {
                                              type : 'span',
                                              title: 'Map response data'
                                            },
                                            {
                                              key: '$providers[].mapResponseData.$eval'
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type     : 'array-item-add',
                          path     : '$providers',
                          title    : 'Add provider',
                          htmlClass: 'mb-3'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type : 'tab',
              title: 'Events',
              items: [
                {
                  type     : 'div',
                  htmlClass: 'p-5',
                  items    : [
                    {
                      type : 'div',
                      items: [
                        {
                          type     : 'expansion-panel',
                          key      : '$events.listen',
                          htmlClass: 'mb-5',
                          items    : [
                            {
                              type : 'expansion-panel-header',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'px-2 d-flex justify-content-between align-items-center',
                                  items    : [
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type        : 'span',
                                          title       : '{{ value }}',
                                          templateData: {
                                            $eval       : `return { value: $getItemValue('$events.listen[].key') || 'Untitled event' }`,
                                            dependencies: ['$events.listen[].key']
                                          }
                                        }
                                      ]
                                    },
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type       : 'array-item-remove',
                                          icon       : 'delete',
                                          tooltip    : 'Remove eval object',
                                          preferences: {
                                            variant: 'icon'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type : 'expansion-panel-content',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'p-4',
                                  items    : [
                                    {
                                      type : 'row',
                                      items: [
                                        {
                                          type : 'col',
                                          xs   : 'auto',
                                          items: [
                                            {
                                              key: '$events.listen[].key'
                                            },
                                            /*
                                             {
                                             $title: '$events.listen[].$title',
                                             },
                                             */
                                            {
                                              type : 'span',
                                              title: 'Event eval'
                                            },
                                            {
                                              key: '$events.listen[].$eval'
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type     : 'array-item-add',
                          path     : '$events.listen',
                          title    : 'Add event',
                          htmlClass: 'mb-3'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type : 'tab',
              title: 'Eval Objects',
              items: [
                {
                  type     : 'div',
                  htmlClass: 'p-5',
                  items    : [
                    {
                      type : 'div',
                      items: [
                        {
                          type     : 'expansion-panel',
                          key      : '$evalObjects',
                          htmlClass: 'mb-5',
                          items    : [
                            {
                              type : 'expansion-panel-header',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'px-2 d-flex justify-content-between align-items-center',
                                  items    : [
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type        : 'span',
                                          title       : '{{ value }}',
                                          templateData: {
                                            $eval       : `return { value: $getItemValue('$evalObjects[].key') || 'Untitled eval object' }`,
                                            dependencies: ['$evalObjects[].key']
                                          }
                                        }
                                      ]
                                    },
                                    {
                                      type : 'div',
                                      items: [
                                        {
                                          type       : 'array-item-remove',
                                          icon       : 'delete',
                                          tooltip    : 'Remove eval object',
                                          preferences: {
                                            variant: 'icon'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              type : 'expansion-panel-content',
                              items: [
                                {
                                  type     : 'div',
                                  htmlClass: 'p-4',
                                  items    : [
                                    {
                                      type : 'row',
                                      items: [
                                        {
                                          type : 'col',
                                          xs   : 'auto',
                                          items: [
                                            {
                                              key: '$evalObjects[].key'
                                            },
                                            {
                                              type : 'span',
                                              title: 'Eval object value'
                                            },
                                            {
                                              key: '$evalObjects[].value'
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type     : 'array-item-add',
                          path     : '$evalObjects',
                          title    : 'Add eval object',
                          htmlClass: 'mb-3'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  };
};
