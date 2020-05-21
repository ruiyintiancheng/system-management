/*
 * @Author: lk 
 * @Date: 2019-07-22 11:31:40 
 * @Last Modified by: lk
 * @Last Modified time: 2019-07-22 14:00:43
 * @Description:  表关系图
 */
<template>
    <div id="tableCanvasFlowChart" class="relation-chart" :style="{height:chartHeight+'px'}">
        
    </div>
</template>
<script>
export default {
  computed: {
    chartHeight: function() {
      return this.$store.state.app.dialogHeight - 160
    },
    mouseSite: function() {
      return this.shareObject[this.name]
    }
  },
  mounted() {
    this.initG6()
  },
  data() {
    return {
      sourceData: {},
      net: '',
      activationNode: '', // 当前激活的节点
      isBlank: true, // 当前是空白区
      type: '', // 有值为编辑状态
      dragNode: '', // 当前拖动的节点
      shareObject: {
        event: {}
      }
    }
  },
  methods: {
    initG6() {
      const Canvas = document.querySelector('.relation-chart')
      const width = Canvas.clientWidth
      const height = Canvas.offsetHeight
      Canvas.oncontextmenu = function(e) {
        return false
      }
      const self = this
      self.Util = window.G6.Util
      self.net = new window.G6.Net({
        id: 'tableCanvasFlowChart', // 容器ID
        mode: 'edit',
        grid: {
          forceAlign: true, // 是否支持网格对齐
          cell: 25 // 网格大小
        },
        modes: {
          edit: [
            'dragNode', 'clickBlankClearActive', 'clickActive', 'dragNodeEndSetActive', 'hoverNodeShowAnchor',
            'multiSelect', 'resizeNode', 'hoverAnchorSetActived', 'dragEdgeEndHideAnchor', 'dragHideTexts', 'shortcut'
          ],
          add: ['clickAddNode', 'dragAddEdge', 'hoverAnchorSetActived', 'hoverNodeShowAnchor'],
          drag: ['shortcut', 'dragCanvas', 'wheelZoom', 'clickFocus']
        },
        width: width,
        height: height
      })
      /** 点击节点*/
      self.net.on('itemclick', function(ev) {
      })
      self.net.on('dblclick', function(ev) {
        self.save()
      })
      /** 鼠标放到锚点上 触发画线函数 */
      var dragging = true
      self.net.on('mousedown', function(ev) {
        dragging = false
      })
      self.net.on('mouseup', ev => {
        dragging = true
      })
      self.net.on('mouseenter', function(ev) {
        if (self.Util.isNode(ev.item)) {
          self.activationNode = ev.item
        }
        var shape = ev.shape
        if (shape && shape.hasClass('anchor-point') && dragging) {
          self.net.beginAdd('edge', {
            shape: 'relationLine'
            // shape: 'polyline'
          })
        }
      })
      self.net.on('mouseleave', function(ev) {
        var shape = ev.shape
        if (shape && shape.hasClass('anchor-point') && dragging) {
          self.net.changeMode('edit')
        }
      })
      // 注册边
      window.G6.registEdge('relationLine', {
        draw: function(cfg, group) {
          const edgePoints = []
          // const tableWidth = tablelist.get(cfg.model.source)
          var keyShape = ''
          var model = cfg.model
          if (model.source === model.target) {
            return
          }
          var source = self.net.find(model.source)
          var sourcePoints = source.getAnchorPoints()
          var target = self.net.find(model.target)
          var targetPoints = target.getAnchorPoints()
          if (model.targetAnchor === void 0 || model.targetAnchor === null) {
            var minDistance
            for (var i = 0; i < targetPoints.length; i++) {
              var temp = Math.pow(targetPoints[i].x - model.targetEvent.x, 2) + Math.pow(targetPoints[i].y - model.targetEvent.y, 2)
              if (!minDistance) {
                minDistance = temp
              }
              if (temp <= minDistance) {
                minDistance = temp
                model.targetAnchor = i
              }
            }
          }
          var sourceEven, sourceOdd, targetEven, targetOdd
          sourceEven = model.sourceAnchor % 2 === 0 ? model.sourceAnchor : model.sourceAnchor - 1
          sourceOdd = sourceEven + 1
          targetEven = model.targetAnchor % 2 === 0 ? model.targetAnchor : model.targetAnchor - 1
          targetOdd = targetEven + 1

          sourcePoints[sourceOdd].x < targetPoints[targetEven].x ? edgePoints.push([sourcePoints[sourceOdd].x, sourcePoints[sourceOdd].y], [targetPoints[targetEven].x, targetPoints[targetEven].y]) : edgePoints.push([targetPoints[targetOdd].x, targetPoints[targetOdd].y], [sourcePoints[sourceEven].x, sourcePoints[sourceEven].y])

          keyShape = group.addShape('polyline', {
            attrs: {
              points: edgePoints,
              stroke: 'red',
              arrow: true,
              lineWidth: '1'
            }
          })
          // group.addShape('text', {
          //   attrs: {
          //     x: (edgePoints[0][0] + edgePoints[edgePoints.length - 1][0]) / 2,
          //     y: (edgePoints[0][1] + edgePoints[edgePoints.length - 1][1]) / 2,
          //     // x: (cfg.points[0].x + cfg.points[1].x) / 2,
          //     // y: (cfg.points[0].y + cfg.points[1].y) / 2,
          //     text: '完全匹配的记录',
          //     // 主表的全部记录
          //     // 关联表的全部记录',
          //     textBaseline: 'bottom',
          //     textAlign: 'center',
          //     // fontSize: 18,
          //     stroke: 'black'
          //   }
          // })
          return keyShape
        }
      })
      // 节点创建
      window.G6.registerNode('table', {
        cssSize: true, // 不使用内部 size 作为节点尺寸
        getHtml: function(cfg, group) {
          const model = cfg.model
          const container = self.Util.createDOM('<div class="node" style="border: 1px solid #ccc;border-radius::4px;"></div>')
          const title = self.Util.createDOM('<div style="padding:5px;text-align:center;background-color: #66b1ff;color:white">' + model.tableName + '</div>')
          const list = self.Util.createDOM('<div style="padding:8px 0;"></div>')
          self.Util.each(model.fields, function(field, i) {
            const div = self.Util.createDOM("<div style='margin:0 10px;height:25px;'><div>")
            var spanDom = document.createElement('span')
            spanDom.innerHTML = field.name
            spanDom.style.margin = '0 5px'
            div.appendChild(spanDom)
            list.appendChild(div)
          })
          container.appendChild(title)
          container.appendChild(list)
          return container
        },
        getAnchorPoints: function(cfg, group) { // 锚点位置
          const points = []
          const fields = cfg.model.fields
          const height = fields.length * 25 + 45
          for (var i = 0; i < fields.length; i++) {
            points.push([0, (32 + 12.5 + i * 25) / height, { style: {
              fill: 'red',
              fillOpacity: 0.5
            }}])
            points.push([1, (32 + 12.5 + i * 25) / height, { style: {
              fill: 'red',
              fillOpacity: 0.5
            },
            hoverStyle: {},
            value: fields[i].name
            }
            ])
          }
          return points
        },
        afterDraw: function(cfg, group) {
          // tablelist.put(cfg.model.id, cfg.html.offsetWidth)
        }
      }, 'html')
      // self.net.render()

      this.net.source({ 'nodes': [{
        id: 'abddsdfasdf',
        x: Canvas.clientWidth * 0.3,
        y: Canvas.clientHeight * 0.3,
        shape: 'table',
        nodeType: 0,
        tableName: '表字段',
        fields: [{ name: '主键', id: 1001 }, { name: '表id', id: 1003 }, { name: '字段名', id: 1004 }, { name: '字段注释', id: 1005 }, { name: '字段顺序', id: 1006 }, { name: '字段类型', id: 1007 }, { name: '数据长度', id: 1008 }]
      }, {
        id: '1233455554',
        x: Canvas.clientWidth * 0.6,
        y: Canvas.clientHeight * 0.3,
        shape: 'table',
        nodeType: 0,
        tableName: '表',
        fields: [{ name: '主键', id: 1001 }, { name: '用户id', id: 1003 }, { name: '表名', id: 1004 }, { name: '表注释', id: 1005 }, { name: '是否做权限控制', id: 1006 }, { name: '临时表标志', id: 1007 }]
      }],
      'edges': [
        {
          'shape': 'relationLine',
          'source': 'abddsdfasdf',
          'target': '1233455554',
          'id': '5541412f',
          // 'controlPoints': [
          //   {
          //     'x': 447.7,
          //     'y': 184.66000000000003
          //   },
          //   {
          //     'x': 740.9,
          //     'y': 222.66750000000002
          //   }
          // ],
          'sourceAnchor': 3,
          // 'targetEvent': {
          //   'x': 763,
          //   'y': 172
          // },
          'targetAnchor': 0
        }
      ]
      })
      this.net.render()
    }
  },
  watch: {
    sourceData: function() {
      this.gridChange = true //  网格改变触发 添加事件,需要变量来解决弹窗事件
      this.net.destroy() //  销毁画布
      this.initG6()
      this.net.source(this.sourceData.nodes, this.sourceData.edges)
      this.net.render()
      this.gridChange = false
    },
    mouseSite: function() {
      // 发现坐标改变,在新坐标处添加图形
      const id = 'node' + new Date().getTime()
      var e = this.shareObject.event
      this.net.get('eventAssist')._processEventObj(e)
      const ev = this.net.get('eventAssist').currentEventObj
      this.net.source({ nodes: [{
        id: id,
        x: ev.x,
        y: ev.y,
        shape: 'table',
        nodeType: 0,
        tableName: 'table',
        fields: [{ name: '员工id', id: 1001 }, { name: '年龄', id: 1003 }, { name: '性别', id: 1004 }, { name: '简历', id: 1005 }]
      }] })
      this.net.render()
      // 右侧列表添加
      this.$set(this.nodeList, { 'id': id })
    }
  }
}
</script>
