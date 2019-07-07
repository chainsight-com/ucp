import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, SimpleChanges, AfterViewInit } from '@angular/core';
import { Graph, Block, Tx, Vout, Address, EthBlock, EthTx, EthAddress, Person, Company, Transfer, SearchRoot } from '../model/models';
import * as d3 from 'd3';
import { BigNumber } from 'bignumber.js';
import { CategoryMeta } from '../search-result-page/category-meta';
import * as moment from 'moment';
import { NodeModel, NetworkG, EdgeModel, NodeType } from '../search-result-page/network-g';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.scss']
})
export class GraphViewComponent implements OnInit, AfterViewInit {

  @ViewChild('container')
  public container: ElementRef;

  @Input()
  public graphModel: Graph;

  @Input()
  public searchRoot: SearchRoot;

  public drawerVisible: boolean = false;

  public drawerTitle: string;

  public currNode: NodeModel;

  public categoryMetaMap: { [key: string]: CategoryMeta } = {
    'bank': {
      risk: 0,
      tagColor: 'green',
      display: 'Bank'
    },
    'exchange-cold': {
      risk: 0,
      tagColor: 'green',
      display: 'cold'
    },
    'anonymous_mkt': {
      risk: 40,
      tagColor: 'orange',
      display: 'Anonymous Market'
    },
    'services': {
      risk: 0,
      tagColor: 'green',
      display: 'service'
    },
    'marketplace': {
      risk: 0,
      tagColor: 'green',
      display: 'Marketplace'
    },
    'mixer': {
      risk: 60,
      tagColor: 'red',
      display: 'Mixer'
    },
    'transfer': {
      risk: 0,
      tagColor: 'green',
      display: 'Transfer'
    },
    'gambling': {
      risk: 5,
      tagColor: 'orange',
      display: 'Gambling'
    },
    'exchange': {
      risk: 0,
      tagColor: 'green',
      display: 'Exchange'
    },
    'wallet': {
      risk: 0,
      tagColor: 'green',
      display: 'Wallet'
    },
    'faucet': {
      risk: 0,
      tagColor: 'green',
      display: 'Faucet'
    },
    'scam': {
      risk: 100,
      tagColor: 'red',
      display: 'Scam'
    },
    'pool': {
      risk: 0,
      tagColor: 'green',
      display: 'Pool'
    }
  };

  private isViewInitialized: boolean = false;

