import { Component, OnInit, OnDestroy, ElementRef, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, pipe } from 'rxjs';
import { takeUntil, take, mergeMap } from 'rxjs/operators';
import { BtcAddressScanPipeline, BtcAddressScanPipelineApiService, BtcFlowAddressTaintJobApiService, BtcFlowAddressTaintJobResultPage, BtcFlowRiskGraphJobApiService, BtcFlowRiskGraph } from 'src/sdk';
import * as go from 'gojs';

import { SankeyLayout } from './sankey-layout';
import { CryptoPipe } from 'src/app/pipes/crypto.pipe';

import * as moment from 'moment';

@Component({
  selector: 'app-btc-scan-result-page',
  templateUrl: './btc-scan-result-page.component.html',
  styleUrls: ['./btc-scan-result-page.component.scss']
})
export class BtcScanResultPageComponent implements OnInit, OnDestroy {


  public pipeline: BtcAddressScanPipeline = {};
  public isAddressTaintJobLoading = false;
  public addressTaintJobResultPageNo = 0;
  public addressTaintJobResultPageSize = 30;
  public addressTaintJobResultPage: BtcFlowAddressTaintJobResultPage = {
    hasNextPage: false,
    records: [],
  };


  public btcFlowRiskGraph: BtcFlowRiskGraph = {};

  public maxDays = 1;
  public dateRange = [0, 1];
  public dateRangeMarks = {};


  @ViewChild('flowDiagramDiv')
  private flowDiagramRef: ElementRef;

  private diagram: go.Diagram;

  public isLoadingDiagram = false;


