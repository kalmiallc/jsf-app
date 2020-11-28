import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExtractedMessage, JsfEditor, Language, TranslatedMessage }                  from '@kalmia/jsf-common-es2015';
import { Subject }                                                                         from 'rxjs';
import { BuilderPreferencesService }                                                       from '../builder-preferences.service';
import { ModuleLoaderService }                                                             from '../../kal-jsf-doc/services/module-loader.service';

@Component({
  selector       : 'jsf-kal-jsf-builder-translations',
  templateUrl    : './kal-jsf-builder-translations.component.html',
  styleUrls      : ['./kal-jsf-builder-translations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KalJsfBuilderTranslationsComponent implements OnInit, OnDestroy {

  modulesLoaded = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  jsfEditor: JsfEditor;

  @Input()
  translationLanguages?: Language[];

  extractedMessages: ExtractedMessage[] = [];
  translations: { [languageCode: string]: TranslatedMessage[] };

  selectedLanguage: Language;

  constructor(private builderPreferencesService: BuilderPreferencesService,
              private moduleLoaderService: ModuleLoaderService,
              private cdRef: ChangeDetectorRef) {
  }


  async ngOnInit() {
    await this.moduleLoaderService.preloadAllHandlerModules();
    this.modulesLoaded = true;

    this.extractMessages();
    this.loadTranslations();

    this.cdRef.detectChanges();

    // Legacy export command.
    (window as any).__exportLegacyTranslations = () => {
      const x = {};
      for (const language of this.translationLanguages) {
        x[language.code] = {};
        for (const translation of this.translations[language.code]) {
          x[language.code][translation.sourceText] = translation.targetText || null;
        }
      }

      console.log(x);

      return x;
    };
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    (window as any).__exportLegacyTranslations = undefined;
  }

  extractMessages() {
    this.extractedMessages = this.jsfEditor.extractTranslatableMessages();

    console.log(this.extractedMessages);
  }

  /**
   * Take extracted messages and merge them with existing translations.
   */
  loadTranslations() {
    this.translations = this.jsfEditor.translations || {};

    // Add missing languages.
    for (const language of this.translationLanguages) {
      this.translations[language.code] = this.translations[language.code] || [];
    }

    // Add missing translations for each language.
    for (const language of this.translationLanguages) {
      for (const message of this.extractedMessages) {
        const translatedMessage = this.findTranslatedMessageForLanguage(language, message.sourceText, message.id);
        if (!translatedMessage) {
          this.translations[language.code].push({
            sourceId  : message.id,
            sourceText: message.sourceText
          });
        }
      }
    }
  }

  findExtractedMessage(sourceText: string, id?: string) {
    return this.extractedMessages.find((x: ExtractedMessage) => {
      if (id) {
        return x.sourceText === sourceText && x.id === id;
      } else {
        return x.sourceText === sourceText && !x.id;
      }
    });
  }

  findTranslatedMessageForLanguage(language: Language, sourceText: string, id?: string) {
    return this.translations[language.code].find((x: TranslatedMessage) => {
      if (id) {
        return x.sourceText === sourceText && x.sourceId === id;
      } else {
        return x.sourceText === sourceText && !x.sourceId;
      }
    });
  }

  getTranslationProgressForLanguage(language: Language) {
    const translationsForLanguage = this.translations[language.code];
    return Math.floor((translationsForLanguage.filter(x => !!x.targetText).length / translationsForLanguage.length) * 100);
  }

  getTranslationsForLanguage(language: Language) {
    return this.translations[language.code];
  }

  writeTranslations() {
    this.jsfEditor.translations = this.translations;
  }

  addCustomTranslation() {
    this.translations[this.selectedLanguage.code].push({
      custom: true,
    });
    this.cdRef.detectChanges();
  }

  removeTranslation(translation: TranslatedMessage) {
    this.translations[this.selectedLanguage.code] = this.translations[this.selectedLanguage.code].filter(x => x !== translation);
  }

  selectLanguage(language: Language) {
    this.selectedLanguage = language;
    this.cdRef.detectChanges();
  }
}
