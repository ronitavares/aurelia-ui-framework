//
// @description :
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT

import { autoinject, customElement, bindable, bindingMode, children, inlineView, useView, computedFrom, containerless, View, DOM } from 'aurelia-framework';
import { UITreeModel } from "../../data/ui-treemodel";
import { UIEvent } from "../../utils/ui-event";
import * as _ from "lodash";

@autoinject()
@inlineView(`<template class="ui-tree-panel"><ui-input-group class="ui-tree-search" if.bind="searchable">
  <ui-input type="search" t="[placeholder]Search" placeholder="\${labelSearch}" clear value.bind="searchText" input.trigger="searchTextChanged(searchText) & debounce:200"><ui-input-addon class="ui-text-muted" glyph="glyph-search"></ui-input-addon></ui-input></ui-input-group>
  <div class="ui-tree-container" nodeclick.delegate="itemClicked($event.detail)" nodeover.delegate="itemOver($event.detail)" nodeout.delegate="itemOut($event.detail)">
    <tree-node repeat.for="child of dataSource.children | sort:'text'" node.bind="child" tree.bind="$parent"></tree-node>
  </div></template>`)
@customElement('ui-tree')
export class UITree {
  constructor(public element: Element) {
    this.checkable = element.hasAttribute('checkable');
    if (element.hasAttribute('show-lines')) element.classList.add('ui-lines');
    if ((this.searchable = element.hasAttribute('searchable'))) element.classList.add('has-search');
  }

  @bindable({ defaultBindingMode: bindingMode.twoWay }) value = '';

  @bindable() dataSource: UITreeModel = null;

  @bindable() labelSearch = 'Search...';
  @bindable() labelNoitems = 'No items';
  @bindable() labelMore = 'More...';
  @bindable() labelLess = 'Less...';

  @bindable() maxLevels = '99';
  @bindable() checkLevel = '0';
  @bindable() selectLevel = '0';
  @bindable() maxNodes = '0';

  private root: UITreeModel;
  private searchText: string = '';
  private selectedNode: any = {};

  private searchable = false;
  private checkable = false;

  private ignoreChange = false;

  valueChanged(newValue) {
    if (this.ignoreChange) return;
    if (!this.checkable) {
      if (this.selectedNode) {
        let p = this.selectedNode;
        p.active = false;
        do { p.childActive = false } while (p = p.parent);
      }
      this.selectedNode = this.findNode(this.root.children, newValue, 'active', true, true);
    }
    else {
      if (isEmpty(newValue)) return;
      _.forEach(this.root.children, n => n.isChecked = false);
      if (newValue) _.forEach((newValue || '').split(','), v => this.findNode(this.root.children, v, 'checked', true, true));
    }
  }

  public expandAll() {
    this.root.expandToggle(true);
  }
  public collapseAll() {
    this.root.expandToggle(false);
  }

  public getChecked(nodes?, retVal = { checked: [], partial: [], unchecked: [] }) {
    var self = this;
    _.forEach(nodes || this.dataSource.children, (n: UITreeModel) => {
      if (n.checked == 2) retVal.partial.push(n.id);
      if (n.checked == 1) retVal.checked.push(n.id);
      if (n.checked == 0) retVal.unchecked.push(n.id);
      if (_.isArray(n.children)) self.getChecked(n.children, retVal);
    });
    return retVal;
  }

  public getCheckedTree(nodes?) {
    var self = this, retVal = [];
    _.forEach(nodes || this.dataSource.children, (n: UITreeModel) => {
      if (n.checked == 1 && n.leaf) {
        retVal.push(n.data);
      }
      if (n.checked != 0 && !n.leaf) {
        let node = n.data;
        node.children = self.getCheckedTree(n.children);
        retVal.push(node);
      }
    });
    return retVal;
  }

  private itemClicked(node) {
    if (node.root) return;

    if (this.checkable) {
      if (node.level >= parseInt(this.checkLevel)) {
        this.itemChecked(node);
      }
      else {
        node.expanded = !node.expanded;
      }
    }
    else if (node.level < parseInt(this.selectLevel)) {
      node.expanded = !node.expanded;
    }
    else if (node.level >= parseInt(this.selectLevel)) {
      this.itemSelect(node);
    }
  }

  private itemSelect(node) {
    if (UIEvent.fireEvent('beforeselect', this.element, node)) {
      let p;
      this.ignoreChange = true;
      if (this.selectedNode) {
        (p = this.selectedNode).active = false;
        while (p = p.parent) p.childActive = false;
      }
      (p = this.selectedNode = node).active = true;
      while (p = p.parent) p.childActive = true;
      this.value = node.id;
      this.filter(this.root.children, this.searchText = '');
      this.scrollIntoView();
      UIEvent.fireEvent('select', this.element, node);
      UIEvent.queueTask(() => this.ignoreChange = false);
    }
  }

