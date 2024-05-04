import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import {
  NzFormatBeforeDropEvent,
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-tree',
  templateUrl: './my-tree.component.html',
  styleUrls: ['./my-tree.component.scss'],
})
export class MyTreeComponent implements OnInit {
  @ViewChild('myTree', { static: false }) myTree!: NzTreeComponent;

  constructor(private nzContextMenuService: NzContextMenuService) {}
  ngOnInit() {}
  counter = 0;
  addElement() {
    console.log(123123);
    this.nodes[0].children?.push({
      title: 'svid ' + this.counter,
      key: new Date().getMilliseconds().toString(),
      type: 'svid',
      data: '{}',
      isLeaf: true,
    });
    this.counter = this.counter + 1;
    this.nodes = [...this.nodes];
  }
  nodes: NzTreeNodeOptions[] = [
    {
      title: 'root',
      key: 'root',
      type: 'root',
      data: '',
      expanded: true,
      children: [
        {
          title: '0-0-0',
          key: '000',
          type: '',
          data: '',
          expanded: true,
          children: [{ title: '0-0-0-0', key: '0000', type: '', data: '' }],
        },
        {
          title: '0-0-1',
          key: '001',
          expanded: true,
          type: '',
          data: '',
          children: [{ title: '0-0-1-0', key: '0010', type: '', data: '' }],
        },
      ],
    },
  ];

  nzEvent(event: NzFormatEmitEvent): void {
    // console.log(event);
  }
  dropEnd(event: NzFormatEmitEvent): void {
    console.log(`dropEnd`);
    console.log(event);

    if (event.dragNode?.parentNode?.origin.key === event.node?.origin.key) {
      alert('same position');
    } else {
      const targetChildren = event.node?.getChildren();

      if (targetChildren && event.dragNode) {
        const tmpDragNode = { ...event.dragNode.origin };
        event.dragNode.remove();

        const tmp: NzTreeNodeOptions[] = [];
        for (const b of targetChildren) {
          tmp.push(b.origin);
        }
        tmp.push(tmpDragNode);
        event.node?.clearChildren();
        event.node?.addChildren(tmp);

        this.initElementStyle(event);
      }
    }
    this.nodes = [...this.nodes];
  }
  beforeDrop(arg: NzFormatBeforeDropEvent): Observable<boolean> {
    // if insert node into another node, wait 1s
    // console.log(arg);

    // return of(true);
    return of(false);
  }
  dragOver(event: NzFormatEmitEvent): void {
    this.setElementStyle(event);
    console.log(event);

    this.removeDropIndicator(event.event);
  }

  dragLeave(event: NzFormatEmitEvent): void {
    this.initElementStyle(event);
  }
  dragEnter(event: NzFormatEmitEvent): void {}
  setElementStyle(event: NzTreeNode | any): void {
    event.event.target.setAttribute('style', 'color: white; background: red');
  }
  initElementStyle(event: NzFormatEmitEvent | any): void {
    event.event.target.setAttribute('style', '');
  }
  removeDropIndicator(event: NzFormatEmitEvent['event'] | any): void {
    const children = event.target.children;
    if (children[1] && children[1].nodeName) {
      if (children[1].nodeName === 'NZ-TREE-DROP-INDICATOR') {
        children[1].setAttribute('style', 'display:none');
      }
    }
    if (children[2] && children[2].children[1]) {
      children[2].children[1].setAttribute('style', 'display:none');
    }
  }
}
