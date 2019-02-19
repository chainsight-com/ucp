import { Component, OnInit } from '@angular/core';
import { EthAddress, Person, Address, Company, Block, Tx, Vout, EthBlock, EthTx, Graph } from '../model/models';
import { Route, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchResult } from '../model/SearchResult';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { CategoryMeta } from './category-meta';
import * as d3 from 'd3';
import { NetworkG, NodeModel } from './network-g';
import * as jsnx from 'jsnetworkx';


@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.scss']
})
export class SearchResultPageComponent implements OnInit {
  private paramSub: Subscription;
  public keyword: string;
  public searchResult: SearchResult = null;
  public networkG: NetworkG = null;
  public subNetworkG: NetworkG = null;
  public currNode: NodeModel = null;
  public profileTabSelectedIndex: number = 0;
  public riskScore: number = 0;
  public overviewMode = 'profile';
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
  public relatedBitcoinAddresses: Address[];
  public relatedEthAddresses: EthAddress[];
  public relatedPeople: Person[];
  public relatedCompanies: Company[];

  constructor(protected route: ActivatedRoute, protected httpClient: HttpClient) {
    this.currNode = null;
  }

  ngAfterViewInit(): void {
    // in memory network

  }

  ngOnInit() {
    this.paramSub = this.route.params.subscribe(async (params) => {
      this.keyword = params['keyword'];
      this.riskScore = 0;
      this.relatedBitcoinAddresses = null;
      this.relatedEthAddresses = null;
      this.relatedPeople = null;
      this.relatedCompanies = null;
      this.searchResult = await this.httpClient.get(environment.baseApiUrl + '/api/search/' + this.keyword + '?maxDist=6').toPromise();







      // risk score
      this.searchResult.graph.addressNodes.forEach((address: Address) => this.addRiskScoreByAddress(address));
      this.searchResult.graph.ethAddressNodes.forEach((address: EthAddress) => this.addRiskScoreByAddress(address));
      this.searchResult.graph.personNodes.forEach((person: Person) => this.addRiskScoreByPerson(person));

      // related
      let rootNodeIds = {};
      if (this.searchResult.root.bitcoinAddress) {

        //temp fix
        this.searchResult.root.bitcoinAddress = this.searchResult.root.bitcoinAddress.map(a => {
          if (!a.address) {
            const res = this.searchResult.graph.addressNodes.filter(an => an.id === a.id);
            if (res.length > 0) {
              return res[0]
            }
          }
          return a;
        });
        this.searchResult.root.bitcoinAddress.forEach(a => { rootNodeIds[a.id] = true; });


      }
      if (this.searchResult.root.ethAddress) {
        //temp fix
        this.searchResult.root.ethAddress = this.searchResult.root.ethAddress.map(a => {
          if (!a.address) {
            const res = this.searchResult.graph.ethAddressNodes.filter(an => an.id === a.id);
            if (res.length > 0) {
              return res[0]
            }
          }
          return a;
        });
        this.searchResult.root.ethAddress.forEach(a => { rootNodeIds[a.id] = true; });
      }
      if (this.searchResult.root.person) {
        //temp fix
        if (!this.searchResult.root.person.fullName) {
          const res = this.searchResult.graph.personNodes.filter(pn => pn.id === this.searchResult.root.person.id);
          if (res.length > 0) {
            this.searchResult.root.person = res[0];
          }
        }
        rootNodeIds[this.searchResult.root.person.id] = true;
      }
      this.relatedBitcoinAddresses = this.searchResult.graph.addressNodes
        .filter(a => !rootNodeIds[a.id])
        .sort((a, b) => (a.category ? -this.categoryMetaMap[a.category].risk : 1) - (b.category ? -this.categoryMetaMap[b.category].risk : 1))
        .slice(0, 20)
        ;
      this.relatedEthAddresses = this.searchResult.graph.ethAddressNodes
        .filter(a => !rootNodeIds[a.id])
        .sort((a, b) => (a.category ? -this.categoryMetaMap[a.category].risk : 1) - (b.category ? -this.categoryMetaMap[b.category].risk : 1))
        .slice(0, 20);

      this.relatedPeople = this.searchResult.graph.personNodes
        .filter(p => !rootNodeIds[p.id])
        .sort((a, b) => (a.sanctioned ? 0 : 1) - (b.sanctioned ? 0 : 1))
        .slice(0, 20);
      this.relatedCompanies = this.searchResult.graph.companyNodes.slice(0, 10);
      this.networkG = new NetworkG(this.searchResult.graph);



    });
  }

  formatBirthday(timestamp: number): string {
    return moment.unix(timestamp).format('YYYY-MM-DD');
  }

  getCategoryTagColor(category: string): string {
    return this.categoryMetaMap[category].tagColor;
  }

  getRiskScoreColor(): string {
    if (this.riskScore > 0 && this.riskScore < 60) {
      return '#f5222d';
    } else if (this.riskScore >= 60) {
      return '#fa8c16';
    }
    return '#52c41a';
  }
  addRiskScoreByAddress(address: Address | EthAddress): void {
    if (address.category) {
      let meta: CategoryMeta = this.categoryMetaMap[address.category];
      if (meta) {
        if (this.riskScore + meta.risk >= 100) {
          this.riskScore = 100;
          return;
        } else {
          this.riskScore += meta.risk;
        }
      }
    }
  }

  addRiskScoreByPerson(person: Person): void {
    const sanctionedScore = 50;
    if (person.sanctioned) {

      if (this.riskScore + sanctionedScore >= 100) {
        this.riskScore = 100;
        return;
      } else {
        this.riskScore += sanctionedScore;
      }

    }
  }
  formatRiskScore = riskScore => `${riskScore}%`;
  formatCategory(category): string {
    if (this.categoryMetaMap[category]) {
      return this.categoryMetaMap[category].display;
    }
    return category;
  }


  gotoOverviewProfile(): void {
    this.currNode = null;
    this.subNetworkG = null;
    this.overviewMode = 'profile';
  }
  gotoOverviewGraph(): void {
    this.currNode = null;
    this.subNetworkG = null;
    this.overviewMode = 'graph';

  }
  gotoSubgraph(selectedNode): void {
    this.currNode = selectedNode;
    this.subNetworkG = this.networkG.undirectedQuerySubgraph(this.searchResult.root.bitcoinAddress[0].id, this.currNode.id);

  }


}
