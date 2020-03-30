import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {loadConfigurationFromPath} from 'tslint/lib/configuration';
import {log} from 'util';
declare let L;

interface CoorNode {
  name: string;
  children?: CoorNode[];
  data?: any;
  isActive?: boolean;
}

const TREE_DATA: CoorNode[] = [
  {
    name: 'All',
    children: [
      {
        name: 'Europe',
        children: [
          {name: 'spain', data: [40.416775, -3.703790], isActive: false},
          {name: 'italy', data: [44.059444, 12.568333], isActive: false},
        ]
      },
      {name: 'Asia',
        children: [
          {name: 'kyrgyzstan', data: [42.882004, 74.582748], isActive: false},
          {name: 'thailand', data: [7.878978, 98.398392], isActive: false},
        ]},
    ]
  }
];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  treeControl = new NestedTreeControl<CoorNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CoorNode>();
  map: any;
  markerGroup: any;
  newMarkerData = [];
  clickedData = [];
  mapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  constructor() {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.map = L.map('map').setView([37.71859032558816, 55.54687500000001], 3);
    L.tileLayer(this.mapUrl, {}).addTo(this.map);
    this.markerGroup = L.featureGroup().addTo(this.map);
    this.markerGroup.on('mouseover', e => {
      this.dataSource.data[0].children.forEach(child => {
          child.children.forEach(arg => {
            if (arg.data[0] === e.layer._latlng.lat && arg.data[1] === e.layer._latlng.lng) {
              this.newMarkerData.push(arg);
            }
          });
        });
      this.markerGroup.removeLayer(e.layer._leaflet_id);
      this.newMarkerData = [...new Set(this.newMarkerData)];
    });
  }


  hasChild = (_: number, node: CoorNode) => !!node.children && node.children.length > 0;
  showCoors(node: CoorNode) {
    this.markerGroup.clearLayers();
    this.dataSource.data[0].children.forEach(child => {
      child.children.forEach(arg => {
        this.newMarkerData.includes(arg) ? arg.isActive = true : arg.isActive = false;
      });
    });
    if (!!node.children && node.children.length > 0) {
      this.setViewOnMap(node.name);
      node.children.forEach(e => {
        if (!!e.children && e.children.length > 0) {
          e.children.forEach(arg => {
            this.showMarker(arg);
          });
        } else {
          this.showMarker(e);
        }
      });
    } else {
      this.showMarker(node);
    }
  }

  setViewOnMap(e, c?) {
    switch (e) {
      case 'All': this.map.setView([37.71859032558816, 55.54687500000001], 3);
                  break;
      case 'Asia': this.map.setView([29.458731185355344, 83.58398437500001], 4);
                   break;
      case 'Europe': this.map.setView([48.69096039092552, 19.687500000000004], 4);
                     break;
      default: this.map.setView(c, 5);
    }
  }

  deleteData(data: any) {
    this.newMarkerData = this.newMarkerData.filter(a => a.name !== data.name);
    this.dataSource.data[0].children.forEach(child => {
      child.children.forEach(arg => {
        if (arg.data[0] === data.data[0] && arg.data[1] === data.data[1]) {
          arg.isActive = false;
        }
      });
    });
  }

  showMarker(event: CoorNode) {
    if (!this.newMarkerData.includes(event)) {
      L.marker(event.data).addTo(this.markerGroup);
      event.isActive = true;
      this.setViewOnMap(event.name, event.data);
    }
  }
}
