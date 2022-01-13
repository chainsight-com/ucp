import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {
  AddressScanApiService,
  AddressScanDto,
  ClusterEdgeDto,
  ClusterNodeDto, IncidentApiService, IncidentClusterDto, IncidentClusterEdgeDto,
  IncidentClusterNodeDto, IncidentDto, IncidentHolderEdge, IncidentHolderNode
} from "@profyu/unblock-ng-sdk";
import * as go from "gojs";
import {filter, take, takeUntil} from "rxjs/operators";
import {DiagramEvent, GraphLinksModel, GraphObject, Link, Shape} from "gojs";
import {CcPipe} from "../../pipes/cc.pipe";
import {interval, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserService} from "../../services/user.service";

export const COLORS = [
  ['#AC193D', '#BF1E4B'],
  ['#2672EC', '#2E8DEF'],
  ['#8C0095', '#A700AE'],
  ['#5133AB', '#643EBF'],
  ['#008299', '#00A0B1'],
  ['#D24726', '#DC572E'],
  ['#008A00', '#00A600'],
  ['#094AB2', '#0A5BC4'],
  ['#575757', '#6c6c6c']
];


@Component({
  selector: 'app-incident-cluster-graph',
  templateUrl: './incident-cluster-graph.component.html',
  styleUrls: ['./incident-cluster-graph.component.scss']
})
export class IncidentClusterGraphComponent implements OnInit {

  @Input()
  public incidentId: string;
  @Input()
  public nodeActions: Array<{ name: string, title: string }> = [];

  @Output()
  public onNodesSelected: EventEmitter<IncidentClusterNodeDto[]> = new EventEmitter<IncidentClusterNodeDto[]>();

  @Output()
  public onNodeAction: EventEmitter<{ action: string, nodes: IncidentClusterNodeDto[] }> = new EventEmitter<{ action: string, nodes: IncidentClusterNodeDto[] }>();


  public incident: IncidentDto;
  @ViewChild('diagramDiv', {static: false})
  private diagramRef: ElementRef;
  private diagram: go.Diagram;
  public pageIdx = 0;
  public pageSize = 10;
  public isLoading = false;
  private unsubscribe$ = new Subject<void>();
  private shouldSaveAnnotation = false;

  @ViewChild('ctxMenu', {static: false})
  private ctxMenuRef: ElementRef;


  constructor(private incidentApiService: IncidentApiService, private http: HttpClient, private userService: UserService) {
  }

  ngOnInit() {
    interval(1000)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(d => this.incident && this.diagram && this.shouldSaveAnnotation)
      ).subscribe(
      data => {
        this.saveAnnotationModel();
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incidentId) {
      if (changes.incidentId.currentValue) {
        this.reload();
      }
    }

  }

  public saveAnnotationModel() {
    const fullModel = JSON.parse(this.diagram.model.toJson());
    const data = {
      nodeDataArray: fullModel.nodeDataArray.filter(n => n.category === 'Annotation'),
      linkDataArray: fullModel.linkDataArray.filter(l => l.category === 'Annotation')
    };
    const body = {
      json: JSON.stringify(data)
    };
    this.http.patch(environment.baseApiUrl + '/api/incident/' + this.incident.id + '/annotation', body, {
      headers: new HttpHeaders({'Authorization': "Bearer "+this.userService.token})
    })
      .subscribe((incident) => {
       console.log('Annotation saved');
      }, console.error, () => {
      });

  }

  public updateCluster(clusterId: string, incidentCluster: IncidentClusterDto) {
    const data = this.diagram.model.findNodeDataForKey(clusterId);
    data.payload.incidentCluster = incidentCluster;
    this.diagram.model.setDataProperty(data, "headerText", incidentCluster.title);
    this.diagram.model.setDataProperty(data, "bodyText", incidentCluster.subtitle);
    this.diagram.model.setDataProperty(data, "headerFill", incidentCluster.fillColor);


  }

  reload() {
    this.incidentApiService.getIncidentUsingGET(this.incidentId).pipe(
      take(1)
    ).subscribe((incident) => {
      this.incident = incident;
      this.pageIdx = 0;
      this.reloadPage();
    }, console.error, () => {
    });
  }