  private itemChecked(node) {
    if (UIEvent.fireEvent('beforechecked', this.element, node)) {
      this.ignoreChange = true;
      node.isChecked = !node.checked;
      let nodes = this.getChecked(this.dataSource.children);
      this.value = nodes.checked.join(',');
      UIEvent.fireEvent('checked', this.element, node);
      UIEvent.queueTask(() => this.ignoreChange = false);
    }
  }

  private findNode(obj, id, field?, value = true, expand = false) {
    var self = this;
    return _.find(obj, (n: UITreeModel) => {
      var found = n.id == id;
      if (!found && _.isArray(n.children)) {
        found = !_.isEmpty(self.findNode(n.children, id, field, value));
        if (expand && found) n.expanded = true;
      }
      else if (found) {
        if (field == 'active') self.itemSelect(n);
        if (field == 'expanded') n.expanded = value;
        if (field == 'checked') n.isChecked = value ? 1 : 0;
      }

      return found;
    });
  }

  private scrollIntoView() {
    UIEvent.queueTask(() => {
      let x;
      if ((x = this.element.querySelector('.ui-active')) !== null) x.scrollIntoView(false);
    });
  }

  private searchTextChanged(newValue) {
    this.filter(this.dataSource.children, newValue);
  }

  private filter(obj, value, parentVisible: boolean = false): boolean {
    var self = this, ret = false, rx = new RegExp(value.ascii(), 'gi');

    _.forEach(obj, (n: UITreeModel) => {
      n.label = '';
      n.expanded = !_.isEmpty(value) && parentVisible === false;

      if (_.isEmpty(value) && self.selectedNode.id == n.id && self.selectedNode.level == n.level) {
        var p = n.parent;
        while (p) {
          p.expanded = true;
          p = p.parent;
        }
      }
      var match = rx.test(n.text.ascii());
      if (!_.isEmpty(value) && match) {
        n.parent.expanded = true;
        let start = n.text.ascii().search(rx);
        let name = n.text.substr(0, start + value.length) + '</u>' + n.text.substr(start + value.length);
        n.label = name.substr(0, start) + '<u>' + name.substr(start);
      }

      n.isVisible = n.children.length > 0 ? self.filter(n.children, value, match) : (match);

      ret = ret || n.isVisible;
    });

    return ret;
  }
}

@autoinject()
@containerless()
@inlineView(`<template><div class="ui-tree-node \${node.leaf?'ui-leaf':''}" if.bind="node.isVisible">
    <div class="ui-node-label-row \${node.disabled?'ui-disabled':''}">
      <div class="ui-node-line \${i==node.level-1?'':'parent'}" repeat.for="i of node.level" if.bind="node.level>0"></div>
      <div if.bind="!node.leaf" class="ui-node-expander" click.trigger="node.expanded=!node.expanded">
        <ui-glyph glyph.bind="node.expanded?'glyph-tree-collapse':'glyph-tree-expand'"></ui-glyph>
      </div>
      <div class="ui-node-checkbox" if.bind="tree.checkable" click.trigger="fireClicked()">
        <ui-glyph glyph.bind="node.checked==2?'glyph-tree-check-partial': (node.checked==1?'glyph-tree-check-on':'glyph-tree-check-off')"></ui-glyph>
      </div>
      <div class="ui-node-label" click.trigger="fireClicked()">
        <ui-glyph glyph.bind="node.icon" if.bind="node.icon"></ui-glyph>
        <span innerhtml.bind="node.label || node.text"></span>
      </div>
    </div>
    <div class="ui-tree-children" if.bind="!node.leaf && node.expanded">
      <tree-node node.bind="child" repeat.for="child of node.children | sort:'text'" tree.bind="tree"></tree-node>
    </div>
    <div class="ui-tree-node" if.bind="!node.leaf && node.expanded && node.children">
    <div class="ui-node-label-row last-info-line">
      <div class="ui-node-expander" repeat.for="i of (node.level+1)"></div>
      <div class="ui-node-checkbox" if.bind="tree.checkable"></div>
      <div>
      <span class="ui-text-muted ui-font-small" t="No Items" if.bind="node.children.length==0">\${tree.labelNoitems}</span>
      <a class="ui-font-small ui-strong" click.trigger="hideByCount=false" if.bind="canHideByCount && hideByCount" t="More">\${tree.labelMore}</a>
      <a class="ui-font-small ui-strong" click.trigger="hideByCount=true" if.bind="canHideByCount && !hideByCount" t="Less">\${tree.labelLess}</a>
    </div></div></div>
</template>`)
export class TreeNode {
  constructor(public element: Element) { }

  @bindable() tree: UITree;
  @bindable() node: UITreeModel;

  private fireClicked() {
    UIEvent.fireEvent('nodeclick', this.element, this.node);
  }

  private doMouseOver() {
    UIEvent.fireEvent('nodeover', this.element, this.node);
  }

  private doMouseOut() {
    UIEvent.fireEvent('nodeout', this.element, this.node);
  }
}
