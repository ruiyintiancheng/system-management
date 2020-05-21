<template>
    <el-tree 
    ref="extraTree"
    :data="data"
    :empty-text="emptyText"
    :node-key="nodeKey"
    :props="props" 
    :render-after-expand="renderAfterExpand"
    :render-content="renderContent"
    :load="load"
    :highlight-current="load"
    :expand-on-click-node="expandOnClickNode"
    :default-expand-all="defaultExpandAll"
    :check-on-click-node="checkOnClickNode"
    :auto-expand-parent="autoExpandParent"
    :default-expanded-keys="defaultExpandedKeys"
    :default-checked-keys="defaultCheckedKeys"
    :current-node-key="currentNodeKey"
    :filter-node-method="filterNodeMethod"
    :accordion="accordion"
    :indent="indent"
    :icon-class="iconClass"
    :lazy="lazy"
    :draggable="draggable"
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"


    check-strictly
    show-checkbox
    @check="handleNodeClick"
    @current-change="currentChange"
    @node-expand="nodeExpand"
    @node-click="nodeClick"
    @node-contextmenu="nodeContextmenu"
    @check-change="checkChange"
    @node-collapse="nodeCollapse"
    @node-drag-start="nodeDragStart"
    @node-drag-enter="nodeDragEnter"
    @node-drag-leave="nodeDragLeave"
    @node-drag-over="nodeDragOver"
    @node-drag-end="nodeDragEnd"
    @node-drop="nodeDrop"
    >
    </el-tree>
</template>
<script>
  export default {
    props: {
      upCheck: {
        type: Boolean,
        default: false
      },
      downCheck: {
        type: Boolean,
        default: false
      },
      upCancel: {
        type: Boolean,
        default: false
      },
      downCancel: {
        type: Boolean,
        default: false
      },

      data: Array,
      emptyText: String,
      nodeKey: String,
      props: {
        type: Object
      },
      renderAfterExpand: Boolean,
      load: Function,
      renderContent: Function,
      highlightCurrent: Boolean,
      defaultExpandAll: {
        type: Boolean,
        default: true
      },
      expandOnClickNode: Boolean,
      checkOnClickNode: Boolean,
      autoExpandParent: Boolean,
      defaultExpandedKeys: Array,
      defaultCheckedKeys: Array,
      currentNodeKey: [String, Number],
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: Number,
      iconClass: String,
      lazy: Boolean,
      draggable: Boolean,
      allowDrag: Function,
      allowDrop: Function
    },
    data() {
      return {
      }
    },
    methods: {
      handleNodeClick(...arg) {
        const data = arg[0]
        const a = arg[1]
        const currentNodeStatus = a.checkedKeys.some(item => item === data[this.nodeKey])
        if ((this.downCheck && this.downCheck === currentNodeStatus) || (this.downCancel && this.downCancel !== currentNodeStatus)) {
          const arr = []
          this.findChildrenNodeKey(this.data, arr, data[this.nodeKey])
          for (const key of arr) {
            this.$refs.extraTree.setChecked(key, currentNodeStatus)
          }
        }
        if ((this.upCheck && this.upCheck === currentNodeStatus) || (this.upCancel && this.upCancel !== currentNodeStatus)) {
          this.findParentNodeKey(this.data, data[this.nodeKey], function(keys) {
            for (const key of keys) {
              this.$refs.extraTree.setChecked(key, currentNodeStatus)
            }
          }.bind(this))
        }
        this.$emit('check', ...arg)
      },
      // 查找所有子节点
      findChildrenNodeKey(data, arr, nodeKey, hasChildKey) {
        for (const iterator of data) {
          if (iterator[this.nodeKey] === nodeKey || hasChildKey) {
            arr.push(iterator[this.nodeKey])
            if (iterator.children && iterator.children.length > 0) {
              this.findChildrenNodeKey(iterator.children, arr, nodeKey, true)
            }
          } else {
            if (iterator.children && iterator.children.length > 0) {
              this.findChildrenNodeKey(iterator.children, arr, nodeKey)
            }
          }
        }
      },
      // 查找所有层级父节点
      findParentNodeKey(data, nodeKey, callback) {
        const arr = []
        try {
          const getNodePath = tree => {
            for (const iterator of tree) {
              if (iterator[this.nodeKey] === nodeKey) {
                throw (iterator)
              }
              arr.push(iterator[this.nodeKey])
              if (iterator.children && iterator.children.length > 0) {
                getNodePath(iterator.children)
              }
              arr.pop()
            }
          }
          getNodePath(data)
        } catch (e) {
          callback(arr)
        }
      },
      // 方法回调
      filter(...arg) {
        this.$refs.extraTree.filter(...arg)
      },
      updateKeyChildren(...arg) {
        this.$refs.extraTree.updateKeyChildren(...arg)
      },
      getCheckedNodes(...arg) {
        return this.$refs.extraTree.getCheckedNodes(...arg)
      },
      setCheckedNodes(...arg) {
        this.$refs.extraTree.setCheckedNodes(...arg)
      },
      getCheckedKeys(...arg) {
        return this.$refs.extraTree.getCheckedKeys(...arg)
      },
      setCheckedKeys(...arg) {
        this.$refs.extraTree.setCheckedKeys(...arg)
      },
      setChecked(...arg) {
        this.$refs.extraTree.setChecked(...arg)
      },
      getHalfCheckedNodes(...arg) {
        return this.$refs.extraTree.getHalfCheckedNodes(...arg)
      },
      getHalfCheckedKeys(...arg) {
        return this.$refs.extraTree.getHalfCheckedKeys(...arg)
      },
      getCurrentKey(...arg) {
        return this.$refs.extraTree.getCurrentKey(...arg)
      },
      getCurrentNode(...arg) {
        return this.$refs.extraTree.getCurrentNode(...arg)
      },
      setCurrentKey(...arg) {
        this.$refs.extraTree.setCurrentKey(...arg)
      },
      setCurrentNode(...arg) {
        this.$refs.extraTree.setCurrentNode(...arg)
      },
      getNode(...arg) {
        return this.$refs.extraTree.getNode(...arg)
      },
      remove(...arg) {
        this.$refs.extraTree.remove(...arg)
      },
      append(...arg) {
        this.$refs.extraTree.append(...arg)
      },
      insertBefore(...arg) {
        this.$refs.extraTree.insertBefore(...arg)
      },
      insertAfter(...arg) {
        this.$refs.extraTree.insertAfter(...arg)
      },
      // 事件回调
      nodeClick(...arg) {
        this.$emit('node-click', ...arg)
      },
      nodeContextmenu(...arg) {
        this.$emit('node-contextmenu', ...arg)
      },
      checkChange(...arg) {
        this.$emit('check-change', ...arg)
      },
      currentChange(...arg) {
        this.$emit('current-change', ...arg)
      },
      nodeExpand(...arg) {
        this.$emit('node-expand', ...arg)
      },
      nodeCollapse(...arg) {
        this.$emit('node-collapse', ...arg)
      },
      nodeDragStart(...arg) {
        this.$emit('node-drag-start', ...arg)
      },
      nodeDragEnter(...arg) {
        this.$emit('node-drag-enter', ...arg)
      },
      nodeDragLeave(...arg) {
        this.$emit('node-drag-leave', ...arg)
      },
      nodeDragOver(...arg) {
        this.$emit('node-drag-over', ...arg)
      },
      nodeDragEnd(...arg) {
        this.$emit('node-drag-end', ...arg)
      },
      nodeDrop(...arg) {
        this.$emit('node-drop', ...arg)
      }
    }
  }
</script>