  reloadPage() {
    this.isLoading = true;
    this.shouldSaveAnnotation = false;
    this.incidentApiService.getIncidentClusterGraphUsingGET(this.incidentId, this.pageIdx, this.pageSize)
      .pipe(
        take(1)
      ).subscribe((graph) => {
      this.render(graph.nodes, graph.edges.content);

      this.incidentApiService.listIncidentHolderUsingGET(this.incidentId)
        .pipe(
          take(1)
        ).subscribe(graph => {
        this.renderHolder(graph.nodes, graph.edges);
      });

      // render annotation
      const annotationJson = (this.incident as any).annotationJson;
      if(annotationJson) {
        const annotation = JSON.parse(annotationJson);
        const model = this.diagram.model as GraphLinksModel;
        model.addNodeDataCollection(annotation.nodeDataArray);
        model.addLinkDataCollection(annotation.linkDataArray);
      }
      this.shouldSaveAnnotation = true;
      this.isLoading = false;
    }, console.error, () => {
      this.isLoading = false;
    });

  }

  render(nodes: IncidentClusterNodeDto[], edges: IncidentClusterEdgeDto[]) {
    const $ = go.GraphObject.make;
    const maxTextLength = 12;
    if (!this.diagram) {
      this.initDiagram();
    }
    const model = this.diagram.model as GraphLinksModel;
    model.nodeDataArray = [];
    model.linkDataArray = [];
    const filteredNodes = nodes
      .filter(n => !model.findNodeDataForKey(n.clusterId));

    model.addNodeDataCollection(filteredNodes
      .map((node) => {
        return {
          key: node.clusterId,
          headerText: node.incidentCluster.title,
          headerFill: node.incidentCluster.fillColor,
          bodyText: node.incidentCluster.subtitle,
          footerFill: node.incidentCluster.isAddress ? COLORS[1][0] : COLORS[6][0],
          footerText: this.nodeFooterTextOf(node, maxTextLength),
          toolTipText: null,
          tags: node.tags ? node.tags.map(t => t.label) : [],
          payload: node,
          neighborPage: {
            pageIdx: -1,
            pageSize: 10,
            isLast: false,
          }
        }
          ;
      }));

    model.addLinkDataCollection(edges.map(edge => {
      const fromNode: IncidentClusterNodeDto = model.findNodeDataForKey(edge.fromClusterId).payload;
      return {
        from: edge.fromClusterId,
        to: edge.toClusterId,
        payload: edge,
        width: 4,
        text: `${new CcPipe().transform(edge.amount, fromNode.currency.unitRate).toFixed(3)} ${fromNode.currency.name.toUpperCase()}`,
      };
    }));

    // add tag nodes/links
    const nodesWithTags = filteredNodes
      .filter(n => n.tags && n.tags.length > 0);
    model.addNodeDataCollection(nodesWithTags.map(node => {
      return {
        key: "comment-" + node.clusterId,
        text: node.tags.map(t => t.label).join(", "),
        category: "Comment"
      }
    }));
    model.addLinkDataCollection(nodesWithTags.map((node => {
      return {
        from: "comment-" + node.clusterId,
        to: node.clusterId,
        category: "Comment"
      };
    })));

  }

  renderHolder(nodes: IncidentHolderNode[], edges: IncidentHolderEdge[]) {
    const model = this.diagram.model as GraphLinksModel;
    model.addNodeDataCollection(nodes.map(node => {
      return {
        key: "holder-" + node.holder.id,
        legalName: node.holder.legalName,
        level: node.holder.level,
        nationality: node.holder.nationality,
        avatarUrl: "/assets/img/man.png",
        payload: node,
        category: "Holder"
      }
    }));
    model.addLinkDataCollection(edges.map((edge => {
      return {
        from: "holder-" + edge.holderId,
        to: edge.clusterId,
        category: "Holder"
      };
    })));
  }


