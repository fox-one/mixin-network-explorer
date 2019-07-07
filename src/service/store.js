export default {
  setNodes(nodes) {
    for (let ix = 0; ix < nodes.length; ix++) {
      const node = nodes[ix]
      const key = 'NODE-' + node.id
      localStorage.setItem(key, JSON.stringify(node))
    }
    return nodes
  },
  setNode(node) {
    const key = 'NODE-' + node.id
    localStorage.setItem(key, JSON.stringify(node))
    return node
  },
  getNode(id) {
    const key = 'NODE-' + id
    let rep = localStorage.getItem(key)
    if (rep) {
      try {
        return JSON.parse(rep)
      } catch (e) {
        return null
      }
    }
    return null
  }
}