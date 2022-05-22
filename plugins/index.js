import YTable from './components/YTable'
import YScrollContainer from './components/YScrollContainer'

import clipboard from './directives/clipboard'
import highlight from './directives/highlight'
import selecttext from './directives/selecttext'

// 组件
const components = [YTable, YScrollContainer]

// 指令
const directives = [clipboard, highlight, selecttext]

// 定义install方法，Vue作为参数
const install = Vue => {
	// 判断是否安装，安装过就不用继续执行
	if (install.installed) return
	install.installed = true
	// 遍历注册所有组件
	components.map(component => Vue.component(component.name, component))
	// 遍历注册所有指令
	directives.map(directives => Vue.use(directives))
}

// 检测到Vue再执行
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	// 全部引入
	install,
	// 按需引入
	YTable,
	YScrollContainer,
	clipboard,
	highlight,
	selecttext,
}
