import {Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter, Output, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subject, pipe} from 'rxjs';
import {takeUntil, take, mergeMap, finalize} from 'rxjs/operators';
import {
  Address,
  AddressCaseApiService,
  AddressCaseDto,
  AddressScanApiService,
  AddressScanDto,
  ClusterNodeDto,
  FlowGraphDto,
  IncidentAddressScanApiService,
  IncidentDto,
  PageOfWitnessDto
} from '@profyu/unblock-ng-sdk';
import * as go from 'gojs';

import {SankeyLayout} from '../../../shared/sankey-layout';
import {CryptoPipe} from 'src/app/pipes/crypto.pipe';

import * as moment from 'moment';
import {RuleCategory} from "../../../models/type/rule-category.enum";
import BigNumber from "bignumber.js";
import {RiskLevel} from "../../../models/type/risk-level.enum";
import {CcPipe} from "../../../pipes/cc.pipe";
import {IncidentAddressScanCreation} from "@profyu/unblock-ng-sdk/model/incident-address-scan-creation";
import {IncidentTableComponent} from "../../../component/incident/incident-table/incident-table.component";
import * as Highcharts from 'highcharts';

let Sunburst = require('highcharts/modules/sunburst');

Sunburst(Highcharts);

@Component({
  selector: 'app-address-scan-detail-page',
  templateUrl: './address-scan-detail-page.component.html',
  styleUrls: ['./address-scan-detail-page.component.scss']
})
export class AddressScanDetailPageComponent implements OnInit, OnDestroy {

  @ViewChild("incidentTable", {static: false})
  private incidentTable: IncidentTableComponent;

  public isLoadingPipeline = false;
  public addressScan: AddressScanDto = {};

  // graph
  public graphEdgeSize = 300;

  // cluster
  public clusterGraphActions = [
    {
      name: "detail",
      title: "Detail"
    }
  ];
  public showClusterDrawer: boolean = false;
  public selectedClusterNode: ClusterNodeDto;
  public selectedClusterAddresses: Address[] = [];

  public showIncidentFormDrawer: boolean = false;


  public get selectedClusterTags(): string {
    return this.selectedClusterNode.labels.map(t => t.label).join(", ")
  }

  // address case
  public isAddressCaseLoading = false;
  public addressCase: AddressCaseDto;

  // witness
  public isWitnessLoading = false;
  public witnessPageIdx = 0;
  public witnessPageSize = 500;
  public witnessResultPage: PageOfWitnessDto = {
    last: false,
    content: [],
  };

  // filter
  public category?: RuleCategory = null;

  public flowGraph: FlowGraphDto = {};

  public witnessSummary: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  public maxDays = 1;
  public dateRange = [0, 1];
  public dateRangeMarks = {};


  @ViewChild('flowDiagramDiv', {static: false})
  private flowDiagramRef: ElementRef;
  private flowDiagram: go.Diagram;
  public isLoadingDiagram = false;


  private unsubscribe$ = new Subject<void>();

  public riskLevels = {
    "5": {name: "Critical", colorAlias: "pink"},
    "4": {name: "High", colorAlias: "red"},
    "3": {name: "Medium", colorAlias: "orange"},
    "2": {name: "Low", colorAlias: "geekblue"},
    "1": {name: "Normal", colorAlias: "green"},
  }

  @ViewChild('forwardLabelSunburstDiv', {static: false})
  private forwardLabelSunburstRef: ElementRef;
  @ViewChild('backwardLabelSunburstDiv', {static: false})
  private backwardLabelSunburstRef: ElementRef;