  initDiagram() {


    go.Shape.defineFigureGenerator('RoundedTopRectangle', function (shape: go.Shape, w: number, h: number) {
      // this figure takes one parameter, the size of the corner
      let p1 = 5;  // default corner size
      if (shape !== null) {
        const param1 = shape.parameter1;
        if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
      }
      p1 = Math.min(p1, w / 2);
      p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
      const geo = new go.Geometry();
      // a single figure consisting of straight lines and quarter-circle arcs
      geo.add(new go.PathFigure(0, p1)
        .add(new go.PathSegment(go.PathSegment.Arc, 180, 90, p1, p1, p1, p1))
        .add(new go.PathSegment(go.PathSegment.Line, w - p1, 0))
        .add(new go.PathSegment(go.PathSegment.Arc, 270, 90, w - p1, p1, p1, p1))
        .add(new go.PathSegment(go.PathSegment.Line, w, h))
        .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
      // don't intersect with two top corners when used in an "Auto" Panel
      geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0.3 * p1);
      geo.spot2 = new go.Spot(1, 1, -0.3 * p1, 0);
      return geo;
    });

    go.Shape.defineFigureGenerator('RoundedBottomRectangle', function (shape: go.Shape, w: number, h: number) {
      // this figure takes one parameter, the size of the corner
      let p1 = 5;  // default corner size
      if (shape !== null) {
        const param1 = shape.parameter1;
        if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
      }
      p1 = Math.min(p1, w / 2);
      p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
      const geo = new go.Geometry();
      // a single figure consisting of straight lines and quarter-circle arcs
      geo.add(new go.PathFigure(0, 0)
        .add(new go.PathSegment(go.PathSegment.Line, w, 0))
        .add(new go.PathSegment(go.PathSegment.Line, w, h - p1))
        .add(new go.PathSegment(go.PathSegment.Arc, 0, 90, w - p1, h - p1, p1, p1))
        .add(new go.PathSegment(go.PathSegment.Line, p1, h))
        .add(new go.PathSegment(go.PathSegment.Arc, 90, 90, p1, h - p1, p1, p1).close()));
      // don't intersect with two bottom corners when used in an "Auto" Panel
      geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0);
      geo.spot2 = new go.Spot(1, 1, -0.3 * p1, -0.3 * p1);
      return geo;
    });
    const $ = go.GraphObject.make;


