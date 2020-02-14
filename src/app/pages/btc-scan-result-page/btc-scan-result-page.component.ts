import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, pipe } from 'rxjs';
import { takeUntil, take, mergeMap } from 'rxjs/operators';
import {
  BtcAddressScanPipeline,
  BtcAddressScanPipelineApiService,
  BtcFlowAddressTaintJobApiService,
  BtcFlowAddressTaintJobResultPage,
  BtcFlowRiskGraphJobApiService,
  BtcFlowRiskGraph,
  BtcFlowRiskWitnessPage
} from '@profyu/unblock-ng-sdk';
import * as go from 'gojs';

import { SankeyLayout } from '../../shared/sankey-layout';
import { CryptoPipe } from 'src/app/pipes/crypto.pipe';

import * as moment from 'moment';

@Component({
  selector: 'app-btc-scan-result-page',
  templateUrl: './btc-scan-result-page.component.html',
  styleUrls: ['./btc-scan-result-page.component.scss']
})
export class BtcScanResultPageComponent implements OnInit, OnDestroy {


  public isLoadingPipeline = false;
  public pipeline: BtcAddressScanPipeline = {};

  // witness
  public isWitnessLoading = false;
  public witnessPageNo = 0;
  public witnessPageSize = 500;
  public witnessResultPage: BtcFlowRiskWitnessPage = {
    hasNextPage: false,
    records: [],
  };

  // taint
  public isAddressTaintJobLoading = false;
  public addressTaintJobResultPageNo = 0;
  public addressTaintJobResultPageSize = 30;
  public addressTaintJobResultPage: BtcFlowAddressTaintJobResultPage = {
    hasNextPage: false,
    records: [],
  };



  public btcFlowRiskGraph: BtcFlowRiskGraph = {};

