// vue3响应原理
let activeEffect

class Dep {
    subscribers = new Set()
    // 订阅
    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }
    // 发布
    notify() {
        this.subscribers.forEach(effect => {
            effect()
        })
    }
}

function watchEffect(effect) {
    activeEffect = effect
    // 初始化执行一次
    effect()
    // gc
    activeEffect = null
}

// 语法糖
function reactive(raw) {
    Object.keys(raw).forEach(key => {
        const dep = new Dep()
        // 保存真实值
        let realValue = raw[key]
        // 添加代理
        Object.defineProperty(raw, key, {
            get() {
                // 执行 add
                dep.depend()
                return realValue
            },
            set(newValue) {
                realValue = newValue
                // 调用所有副作用函数
                dep.notify()
            }
        })
    })

    // 返回代理后的原始数据
    return raw
}

// test ------------------------
const state = reactive({
    count: 0
})

// 执行副作用,将响应逻辑添加到Dep
watchEffect(() => {
    // state.count 会进行 add 操作
    console.log(state.count)
})

state.count++