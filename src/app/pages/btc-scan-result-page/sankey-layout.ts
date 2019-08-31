import * as go from 'gojs';


export class SankeyLayout extends go.LayeredDigraphLayout {

  constructor() {
    super();
  }

  createNetwork(): go.LayeredDigraphNetwork {
    this.diagram.nodes.each((node) => {
      var height = this.getAutoHeightForNode(node);
      var font = "bold " + Math.max(12, Math.round(height / 8)) + "pt Segoe UI, sans-serif"
      var shape = node.findObject("SHAPE");
      var text = node.findObject("TEXT");
      var ltext = node.findObject("LTEXT");
      if (shape) shape.height = height;
      if (text) (<any>text).font = font;
      if (ltext) (<any>ltext).font = font;

    });
    return super.createNetwork();
  }

  protected nodeMinColumnSpace(v: go.LayeredDigraphVertex, topleft: boolean): number {
    if (v.node === null) {
      if (v.edgesCount >= 1) {
        var max = 1;
        var it = v.edges;
        while (it.next()) {
          var edge = it.value;
          if (edge.link != null) {
            var t = edge.link.computeThickness();
            if (t > max) max = t;
            break;
          }
        }
        return Math.ceil(max / this.columnSpacing);
      }
      return 1;
    }
    return super.nodeMinColumnSpace(v, topleft);
  }

  protected assignLayers(): void {
    super.assignLayers();
    var maxlayer = this.maxLayer;

    // now make sure every vertex with no outputs is maxlayer
    for (var it = this.network.vertexes.iterator; it.next();) {
      var v = it.value;
      var node = v.node;
      if (v.destinationVertexes.count === 0) {
        (<any>v).layer = 0;
      }
      if (v.sourceVertexes.count === 0) {
        (<any>v).layer = maxlayer;

      }
    }
    // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
    // (other than the ones that are the widest or tallest in their respective layer).
  }

  protected commitLayout(): void {
    super.commitLayout();
    for (var it = this.network.edges.iterator; it.next();) {
      var link = it.value.link;
      if (link && link.curve === go.Link.Bezier) {
        // depend on Link.adjusting === go.Link.End to fix up the end points of the links
        // without losing the intermediate points of the route as determined by LayeredDigraphLayout
        link.invalidateRoute();
      }
    }
  }
  private getAutoHeightForNode(node) {
    var heightIn = 0;
    var it = node.findLinksInto()
    while (it.next()) {
      var link = it.value;
      heightIn += link.computeThickness();
    }
    var heightOut = 0;
    var it = node.findLinksOutOf()
    while (it.next()) {
      var link = it.value;
      heightOut += link.computeThickness();
    }
    var h = Math.max(heightIn, heightOut);
    if (h < 10) h = 10;
    return h;
  };
}
