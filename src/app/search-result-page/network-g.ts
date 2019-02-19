import { Graph } from '../model/Graph';
import { Block } from '../model/Block';
import { Tx } from '../model/Tx';
import { Vout } from '../model/Vout';
import { EthBlock, EthAddress, Company, Address, Transfer, NextBlockEdge, HasTxEdge, VinEdge, VoutEdge, ManagedByEdge, EthNextBlockEdge, EthHasTxEdge, EthRemitEdge, EthReceiveEdge, RemitEdge, OwnEdge, EthOwnEdge, ToBeneficiaryEdge, BeneficiaryBankEdge, InterBankEdge, SrcBankEdge, EthMinedByEdge } from '../model/models';
import { EthTx } from '../model/EthTx';
import { Person } from '../model/Person';
import * as jsnx from 'jsnetworkx';
import { GraphViewComponent } from '../graph-view/graph-view.component';

export type NodeType = 'block' | 'tx' | 'vout' | 'address' | 'ethBlock' | 'ethTx' | 'ethAddress' | 'person' | 'company' | 'transfer';
export type EdgeType = 'nextBlock' | 'hasTx' | 'vout' | 'vin' | 'managedBy' | 'ethNextBlock' | 'ethHasTx' | 'ethRemit' | 'ethReceive' | 'ethMinedBy' | 'own' | 'ethOwn' | 'remit' | 'toBeneficiary' | 'beneficiaryBank' | 'interBank' | 'srcBank';

export type NodeModel = Block | Tx | Vout | Address | EthBlock | EthTx | EthAddress | Person | Company | Transfer;
export type EdgeModel = NextBlockEdge | HasTxEdge | VinEdge | VoutEdge | ManagedByEdge | EthNextBlockEdge | EthHasTxEdge | EthRemitEdge | EthReceiveEdge | EthMinedByEdge | OwnEdge | EthOwnEdge | RemitEdge | ToBeneficiaryEdge | BeneficiaryBankEdge | InterBankEdge | SrcBankEdge;
export class NetworkG {

    public diGraph: any;
    constructor(public graphModel: Graph) {

        this.diGraph = new jsnx.DiGraph();
        this.graphModel.blockNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.txNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.voutNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.addressNodes.forEach(n => this.diGraph.addNode(n.id, n));

        this.graphModel.companyNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.personNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.transferNodes.forEach(n => this.diGraph.addNode(n.id, n));

        this.graphModel.ethAddressNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.ethBlockNodes.forEach(n => this.diGraph.addNode(n.id, n));
        this.graphModel.ethTxNodes.forEach(n => this.diGraph.addNode(n.id, n));


        this.graphModel.nextBlockEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.hasTxEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.vinEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.voutEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.managedByEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));

        this.graphModel.remitEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.toBeneficiaryEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.ownEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.ethOwnEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));

        this.graphModel.ethNextBlockEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.ethHasTxEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.ethRemitEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));
        this.graphModel.ethReceiveEdges.forEach(e => this.diGraph.addEdge(e.startNode.id, e.endNode.id, e));

    }

    public undirectedQuerySubgraph(startNodeId, endNodeId): NetworkG {
        const path = jsnx.bidirectionalShortestPath(this.diGraph.toUndirected(), startNodeId, endNodeId);
        const subDiGraph = this.diGraph.subgraph(path);
        const graphModel: Graph = {
            addressNodes: [],
            beneficiaryBankEdges: [],
            blockNodes: [],
            companyNodes: [],
            ethAddressNodes: [],
            ethBlockNodes: [],
            ethHasTxEdges: [],
            ethMinedByEdges: [],
            ethNextBlockEdges: [],
            ethOwnEdges: [],
            ethReceiveEdges: [],
            ethRemitEdges: [],
            ethTxNodes: [],
            hasTxEdges: [],
            interBankEdges: [],
            managedByEdges: [],
            nextBlockEdges: [],
            ownEdges: [],
            personNodes: [],
            remitEdges: [],
            srcBankEdges: [],
            toBeneficiaryEdges: [],
            transferNodes: [],
            txNodes: [],
            vinEdges: [],
            voutEdges: [],
            voutNodes: []
        };
        subDiGraph.nodes(true).map(t => t[1]).forEach((n: NodeModel) => {
            const type = <NodeType>n.type;
            switch (type) {
                case 'address':
                    graphModel.addressNodes.push(<Address>n);
                    break;
                case 'block':
                    graphModel.blockNodes.push(<Block>n);
                    break;
                case 'company':
                    graphModel.companyNodes.push(<Company>n);
                    break;
                case 'ethAddress':
                    graphModel.ethAddressNodes.push(<EthAddress>n);
                    break;
                case 'ethBlock':
                    graphModel.ethBlockNodes.push(<EthBlock>n);
                    break;
                case 'ethTx':
                    graphModel.ethTxNodes.push(<EthTx>n);
                    break;
                case 'person':
                    graphModel.personNodes.push(<Person>n);
                    break;
                case 'transfer':
                    graphModel.transferNodes.push(<Transfer>n);
                    break;
                case 'vout':
                    graphModel.voutNodes.push(<Vout>n);
                    break;
                case 'tx':
                    graphModel.txNodes.push(<Tx>n);
                    break;
            }
        });
        subDiGraph.edges(true).map(t => t[2]).forEach((e: EdgeModel) => {
            const type = <EdgeType>e.type;
            switch (type) {
                case 'beneficiaryBank':
                    graphModel.beneficiaryBankEdges.push(<BeneficiaryBankEdge>e);
                    break;
                case 'ethHasTx':
                    graphModel.ethHasTxEdges.push(<EthHasTxEdge>e);
                    break;
                case 'ethMinedBy':
                    graphModel.ethMinedByEdges.push(<EthMinedByEdge>e);
                    break;
                case 'ethNextBlock':
                    graphModel.ethNextBlockEdges.push(<EthNextBlockEdge>e);
                    break;
                case 'ethOwn':
                    graphModel.ethOwnEdges.push(<EthOwnEdge>e);
                    break;
                case 'ethReceive':
                    graphModel.ethReceiveEdges.push(<EthReceiveEdge>e);
                    break;
                case 'ethRemit':
                    graphModel.ethRemitEdges.push(<EthRemitEdge>e);
                    break;
                case 'hasTx':
                    graphModel.hasTxEdges.push(<HasTxEdge>e);
                    break;
                case 'interBank':
                    graphModel.interBankEdges.push(<InterBankEdge>e);
                    break;
                case 'managedBy':
                    graphModel.managedByEdges.push(<ManagedByEdge>e);
                    break;
                case 'nextBlock':
                    graphModel.nextBlockEdges.push(<NextBlockEdge>e);
                    break;
                case 'own':
                    graphModel.ownEdges.push(<OwnEdge>e);
                    break;
                case 'remit':
                    graphModel.remitEdges.push(<RemitEdge>e);
                    break;
                case 'srcBank':
                    graphModel.srcBankEdges.push(<SrcBankEdge>e);
                    break;
                case 'toBeneficiary':
                    graphModel.toBeneficiaryEdges.push(<ToBeneficiaryEdge>e);
                    break;
                case 'vin':
                    graphModel.vinEdges.push(<VinEdge>e);
                    break;
                case 'vout':
                    graphModel.voutEdges.push(<VoutEdge>e);
                    break;
            }
        });
        return new NetworkG(graphModel);

    }




}
