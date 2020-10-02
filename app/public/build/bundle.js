
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class Settings {
        constructor(bikeWeight, riderWeight, wheelsInertia, wheelsRadius, efficiency, area, rho, debugMode) {
            this._bikeWeight = bikeWeight;
            this._riderWeight = riderWeight;
            this._wheelsInertia = wheelsInertia;
            this._wheelsRadius = wheelsRadius;
            this._efficiency = efficiency;
            this._area = area;
            this._rho = rho;
            this._debugMode = debugMode;
        }
        get bikeWeight() {
            return this._bikeWeight;
        }
        get riderWeight() {
            return this._riderWeight;
        }
        get totalWeight() {
            return this._riderWeight + this._bikeWeight;
        }
        get wheelsInertia() {
            return this._wheelsInertia;
        }
        get wheelsRadius() {
            return this._wheelsRadius;
        }
        get efficiency() {
            return this._efficiency;
        }
        get area() {
            return this._area;
        }
        get rho() {
            return this._rho;
        }
        get debugMode() {
            return this._debugMode;
        }
    }

    /* src/Simulator.svelte generated by Svelte v3.24.0 */

    const { console: console_1 } = globals;
    const file = "src/Simulator.svelte";

    // (161:8) {:else}
    function create_else_block(ctx) {
    	let div;
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t = text(/*trap_info*/ ctx[6]);
    			attr_dev(h2, "class", "svelte-msah5q");
    			add_location(h2, file, 162, 8, 5863);
    			attr_dev(div, "class", "relative svelte-msah5q");
    			add_location(div, file, 161, 4, 5832);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*trap_info*/ 64) set_data_dev(t, /*trap_info*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(161:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (146:4) {#if !ended}
    function create_if_block(ctx) {
    	let div5;
    	let video_1;
    	let source;
    	let source_src_value;
    	let t0;
    	let video_1_height_value;
    	let t1;
    	let div0;
    	let t2;
    	let t3_value = Math.round(/*speed*/ ctx[2] * 10) / 10 + "";
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let div2;
    	let t10;
    	let t11;
    	let div3;
    	let t12;

    	let t13_value = (Math.trunc(/*time*/ ctx[4] / 60) > 0
    	? Math.trunc(/*time*/ ctx[4] / 60) + "'"
    	: "") + "";

    	let t13;
    	let t14;
    	let t15_value = Math.round(/*time*/ ctx[4] % 60) + "\"" + "";
    	let t15;
    	let t16;
    	let div4;
    	let t17;
    	let t18_value = Math.round(/*distance*/ ctx[3] / 10) / 100 + "";
    	let t18;
    	let t19;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			video_1 = element("video");
    			source = element("source");
    			t0 = text("\n            Your browser does not support the video tag.");
    			t1 = space();
    			div0 = element("div");
    			t2 = text("Speed: ");
    			t3 = text(t3_value);
    			t4 = text(" km/h");
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Power: ");
    			t7 = text(/*power*/ ctx[1]);
    			t8 = text(" W");
    			t9 = space();
    			div2 = element("div");
    			t10 = text(/*trap_info*/ ctx[6]);
    			t11 = space();
    			div3 = element("div");
    			t12 = text("Time: ");
    			t13 = text(t13_value);
    			t14 = space();
    			t15 = text(t15_value);
    			t16 = space();
    			div4 = element("div");
    			t17 = text("Distance: ");
    			t18 = text(t18_value);
    			t19 = text(" km");
    			if (source.src !== (source_src_value = "data/bm-13-09-19_no_scritte.mp4")) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "video/mp4");
    			add_location(source, file, 151, 12, 5237);
    			attr_dev(video_1, "width", /*width*/ ctx[0]);
    			attr_dev(video_1, "height", video_1_height_value = /*width*/ ctx[0] / 1.666666666);
    			video_1.muted = true;
    			attr_dev(video_1, "class", "svelte-msah5q");
    			add_location(video_1, file, 147, 8, 5070);
    			attr_dev(div0, "class", "overlay bottom_left svelte-msah5q");
    			add_location(div0, file, 154, 8, 5383);
    			attr_dev(div1, "class", "overlay bottom_right svelte-msah5q");
    			add_location(div1, file, 155, 8, 5469);
    			attr_dev(div2, "class", "overlay center svelte-msah5q");
    			add_location(div2, file, 156, 8, 5534);
    			attr_dev(div3, "class", "overlay top_left svelte-msah5q");
    			add_location(div3, file, 157, 8, 5588);
    			attr_dev(div4, "class", "overlay top_right svelte-msah5q");
    			add_location(div4, file, 158, 8, 5721);
    			attr_dev(div5, "class", "relative svelte-msah5q");
    			add_location(div5, file, 146, 4, 5039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, video_1);
    			append_dev(video_1, source);
    			append_dev(video_1, t0);
    			/*video_1_binding*/ ctx[11](video_1);

    			if (!isNaN(/*playbackRate*/ ctx[5])) {
    				video_1.playbackRate = /*playbackRate*/ ctx[5];
    			}

    			append_dev(div5, t1);
    			append_dev(div5, div0);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div5, t5);
    			append_dev(div5, div1);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div5, t9);
    			append_dev(div5, div2);
    			append_dev(div2, t10);
    			append_dev(div5, t11);
    			append_dev(div5, div3);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, t17);
    			append_dev(div4, t18);
    			append_dev(div4, t19);

    			if (!mounted) {
    				dispose = listen_dev(video_1, "ratechange", /*video_1_ratechange_handler*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(video_1, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 1 && video_1_height_value !== (video_1_height_value = /*width*/ ctx[0] / 1.666666666)) {
    				attr_dev(video_1, "height", video_1_height_value);
    			}

    			if (dirty & /*playbackRate*/ 32 && !isNaN(/*playbackRate*/ ctx[5])) {
    				video_1.playbackRate = /*playbackRate*/ ctx[5];
    			}

    			if (dirty & /*speed*/ 4 && t3_value !== (t3_value = Math.round(/*speed*/ ctx[2] * 10) / 10 + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*power*/ 2) set_data_dev(t7, /*power*/ ctx[1]);
    			if (dirty & /*trap_info*/ 64) set_data_dev(t10, /*trap_info*/ ctx[6]);

    			if (dirty & /*time*/ 16 && t13_value !== (t13_value = (Math.trunc(/*time*/ ctx[4] / 60) > 0
    			? Math.trunc(/*time*/ ctx[4] / 60) + "'"
    			: "") + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*time*/ 16 && t15_value !== (t15_value = Math.round(/*time*/ ctx[4] % 60) + "\"" + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*distance*/ 8 && t18_value !== (t18_value = Math.round(/*distance*/ ctx[3] / 10) / 100 + "")) set_data_dev(t18, t18_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			/*video_1_binding*/ ctx[11](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(146:4) {#if !ended}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;

    	function select_block_type(ctx, dirty) {
    		if (!/*ended*/ ctx[8]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block.c();
    			add_location(section, file, 144, 0, 5008);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_block.m(section, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(section, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const g = 9.81;
    const trap_start = 8184;
    const trap_end = 8384;

    function instance($$self, $$props, $$invalidate) {
    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let { settings } = $$props;
    	let { width = 480 } = $$props;
    	let { power = 0 } = $$props;
    	let speed = 0;
    	let distance = 0;
    	let time = 0;
    	let playbackRate = 0;
    	let trap_info;

    	// t_video: elapsed time in the video (at original speed)
    	let t_video = 0;

    	let coefficients, slope, fitFile;
    	let video;
    	let started = false;
    	let interval;
    	let ended = false;
    	let sum = 0;
    	let count_speed = 0;

    	function start() {
    		return __awaiter(this, void 0, void 0, function* () {
    			if (started) return;
    			$$invalidate(5, playbackRate = 0);
    			yield video.play();
    			started = true;
    			interval = setInterval(intervalFunction, 1000);
    		});
    	}

    	function reset() {
    		return __awaiter(this, void 0, void 0, function* () {
    			if (!started) return;
    			clearInterval(interval);
    			$$invalidate(5, playbackRate = 0);
    			yield video.pause();
    			$$invalidate(7, video.currentTime = 0, video);
    			t_video = 0;
    			$$invalidate(4, time = 0);
    			$$invalidate(3, distance = 0);
    			$$invalidate(2, speed = 0);
    			started = false;
    		});
    	}

    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		let res = yield fetch("data/coefficients.json");
    		coefficients = yield res.json();
    		res = yield fetch("data/slope.txt");
    		const slopeFile = yield res.text();
    		slope = yield slopeFile.split("\n");
    		res = yield fetch("data/19-09-19-am-gallo_t2.json");
    		fitFile = yield res.json();
    		yield start();
    		$$invalidate(8, ended = false);
    		console.log(document.getElementsByClassName("relative").length);
    		document.getElementsByClassName("relative").item(0).setAttribute("style", "width:" + width + "px");
    	}));

    	onDestroy(() => {
    		clearInterval(interval);
    	});

    	function intervalFunction() {
    		if (power > 5000 || power < 0) {
    			alert("Not valid number!!");
    			$$invalidate(2, speed = 0);
    			clearInterval(interval);
    		}

    		changeVideoSpeed(distance, 1, speed);
    		const slope = slopeCalculator(speed, 1, distance);
    		$$invalidate(2, speed = nextValue(speed, power, 1, slope));
    		$$invalidate(4, time++, time);
    		$$invalidate(3, distance += speed / 3.6);
    	}

    	function changeVideoSpeed(d0, t, vs) {
    		let s = 0;
    		while (fitFile[s]["sec"] < t_video && s < 581) s++;

    		if (s === 581) {
    			$$invalidate(5, playbackRate = 0);
    			$$invalidate(8, ended = true);
    			clearInterval(interval);
    			return;
    		}

    		let vr = fitFile[s]["kph"];
    		$$invalidate(5, playbackRate = vs / vr);

    		if (playbackRate !== 0 && (playbackRate < 0.0625 || playbackRate > 16)) {
    			alert("Sorry but the speed is too low or too high, the activity will be restarted.");
    			reset();
    		}

    		t_video += playbackRate * t;
    	}

    	function slopeCalculator(v0, t, d0) {
    		v0 = v0 / 3.6;

    		// calcolo la pendenza media nella discorsa percorsa nel tempo t
    		let d1 = Math.round(v0 * t + d0);

    		d0 = Math.round(d0);
    		let s = 0;
    		for (let i = d0; i < d1; i++) s += i < slope.length - 1 ? parseFloat(slope[i]) : 0;
    		return d1 !== d0 ? -s / (d1 - d0) : 0;
    	}

    	function nextValue(v0, power, t, slope) {
    		v0 = v0 / 3.6;
    		let i = v0 > 40 ? 400 : Math.round(v0 * 10);
    		let cr = coefficients[i]["cr"];
    		let cx = coefficients[i]["cx"];
    		let e_k0 = 0.5 * settings.totalWeight * Math.pow(v0, 2);
    		let e_kr0 = 0.5 * settings.wheelsInertia * Math.pow(v0, 2) / Math.pow(settings.wheelsRadius, 2);
    		let e_w = settings.efficiency * t * power;
    		let ascent = -slope * v0 * t;
    		let e_u = settings.totalWeight * g * ascent;
    		let a_r = cr * settings.totalWeight * g * t * v0;
    		let a_a = 0.5 * settings.rho * cx * settings.area * Math.pow(v0, 3) * t;
    		return 3.6 * Math.pow(2 * (e_k0 + e_kr0 + e_w + e_u - a_a - a_r) / (settings.totalWeight + settings.wheelsInertia / Math.pow(settings.wheelsRadius, 2)), 1 / 2);
    	}

    	const writable_props = ["settings", "width", "power"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Simulator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Simulator", $$slots, []);

    	function video_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			video = $$value;
    			$$invalidate(7, video);
    		});
    	}

    	function video_1_ratechange_handler() {
    		playbackRate = this.playbackRate;
    		$$invalidate(5, playbackRate);
    	}

    	$$self.$set = $$props => {
    		if ("settings" in $$props) $$invalidate(9, settings = $$props.settings);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("power" in $$props) $$invalidate(1, power = $$props.power);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		onDestroy,
    		onMount,
    		Settings,
    		settings,
    		width,
    		power,
    		speed,
    		distance,
    		time,
    		playbackRate,
    		g,
    		trap_start,
    		trap_end,
    		trap_info,
    		t_video,
    		coefficients,
    		slope,
    		fitFile,
    		video,
    		started,
    		interval,
    		ended,
    		sum,
    		count_speed,
    		start,
    		reset,
    		intervalFunction,
    		changeVideoSpeed,
    		slopeCalculator,
    		nextValue
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("settings" in $$props) $$invalidate(9, settings = $$props.settings);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("power" in $$props) $$invalidate(1, power = $$props.power);
    		if ("speed" in $$props) $$invalidate(2, speed = $$props.speed);
    		if ("distance" in $$props) $$invalidate(3, distance = $$props.distance);
    		if ("time" in $$props) $$invalidate(4, time = $$props.time);
    		if ("playbackRate" in $$props) $$invalidate(5, playbackRate = $$props.playbackRate);
    		if ("trap_info" in $$props) $$invalidate(6, trap_info = $$props.trap_info);
    		if ("t_video" in $$props) t_video = $$props.t_video;
    		if ("coefficients" in $$props) coefficients = $$props.coefficients;
    		if ("slope" in $$props) slope = $$props.slope;
    		if ("fitFile" in $$props) fitFile = $$props.fitFile;
    		if ("video" in $$props) $$invalidate(7, video = $$props.video);
    		if ("started" in $$props) started = $$props.started;
    		if ("interval" in $$props) interval = $$props.interval;
    		if ("ended" in $$props) $$invalidate(8, ended = $$props.ended);
    		if ("sum" in $$props) $$invalidate(19, sum = $$props.sum);
    		if ("count_speed" in $$props) $$invalidate(20, count_speed = $$props.count_speed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*distance, sum, speed, count_speed*/ 1572876) {
    			 {
    				if (distance > trap_start - 1609 && distance < trap_start) $$invalidate(6, trap_info = `Distance to GO ${Math.round(trap_start - distance)}m`); else if (distance >= trap_start && distance <= trap_end) {
    					$$invalidate(6, trap_info = `Distance to END ${Math.round(trap_end - distance)}m`);
    					$$invalidate(19, sum += speed);
    					$$invalidate(20, count_speed++, count_speed);
    				} else if (distance > trap_end) $$invalidate(6, trap_info = `⚡ ${Math.round(sum * 100 / count_speed) / 100} km/h ⚡`); else {
    					$$invalidate(6, trap_info = "");
    					$$invalidate(20, count_speed = 0);
    					$$invalidate(19, sum = 0);
    				}
    			}
    		}
    	};

    	return [
    		width,
    		power,
    		speed,
    		distance,
    		time,
    		playbackRate,
    		trap_info,
    		video,
    		ended,
    		settings,
    		reset,
    		video_1_binding,
    		video_1_ratechange_handler
    	];
    }

    class Simulator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			settings: 9,
    			width: 0,
    			power: 1,
    			reset: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Simulator",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[9] === undefined && !("settings" in props)) {
    			console_1.warn("<Simulator> was created without expected prop 'settings'");
    		}
    	}

    	get settings() {
    		throw new Error("<Simulator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Simulator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Simulator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Simulator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get power() {
    		throw new Error("<Simulator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set power(value) {
    		throw new Error("<Simulator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reset() {
    		return this.$$.ctx[10];
    	}

    	set reset(value) {
    		throw new Error("<Simulator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Path.svelte generated by Svelte v3.24.0 */

    const file$1 = "node_modules/svelte-awesome/components/svg/Path.svelte";

    function create_fragment$1(ctx) {
    	let path;
    	let path_key_value;

    	let path_levels = [
    		{
    			key: path_key_value = "path-" + /*id*/ ctx[0]
    		},
    		/*data*/ ctx[1]
    	];

    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [
    				dirty & /*id*/ 1 && path_key_value !== (path_key_value = "path-" + /*id*/ ctx[0]) && { key: path_key_value },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Path> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Path", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Path extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Path",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get id() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Path>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Path>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Polygon.svelte generated by Svelte v3.24.0 */

    const file$2 = "node_modules/svelte-awesome/components/svg/Polygon.svelte";

    function create_fragment$2(ctx) {
    	let polygon;
    	let polygon_key_value;

    	let polygon_levels = [
    		{
    			key: polygon_key_value = "polygon-" + /*id*/ ctx[0]
    		},
    		/*data*/ ctx[1]
    	];

    	let polygon_data = {};

    	for (let i = 0; i < polygon_levels.length; i += 1) {
    		polygon_data = assign(polygon_data, polygon_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			set_svg_attributes(polygon, polygon_data);
    			add_location(polygon, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(polygon, polygon_data = get_spread_update(polygon_levels, [
    				dirty & /*id*/ 1 && polygon_key_value !== (polygon_key_value = "polygon-" + /*id*/ ctx[0]) && { key: polygon_key_value },
    				dirty & /*data*/ 2 && /*data*/ ctx[1]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { id = "" } = $$props;
    	let { data = {} } = $$props;
    	const writable_props = ["id", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Polygon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Polygon", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ id, data });

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, data];
    }

    class Polygon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Polygon",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get id() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Polygon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Polygon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Raw.svelte generated by Svelte v3.24.0 */

    const file$3 = "node_modules/svelte-awesome/components/svg/Raw.svelte";

    function create_fragment$3(ctx) {
    	let g;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			add_location(g, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			g.innerHTML = /*raw*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1) g.innerHTML = /*raw*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let cursor = 870711;

    	function getId() {
    		cursor += 1;
    		return `fa-${cursor.toString(16)}`;
    	}

    	let raw;
    	let { data } = $$props;

    	function getRaw(data) {
    		if (!data || !data.raw) {
    			return null;
    		}

    		let rawData = data.raw;
    		const ids = {};

    		rawData = rawData.replace(/\s(?:xml:)?id=["']?([^"')\s]+)/g, (match, id) => {
    			const uniqueId = getId();
    			ids[id] = uniqueId;
    			return ` id="${uniqueId}"`;
    		});

    		rawData = rawData.replace(/#(?:([^'")\s]+)|xpointer\(id\((['"]?)([^')]+)\2\)\))/g, (match, rawId, _, pointerId) => {
    			const id = rawId || pointerId;

    			if (!id || !ids[id]) {
    				return match;
    			}

    			return `#${ids[id]}`;
    		});

    		return rawData;
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Raw> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Raw", $$slots, []);

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ cursor, getId, raw, data, getRaw });

    	$$self.$inject_state = $$props => {
    		if ("cursor" in $$props) cursor = $$props.cursor;
    		if ("raw" in $$props) $$invalidate(0, raw = $$props.raw);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data*/ 2) {
    			 $$invalidate(0, raw = getRaw(data));
    		}
    	};

    	return [raw, data];
    }

    class Raw extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raw",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Raw> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<Raw>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Raw>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/svg/Svg.svelte generated by Svelte v3.24.0 */

    const file$4 = "node_modules/svelte-awesome/components/svg/Svg.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let svg_class_value;
    	let svg_role_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "class", svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an");
    			attr_dev(svg, "x", /*x*/ ctx[8]);
    			attr_dev(svg, "y", /*y*/ ctx[9]);
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			attr_dev(svg, "role", svg_role_value = /*label*/ ctx[11] ? "img" : "presentation");
    			attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			attr_dev(svg, "style", /*style*/ ctx[10]);
    			toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			add_location(svg, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*className*/ 1 && svg_class_value !== (svg_class_value = "fa-icon " + /*className*/ ctx[0] + " svelte-1dof0an")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*x*/ 256) {
    				attr_dev(svg, "x", /*x*/ ctx[8]);
    			}

    			if (!current || dirty & /*y*/ 512) {
    				attr_dev(svg, "y", /*y*/ ctx[9]);
    			}

    			if (!current || dirty & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 2048) {
    				attr_dev(svg, "aria-label", /*label*/ ctx[11]);
    			}

    			if (!current || dirty & /*label*/ 2048 && svg_role_value !== (svg_role_value = /*label*/ ctx[11] ? "img" : "presentation")) {
    				attr_dev(svg, "role", svg_role_value);
    			}

    			if (!current || dirty & /*box*/ 8) {
    				attr_dev(svg, "viewBox", /*box*/ ctx[3]);
    			}

    			if (!current || dirty & /*style*/ 1024) {
    				attr_dev(svg, "style", /*style*/ ctx[10]);
    			}

    			if (dirty & /*className, spin*/ 17) {
    				toggle_class(svg, "fa-spin", /*spin*/ ctx[4]);
    			}

    			if (dirty & /*className, pulse*/ 65) {
    				toggle_class(svg, "fa-pulse", /*pulse*/ ctx[6]);
    			}

    			if (dirty & /*className, inverse*/ 33) {
    				toggle_class(svg, "fa-inverse", /*inverse*/ ctx[5]);
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-horizontal", /*flip*/ ctx[7] === "horizontal");
    			}

    			if (dirty & /*className, flip*/ 129) {
    				toggle_class(svg, "fa-flip-vertical", /*flip*/ ctx[7] === "vertical");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { class: className } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { box } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { style = undefined } = $$props;
    	let { label = undefined } = $$props;

    	const writable_props = [
    		"class",
    		"width",
    		"height",
    		"box",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"x",
    		"y",
    		"style",
    		"label"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Svg", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, className = $$props.class);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(0, className = $$props.className);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("box" in $$props) $$invalidate(3, box = $$props.box);
    		if ("spin" in $$props) $$invalidate(4, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(5, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(6, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(7, flip = $$props.flip);
    		if ("x" in $$props) $$invalidate(8, x = $$props.x);
    		if ("y" in $$props) $$invalidate(9, y = $$props.y);
    		if ("style" in $$props) $$invalidate(10, style = $$props.style);
    		if ("label" in $$props) $$invalidate(11, label = $$props.label);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		className,
    		width,
    		height,
    		box,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		x,
    		y,
    		style,
    		label,
    		$$scope,
    		$$slots
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			class: 0,
    			width: 1,
    			height: 2,
    			box: 3,
    			spin: 4,
    			inverse: 5,
    			pulse: 6,
    			flip: 7,
    			x: 8,
    			y: 9,
    			style: 10,
    			label: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !("class" in props)) {
    			console.warn("<Svg> was created without expected prop 'class'");
    		}

    		if (/*width*/ ctx[1] === undefined && !("width" in props)) {
    			console.warn("<Svg> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[2] === undefined && !("height" in props)) {
    			console.warn("<Svg> was created without expected prop 'height'");
    		}

    		if (/*box*/ ctx[3] === undefined && !("box" in props)) {
    			console.warn("<Svg> was created without expected prop 'box'");
    		}
    	}

    	get class() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get box() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set box(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-awesome/components/Icon.svelte generated by Svelte v3.24.0 */

    const { Object: Object_1, console: console_1$1 } = globals;

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (4:4) {#if self}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*self*/ ctx[0].paths && create_if_block_3(ctx);
    	let if_block1 = /*self*/ ctx[0].polygons && create_if_block_2(ctx);
    	let if_block2 = /*self*/ ctx[0].raw && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0].paths) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].polygons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*self*/ ctx[0].raw) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(4:4) {#if self}",
    		ctx
    	});

    	return block;
    }

    // (5:6) {#if self.paths}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*self*/ ctx[0].paths;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value_1 = /*self*/ ctx[0].paths;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(5:6) {#if self.paths}",
    		ctx
    	});

    	return block;
    }

    // (6:8) {#each self.paths as path, i}
    function create_each_block_1(ctx) {
    	let path;
    	let current;

    	path = new Path({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*path*/ ctx[32]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(path.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(path, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const path_changes = {};
    			if (dirty[0] & /*self*/ 1) path_changes.data = /*path*/ ctx[32];
    			path.$set(path_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(path.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(path.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(path, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(6:8) {#each self.paths as path, i}",
    		ctx
    	});

    	return block;
    }

    // (10:6) {#if self.polygons}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*self*/ ctx[0].polygons;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*self*/ 1) {
    				each_value = /*self*/ ctx[0].polygons;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(10:6) {#if self.polygons}",
    		ctx
    	});

    	return block;
    }

    // (11:8) {#each self.polygons as polygon, i}
    function create_each_block(ctx) {
    	let polygon;
    	let current;

    	polygon = new Polygon({
    			props: {
    				id: /*i*/ ctx[31],
    				data: /*polygon*/ ctx[29]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(polygon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polygon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const polygon_changes = {};
    			if (dirty[0] & /*self*/ 1) polygon_changes.data = /*polygon*/ ctx[29];
    			polygon.$set(polygon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polygon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polygon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polygon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:8) {#each self.polygons as polygon, i}",
    		ctx
    	});

    	return block;
    }

    // (15:6) {#if self.raw}
    function create_if_block_1(ctx) {
    	let raw;
    	let updating_data;
    	let current;

    	function raw_data_binding(value) {
    		/*raw_data_binding*/ ctx[15].call(null, value);
    	}

    	let raw_props = {};

    	if (/*self*/ ctx[0] !== void 0) {
    		raw_props.data = /*self*/ ctx[0];
    	}

    	raw = new Raw({ props: raw_props, $$inline: true });
    	binding_callbacks.push(() => bind(raw, "data", raw_data_binding));

    	const block = {
    		c: function create() {
    			create_component(raw.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(raw, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const raw_changes = {};

    			if (!updating_data && dirty[0] & /*self*/ 1) {
    				updating_data = true;
    				raw_changes.data = /*self*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			raw.$set(raw_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(raw.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(raw.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(raw, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(15:6) {#if self.raw}",
    		ctx
    	});

    	return block;
    }

    // (3:8)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*self*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*self*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*self*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(3:8)      ",
    		ctx
    	});

    	return block;
    }

    // (1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>
    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty[0] & /*self*/ 1) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(1:0) <Svg label={label} width={width} height={height} box={box} style={combinedStyle}   spin={spin} flip={flip} inverse={inverse} pulse={pulse} class={className}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let current;

    	svg = new Svg({
    			props: {
    				label: /*label*/ ctx[6],
    				width: /*width*/ ctx[7],
    				height: /*height*/ ctx[8],
    				box: /*box*/ ctx[10],
    				style: /*combinedStyle*/ ctx[9],
    				spin: /*spin*/ ctx[2],
    				flip: /*flip*/ ctx[5],
    				inverse: /*inverse*/ ctx[3],
    				pulse: /*pulse*/ ctx[4],
    				class: /*className*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};
    			if (dirty[0] & /*label*/ 64) svg_changes.label = /*label*/ ctx[6];
    			if (dirty[0] & /*width*/ 128) svg_changes.width = /*width*/ ctx[7];
    			if (dirty[0] & /*height*/ 256) svg_changes.height = /*height*/ ctx[8];
    			if (dirty[0] & /*box*/ 1024) svg_changes.box = /*box*/ ctx[10];
    			if (dirty[0] & /*combinedStyle*/ 512) svg_changes.style = /*combinedStyle*/ ctx[9];
    			if (dirty[0] & /*spin*/ 4) svg_changes.spin = /*spin*/ ctx[2];
    			if (dirty[0] & /*flip*/ 32) svg_changes.flip = /*flip*/ ctx[5];
    			if (dirty[0] & /*inverse*/ 8) svg_changes.inverse = /*inverse*/ ctx[3];
    			if (dirty[0] & /*pulse*/ 16) svg_changes.pulse = /*pulse*/ ctx[4];
    			if (dirty[0] & /*className*/ 2) svg_changes.class = /*className*/ ctx[1];

    			if (dirty[0] & /*$$scope, self*/ 65537) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function normaliseData(data) {
    	if ("iconName" in data && "icon" in data) {
    		let normalisedData = {};
    		let faIcon = data.icon;
    		let name = data.iconName;
    		let width = faIcon[0];
    		let height = faIcon[1];
    		let paths = faIcon[4];
    		let iconData = { width, height, paths: [{ d: paths }] };
    		normalisedData[name] = iconData;
    		return normalisedData;
    	}

    	return data;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { class: className = "" } = $$props;
    	let { data } = $$props;
    	let { scale = 1 } = $$props;
    	let { spin = false } = $$props;
    	let { inverse = false } = $$props;
    	let { pulse = false } = $$props;
    	let { flip = null } = $$props;
    	let { label = null } = $$props;
    	let { self = null } = $$props;
    	let { style = null } = $$props;

    	// internal
    	let x = 0;

    	let y = 0;
    	let childrenHeight = 0;
    	let childrenWidth = 0;
    	let outerScale = 1;
    	let width;
    	let height;
    	let combinedStyle;
    	let box;

    	function init() {
    		if (typeof data === "undefined") {
    			return;
    		}

    		const normalisedData = normaliseData(data);
    		const [name] = Object.keys(normalisedData);
    		const icon = normalisedData[name];

    		if (!icon.paths) {
    			icon.paths = [];
    		}

    		if (icon.d) {
    			icon.paths.push({ d: icon.d });
    		}

    		if (!icon.polygons) {
    			icon.polygons = [];
    		}

    		if (icon.points) {
    			icon.polygons.push({ points: icon.points });
    		}

    		$$invalidate(0, self = icon);
    	}

    	function normalisedScale() {
    		let numScale = 1;

    		if (typeof scale !== "undefined") {
    			numScale = Number(scale);
    		}

    		if (isNaN(numScale) || numScale <= 0) {
    			// eslint-disable-line no-restricted-globals
    			console.warn("Invalid prop: prop \"scale\" should be a number over 0."); // eslint-disable-line no-console

    			return outerScale;
    		}

    		return numScale * outerScale;
    	}

    	function calculateBox() {
    		if (self) {
    			return `0 0 ${self.width} ${self.height}`;
    		}

    		return `0 0 ${width} ${height}`;
    	}

    	function calculateRatio() {
    		if (!self) {
    			return 1;
    		}

    		return Math.max(self.width, self.height) / 16;
    	}

    	function calculateWidth() {
    		if (childrenWidth) {
    			return childrenWidth;
    		}

    		if (self) {
    			return self.width / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateHeight() {
    		if (childrenHeight) {
    			return childrenHeight;
    		}

    		if (self) {
    			return self.height / calculateRatio() * normalisedScale();
    		}

    		return 0;
    	}

    	function calculateStyle() {
    		let combined = "";

    		if (style !== null) {
    			combined += style;
    		}

    		let size = normalisedScale();

    		if (size === 1) {
    			return combined;
    		}

    		if (combined !== "" && !combined.endsWith(";")) {
    			combined += "; ";
    		}

    		return `${combined}font-size: ${size}em`;
    	}

    	const writable_props = [
    		"class",
    		"data",
    		"scale",
    		"spin",
    		"inverse",
    		"pulse",
    		"flip",
    		"label",
    		"self",
    		"style"
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Icon", $$slots, ['default']);

    	function raw_data_binding(value) {
    		self = value;
    		$$invalidate(0, self);
    	}

    	$$self.$set = $$props => {
    		if ("class" in $$props) $$invalidate(1, className = $$props.class);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Path,
    		Polygon,
    		Raw,
    		Svg,
    		className,
    		data,
    		scale,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		self,
    		style,
    		x,
    		y,
    		childrenHeight,
    		childrenWidth,
    		outerScale,
    		width,
    		height,
    		combinedStyle,
    		box,
    		init,
    		normaliseData,
    		normalisedScale,
    		calculateBox,
    		calculateRatio,
    		calculateWidth,
    		calculateHeight,
    		calculateStyle
    	});

    	$$self.$inject_state = $$props => {
    		if ("className" in $$props) $$invalidate(1, className = $$props.className);
    		if ("data" in $$props) $$invalidate(11, data = $$props.data);
    		if ("scale" in $$props) $$invalidate(12, scale = $$props.scale);
    		if ("spin" in $$props) $$invalidate(2, spin = $$props.spin);
    		if ("inverse" in $$props) $$invalidate(3, inverse = $$props.inverse);
    		if ("pulse" in $$props) $$invalidate(4, pulse = $$props.pulse);
    		if ("flip" in $$props) $$invalidate(5, flip = $$props.flip);
    		if ("label" in $$props) $$invalidate(6, label = $$props.label);
    		if ("self" in $$props) $$invalidate(0, self = $$props.self);
    		if ("style" in $$props) $$invalidate(13, style = $$props.style);
    		if ("x" in $$props) x = $$props.x;
    		if ("y" in $$props) y = $$props.y;
    		if ("childrenHeight" in $$props) childrenHeight = $$props.childrenHeight;
    		if ("childrenWidth" in $$props) childrenWidth = $$props.childrenWidth;
    		if ("outerScale" in $$props) outerScale = $$props.outerScale;
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("combinedStyle" in $$props) $$invalidate(9, combinedStyle = $$props.combinedStyle);
    		if ("box" in $$props) $$invalidate(10, box = $$props.box);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, style, scale*/ 14336) {
    			 {
    				init();
    				$$invalidate(7, width = calculateWidth());
    				$$invalidate(8, height = calculateHeight());
    				$$invalidate(9, combinedStyle = calculateStyle());
    				$$invalidate(10, box = calculateBox());
    			}
    		}
    	};

    	return [
    		self,
    		className,
    		spin,
    		inverse,
    		pulse,
    		flip,
    		label,
    		width,
    		height,
    		combinedStyle,
    		box,
    		data,
    		scale,
    		style,
    		$$slots,
    		raw_data_binding,
    		$$scope
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				class: 1,
    				data: 11,
    				scale: 12,
    				spin: 2,
    				inverse: 3,
    				pulse: 4,
    				flip: 5,
    				label: 6,
    				self: 0,
    				style: 13
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[11] === undefined && !("data" in props)) {
    			console_1$1.warn("<Icon> was created without expected prop 'data'");
    		}
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spin() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spin(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pulse() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pulse(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get self() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var close = { close: { width: 1408, height: 1792, paths: [{ d: 'M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z' }] } };

    var gear = { gear: { width: 1536, height: 1792, paths: [{ d: 'M1024 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zM1536 787v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z' }] } };

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    const newSettings = new Settings(30,50,0.06,0.254,0.95,0.50,1.01, true);

    let getSettings = () =>{

        function toSettingsType(storageValue) {
            // todo: trovare un metodo più belllo
            return new Settings(
                storageValue['_bikeWeight'],
                storageValue['_riderWeight'],
                storageValue['_wheelsInertia'],
                storageValue['_wheelsRadius'],
                storageValue['_efficiency'],
                storageValue['_area'],
                storageValue['_rho'],
                storageValue['_debugMode']
                );
        }

        const storageValue = localStorage.getItem("settings");
        return storageValue===null ? newSettings: toSettingsType(JSON.parse(storageValue));
    };
    let saveSettings = value => localStorage.setItem("settings", JSON.stringify(value));

    /* src/SettingsComponent.svelte generated by Svelte v3.24.0 */
    const file$5 = "src/SettingsComponent.svelte";

    // (26:0) {#if show}
    function create_if_block$2(ctx) {
    	let nav;
    	let div;
    	let label0;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let input1;
    	let t9;
    	let label2;
    	let t10;
    	let t11;
    	let t12;
    	let input2;
    	let t13;
    	let label3;
    	let t14;
    	let t15;
    	let t16;
    	let input3;
    	let t17;
    	let label4;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let input4;
    	let t22;
    	let label5;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let input5;
    	let t27;
    	let label6;
    	let t28;
    	let t29;
    	let t30;
    	let input6;
    	let t31;
    	let label7;
    	let t33;
    	let input7;
    	let t34;
    	let button;
    	let nav_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			label0 = element("label");
    			t0 = text("Bike weight: ");
    			t1 = text(/*bikeWeight*/ ctx[1]);
    			t2 = text("kg");
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			t5 = text("Rider weight: ");
    			t6 = text(/*riderWeight*/ ctx[2]);
    			t7 = text("kg");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			label2 = element("label");
    			t10 = text("Wheels Inertia: ");
    			t11 = text(/*wheelsInertia*/ ctx[3]);
    			t12 = space();
    			input2 = element("input");
    			t13 = space();
    			label3 = element("label");
    			t14 = text("Efficiency: ");
    			t15 = text(/*efficiency*/ ctx[5]);
    			t16 = space();
    			input3 = element("input");
    			t17 = space();
    			label4 = element("label");
    			t18 = text("Wheels Radius: ");
    			t19 = text(/*wheelsRadius*/ ctx[4]);
    			t20 = text("m");
    			t21 = space();
    			input4 = element("input");
    			t22 = space();
    			label5 = element("label");
    			t23 = text("Area: ");
    			t24 = text(/*area*/ ctx[6]);
    			t25 = text("m²");
    			t26 = space();
    			input5 = element("input");
    			t27 = space();
    			label6 = element("label");
    			t28 = text("Air Density: ");
    			t29 = text(/*rho*/ ctx[7]);
    			t30 = space();
    			input6 = element("input");
    			t31 = space();
    			label7 = element("label");
    			label7.textContent = "Debug:";
    			t33 = space();
    			input7 = element("input");
    			t34 = space();
    			button = element("button");
    			button.textContent = "Save";
    			attr_dev(label0, "for", "bike_weight");
    			add_location(label0, file$5, 28, 12, 1024);
    			attr_dev(input0, "class", "slider svelte-9a2cwo");
    			attr_dev(input0, "id", "bike_weight");
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "1");
    			attr_dev(input0, "max", "200");
    			add_location(input0, file$5, 29, 12, 1097);
    			attr_dev(label1, "for", "rider_weight");
    			add_location(label1, file$5, 30, 12, 1204);
    			attr_dev(input1, "class", "slider svelte-9a2cwo");
    			attr_dev(input1, "id", "rider_weight");
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "step", "0.5");
    			attr_dev(input1, "min", "40");
    			attr_dev(input1, "max", "100");
    			add_location(input1, file$5, 31, 12, 1280);
    			attr_dev(label2, "for", "wheels_inertia");
    			add_location(label2, file$5, 32, 12, 1401);
    			attr_dev(input2, "class", "slider svelte-9a2cwo");
    			attr_dev(input2, "id", "wheels_inertia");
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "step", "0.001");
    			attr_dev(input2, "min", "0.001");
    			attr_dev(input2, "max", "0.1");
    			add_location(input2, file$5, 33, 12, 1481);
    			attr_dev(label3, "for", "efficiency");
    			add_location(label3, file$5, 34, 12, 1611);
    			attr_dev(input3, "class", "slider svelte-9a2cwo");
    			attr_dev(input3, "id", "efficiency");
    			attr_dev(input3, "type", "range");
    			attr_dev(input3, "step", "0.01");
    			attr_dev(input3, "min", "0.8");
    			attr_dev(input3, "max", "1");
    			add_location(input3, file$5, 35, 12, 1680);
    			attr_dev(label4, "for", "wheels_radius");
    			add_location(label4, file$5, 36, 12, 1798);
    			attr_dev(input4, "class", "slider svelte-9a2cwo");
    			attr_dev(input4, "id", "wheels_radius");
    			attr_dev(input4, "type", "range");
    			attr_dev(input4, "step", "0.00001");
    			attr_dev(input4, "min", "0.1");
    			attr_dev(input4, "max", "0.4");
    			add_location(input4, file$5, 37, 12, 1876);
    			attr_dev(label5, "for", "area");
    			add_location(label5, file$5, 38, 12, 2004);
    			attr_dev(input5, "class", "slider svelte-9a2cwo");
    			attr_dev(input5, "id", "area");
    			attr_dev(input5, "type", "range");
    			attr_dev(input5, "step", "0.00001");
    			attr_dev(input5, "min", "0");
    			attr_dev(input5, "max", "2");
    			add_location(input5, file$5, 39, 12, 2057);
    			attr_dev(label6, "for", "air_density");
    			add_location(label6, file$5, 40, 12, 2164);
    			attr_dev(input6, "class", "slider svelte-9a2cwo");
    			attr_dev(input6, "id", "air_density");
    			attr_dev(input6, "type", "range");
    			attr_dev(input6, "step", "0.0001");
    			attr_dev(input6, "min", "0.8");
    			attr_dev(input6, "max", "1.2");
    			add_location(input6, file$5, 41, 12, 2228);
    			attr_dev(label7, "class", "checkbox svelte-9a2cwo");
    			attr_dev(label7, "for", "debug");
    			add_location(label7, file$5, 42, 12, 2344);
    			attr_dev(input7, "class", "checkbox svelte-9a2cwo");
    			attr_dev(input7, "id", "debug");
    			attr_dev(input7, "type", "checkbox");
    			add_location(input7, file$5, 43, 12, 2409);
    			attr_dev(div, "class", "sliders_div svelte-9a2cwo");
    			add_location(div, file$5, 27, 8, 986);
    			attr_dev(button, "class", "svelte-9a2cwo");
    			add_location(button, file$5, 45, 8, 2509);
    			attr_dev(nav, "class", "svelte-9a2cwo");
    			add_location(nav, file$5, 26, 4, 934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, label0);
    			append_dev(label0, t0);
    			append_dev(label0, t1);
    			append_dev(label0, t2);
    			append_dev(div, t3);
    			append_dev(div, input0);
    			set_input_value(input0, /*bikeWeight*/ ctx[1]);
    			append_dev(div, t4);
    			append_dev(div, label1);
    			append_dev(label1, t5);
    			append_dev(label1, t6);
    			append_dev(label1, t7);
    			append_dev(div, t8);
    			append_dev(div, input1);
    			set_input_value(input1, /*riderWeight*/ ctx[2]);
    			append_dev(div, t9);
    			append_dev(div, label2);
    			append_dev(label2, t10);
    			append_dev(label2, t11);
    			append_dev(div, t12);
    			append_dev(div, input2);
    			set_input_value(input2, /*wheelsInertia*/ ctx[3]);
    			append_dev(div, t13);
    			append_dev(div, label3);
    			append_dev(label3, t14);
    			append_dev(label3, t15);
    			append_dev(div, t16);
    			append_dev(div, input3);
    			set_input_value(input3, /*efficiency*/ ctx[5]);
    			append_dev(div, t17);
    			append_dev(div, label4);
    			append_dev(label4, t18);
    			append_dev(label4, t19);
    			append_dev(label4, t20);
    			append_dev(div, t21);
    			append_dev(div, input4);
    			set_input_value(input4, /*wheelsRadius*/ ctx[4]);
    			append_dev(div, t22);
    			append_dev(div, label5);
    			append_dev(label5, t23);
    			append_dev(label5, t24);
    			append_dev(label5, t25);
    			append_dev(div, t26);
    			append_dev(div, input5);
    			set_input_value(input5, /*area*/ ctx[6]);
    			append_dev(div, t27);
    			append_dev(div, label6);
    			append_dev(label6, t28);
    			append_dev(label6, t29);
    			append_dev(div, t30);
    			append_dev(div, input6);
    			set_input_value(input6, /*rho*/ ctx[7]);
    			append_dev(div, t31);
    			append_dev(div, label7);
    			append_dev(div, t33);
    			append_dev(div, input7);
    			input7.checked = /*debugMode*/ ctx[8];
    			append_dev(nav, t34);
    			append_dev(nav, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[10]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[10]),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[11]),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[12]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[12]),
    					listen_dev(input3, "change", /*input3_change_input_handler*/ ctx[13]),
    					listen_dev(input3, "input", /*input3_change_input_handler*/ ctx[13]),
    					listen_dev(input4, "change", /*input4_change_input_handler*/ ctx[14]),
    					listen_dev(input4, "input", /*input4_change_input_handler*/ ctx[14]),
    					listen_dev(input5, "change", /*input5_change_input_handler*/ ctx[15]),
    					listen_dev(input5, "input", /*input5_change_input_handler*/ ctx[15]),
    					listen_dev(input6, "change", /*input6_change_input_handler*/ ctx[16]),
    					listen_dev(input6, "input", /*input6_change_input_handler*/ ctx[16]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[17]),
    					listen_dev(button, "click", /*save*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*bikeWeight*/ 2) set_data_dev(t1, /*bikeWeight*/ ctx[1]);

    			if (dirty & /*bikeWeight*/ 2) {
    				set_input_value(input0, /*bikeWeight*/ ctx[1]);
    			}

    			if (!current || dirty & /*riderWeight*/ 4) set_data_dev(t6, /*riderWeight*/ ctx[2]);

    			if (dirty & /*riderWeight*/ 4) {
    				set_input_value(input1, /*riderWeight*/ ctx[2]);
    			}

    			if (!current || dirty & /*wheelsInertia*/ 8) set_data_dev(t11, /*wheelsInertia*/ ctx[3]);

    			if (dirty & /*wheelsInertia*/ 8) {
    				set_input_value(input2, /*wheelsInertia*/ ctx[3]);
    			}

    			if (!current || dirty & /*efficiency*/ 32) set_data_dev(t15, /*efficiency*/ ctx[5]);

    			if (dirty & /*efficiency*/ 32) {
    				set_input_value(input3, /*efficiency*/ ctx[5]);
    			}

    			if (!current || dirty & /*wheelsRadius*/ 16) set_data_dev(t19, /*wheelsRadius*/ ctx[4]);

    			if (dirty & /*wheelsRadius*/ 16) {
    				set_input_value(input4, /*wheelsRadius*/ ctx[4]);
    			}

    			if (!current || dirty & /*area*/ 64) set_data_dev(t24, /*area*/ ctx[6]);

    			if (dirty & /*area*/ 64) {
    				set_input_value(input5, /*area*/ ctx[6]);
    			}

    			if (!current || dirty & /*rho*/ 128) set_data_dev(t29, /*rho*/ ctx[7]);

    			if (dirty & /*rho*/ 128) {
    				set_input_value(input6, /*rho*/ ctx[7]);
    			}

    			if (dirty & /*debugMode*/ 256) {
    				input7.checked = /*debugMode*/ ctx[8];
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!nav_transition) nav_transition = create_bidirectional_transition(nav, fly, { x: 250, opacity: 1 }, true);
    				nav_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!nav_transition) nav_transition = create_bidirectional_transition(nav, fly, { x: 250, opacity: 1 }, false);
    			nav_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (detaching && nav_transition) nav_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(26:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { show = false } = $$props;
    	let settings_value;

    	let bikeWeight,
    		riderWeight,
    		wheelsInertia,
    		wheelsRadius,
    		efficiency,
    		area,
    		rho,
    		debugMode;

    	onMount(() => {
    		settings_value = getSettings();
    		$$invalidate(1, bikeWeight = settings_value.bikeWeight);
    		$$invalidate(2, riderWeight = settings_value.riderWeight);
    		$$invalidate(3, wheelsInertia = settings_value.wheelsInertia);
    		$$invalidate(4, wheelsRadius = settings_value.wheelsRadius);
    		$$invalidate(5, efficiency = settings_value.efficiency);
    		$$invalidate(6, area = settings_value.area);
    		$$invalidate(7, rho = settings_value.rho);
    		$$invalidate(8, debugMode = settings_value.debugMode);
    	});

    	function save() {
    		saveSettings(new Settings(bikeWeight, riderWeight, wheelsInertia, wheelsRadius, efficiency, area, rho, debugMode));
    		$$invalidate(0, show = false);
    	}

    	const writable_props = ["show"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SettingsComponent> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SettingsComponent", $$slots, []);

    	function input0_change_input_handler() {
    		bikeWeight = to_number(this.value);
    		$$invalidate(1, bikeWeight);
    	}

    	function input1_change_input_handler() {
    		riderWeight = to_number(this.value);
    		$$invalidate(2, riderWeight);
    	}

    	function input2_change_input_handler() {
    		wheelsInertia = to_number(this.value);
    		$$invalidate(3, wheelsInertia);
    	}

    	function input3_change_input_handler() {
    		efficiency = to_number(this.value);
    		$$invalidate(5, efficiency);
    	}

    	function input4_change_input_handler() {
    		wheelsRadius = to_number(this.value);
    		$$invalidate(4, wheelsRadius);
    	}

    	function input5_change_input_handler() {
    		area = to_number(this.value);
    		$$invalidate(6, area);
    	}

    	function input6_change_input_handler() {
    		rho = to_number(this.value);
    		$$invalidate(7, rho);
    	}

    	function input7_change_handler() {
    		debugMode = this.checked;
    		$$invalidate(8, debugMode);
    	}

    	$$self.$set = $$props => {
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		Settings,
    		onMount,
    		saveSettings,
    		getSettings,
    		get: get_store_value,
    		show,
    		settings_value,
    		bikeWeight,
    		riderWeight,
    		wheelsInertia,
    		wheelsRadius,
    		efficiency,
    		area,
    		rho,
    		debugMode,
    		save
    	});

    	$$self.$inject_state = $$props => {
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    		if ("settings_value" in $$props) settings_value = $$props.settings_value;
    		if ("bikeWeight" in $$props) $$invalidate(1, bikeWeight = $$props.bikeWeight);
    		if ("riderWeight" in $$props) $$invalidate(2, riderWeight = $$props.riderWeight);
    		if ("wheelsInertia" in $$props) $$invalidate(3, wheelsInertia = $$props.wheelsInertia);
    		if ("wheelsRadius" in $$props) $$invalidate(4, wheelsRadius = $$props.wheelsRadius);
    		if ("efficiency" in $$props) $$invalidate(5, efficiency = $$props.efficiency);
    		if ("area" in $$props) $$invalidate(6, area = $$props.area);
    		if ("rho" in $$props) $$invalidate(7, rho = $$props.rho);
    		if ("debugMode" in $$props) $$invalidate(8, debugMode = $$props.debugMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		show,
    		bikeWeight,
    		riderWeight,
    		wheelsInertia,
    		wheelsRadius,
    		efficiency,
    		area,
    		rho,
    		debugMode,
    		save,
    		input0_change_input_handler,
    		input1_change_input_handler,
    		input2_change_input_handler,
    		input3_change_input_handler,
    		input4_change_input_handler,
    		input5_change_input_handler,
    		input6_change_input_handler,
    		input7_change_handler
    	];
    }

    class SettingsComponent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { show: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingsComponent",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get show() {
    		throw new Error("<SettingsComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<SettingsComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Welcome.svelte generated by Svelte v3.24.0 */
    const file$6 = "src/Welcome.svelte";

    function create_fragment$7(ctx) {
    	let settingscomponent;
    	let updating_show;
    	let t0;
    	let section;
    	let h1;
    	let t2;
    	let span;
    	let icon;
    	let t3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function settingscomponent_show_binding(value) {
    		/*settingscomponent_show_binding*/ ctx[2].call(null, value);
    	}

    	let settingscomponent_props = {};

    	if (/*sidebar_show*/ ctx[0] !== void 0) {
    		settingscomponent_props.show = /*sidebar_show*/ ctx[0];
    	}

    	settingscomponent = new SettingsComponent({
    			props: settingscomponent_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(settingscomponent, "show", settingscomponent_show_binding));

    	icon = new Icon({
    			props: {
    				class: "top-right-fixed",
    				data: gear,
    				scale: "2"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(settingscomponent.$$.fragment);
    			t0 = space();
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Taurus Simulator";
    			t2 = space();
    			span = element("span");
    			create_component(icon.$$.fragment);
    			t3 = space();
    			button = element("button");
    			button.textContent = "Start";
    			attr_dev(h1, "class", "svelte-19jxrlq");
    			add_location(h1, file$6, 19, 4, 578);
    			attr_dev(span, "class", "top-right-fixed click_t svelte-19jxrlq");
    			add_location(span, file$6, 20, 4, 608);
    			attr_dev(button, "class", "btn svelte-19jxrlq");
    			add_location(button, file$6, 21, 4, 757);
    			attr_dev(section, "class", "svelte-19jxrlq");
    			add_location(section, file$6, 18, 0, 564);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(settingscomponent, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t2);
    			append_dev(section, span);
    			mount_component(icon, span, null);
    			append_dev(section, t3);
    			append_dev(section, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button, "click", /*startMessage*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const settingscomponent_changes = {};

    			if (!updating_show && dirty & /*sidebar_show*/ 1) {
    				updating_show = true;
    				settingscomponent_changes.show = /*sidebar_show*/ ctx[0];
    				add_flush_callback(() => updating_show = false);
    			}

    			settingscomponent.$set(settingscomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settingscomponent.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settingscomponent.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settingscomponent, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function openSettings() {
    	alert("Sono una persona pigra, le impostazioni al momento sono hard coded.");
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let sidebar_show = false;

    	function startMessage() {
    		dispatch("message", { text: "start" });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Welcome> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Welcome", $$slots, []);

    	function settingscomponent_show_binding(value) {
    		sidebar_show = value;
    		$$invalidate(0, sidebar_show);
    	}

    	const click_handler = () => $$invalidate(0, sidebar_show = !sidebar_show);

    	$$self.$capture_state = () => ({
    		Icon,
    		gear,
    		createEventDispatcher,
    		SettingsComponent,
    		Settings,
    		dispatch,
    		sidebar_show,
    		startMessage,
    		openSettings
    	});

    	$$self.$inject_state = $$props => {
    		if ("sidebar_show" in $$props) $$invalidate(0, sidebar_show = $$props.sidebar_show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sidebar_show, startMessage, settingscomponent_show_binding, click_handler];
    }

    class Welcome extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Welcome",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */

    const { console: console_1$2 } = globals;
    const file$7 = "src/App.svelte";

    // (42:1) {:else}
    function create_else_block$1(ctx) {
    	let welcome;
    	let t;
    	let show_if = getSettings().debugMode;
    	let if_block_anchor;
    	let current;
    	welcome = new Welcome({ $$inline: true });
    	welcome.$on("message", /*startSimulation*/ ctx[3]);
    	let if_block = show_if && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(welcome.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(welcome, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (show_if) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(welcome.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(welcome.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(welcome, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(42:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:1) {#if simulation_started}
    function create_if_block$3(ctx) {
    	let span;
    	let icon;
    	let t;
    	let simulator_1;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				class: "top-right-fixed",
    				data: close,
    				scale: "3"
    			},
    			$$inline: true
    		});

    	let simulator_1_props = {
    		width: /*getWidth*/ ctx[5](),
    		power: !isNaN(/*power*/ ctx[0]) ? /*power*/ ctx[0] : 0,
    		settings: getSettings()
    	};

    	simulator_1 = new Simulator({ props: simulator_1_props, $$inline: true });
    	/*simulator_1_binding*/ ctx[6](simulator_1);

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(icon.$$.fragment);
    			t = space();
    			create_component(simulator_1.$$.fragment);
    			attr_dev(span, "class", "top-right-fixed svelte-1m5bxql");
    			add_location(span, file$7, 39, 2, 1290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(icon, span, null);
    			insert_dev(target, t, anchor);
    			mount_component(simulator_1, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*exitSimulation*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const simulator_1_changes = {};
    			if (dirty & /*power*/ 1) simulator_1_changes.power = !isNaN(/*power*/ ctx[0]) ? /*power*/ ctx[0] : 0;
    			simulator_1.$set(simulator_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(simulator_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(simulator_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(icon);
    			if (detaching) detach_dev(t);
    			/*simulator_1_binding*/ ctx[6](null);
    			destroy_component(simulator_1, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(39:1) {#if simulation_started}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if getSettings().debugMode}
    function create_if_block_1$1(ctx) {
    	let div;
    	let label;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = text("Power Debug Slider: ");
    			t1 = text(/*power*/ ctx[0]);
    			t2 = text("W");
    			t3 = space();
    			input = element("input");
    			attr_dev(label, "id", "power_debug_label");
    			attr_dev(label, "for", "power_debug");
    			add_location(label, file$7, 45, 4, 1642);
    			attr_dev(input, "class", "slider svelte-1m5bxql");
    			attr_dev(input, "id", "power_debug");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "2000");
    			add_location(input, file$7, 46, 4, 1731);
    			attr_dev(div, "id", "power_debug_div");
    			attr_dev(div, "class", "svelte-1m5bxql");
    			add_location(div, file$7, 44, 3, 1611);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(div, t3);
    			append_dev(div, input);
    			set_input_value(input, /*power*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[7]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*power*/ 1) set_data_dev(t1, /*power*/ ctx[0]);

    			if (dirty & /*power*/ 1) {
    				set_input_value(input, /*power*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(44:2) {#if getSettings().debugMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*simulation_started*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1m5bxql");
    			add_location(main, file$7, 37, 0, 1255);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let electron = require("electron");
    	let electron_window = electron.remote.getCurrentWindow();
    	let power = 0;
    	let simulator;
    	let simulation_started = false;

    	// s.on('message', function(msg, rinfo) {
    	// 	console.log('I got this message: ' + msg.toString());
    	// 	power = parseInt(msg.toString());
    	// });
    	// s.bind(1336);
    	function startSimulation() {
    		$$invalidate(2, simulation_started = true);
    		window.document.body.classList.toggle("dark-mode");
    		electron_window.setFullScreen(true);
    		console.log(getWidth());
    		console.log(electron_window.getSize());
    	}

    	function exitSimulation() {
    		$$invalidate(2, simulation_started = false);
    		window.document.body.classList.toggle("dark-mode");
    		electron_window.setFullScreen(false);
    	}

    	function getWidth() {
    		if (electron_window.getSize()[0] / 1.666666 > electron_window.getSize()[1]) return electron_window.getSize()[1] * 1.666666;
    		return electron_window.getSize()[0];
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function simulator_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			simulator = $$value;
    			$$invalidate(1, simulator);
    		});
    	}

    	function input_change_input_handler() {
    		power = to_number(this.value);
    		$$invalidate(0, power);
    	}

    	$$self.$capture_state = () => ({
    		Simulator,
    		Settings,
    		Welcome,
    		Icon,
    		close,
    		getSettings,
    		electron,
    		electron_window,
    		power,
    		simulator,
    		simulation_started,
    		startSimulation,
    		exitSimulation,
    		getWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ("electron" in $$props) electron = $$props.electron;
    		if ("electron_window" in $$props) electron_window = $$props.electron_window;
    		if ("power" in $$props) $$invalidate(0, power = $$props.power);
    		if ("simulator" in $$props) $$invalidate(1, simulator = $$props.simulator);
    		if ("simulation_started" in $$props) $$invalidate(2, simulation_started = $$props.simulation_started);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		power,
    		simulator,
    		simulation_started,
    		startSimulation,
    		exitSimulation,
    		getWidth,
    		simulator_1_binding,
    		input_change_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
