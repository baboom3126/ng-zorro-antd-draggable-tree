import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v4 } from 'uuid';

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

  constructor() {}
  ngOnInit() {}
  counter = 0;
  addParent() {
    this.nodes[0].children?.push({
      title: 'And' + this.counter,
      key: v4(),
      type: 'parent',
      data: '{}',
      isLeaf: false,
      expanded: true,
      children: [],
    });
    this.counter = this.counter + 1;
    this.nodes = [...this.nodes];
  }
  addChild() {
    console.log(123123);
    this.nodes[0].children?.push({
      title: 'child ' + this.counter,
      key: v4(),
      type: 'child',
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
      type: 'parent',
      data: '',
      expanded: true,
      children: [
        {
          title: '0-0-0',
          key: '000',
          type: 'parent',
          data: '',
          expanded: true,
          children: [
            {
              title: '0-0-0-0',
              key: '0000',
              type: 'parent',
              data: '',
              expanded: true,
              children: [
                {
                  title: '0-0-0-0-0',
                  key: '00000',
                  type: 'child',
                  data: '',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: '0-0-1',
          key: '001',
          expanded: true,
          type: 'parent',
          data: '',
          children: [
            {
              title: '0-0-1-0',
              key: '0010',
              type: 'child',
              data: '',
              isLeaf: true,
            },
          ],
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
      const targetNode = event.node;
      const targetChildren = event.node?.getChildren();

      if (targetChildren && event.dragNode) {
        if (targetNode?.origin['type'] === 'parent') {
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
        } else if (targetNode?.origin['type'] === 'child') {
          const tmpDragNode = { ...event.dragNode.origin };
          const tmp = [];
          tmp.push(tmpDragNode);
          tmp.push(event.node?.origin);

          event.dragNode.remove();
          event.node?.remove();

          targetNode.parentNode?.addChildren([
            {
              title: 'And' + this.counter,
              key: v4(),
              type: 'parent',
              data: '{}',
              isLeaf: false,
              children: tmp,
              expanded: true,
            },
          ]);

          this.initElementStyle(event);
        }
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
    // console.log(event);

    this.removeDropIndicator(event.event);
  }
  drop(event: NzFormatEmitEvent): void {
    console.log(`drop`);
    console.log(event);
  }
  dragEnd(event: NzFormatEmitEvent): void {
    console.log(`dragEnd`);
    console.log(event);
  }
  dragLeave(event: NzFormatEmitEvent): void {
    this.initElementStyle(event);
  }
  dragEnter(event: NzFormatEmitEvent): void {
    console.log(event);
  }
  setElementStyle(event: NzTreeNode | any): void {
    event.event.currentTarget.setAttribute(
      'style',
      'color: white; background: red'
    );
  }
  initElementStyle(event: NzFormatEmitEvent | any): void {
    event.event.currentTarget.setAttribute('style', '');
  }
  removeDropIndicator(event: NzFormatEmitEvent['event'] | any): void {
    const children = event.currentTarget.children;
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
