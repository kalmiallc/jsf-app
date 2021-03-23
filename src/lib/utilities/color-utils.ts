import { ralColors } from './ral-colors';
import { padEnd }    from 'lodash';
import Color         from 'color';

interface RalItem {
  code: string;
  hex: string;
}

export class ColorUtils {

  private ralLookupTable: RalItem[] = [];

  constructor() {
    this.ralLookupTable = Object.keys(ralColors).map(x => ({
        code: x,
        hex : ralColors[x]
      }))
      .sort((a, b) => parseInt(a.code, 10) - parseInt(b.code, 10));
  }

  getAllRalColors(): RalItem[] {
    return this.ralLookupTable;
  }

  getRalColor(ral: string | number): RalItem {
    return this.ralLookupTable.find(x => x.code === ral.toString());
  }

  ralToHex(ral: string | number): string {
    return this.getRalColor(ral).hex;
  }


  getColorFromString(text: string) {
    const SEED         = 16777215;
    const FACTOR       = 49979693;

    let b       = 1;
    let d       = 0;
    let f       = 1;
    if (text.length > 0) {
      for (let i = 0; i < text.length; i++) {
        // tslint:disable-next-line:no-unused-expression
        text[i].charCodeAt(0) > d && (d = text[i].charCodeAt(0)),
          // @ts-ignore
          // tslint:disable-next-line:radix
          (f = parseInt(SEED / d)),
          (b = (b + text[i].charCodeAt(0) * f * FACTOR) % SEED);
      }
    }
    let hex   = ((b * text.length) % SEED).toString(16);
    hex       = padEnd(hex, 6, hex);
    return Color('#' + hex).saturate(.1).hex();
  }
}

export const colorUtils = new ColorUtils();