  public isSpinning: boolean = false;
  constructor(protected zone: NgZone, protected httpClient: HttpClient) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphModel'] || changes['searchRoot']) {
      if (this.isViewInitialized) {
        this.renderGraph();
      }
    }
  }

  ngOnInit(): void {

  }

  openDrawer(node: NodeModel): void {
    this.currNode = node;

    this.drawerVisible = true;
    if (node.type === 'person') {
      this.drawerTitle = 'Person';
    } else if (node.type === 'company') {
      this.drawerTitle = 'Company';
    } else if (node.type === 'transfer') {
      this.drawerTitle = 'Transfer';
    } else if (node.type === 'block') {
      this.drawerTitle = 'BTC Block';
    } else if (node.type === 'tx') {
      this.drawerTitle = 'BTC Transaction';
    } else if (node.type === 'vout') {
      this.drawerTitle = 'BTC Output';
    } else if (node.type === 'address') {
      this.drawerTitle = 'BTC Address';
    } else if (node.type === 'ethBlock') {
      this.drawerTitle = 'ETH Block';
    } else if (node.type === 'ethTx') {
      this.drawerTitle = 'ETH Transaction';
    } else if (node.type === 'ethAddress') {
      this.drawerTitle = 'ETH Address';
    }
    else {
      this.drawerTitle = '';
    }
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderGraph();

  }

  async expandNeibor(g, node: NodeModel): Promise<void> {
    this.isSpinning = true;
    try {
      const tryAddNode = (addedNode: NodeModel) => {
        const existed = g.find(addedNode.id);
        if (!existed) {
          g.add('node', addedNode);
        }
      };
      const tryAddEdge = (addedEdge: EdgeModel) => {
        const existed = g.find(addedEdge.id);
        if (!existed) {
          g.add('edge', { id: addedEdge.id, source: addedEdge.startNode.id, target: addedEdge.endNode.id, type: addedEdge.type });
        }
      };
      const neiborGraph: Graph = await this.httpClient.get(environment.baseApiUrl + '/api/node/' + node.id + '/neibor').toPromise();
      neiborGraph.blockNodes.forEach(tryAddNode);
      neiborGraph.txNodes.forEach(tryAddNode);
      neiborGraph.voutNodes.forEach(tryAddNode);
      neiborGraph.addressNodes.forEach(tryAddNode);

      neiborGraph.companyNodes.forEach(tryAddNode);
      neiborGraph.personNodes.forEach(tryAddNode);
      neiborGraph.transferNodes.forEach(tryAddNode);

      neiborGraph.ethAddressNodes.forEach(tryAddNode);
      neiborGraph.ethBlockNodes.forEach(tryAddNode);
      neiborGraph.ethTxNodes.forEach(tryAddNode);

      neiborGraph.nextBlockEdges.forEach(tryAddEdge);
      neiborGraph.hasTxEdges.forEach(tryAddEdge);
      neiborGraph.vinEdges.forEach(tryAddEdge);
      neiborGraph.voutEdges.forEach(tryAddEdge);
      neiborGraph.managedByEdges.forEach(tryAddEdge);

      neiborGraph.remitEdges.forEach(tryAddEdge);
      neiborGraph.toBeneficiaryEdges.forEach(tryAddEdge);
      neiborGraph.ownEdges.forEach(tryAddEdge);
      neiborGraph.ethOwnEdges.forEach(tryAddEdge);

      neiborGraph.ethNextBlockEdges.forEach(tryAddEdge);
      neiborGraph.ethHasTxEdges.forEach(tryAddEdge);
      neiborGraph.ethRemitEdges.forEach(tryAddEdge);
      neiborGraph.ethReceiveEdges.forEach(tryAddEdge);
      g.draw();
      g.updateNodePosition();
      g.setFitView('cc');
    } catch (err) {
      console.error(err);
    } finally {
      this.isSpinning = false;
    }

  }

  renderGraph(): void {

    if (this.container) {
      const nativeElement = this.container.nativeElement;
      while (nativeElement.firstChild) {
        nativeElement.removeChild(nativeElement.firstChild);
      }
    }

    const mSize = 70;

    const rootIdMap = {};

    if (this.searchRoot) {
      if (this.searchRoot.bitcoinAddress) {
        this.searchRoot.bitcoinAddress.forEach(a => rootIdMap[a.id] = true);
      }
      if (this.searchRoot.ethAddress) {
        this.searchRoot.ethAddress.forEach(a => rootIdMap[a.id] = true);
      }

      if (this.searchRoot.person) {
        rootIdMap[this.searchRoot.person.id] = true;
      }

    }

    const data = {
      nodes: [],
      edges: [],
    };


    this.graphModel.blockNodes.forEach(n => data.nodes.push(n));
    this.graphModel.txNodes.forEach(n => data.nodes.push(n));
    this.graphModel.voutNodes.forEach(n => data.nodes.push(n));
    this.graphModel.addressNodes.forEach(n => data.nodes.push(n));

    this.graphModel.companyNodes.forEach(n => data.nodes.push(n));
    this.graphModel.personNodes.forEach(n => data.nodes.push(n));
    this.graphModel.transferNodes.forEach(n => data.nodes.push(n));

    this.graphModel.ethAddressNodes.forEach(n => data.nodes.push(n));
    this.graphModel.ethBlockNodes.forEach(n => data.nodes.push(n));
    this.graphModel.ethTxNodes.forEach(n => data.nodes.push(n));

    this.graphModel.nextBlockEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.hasTxEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.vinEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.voutEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.managedByEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));

    this.graphModel.remitEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.toBeneficiaryEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.ownEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.ethOwnEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));

    this.graphModel.ethNextBlockEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.ethHasTxEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.ethRemitEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));
    this.graphModel.ethReceiveEdges.forEach(e => data.edges.push({ id: e.id, source: e.startNode.id, target: e.endNode.id, type: e.type }));


    const comp: GraphViewComponent = this;
    const G6 = (<any>window).G6;
    const Mapper = G6.Plugins['tool.d3.mapper'];
    const _d = d3,
      forceSimulation = _d.forceSimulation,
      forceLink = _d.forceLink,
      forceManyBody = _d.forceManyBody,
      forceX = _d.forceX,
      forceY = _d.forceY,
      forceCollide = _d.forceCollide;

    // const nodeColorMapper = new Mapper('node', 'type', 'color', ['#e18826', '#002a67', '#fb95af', '#A5ABB6', '#FF756E', '#6DCE9E', '#DE9BF9', '#FFD86E', '#68BDF6', '#F0D79F', '#2f54eb', '#62c737']);



    const G = G6.G;
    const MaxSpanningForestPlugin = G6.Plugins['template.maxSpanningForest'];
    const maxSpanningForest = new MaxSpanningForestPlugin({
      fisheye: false,
      layoutCfg: {
        maxIteration: 1200,
        kg: 30,
        kr: 90,
        prevOverlapping: true,
        barnesHut: true,
      },
      menuCfg: {
        lists: []
      },
      textDisplay: false,
      node_shape: 'rect',
      node_label: (model: NodeModel) => {
        const retVal = {
          stroke: null,
          fill: '#000000',
          text: ''
        };
        if (model.type === 'company') {
          const company = <Company>model;
          retVal.text = company.legalName;
        } else if (model.type === 'person') {
          const person = <Person>model;
          retVal.text = person.fullName;
          if (person.sanctioned) {
            retVal.text += '\n(Sanction)';
            retVal.fill = '#ff0000';
          }
        } else if (model.type === 'transfer') {
          const transfer = <Transfer>model;
          retVal.text = transfer.amount.toString();
        } else if (model.type === 'block') {
          const block = <Block>model;
          retVal.text = block.hash;
        } else if (model.type === 'tx') {
          const tx = <Tx>model;
          retVal.text = tx.hash;
        } else if (model.type === 'vout') {
          const vout = <Vout>model;
          retVal.text = comp.satoshiToBtc(vout.value);
        } else if (model.type === 'address') {
          const address = <Address>model;
          retVal.text = address.address;
          if (address.category) {
            retVal.text += '\n(' + address.category + (address.entity ? ' / ' + address.entity : '') + ')';
            retVal.fill = '#ff0000';
          }
        } else if (model.type === 'ethBlock') {
          const block = <EthBlock>model;
          retVal.text = block.hash;
        } else if (model.type === 'ethTx') {
          const tx = <EthTx>model;
          retVal.text = comp.weiToEth(tx.value);
        } else if (model.type === 'ethAddress') {
          const address = <EthAddress>model;
          retVal.text = address.address;
          if (address.category) {
            retVal.text += '\n(' + address.category + (address.entity ? ' / ' + address.entity : '') + ')';
            retVal.fill = '#ff0000';
          }
        }
        return retVal;
      }
    });

    let simulation = void 0;
    const graph = new G6.Graph({
      container: this.container.nativeElement,
      height: window.innerHeight,
      fitView: 'cc',
      plugins: [maxSpanningForest],
      modes: {
        default: ['panBlank', 'panNode', 'wheelZoom']
      }
    });
    graph.node({
      size: (model: NodeModel) => {
        if (rootIdMap[model.id]) {
          return 80;
        }
        return 40;
      },
      color: function (model: NodeModel) {
        const type: NodeType = <NodeType>model.type;
        switch (type) {
          case 'block':
            return '#68BDF6';
          case 'tx':
            return '#6DCE9E';
          case 'vout':
            return '#FFD86E';
          case 'address':
            return '#DE9BF9';
          case 'ethBlock':
            return '#68BDF6';
          case 'ethTx':
            return '#6DCE9E';
          case 'ethAddress':
            return '#68BDF6';
          case 'company':
            return '#FB95AF';
          case 'person':
            return '#A5ABB6';
          case 'transfer':
            return '#FF756E';
        }
        return '#1890ff';

      },
      style: function style(model: NodeModel) {
        const retVal = {
          shadowColor: 'rgba(0,0,0, 0.3)',
          shadowBlur: 3,
          shadowOffsetX: 3,
          shadowOffsetY: 5
        };
        return retVal;

      },
      // label: function label(model: NodeModel) {
      // }
    });
    graph.edge({
      style: function style() {
        return {
          endArrow: true,
          stroke: '#b3b3b3',
          lineWidth: 1
        };
      },
      label: (model: EdgeModel) => {
        if (model.type === 'vin' || model.type === 'vout' || model.type === 'ethRemit' || model.type === 'ethReceive' || model.type === 'remit' || model.type === 'toBeneficiary') {
          return null;
        }
        return model.type;
      }
    });
    graph.read(data);


    const tryHideNodeLabel = (node) => {

      const model = node.getModel();
      if (rootIdMap[model.id]) {
        return;
      }
      if (model.type === 'person' || model.sanctioned) {
        return;
      }
      if ((model.type === 'address' || model.type === 'ethAddress') && model.category) {
        return;
      }

      if (this.currNode && node.id === this.currNode.id) {
        return;
      }

      const label = node.getLabel();
      if (label) {

        const labelBox = label.getBBox();

        if (labelBox.maxX - labelBox.minX > mSize) {
          label.hide();
          graph.draw();
        }

      }

    };



    let nodes = graph.getNodes();
    let edges = graph.getEdges();

    edges.forEach(function (edge) {
      edge.getGraphicGroup().set('capture', false);
      tryHideNodeLabel(edge);
    });

    nodes.forEach(function (node) {
      tryHideNodeLabel(node);
    });

    graph.on('node:mouseenter', (ev) => {
      const item = ev.item;
      graph.toFront(item);
      const label = item.getLabel();
      if (label) {
        label.show();
      }
      graph.draw();
    });

    graph.on('node:mouseleave', (ev) => {
      const item = ev.item;
      // tryHideNodeLabel(item);
    });

    graph.on('node:dblclick', (ev) => {
      const item = ev.item;
      comp.zone.run(() => {
        this.expandNeibor(graph, item.model);
      });
    });
    graph.on('node:contextmenu', (ev) => {
      const item = ev.item;
      comp.zone.run(() => {
        comp.openDrawer(item.model);
      });
    });
  }

  weiToEth(wei): string {
    return new BigNumber(wei).multipliedBy('1e-18').toString();
  }
  satoshiToBtc(satoshi): string {
    return new BigNumber(satoshi).multipliedBy('1e-8').toString();
  }
  formatCategory(category): string {
    if (this.categoryMetaMap[category]) {
      return this.categoryMetaMap[category].display;
    }
    return category;
  }
  getCategoryTagColor(category: string): string {
    return this.categoryMetaMap[category].tagColor;
  }
  formatBlockTime(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
  }
  formatBirthday(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD');
  }
  formatTransferTime(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD');
  }

}
