import setup from './utilities/setup.js';
import Scene from './scens/scene.js';
import Pawn from './objects/pawn.js'

export default class GameManager {
    static state = {};

    constructor() {
        const {
            scene,
            renderer,
            camera
        } = setup();
        this.scene = scene
        this.renderer = renderer
        this.camera = camera
        this.clock = new THREE.Clock();

        this.scene.add(new Scene(this.scene));

        document.onmousedown = (event) => {
            this.onClick(event)
        }

        this.render();
        this.selected = null;
    }

    onClick(event) {
        if (!GameManager.getState("isYourTurn")) return;
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVector, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            if (intersects[0].object instanceof Pawn) {
                if (this.selected) {
                    this.selected.unClick();
                }
                this.selected = intersects[0].object;
                this.selected.onClick();
            }

        }
    }

    render() {
        const delta = this.clock.getDelta()
        this.scene.children.forEach((ele) => { try { ele._update(delta) } catch (e) { } });

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    static getState(name) {
        return GameManager.state[name]
    }

    static setState(name, value) {
        GameManager.state[name] = value
    }
}