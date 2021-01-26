export enum NodeEvent {
  /**
   * Fires when node was created and entered the scene tree
   */
  Create  = 'create',
  /**
   * Fires when node is about to exit the scene tree and be destroyed
   */
  Destroy = 'destroy',
  /**
   * Fires on every animation frame
   */
  Tick    = 'tick',
  /**
   * Fires when any of the listed dependencies' value changes
   */
  Update  = 'update',
  /**
   * Fires when mouse is clicked on node
   */
  MouseDown  = 'mouseDown',
  /**
   * Fires when mouse is released on node
   */
  MouseUp  = 'mouseUp',
  /**
   * Fires when node is dragged
   */
  Drag  = 'drag',
  /**
   * Fires when node is hovered
   */
  MouseOver  = 'mouseOver',
  /**
   * Fires when node is hovered
   */
  MouseOut  = 'mouseOut',
}
