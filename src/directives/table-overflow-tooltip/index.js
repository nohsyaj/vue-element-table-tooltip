import { popover } from './popover/index.js'

const directive = (theme) => {
  let controller = new AbortController()
  let instance = null
  const update = (el, binding, vnode, oldVnode) => {
    if (binding.value === undefined || !!binding.value === true) {
      if (controller) {
        controller.abort() // destroy old eventListenner
        controller = new AbortController()
      }
      if (instance) {
        instance.$destroy()
      }
      vnode.componentInstance.$nextTick(() => {
        const columnId = vnode.componentInstance.columnId
        const table = vnode.componentInstance.$parent
        if (columnId) {
          const cells = table.$el.querySelectorAll(`tbody td.${columnId} .cell`)
          for (const cell of cells) {
            cell.style.overflow = "hidden"
            cell.style.whiteSpace = "nowrap"
            cell.style.textOverflow = "ellipsis"
            cell.style.wordBreak = "break-all"
            cell.addEventListener("mouseenter", () => {
              const range = document.createRange();
              range.setStart(cell, 0);
              range.setEnd(cell, cell.childNodes.length);
              const rangeWidth = range.getBoundingClientRect().width;
              const paddingLeft = window.getComputedStyle(cell).paddingLeft.replace("px", "")
              const paddingRight = window.getComputedStyle(cell).paddingRight.replace("px", "")
              const padding = parseInt(paddingLeft) + parseInt(paddingRight)
              if (rangeWidth + padding > cell.offsetWidth || cell.scrollWidth > cell.offsetWidth) {
                if (instance) {
                  instance.$destroy()
                }
                instance = popover({
                  effect: binding.arg || theme,
                  reference: cell,
                  content: cell.innerText,
                })
              }
            }, { signal: controller.signal })
          }
        }
      })
    }
  }
  const unbind = () => {
    if (controller) {
      controller.abort()
    }
    if (instance) {
      instance.$destroy()
    }
  }
  return {
    bind: update,
    update,
    unbind,
  }
}

export default directive("dark")

export const dark = directive("dark")

export const light = directive("light")