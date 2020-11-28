import { Node } from './abstract/node';
import { NodeProperty, NodePropertyGetter, NodePropertySetter } from './abstract/node-decorators';
import { deg2rad, rad2deg } from '../helpers/math';
import { TextureLoader } from '../helpers/texture-loader';
import Color from 'color';

export class Sprite extends Node<PIXI.Sprite> {

  @NodeProperty()
  public name: string;

  @NodeProperty()
  public image: string;

  @NodeProperty()
  public visible: boolean;

  @NodeProperty()
  public interactive: boolean;

  @NodeProperty()
  public x: number;

  @NodeProperty()
  public y: number;

  @NodeProperty(['scaleX'])
  public width: number;

  @NodeProperty(['scaleY'])
  public height: number;

  @NodeProperty(['width'])
  public scaleX: number;

  @NodeProperty(['height'])
  public scaleY: number;

  @NodeProperty()
  public anchorX: number;

  @NodeProperty()
  public anchorY: number;

  @NodeProperty()
  public pivotX: number;

  @NodeProperty()
  public pivotY: number;

  @NodeProperty()
  public rotation: number;

  @NodeProperty()
  public color: string;

  @NodeProperty()
  public alpha: number;

  @NodeProperty()
  public mask: {
    type: 'polygon' | 'image',
    scale: number,
    points: {
      x: number,
      y: number
    }[],
    imageUrl: string
  };


  private _textureLoader: TextureLoader;
  private _texture: PIXI.Texture;

  protected async createDisplayObject() {
    this._texture = await this._textureLoader.loadTexture(this.image);
    this.displayObject = new PIXI.Sprite(this._texture);
  }

  protected async destroyDisplayObject() {
    this.displayObject.destroy();
  }

  protected onNodeCreated() {
    super.onNodeCreated();
    this._textureLoader = new TextureLoader(this.renderer);
  }

  @NodePropertySetter('image')
  setSpriteImage(oldValue?: any) {
    // Note that pixi.js will cache the textures for us, so don't call `destroy()` on it because you will break the reference
    // and then wonder why you spent 3 hours trying to figure out why things are not working like they're supposed to
    return (async () => {
      this._texture = await this._textureLoader.loadTexture(this.image);
      this.displayObject.texture = this._texture;
    })();
  }

  @NodePropertyGetter('image')
  getSpriteImage(): string {
    const resource = this._texture.baseTexture.resource as PIXI.resources.ImageResource;
    return resource && resource.url;
  }


  @NodePropertySetter('scaleX')
  setSpriteScaleX() {
    this.displayObject.scale.x = this.scaleX;
  }

  @NodePropertyGetter('scaleX')
  getSpriteScaleX() {
    return this.displayObject.scale.x;
  }

  @NodePropertySetter('scaleY')
  setSpriteScaleY() {
    this.displayObject.scale.y = this.scaleY;
  }

  @NodePropertyGetter('scaleY')
  getSpriteScaleY() {
    return this.displayObject.scale.y;
  }

  @NodePropertySetter('anchorX')
  setSpriteAnchorX() {
    this.displayObject.anchor.x = this.anchorX;
  }

  @NodePropertyGetter('anchorX')
  getSpriteAnchorX() {
    return this.displayObject.anchor.x;
  }

  @NodePropertySetter('anchorY')
  setSpriteAnchorY() {
    this.displayObject.anchor.y = this.anchorY;
  }

  @NodePropertyGetter('anchorY')
  getSpriteAnchorY() {
    return this.displayObject.anchor.y;
  }

  @NodePropertySetter('pivotX')
  setSpritePivotX() {
    this.displayObject.pivot.x = this.pivotX;
  }

  @NodePropertyGetter('pivotX')
  getSpritePivotX() {
    return this.displayObject.pivot.x;
  }

  @NodePropertySetter('pivotY')
  setSpritePivotY() {
    this.displayObject.pivot.y = this.pivotY;
  }

  @NodePropertyGetter('pivotY')
  getSpritePivotY() {
    return this.displayObject.pivot.y;
  }

  @NodePropertySetter('rotation')
  setSpriteRotation() {
    this.displayObject.rotation = deg2rad(this.rotation);
  }

  @NodePropertyGetter('rotation')
  getSpriteRotation() {
    return rad2deg(this.displayObject.rotation);
  }

  @NodePropertySetter('color')
  setSpriteColor() {
    this.displayObject.tint = Color(this.color).rgbNumber();
  }

  @NodePropertyGetter('color')
  getSpriteColor() {
    return Color(this.displayObject.tint).hex();
  }

  /**
   * Mask doesn't scale with parrent
   */
  @NodePropertySetter('mask')
  setSpriteMask() {
    if (!this.mask) {
      return;
    }
    let mask;
    this.mask.scale = this.mask.scale ? this.mask.scale : 1;
    if (this.mask.type === 'polygon') {
      mask = new PIXI.Graphics()
        .beginFill(0xFFFFFF)
        .drawPolygon(this.mask.points.reduce((acc, point) => {
          acc.push(point.x);
          acc.push(point.y);
          return acc;
        }, []))
        .endFill();
    } else if (this.mask.type === 'image') {
      mask = PIXI.Sprite.from(this.mask.imageUrl);
    }

    this.displayObject.mask = mask;
    // this.displayObject.addChild(mask);
  }

  @NodePropertyGetter('mask')
  getSpriteMask() {
    return this.displayObject.mask;
  }

}
