import React from 'react'
import { message } from 'antd'
import {
  isEmpty,
  has,
  pick,
  omit,
  keyBy,
  intersection,
  flattenDeep,
  difference,
  compact,
} from 'lodash'
import { NODE_TYPE, NODE_POSITION, WORKFLOW_CONFIG } from '~/configs'
import { FormattedMessage } from 'react-intl'

/* eslint-disable */
const validateNode = (d) => {
  if (d.typeNode === NODE_TYPE.SQUART) {
    if (d.stepName) {
      return true
    }
    throw ("ERROR_VALIDATE_SQUART_NODE")
  } else if (d.typeNode === NODE_TYPE.PARELLELOGRAM) {
    if (d.stepName) {
      return true
    }
    throw ("ERROR_VALIDATE_CIRCLE_NODE")
  } else if (d.typeNode === NODE_TYPE.DIAMOND) {
    if (d.conditions && d.conditions.length > 0) {
      return true
    }
    throw ("ERROR_VALIDATE_DIAMOND_NODE")
  }
}


export const formatNode = (d, level, jobId) => {
  if (validateNode(d)) {
    const baseData = {
      type: d.typeNode,
      level,
      jobId,
      isPerUpdate: d.isPerUpdate,
    }
    if (d.nodeId) {
      baseData.id = d.nodeId
    }
    if (d.typeNode === NODE_TYPE.SQUART || d.typeNode === NODE_TYPE.PARELLELOGRAM) {
      let n = { ...d }
      if (d.positionNode === NODE_POSITION.HEAD) {
        n = omit(d, [
          "approver",
          "approverCCs",
          "departmentId",
          "positionId"
        ])
      }
      return ({
        ...omit(n, [
          "id",
          "ProjectDetailEmployeeApprove",
          "ProjectDetailDepartment",
          "ProjectDetailPosition",
          "ProjectDetailEmployeeApproveCC",
          "from",
          "to",
          "type",
          "action",
          "selected",
          "name",
          "typeNode",
          "nodeId",
          "approverName"
        ]),
        ...baseData
      })
    }
    return ({
      ...pick(d, [
        "index",
        "frontNode",
        "positionNode",
        "processId",
        "conditions",
        "xCoord",
        "yCoord",
      ]),
      ...baseData,
      level: level + 1,
    })
  }
}

export const parseProcessData = (data, keys = [], jobId) => {
  try {
    const { activeNodeLayer: { models } } = data;
    const nodes = Object.values(models);
    let midNode = []
    let headNode = {}
    let tailNode = []
    const len = nodes.length

    for (let i = 0; i < len; i++) {
      const it = nodes[i]
      it.options.xCoord = it.position.x
      it.options.yCoord = it.position.y

      if (isEmpty(it.ports.right.links) && isEmpty(it.ports.left.links)) {
        throw ("ERROR_VALIDATE_NODE_EMPTY_LINKED")
      }

      if (has(it, 'ports.left.links') && isEmpty(it.ports.left.links)) {
        headNode = it
        it.options.positionNode = NODE_POSITION.HEAD
        continue
      }
      else if (has(it, 'ports.right.links') && isEmpty(it.ports.right.links)) {
        it.options.positionNode = NODE_POSITION.TAIL
        tailNode.push(it)
        continue;
      }
      it.options.positionNode = NODE_POSITION.MIDDLE
      midNode.push(it)
    }

    const processes = getAllProcess(headNode)
    const mergeProcess = flattenDeep(Object.values(processes))

    const diff = difference(keys, Object.keys(keyBy(mergeProcess.slice(1), "options.processId")))


    const formatProcesses = {}
    let count = 0
    processes.forEach((p, idx) => {
      let level = 0
      const slice = p.slice(1)
      const processIds = compact(Object.keys(keyBy(slice, "options.processId")))
      const commonEl = intersection(keys, processIds)
      count += commonEl.length
      const key = (commonEl.length > 0 && !!commonEl[0]) ? commonEl[0] : idx + 1 - count
      formatProcesses[key] = p.map(n => {
        (
          n.options.typeNode === NODE_TYPE.SQUART ||
          n.options.typeNode === NODE_TYPE.PARELLELOGRAM
        ) && level++
        return {
          ...formatNode(n.options, level, jobId),
          processId: commonEl[0],
        }
      })
    })


    // processes removed
    compact(diff).forEach(it => {
      formatProcesses[it] = []
    })

    return formatProcesses
  } catch (err) {
    console.log("error: ", err)
    if (err === "ERROR_VALIDATE_DIAMOND_NODE") {
      message.warning(
        <FormattedMessage
          id="ERROR_VALIDATE_DIAMOND_NODE"
          defaultMessage="Khối điều kiện thiếu dữ liệu bắt buộc"
        />
      )
    } else if (err === "ERROR_VALIDATE_SQUART_NODE") {
      message.warning(
        <FormattedMessage
          id="ERROR_VALIDATE_SQUART_NODE"
          defaultMessage="Khối cấu hình bước duyệt thiếu dữ liệu bắt buộc"
        />
      )
    } else if (err === "ERROR_VALIDATE_CIRCLE_NODE") {
      message.warning(
        <FormattedMessage
          id="ERROR_VALIDATE_CIRCLE_NODE"
          defaultMessage="Khối cấu hình bước tiếp nhận thiếu dữ liệu bắt buộc"
        />
      )
    } else if (err === "ERROR_VALIDATE_NODE_EMPTY_LINKED") {
      message.warning(
        <FormattedMessage
          id="ERROR_VALIDATE_NODE_EMPTY_LINKED"
          defaultMessage="Có một bước hoặc điều kiện không được liên kết"
        />
      )
    }
  }
}

