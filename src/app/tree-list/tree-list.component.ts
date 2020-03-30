import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface CoorNode {
  name: string;
  children?: CoorNode[];
  nameActive?: boolean;
}

const TREE_DATA: CoorNode[] = [
  {
    name: 'All',
    children: [
      {
        name: 'Europe',
        children: [
          {name: 'spain', nameActive: false},
          {name: 'italy', nameActive: false},
        ]
      },
      {name: 'Asia',
        children: [
          {name: 'kyrgyzstan', nameActive: false},
          {name: 'thailand', nameActive: false},
        ]},
    ]
  }
];


const COOR_DATA = [
  {
    name: 'spain',
    coors: [[40.416775, -3.703790]]
  },
  {
    name: 'italy',
    coors: [[44.059444, 12.568333]]
  },
  {
    name: 'kyrgyzstan',
    coors: [[42.882004, 74.582748]]
  },
  {
    name: 'thailand',
    coors: [[7.878978, 98.398392]]
  }
];

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['tree-list.component.css'],
})
export class TreeListComponent {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange = new EventEmitter();
  @Input() nameActive;
  treeControl = new NestedTreeControl<CoorNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CoorNode>();
  coorData: any;
  constructor() {
    this.dataSource.data = TREE_DATA;
    this.coorData = COOR_DATA;
  }

  hasChild = (_: number, node: CoorNode) => !!node.children && node.children.length > 0;
  showCoor(node: CoorNode) {
    const nodes = [];
    if (!!node.children && node.children.length > 0) {
      node.children.forEach(arg => {
        if (!!arg.children && arg.children.length > 0) {
          arg.children.forEach(el => {
            nodes.push(this.getCoors(el.name));
          });
        } else {
          nodes.push(this.getCoors(arg.name));
        }});
    } else {
      this.nameActive = true;
      nodes.push(this.getCoors(node.name));
    }
    this.onChange.emit(nodes);
  }

  getCoors(name) {
    const filCoorData = this.coorData.filter( e => e.name === name);
    return filCoorData.length > 0 ? filCoorData[0] : false;
  }
}