    this.diagram = $(go.Diagram, this.diagramRef.nativeElement, // the ID of the DIV HTML element
      {
        grid: $(go.Panel, "Grid",  // a simple 10x10 grid
          $(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
          $(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5})
        ),
        "draggingTool.isGridSnapEnabled": true,
        initialAutoScale: go.Diagram.UniformToFill,
        handlesDragDropForTopLevelParts: true,
        'animationManager.isEnabled': false,
        mouseDrop: (e) => {
          // when the selection is dropped in the diagram's background,
          // make sure the selected Parts no longer belong to any Group
          var ok = e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
          if (!ok) e.diagram.currentTool.doCancel();
        },
        // commandHandler: $((window as any).DrawCommandHandler),  // support offset copy-and-paste
        "clickCreatingTool.archetypeNodeData": {
          category: "Annotation",
          text: "NEW Annotation"
        },  // create a new node by double-clicking in background
        "PartCreated": (e: DiagramEvent) => {
          const node = e.subject;  // the newly inserted Node -- now need to snap its location to the grid
          node.location = node.location.copy().snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize);
          setTimeout(() => {  // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock();
          }, 20);
        },
        "LinkDrawn": (e: DiagramEvent) => {
          const link = e.subject as Link;
          // if (link.fromNode.category === 'Annotation' || link.toNode.category === 'Annotation') {
          //
          // }
          if (!link.category) {
            link.category = 'Annotation';

            this.diagram.model.setDataProperty(link.data, "text", "New Link");
            link.invalidateRoute();
          }
        },
        "commandHandler.archetypeGroupData": {isGroup: true, text: "NEW GROUP"},
        "SelectionGrouped": (e) => {
          const group = e.subject;
          setTimeout(() => {  // and have the user start editing its text
            e.diagram.commandHandler.editTextBlock();
          })
        },
        "LinkRelinked": (e) => {
          // re-spread the connections of other links connected with both old and new nodes
          const oldnode = e.parameter.part;
          oldnode.invalidateConnectedLinks();
          const link = e.subject;
          if (e.diagram.toolManager.linkingTool.isForwards) {
            link.toNode.invalidateConnectedLinks();
          } else {
            link.fromNode.invalidateConnectedLinks();
          }
        },
        "undoManager.isEnabled": true,
        layout: $(go.LayeredDigraphLayout, {
          layerSpacing: 100
        }),
        ObjectDoubleClicked: (e) => {
          const subject = e.subject as GraphObject;
          if (subject.part instanceof go.Node) {
            const node = subject.part as go.Node;

          }
        }
        // ChangedSelection: (e) => {
        //   console.log("select", e)
        //   const firstSel = e.diagram.selection.first();
        //   if (firstSel) {
        //     e.diagram.centerRect(firstSel.actualBounds);
        //   }
        //   this.onNodesSelected.emit(e.diagram.selection.map(n => n.data.payload).toArray());
        // }
      });

    this.diagram.allowRelink = false;


    const makeArrowButton = (spot, fig) => {
      var maker = function (e, shape) {
        e.handled = true;
        e.diagram.model.commit(function (m) {
          var selnode = shape.part.adornedPart;
          // create a new node in the direction of the spot
          var p = new go.Point().setRectSpot(selnode.actualBounds, spot);
          p.subtract(selnode.location);
          p.scale(2, 2);
          p.x += Math.sign(p.x) * 60;
          p.y += Math.sign(p.y) * 60;
          p.add(selnode.location);
          p.snapToGridPoint(e.diagram.grid.gridOrigin, e.diagram.grid.gridCellSize);
          // make the new node a copy of the selected node
          var nodedata = m.copyNodeData(selnode.data);
          // add to same group as selected node
          m.setGroupKeyForNodeData(nodedata, m.getGroupKeyForNodeData(selnode.data));
          m.addNodeData(nodedata);  // add to model
          // create a link from the selected node to the new node
          var linkdata = {from: selnode.key, to: m.getKeyForNodeData(nodedata), category: "Annotation"};
          m.addLinkData(linkdata);  // add to model
          // move the new node to the computed location, select it, and start to edit it
          var newnode = e.diagram.findNodeForData(nodedata);
          newnode.location = p;
          e.diagram.select(newnode);
          setTimeout(function () {
            e.diagram.commandHandler.editTextBlock();
          }, 20);
        });
      };
      return $(go.Shape,
        {
          figure: fig,
          alignment: spot, alignmentFocus: spot.opposite(),
          width: (spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom)) ? 36 : 18,
          height: (spot.equals(go.Spot.Top) || spot.equals(go.Spot.Bottom)) ? 18 : 36,
          fill: "orange", strokeWidth: 0,
          isActionable: true,  // needed because it's in an Adornment
          click: maker, contextClick: maker
        });
    }
    const CMButton = (options) => {
      return $(go.Shape,
        {
          fill: "orange", stroke: "gray", background: "transparent",
          geometryString: "F1 M0 0 M0 4h4v4h-4z M6 4h4v4h-4z M12 4h4v4h-4z M0 12",
          isActionable: true, cursor: "context-menu",
          click: function (e, shape) {
            e.diagram.commandHandler.showContextMenu(shape.part.adornments[0]);
          }
        },
        options || {});
    }
    const makeAdornmentPathPattern = (w) => {
      return $(go.Shape,
        {
          stroke: "dodgerblue", strokeWidth: 2, strokeCap: "square",
          geometryString: "M0 0 M4 2 H3 M4 " + (w + 4).toString() + " H3"
        });
    }

    const hideCX = () => {
      if (this.diagram.currentTool instanceof go.ContextMenuTool) {
        this.diagram.currentTool.doCancel();
      }
    }
    const ctxMenu = $(go.HTMLInfo, {
      show: () => {

        // Now show the whole context menu element
        this.ctxMenuRef.nativeElement.classList.add("show-menu");

        // we don't bother overriding positionContextMenu, we just do it here:
        const mousePt = this.diagram.lastInput.viewPoint;
        this.ctxMenuRef.nativeElement.style.left = mousePt.x + 5 + "px";
        this.ctxMenuRef.nativeElement.style.top = mousePt.y + "px";
        window.addEventListener("click", hideCX, true);
      },
      hide: () => {
        this.ctxMenuRef.nativeElement.classList.remove("show-menu");

        // Optional: Use a `window` click listener with event capture to
        //           remove the context menu if the user clicks elsewhere on the page
        window.removeEventListener("click", hideCX, true);
      }
    });

    this.ctxMenuRef.nativeElement.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      return false;
    }, false);

    // define the Node template
    // this.diagram.nodeTemplate = $(go.Node, "Auto",
    //   {contextMenu: ctxMenu},
    //   $(go.Shape, "RoundedRectangle",
    //     // Shape.fill is bound to Node.data.color
    //     new go.Binding("fill", "color")),
    //   $(go.TextBlock,
    //     {margin: 3},  // some room around the text
    //     // TextBlock.text is bound to Node.data.text
    //     new go.Binding("text", "text"),
    //     new go.Binding("stroke", "textColor"),
    //   ),
    // );

    this.diagram.nodeTemplate = $(go.Node, "Vertical",
      {
        contextMenu: ctxMenu,
        defaultStretch: go.GraphObject.Horizontal
      },
      {
        locationSpot: go.Spot.Center,
        locationObjectName: "SHAPE",
        fromSpot: go.Spot.RightSide,
        toSpot: go.Spot.LeftSide,
        fromLinkable: true, toLinkable: true,
      },
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedTopRectangle",
          {},
          new go.Binding("fill", "headerFill")),
        $(go.TextBlock,
          {stroke: "white", margin: new go.Margin(2, 2, 0, 2), textAlign: "center"},
          new go.Binding("text", "headerText"))
      ),
      $(go.Panel, "Auto",
        {minSize: new go.Size(NaN, 70)},
        $(go.Shape, "Rectangle", {fill: "white"}),
        $(go.TextBlock,
          {width: 120},
          {margin: new go.Margin(2, 2, 0, 2), textAlign: "center"},
          new go.Binding("text", "bodyText"))
      ),
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedBottomRectangle",
          {fill: "white"},
          new go.Binding("fill", "footerFill")),
        $(go.TextBlock,
          {margin: new go.Margin(2, 2, 0, 2), textAlign: "center", stroke: "#ffffff"},
          new go.Binding("text", "footerText"))
      )
    );

    // define annotation context menu buttons
    // A button-defining helper function that returns a click event handler.
    // PROPNAME is the name of the data property that should be set to the given VALUE.
    const ClickFunction = (propname, value) => {
      return function (e, obj) {
        e.handled = true;  // don't let the click bubble up
        e.diagram.model.commit(function (m) {
          m.set(obj.part.adornedPart.data, propname, value);
        });
      };
    }

    // Create a context menu button for setting a data property with a color value.
    const ColorButton = (color, propname?) => {
      if (!propname) propname = "color";
      return $(go.Shape,
        {
          width: 16, height: 16, stroke: "lightgray", fill: color,
          margin: 1, background: "transparent",
          mouseEnter: (e, shape) => {
            (shape as Shape).stroke = "dodgerblue";
          },
          mouseLeave: (e, shape) => {
            (shape as Shape).stroke = "lightgray";
          },
          click: ClickFunction(propname, color), contextClick: ClickFunction(propname, color)
        });
    }

    const LightFillButtons = () => {  // used by multiple context menus
      return [
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            ColorButton("white", "fill"), ColorButton("beige", "fill"), ColorButton("aliceblue", "fill"), ColorButton("lightyellow", "fill")
          )
        ),
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            ColorButton("lightgray", "fill"), ColorButton("lightgreen", "fill"), ColorButton("lightblue", "fill"), ColorButton("pink", "fill")
          )
        )
      ];
    }

    const DarkColorButtons = () => {  // used by multiple context menus
      return [
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            ColorButton("black"), ColorButton("green"), ColorButton("blue"), ColorButton("red")
          )
        ),
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            ColorButton("brown"), ColorButton("magenta"), ColorButton("purple"), ColorButton("orange")
          )
        )
      ];
    }

    // Create a context menu button for setting a data property with a stroke width value.
    const ThicknessButton = (sw, propname?) => {
      if (!propname) propname = "thickness";
      return $(go.Shape, "LineH",
        {
          width: 16, height: 16, strokeWidth: sw,
          margin: 1, background: "transparent",
          mouseEnter: function (e, shape) {
            shape.background = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            shape.background = "transparent";
          },
          click: ClickFunction(propname, sw), contextClick: ClickFunction(propname, sw)
        });
    }

    // Create a context menu button for setting a data property with a stroke dash Array value.
    const DashButton = (dash, propname?) => {
      if (!propname) propname = "dash";
      return $(go.Shape, "LineH",
        {
          width: 24, height: 16, strokeWidth: 2,
          strokeDashArray: dash,
          margin: 1, background: "transparent",
          mouseEnter: function (e, shape) {
            shape.background = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            shape.background = "transparent";
          },
          click: ClickFunction(propname, dash), contextClick: ClickFunction(propname, dash)
        });
    }

    const StrokeOptionsButtons = () => {  // used by multiple context menus
      return [
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            ThicknessButton(1), ThicknessButton(2), ThicknessButton(3), ThicknessButton(4)
          )
        ),
        $("ContextMenuButton",
          $(go.Panel, "Horizontal",
            DashButton(null), DashButton([2, 4]), DashButton([4, 4])
          )
        )
      ];
    }


    const FigureButton = (fig, propname?) => {
      if (!propname) propname = "figure";
      return $(go.Shape,
        {
          width: 32, height: 32, scale: 0.5, fill: "lightgray", figure: fig,
          margin: 1, background: "transparent",
          mouseEnter: function (e, shape) {
            (shape as Shape).fill = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            (shape as Shape).fill = "lightgray";
          },
          click: ClickFunction(propname, fig), contextClick: ClickFunction(propname, fig)
        });
    }


    const ArrowButton = (num) => {
      var geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5";
      if (num === 0) {
        geo = "M0 0 M16 16 M0 8 L16 8";
      } else if (num === 2) {
        geo = "M0 0 M16 16 M0 8 L16 8  M12 11 L16 8 L12 5  M4 11 L0 8 L4 5";
      }
      return $(go.Shape,
        {
          geometryString: geo,
          margin: 2, background: "transparent",
          mouseEnter: function (e, shape) {
            shape.background = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            shape.background = "transparent";
          },
          click: ClickFunction("dir", num), contextClick: ClickFunction("dir", num)
        });
    }

    const AllSidesButton = (to) => {
      var setter = function (e, shape) {
        e.handled = true;
        e.diagram.model.commit(function (m) {
          var link = shape.part.adornedPart;
          m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(go.Spot.AllSides));
          // re-spread the connections of other links connected with the node
          (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
        });
      };
      return $(go.Shape,
        {
          width: 12, height: 12, fill: "transparent",
          mouseEnter: function (e, shape) {
            shape.background = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            shape.background = "transparent";
          },
          click: setter, contextClick: setter
        });
    }

    const SpotButton = (spot, to) => {
      var ang = 0;
      var side = go.Spot.RightSide;
      if (spot.equals(go.Spot.Top)) {
        ang = 270;
        side = go.Spot.TopSide;
      } else if (spot.equals(go.Spot.Left)) {
        ang = 180;
        side = go.Spot.LeftSide;
      } else if (spot.equals(go.Spot.Bottom)) {
        ang = 90;
        side = go.Spot.BottomSide;
      }
      if (!to) ang -= 180;
      var setter = function (e, shape) {
        e.handled = true;
        e.diagram.model.commit(function (m) {
          var link = shape.part.adornedPart;
          m.set(link.data, (to ? "toSpot" : "fromSpot"), go.Spot.stringify(side));
          // re-spread the connections of other links connected with the node
          (to ? link.toNode : link.fromNode).invalidateConnectedLinks();
        });
      };
      return $(go.Shape,
        {
          alignment: spot, alignmentFocus: spot.opposite(),
          geometryString: "M0 0 M12 12 M12 6 L1 6 L4 4 M1 6 L4 8",
          angle: ang,
          background: "transparent",
          mouseEnter: function (e, shape) {
            shape.background = "dodgerblue";
          },
          mouseLeave: function (e, shape) {
            shape.background = "transparent";
          },
          click: setter, contextClick: setter
        });
    }


    this.diagram.linkTemplate =
      $("Link",
        $("Shape",
          {strokeWidth: 1.5}),
        $("Shape",
          {toArrow: "Standard", stroke: null}),
        $(go.Panel, "Auto",
          $(go.Shape,  // the label background, which becomes transparent around the edges
            {
              fill: $(go.Brush, "Radial",
                {0: "rgb(245, 245, 245)", 0.7: "rgb(245, 245, 245)", 1: "rgba(245, 245, 245, 0)"}),
              stroke: null
            }),
          $(go.TextBlock, "transition",  // the label text
            {},
            // editing the text automatically updates the model data
            new go.Binding("text", "text"))
        )
      );

    // define comment template
    this.diagram.nodeTemplateMap.add("Comment",
      $(go.Node,  // this needs to act as a rectangular shape for BalloonLink,
        {background: "transparent"},  // which can be accomplished by setting the background.
        $(go.TextBlock,
          {stroke: "brown", margin: 3},
          new go.Binding("text", "text"))
      ));
    this.diagram.linkTemplateMap.add("Comment",
      // if the BalloonLink class has been loaded from the Extensions directory, use it
      $(go.Link,
        $(go.Shape,  // the Shape.geometry will be computed to surround the comment node and
          // point all the way to the commented node
          {stroke: "brown", strokeWidth: 1, fill: "lightyellow"})
      ));

    // define holder template
    function textStyle() {
      return {font: "9pt  Segoe UI,sans-serif", stroke: "white"};
    }

    this.diagram.nodeTemplateMap.add("Holder",
      $(go.Node, "Auto",
        {
          resizable: true,
          resizeCellSize: new go.Size(20, 20)
        },
        {},
        new go.Binding("text", "name"),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        // define the node's outer shape
        $(go.Shape, "Rectangle",
          {
            name: "SHAPE", fill: COLORS[4][0], stroke: COLORS[4][1],
            // set the port properties:
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
          }),
        $(go.Panel, "Horizontal",
          $(go.Picture,
            {
              name: "Picture",
              desiredSize: new go.Size(40, 40),
              margin: new go.Margin(6, 8, 6, 10),
            },
            new go.Binding("source", "avatarUrl")),
          // define the panel where the text will appear
          $(go.Panel, "Table",
            {
              maxSize: new go.Size(150, 999),
              margin: new go.Margin(6, 10, 0, 3),
              defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, {column: 2, width: 4}),
            $(go.TextBlock, textStyle(),  // the name
              {
                name: "NAMETB",
                row: 0, column: 0, columnSpan: 5,
                font: "12pt Segoe UI,sans-serif",
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding("text", "legalName").makeTwoWay()),
            $(go.TextBlock, "Risk: ", textStyle(), {row: 1, column: 0}),
            $(go.TextBlock, textStyle(),
              {
                row: 1, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "level").makeTwoWay()),
            $(go.TextBlock, "Nationality: ", textStyle(), {row: 2, column: 0}),
            $(go.TextBlock, textStyle(),
              {
                row: 2, column: 1, columnSpan: 4,
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 14),
                margin: new go.Margin(0, 0, 0, 3)
              },
              new go.Binding("text", "nationality").makeTwoWay()),
          )  // end Table Panel
        ) // end Horizontal Panel
      ));
    this.diagram.linkTemplateMap.add("Holder",
      $(go.Link, go.Link.Orthogonal,
        {corner: 5},
        $(go.Shape, {strokeWidth: 4, stroke: "#00a4a4"})));

    // define annotation template
    const selectionAdornment = $(go.Adornment, "Spot",
      $(go.Placeholder, {padding: 10}),
      makeArrowButton(go.Spot.Top, "TriangleUp"),
      makeArrowButton(go.Spot.Left, "TriangleLeft"),
      makeArrowButton(go.Spot.Right, "TriangleRight"),
      makeArrowButton(go.Spot.Bottom, "TriangleDown"),
      CMButton({alignment: new go.Spot(0.75, 0)})
    );
    this.diagram.nodeTemplateMap.add("Annotation",
      $(go.Node, "Auto",
        {
          locationSpot: go.Spot.Center, locationObjectName: "SHAPE",
          desiredSize: new go.Size(120, 60), minSize: new go.Size(40, 40),
          resizable: true, resizeCellSize: new go.Size(20, 20),
          selectionAdornmentTemplate: selectionAdornment,
          contextMenu: $("ContextMenu",
            $("ContextMenuButton",
              $(go.Panel, "Horizontal",
                FigureButton("Rectangle"), FigureButton("RoundedRectangle"), FigureButton("Ellipse"), FigureButton("Diamond")
              )
            ),
            LightFillButtons(),
            DarkColorButtons(),
            StrokeOptionsButtons()
          )
        },
        // these Bindings are TwoWay because the DraggingTool and ResizingTool modify the target properties
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $(go.Shape,
          { // the border
            name: "SHAPE", fill: "white",
            portId: "", cursor: "pointer",
            fromLinkable: true, toLinkable: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true,
            fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides
          },
          new go.Binding("figure"),
          new go.Binding("fill"),
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")),
        // this Shape prevents mouse events from reaching the middle of the port
        $(go.Shape, {width: 100, height: 40, strokeWidth: 0, fill: "transparent"}),
        $(go.TextBlock,
          {margin: 1, textAlign: "center", overflow: go.TextBlock.OverflowEllipsis, editable: true},
          // this Binding is TwoWay due to the user editing the text with the TextEditingTool
          new go.Binding("text").makeTwoWay(),
          new go.Binding("stroke", "color"))
      ),
    );
    this.diagram.linkTemplateMap.add("Annotation",
      $(go.Link,
        {
          layerName: "Foreground",
          routing: go.Link.AvoidsNodes, corner: 10,
          toShortLength: 4,  // assume arrowhead at "to" end, need to avoid bad appearance when path is thick
          relinkableFrom: true, relinkableTo: true,
          reshapable: true, resegmentable: true,
          selectionAdornmentTemplate: $(go.Adornment,  // use a special selection Adornment that does not obscure the link path itself
            $(go.Shape,
              { // this uses a pathPattern with a gap in it, in order to avoid drawing on top of the link path Shape
                isPanelMain: true,
                stroke: "transparent", strokeWidth: 6,
                pathPattern: makeAdornmentPathPattern(2)  // == thickness or strokeWidth
              },
              new go.Binding("pathPattern", "thickness", makeAdornmentPathPattern)),
            CMButton({alignmentFocus: new go.Spot(0, 0, -6, -4)})
          ),
          contextMenu: $("ContextMenu",
            DarkColorButtons(),
            StrokeOptionsButtons(),
            $("ContextMenuButton",
              $(go.Panel, "Horizontal",
                ArrowButton(0), ArrowButton(1), ArrowButton(2)
              )
            ),
            $("ContextMenuButton",
              $(go.Panel, "Horizontal",
                $(go.Panel, "Spot",
                  AllSidesButton(false),
                  SpotButton(go.Spot.Top, false), SpotButton(go.Spot.Left, false), SpotButton(go.Spot.Right, false), SpotButton(go.Spot.Bottom, false)
                ),
                $(go.Panel, "Spot",
                  {margin: new go.Margin(0, 0, 0, 2)},
                  AllSidesButton(true),
                  SpotButton(go.Spot.Top, true), SpotButton(go.Spot.Left, true), SpotButton(go.Spot.Right, true), SpotButton(go.Spot.Bottom, true)
                )
              )
            )
          )
        },
        new go.Binding("fromSpot", "fromSpot", go.Spot.parse),
        new go.Binding("toSpot", "toSpot", go.Spot.parse),
        new go.Binding("fromShortLength", "dir", function (dir) {
          return dir === 2 ? 4 : 0;
        }),
        new go.Binding("toShortLength", "dir", function (dir) {
          return dir >= 1 ? 4 : 0;
        }),
        new go.Binding("points").makeTwoWay(),  // TwoWay due to user reshaping with LinkReshapingTool
        $(go.Shape, {strokeWidth: 2},
          new go.Binding("stroke", "color"),
          new go.Binding("strokeWidth", "thickness"),
          new go.Binding("strokeDashArray", "dash")),
        $(go.Shape, {fromArrow: "Backward", strokeWidth: 0, scale: 4 / 3, visible: false},
          new go.Binding("visible", "dir", function (dir) {
            return dir === 2;
          }),
          new go.Binding("fill", "color"),
          new go.Binding("scale", "thickness", function (t) {
            return (2 + t) / 3;
          })),
        $(go.Shape, {toArrow: "Standard", strokeWidth: 0, scale: 4 / 3},
          new go.Binding("visible", "dir", function (dir) {
            return dir >= 1;
          }),
          new go.Binding("fill", "color"),
          new go.Binding("scale", "thickness", function (t) {
            return (2 + t) / 3;
          })),
        $(go.TextBlock,
          {alignmentFocus: new go.Spot(0, 1, -4, 0), editable: true},
          new go.Binding("text").makeTwoWay(),  // TwoWay due to user editing with TextEditingTool
          new go.Binding("stroke", "color"))
      )
    );

    const data = {
      class: 'go.GraphLinksModel',
      nodeDataArray: [],
      linkDataArray: [],
    };

    this.diagram.model = go.Model.fromJson(data);

  }

  onNodeActionClick(actionName: string) {
    this.onNodeAction.emit({action: actionName, nodes: this.diagram.selection.toArray().map(n => n.data.payload)});
  }

  nodeFooterTextOf(node: IncidentClusterNodeDto, maxTextLength: number): string {

    if (node.incidentCluster.isAddress) {
      const address = node.addresses[0].length > maxTextLength ? node.addresses[0].substr(0, 4) + '...' + node.addresses[0].substr(node.addresses[0].length - 4, 4) : node.addresses[0];
      return `Address ${address}`;

    }
    const cluster = node.clusterId.length > maxTextLength ? node.clusterId.substr(0, 4) + '...' + node.clusterId.substr(node.clusterId.length - 4, 4) : node.clusterId;
    return `Cluster  ${cluster}`;

  }


}
