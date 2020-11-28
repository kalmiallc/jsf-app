import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  isJsfProviderSourceApi,
  isJsfProviderSourceEntity,
  isJsfProviderSourceEval,
  isJsfProviderSourceVirtualEvent,
  JsfDocument
}                                                                               from '@kalmia/jsf-common-es2015';
import { jsfConfigJsfDefinition }                                               from './jsf-config.jsf';
import { JsfEditor }                                                            from '@kalmia/jsf-common-es2015/lib/editor/jsf-editor';
import { mergeProps }                                                           from '../utils';
import { mergeWith }                                                            from 'lodash';

@Component({
  selector       : 'jsf-kal-jsf-builder-config',
  templateUrl    : './kal-jsf-builder-config.component.html',
  styleUrls      : ['./kal-jsf-builder-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderConfigComponent implements OnInit {

  @Input()
  jsfEditor: JsfEditor;

  configDocument: JsfDocument;

  private _configData: any;

  get configData(): any {
    return this._configData;
  }

  set configData(value: any) {
    this._configData                = value;
    this.jsfEditor.definitionConfig = this.mapValueFromConfigToJsf(mergeWith(this.jsfEditor.definitionConfig, value, mergeProps));

    console.log(this.jsfEditor.definitionConfig);
  }

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._configData = this.mapValueFromJsfToConfig(this.jsfEditor.definitionConfig);

    this.configDocument = jsfConfigJsfDefinition();
  }


  private mapValueFromJsfToConfig(value) {
    return {
      ...value,

      $providers: value.$providers
        ? Object.keys(value.$providers)
          .map(key => {
            let type;
            if (isJsfProviderSourceVirtualEvent(value.$providers[key].source)) {
              type = 'virtual-event';
            } else if (isJsfProviderSourceEntity(value.$providers[key].source)) {
              type = 'entity';
            } else if (isJsfProviderSourceEval(value.$providers[key].source)) {
              type = 'eval';
            } else if (isJsfProviderSourceApi(value.$providers[key].source)) {
              type = 'api';
            }

            return {
              key,
              type,
              ...value.$providers[key]
            };
          })
        : [],

      $evalObjects: value.$evalObjects
        ? Object.keys(value.$evalObjects)
          .map(key => ({
            key,
            value: value.$evalObjects[key]
          }))
        : [],

      $events: value.$events && value.$events.listen
        ? ({
          listen: Object.keys(value.$events.listen)
            .map(key => ({
              key,
              ...value.$events.listen[key]
            }))
        })
        : { listen: [] }
    };
  }

  private mapValueFromConfigToJsf(value) {
    return {
      ...value,

      $providers: value.$providers
        ? value.$providers.reduce((a, c) => ({ ...a, [c.key]: c }), {})
        : {},

      $evalObjects: value.$evalObjects
        ? value.$evalObjects.reduce((a, c) => ({ ...a, [c.key]: c.value }), {})
        : {},

      $events: {
        listen: value.$events.listen
          ? value.$events.listen.reduce((a, c) => ({ ...a, [c.key]: c }), {})
          : {}
      }
    };
  }
}