  private forwardLabelSunburstChart: Highcharts.Chart;
  private backwardLabelSunburstChart: Highcharts.Chart;
  public isLoadingLabelSunburst = false;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private addressScanApiService: AddressScanApiService,
              private addressCaseApiService: AddressCaseApiService,
              private incidentAddressScanApiService: IncidentAddressScanApiService) {
  }


  flowTabSelected() {
    if (!this.flowDiagram) {
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

  reload(id: string) {
    this.isLoadingPipeline = true;
    this.addressScanApiService.getAddressScanUsingGET(id)
      .pipe(
        take(1)
      ).subscribe(sc => {
      this.addressScan = sc;
      this.maxDays = moment(this.addressScan.endingTime).diff(moment(this.addressScan.startingTime), 'days');
      this.dateRangeMarks = {0: moment(this.addressScan.startingTime).format('YYYY-MM-DD')};
      this.dateRangeMarks[this.maxDays] = moment(this.addressScan.endingTime).format('YYYY-MM-DD');
      this.dateRange = [0, this.maxDays];
      this.witnessSummary[5] = Number(sc.riskCriticalCount);
      this.witnessSummary[4] = Number(sc.riskHighCount);
      this.witnessSummary[3] = Number(sc.riskMediumCount);
      this.witnessSummary[2] = Number(sc.riskLowCount);
      this.witnessSummary[1] = Number(sc.riskNormalCount);

      this.reloadWitnessPage(true);
      this.reloadAddressCase()
    }, console.error, () => {
      this.isLoadingPipeline = false;
    });
  }

  reloadWitnessPage(resetPage: boolean, category?: RuleCategory) {
    if (resetPage) {
      this.witnessPageIdx = 0;
    }
    this.isWitnessLoading = true;
    // this.addressScanApiService.listAddressScanWitnessSummaryUsingGET(this.addressScan.id)
    //   .pipe(
    //     take(1),
    //   ).subscribe(summary => {
    //   this.witnessSummary = summary.reduce(function (map, obj) {
    //     map[obj.riskLevel] = parseInt(obj.witnessCount);
    //     return map;
    //   }, {
    //     5: 0,
    //     4: 0,
    //     3: 0,
    //     2: 0,
    //     1: 0,
    //   })
    //
    // });
    this.addressScanApiService.paginateAddressScanWitnessUsingGET(this.addressScan.id, this.witnessPageIdx, this.witnessPageSize, category)
      .pipe(
        take(1),
      ).subscribe(page => {
      this.witnessResultPage = page;

    }, console.error, () => {
      this.isWitnessLoading = false;
    });

  }

  public reloadAddressCase() {
    this.isAddressCaseLoading = true
    this.addressCaseApiService.paginateAddressCaseUsingGET(0, 1, this.addressScan.project.id, this.addressScan.currency.id, this.addressScan.address)
      .pipe(
        take(1),
        finalize(() => {
          this.isAddressCaseLoading = false;
        })
      ).subscribe(page => {
      if (page.content.length > 0) {
        this.addressCase = page.content[0];
      } else {
        this.addressCase = null;
      }
    }, console.error);
  }

  initDiagram(label?: string) {
    setTimeout(() => {
      this.isLoadingDiagram = true;
    });
    // const startingTime = moment(this.pipeline.startingTime).local().add(this.dateRange[0], 'days').toDate();
    // const endingTime = moment(this.pipeline.startingTime).local().add(this.dateRange[1], 'days').toDate();
    // const address = this.pipeline.address;


    // const rootAddress = '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq';

    const colors = [
      '#AC193D/#BF1E4B',
      '#2672EC/#2E8DEF',
      '#8C0095/#A700AE',
      '#5133AB/#643EBF',
      '#008299/#00A0B1',
      '#D24726/#DC572E',
      '#008A00/#00A600',
      '#094AB2/#0A5BC4'
    ];

    // this function provides a common style for the TextBlocks
    function textStyle() {
      return {font: 'bold 12pt Segoe UI, sans-serif', stroke: 'black', margin: new go.Margin(5, 5, 0, 5)};
    }


    const $ = go.GraphObject.make;  // for conciseness in defining templates


    if (!this.flowDiagram) {
      this.flowDiagram =
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
      this.flowDiagram.nodeTemplate =
        $(go.Node,
          go.Panel.Horizontal,
          {
            locationObjectName: 'SHAPE',
            locationSpot: go.Spot.MiddleLeft,
            portSpreading: go.Node.SpreadingPacked,  // rather than the default go.Node.SpreadingEvenly
            click: (e, node: go.Node) => {
              this.copyToClipboard(node.data.key);
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
            {name: 'LTEXT'},
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
                $(go.TextBlock, {margin: 4},
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
              return (n.data.key === this.addressScan.address || n.isHighlighted) ? 4 : 0;
            }).ofObject()
          ),
          $(go.Panel, 'Vertical',
            {defaultStretch: go.GraphObject.Horizontal},
            $(go.TextBlock, textStyle(),
              {name: 'TEXT'},
              new go.Binding('text'),
              new go.Binding('stroke', 'textColor')),
            $(go.TextBlock,
              {
                margin: new go.Margin(2, 0, 0, 5),
                stroke: 'red',
                font: 'bold 10pt Segoe UI, sans-serif'
              },
              new go.Binding('text', '', (n) => {
                if (n.data.labels.length) {
                  return n.data.labels.map(lbl => `${lbl.label} (${this.riskLevels[lbl.riskLevel].name})`).join('\n');
                }
                return null;
              }).ofObject(),
              // new go.Binding('visible', '', (n) => {
              //   return n.data.labels.length;
              // }).ofObject()
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

      this.flowDiagram.linkTemplate =
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
                  $(go.TextBlock, {margin: 4},
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


    this.addressScanApiService.getAddressScanFlowGraphUsingGET(this.addressScan.id, 0, this.graphEdgeSize).pipe(
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
            textColor: node.address === this.addressScan.address ? '#0040FF' : 'black',
            toolTipText: null,
            labels: node.labels,

          };
          return n;
        }),
        linkDataArray: graph.edges.content
          .filter(edge => edge.fromAddress !== edge.toAddress)
          .map((edge) => {
            return {
              from: edge.fromAddress,
              to: edge.toAddress,
              width: this.getEdgeWidth(parseInt(edge.amount)),
              text: `${new CcPipe().transform(edge.amount, this.addressScan.currency.unitRate)} ${this.addressScan.currency.name.toUpperCase()}`,
              toolTipText: edge.txCount + ' TX'
            };
          })

      };
      this.flowDiagram.model = go.Model.fromJson(data);
      const rootAddressNode = this.flowDiagram.findNodeForKey(this.addressScan.address);
      this.flowDiagram.select(rootAddressNode);
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
    if (!this.addressScan) {
      return '';
    }
    const retVal = moment(this.addressScan.startingTime).local().add(value, 'days').format('YYYY-MM-DD');
    return retVal;

  };


  getAvgScoreEvColor(avgScoreEv: number) {
    if (avgScoreEv < 0.0005) {
      return '#3F8600';
    }
    return '#CF1322';
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

  loadMoreEdges() {
    this.graphEdgeSize += 100;
    this.initDiagram();
  }


  openCase() {
    const query: any = {
      currencyId: this.addressScan.currency.id,
      address: this.addressScan.address
    };
    this.router.navigate(['/address-case/create'], {queryParams: query});
  }

  closeClusterDrawer() {
    this.showClusterDrawer = false;
  }

  handleClusterGraphAction(e: { action: string; nodes: ClusterNodeDto[] }) {
    if (e.action === 'detail') {
      if (e.nodes.length === 1) {
        this.selectedClusterNode = e.nodes[0];
        this.showClusterDrawer = true;
        this.selectedClusterAddresses = e.nodes[0].addresses.map(a => {
          return {
            currencyId: this.selectedClusterNode.currencyId,
            address: a,
          };
        });
      }
    }


  }

  addIncident() {
    this.showIncidentFormDrawer = true;
  }

  closeIncidentFormDrawer() {
    this.showIncidentFormDrawer = false;
  }

  onIncidentFormSubmit(incident: IncidentDto) {
    const body: IncidentAddressScanCreation = {
      addressScanId: this.addressScan.id,
      incidentId: incident.id,
    }
    this.showIncidentFormDrawer = false;
    this.incidentAddressScanApiService.createIncidentAddressScanUsingPOST(body)
      .pipe(
        take(1)
      ).subscribe(resp => {
      this.incidentTable.reload(true, false);

    }, console.error)

  }

  handleDetailClick(row: IncidentDto) {
    this.router.navigate(['incident', row.id]);
  }

  chartTabSelected() {
    if (!this.forwardLabelSunburstChart || !this.backwardLabelSunburstChart) {
      setTimeout(() => {
        this.isLoadingLabelSunburst = true;
        this.addressScanApiService.getAddressScanLabelSunburstUsingGET(this.addressScan.id)
          .pipe(
            take(1),
            finalize(() => { this.isLoadingLabelSunburst = false; })
          ).subscribe(resp => {
          const forwardData = resp.forward.map(d => {
            return {
              id: d.id,
              name: d.name,
              parent: d.parentId,
              value: d.value
            };
          });
          const backwardData = resp.backward.map(d => {
            return {
              id: d.id,
              name: d.name,
              parent: d.parentId,
              value: d.value
            };
          });

          const forwardOptions: any = {
            chart: {
              height: '400px'
            },
            title: {
              text: 'Labels'
            },
            subtitle: {
              text: ''
            },
            series: [{
              type: "sunburst",
              data: forwardData,
              allowDrillToNode: true,
              cursor: 'pointer',
              dataLabels: {
                format: '{point.name}',
                filter: {
                  property: 'innerArcLength',
                  operator: '>',
                  value: 16
                },
                rotationMode: 'circular'
              },
              levels: [{
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                  }
                }
              }, {
                level: 2,
                colorByPoint: true
              },
                {
                  level: 3,
                  colorVariation: {
                    key: 'brightness',
                    to: -0.5
                  }
                }, {
                  level: 4,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  }
                }]
            }],
            tooltip: {
              headerFormat: "",
              pointFormat: '<b>{point.name}</b>: <b>{point.value}</b>'
            }
          };
          this.forwardLabelSunburstChart = Highcharts.chart(this.forwardLabelSunburstRef.nativeElement, forwardOptions);

          const backwardOptions: any = {
            chart: {
              height: '400px'
            },
            title: {
              text: 'Labels'
            },
            subtitle: {
              text: ''
            },
            series: [{
              type: "sunburst",
              data: backwardData,
              allowDrillToNode: true,
              cursor: 'pointer',
              dataLabels: {
                format: '{point.name}',
                filter: {
                  property: 'innerArcLength',
                  operator: '>',
                  value: 16
                },
                rotationMode: 'circular'
              },
              levels: [{
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                  }
                }
              }, {
                level: 2,
                colorByPoint: true
              },
                {
                  level: 3,
                  colorVariation: {
                    key: 'brightness',
                    to: -0.5
                  }
                }, {
                  level: 4,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  }
                }]
            }],
            tooltip: {
              headerFormat: "",
              pointFormat: '<b>{point.name}</b>: <b>{point.value}</b>'
            }
          };
          this.backwardLabelSunburstChart = Highcharts.chart(this.backwardLabelSunburstRef.nativeElement, backwardOptions);

        }, console.error);
      }, 500);
    }
  }


}
