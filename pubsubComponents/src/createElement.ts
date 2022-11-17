import * as state from './state'
import { objToCss } from "./util";

const isStateValue = (value: any): value is string => typeof value === 'string' && value.startsWith('$')

const resolve = (value: any) => isStateValue(value) ? state.get(value) : value

const appendChild = (parent, child) => {
	if (Array.isArray(child)) {
		child.forEach((nestedChild) => appendChild(parent, nestedChild))
	} else {
		parent.appendChild(
			child.nodeType ? child : createTextNode(child)
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
	// If it's a component, run it
  	if (typeof tag === "function") {
		// map state props to their actual value
		const resolvedProps = Object.entries(props).reduce((a, [key, value]) => ({ ...a, [key]: resolve(value)}), {})
    	const element = tag(resolvedProps, children)
		// if it names the state in its props, it rerenders when they change
		const subscriptions = Object.values(props || {}).filter(isStateValue)
		subscriptions.forEach(stateJSONPath => {
			state.subscribe(stateJSONPath, () => {
				element.replaceWith(createElement(tag, props, children))
			})
		})
		return element
  	}

	const element = document.createElement(tag)

	Object.entries(props || {})
		.forEach(([name, value]) => {
		if (name.startsWith('on') && name.toLowerCase() in window) {
			element.addEventListener(name.toLowerCase().slice(2), value)
    	} else if (name === 'style') {
			element.setAttribute(name, objToCss(value))
		} else {
      		element.setAttribute(name, value.toString())
    	}
	})

	children.forEach((child) => {
		appendChild(element, child)
	})

	const subscriptions = Object.values(props || {}).filter(isStateValue)
	subscriptions
		.forEach(stateJSONPath => {
		state.subscribe(stateJSONPath, () => element.replaceWith(createElement(tag, props, children)))
	})

	return element
}

export { createElement }
