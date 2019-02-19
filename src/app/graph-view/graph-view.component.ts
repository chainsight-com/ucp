import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, SimpleChanges, AfterViewInit } from '@angular/core';
import { Graph, Block, Tx, Vout, Address, EthBlock, EthTx, EthAddress, Person, Company, Transfer, SearchRoot } from '../model/models';
import * as d3 from 'd3';
import { BigNumber } from 'bignumber.js';
import { CategoryMeta } from '../search-result-page/category-meta';
import * as moment from 'moment';
import { NodeModel, NetworkG, EdgeModel } from '../search-result-page/network-g';


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

  constructor(protected zone: NgZone) { }

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

  renderGraph(): void {

    if (this.container) {
      const nativeElement = this.container.nativeElement;
      while (nativeElement.firstChild) {
        nativeElement.removeChild(nativeElement.firstChild);
      }
    }

    const mSize = 20;

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

    const nodeColorMapper = new Mapper('node', 'type', 'color', ['#e18826', '#002a67', '#fb95af', '#A5ABB6', '#FF756E', '#6DCE9E', '#DE9BF9', '#FFD86E', '#68BDF6', '#F0D79F', '#2f54eb', '#62c737']);

    const G = G6.G;
    let simulation = void 0;
    const graph = new G6.Graph({
      container: this.container.nativeElement,
      height: window.innerHeight,
      plugins: [nodeColorMapper],
      modes: {
        default: ['panCanvas']
      },
      layout: function layout(nodes, edges) {
        if (simulation) {
          simulation.alphaTarget(0.3).restart();
        } else {
          simulation = forceSimulation(nodes).force('charge', forceManyBody().strength(-100)).force('link', forceLink(edges).id((model: any) => {
            return model.id;
          })).force('collision', forceCollide().radius((model: any) => {
            return mSize / 2 * 0.6;
          })).force('y', forceY()).force('x', forceX()).on('tick', function () {
            graph.updateNodePosition();
          });
        }
      }
    });
    graph.node({
      size: 10,
      style: function style(model) {
        return {
          shadowColor: 'rgba(0,0,0, 0.3)',
          shadowBlur: 3,
          shadowOffsetX: 3,
          shadowOffsetY: 5,
          stroke: null
        };

      },
      label: function label(model: NodeModel) {
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
            retVal.text += ' (Sanction)';
            retVal.fill = '#ff0000';
          }
        } else if (model.type === 'transfer') {
          const transfer = <Transfer>model;
          retVal.text = transfer.amount + ' ' + transfer.currency;
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
            retVal.text += ' (' + address.category + ')';
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
            retVal.text += ' (' + address.category + ')';
            retVal.fill = '#ff0000';
          }
        }
        return retVal;

      }
    });
    graph.edge({
      style: function style() {
        return {
          endArrow: true,
          stroke: '#b3b3b3',
          lineWidth: 1
        };
      }
    });
    graph.read(data);
    graph.translate(graph.getWidth() / 2, graph.getHeight() / 2);

    // 拖拽节点交互
    let subject = void 0; // 逼近点
    let lastPoint = void 0;
    graph.on('mousedown', function (ev) {
      if (ev.domEvent.button === 0) {
        subject = simulation.find(ev.x, ev.y, 10);
      }
    });

    graph.on('dragstart', function (ev) {
      graph.css({
        cursor: '-webkit-grabbing'
      });
      if (subject) {
        simulation.alphaTarget(0.3).restart();
      }
    });

    graph.on('drag', function (ev) {
      if (subject) {
        subject.fx = ev.x;
        subject.fy = ev.y;
      } else {
        if (lastPoint) {
          graph.translate(ev.domX - lastPoint.x, ev.domY - lastPoint.y);
        }
      }
      lastPoint = {
        x: ev.domX,
        y: ev.domY
      };
    });
    graph.on('dragend', function () {
      lastPoint = undefined;
      graph.css({
        cursor: '-webkit-grab'
      });
    });


    graph.on('mouseup', () => {
      if (subject) {
        comp.zone.run(() => {
          comp.openDrawer(subject);
        });

      }
      resetState();
    });
    graph.on('canvas:mouseleave', () => {
      resetState();
    });


    function resetState() {
      if (subject) {
        simulation.alphaTarget(0);
        subject.fx = null;
        subject.fy = null;
        subject = null;
      }
    }

    // 鼠标移入节点显示 label
    function tryHideLabel(node) {

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

      const label = node.getLabel();
      if (label) {

        const labelBox = label.getBBox();

        if (labelBox.maxX - labelBox.minX > mSize) {
          label.hide();
          graph.draw();
        }

      }

    }
    let nodes = graph.getNodes();
    let edges = graph.getEdges();

    edges.forEach(function (edge) {
      // 移除边的捕获，提升图形拾取效率
      edge.getGraphicGroup().set('capture', false);
    });

    nodes.forEach(function (node) {
      tryHideLabel(node);
    });

    graph.on('node:mouseenter', (ev) => {
      const item = ev.item;
      graph.toFront(item);
      item.getLabel().show();
      graph.draw();
    });

    graph.on('node:mouseleave', (ev) => {
      const item = ev.item;
      tryHideLabel(item);
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