  private unsubscribe$ = new Subject<void>();
  myDiagram: go.Diagram;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private btcAddressScanPipelineApiService: BtcAddressScanPipelineApiService,
    private btcFlowAddressTaintJobApiService: BtcFlowAddressTaintJobApiService,
    private btcFlowRiskGraphJobApiService: BtcFlowRiskGraphJobApiService) { }


  flowTabSelected() {
    this.initDiagram(this.pipeline.startingTime, this.pipeline.endingTime);
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
    this.btcAddressScanPipelineApiService.getBtcAddressScanPipelineUsingGETDefault(id)
      .pipe(
        take(1)
      ).subscribe(pipeline => {
        this.pipeline = pipeline;
        this.maxDays = moment(this.pipeline.endingTime).diff(moment(this.pipeline.startingTime), 'days');
        this.dateRangeMarks = { 0: moment(this.pipeline.startingTime).format('YYYY-MM-DD') };

        this.dateRangeMarks[this.maxDays] = moment(this.pipeline.endingTime).format('YYYY-MM-DD');
        this.reloadAddressTaintJobResultPage(true);
      });
  }
  reloadAddressTaintJobResultPage(reset: boolean) {
    if (reset) {
      this.addressTaintJobResultPageNo = 1;
    }
    this.isAddressTaintJobLoading = false;
    this.btcFlowAddressTaintJobApiService.getFlowAddressTaintJobResultUsingGETDefault(this.pipeline.flowAddressTaintJobId, this.addressTaintJobResultPageNo - 1, this.addressTaintJobResultPageSize)
      .pipe(
        take(1),
      ).subscribe(page => {
        this.addressTaintJobResultPage = page;
      }, console.error, () => {
        this.isAddressTaintJobLoading = false;
      });

  }




  initDiagram(startingTime: Date, endingTime: Date, address?: string, tag?: string) {
    const rootAddress = '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq';

    var colors = ['#AC193D/#BF1E4B', '#2672EC/#2E8DEF', '#8C0095/#A700AE', '#5133AB/#643EBF', '#008299/#00A0B1', '#D24726/#DC572E', '#008A00/#00A600', '#094AB2/#0A5BC4'];

    // this function provides a common style for the TextBlocks
    function textStyle() {
      return { font: 'bold 12pt Segoe UI, sans-serif', stroke: 'black', margin: 5 };
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
              })
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
              // for each Link coming out of the Node, set Link.isHighlighted
              node.findLinksConnected().each(function (l) { l.isHighlighted = true; });
              // for each Node destination for the Node, set Node.isHighlighted
              node.findNodesConnected().each(function (n) { n.isHighlighted = true; });
              diagram.commitTransaction('highlight');
            }
          },
          $(go.TextBlock, textStyle(),
            { name: 'LTEXT' },
            new go.Binding('text', 'ltext')),
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
              width: 20
            },

            new go.Binding('stroke', '', (n) => {
              if (n.isHighlighted) {
                return 'red';
              }
              return null;
            }).ofObject(),
            new go.Binding('strokeWidth', '', (n) => {
              return (n.data.key === rootAddress || n.isHighlighted) ? 4 : 0;
            }).ofObject()
          ),

          $(go.TextBlock, textStyle(),
            { name: 'TEXT' },
            new go.Binding('text'))
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
            adjusting: go.Link.End
          },
          $(go.Shape, { strokeWidth: 4, stroke: 'rgba(173, 173, 173, 0.25)' },
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






    this.isLoadingDiagram = true;

    const graph = { 'flowRiskGraphJob': { 'id': 46, 'flowRiskJobId': 89, 'flowRiskJob': { 'id': 89, 'flowAddressTagJobId': 80, 'flowAddressTagJob': { 'id': 80, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'forwardFlowJobId': 157, 'forwardFlowJob': { 'id': 157, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'FORWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_d036480288c248f38f5ca2276715994e', 'bqJob': 'd036480288c248f38f5ca2276715994e', 'createdTime': '2019-08-31T14:02:11.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:11.000+0000', 'updaterId': 3 }, 'backwardFlowJobId': 158, 'backwardFlowJob': { 'id': 158, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'BACKWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_c378b6f5d88d41ab9139eb9976bc0f75', 'bqJob': 'c378b6f5d88d41ab9139eb9976bc0f75', 'createdTime': '2019-08-31T14:02:23.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:23.000+0000', 'updaterId': 3 }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_address_tag_job', 'destTable': 'job_264ef01b20bc4f6498acb2b87fc763cb', 'bqJob': '264ef01b20bc4f6498acb2b87fc763cb', 'createdTime': '2019-08-31T14:03:43.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:03:44.000+0000', 'updater': { 'id': 3, 'principalName': 'ACCOUNT_8f364148-7180-433a-b2ea-ca1299205cca', 'createdTime': '2019-08-25T15:52:02.000+0000', 'email': 'john.lin0420@gmail.com', 'firstName': '林君翰', 'lastName': null, 'mobile': null, 'mobileCountryCode': null, 'unverifiedMobile': null, 'unverifiedMobileCountryCode': null, 'otp': null, 'enabled': true, 'googleId': '111107939833385011904', 'handler': {}, 'hibernateLazyInitializer': {} } }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_job', 'destTable': 'job_d7cfcab57adc4e0ea777a975a79759a8', 'bqJob': 'd7cfcab57adc4e0ea777a975a79759a8', 'createdTime': '2019-08-31T14:03:59.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:04:00.000+0000', 'updaterId': 3 }, 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'tag': null, 'address': null, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_graph_job', 'destTable': 'job_3f35517564604767a606f46ef725bcc5', 'bqJob': '3f35517564604767a606f46ef725bcc5', 'createdTime': '2019-08-31T16:05:53.923+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T16:05:55.007+0000', 'updaterId': 3 }, 'flowRiskNodeJob': { 'id': 40, 'flowRiskGraphJobId': 46, 'flowRiskGraphJob': { 'id': 46, 'flowRiskJobId': 89, 'flowRiskJob': { 'id': 89, 'flowAddressTagJobId': 80, 'flowAddressTagJob': { 'id': 80, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'forwardFlowJobId': 157, 'forwardFlowJob': { 'id': 157, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'FORWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_d036480288c248f38f5ca2276715994e', 'bqJob': 'd036480288c248f38f5ca2276715994e', 'createdTime': '2019-08-31T14:02:11.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:11.000+0000', 'updaterId': 3 }, 'backwardFlowJobId': 158, 'backwardFlowJob': { 'id': 158, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'BACKWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_c378b6f5d88d41ab9139eb9976bc0f75', 'bqJob': 'c378b6f5d88d41ab9139eb9976bc0f75', 'createdTime': '2019-08-31T14:02:23.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:23.000+0000', 'updaterId': 3 }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_address_tag_job', 'destTable': 'job_264ef01b20bc4f6498acb2b87fc763cb', 'bqJob': '264ef01b20bc4f6498acb2b87fc763cb', 'createdTime': '2019-08-31T14:03:43.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:03:44.000+0000', 'updater': { 'id': 3, 'principalName': 'ACCOUNT_8f364148-7180-433a-b2ea-ca1299205cca', 'createdTime': '2019-08-25T15:52:02.000+0000', 'email': 'john.lin0420@gmail.com', 'firstName': '林君翰', 'lastName': null, 'mobile': null, 'mobileCountryCode': null, 'unverifiedMobile': null, 'unverifiedMobileCountryCode': null, 'otp': null, 'enabled': true, 'googleId': '111107939833385011904', 'handler': {}, 'hibernateLazyInitializer': {} } }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_job', 'destTable': 'job_d7cfcab57adc4e0ea777a975a79759a8', 'bqJob': 'd7cfcab57adc4e0ea777a975a79759a8', 'createdTime': '2019-08-31T14:03:59.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:04:00.000+0000', 'updaterId': 3 }, 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'tag': null, 'address': null, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_graph_job', 'destTable': 'job_3f35517564604767a606f46ef725bcc5', 'bqJob': '3f35517564604767a606f46ef725bcc5', 'createdTime': '2019-08-31T16:05:53.923+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T16:05:55.007+0000', 'updaterId': 3 }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_node_job', 'destTable': 'job_2a98b6e49e724b639f35dfe3a9ca08d5', 'bqJob': '2a98b6e49e724b639f35dfe3a9ca08d5', 'createdTime': '2019-08-31T16:06:02.655+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T16:06:03.645+0000', 'updaterId': 3 }, 'flowRiskEdgeJob': { 'id': 38, 'flowRiskGraphJobId': 46, 'flowRiskGraphJob': { 'id': 46, 'flowRiskJobId': 89, 'flowRiskJob': { 'id': 89, 'flowAddressTagJobId': 80, 'flowAddressTagJob': { 'id': 80, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'forwardFlowJobId': 157, 'forwardFlowJob': { 'id': 157, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'FORWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_d036480288c248f38f5ca2276715994e', 'bqJob': 'd036480288c248f38f5ca2276715994e', 'createdTime': '2019-08-31T14:02:11.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:11.000+0000', 'updaterId': 3 }, 'backwardFlowJobId': 158, 'backwardFlowJob': { 'id': 158, 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'maxLevel': 5, 'directionType': 'BACKWARD', 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_job', 'destTable': 'job_c378b6f5d88d41ab9139eb9976bc0f75', 'bqJob': 'c378b6f5d88d41ab9139eb9976bc0f75', 'createdTime': '2019-08-31T14:02:23.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:02:23.000+0000', 'updaterId': 3 }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_address_tag_job', 'destTable': 'job_264ef01b20bc4f6498acb2b87fc763cb', 'bqJob': '264ef01b20bc4f6498acb2b87fc763cb', 'createdTime': '2019-08-31T14:03:43.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:03:44.000+0000', 'updater': { 'id': 3, 'principalName': 'ACCOUNT_8f364148-7180-433a-b2ea-ca1299205cca', 'createdTime': '2019-08-25T15:52:02.000+0000', 'email': 'john.lin0420@gmail.com', 'firstName': '林君翰', 'lastName': null, 'mobile': null, 'mobileCountryCode': null, 'unverifiedMobile': null, 'unverifiedMobileCountryCode': null, 'otp': null, 'enabled': true, 'googleId': '111107939833385011904', 'handler': {}, 'hibernateLazyInitializer': {} } }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_job', 'destTable': 'job_d7cfcab57adc4e0ea777a975a79759a8', 'bqJob': 'd7cfcab57adc4e0ea777a975a79759a8', 'createdTime': '2019-08-31T14:03:59.000+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T14:04:00.000+0000', 'updaterId': 3 }, 'startingTime': '2015-10-27T00:00:00.000+0000', 'endingTime': '2015-10-30T00:00:00.000+0000', 'tag': null, 'address': null, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_graph_job', 'destTable': 'job_3f35517564604767a606f46ef725bcc5', 'bqJob': '3f35517564604767a606f46ef725bcc5', 'createdTime': '2019-08-31T16:05:53.923+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T16:05:55.007+0000', 'updaterId': 3 }, 'destProjectId': 'unblock-244815', 'destDataset': 'btc_flow_risk_edge_job', 'destTable': 'job_acb3be716824482eaeba33b79abaa8b4', 'bqJob': 'acb3be716824482eaeba33b79abaa8b4', 'createdTime': '2019-08-31T16:06:05.576+0000', 'creatorId': 3, 'updatedTime': '2019-08-31T16:06:06.603+0000', 'updaterId': 3 }, 'nodes': [{ 'address': '18zGCEFT5RrahLf84QUtAvSDVKiD4bR6Df', 'tags': [] }, { 'address': '1DHJH3hJjNNJzZRgDXfPXBbVhUANfjJhFQ', 'tags': [] }, { 'address': '13AgM4UY6br5YVJsmAeND2DqCxsqpuThRL', 'tags': [] }, { 'address': '19PkCcykUes6Xy4oiJmtgdmDxfeY9DfnGw', 'tags': [] }, { 'address': '13t2oCqd3uEuAwdphx4czU9eCTr8htv5B7', 'tags': [] }, { 'address': '1KXNN4EMevCeuJfNeqUzWHLzToEaBZemzS', 'tags': [] }, { 'address': '13NGMWhdAWDFBypSQYJxXCgk4a9JhqibUn', 'tags': [] }, { 'address': '3MQeb8Gf8UDYE6cNMbsU4oJb9MWamuBrB8', 'tags': [] }, { 'address': '1L36afrh9dEdGsA3y9yzXzTaoH4rgPCzjc', 'tags': [] }, { 'address': '14ke9zQhavnYSZw6niB441joxhLehqqrmB', 'tags': [] }, { 'address': '13pgEjbc7Xm4vHGugBrFJgXGWWkCzC5Dnf', 'tags': [] }, { 'address': '153sohgMQ8CNuqC2onxccK9XExxtrhAwyj', 'tags': [] }, { 'address': '1KQb5KrQ2KC3JCJ7Xp8x77UviDtk27dz9f', 'tags': [] }, { 'address': '1NV8TEJzt7E87foA2qF3qPKvexVRdMFKMC', 'tags': [] }, { 'address': '1C8hbSeLQpzq5kwvQ9djiq6p5qo6JmJ2HN', 'tags': [] }, { 'address': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'tags': [] }, { 'address': '12DTA1Hf5B3keqyzurgEed8wLuu1PSE8i7', 'tags': [] }, { 'address': '1JvaxYQBJ4Gjy9dDXVtHz6Hh8hCDn7yPDD', 'tags': [] }, { 'address': '1546tPmUy7a72Z5r6KnV19fPYDRxVmMiUg', 'tags': [] }, { 'address': '14zVotKpf3u9QBSCTdmkRTQP1qf6VjkJPz', 'tags': [] }, { 'address': '1KRkHbhHria3bjd5RgWvndJHMxAmB34vUx', 'tags': [] }, { 'address': '1GRokHzn6D876ydYz89iRXPJo6uX6nXp6X', 'tags': [] }, { 'address': '1HReqgd8rr2VZ2R7MiroDxNALNVfQ6oQnj', 'tags': [] }, { 'address': '14ey3YbuxBnSwqXkFigFi4N5JWkxGQC7ZP', 'tags': [] }, { 'address': '1McsrpHgbUp3c63YFGcgQ3MG7xuX5vTuyH', 'tags': [] }, { 'address': '1DHTgex9imVHv2VAtUvZUaK3ZceTyqWGS7', 'tags': [] }, { 'address': '148Bg4ovyJappJHJmHeHs7aC5w2WCkN9Vv', 'tags': [] }, { 'address': '1JxT7WiTbvH1QavLRZSn5YQD2Gi4wsa7eb', 'tags': [] }, { 'address': '15wRtL52UVZM7namZC1sU85L7tYzBP7ZoG', 'tags': [] }, { 'address': '1Nb7gQVPKPx49zmeHsd7EG8DnJv9QT6XyV', 'tags': [] }, { 'address': '1BLWFSEgMCcFrbsAsgEvQyiwLthBDymotb', 'tags': [] }, { 'address': '13rkYjzXGp3jBNWXzX8UsCY4gxftUcybDR', 'tags': [] }, { 'address': '13CtwS824TWJS7EYdekjCdyLfcRT3ey7bC', 'tags': [] }, { 'address': '1B6MsUDA65xXY2MpL83xtZzzuCtMjgzVH', 'tags': [] }, { 'address': '1AyBWuptBR1jt28ZWSQgDJ73gA8MU87hv5', 'tags': [] }, { 'address': '1CqLStNNZR9BNzQmb9wXdGDkHhSpi86jPC', 'tags': [] }, { 'address': '18LRiGApie4qkVvui6URhZ2REDFjD8n6aP', 'tags': [] }, { 'address': '1KC9UwXYDDXKfLWGjpGYZkpNiHa3ABdcDE', 'tags': [] }, { 'address': '1Q6eFZdNWCo6oCAjFf7w6qNFfSnTXsdj4B', 'tags': [] }, { 'address': '1CJNYTLRHNkdW3MQsK3hV3tB9muXZoHVFo', 'tags': [] }, { 'address': '1DJc9bLAsac7krAeMm32ZMXaEupSXy8x8o', 'tags': [] }, { 'address': '1FD6Eeo65FSu1gYVoUmNbLY1owGkrRKtAT', 'tags': [] }, { 'address': '1BD1vjKvt42cQXQjBEP4Ats3JFANF8a8hM', 'tags': [] }, { 'address': '173Pw84Gc6RwPvZxpRv3PgDafvDYkFBcgo', 'tags': [] }, { 'address': '1eyBFE91DGsuqNdpw2JTmUhCPfVtdFyoN', 'tags': [] }, { 'address': '1EAz2evHWLiSSjYZQb82WsGjXpbHHsuQv6', 'tags': [] }, { 'address': '1LKVUS4Zgj7PjSGJRrEcPir8pvE7MXhLnT', 'tags': [] }, { 'address': '1HXujoHrbqJqjEG92XfBpfuwToiokTLkst', 'tags': ['999dice.com'] }, { 'address': '1112bLQVfMBb3LZsyMg3bAZ7QWH2i1N5E', 'tags': ['abraxasmarket'] }, { 'address': '1TUqpjfhfWUjirB6noW4bvXZTBk3idpBy', 'tags': ['abraxasmarket'] }, { 'address': '16ns5i123jehFRYQrFhxHLFt1D4xTkHTGy', 'tags': ['abraxasmarket'] }, { 'address': '16miNYL1pHNTRGVAfNRevfyGUsQP7kWBfJ', 'tags': ['abraxasmarket'] }, { 'address': '1Ch6fiU529Q8dTwAEvfrwndeXqQVfuMamX', 'tags': ['localbitcoins.com'] }, { 'address': '1CWriT27ZGSsjT9MQkwPnNd5k5TsKKdXnt', 'tags': ['localbitcoins.com'] }, { 'address': '1FZCJqBCoC91EVuiHsgsDriKPVDrf8fTkb', 'tags': ['nitrogensports.eu'] }, { 'address': '1C7GoMBCnSJ8WyLJtHu8aSFPsfdgyLrnCi', 'tags': ['nitrogensports.eu'] }], 'edges': [{ 'fromAddress': '13AgM4UY6br5YVJsmAeND2DqCxsqpuThRL', 'toAddress': '12DTA1Hf5B3keqyzurgEed8wLuu1PSE8i7', 'amount': 200000, 'txCount': 1 }, { 'fromAddress': '13pgEjbc7Xm4vHGugBrFJgXGWWkCzC5Dnf', 'toAddress': '1NV8TEJzt7E87foA2qF3qPKvexVRdMFKMC', 'amount': 5624357749, 'txCount': 1 }, { 'fromAddress': '13rkYjzXGp3jBNWXzX8UsCY4gxftUcybDR', 'toAddress': '1HXujoHrbqJqjEG92XfBpfuwToiokTLkst', 'amount': 15000000, 'txCount': 1 }, { 'fromAddress': '13rkYjzXGp3jBNWXzX8UsCY4gxftUcybDR', 'toAddress': '1GRokHzn6D876ydYz89iRXPJo6uX6nXp6X', 'amount': 15000000, 'txCount': 1 }, { 'fromAddress': '1546tPmUy7a72Z5r6KnV19fPYDRxVmMiUg', 'toAddress': '14zVotKpf3u9QBSCTdmkRTQP1qf6VjkJPz', 'amount': 200000, 'txCount': 1 }, { 'fromAddress': '1546tPmUy7a72Z5r6KnV19fPYDRxVmMiUg', 'toAddress': '15wRtL52UVZM7namZC1sU85L7tYzBP7ZoG', 'amount': 200000, 'txCount': 1 }, { 'fromAddress': '16ns5i123jehFRYQrFhxHLFt1D4xTkHTGy', 'toAddress': '1KQb5KrQ2KC3JCJ7Xp8x77UviDtk27dz9f', 'amount': 69974552, 'txCount': 1 }, { 'fromAddress': '16ns5i123jehFRYQrFhxHLFt1D4xTkHTGy', 'toAddress': '1TUqpjfhfWUjirB6noW4bvXZTBk3idpBy', 'amount': 69974552, 'txCount': 1 }, { 'fromAddress': '18zGCEFT5RrahLf84QUtAvSDVKiD4bR6Df', 'toAddress': '18LRiGApie4qkVvui6URhZ2REDFjD8n6aP', 'amount': 1500000000, 'txCount': 1 }, { 'fromAddress': '1BD1vjKvt42cQXQjBEP4Ats3JFANF8a8hM', 'toAddress': '13pgEjbc7Xm4vHGugBrFJgXGWWkCzC5Dnf', 'amount': 5739353399, 'txCount': 1 }, { 'fromAddress': '1C7GoMBCnSJ8WyLJtHu8aSFPsfdgyLrnCi', 'toAddress': '1FZCJqBCoC91EVuiHsgsDriKPVDrf8fTkb', 'amount': 70000000, 'txCount': 1 }, { 'fromAddress': '1C7GoMBCnSJ8WyLJtHu8aSFPsfdgyLrnCi', 'toAddress': '14ey3YbuxBnSwqXkFigFi4N5JWkxGQC7ZP', 'amount': 70000000, 'txCount': 1 }, { 'fromAddress': '1Ch6fiU529Q8dTwAEvfrwndeXqQVfuMamX', 'toAddress': '1FD6Eeo65FSu1gYVoUmNbLY1owGkrRKtAT', 'amount': 51775289, 'txCount': 1 }, { 'fromAddress': '1Ch6fiU529Q8dTwAEvfrwndeXqQVfuMamX', 'toAddress': '1CWriT27ZGSsjT9MQkwPnNd5k5TsKKdXnt', 'amount': 51775289, 'txCount': 1 }, { 'fromAddress': '1CqLStNNZR9BNzQmb9wXdGDkHhSpi86jPC', 'toAddress': '173Pw84Gc6RwPvZxpRv3PgDafvDYkFBcgo', 'amount': 1825366, 'txCount': 1 }, { 'fromAddress': '1CqLStNNZR9BNzQmb9wXdGDkHhSpi86jPC', 'toAddress': '16miNYL1pHNTRGVAfNRevfyGUsQP7kWBfJ', 'amount': 1825366, 'txCount': 1 }, { 'fromAddress': '1DHJH3hJjNNJzZRgDXfPXBbVhUANfjJhFQ', 'toAddress': '1L36afrh9dEdGsA3y9yzXzTaoH4rgPCzjc', 'amount': 4567119, 'txCount': 1 }, { 'fromAddress': '1DHJH3hJjNNJzZRgDXfPXBbVhUANfjJhFQ', 'toAddress': '3MQeb8Gf8UDYE6cNMbsU4oJb9MWamuBrB8', 'amount': 4567119, 'txCount': 1 }, { 'fromAddress': '1DHJH3hJjNNJzZRgDXfPXBbVhUANfjJhFQ', 'toAddress': '1KRkHbhHria3bjd5RgWvndJHMxAmB34vUx', 'amount': 4567119, 'txCount': 1 }, { 'fromAddress': '1DHTgex9imVHv2VAtUvZUaK3ZceTyqWGS7', 'toAddress': '1eyBFE91DGsuqNdpw2JTmUhCPfVtdFyoN', 'amount': 1227029199, 'txCount': 1 }, { 'fromAddress': '1DHTgex9imVHv2VAtUvZUaK3ZceTyqWGS7', 'toAddress': '19PkCcykUes6Xy4oiJmtgdmDxfeY9DfnGw', 'amount': 1227029199, 'txCount': 1 }, { 'fromAddress': '1HReqgd8rr2VZ2R7MiroDxNALNVfQ6oQnj', 'toAddress': '14ke9zQhavnYSZw6niB441joxhLehqqrmB', 'amount': 33048214711, 'txCount': 1 }, { 'fromAddress': '1HReqgd8rr2VZ2R7MiroDxNALNVfQ6oQnj', 'toAddress': '1CJNYTLRHNkdW3MQsK3hV3tB9muXZoHVFo', 'amount': 33048214711, 'txCount': 1 }, { 'fromAddress': '1KC9UwXYDDXKfLWGjpGYZkpNiHa3ABdcDE', 'toAddress': '1B6MsUDA65xXY2MpL83xtZzzuCtMjgzVH', 'amount': 34200000, 'txCount': 1 }, { 'fromAddress': '1LKVUS4Zgj7PjSGJRrEcPir8pvE7MXhLnT', 'toAddress': '1JxT7WiTbvH1QavLRZSn5YQD2Gi4wsa7eb', 'amount': 25000000, 'txCount': 1 }, { 'fromAddress': '1McsrpHgbUp3c63YFGcgQ3MG7xuX5vTuyH', 'toAddress': '148Bg4ovyJappJHJmHeHs7aC5w2WCkN9Vv', 'amount': 84160, 'txCount': 1 }, { 'fromAddress': '1McsrpHgbUp3c63YFGcgQ3MG7xuX5vTuyH', 'toAddress': '1BLWFSEgMCcFrbsAsgEvQyiwLthBDymotb', 'amount': 84160, 'txCount': 1 }, { 'fromAddress': '1McsrpHgbUp3c63YFGcgQ3MG7xuX5vTuyH', 'toAddress': '1Nb7gQVPKPx49zmeHsd7EG8DnJv9QT6XyV', 'amount': 84160, 'txCount': 1 }, { 'fromAddress': '1NV8TEJzt7E87foA2qF3qPKvexVRdMFKMC', 'toAddress': '1NV8TEJzt7E87foA2qF3qPKvexVRdMFKMC', 'amount': 700000000, 'txCount': 1 }, { 'fromAddress': '1Q6eFZdNWCo6oCAjFf7w6qNFfSnTXsdj4B', 'toAddress': '1EAz2evHWLiSSjYZQb82WsGjXpbHHsuQv6', 'amount': 114162, 'txCount': 1 }, { 'fromAddress': '1Q6eFZdNWCo6oCAjFf7w6qNFfSnTXsdj4B', 'toAddress': '1KXNN4EMevCeuJfNeqUzWHLzToEaBZemzS', 'amount': 114162, 'txCount': 1 }, { 'fromAddress': '1112bLQVfMBb3LZsyMg3bAZ7QWH2i1N5E', 'toAddress': '1DHTgex9imVHv2VAtUvZUaK3ZceTyqWGS7', 'amount': 91866734, 'txCount': 2 }, { 'fromAddress': '13AgM4UY6br5YVJsmAeND2DqCxsqpuThRL', 'toAddress': '13rkYjzXGp3jBNWXzX8UsCY4gxftUcybDR', 'amount': 400000, 'txCount': 2 }, { 'fromAddress': '13CtwS824TWJS7EYdekjCdyLfcRT3ey7bC', 'toAddress': '1Q6eFZdNWCo6oCAjFf7w6qNFfSnTXsdj4B', 'amount': 288324, 'txCount': 2 }, { 'fromAddress': '13CtwS824TWJS7EYdekjCdyLfcRT3ey7bC', 'toAddress': '1C7GoMBCnSJ8WyLJtHu8aSFPsfdgyLrnCi', 'amount': 288324, 'txCount': 2 }, { 'fromAddress': '153sohgMQ8CNuqC2onxccK9XExxtrhAwyj', 'toAddress': '1CqLStNNZR9BNzQmb9wXdGDkHhSpi86jPC', 'amount': 2000098, 'txCount': 2 }, { 'fromAddress': '153sohgMQ8CNuqC2onxccK9XExxtrhAwyj', 'toAddress': '16ns5i123jehFRYQrFhxHLFt1D4xTkHTGy', 'amount': 2000098, 'txCount': 2 }, { 'fromAddress': '1C8hbSeLQpzq5kwvQ9djiq6p5qo6JmJ2HN', 'toAddress': '1Ch6fiU529Q8dTwAEvfrwndeXqQVfuMamX', 'amount': 66200000000, 'txCount': 2 }, { 'fromAddress': '1C8hbSeLQpzq5kwvQ9djiq6p5qo6JmJ2HN', 'toAddress': '1HReqgd8rr2VZ2R7MiroDxNALNVfQ6oQnj', 'amount': 66200000000, 'txCount': 2 }, { 'fromAddress': '1DJc9bLAsac7krAeMm32ZMXaEupSXy8x8o', 'toAddress': '1546tPmUy7a72Z5r6KnV19fPYDRxVmMiUg', 'amount': 9534238, 'txCount': 2 }, { 'fromAddress': '1JvaxYQBJ4Gjy9dDXVtHz6Hh8hCDn7yPDD', 'toAddress': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'amount': 15277894, 'txCount': 2 }, { 'fromAddress': '1JxT7WiTbvH1QavLRZSn5YQD2Gi4wsa7eb', 'toAddress': '1B6MsUDA65xXY2MpL83xtZzzuCtMjgzVH', 'amount': 7792782, 'txCount': 2 }, { 'fromAddress': '1NV8TEJzt7E87foA2qF3qPKvexVRdMFKMC', 'toAddress': '1JvaxYQBJ4Gjy9dDXVtHz6Hh8hCDn7yPDD', 'amount': 163147422, 'txCount': 2 }, { 'fromAddress': '1B6MsUDA65xXY2MpL83xtZzzuCtMjgzVH', 'toAddress': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'amount': 2899824, 'txCount': 3 }, { 'fromAddress': '13t2oCqd3uEuAwdphx4czU9eCTr8htv5B7', 'toAddress': '13AgM4UY6br5YVJsmAeND2DqCxsqpuThRL', 'amount': 522486, 'txCount': 3 }, { 'fromAddress': '1DJc9bLAsac7krAeMm32ZMXaEupSXy8x8o', 'toAddress': '1DHJH3hJjNNJzZRgDXfPXBbVhUANfjJhFQ', 'amount': 14301357, 'txCount': 3 }, { 'fromAddress': '1DJc9bLAsac7krAeMm32ZMXaEupSXy8x8o', 'toAddress': '1McsrpHgbUp3c63YFGcgQ3MG7xuX5vTuyH', 'amount': 14301357, 'txCount': 3 }, { 'fromAddress': '1112bLQVfMBb3LZsyMg3bAZ7QWH2i1N5E', 'toAddress': '153sohgMQ8CNuqC2onxccK9XExxtrhAwyj', 'amount': 183733468, 'txCount': 4 }, { 'fromAddress': '13t2oCqd3uEuAwdphx4czU9eCTr8htv5B7', 'toAddress': '13CtwS824TWJS7EYdekjCdyLfcRT3ey7bC', 'amount': 696648, 'txCount': 4 }, { 'fromAddress': '18zGCEFT5RrahLf84QUtAvSDVKiD4bR6Df', 'toAddress': '1C8hbSeLQpzq5kwvQ9djiq6p5qo6JmJ2HN', 'amount': 6000000000, 'txCount': 4 }, { 'fromAddress': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'toAddress': '1AyBWuptBR1jt28ZWSQgDJ73gA8MU87hv5', 'amount': 1170810, 'txCount': 5 }, { 'fromAddress': '1AyBWuptBR1jt28ZWSQgDJ73gA8MU87hv5', 'toAddress': '18zGCEFT5RrahLf84QUtAvSDVKiD4bR6Df', 'amount': 39230000, 'txCount': 5 }, { 'fromAddress': '13NGMWhdAWDFBypSQYJxXCgk4a9JhqibUn', 'toAddress': '1112bLQVfMBb3LZsyMg3bAZ7QWH2i1N5E', 'amount': 1224972, 'txCount': 6 }, { 'fromAddress': '13t2oCqd3uEuAwdphx4czU9eCTr8htv5B7', 'toAddress': '1DJc9bLAsac7krAeMm32ZMXaEupSXy8x8o', 'amount': 1393296, 'txCount': 8 }, { 'fromAddress': '13NGMWhdAWDFBypSQYJxXCgk4a9JhqibUn', 'toAddress': '13t2oCqd3uEuAwdphx4czU9eCTr8htv5B7', 'amount': 3062430, 'txCount': 15 }, { 'fromAddress': '12etp4a21L5ks7KKuNtEFx2r1ZqbwEampq', 'toAddress': '13NGMWhdAWDFBypSQYJxXCgk4a9JhqibUn', 'amount': 4917402, 'txCount': 21 }] };



    const cryptoPipe = new CryptoPipe();
    const data = {
      class: 'go.GraphLinksModel',
      nodeDataArray: graph.nodes.map((node) => {

        const n = {
          key: node.address,
          color: node.address === rootAddress ? '#ff0000' : '#f89602',
          text: node.address,
          tags: node.tags
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
            text: cryptoPipe.transform(edge.amount, 'satoshi', 'btc') + ' BTC'
          };
        })
    };
    this.myDiagram.model = go.Model.fromJson(data);
    this.isLoadingDiagram = false;
    // this.btcFlowRiskGraphJobApiService.runFlowRiskGraphJobUsingPOSTDefault(0, 1000, {
    //   flowRiskJobId: this.pipeline.flowRiskJobId,
    //   startingTime,
    //   endingTime,
    //   address,
    //   tag
    // }).pipe(
    //   take(1)
    // ).subscribe((graph) => {

    // }, console.error, () => {
    //   this.isLoadingDiagram = false;
    // });

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

  }

  dateRangeChanged(range) {
    const startingTime = moment(this.pipeline.startingTime).local().add(range[0], 'days').toDate();
    const endingTime = moment(this.pipeline.startingTime).local().add(range[1], 'days').toDate();

    this.initDiagram(startingTime, endingTime);

  }

}