export function getAllProcess(object) {
  try {
    const neighborNode = Object.values(object.ports.right.links).map(it => it.options.id)
    let count = 1
    function iter(o, p) {
      var nodes = Object.values(o.ports.right.links);
      if (nodes.length) {
        return nodes.forEach(function (k) {
          if (neighborNode.indexOf(k.options.id) !== -1) {
            object.options.index = 0
            p = [{ ...object }]
          }
          count++
          const parent = k.targetPort.parent
          parent.options.index = has(parent, 'options.index') ? parent.options.index : count
          parent.options.frontNode = o.options.index
          iter(parent, p.concat(parent));
        });
      }
      result.push(p);
    }

    var result = [];
    iter(object, []);
    return result;
  } catch (err) {
    console.log("error: ", err)
  }
}

export function reDistribute(headNode) {
  try {
    const disX = WORKFLOW_CONFIG.REDISTRIBUTE_CONFIG.DISTANCE_X
    const disY = WORKFLOW_CONFIG.REDISTRIBUTE_CONFIG.DISTANCE_Y
    const object = { ...headNode }

    let x = 100
    let y = disY
    let count = 1
    let totalY = -2
    function iter(o) {
      let rightNodes = Object.values(o.ports.right.links)
      const len = rightNodes.length
      if (len > 0) {
        x += disX
        return rightNodes.forEach(function (k) {
          const target = k.targetPort.parent
          const source = k.sourcePort.parent
          // if (source.options.typeNode === NODE_TYPE.SQUART &&
          //   target.options.typeNode === NODE_TYPE.PARELLELOGRAM
          // ) {
          //   y -= 0
          // }
          // if (source.options.typeNode === NODE_TYPE.SQUART &&
          //   target.options.typeNode === NODE_TYPE.SQUART
          // ) {
          //   y -= 2
          // }
          if (
            isEmpty(source.ports.left.links) && 
            target.options.typeNode !== NODE_TYPE.DIAMOND
          ) {
            y -= 2
          }
          if (source.options.typeNode === NODE_TYPE.DIAMOND &&
            (
              target.options.typeNode === NODE_TYPE.SQUART ||
              target.options.typeNode === NODE_TYPE.PARELLELOGRAM
            )
          ) {
            x -= 60
            y -= 2
          }
          target.setPosition(x, y)
          iter(target)
        })
      }
      else {
        x = disX + 100
        y = (count + 1) * disY
        totalY += count * disY
        count++
      }
    }
    iter(object);
    const originY = totalY / (count - 1)
    headNode.setPosition(100, originY)
  } catch (err) {
    console.log("error: ", err)
  }
}