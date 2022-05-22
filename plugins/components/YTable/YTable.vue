<script>
import Sortable from 'sortablejs'
import { debounce } from '../../utils/util'
import { insertAfter } from '../../utils/dom'

export default {
	name: 'YTable',
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
		columnSortable: {
			type: [Object, Boolean],
			default: false,
		},
		rowSortable: {
			type: [Object, Boolean],
			default: false,
		},
		distabceToBottom: {
			type: Number,
			default: 50,
		},
	},
	data() {
		return {
			// 表格实际所有列数组，
			tableColumns: [],
			// 表格行数据
			tableData: this.data,
			// 列拖拽Sortable实例
			columnSortableInstance: null,
			// 行拖拽Sortable实例
			rowSortableInstance: null,
			// 上次滚动位置
			lastScrollTop: 0,
		}
	},
	watch: {
		data(val) {
			this.tableData = val
		},
		columns() {
			this.getAllColumns()
			const data = this.tableData
			this.tableData = []
			this.$nextTick(() => {
				this.tableData = data
			})
		},
	},
	created() {
		this.getAllColumns()
	},
	mounted() {
		this.columnSortable && this.initColumnSortable()
		this.rowSortable && this.initRowSortable()
		this.proxyHandleScroll = debounce(this.handleScroll, 20, false, this)
		this.bodyWrapper = this.$refs.table.$refs.bodyWrapper
		this.bodyWrapper.addEventListener('scroll', this.proxyHandleScroll)
	},
	beforeDestroy() {
		this.columnSortableInstance && this.columnSortableInstance.destroy()
		this.rowSortableInstance && this.rowSortableInstance.destroy()
		if (this.bodyWrapper && this.proxyHandleScroll) {
			this.bodyWrapper.removeEventListener('scroll', this.proxyHandleScroll)
		}
	},
	methods: {
		getAllColumns() {
			this.tableColumns = []
			const tempTableColumns = []
			const columns = this.columns
			let templateRenderSlots = this.$slots.default || []

			// 无columns，按照$slots.default里vNode顺序生成
			if (columns.length === 0) {
				tempTableColumns.unshift(
					...templateRenderSlots.map(vNode => {
						return {
							vNode,
						}
					})
				)
			}
			// 有columns，按照columns配置生成列，根据prop配对$slots.default里面的vNode，配对不上的舍弃（因为不好确定位置）
			if (columns.length !== 0) {
				columns.forEach(col => {
					const vNode = templateRenderSlots.find(
						vNode => vNode.componentOptions.propsData && vNode.componentOptions.propsData.prop && vNode.componentOptions.propsData.prop === col.prop
					)
					// 1.如果vNode中含有columns设置的列，将columns设置的属性添加到对应vNode上，在render函数内直接返回vNode
					// 2.否则在render函数内根据columns设置生成el-table-column
					if (vNode) {
						Object.keys(col).forEach(key => {
							vNode.componentOptions.propsData[key] = col[key]
						})
						col.vNode = vNode
						tempTableColumns.push(col)
						templateRenderSlots = templateRenderSlots.filter(vNode2 => vNode2 !== vNode)
					} else {
						tempTableColumns.push(col)
					}
				})
			}
			// 修复ele中重新设置表格表格配置时要重新描绘表格
			this.$nextTick(() => {
				this.tableColumns = tempTableColumns
			})
		},
		innerSort(type, container, data, e) {
			const tempData = [...data]
			const newIndex = e.newIndex
			const oldIndex = e.oldIndex
			const temp = tempData[oldIndex]
			container.removeChild(e.item)
			const children = container.children
			if (children.length > 0) {
				oldIndex > 0 ? insertAfter(e.item, children[oldIndex - 1]) : container.insertBefore(e.item, children[0])
			} else {
				container.appendChild(e.item)
			}
			// 固定类型的列不运行拖拽和放置
			// if (type === 'column' && data[newIndex] && data[newIndex].type) {
			// 	return
			// }
			tempData.splice(oldIndex, 1)
			tempData.splice(newIndex, 0, temp)

			// 修复ele中重新设置表格配置时要重新描绘表格
			if (type === 'column') {
				this.tableColumns = []
				this.$nextTick(() => {
					this.tableColumns = tempData
					const updatedColumns = []
					tempData.forEach(item => {
						const colItem = { ...item }
						delete colItem.vNode
						updatedColumns.push(colItem)
					})
					this.$emit('update:columns', updatedColumns)
				})
			} else {
				this.tableData = []
				this.$nextTick(() => {
					this.tableData = tempData
					this.$emit('update:data', tempData)
				})
			}
		},
		/**
		 * 实例化列Sortable
		 */
		initColumnSortable() {
			const tr = this.$refs.table.$refs.tableHeader.$el.getElementsByTagName('tr')[0]
			if (!tr) return

			const options = Object.assign(
				{
					forceFallback: false,
					animation: 150,
				},
				this.columnSortable,
				{
					handle: '.cell',
					filter: '.xdh-table--not-drag',
					onSort: e => {
						this.innerSort('column', tr, this.tableColumns, e)
						/**
						 * 列拖拽排序完成时触发
						 * @event on-column-sort
						 * @param {object} e Sortable事件对象
						 * @param {Array} columns 列定义数组
						 */
						this.$emit('on-column-sort', e, this.tableColumns)
					},
				}
			)

			this.columnSortableInstance = new Sortable(tr, options)
		},
		/**
		 * 实例化行Sortable
		 */
		initRowSortable() {
			const tbody = this.$refs.table.$refs.bodyWrapper.getElementsByTagName('tbody')[0]
			if (!tbody) return

			const options = Object.assign(
				{
					forceFallback: false,
					animation: 150,
				},
				this.rowSortable,
				{
					onSort: e => {
						this.innerSort('row', tbody, this.tableData, e)
						/**
						 * 行拖拽排序完成时触发
						 * @event on-row-sort
						 * @param {object} e Sortable事件对象
						 * @param {Array} data 行数据
						 */
						this.$emit('on-row-sort', e, this.tableData)
					},
				}
			)

			this.rowSortableInstance = new Sortable(tbody, options)
		},
		handleScroll(e) {
			const target = e.target
			const dir = target.scrollTop - this.lastScrollTop > 0 ? 'down' : 'up'
			this.lastScrollTop = target.scrollTop
			const scrollDistance = target.scrollHeight - target.scrollTop - target.clientHeight
			if (dir === 'down' && scrollDistance <= this.distanceToButton) {
				/**
				 * 表格滚动到底部时触发
				 * @event on-reach-bottom
				 * @param {Number} scrollDistance 离底部的距离
				 */
				this.$emit('on-reach-bottom', scrollDistance)
			}

			if (dir === 'up' && target.scrollTop <= this.distanceToButton) {
				/**
				 * 表格滚动到顶部时触发
				 * @event on-reach-top
				 * @param {Number} scrollTop 离顶部的距离
				 */
				this.$emit('on-reach-top', target.scrollTop)
			}

			/**
			 * 表格滚动时触发
			 * @event on-scroll
			 * @param {Object} e 事件对象
			 */
			this.$emit('on-scroll', e)
		},
		clearSelection() {
			this.$refs.table.clearSelection(...arguments)
		},
		toggleRowSelection() {
			this.$refs.table.toggleRowSelection(...arguments)
		},
		toggleAllSelection() {
			this.$refs.table.toggleAllSelection(...arguments)
		},
		toggleRowExpansion() {
			this.$refs.table.toggleRowExpansion(...arguments)
		},
		setCurrentRow() {
			this.$refs.table.setCurrentRow(...arguments)
		},
		clearSort() {
			this.$refs.table.clearSort(...arguments)
		},
		clearFilter() {
			this.$refs.table.clearFilter(...arguments)
		},
		doLayout() {
			this.$refs.table.doLayout(...arguments)
		},
		sort() {
			this.$refs.table.sort(...arguments)
		},
	},
	render(h) {
		// 表格列的渲染方法
		const render = (h, columns) => {
			const cs = Array.isArray(columns) ? columns : [columns]
			return cs.map(col => {
				// 如果该列含有vNode, 返回vNode
				if (col.vNode) {
					if (this.$props.columnSortable) {
						col.vNode.componentOptions.propsData.resizable = false
					}
					return col.vNode
				}

				// 如果列可以排序，强制不允许列拖动改变宽度，同时存在容易出现bug
				if (this.$props.columnSortable) {
					col.resizable = false
				}
				// 通过children，支持多级表头
				const { children } = col
				const hasChildren = Array.isArray(children) && children.length
				// 通过renderCell，支持Table-column Scoped Slot default
				const hasCellRender = typeof col.renderCell === 'function'
				// 通过renderHeader，支持Table-column Scoped Slot default
				const hasHeaderRender = typeof col.renderHeader === 'function'
				const colProps = {
					props: {
						...col,
					},
					scopedSlots: {},
				}
				if (hasCellRender) {
					colProps.scopedSlots.default = function (ps) {
						return col.renderCell(h, ps)
					}
				}
				if (hasHeaderRender) {
					colProps.scopedSlots.header = function (ps) {
						return col.renderHeader(h, ps)
					}
				}

				return h('el-table-column', colProps, hasChildren ? render(h, children) : [])
			})
		}
		return h(
			'el-table',
			{
				class: 'y-table', //自定义全局类名
				props: {
					...this.$attrs,
					data: this.tableData,
				},
				on: {
					...this.$listeners,
				},
				ref: 'table',
			},
			render(h, this.tableColumns)
				.concat(
					// 支持el-table slot append
					h('template', { slot: 'append' }, this.$slots.append)
				)
				.concat(
					// 支持el-table slot empty
					h('template', { slot: 'empty' }, this.$slots.empty)
				)
		)
	},
}
</script>

<style scoped>
.y-table {
}
</style>
