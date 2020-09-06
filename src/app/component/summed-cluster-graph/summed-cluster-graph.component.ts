import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as go from "gojs";
import {SankeyLayout} from "../../shared/sankey-layout";
import {take} from "rxjs/operators";
import {CryptoPipe} from "../../pipes/crypto.pipe";
import {CcPipe} from "../../pipes/cc.pipe";
import {init} from "protractor/built/launcher";
import {
  AddressScanApiService,
  AddressScanDto,
  ClusterEdgeDto,
  ClusterGraphDto,
  ClusterNodeDto
} from '@profyu/unblock-ng-sdk';
import {GraphLinksModel, GraphObject} from "gojs";
import {Cluster} from "cluster";

export const textStyle = {font: 'bold 12pt Segoe UI, sans-serif', stroke: 'black', margin: new go.Margin(5, 5, 0, 5)}

export const COLORS = [
  ['#AC193D', '#BF1E4B'],
  ['#2672EC', '#2E8DEF'],
  ['#8C0095', '#A700AE'],
  ['#5133AB', '#643EBF'],
  ['#008299', '#00A0B1'],
  ['#D24726', '#DC572E'],
  ['#008A00', '#00A600'],
  ['#094AB2', '#0A5BC4']
];

@Component({
  selector: 'app-summed-cluster-graph',
  templateUrl: './summed-cluster-graph.component.html',
  styleUrls: ['./summed-cluster-graph.component.scss']
})
export class SummedClusterGraphComponent implements OnInit, OnChanges {

  @Input()
  public addressScanId: string;
  @Input()
  public nodeActions: Array<{ name: string, title: string }> = [];

  @Output()
  public onNodesSelected: EventEmitter<ClusterNodeDto[]> = new EventEmitter<ClusterNodeDto[]>();
  @Output()
  public onNodeAction: EventEmitter<{ action: string, node: ClusterNodeDto }> = new EventEmitter<{ action: string, node: ClusterNodeDto }>();


  public addressScan: AddressScanDto;
  @ViewChild('diagramDiv', {static: false})
  private diagramRef: ElementRef;
  private diagram: go.Diagram;
  public pageIdx = 0;
  public pageSize = 10;
  public isLoading = false;

  @ViewChild('ctxMenu', {static: false})
  private ctxMenuRef: ElementRef;


  constructor(private addressScanApiService: AddressScanApiService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.addressScanId) {
      if (changes.addressScanId.currentValue) {
        this.reload();
      }
    }

  }


  reload() {
    this.addressScanApiService.getAddressScanUsingGET(this.addressScanId).pipe(
      take(1)
    ).subscribe((scan) => {
      this.addressScan = scan;
      this.pageIdx = 0;
      this.reloadPage();
    }, console.error, () => {
    });
  }

  reloadPage() {
    this.isLoading = true;
    this.addressScanApiService.getAddressScanClusterGraphUsingGET(this.addressScan.id, this.pageIdx, this.pageSize)
      .pipe(
        take(1)
      ).subscribe((graph) => {
      this.render(graph.nodes, graph.edges.content);
      this.isLoading = false;
    }, console.error, () => {
      this.isLoading = false;
    });
  }

  render(nodes: ClusterNodeDto[], edges: ClusterEdgeDto[]) {
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
        const isRoot = node.addresses.indexOf(this.addressScan.address) != -1;
        return {
          key: node.clusterId,
          color: isRoot ? COLORS[4][0] : COLORS[3][0],
          text: node.clusterId.length > maxTextLength ? node.clusterId.substr(0, 4) + '...' + node.clusterId.substr(node.clusterId.length - 4, 4) : node.clusterId,
          textColor: '#ffffff',
          toolTipText: null,
          tags: node.tags.map(t => t.tag),
          payload: node,
          neighborPage: {
            pageIdx: 0,
            pageSize: 10,
            isLast: false,
          }
        };
      }));

    model.addLinkDataCollection(edges.map(edge => {
      return {
        from: edge.fromClusterId,
        to: edge.toClusterId,
        payload: edge,
        width: 4,
        text: `${new CcPipe().transform(edge.amount, this.addressScan.currency.unitRate)} ${this.addressScan.currency.name.toUpperCase()}`,
      };
    }));

    // add comment nodes/links
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

  copyToClipboard(str) {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }
  };


  initDiagram() {
    const $ = go.GraphObject.make;
    this.diagram = $(go.Diagram, this.diagramRef.nativeElement, // the ID of the DIV HTML element
      {
        initialAutoScale: go.Diagram.UniformToFill,
        'animationManager.isEnabled': false,
        layout: $(go.LayeredDigraphLayout),
        ObjectDoubleClicked: (e) => {
          const subject = e.subject as GraphObject;
          if (subject.part instanceof go.Node) {
            const node = subject.part as go.Node;
            if (!node.data.neighborPage.isLast) {
              this.loadNeighbor(node.data.payload,
                node.data.neighborPage.pageIdx,
                node.data.neighborPage.pageSize,
                (isLast) => {
                  node.data.neighborPage.isLast = isLast;
                });
            }

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
    this.diagram.nodeTemplate = $(go.Node, "Auto",
      {contextMenu: ctxMenu},
      $(go.Shape, "RoundedRectangle",
        // Shape.fill is bound to Node.data.color
        new go.Binding("fill", "color")),
      $(go.TextBlock,
        {margin: 3},  // some room around the text
        // TextBlock.text is bound to Node.data.text
        new go.Binding("text", "text"),
        new go.Binding("stroke", "textColor"),
      ),
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
          {toArrow: "Standard", stroke: null})
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


    const data = {
      class: 'go.GraphLinksModel',
      nodeDataArray: [],
      linkDataArray: [],
    };

    this.diagram.model = go.Model.fromJson(data);

  }

  onNodeActionClick(actionName: string) {
    const data = this.diagram.selection.first().data.payload;
    this.onNodeAction.emit({action: actionName, node: data});
  }

  loadNeighbor(node: ClusterNodeDto, pageIdx: number, pageSize: number, isLastUpdater: (isLast: boolean) => void) {
    this.isLoading = true;
    this.addressScanApiService.getAddressScanClusterGraphNeighborUsingGET(this.addressScanId, pageIdx, pageSize, [node.clusterId])
      .pipe(
        take(1)
      ).subscribe((graph) => {
      this.render(graph.nodes, graph.edges.content);
      isLastUpdater(graph.edges.last)
      this.isLoading = false;
    }, console.error, () => {
      this.isLoading = false;
    });
  }
}