  public witnessSummary = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    normal: 0,
  };

  public maxDays = 1;
  public dateRange = [0, 1];
  public dateRangeMarks = {};


  @ViewChild('flowDiagramDiv', { static: false })
  private flowDiagramRef: ElementRef;

  private diagram: go.Diagram;

  public isLoadingDiagram = false;


  private unsubscribe$ = new Subject<void>();
  myDiagram: go.Diagram;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService,
    private btcFlowAddressTaintJobApiService: BtcFlowAddressTaintJobApiService,
    private btcFlowRiskGraphJobApiService: BtcFlowRiskGraphJobApiService) {
  }


  flowTabSelected() {
    if (!this.myDiagram) {
      this.initDiagram();
    }

  }

  ngOnInit() {

    this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(params => {
        if (params.id) {
          this.reload(params.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  reload(id: number) {
    this.isLoadingPipeline = true;
    this.btcAddressScanPipelineApiService.getBtcAddressScanPipelineUsingGETDefault(id)
      .pipe(
        take(1)
      ).subscribe(pipeline => {
        this.pipeline = pipeline;
        this.maxDays = moment(this.pipeline.endingTime).diff(moment(this.pipeline.startingTime), 'days');
        this.dateRangeMarks = { 0: moment(this.pipeline.startingTime).format('YYYY-MM-DD') };
        this.dateRangeMarks[this.maxDays] = moment(this.pipeline.endingTime).format('YYYY-MM-DD');
        this.dateRange = [0, this.maxDays];
        this.reloadWitnessPage(true);
        this.reloadAddressTaintJobResultPage(true);
      }, console.error, () => {
        this.isLoadingPipeline = false;
      });
  }

  reloadAddressTaintJobResultPage(reset: boolean) {
    if (reset) {
      this.addressTaintJobResultPageNo = 1;
    }
    this.isAddressTaintJobLoading = false;
    this.btcAddressScanPipelineApiService.getAddressScanTaintTableUsingGETDefault(this.pipeline.id, this.addressTaintJobResultPageNo - 1, this.addressTaintJobResultPageSize)
      .pipe(
        take(1),
      ).subscribe(page => {
        this.addressTaintJobResultPage = page;
      }, console.error, () => {
        this.isAddressTaintJobLoading = false;
      });

  }

  reloadWitnessPage(reset: boolean) {
    if (reset) {
      this.witnessPageNo = 1;
    }
    this.isWitnessLoading = false;
    this.btcAddressScanPipelineApiService.getAddressScanWitnessUsingGETDefault(this.pipeline.id, this.witnessPageNo - 1, this.witnessPageSize)
      .pipe(
        take(1),
      ).subscribe(page => {
        this.witnessResultPage = page;
        this.witnessResultPage.records.forEach(r => {
          if (r.riskLevel === 5) {
            this.witnessSummary.critical += 1;
          } else if (r.riskLevel === 4) {
            this.witnessSummary.high += 1;
          } else if (r.riskLevel === 3) {
            this.witnessSummary.medium += 1;
          } else if (r.riskLevel === 2) {
            this.witnessSummary.low += 1;
          } else if (r.riskLevel === 1) {
            this.witnessSummary.normal += 1;
          }
        });
      }, console.error, () => {
        this.isWitnessLoading = false;
      });

  }

  initDiagram(tag?: string) {
    setTimeout(() => {
      this.isLoadingDiagram = true;
    });
    const startingTime = moment(this.pipeline.startingTime).local().add(this.dateRange[0], 'days').toDate();
    const endingTime = moment(this.pipeline.startingTime).local().add(this.dateRange[1], 'days').toDate();
    const address = this.pipeline.address;


    // const rootAddress = '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq';

    var colors = ['#AC193D/#BF1E4B', '#2672EC/#2E8DEF', '#8C0095/#A700AE', '#5133AB/#643EBF', '#008299/#00A0B1', '#D24726/#DC572E', '#008A00/#00A600', '#094AB2/#0A5BC4'];

    // this function provides a common style for the TextBlocks
    function textStyle() {
      return { font: 'bold 12pt Segoe UI, sans-serif', stroke: 'black', margin: new go.Margin(5, 5, 0, 5) };
    }


    const $ = go.GraphObject.make;  // for conciseness in defining templates


    if (!this.myDiagram) {
      this.myDiagram =
        $(go.Diagram, this.flowDiagramRef.nativeElement, // the ID of the DIV HTML element
          {
            initialAutoScale: go.Diagram.UniformToFill,
            'animationManager.isEnabled': false,
            layout: $(SankeyLayout,
              {
                setsPortSpots: false,  // to allow the "Side" spots on the nodes to take effect
                direction: 0,  // rightwards
                layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
                packOption: go.LayeredDigraphLayout.PackStraighten || go.LayeredDigraphLayout.PackMedian,
                layerSpacing: 150,  // lots of space between layers, for nicer thick links
                columnSpacing: 1
              }),
            ChangedSelection: (e) => {
              const sel = e.diagram.selection.first();
              if (sel) {
                e.diagram.centerRect(sel.actualBounds);
              }
            }
          });

      // define the Node template
      this.myDiagram.nodeTemplate =
        $(go.Node,
          go.Panel.Horizontal,
          {
            locationObjectName: 'SHAPE',
            locationSpot: go.Spot.MiddleLeft,
            portSpreading: go.Node.SpreadingPacked,  // rather than the default go.Node.SpreadingEvenly
            click: (e, node: go.Node) => {

              // highlight all Links and Nodes coming out of a given Node
              const diagram = node.diagram;
              diagram.startTransaction('highlight');
              // remove any previous highlighting
              diagram.clearHighlighteds();
              node.isHighlighted = true;
              // for each Link coming out of the Node, set Link.isHighlighted
              node.findLinksConnected().each(function (l) {
                l.isHighlighted = true;
              });
              // for each Node destination for the Node, set Node.isHighlighted
              node.findNodesConnected().each(function (n) {
                n.isHighlighted = true;
              });
              diagram.commitTransaction('highlight');
            }
          },
          $(go.TextBlock, textStyle(),
            { name: 'LTEXT' },
            new go.Binding('text', 'ltext'),
          ),
          $(go.Shape,
            {
              name: 'SHAPE',
              figure: 'Rectangle',
              fill: '#f89602',  // default fill color
              stroke: null,
              strokeWidth: 2,
              portId: '',
              fromSpot: go.Spot.RightSide,
              toSpot: go.Spot.LeftSide,
              height: 50,
              width: 20,
              toolTip: $('ToolTip',
                $(go.TextBlock, { margin: 4 },
                  new go.Binding('text', 'toolTipText'))
              )
            },

            new go.Binding('stroke', '', (n) => {
              if (n.isHighlighted) {
                return 'red';
              }
              return null;
            }).ofObject(),
            new go.Binding('strokeWidth', '', (n) => {
              return (n.data.key === this.pipeline.address || n.isHighlighted) ? 4 : 0;
            }).ofObject()
          ),
          $(go.Panel, 'Vertical',
            { defaultStretch: go.GraphObject.Horizontal },
            $(go.TextBlock, textStyle(),
              { name: 'TEXT' },
              new go.Binding('text'),
              new go.Binding('stroke', 'textColor')),
            $(go.TextBlock,
              {
                margin: new go.Margin(2, 0, 0, 5),
                stroke: 'red',
                font: 'bold 10pt Segoe UI, sans-serif'
              },
              new go.Binding('text', '', (n) => {
                if (n.isHighlighted && n.data.tags.length) {
                  return n.data.tags.join('\n');
                }
                return null;
              }).ofObject(),
              new go.Binding('visible', '', (n) => {
                return n.data.tags.length && n.isHighlighted;
              }).ofObject()
            )
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

      this.myDiagram.linkTemplate =
        $(go.Link, go.Link.Bezier,
          {
            selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
            layerName: 'Background',
            fromEndSegmentLength: 150, toEndSegmentLength: 150,
            adjusting: go.Link.End,
            click: (e, link: go.Link) => {

              // highlight all Links and Nodes coming out of a given Node
              const diagram = link.diagram;
              diagram.startTransaction('highlight');
              // remove any previous highlighting
              diagram.clearHighlighteds();
              link.isHighlighted = true;
              link.fromNode.isHighlighted = true;
              link.toNode.isHighlighted = true;
              diagram.commitTransaction('highlight');
            }
          },
          $(go.Shape, {
            strokeWidth: 4,
            stroke: 'rgba(173, 173, 173, 0.25)',
            toolTip:
              $('ToolTip',
                $(go.TextBlock, { margin: 4 },
                  new go.Binding('text', 'toolTipText'))
              )
          },
            new go.Binding('stroke', '', (l) => {
              if (l.isHighlighted) {
                return 'rgba(255,0,0,0.4)';
              }
              const nodeData = l.fromNode.data;
              const hex = nodeData.color;
              if (hex.charAt(0) === '#') {
                const rgb = parseInt(hex.substr(1, 6), 16);
                const r = rgb >> 16;
                const g = rgb >> 8 & 0xFF;
                const b = rgb & 0xFF;
                let alpha = 0.4;
                if (l.width <= 2) {
                  alpha = 1;
                }
                const rgba = 'rgba(' + r + ',' + g + ',' + b + ', ' + alpha + ')';
                return rgba;
              }
              return 'rgba(173, 173, 173, 0.25)';
            }).ofObject(),
            new go.Binding('strokeWidth', 'width')),
          $(go.TextBlock, new go.Binding('text', '', (l) => {
            if (l.isHighlighted) {
              return l.data.text;
            }
            return null;
          }).ofObject(),
            {
              segmentIndex: -1,
              segmentOffset: new go.Point(-60, 0),
              segmentOrientation: go.Link.OrientUpright
            })
        );
    }


    this.btcAddressScanPipelineApiService.getAddressScanGraphUsingPOSTDefault(this.pipeline.id, 0, 10000, {

      startingTime,
      endingTime,
      address,
    }).pipe(
      take(1)
    ).subscribe((graph) => {

      const cryptoPipe = new CryptoPipe();
      const data = {
        class: 'go.GraphLinksModel',
        nodeDataArray: graph.nodes.map((node) => {

          const n = {
            key: node.address,
            color: '#f89602',
            text: node.address,
            textColor: node.address === this.pipeline.address ? '#0040FF' : 'black',
            toolTipText: null,
            tags: [],

          };
          return n;
        }),
        linkDataArray: graph.edges
          .filter(edge => edge.fromAddress !== edge.toAddress)
          .map((edge) => {
            return {
              from: edge.fromAddress,
              to: edge.toAddress,
              width: this.getEdgeWidth(edge.amount),
              text: cryptoPipe.transform(edge.amount, 'satoshi', 'btc') + ' BTC',
              toolTipText: edge.txCount + ' TX'
            };
          })

      };
      this.myDiagram.model = go.Model.fromJson(data);
      const rootAddressNode = this.myDiagram.findNodeForKey(this.pipeline.address);
      this.myDiagram.select(rootAddressNode);
      this.isLoadingDiagram = false;

    }, console.error, () => {
      this.isLoadingDiagram = false;
    });


  }


  getEdgeWidth(satoshi: number) {
    const pipe = new CryptoPipe();
    const btc = pipe.transform(satoshi, 'satoshi', 'btc');
    if (btc < 0.1) {
      return 5;
    }
    if (btc < 0.5) {
      return 10;
    }
    if (btc < 1) {
      return 15;
    }
    if (btc < 2) {
      return 20;
    }
    return 25;

  }

  dateRangeTipFormatter = (value) => {
    if (!this.pipeline) {
      return '';
    }
    const retVal = moment(this.pipeline.startingTime).local().add(value, 'days').format('YYYY-MM-DD');
    return retVal;

  };

  openInV1() {
    window.open('https://sitev1.unblock-analysis.com/result/' + this.pipeline.address + '/' + this.pipeline.maxLevel + '/' + this.pipeline.startingTime + '/' + this.pipeline.endingTime);
  }

  getAvgScoreEvColor(avgScoreEv: number) {
    if (avgScoreEv < 0.0005) {
      return '#3F8600';
    }
    return '#CF1322';
  }


}
