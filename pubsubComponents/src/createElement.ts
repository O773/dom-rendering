import * as state from './state'
import { objToCss } from "./util";

const isStateValue = (value: any): value is string => typeof value === 'string' && value.startsWith('$')

const resolve = (value: any) => isStateValue(value) ? state.get(value) : value

const resolveProps = (props) => props && Object.entries(props).reduce((a, [key, value]) => ({ ...a, [key]: resolve(value)}), {})

const appendChild = (parent, child, index) => {
	if (Array.isArray(child)) {
		child.forEach((nestedChild, nestedIndex) => appendChild(parent, nestedChild, nestedIndex))
	} else {
		parent.insertBefore(
			child.nodeType ? child : createTextNode(child), parent.children[index]
		)
	}
}

const createTextNode = (value: string | number) => {
	if(isStateValue(value)) {
		const textNode = document.createTextNode(resolve(value))
		state.subscribe(value, () => textNode.parentNode?.replaceChild(createTextNode(value), textNode))
		return textNode
	}
	return document.createTextNode(value.toString())
}

const createElement = (tag: any, props: { [key: string]: any }, ...children) => {
  	if (typeof tag === "function") {
    	const element = tag(resolveProps(props), children)
		Object
			.values(props || {})
			.filter(isStateValue)
			.forEach(stateJSONPath => state.subscribe(stateJSONPath, () =>
				element.replaceWith(createElement(tag, props, children))))

		return element
  	}

	const element = document.createElement(tag)

	Object
		.entries(props || {})
		.forEach(([name, value]) => {
			if (name.startsWith('on') && name.toLowerCase() in window) {
				element.addEventListener(name.toLowerCase().slice(2), value)
			} else if (name === 'style') {
				element.setAttribute(name, objToCss(value))
			} else {
				element.setAttribute(name, value.toString())
			}
		})

	Object
		.values(props || {})
		.filter(isStateValue)
		.forEach(stateJSONPath => {
			state.subscribe(stateJSONPath, () =>
				element.replaceWith(createElement(tag, props, children)))})

	children.forEach((child, position) => {
		appendChild(element, child, position)
	})

	return element
}

export { createElement }
