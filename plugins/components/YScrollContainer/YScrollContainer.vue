<template>
	<div class="scroll-container" :style="style" ref="scrollContainer" @mouseenter="stopScroll" @mouseleave="startScroll">
		<div class="scroll-content" ref="scrollContent">
			<slot></slot>
			<renderComponent class="scroll-copy" v-for="(item, index) in slotList" :key="index" :cRender="item" />
		</div>
	</div>
</template>

<script>
/**
 * 滚动容器组件，将要滚动的内容放在默认插槽内即可，只要使用了该组件，就会一直执行requestAnimationFrame，因为要实时计算容器和滚动内容的高度
 *
 * 目前只有向上或者向下滚动，向左和向右是同样的原理，懒得搞了，向上和向下比较常用
 *
 * 有试过不依靠requestAnimationFrame的频率来刷新，利用时间间隔来滚动，但是效果不好有卡顿，因此不考虑设置时间间隔
 */
export default {
	name: 'YScrollContainer',
	props: {
		showScrollBar: {
			type: Boolean,
			default: false,
		},
		hoverStop: {
			type: Boolean,
			default: true,
		},
		scrollStep: {
			type: String | Number,
			default: 1,
		},
		direction: {
			validator(value) {
				return ['up', 'down'].indexOf(value) !== -1
			},
			default: 'up',
		},
	},
	components: {
		renderComponent: {
			props: {
				cRender: Object,
			},
			render() {
				return this.cRender
			},
		},
	},
	data() {
		return {
			isStop: false, // 是否停止滚动，鼠标悬浮时
			timer: null,
			containerHeight: 0,
			contentHeight: 0,
			ifScroll: false, // 是否要滚动
		}
	},
	computed: {
		slotList() {
			return this.ifScroll ? this.$slots.default : []
		},
		style() {
			const style = {
				overflowY: this.showScrollBar ? 'auto' : 'hidden',
			}
			return style
		},
	},
	mounted() {
		this.startScroll()
	},
	methods: {
		startScroll(forceStartScroll) {
			if (forceStartScroll) {
				this.isStop = false
				!this.hoverStop && cancelAnimationFrame(this.timer)
			}
			// 如果没强行停止滚动，就正常流程
			if (!this.isStop) {
				this.judgeScroll()
				// 如果判断出高度不足以滚动，则实时计算高度，直到高度变化进入else代码块
				if (!this.ifScroll) {
					this.timer = requestAnimationFrame(() => {
						this.startScroll()
					})
				} else {
					const scrollContainer = this.$refs.scrollContainer
					this.timer = requestAnimationFrame(() => {
						if (this.direction === 'up') {
							if (scrollContainer.scrollTop >= this.contentHeight / 2) {
								scrollContainer.scrollTop = 0
							} else {
								scrollContainer.scrollTop += Number.parseInt(this.scrollStep)
							}
						}
						if (this.direction === 'down') {
							if (scrollContainer.scrollTop <= this.contentHeight / 2 - this.containerHeight) {
								scrollContainer.scrollTop = this.contentHeight - this.containerHeight
							} else {
								scrollContainer.scrollTop -= Number.parseInt(this.scrollStep)
							}
						}

						this.startScroll()
					})
				}
			}
		},
		stopScroll() {
			if (this.hoverStop) {
				this.isStop = true
				cancelAnimationFrame(this.timer)
			}
		},
		// 若滚动区域高度小于等于容器高度，则不滚动
		// 否则复制滚动区域
		judgeScroll() {
			this.getHeight()
			const { containerHeight, contentHeight } = this
			if (contentHeight <= containerHeight) {
				this.ifScroll = false
			} else {
				this.ifScroll = true
			}
			this.$forceUpdate()
		},
		// 获取当前滚动区域和容器高度
		getHeight() {
			this.containerHeight = this.$refs.scrollContainer.clientHeight
			this.contentHeight = this.$refs.scrollContent.clientHeight
		},
	},
}
</script>

<style scoped>
.scroll-content {
	overflow: hidden;
}
.scroll-copy {
	overflow: hidden;
}
</style>
