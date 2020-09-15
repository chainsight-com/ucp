import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {
  AddressScanApiService,
  AddressScanDto,
  ClusterEdgeDto,
  ClusterNodeDto, IncidentApiService, IncidentClusterDto, IncidentClusterEdgeDto,
  IncidentClusterNodeDto, IncidentDto, IncidentHolderEdge, IncidentHolderNode
} from "@profyu/unblock-ng-sdk";
import * as go from "gojs";
import {take} from "rxjs/operators";
import {GraphLinksModel, GraphObject} from "gojs";
import {CcPipe} from "../../pipes/cc.pipe";

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

  @ViewChild('ctxMenu', {static: false})
  private ctxMenuRef: ElementRef;


  constructor(private incidentApiService: IncidentApiService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.incidentId) {
      if (changes.incidentId.currentValue) {
        this.reload();
      }
    }

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
    const filteredNodes = nodes
      .filter(n => !model.findNodeDataForKey(n.clusterId));

    model.addNodeDataCollection(filteredNodes
      .map((node) => {
        return {
          key: node.clusterId,
          headerText: node.incidentCluster.title,
          headerFill: node.incidentCluster.fillColor,
          bodyText: node.incidentCluster.subtitle,
          footerFill: COLORS[1][0],
          footerText: this.nodeFooterTextOf(node, maxTextLength),
          toolTipText: null,
          tags: node.tags.map(t => t.tag),
          payload: node,
          neighborPage: {
            pageIdx: 0,
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
        text: node.tags.map(t => t.tag).join(", "),
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
        initialAutoScale: go.Diagram.UniformToFill,
        'animationManager.isEnabled': false,
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
      {fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide},
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedTopRectangle",
          {},
          new go.Binding("fill", "headerFill")),
        $(go.TextBlock,
          {stroke: "white" ,margin: new go.Margin(2, 2, 0, 2), textAlign: "center"},
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


    // define the Link template
    const linkSelectionAdornmentTemplate =
      $(go.Adornment, 'Link',
        $(go.Shape,
          {
            isPanelMain: true,
            fill: null,
            stroke: 'rgba(0, 0, 255, 0.3)',
            strokeWidth: 0
          })
      );

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
        {},
        {},
        new go.Binding("text", "name"),
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
